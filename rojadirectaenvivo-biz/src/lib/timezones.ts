// src/lib/timezones.ts

interface TzEntry {
  label: string;
  iana: string;
}

const TZ_LIST: TzEntry[] = [
  { label: 'Madrid', iana: 'Europe/Madrid' },
  { label: 'ET', iana: 'America/New_York' },
  { label: 'CDMX', iana: 'America/Mexico_City' },
  { label: 'Bogotá', iana: 'America/Bogota' },
  { label: 'Buenos Aires', iana: 'America/Argentina/Buenos_Aires' },
  { label: 'Santiago', iana: 'America/Santiago' },
  { label: 'Lima', iana: 'America/Lima' },
];

function convertTz(utcTime: string, iana: string): string {
  const [h, m] = utcTime.split(':').map(Number);
  // Use today's date for the reference so the offset reflects current DST
  const today = new Date();
  const ref = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), h, m));
  return new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: iana,
  }).format(ref);
}

// Returns: "21:00 Madrid · 17:00 ET · 16:00 CDMX · ..."
export function getMatchTimezones(utcTime: string): string {
  return TZ_LIST.map(tz => `${convertTz(utcTime, tz.iana)} ${tz.label}`).join(' · ');
}

// Returns object for templating individual timezone values
export function getTimezoneMap(utcTime: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const tz of TZ_LIST) {
    result[tz.label] = convertTz(utcTime, tz.iana);
  }
  return result;
}
