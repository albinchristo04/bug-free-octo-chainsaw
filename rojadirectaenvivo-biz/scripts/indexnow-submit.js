// scripts/indexnow-submit.js
import { readFileSync, writeFileSync, existsSync } from 'fs';

const SITE = 'https://rojadirectaenvivo.biz';
const KEY = process.env.INDEXNOW_KEY;
const SITEMAP_PATH = 'dist/sitemap.xml';
const PREV_PATH = '/tmp/sitemap-prev.xml';

if (!KEY) {
  console.log('No INDEXNOW_KEY set, skipping.');
  process.exit(0);
}

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
}

const current = readFileSync(SITEMAP_PATH, 'utf-8');
const currentUrls = extractUrls(current);

let newUrls = currentUrls;
if (existsSync(PREV_PATH)) {
  const prevUrls = new Set(extractUrls(readFileSync(PREV_PATH, 'utf-8')));
  newUrls = currentUrls.filter(u => !prevUrls.has(u));
}

writeFileSync(PREV_PATH, current);

if (newUrls.length === 0) {
  console.log('No new URLs to submit.');
  process.exit(0);
}

const payload = {
  host: 'rojadirectaenvivo.biz',
  key: KEY,
  keyLocation: `${SITE}/indexnow-key.txt`,
  urlList: newUrls.slice(0, 10000),
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

console.log(`IndexNow: ${res.status} — submitted ${newUrls.length} URLs`);
