// src/lib/data.ts
import type { RawMatch, Match, SiteData } from './types';
import { DATA_URL } from './config';
import { toSlug, getLeagueSlug, getSportSlug, getMatchSlug } from './slugs';
import { readFileSync } from 'fs';
import { join } from 'path';

// The actual JSON from rereyano_data.json uses a different shape:
// { events: [{ date, time, league, teams, channels }] }
interface RawEventJson {
  date: string;   // "DD-MM-YYYY"
  time: string;   // "HH:MM"
  league: string;
  teams: string;  // "Team1 - Team2"
  channels: Array<{ id: string | number; lang: string }>;
}

function hasValidTeams(team1Slug: string, team2Slug: string): boolean {
  return team1Slug.length > 0 && team2Slug.length > 0;
}

function normalizeRawEvent(raw: RawEventJson, index: number): Match | null {
  // Parse teams from "Team1 - Team2" format
  const dashIdx = raw.teams.indexOf(' - ');
  const team1 = dashIdx !== -1 ? raw.teams.slice(0, dashIdx).trim() : raw.teams;
  const team2 = dashIdx !== -1 ? raw.teams.slice(dashIdx + 3).trim() : '';

  // Convert date from DD-MM-YYYY to YYYY-MM-DD
  const dateParts = raw.date.split('-');
  const isoDate = dateParts.length === 3
    ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    : raw.date;

  const team1Slug = toSlug(team1);
  const team2Slug = toSlug(team2);

  if (!hasValidTeams(team1Slug, team2Slug)) {
    return null;
  }

  return {
    id: String(index),
    team1,
    team2,
    team1Slug,
    team2Slug,
    league: raw.league,
    leagueSlug: getLeagueSlug(raw.league),
    sportSlug: getSportSlug(raw.league),
    date: isoDate,
    timeUtc: raw.time,
    slug: getMatchSlug(team1, team2),
    channels: (raw.channels ?? []).map(c => ({ id: Number(c.id), lang: c.lang })),
  };
}

function normalizeMatch(raw: RawMatch): Match | null {
  const team1Slug = toSlug(raw.team1);
  const team2Slug = toSlug(raw.team2);

  if (!hasValidTeams(team1Slug, team2Slug)) {
    return null;
  }

  return {
    id: String(raw.id),
    team1: raw.team1,
    team2: raw.team2,
    team1Slug,
    team2Slug,
    league: raw.league,
    leagueSlug: getLeagueSlug(raw.league),
    sportSlug: getSportSlug(raw.league),
    date: raw.date,
    timeUtc: raw.time,
    slug: getMatchSlug(raw.team1, raw.team2),
    channels: raw.channels ?? [],
  };
}

function parseJsonToMatches(parsed: unknown): Match[] {
  // Handle { events: [...] } shape (rereyano_data.json format)
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && 'events' in parsed) {
    const events = (parsed as { events: RawEventJson[] }).events;
    if (Array.isArray(events)) {
      return events
        .map((e, i) => normalizeRawEvent(e, i))
        .filter((match): match is Match => match !== null);
    }
  }
  // Handle plain array of RawMatch
  if (Array.isArray(parsed)) {
    return (parsed as RawMatch[])
      .map(normalizeMatch)
      .filter((match): match is Match => match !== null);
  }
  return [];
}

export async function fetchSiteData(): Promise<SiteData> {
  let matches: Match[] = [];

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = await res.json();
    matches = parseJsonToMatches(parsed);
    if (matches.length === 0) throw new Error('Empty remote data');
  } catch {
    // Fallback to local copy
    try {
      const localPath = join(process.cwd(), '..', 'rereyano_data.json');
      const parsed = JSON.parse(readFileSync(localPath, 'utf-8'));
      matches = parseJsonToMatches(parsed);
    } catch {
      matches = [];
    }
  }

  // Deduplicate slugs — same two teams can appear twice (doubleheaders)
  const slugCounts: Record<string, number> = {};
  for (const match of matches) {
    slugCounts[match.slug] = (slugCounts[match.slug] ?? 0) + 1;
  }
  const slugSeen: Record<string, number> = {};
  for (const match of matches) {
    if (slugCounts[match.slug] > 1) {
      slugSeen[match.slug] = (slugSeen[match.slug] ?? 0) + 1;
      match.slug = `${match.slug}-${slugSeen[match.slug]}`;
    }
  }

  const byLeague: Record<string, Match[]> = {};
  const bySport: Record<string, Match[]> = {};
  const byTeam: Record<string, Match[]> = {};
  const bySlug: Record<string, Match> = {};

  for (const match of matches) {
    (byLeague[match.league] ??= []).push(match);
    (bySport[match.sportSlug] ??= []).push(match);
    (byTeam[match.team1Slug] ??= []).push(match);
    (byTeam[match.team2Slug] ??= []).push(match);
    bySlug[match.slug] = match;
  }

  return {
    matches,
    byLeague,
    bySport,
    byTeam,
    bySlug,
    buildDatetime: new Date().toISOString(),
  };
}
