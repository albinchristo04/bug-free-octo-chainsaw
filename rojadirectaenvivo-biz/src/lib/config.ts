// src/lib/config.ts
export const PLAYER_BASE_URL = 'https://bolaloca.my/player';
export const DATA_URL = 'https://raw.githubusercontent.com/albinchristo04/arda/refs/heads/main/rereyano_data.json';
export const SITE_URL = 'https://rojadirectaenvivo.biz';
export const SITE_NAME = 'RojaDirectaEnVivo';
export const SITE_TAGLINE = 'Roja Directa · Tarjeta Roja TV · Pirlo TV';
export const INDEXNOW_KEY = import.meta.env.INDEXNOW_KEY ?? '';
export const REBUILD_INTERVAL_HOURS = 3;

export const LANG_LABELS: Record<string, string> = {
  es: 'Español',
  gb: 'Inglés',
  fr: 'Francés',
  it: 'Italiano',
  de: 'Alemán',
  us: 'Inglés (US)',
  pt: 'Portugués',
};
