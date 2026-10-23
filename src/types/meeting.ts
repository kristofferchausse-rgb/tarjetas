export interface MeetingActionItem {
  id: string;
  task: string;
  assignee: string; // e.g., 'Sara Zea' | 'Cliente / Prospecto'
  dueDate?: string;
  completed: boolean;
}

export type DealTemperature = 'caliente' | 'tibio' | 'informativo';

export type MeetingCategory = 'reunion_presencial' | 'audio_nota' | 'llamada_telefonica';

export interface MeetingRecording {
  id: string;
  publicId: string;
  leadId?: string; // Optional foreign key to CapturedLead.id
  leadName?: string;
  leadCompany?: string;
  title: string;
  timestamp: string; // ISO format
  durationSeconds: number;
  audioUrl?: string; // URL or data blob URI for playback
  transcript: string;
  summary: string[];
  painPoints?: string[];
  actionItems: MeetingActionItem[];
  budgetMentioned?: string;
  dealTemperature: DealTemperature;
  category: MeetingCategory;
  notes?: string;
}

export interface ProfileFeatures {
  hasMiniCrm: boolean; // Control toggle for CRM
  hasMeetingIntelligence: boolean; // Control toggle for AI Meeting intelligence
  aiMinutesQuota: number; // Monthly quota (e.g., 60, 120, 240, 500)
  aiMinutesUsed: number; // Consumed minutes this billing period
}
