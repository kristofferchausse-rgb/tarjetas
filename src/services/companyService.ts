import { CompanyAccount } from '../types/company';
import {
  ParticipantProfile,
  CardTheme,
  MemberBrandOverrides,
  ProfessionalProfileType,
  PrimaryActionConfig,
  ProfileCustomFields,
  CardSocialLinks
} from '../types/card';

const COMPANIES_STORAGE_KEY = 'redconecta_companies_v1';

/**
 * Global in-memory set of recently issued IDs in this session to guarantee
 * zero collisions even when calls occur in the exact same millisecond.
 */
const ISSUED_PUBLIC_IDS = new Set<string>();
const ISSUED_UIDS = new Set<string>();
let _sessionMonotonicCounter = 0;

/**
 * Resets the in-memory issued ID registry (useful for isolated unit testing).
 */
export function resetIssuedIdentifiersForTesting(): void {
  ISSUED_PUBLIC_IDS.clear();
  ISSUED_UIDS.clear();
  _sessionMonotonicCounter = 0;
}

/**
 * Performs a deep clone of any serializable object to guarantee complete
 * structural independence between original templates and copied cards.
 */
export function deepClone<T>(item: T): T {
  if (item === null || typeof item !== 'object') {
    return item;
  }
  if (typeof (globalThis as any).structuredClone === 'function') {
    try {
      return (globalThis as any).structuredClone(item);
    } catch {
      // Fallback if item has non-serializable elements
    }
  }
  return JSON.parse(JSON.stringify(item));
}

/**
 * Collects all currently known publicId and uid values from:
 * 1. An explicitly provided list of existing profiles
 * 2. Stored localStorage profiles (if available in browser environment)
 * 3. Default demo/benchmark profiles
 * 4. The in-memory registry of IDs issued during the current runtime session
 */
export function getKnownIdentifierSets(explicitProfiles?: ParticipantProfile[]): {
  publicIds: Set<string>;
  uids: Set<string>;
} {
  const publicIds = new Set<string>();
  const uids = new Set<string>();

  // Add in-memory session issued IDs
  ISSUED_PUBLIC_IDS.forEach((id) => publicIds.add(id.toLowerCase()));
  ISSUED_UIDS.forEach((id) => uids.add(id.toUpperCase()));

  const registerProfile = (p?: Partial<ParticipantProfile> | null) => {
    if (!p) return;
    if (p.publicId) publicIds.add(p.publicId.trim().toLowerCase());
    if (p.uid) uids.add(p.uid.trim().toUpperCase());
  };

  // 1. Explicit profiles passed by caller
  if (Array.isArray(explicitProfiles)) {
    explicitProfiles.forEach(registerProfile);
  }

  // 2. Local storage profiles if available
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('redconecta_cards_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(registerProfile);
        }
      }
    }
  } catch {
    // Ignore localStorage errors in isolated test runners
  }

  return { publicIds, uids };
}

/**
 * Generates a clean, unique slug guaranteed not to collide with any existing
 * profile or any slug issued in the same millisecond.
 */
export function generateUniqueSlug(
  baseCandidate: string,
  options?: {
    existingProfiles?: ParticipantProfile[];
    reservedSlugs?: string[];
  }
): string {
  const { publicIds } = getKnownIdentifierSets(options?.existingProfiles);
  const reserved = new Set([
    'admin',
    'studio',
    'dashboard',
    'stats',
    'crm',
    'auth',
    'api',
    'login',
    'empresa',
    'equipo',
    'directory',
    'directorio',
    'c',
    'e',
    ...(options?.reservedSlugs || [])
  ]);

  // Clean base string
  let normalized = baseCandidate
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!normalized) {
    normalized = 'tarjeta';
  }

  // Check if initial candidate is available
  if (!publicIds.has(normalized) && !reserved.has(normalized)) {
    publicIds.add(normalized);
    ISSUED_PUBLIC_IDS.add(normalized);
    return normalized;
  }

  // If already ends with a number (e.g. -2, -3), extract root
  let baseRoot = normalized;
  let counter = 2;

  const matchNum = normalized.match(/^(.*?)-(\d+)$/);
  if (matchNum) {
    baseRoot = matchNum[1];
    counter = parseInt(matchNum[2], 10) + 1;
  }

  // First try incrementing numeric suffix (-2, -3, ...)
  while (counter < 1000) {
    const candidate = `${baseRoot}-${counter}`;
    if (!publicIds.has(candidate) && !reserved.has(candidate)) {
      publicIds.add(candidate);
      ISSUED_PUBLIC_IDS.add(candidate);
      return candidate;
    }
    counter++;
  }

  // If still colliding (high density), append timestamp + monotonic counter
  while (true) {
    _sessionMonotonicCounter++;
    const entropySuffix = (
      Date.now().toString(36) +
      '-' +
      _sessionMonotonicCounter.toString(36) +
      '-' +
      Math.floor(100 + Math.random() * 899).toString(36)
    ).slice(-8);
    const candidate = `${baseRoot}-${entropySuffix}`;
    if (!publicIds.has(candidate) && !reserved.has(candidate)) {
      publicIds.add(candidate);
      ISSUED_PUBLIC_IDS.add(candidate);
      return candidate;
    }
  }
}

/**
 * Generates a unique, collision-proof internal UID for cards.
 */
export function generateUniqueUid(
  prefix: string = 'MX-CORP',
  options?: { existingProfiles?: ParticipantProfile[] }
): string {
  const { uids } = getKnownIdentifierSets(options?.existingProfiles);

  while (true) {
    _sessionMonotonicCounter++;
    const timeHex = Date.now().toString(36).toUpperCase().slice(-5);
    const counterHex = (_sessionMonotonicCounter % 46655).toString(36).toUpperCase().padStart(3, '0');
    const randomHex = Math.floor(100 + Math.random() * 899).toString();
    const candidate = `${prefix}-${timeHex}-${counterHex}-${randomHex}`;

    if (!uids.has(candidate)) {
      uids.add(candidate);
      ISSUED_UIDS.add(candidate);
      return candidate;
    }
  }
}

export function createSvgLogo(initials: string, primaryColor: string, bgColor: string = '#ffffff'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}" />
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="36" fill="url(#grad)" />
  <rect x="4" y="4" width="152" height="152" rx="32" fill="none" stroke="${primaryColor}" stroke-width="6" stroke-opacity="0.25" />
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-weight="900" font-size="44" fill="${primaryColor}" letter-spacing="-1">${initials}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 2 Sinthetic Benchmark Companies for local demonstration
export const DEFAULT_COMPANIES: CompanyAccount[] = [
  {
    id: 'company-nexo-operativo',
    slug: 'nexo-operativo',
    name: 'Nexo Operativo',
    tagline: 'Servicios Técnicos & Proyectos Industriales',
    valueProp: 'Coordinación técnica, mantenimiento especializado y ejecución de proyectos para plantas de manufactura en Querétaro y la región Bajío.',
    industry: 'Manufactura & Servicios Industriales',
    brand: {
      primaryColor: '#047857',
      accentColor: '#10b981',
      themeKey: 'negocio',
      logoUrl: createSvgLogo('NXO', '#047857', '#F8FAFC'),
      bannerImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80'
    },
    channels: {
      website: 'https://nexooperativo.mx',
      linkedin: 'https://linkedin.com/company/nexo-operativo-qro',
      phone: '+524422345678',
      email: 'contacto@nexooperativo.mx',
      address: 'Parque Industrial Querétaro, QRO'
    },
    areas: [
      'Dirección General',
      'Operaciones & Planta',
      'Soporte Técnico',
      'Comercial & Alianzas'
    ],
    links: [
      {
        label: 'Catálogo de Capacidades Técnicas',
        url: 'https://nexooperativo.mx/capacidades',
        icon: 'precision_manufacturing',
        category: 'Capacidades'
      },
      {
        label: 'Protocolos de Calidad y Mantenimiento',
        url: 'https://nexooperativo.mx/protocolos',
        icon: 'shield',
        category: 'Seguridad'
      }
    ],
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-11-01T12:00:00.000Z'
  },
  {
    id: 'company-agora-consultores',
    slug: 'agora-consultores',
    name: 'Ágora Consultores',
    tagline: 'Desarrollo Organizacional & Efectividad de Equipos',
    valueProp: 'Acompañamos a líderes y comités directivos en diseño de estructuras, alineación de roles y efectividad de equipos de alto rendimiento.',
    industry: 'Consultoría Estratégica & Capital Humano',
    brand: {
      primaryColor: '#0f172a',
      accentColor: '#00685f',
      themeKey: 'ejecutivo',
      logoUrl: createSvgLogo('AGC', '#0f172a', '#F8FAFC'),
      bannerImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80'
    },
    channels: {
      website: 'https://agoraconsultores.mx',
      linkedin: 'https://linkedin.com/company/agora-consultores-mx',
      phone: '+524423456789',
      email: 'info@agoraconsultores.mx',
      address: 'Centro Sur, Querétaro, QRO'
    },
    areas: [
      'Consultoría Estratégica',
      'Desarrollo de Equipos',
      'Gestión del Talento'
    ],
    links: [
      {
        label: 'Metodología de Diagnóstico de Equipos',
        url: 'https://agoraconsultores.mx/metodologia',
        icon: 'menu_book',
        category: 'Metodología'
      }
    ],
    createdAt: '2026-02-10T11:00:00.000Z',
    updatedAt: '2026-11-01T12:00:00.000Z'
  }
];

/**
 * Returns all corporate accounts stored locally, merging with default benchmark companies.
 */
export function getCompanies(): CompanyAccount[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(COMPANIES_STORAGE_KEY) : null;
    if (raw) {
      const parsed: CompanyAccount[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure defaults exist if not explicitly deleted
        const existingIds = new Set(parsed.map((c) => c.id));
        const missingDefaults = DEFAULT_COMPANIES.filter((d) => !existingIds.has(d.id));
        return [...parsed, ...missingDefaults];
      }
    }
  } catch (err) {
    console.error('Error reading companies from storage:', err);
  }
  return DEFAULT_COMPANIES;
}

/**
 * Finds a company by ID
 */
export function getCompanyById(id: string): CompanyAccount | undefined {
  const companies = getCompanies();
  return companies.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

/**
 * Finds a company by URL slug
 */
export function getCompanyBySlug(slug: string): CompanyAccount | undefined {
  const companies = getCompanies();
  return companies.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Saves or updates a company in local storage
 */
export function saveCompany(company: CompanyAccount): { success: boolean; error?: string } {
  try {
    if (!company.name?.trim()) return { success: false, error: 'El nombre de la empresa es obligatorio' };
    if (!company.slug?.trim()) return { success: false, error: 'El slug de la empresa es obligatorio' };

    const companies = getCompanies();
    const cleanSlug = company.slug.trim().toLowerCase();
    const existingIdx = companies.findIndex((c) => c.id === company.id);

    // Slug uniqueness check
    const slugClash = companies.some((c) => c.slug.toLowerCase() === cleanSlug && c.id !== company.id);
    if (slugClash) {
      return { success: false, error: 'El slug ya está siendo utilizado por otra empresa' };
    }

    const updatedCompany: CompanyAccount = {
      ...company,
      slug: cleanSlug,
      updatedAt: new Date().toISOString()
    };

    let updatedList: CompanyAccount[];
    if (existingIdx !== -1) {
      updatedList = companies.map((c, idx) => (idx === existingIdx ? updatedCompany : c));
    } else {
      updatedList = [updatedCompany, ...companies];
    }

    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(updatedList));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al persistir empresa localmente' };
  }
}

/**
 * Deletes a company by ID
 */
export function deleteCompany(id: string): { success: boolean; error?: string } {
  try {
    const companies = getCompanies();
    const filtered = companies.filter((c) => c.id !== id);
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al eliminar empresa' };
  }
}

/**
 * Resolves effective branding for a member profile:
 * If member has brandOverrides.overrideBrand === true, preserves member's own custom colors/logo.
 * Otherwise, inherits the company's brand logo and primary color.
 */
export function resolveMemberBrand(
  member: ParticipantProfile,
  company?: CompanyAccount
): {
  logoUrl?: string;
  customPrimaryColor?: string;
  themeKey: CardTheme;
  hasBrandOverride: boolean;
} {
  const hasBrandOverride = Boolean(member.brandOverrides?.overrideBrand);
  if (hasBrandOverride || !company) {
    return {
      logoUrl: member.logoUrl,
      customPrimaryColor: member.customPrimaryColor,
      themeKey: member.themeKey,
      hasBrandOverride
    };
  }

  return {
    logoUrl: company.brand.logoUrl || member.logoUrl,
    customPrimaryColor: company.brand.primaryColor || member.customPrimaryColor,
    themeKey: company.brand.themeKey || member.themeKey,
    hasBrandOverride: false
  };
}

/**
 * Filters members belonging to a company.
 * When onlyActivePublic is true, filters strictly for:
 * - isCompanyActive !== false
 * - showInDirectory !== false
 * - published === true
 */
export function getCompanyMembers(
  companyId: string,
  profiles: ParticipantProfile[],
  options?: { onlyActivePublic?: boolean; department?: string; search?: string }
): ParticipantProfile[] {
  return profiles.filter((p) => {
    if (p.companyId !== companyId) return false;

    if (options?.onlyActivePublic) {
      if (p.isCompanyActive === false) return false;
      if (p.showInDirectory === false) return false;
      if (!p.published) return false;
    }

    if (options?.department && options.department !== 'all') {
      if ((p.companyDepartment || '').trim().toLowerCase() !== options.department.trim().toLowerCase()) {
        return false;
      }
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchRole = (p.role || '').toLowerCase().includes(q);
      const matchStatement = (p.companyRoleStatement || '').toLowerCase().includes(q);
      const matchDept = (p.companyDepartment || '').toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchStatement && !matchDept) return false;
    }

    return true;
  });
}

/**
 * Links a profile to a company with assigned department and role statement.
 */
export function linkMemberToCompany(
  member: ParticipantProfile,
  company: CompanyAccount,
  data: {
    department?: string;
    roleStatement?: string;
    showInDirectory?: boolean;
    overrideBrand?: boolean;
  }
): ParticipantProfile {
  return {
    ...member,
    company: company.name,
    companyId: company.id,
    companySlug: company.slug,
    companyDepartment: data.department || company.areas[0] || 'General',
    companyRoleStatement: data.roleStatement || member.companyRoleStatement || '',
    isCompanyActive: true,
    showInDirectory: data.showInDirectory !== false,
    brandOverrides: data.overrideBrand ? { overrideBrand: true } : { overrideBrand: false }
  };
}

/**
 * Unlinks a member from a company.
 * Strictly preserves the individual's profile, contact info, private CRM leads, and stats,
 * using a deep copy to ensure complete independence.
 */
export function unlinkMemberFromCompany(member: ParticipantProfile): ParticipantProfile {
  const copy = deepClone(member);
  delete copy.companyId;
  delete copy.companySlug;
  delete copy.companyDepartment;
  delete copy.companyRoleStatement;
  delete copy.brandOverrides;
  delete copy.isCompanyActive;
  delete copy.showInDirectory;
  return copy;
}

export interface DuplicateMemberCardOptions {
  newPublicId?: string;
  department?: string;
  roleStatement?: string;
  role?: string;
  valueProp?: string;
  existingProfiles?: ParticipantProfile[];
  brandOverrides?: MemberBrandOverrides;
}

/**
 * Duplicates a card for team members using strictly allowed template fields:
 * - Generates collision-proof, unique publicId and uid (verifying against existing profiles & same-millisecond calls)
 * - Deep-clones all nested structures so that editing the copy NEVER modifies the original
 * - Preserves pertinent corporate configuration (company, branding, department, corporate links)
 * - Cleans personal data: name, shortName, phone, email, avatarUrl, avatarAlt
 * - Cleans fiscal data: fiscalData
 * - Cleans credentials: pin
 * - Cleans personal agenda: calendarUrl, customFields.bookingUrl
 * - Cleans presentations: introVideo
 * - Cleans testimonials: testimonials (resets to empty array)
 * - Cleans specific messages: whatsappCustomMessage, primaryAction.customMessage, solution.ctaMessage
 * - Cleans operator private notes: operatorContext
 * - Starts as draft (published: false, verified: false, showInDirectory: false)
 * - Zero association with leads, stats, or outcomes of the original
 */
export function duplicateMemberCard(
  original: ParticipantProfile,
  options?: DuplicateMemberCardOptions
): ParticipantProfile {
  // 1. Unique Slug and UID Generation with collision prevention
  const baseCandidate = options?.newPublicId || `${original.publicId}-copia`;
  const newSlug = generateUniqueSlug(baseCandidate, {
    existingProfiles: options?.existingProfiles
  });
  const newUid = generateUniqueUid('MX-CORP', {
    existingProfiles: options?.existingProfiles
  });

  // 2. Deep-clone shared structures to ensure absolute mutational independence
  const clonedSolutions = (original.solutions || []).map((sol) => {
    const s = deepClone(sol);
    delete s.ctaMessage; // Clean previous holder's specific WhatsApp message
    return s;
  });

  const clonedSteps = deepClone(original.processSteps || []);
  const clonedNetworking = deepClone(original.networkingTargets || []);
  const clonedLinks = deepClone(original.links || []);
  const clonedKeywords = deepClone(original.seoKeywords || []);

  let clonedPrimaryAction: PrimaryActionConfig | undefined = undefined;
  if (original.primaryAction) {
    clonedPrimaryAction = deepClone(original.primaryAction);
    clonedPrimaryAction.customMessage = undefined; // Wipe specific prefilled message
    if (clonedPrimaryAction.actionType === 'calendar') {
      clonedPrimaryAction.customUrl = undefined; // Wipe personal calendar link
    }
  }

  let clonedCustomFields: ProfileCustomFields | undefined = undefined;
  if (original.customFields) {
    clonedCustomFields = deepClone(original.customFields);
    delete clonedCustomFields.bookingUrl; // Clean personal booking URL
    delete clonedCustomFields.licenseId; // Clean personal license ID
    delete clonedCustomFields.specialtyLicenseId;
  }

  let clonedSocialLinks: CardSocialLinks | undefined = undefined;
  if (original.socialLinks?.website) {
    clonedSocialLinks = { website: original.socialLinks.website };
  }

  const duplicated: ParticipantProfile = {
    // Identifiers & Publication Status (Strict Draft, never inherited verification)
    publicId: newSlug,
    uid: newUid,
    published: false,
    verified: false,
    showInDirectory: false,
    isCompanyActive: true,

    // Personal Data: strictly emptied
    name: '',
    shortName: '',
    phone: '',
    email: '',
    avatarUrl: '',
    avatarAlt: '',

    // Credentials & Operator Context: strictly emptied
    pin: undefined,
    operatorContext: undefined,

    // Fiscal Data: strictly emptied
    fiscalData: undefined,

    // Personal Agenda & Presentations: strictly emptied
    calendarUrl: undefined,
    introVideo: undefined,

    // Testimonials: strictly emptied
    testimonials: [],

    // Specific Messages: strictly emptied
    whatsappCustomMessage: undefined,

    // Corporate & Structural Config: Preserved and Deep Cloned
    company: original.company,
    companyId: original.companyId,
    companySlug: original.companySlug,
    companyDepartment: options?.department || original.companyDepartment || 'General',
    companyRoleStatement: options?.roleStatement ?? (original.companyRoleStatement || ''),
    role: options?.role || original.role || '',
    logoUrl: original.logoUrl,
    city: original.city,
    showLocation: original.showLocation,
    locationMode: original.locationMode,
    address: original.address,
    googleMapsUrl: original.googleMapsUrl,
    status: 'Disponible para consultas',
    statusActive: true,
    themeKey: original.themeKey,
    bannerTheme: original.bannerTheme,
    bannerImageUrl: original.bannerImageUrl,
    customPrimaryColor: original.customPrimaryColor,
    customAccentColor: original.customAccentColor,
    valueProp: options?.valueProp || original.valueProp || '',
    professionalProfile: original.professionalProfile || 'empresario_dueno',
    brandOverrides: options?.brandOverrides
      ? deepClone(options.brandOverrides)
      : original.brandOverrides
      ? deepClone(original.brandOverrides)
      : { overrideBrand: false },

    // Features: Clean corporate defaults (does NOT copy quota or meeting intelligence)
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: false,
      aiMinutesQuota: 0,
      aiMinutesUsed: 0
    },

    // Deep cloned structures
    solutions: clonedSolutions,
    processSteps: clonedSteps,
    networkingTargets: clonedNetworking,
    links: clonedLinks,
    socialLinks: clonedSocialLinks,
    primaryAction: clonedPrimaryAction,
    customFields: clonedCustomFields,
    seoKeywords: clonedKeywords,
    seoDescription: original.seoDescription ? String(original.seoDescription) : original.valueProp || ''
  };

  // 3. Ensure clean, isolated local leads storage (strictly empty, no inherited leads or mock seeding)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`tarjetas_leads_${newSlug.toLowerCase()}`, JSON.stringify([]));
    }
  } catch {
    // Ignore storage errors in non-browser or quota restricted environments
  }

  return duplicated;
}

export interface CreateCorporateMemberData {
  publicId?: string;
  name: string;
  role: string;
  department: string;
  roleStatement?: string;
  phone?: string;
  email?: string;
  valueProp?: string;
  professionalProfile?: ProfessionalProfileType;
}

export interface CreateCorporateMemberOptions {
  existingProfiles?: ParticipantProfile[];
}

/**
 * Creates a new blank member profile from a corporate template with collision-proof identifiers.
 */
export function createMemberFromCorporateTemplate(
  company: CompanyAccount,
  data: CreateCorporateMemberData,
  options?: CreateCorporateMemberOptions
): ParticipantProfile {
  const baseCandidate =
    data.publicId ||
    `${company.slug}-${data.name ? data.name.trim().split(' ')[0].toLowerCase() : 'integrante'}`;

  const cleanId = generateUniqueSlug(baseCandidate, {
    existingProfiles: options?.existingProfiles
  });
  const uid = generateUniqueUid('MX-CORP', {
    existingProfiles: options?.existingProfiles
  });

  const created: ParticipantProfile = {
    publicId: cleanId,
    uid,
    published: false, // Starts as draft until approved
    verified: false,
    showInDirectory: false, // Inactive in public directory until published
    isCompanyActive: true,

    name: data.name.trim(),
    shortName: data.name.trim().split(' ')[0] || data.name.trim(),
    role: data.role.trim(),
    company: company.name,
    companyId: company.id,
    companySlug: company.slug,
    companyDepartment: data.department || company.areas[0] || 'General',
    companyRoleStatement: data.roleStatement || '',

    logoUrl: company.brand.logoUrl,
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'presencial',
    status: 'Disponible para consultas',
    statusActive: true,
    avatarUrl: '',
    avatarAlt: `Foto profesional de ${data.name.trim()}`,
    themeKey: company.brand.themeKey || 'negocio',
    bannerTheme: 'from-stone-900 to-stone-950',
    customPrimaryColor: company.brand.primaryColor,
    customAccentColor: company.brand.accentColor,
    phone: data.phone || '',
    email: data.email || '',
    valueProp:
      data.valueProp ||
      `Atención y soporte especializado en ${data.department} para clientes y proyectos de ${company.name}.`,
    solutions: [
      {
        type: 'solucion',
        title: `Servicios y asesoría en ${data.department}`,
        desc: `Atención personalizada para coordinar requerimientos y proyectos de ${company.name}.`,
        problem: 'Necesidad de atención técnica y coordinación directa con el equipo.',
        intervention: 'Evaluación y asesoría directa según requerimientos de la planta o empresa.',
        scope: 'Plan de acción y propuesta de atención técnica.',
        solution: 'Resolución de necesidades y acompañamiento continuo.'
      }
    ],
    networkingTargets: [
      {
        target: 'Empresas y aliados del sector',
        purpose: 'Establecer acuerdos de colaboración y proyectos conjuntos.'
      }
    ],
    links: company.links ? deepClone(company.links) : [],
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: false, // Corporate member does NOT automatically have Meeting Intelligence
      aiMinutesQuota: 0,
      aiMinutesUsed: 0
    },
    professionalProfile: data.professionalProfile || 'empresario_dueno',
    brandOverrides: { overrideBrand: false },
    testimonials: []
  };

  // Ensure clean, isolated local leads storage (strictly empty)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`tarjetas_leads_${cleanId.toLowerCase()}`, JSON.stringify([]));
    }
  } catch {
    // Ignore storage errors
  }

  return created;
}

