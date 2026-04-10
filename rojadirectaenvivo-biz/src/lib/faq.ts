// src/lib/faq.ts
import { LANG_LABELS } from './config';
import type { Match } from './types';
import { getTimezoneMap } from './timezones';

export interface FaqItem {
  question: string;
  answer: string;
}

export function matchFaqItems(m: Match): FaqItem[] {
  const tzMap = getTimezoneMap(m.timeUtc);
  const channelList = m.channels.map(c => LANG_LABELS[c.lang] ?? c.lang).join(', ');
  const serverCount = 4; // always 4 servers per channel

  return [
    {
      question: `¿Dónde mirar ${m.team1} contra ${m.team2}?`,
      answer: `Ver ${m.team1} vs ${m.team2} en vivo gratis en RojaDirectaEnVivo.biz. El partido comienza a las ${m.timeUtc} UTC (${tzMap['Madrid']} hora Madrid, ${tzMap['CDMX']} hora México). Disponible en ${m.channels.length} canales.`,
    },
    {
      question: `¿A qué hora juega ${m.team1} hoy?`,
      answer: `${m.team1} juega a las ${tzMap['Madrid']} hora España (${tzMap['CDMX']} hora México, ${tzMap['Bogotá']} hora Colombia, ${tzMap['Buenos Aires']} hora Argentina) contra ${m.team2} por ${m.league}.`,
    },
    {
      question: `¿En qué canal se transmite ${m.team1} vs ${m.team2}?`,
      answer: `El partido se transmite en ${channelList || 'multiples canales'}. Ver gratis con ${serverCount} servidores en RojaDirectaEnVivo.`,
    },
  ];
}

export function hubFaqItems(leagueOrSport: string, matches: Match[]): FaqItem[] {
  const first3 = matches.slice(0, 3).map(m => `${m.team1} vs ${m.team2}`).join(', ');
  const matchList = matches.slice(0, 5).map(m => `${m.team1} vs ${m.team2} a las ${m.timeUtc}`).join(', ');

  return [
    {
      question: `¿Dónde ver ${leagueOrSport} en vivo?`,
      answer: `Ver ${leagueOrSport} en vivo gratis en RojaDirectaEnVivo.biz. Hoy hay ${matches.length} partidos disponibles: ${first3 || 'varios partidos'}.`,
    },
    {
      question: `¿Qué partidos hay hoy de ${leagueOrSport}?`,
      answer: `Hoy hay ${matches.length} partidos de ${leagueOrSport}: ${matchList || 'varios partidos'}. Todos disponibles en directo gratis.`,
    },
  ];
}

export function faqPageSchema(items: FaqItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
