// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { fetchSiteData } from '../lib/data';
import { SITE_URL } from '../lib/config';
import { LEAGUE_SLUG_MAP } from '../lib/slugs';

export const GET: APIRoute = async () => {
  const data = await fetchSiteData();

  const staticPages = [
    { url: `${SITE_URL}/`, priority: '1.0', changefreq: 'hourly' },
    { url: `${SITE_URL}/tarjeta-roja/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/pirlo-tv/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/roja-directa-pirlo-tv/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/tarjeta-roja-pirlo-tv/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/futbol/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/mlb/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/beisbol/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/nba/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/nhl/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/motogp/`, priority: '0.8', changefreq: 'daily' },
    ...Object.values(LEAGUE_SLUG_MAP).map(slug => ({
      url: `${SITE_URL}/${slug}/`,
      priority: '0.8',
      changefreq: 'daily',
    })),
  ];

  const matchPages = data.matches.flatMap(m => [
    { url: `${SITE_URL}/partido/${m.slug}/`, priority: '0.6', changefreq: 'hourly', lastmod: data.buildDatetime },
    { url: `${SITE_URL}/ver/${m.slug}/`, priority: '0.4', changefreq: 'hourly', lastmod: data.buildDatetime },
    { url: `${SITE_URL}/en-vivo/${m.slug}/`, priority: '0.4', changefreq: 'hourly', lastmod: data.buildDatetime },
  ]);

  const teamPages = Object.keys(data.byTeam).map(slug => ({
    url: `${SITE_URL}/equipo/${slug}/`,
    priority: '0.5',
    changefreq: 'daily',
  }));

  const allPages = [...staticPages, ...matchPages, ...teamPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>${(p as any).lastmod ? `\n    <lastmod>${(p as any).lastmod.slice(0, 10)}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
