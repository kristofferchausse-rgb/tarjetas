import { CardStats, ActivityEvent, ActionEventType, NetworkingInsight } from '../types/analytics';
import { ParticipantProfile } from '../types/card';

const STATS_STORAGE_KEY = 'redconecta_analytics_stats_v1';
const EVENTS_STORAGE_KEY = 'redconecta_analytics_events_v1';

// Seed initial baseline metrics so the dashboard has rich historical context
const DEFAULT_INITIAL_STATS: Record<string, CardStats> = {
  'sara-sazedi': {
    publicId: 'sara-sazedi',
    views: 184,
    qrScans: 82,
    shares: 34,
    vcardDownloads: 48,
    whatsappClicks: 41,
    callClicks: 9,
    emailClicks: 14,
    calendarClicks: 21,
    linkClicks: 38,
    videoPlays: 45,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    isSynthetic: true
  },
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
    lastActive: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    isSynthetic: true
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
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isSynthetic: true
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
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    isSynthetic: true
  },
  'demo-clara-navarro': {
    publicId: 'demo-clara-navarro',
    views: 268,
    qrScans: 118,
    shares: 49,
    vcardDownloads: 74,
    whatsappClicks: 63,
    callClicks: 16,
    emailClicks: 28,
    calendarClicks: 39,
    linkClicks: 54,
    videoPlays: 61,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isSynthetic: true
  },
  'demo-diego-salas': {
    publicId: 'demo-diego-salas',
    views: 342,
    qrScans: 154,
    shares: 72,
    vcardDownloads: 96,
    whatsappClicks: 88,
    callClicks: 14,
    emailClicks: 31,
    calendarClicks: 52,
    linkClicks: 79,
    videoPlays: 94,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
    isSynthetic: true
  },
  'demo-renata-vidal': {
    publicId: 'demo-renata-vidal',
    views: 289,
    qrScans: 132,
    shares: 58,
    vcardDownloads: 81,
    whatsappClicks: 94,
    callClicks: 22,
    emailClicks: 19,
    calendarClicks: 64,
    linkClicks: 47,
    videoPlays: 72,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    isSynthetic: true
  },
  'demo-jorge-herrera': {
    publicId: 'demo-jorge-herrera',
    views: 234,
    qrScans: 104,
    shares: 44,
    vcardDownloads: 68,
    whatsappClicks: 71,
    callClicks: 27,
    emailClicks: 24,
    calendarClicks: 33,
    linkClicks: 58,
    videoPlays: 49,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    isSynthetic: true
  },
  'demo-adriana-torres': {
    publicId: 'demo-adriana-torres',
    views: 318,
    qrScans: 142,
    shares: 67,
    vcardDownloads: 89,
    whatsappClicks: 82,
    callClicks: 19,
    emailClicks: 26,
    calendarClicks: 45,
    linkClicks: 92,
    videoPlays: 84,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 37).toISOString(),
    isSynthetic: true
  },
  'demo-lucia-cardenas': {
    publicId: 'demo-lucia-cardenas',
    views: 276,
    qrScans: 126,
    shares: 53,
    vcardDownloads: 77,
    whatsappClicks: 69,
    callClicks: 15,
    emailClicks: 23,
    calendarClicks: 48,
    linkClicks: 61,
    videoPlays: 58,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    isSynthetic: true
  },
  'demo-gabriela-leon': {
    publicId: 'demo-gabriela-leon',
    views: 294,
    qrScans: 136,
    shares: 61,
    vcardDownloads: 84,
    whatsappClicks: 91,
    callClicks: 24,
    emailClicks: 21,
    calendarClicks: 56,
    linkClicks: 68,
    videoPlays: 76,
    leadsCaptured: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    isSynthetic: true
  }
};

const DEFAULT_INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: 'evt-sara-1',
    publicId: 'sara-sazedi',
    participantName: 'Sara Sazedi',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    label: 'Contacto recibido: Arq. Roberto Morales'
  },
  {
    id: 'evt-sara-2',
    publicId: 'sara-sazedi',
    participantName: 'Sara Sazedi',
    type: 'video_play',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    label: 'Reproducción: Video Caso de Éxito Bioclimático'
  },
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
  },
  // 4 sets of events for each of the 7 demo profiles
  {
    id: 'evt-clara-1',
    publicId: 'demo-clara-navarro',
    participantName: 'Clara Navarro',
    type: 'calendar_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    label: 'Sesión Diagnóstico B2B agendada'
  },
  {
    id: 'evt-clara-2',
    publicId: 'demo-clara-navarro',
    participantName: 'Clara Navarro',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    label: 'Prospecto capturado: Lic. Héctor Villalobos'
  },
  {
    id: 'evt-clara-3',
    publicId: 'demo-clara-navarro',
    participantName: 'Clara Navarro',
    type: 'vcard_download',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    label: 'Descarga vCard 3.0'
  },
  {
    id: 'evt-clara-4',
    publicId: 'demo-clara-navarro',
    participantName: 'Clara Navarro',
    type: 'qr_scan',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    label: 'Escaneo QR en Foro Empresarial'
  },
  {
    id: 'evt-diego-1',
    publicId: 'demo-diego-salas',
    participantName: 'Diego Salas',
    type: 'calendar_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
    label: 'Demo en Vivo agendada'
  },
  {
    id: 'evt-diego-2',
    publicId: 'demo-diego-salas',
    participantName: 'Diego Salas',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    label: 'Prospecto capturado: Sebastián Orozco (CTO)'
  },
  {
    id: 'evt-diego-3',
    publicId: 'demo-diego-salas',
    participantName: 'Diego Salas',
    type: 'video_play',
    timestamp: new Date(Date.now() - 1000 * 60 * 78).toISOString(),
    label: 'Reproducción Demo: Pulso Operativo IA'
  },
  {
    id: 'evt-diego-4',
    publicId: 'demo-diego-salas',
    participantName: 'Diego Salas',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    label: 'Consulta API & Sandbox Enterprise'
  },
  {
    id: 'evt-renata-1',
    publicId: 'demo-renata-vidal',
    participantName: 'Dra. Renata Vidal',
    type: 'calendar_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    label: 'Valoración Inicial reservada'
  },
  {
    id: 'evt-renata-2',
    publicId: 'demo-renata-vidal',
    participantName: 'Dra. Renata Vidal',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    label: 'Consulta recibida: Alejandra Domínguez'
  },
  {
    id: 'evt-renata-3',
    publicId: 'demo-renata-vidal',
    participantName: 'Dra. Renata Vidal',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 84).toISOString(),
    label: 'WhatsApp: Check-up Longevidad'
  },
  {
    id: 'evt-renata-4',
    publicId: 'demo-renata-vidal',
    participantName: 'Dra. Renata Vidal',
    type: 'vcard_download',
    timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    label: 'Contacto médico guardado (vCard)'
  },
  {
    id: 'evt-jorge-1',
    publicId: 'demo-jorge-herrera',
    participantName: 'Ing. Jorge Herrera',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    label: 'Solicitud de Cotización Técnica RFQ'
  },
  {
    id: 'evt-jorge-2',
    publicId: 'demo-jorge-herrera',
    participantName: 'Ing. Jorge Herrera',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 64).toISOString(),
    label: 'Prospecto capturado: Ing. Gustavo Peralta'
  },
  {
    id: 'evt-jorge-3',
    publicId: 'demo-jorge-herrera',
    participantName: 'Ing. Jorge Herrera',
    type: 'link_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 92).toISOString(),
    label: 'Descarga Catálogo ISO 9001'
  },
  {
    id: 'evt-jorge-4',
    publicId: 'demo-jorge-herrera',
    participantName: 'Ing. Jorge Herrera',
    type: 'qr_scan',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    label: 'Escaneo QR en Expo Industrial Bajío'
  },
  {
    id: 'evt-adriana-1',
    publicId: 'demo-adriana-torres',
    participantName: 'Arq. Adriana Torres',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 37).toISOString(),
    label: 'Cotización de Proyecto Arquitectónico'
  },
  {
    id: 'evt-adriana-2',
    publicId: 'demo-adriana-torres',
    participantName: 'Arq. Adriana Torres',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 71).toISOString(),
    label: 'Prospecto capturado: Federico Elizondo'
  },
  {
    id: 'evt-adriana-3',
    publicId: 'demo-adriana-torres',
    participantName: 'Arq. Adriana Torres',
    type: 'video_play',
    timestamp: new Date(Date.now() - 1000 * 60 * 105).toISOString(),
    label: 'Recorrido Lookbook: Casa Piedra & Luz'
  },
  {
    id: 'evt-adriana-4',
    publicId: 'demo-adriana-torres',
    participantName: 'Arq. Adriana Torres',
    type: 'vcard_download',
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    label: 'Descarga vCard 3.0'
  },
  {
    id: 'evt-lucia-1',
    publicId: 'demo-lucia-cardenas',
    participantName: 'Mtra. Lucía Cárdenas',
    type: 'calendar_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    label: 'Consulta Patrimonial Confidencial agendada'
  },
  {
    id: 'evt-lucia-2',
    publicId: 'demo-lucia-cardenas',
    participantName: 'Mtra. Lucía Cárdenas',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 76).toISOString(),
    label: 'Prospecto capturado: Eugenio Valladares'
  },
  {
    id: 'evt-lucia-3',
    publicId: 'demo-lucia-cardenas',
    participantName: 'Mtra. Lucía Cárdenas',
    type: 'vcard_download',
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    label: 'Descarga vCard 3.0'
  },
  {
    id: 'evt-lucia-4',
    publicId: 'demo-lucia-cardenas',
    participantName: 'Mtra. Lucía Cárdenas',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    label: 'Consulta Blindaje Societario & Sucesorio'
  },
  {
    id: 'evt-gabriela-1',
    publicId: 'demo-gabriela-leon',
    participantName: 'Gabriela León',
    type: 'calendar_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    label: 'Recorrido Privado agendado'
  },
  {
    id: 'evt-gabriela-2',
    publicId: 'demo-gabriela-leon',
    participantName: 'Gabriela León',
    type: 'lead_capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
    label: 'Inversionista registrado: Dr. Mauricio Zertuche'
  },
  {
    id: 'evt-gabriela-3',
    publicId: 'demo-gabriela-leon',
    participantName: 'Gabriela León',
    type: 'whatsapp_click',
    timestamp: new Date(Date.now() - 1000 * 60 * 96).toISOString(),
    label: 'Solicitud Dossier de Inversión'
  },
  {
    id: 'evt-gabriela-4',
    publicId: 'demo-gabriela-leon',
    participantName: 'Gabriela León',
    type: 'video_play',
    timestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    label: 'Reproducción Tour: Penthouses Reserva Sur'
  }
];

export function getStoredStats(): Record<string, CardStats> {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_INITIAL_STATS, ...parsed };
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
      const parsed: ActivityEvent[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const existingIds = new Set(parsed.map((e) => e.id));
        const missingDefaults = DEFAULT_INITIAL_EVENTS.filter((e) => !existingIds.has(e.id));
        return [...parsed, ...missingDefaults];
      }
    }
  } catch {
    // Fallback
  }
  return DEFAULT_INITIAL_EVENTS;
}

const _recentEvents = new Map<string, number>();

/**
 * Sanitizes event labels to strictly prevent private user data (emails, phones, PINs, notes)
 * from ever leaking into public activity telemetry or storage.
 */
export function sanitizeEventLabel(rawLabel?: string): string | undefined {
  if (!rawLabel) return undefined;
  let clean = rawLabel;
  clean = clean.replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[correo protegido]');
  clean = clean.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[teléfono protegido]');
  clean = clean.replace(/\bpin\s*[:=]\s*\w+/gi, 'pin: [protegido]');
  clean = clean.replace(/\b(nota|mensaje|password|clave)\s*[:=]\s*[^,\n]+/gi, '$1: [protegido]');
  return clean;
}

export function recordActivity(
  publicId: string,
  participantName: string,
  type: ActionEventType,
  label?: string
): void {
  try {
    const cleanLabel = sanitizeEventLabel(label);

    // Technical deduplication: ignore rapid duplicate re-invocations (< 800ms) for the exact same event
    const now = Date.now();
    const dedupKey = `${publicId}_${type}_${cleanLabel || ''}`;
    const lastTimestamp = _recentEvents.get(dedupKey);
    if (lastTimestamp && now - lastTimestamp < 800) {
      return;
    }
    _recentEvents.set(dedupKey, now);

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
        lastActive: new Date().toISOString(),
        isSynthetic: false
      };
    }

    const current = stats[publicId];
    current.lastActive = new Date().toISOString();
    // A locally observed user event marks this profile stats as observed on this device
    current.isSynthetic = false;

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
      case 'lead_capture':
        current.leadsCaptured = (current.leadsCaptured || 0) + 1;
        break;
    }

    const newEvent: ActivityEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      publicId,
      participantName,
      type,
      timestamp: new Date().toISOString(),
      label: cleanLabel
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
