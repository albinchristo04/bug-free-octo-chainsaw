// src/lib/timezones.ts

interface TzEntry {
  label: string;
  offset: number; // hours relative to UTC
}

const TZ_OFFSETS: TzEntry[] = [
  { label: 'Madrid', offset: +2 },
  { label: 'ET', offset: -4 },
  { label: 'CDMX', offset: -5 },
  { label: 'Bogotá', offset: -5 },
  { label: 'Buenos Aires', offset: -3 },
  { label: 'Santiago', offset: -3 },
  { label: 'Lima', offset: -5 },
];

function addHours(timeHHMM: string, hours: number): string {
  const [h, m] = timeHHMM.split(':').map(Number);
  const totalMins = h * 60 + m + hours * 60;
  const wrapped = ((totalMins % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(wrapped / 60)).padStart(2, '0');
  const mm = String(wrapped % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

// Returns: "21:00 Madrid · 17:00 ET · 16:00 CDMX · ..."
export function getMatchTimezones(utcTime: string): string {
  return TZ_OFFSETS.map(tz => `${addHours(utcTime, tz.offset)} ${tz.label}`).join(' · ');
}

// Returns object for templating individual timezone values
export function getTimezoneMap(utcTime: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const tz of TZ_OFFSETS) {
    result[tz.label] = addHours(utcTime, tz.offset);
  }
  return result;
}
