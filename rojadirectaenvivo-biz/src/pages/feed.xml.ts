// src/pages/feed.xml.ts
import type { APIRoute } from 'astro';
import { fetchSiteData } from '../lib/data';
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from '../lib/config';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toRFC2822(isoDate: string, time: string): string {
  const dt = new Date(`${isoDate}T${time}:00Z`);
  return dt.toUTCString();
}

export const GET: APIRoute = async () => {
  const data = await fetchSiteData();
  const items = data.matches.map(m => `  <item>
    <title>${esc(m.team1)} vs ${esc(m.team2)} en Vivo — ${esc(m.league)}</title>
    <link>${SITE_URL}/partido/${m.slug}/</link>
    <guid>${SITE_URL}/partido/${m.slug}/</guid>
    <pubDate>${toRFC2822(m.date, m.timeUtc)}</pubDate>
    <description>Ver ${esc(m.team1)} vs ${esc(m.team2)} en vivo hoy. ${esc(m.league)} en directo gratis. ${m.channels.length} canales disponibles.</description>
  </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME} — ${SITE_TAGLINE}</title>
    <link>${SITE_URL}/</link>
    <description>Partidos en vivo hoy. Actualizado cada 3 horas.</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
