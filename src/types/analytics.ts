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
}

export interface CapturedLead {
  id: string;
  publicId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  message?: string;
  timestamp: string;
  status: 'nuevo' | 'contactado' | 'reunion' | 'cerrado';
  notes?: string;
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
