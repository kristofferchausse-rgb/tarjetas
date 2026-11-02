import { CardStats, CapturedLead, LeadOutcome, LeadOutcomeType } from '../types/analytics';
import { getOutcomeTerminology } from './crmTerminology';

export interface CardActivitySummary {
  hasActivity: boolean;
  source: 'synthetic' | 'local' | 'none';
  directActionsCount: number;
  actionsPer100Views: string; // e.g. "150" or "—"
  views: number;
  qrScans: number;
  vcardDownloads: number;
  whatsappClicks: number;
  callClicks: number;
  emailClicks: number;
  calendarClicks: number;
  linkClicks: number;
  videoPlays: number;
  shares: number;
  lastActive: string;
}

export interface TitularOutcomesSummary {
  total: number;
  byType: Record<LeadOutcomeType, number>;
  leadsCount: number;
  isDemoScope: boolean;
}

/**
 * Checks whether any supported and displayed activity counter has registered events (> 0).
 * Includes calls, emails, calendar, video, shares, views, and clicks.
 */
export function hasCardActivity(stats?: CardStats | null): boolean {
  if (!stats) return false;
  return (
    (stats.views || 0) > 0 ||
    (stats.qrScans || 0) > 0 ||
    (stats.vcardDownloads || 0) > 0 ||
    (stats.whatsappClicks || 0) > 0 ||
    (stats.callClicks || 0) > 0 ||
    (stats.emailClicks || 0) > 0 ||
    (stats.calendarClicks || 0) > 0 ||
    (stats.linkClicks || 0) > 0 ||
    (stats.videoPlays || 0) > 0 ||
    (stats.shares || 0) > 0
  );
}

/**
 * Shared calculation of card activity summary.
 * Used by both UI (ClientStatsView) and automated test suites.
 */
export function calculateCardActivitySummary(
  stats?: CardStats | null,
  profilePublicId?: string
): CardActivitySummary {
  const hasActivity = hasCardActivity(stats);

  let source: 'synthetic' | 'local' | 'none' = 'none';
  if (hasActivity) {
    source = stats?.isSynthetic ? 'synthetic' : 'local';
  }

  const views = stats?.views || 0;
  const qrScans = stats?.qrScans || 0;
  const vcardDownloads = stats?.vcardDownloads || 0;
  const whatsappClicks = stats?.whatsappClicks || 0;
  const callClicks = stats?.callClicks || 0;
  const emailClicks = stats?.emailClicks || 0;
  const calendarClicks = stats?.calendarClicks || 0;
  const linkClicks = stats?.linkClicks || 0;
  const videoPlays = stats?.videoPlays || 0;
  const shares = stats?.shares || 0;
  const lastActive = stats?.lastActive || '';

  // Direct actions: vCard downloads + WhatsApp clicks + call clicks + email clicks + calendar clicks + link clicks
  // Notice: leadsCaptured is NOT added here to avoid mixing inventory with click events.
  const directActionsCount =
    vcardDownloads +
    whatsappClicks +
    callClicks +
    emailClicks +
    calendarClicks +
    linkClicks;

  // Acciones por cada 100 vistas: round((directActions / views) * 100), or "—" if views == 0
  const actionsPer100Views =
    views > 0
      ? ((directActionsCount / views) * 100).toFixed(0)
      : '—';

  return {
    hasActivity,
    source,
    directActionsCount,
    actionsPer100Views,
    views,
    qrScans,
    vcardDownloads,
    whatsappClicks,
    callClicks,
    emailClicks,
    calendarClicks,
    linkClicks,
    videoPlays,
    shares,
    lastActive
  };
}

/**
 * Shared calculation of titular registered outcomes.
 * Excludes isDemo leads when the profile is a real customer profile,
 * preventing demo mock leads from inflating real metrics.
 */
export function calculateTitularOutcomesSummary(
  leads: CapturedLead[],
  isDemoProfile: boolean
): TitularOutcomesSummary {
  // If not demo scope, only count non-demo leads
  const targetLeads = isDemoProfile ? leads : leads.filter((l) => !l.isDemo);
  const leadsWithOutcome = targetLeads.filter((l) => Boolean(l.outcome));

  const byType: Record<LeadOutcomeType, number> = {
    venta_confirmada: 0,
    cita_confirmada: 0,
    colaboracion_acordada: 0,
    solicitud_atendida: 0,
    otro: 0
  };

  leadsWithOutcome.forEach((l) => {
    if (l.outcome?.type && byType[l.outcome.type] !== undefined) {
      byType[l.outcome.type]++;
    } else if (l.outcome?.type) {
      byType.otro++;
    }
  });

  return {
    total: leadsWithOutcome.length,
    byType,
    leadsCount: targetLeads.length,
    isDemoScope: isDemoProfile
  };
}

/**
 * Formats the display label for an outcome:
 * If outcome.label is empty or missing, defaults to the archetype-adapted type name.
 * If custom label is present, displays adapted type name and custom description.
 */
export function formatOutcomeDisplayLabel(
  outcome?: LeadOutcome | null,
  professionalProfile?: string
): string {
  if (!outcome) return '';
  const term = getOutcomeTerminology(outcome.type, professionalProfile);
  const custom = outcome.label?.trim();
  if (!custom || custom === term.label) {
    return term.label;
  }
  return `${term.label} • ${custom}`;
}

