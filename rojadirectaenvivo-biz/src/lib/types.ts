// src/lib/types.ts

// Raw shape from rereyano_data.json
export interface RawChannel {
  id: number;
  lang: string;
}

export interface RawMatch {
  id: string | number;
  team1: string;
  team2: string;
  league: string;
  date: string;    // ISO date string e.g. "2026-04-09"
  time: string;    // "HH:MM" UTC
  channels: RawChannel[];
}

// Normalized match used throughout the site
export interface Match {
  id: string;
  team1: string;
  team2: string;
  team1Slug: string;
  team2Slug: string;
  league: string;
  leagueSlug: string;
  sportSlug: string;
  date: string;      // "2026-04-09"
  timeUtc: string;   // "21:00"
  slug: string;      // "new-york-yankees-vs-san-diego-padres"
  channels: RawChannel[];
}

export interface SiteData {
  matches: Match[];
  byLeague: Record<string, Match[]>;
  bySport: Record<string, Match[]>;
  byTeam: Record<string, Match[]>;
  bySlug: Record<string, Match>;
  buildDatetime: string; // ISO string
}
