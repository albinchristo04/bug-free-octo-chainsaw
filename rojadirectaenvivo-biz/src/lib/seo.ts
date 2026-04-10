// src/lib/seo.ts
import { SITE_URL, SITE_NAME } from './config';
import type { Match } from './types';

// Prevent </script> injection in JSON-LD blocks
export function safeJsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

// ── Title tags ──────────────────────────────────────────────────────────────

export function homeTitle(): string {
  return `Roja Directa En Vivo · Tarjeta Roja TV · Pirlo TV | ${SITE_NAME}`;
}

export function sportHubTitle(sport: string): string {
  const cap = sport.charAt(0).toUpperCase() + sport.slice(1);
  return `${cap} En Vivo Hoy - Ver ${cap} Gratis | ${SITE_NAME}`;
}

export function mlbTitle(): string {
  return `MLB En Vivo - Beisbol en Directo Gratis · Roja Directa MLB | ${SITE_NAME}`;
}

export function ligaMxTitle(): string {
  return `Liga MX En Vivo Hoy - Ver America, Chivas, Cruz Azul | ${SITE_NAME}`;
}

export function laLigaTitle(): string {
  return `La Liga En Vivo - Ver Real Madrid, Barcelona, Atletico | ${SITE_NAME}`;
}

export function leagueHubTitle(league: string): string {
  return `${league} En Vivo - Partidos Hoy Gratis | ${SITE_NAME}`;
}

export function matchTitle(m: Match): string {
  return `${m.team1} vs ${m.team2} En Vivo - ${m.league} · Dónde Ver | ${SITE_NAME}`;
}

export function teamTitle(team: string): string {
  return `${team} En Vivo - Proximos Partidos · Roja Directa | ${SITE_NAME}`;
}

export function tarjetaRojaTitle(): string {
  return `Tarjeta Roja TV En Vivo - Ver Partidos Gratis | ${SITE_NAME}`;
}

export function pirloTvTitle(): string {
  return `Pirlo TV En Vivo - Futbol y Deportes en Directo | ${SITE_NAME}`;
}

export function rojaDirecPirloTitle(): string {
  return `Roja Directa Pirlo TV En Vivo - Partidos Gratis | ${SITE_NAME}`;
}

// ── Meta descriptions ────────────────────────────────────────────────────────

export function homeMeta(): string {
  return 'Ver deportes en vivo gratis. Roja Directa · Tarjeta Roja TV · Pirlo TV. Futbol, MLB, NBA en directo hoy con multiples canales.';
}

export function matchMeta(m: Match, n: number): string {
  return `Ver ${m.team1} vs ${m.team2} en vivo hoy. ${m.league} — ${m.date} a las ${m.timeUtc}. ${n} canales disponibles. ¿Dónde mirar? Aqui gratis.`;
}

export function hubMeta(league: string, n: number): string {
  return `Ver ${league} en vivo. ${n} partidos hoy en directo gratis. Multiples canales en espanol, ingles y portugues.`;
}

export function tarjetaRojaMeta(n: number): string {
  return `Tarjeta Roja TV en vivo gratis. Ver futbol, beisbol, baloncesto en directo. ${n} partidos disponibles hoy.`;
}

export function pirloTvMeta(n: number): string {
  return `Pirlo TV en vivo. Ver futbol y deportes en directo gratis. ${n} partidos disponibles con multiples canales y servidores.`;
}

// ── JSON-LD Schema ────────────────────────────────────────────────────────────

export function websiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    alternateName: ['Roja Directa', 'Tarjeta Roja TV', 'Pirlo TV', 'RojaDirecta', 'Roja Dirécta'],
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function orgSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    alternateName: ['Roja Directa', 'Tarjeta Roja TV', 'Pirlo TV', 'RojaDirecta', 'Roja Dirécta'],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function sportsEventSchema(m: Match): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${m.team1} vs ${m.team2}`,
    startDate: `${m.date}T${m.timeUtc}:00Z`,
    location: { '@type': 'VirtualLocation', url: `${SITE_URL}/partido/${m.slug}/` },
    organizer: { '@type': 'SportsOrganization', name: m.league },
    competitor: [
      { '@type': 'SportsTeam', name: m.team1 },
      { '@type': 'SportsTeam', name: m.team2 },
    ],
  };
}

export function itemListSchema(league: string, matches: Match[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Partidos de ${league} en vivo`,
    numberOfItems: matches.length,
    itemListElement: matches.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/partido/${m.slug}/`,
    })),
  };
}
