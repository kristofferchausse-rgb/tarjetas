import { ProfileFeatures } from './meeting';
import { MemberBrandOverrides } from './company';

export type { MemberBrandOverrides };

export type CardTheme = 'ejecutivo' | 'negocio' | 'personal';

export type ProfessionalProfileType =
  | 'profesional_independiente'
  | 'comercial_asesor'
  | 'emprendedor_solopreneur'
  | 'empresario_dueno'
  | 'ejecutivo_directivo'
  | 'salud'
  | 'institucional_publico';

export interface ProfileCustomFields {
  // Profesional Independiente
  specialty?: string; // Especialidad / Área de enfoque
  clientType?: string; // Tipo de cliente atendido
  serviceScope?: string; // Alcance del servicio

  // Comercial / Asesor
  sector?: string; // Sector / Industria
  territory?: string; // Territorio o zona de cobertura
  solutionLines?: string; // Líneas de solución / Catálogo

  // Emprendedor / Solopreneur
  category?: string; // Categoría o giro del negocio
  modality?: string; // Modalidad de oferta (producto, servicio, taller)
  serviceZone?: string; // Zona o cobertura de atención

  // Empresario / Dueño de Negocio
  sectorsServed?: string; // Sectores atendidos
  coverage?: string; // Cobertura operativa
  coreCapabilities?: string; // Capacidades principales instaladas

  // Ejecutivo / Directivo
  department?: string; // Área o función directiva
  leadershipScope?: string; // Ámbito de responsabilidad
  liaisonTopics?: string; // Temas de vinculación estratégica

  // Salud
  medicalProfession?: string; // Profesión sanitaria (Medicina, Psicología, Odontología, etc.)
  medicalSpecialty?: string; // Especialidad clínica
  licenseId?: string; // Cédula profesional federal proporcionada
  specialtyLicenseId?: string; // Cédula de especialidad médica (cuando aplique)
  institution?: string; // Hospital, clínica o institución formadora
  bookingUrl?: string; // Enlace directo a agenda médica existente (sincronizado con calendarUrl)

  // Funcionario / Representante Institucional
  institutionName?: string; // Institución u organismo público
  institutionalDepartment?: string; // Área o dependencia
  territorialScope?: string; // Alcance territorial o demarcación
  publicLiaisonTopics?: string; // Temas de competencia y vinculación

  // Fotografía interna
  photoDescription?: string; // Descripción interna para encargo/producción de fotografía (si no hay URL)
}

export type SolutionEntryType = 'solucion' | 'caso' | 'sin_clasificar';

export interface CardSolution {
  type?: SolutionEntryType; // Tipo de entrada: Solución ofrecida vs Caso documentado
  title: string;
  desc: string;
  problem?: string; // Reto, dolor o necesidad que atiende ("¿Cómo ayudamos?")
  intervention?: string; // Intervención concreta: qué hace el titular, cómo ayuda o qué proceso aplica
  scope?: string; // Alcance: qué recibe la persona, entregable o actuación correspondiente
  solution?: string; // Resultado, resolución o cambio que facilita ("¿Cómo se resolvió?")
  evidenceUrl?: string; // Enlace público a evidencia autorizada (portafolio, entregable, métrica documentada)
  evidenceLabel?: string; // Título o descripción del recurso de evidencia
  ctaText?: string; // Texto del botón de acción ("¿Tienes una necesidad similar?")
  ctaMessage?: string; // Mensaje de WhatsApp específico e independiente al pulsar esa entrada
}

export interface NetworkingTargetItem {
  target: string; // Perfil o aliado deseado
  purpose?: string; // Para qué quiere colaborar o qué oportunidad desarrollar
  contribution?: string; // Qué puede aportar el titular a esa relación
}

export interface OperatorInternalContext {
  // Alias de las 5 preguntas del operador (Sección 3.1)
  titularGoal?: string; // 1. Qué quiere conseguir el titular con esta tarjeta
  targetAudienceSituation?: string; // 2. Con qué público necesita conversar y en qué situación ese público buscaría ayuda
  presentationDifficulty?: string; // 3. Qué dificultad encuentra hoy para presentarse, conseguir recomendaciones o continuar relaciones
  whatToProtectOrBuild?: string; // 4. Qué quiere construir o proteger en su actividad (y personal/profesional)
  observableSuccessChange?: string; // 5. Qué cambio observable le haría reconocer que la tarjeta le está ayudando

  // Compatibilidad con propiedades concisas
  goal?: string;
  audienceContext?: string;
  currentFriction?: string;
  aspirationsToProtect?: string;
  successIndicator?: string;

  photoProductionNotes?: string; // Descripción interna para encargo/producción de fotografía
  internalNotes?: string; // Notas editoriales adicionales del operador
  updatedAt?: string;
}

export interface CardProcessStep {
  step?: number; // Número de paso secuencial (1, 2, 3)
  title: string; // Qué sucede en esta etapa (ej. "Diagnóstico inicial", "Propuesta de intervención")
  desc: string; // Qué hace el titular y qué recibe el contacto
  expectation?: string; // Qué puede preparar o esperar la persona (ej. "Reunión de 30 min, sin compromiso")
}

export type PrimaryActionType = 'whatsapp' | 'calendar' | 'collaboration' | 'custom_link' | 'phone' | 'email';

export interface PrimaryActionConfig {
  enabled?: boolean; // Activar o desactivar acción destacada
  actionType: PrimaryActionType;
  label?: string; // Etiqueta personalizada del botón principal
  customLabel?: string; // Alias para compatibilidad de formularios
  sublabel?: string; // Subtítulo o aclaración breve
  customUrl?: string; // Enlace si aplica (para custom_link o collaboration)
  customMessage?: string; // Mensaje personalizado si aplica
}

export interface CardLink {
  label: string;
  url: string;
  icon: string;
  category?: string; // 'Portafolio' | 'Proyecto' | 'Entregable' | 'Evidencia' | 'Agenda' | 'Redes' | 'Documento' | 'Otro'
}

export interface CardIntroVideo {
  title: string;
  url: string; // YouTube, Vimeo, Loom or direct mp4 embed URL
  thumbnailUrl?: string;
  duration?: string;
}

export interface CardSocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string; // X
  tiktok?: string;
  youtube?: string;
  github?: string;
  website?: string;
}

export type TestimonialSourceType =
  | 'facebook'
  | 'google'
  | 'linkedin'
  | 'doctoralia'
  | 'whatsapp'
  | 'email'
  | 'screenshot'
  | 'external'
  | 'general';

export interface CardTestimonial {
  name: string;
  role: string;
  company?: string;
  comment: string;
  stars?: number; // 1-5, sin imponer 5 automáticamente
  avatarUrl?: string;

  // Evidencia y verificación de autenticidad
  sourceType?: TestimonialSourceType;
  sourceUrl?: string; // Enlace público directo (ej. publicación de Facebook, perfil de LinkedIn, Google Reviews)
  evidenceImageUrl?: string; // Captura de pantalla de la reseña / conversación para lightbox
  evidenceLabel?: string; // Etiqueta personalizada (ej. "Ver publicación en Facebook")
  date?: string; // Fecha de la opinión (ej. "14 de diciembre de 2022")
}

export interface FiscalDataCFDI {
  requiresInvoice: boolean;
  rfc?: string;
  razonSocial?: string; // Sin régimen societario, e.g. S.A. de C.V.
  codigoPostal?: string; // 5 dígitos
  regimenFiscal?: string; // Clave SAT (ej. 601, 612, 626, etc.)
  usoCFDI?: string; // Clave SAT (ej. G03, CP01, S01, etc.)
  emailFacturacion?: string;
  formaPago?: string; // Clave SAT (ej. 03 Transferencia, 04 Tarjeta)
  claveSatProducto?: string; // 82101603 Publicidad en internet / 81112105 SaaS
  claveSatUnidad?: string; // E48 Unidad de servicio
  updatedAt?: string;
}

export interface ParticipantProfile {
  publicId: string;
  uid: string;
  published: boolean;
  name: string;
  shortName: string;
  role: string;
  company: string;
  logoUrl?: string; // Company / personal emblem
  city: string;
  showLocation?: boolean; // Ocultar o mostrar ubicación en la tarjeta (true: presencial/mostrar, false: remoto/ocultar)
  locationMode?: 'presencial' | 'remoto' | 'hibrido'; // Modalidad del negocio
  address?: string; // Dirección física (tienda, despacho, consultorio)
  googleMapsUrl?: string; // Link directo a Google Maps / Waze
  status: string;
  statusActive: boolean;
  avatarUrl: string;
  avatarAlt: string;
  verified: boolean;
  themeKey: CardTheme;
  bannerTheme: string;
  bannerImageUrl?: string; // Optional custom cover photo
  customPrimaryColor?: string; // e.g. #00685f, #0f172a, #ac3400, #2563eb
  customAccentColor?: string;
  phone: string; // E.164 format, e.g., +525541234567
  whatsappCustomMessage?: string;
  email: string;
  calendarUrl?: string;
  directoryUrl?: string;
  websiteUrl?: string;
  valueProp: string; // "A quién ayudo y con qué"
  introVideo?: CardIntroVideo; // Optional introduction video pitch (YouTube, Loom, Vimeo, MP4)
  solutions: CardSolution[]; // Up to 3
  processSteps?: CardProcessStep[]; // Apartado UX04: Proceso o "Cómo se empieza" (opcional, 2-3 pasos)
  networkingTargets: (string | NetworkingTargetItem)[]; // "Con quién me interesa conectar" (hasta 3)
  links: CardLink[]; // Up to 5 curated links
  socialLinks?: CardSocialLinks; // Direct links to social networks
  seoKeywords?: string[]; // SEO / AEO semantic tags
  seoDescription?: string; // Custom summary for search engines and social previews
  testimonials?: CardTestimonial[]; // Social proof / Client recommendations (up to 3)
  pin?: string; // Optional 4-digit PIN for client Mini-CRM / admin access (privado)
  features?: ProfileFeatures; // Assigned modules: CRM, Meeting Intelligence & AI minutes quota
  professionalProfile?: ProfessionalProfileType; // Perfil profesional de Etapa 1 (7 opciones)
  customFields?: ProfileCustomFields; // Campos opcionales estructurados por perfil
  fiscalData?: FiscalDataCFDI; // Datos de Facturación SAT CFDI 4.0
  operatorContext?: OperatorInternalContext; // Apartado 3.1: Contexto interno privado para configuración editorial
  primaryAction?: PrimaryActionConfig; // Apartado 5.1: Acción principal coherente con el objetivo

  // Plan Empresarial (UX08): Relación corporativa y membresía
  companyId?: string; // ID de la cuenta corporativa vinculada
  companySlug?: string; // Slug de la empresa para navegación directa al directorio
  companyRoleStatement?: string; // Frase concreta: qué atiende en la empresa ("Te orienta en la viabilidad técnica...")
  companyDepartment?: string; // Área o departamento al que pertenece dentro de la empresa
  isCompanyActive?: boolean; // Estado del vínculo con la empresa (activo vs inactivo)
  showInDirectory?: boolean; // Autorizado para mostrarse públicamente en el directorio corporativo
  brandOverrides?: MemberBrandOverrides; // Excepciones explícitas a la marca de la empresa
}



