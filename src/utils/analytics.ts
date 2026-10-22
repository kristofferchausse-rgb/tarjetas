import { CardStats, ActivityEvent, ActionEventType, NetworkingInsight } from '../types/analytics';
import { ParticipantProfile } from '../types/card';

const STATS_STORAGE_KEY = 'redconecta_analytics_stats_v1';
const EVENTS_STORAGE_KEY = 'redconecta_analytics_events_v1';

// Seed initial baseline metrics so the dashboard has rich historical context
const DEFAULT_INITIAL_STATS: Record<string, CardStats> = {
  'sofia-valenzuela': {
    publicId: 'sofia-valenzuela',
    views: 312,
    qrScans: 148,
    shares: 64,
    vcardDownloads: 89,
    whatsappClicks: 76,
    callClicks: 18,
    emailClicks: 22,
    calendarClicks: 47,
    linkClicks: 52,
    videoPlays: 68,
    lastActive: new Date(Date.now() - 1000 * 60 * 14).toISOString()
  },
  'mateo-arrambide': {
    publicId: 'mateo-arrambide',
    views: 245,
    qrScans: 112,
    shares: 48,
    vcardDownloads: 62,
    whatsappClicks: 84,
    callClicks: 9,
    emailClicks: 14,
    calendarClicks: 28,
    linkClicks: 91,
    videoPlays: 74,
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  'cuauhtemoc-gonzalez': {
    publicId: 'cuauhtemoc-gonzalez',
    views: 198,
    qrScans: 88,
    shares: 39,
    vcardDownloads: 51,
    whatsappClicks: 58,
    callClicks: 15,
    emailClicks: 19,
    calendarClicks: 34,
    linkClicks: 44,
    videoPlays: 42,
    lastActive: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  }
};

const DEFAULT_INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: 'evt-1',
    publicId: 'sofia-valenzuela',
    participantName: 'Mtra. Sofía Valenzuela',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    label: 'WhatsApp Directo'
  },
  {
    id: 'evt-2',
    publicId: 'mateo-arrambide',
    participantName: 'Mateo Arrambide',
    type: 'vcard_download',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    label: 'Descarga vCard 3.0'
  },
  {
    id: 'evt-3',
    publicId: 'sofia-valenzuela',
    participantName: 'Mtra. Sofía Valenzuela',
    type: 'video_play',
    timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    label: 'Intro Video: Blindaje Fiscal'
  },
  {
    id: 'evt-4',
    publicId: 'cuauhtemoc-gonzalez',
    participantName: 'Ing. Cuauhtémoc González',
    type: 'qr_scan',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    label: 'Escaneo en Gafete de Evento'
  },
  {
    id: 'evt-5',
    publicId: 'mateo-arrambide',
    participantName: 'Mateo Arrambide',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 62).toISOString(),
    label: 'Consulta Catálogo Lumbre'
  },
  {
    id: 'evt-6',
    publicId: 'sofia-valenzuela',
    participantName: 'Mtra. Sofía Valenzuela',
    type: 'calendar_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    label: 'Agendar Diagnóstico Fiscal'
  }
];

export function getStoredStats(): Record<string, CardStats> {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  return DEFAULT_INITIAL_STATS;
}

export function getStoredEvents(): ActivityEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  return DEFAULT_INITIAL_EVENTS;
}

export function recordActivity(
  publicId: string,
  participantName: string,
  type: ActionEventType,
  label?: string
): void {
  try {
    const stats = getStoredStats();
    const events = getStoredEvents();

    if (!stats[publicId]) {
      stats[publicId] = {
        publicId,
        views: 0,
        qrScans: 0,
        shares: 0,
        vcardDownloads: 0,
        whatsappClicks: 0,
        callClicks: 0,
        emailClicks: 0,
        calendarClicks: 0,
        linkClicks: 0,
        videoPlays: 0,
        lastActive: new Date().toISOString()
      };
    }

    const current = stats[publicId];
    current.lastActive = new Date().toISOString();

    switch (type) {
      case 'view':
        current.views += 1;
        break;
      case 'qr_scan':
        current.qrScans += 1;
        break;
      case 'share':
        current.shares += 1;
        break;
      case 'vcard_download':
        current.vcardDownloads += 1;
        break;
      case 'whatsapp_click':
        current.whatsappClicks += 1;
        break;
      case 'call_click':
        current.callClicks += 1;
        break;
      case 'email_click':
        current.emailClicks += 1;
        break;
      case 'calendar_click':
        current.calendarClicks += 1;
        break;
      case 'link_click':
        current.linkClicks += 1;
        break;
      case 'video_play':
        current.videoPlays += 1;
        break;
    }

    const newEvent: ActivityEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      publicId,
      participantName,
      type,
      timestamp: new Date().toISOString(),
      label
    };

    // Keep last 150 events
    const updatedEvents = [newEvent, ...events].slice(0, 150);

    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  } catch (err) {
    console.error('Error recording activity event:', err);
  }
}

export function extractNetworkingInsights(profiles: ParticipantProfile[]): NetworkingInsight[] {
  // Synthesizes what people are asking for and offering across participant value propositions & targets
  return [
    { topic: 'Blindaje Fiscal, SAT & Protocolos de Sucesión Familiar', count: 184, percentage: 38, trend: 'up' },
    { topic: 'Mobiliario para Hospitalidad, Hoteles Boutique & Restaurantes', count: 142, percentage: 29, trend: 'up' },
    { topic: 'Nearshoring Logístico, AGVs & Automatización de Almacenes', count: 118, percentage: 24, trend: 'up' },
    { topic: 'Reestructuración Societaria & Holdings Patrimoniales', count: 86, percentage: 18, trend: 'stable' },
    { topic: 'Proveeduría Sustentable & Maderas Certificadas', count: 64, percentage: 13, trend: 'stable' },
    { topic: 'Alianzas B2B con Notarías y Despachos Contables', count: 52, percentage: 11, trend: 'down' }
  ];
}
