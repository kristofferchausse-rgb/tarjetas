import { ParticipantProfile, NetworkingTargetItem, CardSolution, PrimaryActionConfig, PrimaryActionType } from '../types/card';
import { parsePhoneNumber } from './phone';
import { CardLanguage } from './i18n';

/**
 * Normalizes a networking target whether it was stored as a legacy plain string
 * or as a structured NetworkingTargetItem (target, purpose, contribution).
 */
export function normalizeNetworkingTarget(item: string | NetworkingTargetItem): NetworkingTargetItem {
  if (typeof item === 'string') {
    return {
      target: item.trim(),
      purpose: undefined,
      contribution: undefined
    };
  }
  return {
    target: (item.target || '').trim(),
    purpose: item.purpose ? item.purpose.trim() : undefined,
    contribution: item.contribution ? item.contribution.trim() : undefined
  };
}

/**
 * Normalizes the full list of networking targets, ensuring max 3 entries.
 */
export function normalizeNetworkingTargets(
  targets: (string | NetworkingTargetItem)[] | undefined
): NetworkingTargetItem[] {
  if (!targets || !Array.isArray(targets)) return [];
  return targets
    .map(normalizeNetworkingTarget)
    .filter((t) => Boolean(t.target))
    .slice(0, 3);
}

/**
 * Checks if Solution 1 meets the publishing requirement for new profiles.
 * Solution 1 requires at least a non-empty title and either a description, problem, or solution.
 */
export function isSolution1Valid(solutions: CardSolution[] | undefined): boolean {
  if (!solutions || solutions.length === 0) return false;
  const s1 = solutions[0];
  if (!s1 || !s1.title || !s1.title.trim()) return false;
  return Boolean((s1.desc && s1.desc.trim()) || (s1.problem && s1.problem.trim()) || (s1.solution && s1.solution.trim()));
}

/**
 * Resolves the single source of truth for the calendar URL (general & medical),
 * ensuring proper https:// prefix.
 */
export function getEffectiveCalendarUrl(profile: Partial<ParticipantProfile>): string {
  const customCalendar =
    profile.primaryAction?.actionType === 'calendar' ? profile.primaryAction.customUrl : '';
  const raw = (profile.calendarUrl || profile.customFields?.bookingUrl || customCalendar || '').trim();
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  return `https://${raw}`;
}

/**
 * Centralized rule for physical location and map link visibility:
 * - 'remoto': always hides physical address and map links, even if showLocation is undefined.
 * - 'presencial' or 'hibrido': respects showLocation !== false and requires a valid destination.
 * - Profiles without locationMode: preserve legacy behavior (showLocation !== false).
 */
export function shouldShowPhysicalLocation(profile: Partial<ParticipantProfile>): boolean {
  if (profile.locationMode === 'remoto') {
    return false;
  }
  return profile.showLocation !== false;
}

const KNOWN_TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid'
]);

/**
 * Generates a normalized comparison key for deduplicating URLs:
 * - Preserves case in pathname, search params, and hash fragments (e.g. /archivo/AbC !== /archivo/abc).
 * - Preserves functional query params (e.g. ?producto=A !== ?producto=B).
 * - Strips only explicitly defined marketing tracking parameters (utm_*, fbclid, gclid).
 * - Preserves hash fragments (e.g. #requisitos !== #costos).
 * - Normalizes host case (RFC 3986 defines host as case-insensitive).
 * - Only normalizes trailing slash on root path (https://ejemplo.com/ === https://ejemplo.com).
 * - Does not assume equivalence between http and https or www and non-www.
 * - When in doubt, preserves distinction.
 */
export function normalizeUrlForComparison(rawUrl: string | undefined): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  try {
    if (trimmed.startsWith('tel:') || trimmed.startsWith('mailto:')) {
      return trimmed.toLowerCase();
    }

    const isRelative = trimmed.startsWith('/') || !trimmed.includes('://');
    const base = isRelative ? 'https://antigravity.internal' : undefined;
    const parsed = new URL(trimmed, base);

    // Clean tracking query parameters while preserving functional parameters
    const cleanedParams = new URLSearchParams();
    const sortedKeys = Array.from(parsed.searchParams.keys()).sort();
    for (const key of sortedKeys) {
      if (!KNOWN_TRACKING_PARAMS.has(key.toLowerCase())) {
        for (const val of parsed.searchParams.getAll(key)) {
          cleanedParams.append(key, val);
        }
      }
    }

    const searchStr = cleanedParams.toString() ? `?${cleanedParams.toString()}` : '';
    const hashStr = parsed.hash || '';

    if (isRelative) {
      const normPath = (parsed.pathname !== '/' && parsed.pathname.endsWith('/'))
        ? parsed.pathname.slice(0, -1)
        : parsed.pathname;
      return `${normPath}${searchStr}${hashStr}`;
    }

    const protocol = parsed.protocol.toLowerCase();
    const host = parsed.host.toLowerCase();
    let pathname = parsed.pathname;
    if (pathname === '/') {
      pathname = '';
    }

    return `${protocol}//${host}${pathname}${searchStr}${hashStr}`;
  } catch {
    return trimmed;
  }
}

/**
 * Filters and deduplicates links against the primary action, calendar, maps, website, and within themselves.
 * A resource is only deduplicated if the corresponding hero/primary action is actually rendered and enabled.
 */
export function getDeduplicatedLinks<T extends { label: string; url: string; icon?: string; category?: string }>(
  links: T[] | undefined,
  primaryResolved?: { href?: string; actionType?: string; enabled?: boolean; isValid?: boolean },
  profile?: Partial<ParticipantProfile>
): T[] {
  if (!links || !Array.isArray(links)) return [];

  const seenUrls = new Set<string>();

  // 1. Primary action: only deduplicate if rendered and enabled
  if (
    primaryResolved?.enabled &&
    primaryResolved?.isValid &&
    primaryResolved?.href &&
    primaryResolved.actionType !== 'phone' &&
    primaryResolved.actionType !== 'email'
  ) {
    const norm = normalizeUrlForComparison(primaryResolved.href);
    if (norm) seenUrls.add(norm);
  }

  // 2. Calendar link: only deduplicate if actually rendered in the UI
  const calendarLink = getEffectiveCalendarUrl(profile || {});
  const isPrimaryCalendar = Boolean(primaryResolved?.enabled && primaryResolved?.isValid && primaryResolved?.actionType === 'calendar');
  const isAltCalendar = Boolean(calendarLink) && primaryResolved?.actionType !== 'calendar';
  if ((isPrimaryCalendar || isAltCalendar) && calendarLink) {
    const norm = normalizeUrlForComparison(calendarLink);
    if (norm) seenUrls.add(norm);
  }

  // 3. Google Maps: only deduplicate if physical location and map link are actually rendered
  const showPhysical = profile ? shouldShowPhysicalLocation(profile) : true;
  const hasPhysicalAddress = Boolean(profile?.address && profile.address.trim());
  if (showPhysical && hasPhysicalAddress && profile?.googleMapsUrl) {
    const norm = normalizeUrlForComparison(profile.googleMapsUrl);
    if (norm) seenUrls.add(norm);
  }

  // 4. Official Website: only deduplicate if website button is actually rendered
  if (profile?.websiteUrl && profile.websiteUrl.trim()) {
    const norm = normalizeUrlForComparison(profile.websiteUrl);
    if (norm) seenUrls.add(norm);
  }

  const result: T[] = [];
  for (const link of links) {
    if (!link.url || !link.url.trim()) continue;
    const norm = normalizeUrlForComparison(link.url);
    if (!norm) continue;
    if (seenUrls.has(norm)) continue;
    seenUrls.add(norm);
    result.push(link);
  }

  return result;
}

/**
 * Strips private operator context and PIN before sending data to public consumers,
 * static HTML exports, vCards, or client-side public views.
 */
export function sanitizePublicProfile(profile: ParticipantProfile): Omit<ParticipantProfile, 'pin' | 'operatorContext'> {
  const { pin, operatorContext, ...publicProfile } = profile;
  return publicProfile;
}

/**
 * Resolves primary action destination & metadata.
 */
export interface ResolvedPrimaryAction {
  enabled: boolean;
  actionType: PrimaryActionType;
  label: string;
  sublabel?: string;
  href: string;
  isExternal: boolean;
  isValid: boolean;
  iconName: 'whatsapp' | 'calendar' | 'phone' | 'mail' | 'link' | 'share';
}

export function resolvePrimaryAction(
  profile: ParticipantProfile,
  t: { chatWhatsapp?: string; schedule?: string; call?: string; email?: string } = {},
  lang: CardLanguage = 'es',
  sampleTrans?: { primaryActionLabel?: string }
): ResolvedPrimaryAction {
  const cfg: PrimaryActionConfig = profile.primaryAction || { enabled: true, actionType: 'whatsapp' };
  const isExplicitlyDisabled = profile.primaryAction && profile.primaryAction.enabled === false;
  const enabled = !isExplicitlyDisabled;

  const parsedPhone = parsePhoneNumber(profile.phone);
  const calendarLink = getEffectiveCalendarUrl(profile);

  // Label resolution with customLabel / label compatibility:
  // "Si ambos están poblados y difieren, conserva inicialmente customLabel como intención procedente del editor"
  const hasCustomLabel = typeof cfg.customLabel === 'string' && cfg.customLabel.trim().length > 0;
  const hasLabel = typeof cfg.label === 'string' && cfg.label.trim().length > 0;
  let customText = '';
  if (hasCustomLabel && hasLabel && cfg.customLabel!.trim() !== cfg.label!.trim()) {
    customText = cfg.customLabel!.trim();
  } else if (hasCustomLabel) {
    customText = cfg.customLabel!.trim();
  } else if (hasLabel) {
    customText = cfg.label!.trim();
  }

  // Translation override if in EN and available
  if (lang === 'en' && sampleTrans?.primaryActionLabel) {
    customText = sampleTrans.primaryActionLabel;
  }

  const actionType: PrimaryActionType = cfg.actionType || 'whatsapp';

  switch (actionType) {
    case 'calendar': {
      const isValid = Boolean(calendarLink);
      const defaultLabel =
        profile.professionalProfile === 'salud'
          ? (lang === 'en' ? 'Book Medical Appointment' : 'Agendar Cita Médica')
          : (t.schedule || (lang === 'en' ? 'Schedule Appointment' : 'Agendar Cita'));

      return {
        enabled,
        actionType: 'calendar',
        label: customText || defaultLabel,
        sublabel: cfg.sublabel,
        href: isValid ? calendarLink : '',
        isExternal: true,
        isValid,
        iconName: 'calendar'
      };
    }
    case 'collaboration': {
      const trimmedUrl = (cfg.customUrl || '').trim();
      const isValid = Boolean(trimmedUrl);
      const href = isValid ? (trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`) : '';
      const defaultLabel = lang === 'en' ? 'Explore Collaboration' : 'Explorar Colaboración';

      return {
        enabled,
        actionType: 'collaboration',
        label: customText || defaultLabel,
        sublabel: cfg.sublabel,
        href,
        isExternal: true,
        isValid,
        iconName: 'link'
      };
    }
    case 'custom_link': {
      const trimmedUrl = (cfg.customUrl || '').trim();
      const isValid = Boolean(trimmedUrl);
      const href = isValid ? (trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`) : '';
      const defaultLabel = lang === 'en' ? 'Learn More' : 'Más Información';

      return {
        enabled,
        actionType: 'custom_link',
        label: customText || defaultLabel,
        sublabel: cfg.sublabel,
        href,
        isExternal: true,
        isValid,
        iconName: 'link'
      };
    }
    case 'phone': {
      const isValid = parsedPhone.isValid;
      const defaultLabel = t.call || (lang === 'en' ? 'Call' : 'Llamar por Teléfono');

      return {
        enabled,
        actionType: 'phone',
        label: customText || defaultLabel,
        sublabel: cfg.sublabel,
        href: isValid ? parsedPhone.telUri : '',
        isExternal: false,
        isValid,
        iconName: 'phone'
      };
    }
    case 'email': {
      const isValid = Boolean(profile.email && profile.email.includes('@'));
      const defaultLabel = t.email || (lang === 'en' ? 'Send Email' : 'Enviar Correo Electrónico');

      return {
        enabled,
        actionType: 'email',
        label: customText || defaultLabel,
        sublabel: cfg.sublabel,
        href: isValid ? `mailto:${profile.email.trim()}` : '',
        isExternal: false,
        isValid,
        iconName: 'mail'
      };
    }
    case 'whatsapp':
    default: {
      const defaultMsg =
        lang === 'en'
          ? `Hello ${profile.shortName || profile.name}, I saw your digital card and would like to connect.`
          : `Hola ${profile.shortName || profile.name}, vi tu tarjeta digital y me gustaría conectar.`;
      const msg = (cfg.customMessage && cfg.customMessage.trim()) || (profile.whatsappCustomMessage && profile.whatsappCustomMessage.trim()) || defaultMsg;
      const isValid = parsedPhone.isValid;
      const waUrl = isValid && parsedPhone.waDigits
        ? `https://wa.me/${parsedPhone.waDigits}?text=${encodeURIComponent(msg.trim())}`
        : '';
      const defaultLabel = t.chatWhatsapp || (lang === 'en' ? 'Chat on WhatsApp' : 'Conversar por WhatsApp');

      return {
        enabled,
        actionType: 'whatsapp',
        label: customText || defaultLabel,
        sublabel: cfg.sublabel,
        href: waUrl,
        isExternal: true,
        isValid,
        iconName: 'whatsapp'
      };
    }
  }
}
