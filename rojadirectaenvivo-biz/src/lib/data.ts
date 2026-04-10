// src/lib/data.ts
import type { RawMatch, Match, SiteData } from './types';
import { DATA_URL } from './config';
import { toSlug, getLeagueSlug, getSportSlug, getMatchSlug } from './slugs';
import { readFileSync } from 'fs';
import { join } from 'path';

function normalizeMatch(raw: RawMatch): Match {
  const team1Slug = toSlug(raw.team1);
  const team2Slug = toSlug(raw.team2);
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

export async function fetchSiteData(): Promise<SiteData> {
  let rawMatches: RawMatch[] = [];

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    rawMatches = await res.json();
  } catch {
    // Fallback to local copy
    try {
      const localPath = join(process.cwd(), '..', 'rereyano_data.json');
      rawMatches = JSON.parse(readFileSync(localPath, 'utf-8'));
    } catch {
      rawMatches = [];
    }
  }

  const matches = rawMatches.map(normalizeMatch);

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
