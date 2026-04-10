// src/lib/slugs.ts

// Remove accents, lowercase, replace non-alphanumeric with hyphens
export function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Manual league → URL slug mapping (SEO-optimized)
export const LEAGUE_SLUG_MAP: Record<string, string> = {
  'Ligue Des Champions': 'champions-league',
  'Copa Argentina': 'copa-argentina',
  'Ecuador Ligapro': 'liga-ecuador',
  'Concacaf Champions Cup': 'concacaf',
  'Liga MX': 'liga-mx',
  'La Liga': 'laliga',
  'Copa Libertadores': 'copa-libertadores',
  'Copa Sudamericana': 'copa-sudamericana',
  'NBA': 'nba',
  'NHL': 'nhl',
  'MLB': 'mlb',
  'MotoGP': 'motogp',
};

// League → sport slug
export const LEAGUE_SPORT_MAP: Record<string, string> = {
  'Ligue Des Champions': 'futbol',
  'Copa Argentina': 'futbol',
  'Ecuador Ligapro': 'futbol',
  'Concacaf Champions Cup': 'futbol',
  'Liga MX': 'futbol',
  'La Liga': 'futbol',
  'Copa Libertadores': 'futbol',
  'Copa Sudamericana': 'futbol',
  'NBA': 'nba',
  'NHL': 'nhl',
  'MLB': 'mlb',
  'MotoGP': 'motogp',
};

export function getLeagueSlug(league: string): string {
  return LEAGUE_SLUG_MAP[league] ?? toSlug(league);
}

export function getSportSlug(league: string): string {
  return LEAGUE_SPORT_MAP[league] ?? 'futbol';
}

export function getMatchSlug(team1: string, team2: string): string {
  return `${toSlug(team1)}-vs-${toSlug(team2)}`;
}
