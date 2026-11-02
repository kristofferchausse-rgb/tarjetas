export type ActionEventType =
  | 'view'
  | 'qr_scan'
  | 'share'
  | 'vcard_download'
  | 'whatsapp_click'
  | 'call_click'
  | 'email_click'
  | 'calendar_click'
  | 'link_click'
  | 'video_play'
  | 'lead_capture'
  | 'wallpaper_download'
  | 'signature_copy';

export interface CardStats {
  publicId: string;
  views: number;
  qrScans: number;
  shares: number;
  vcardDownloads: number;
  whatsappClicks: number;
  callClicks: number;
  emailClicks: number;
  calendarClicks: number;
  linkClicks: number;
  videoPlays: number;
  leadsCaptured?: number;
  lastActive: string;
  isSynthetic?: boolean;
}

export type LeadOutcomeType =
  | 'venta_confirmada'
  | 'cita_confirmada'
  | 'colaboracion_acordada'
  | 'solicitud_atendida'
  | 'otro';

export interface LeadOutcome {
  type: LeadOutcomeType;
  label?: string; // Título o descripción del hito registrado
  registeredAt: string; // Formato YYYY-MM-DD o ISO
  note?: string; // Observación breve opcional
}

export interface CapturedLead {
  id: string;
  publicId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  role?: string;
  message?: string;
  timestamp: string;
  status: 'nuevo' | 'contactado' | 'reunion' | 'cerrado' | 'descartado';
  notes?: string;

  // Contexto opcional de captura (UX 03)
  source?: 'general' | 'solution';
  solutionId?: string;
  solutionTitle?: string;

  // Estado de sincronización local/remota (distinto del pipeline comercial)
  syncStatus?: 'confirmed' | 'pending' | 'failed' | 'unverified';
  isDemo?: boolean;

  // Seguimiento UX 06: Próximo paso, tiempos y persistencia local
  nextAction?: string;
  nextActionDate?: string; // Formato YYYY-MM-DD para conservar el día de calendario local sin desvío UTC
  nextActionTime?: string; // Formato HH:MM opcional
  nextActionCompleted?: boolean;
  nextActionCompletedAt?: string;
  nextActionHistory?: Array<{
    action: string;
    date?: string;
    time?: string;
    completedAt: string;
  }>;
  localSavedAt?: string;

  // Medición de Resultados UX 07: Hitos explícitos registrados por el titular
  outcome?: LeadOutcome;
}

export interface ActivityEvent {
  id: string;
  publicId: string;
  participantName: string;
  type: ActionEventType;
  timestamp: string;
  label?: string;
}

export interface NetworkingInsight {
  topic: string;
  count: number;
  percentage: number;
  trend: 'up' | 'stable' | 'down';
}
