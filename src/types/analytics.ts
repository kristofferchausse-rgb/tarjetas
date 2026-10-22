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
  | 'video_play';

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
  lastActive: string;
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
