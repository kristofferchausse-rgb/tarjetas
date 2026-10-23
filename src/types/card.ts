import { ProfileFeatures } from './meeting';

export type CardTheme = 'ejecutivo' | 'negocio' | 'personal';

export interface CardSolution {
  title: string;
  desc: string;
  problem?: string; // "¿Cómo ayudamos?" / Reto o necesidad que presentaba el cliente
  solution?: string; // "¿Cómo se resolvió?" / Estrategia, resolución y resultado
  ctaText?: string; // "¿Tienes una necesidad similar?" / Texto del botón de acción
  ctaMessage?: string; // Mensaje personalizado para WhatsApp al dar clic en este caso
}

export interface CardLink {
  label: string;
  url: string;
  icon: string;
  category?: string;
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

export interface CardTestimonial {
  name: string;
  role: string;
  company?: string;
  comment: string;
  stars?: number; // 1-5, default 5
  avatarUrl?: string;
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
  networkingTargets: string[]; // "Con quién me interesa conectar"
  links: CardLink[]; // Up to 5 curated links
  socialLinks?: CardSocialLinks; // Direct links to social networks
  seoKeywords?: string[]; // SEO / AEO semantic tags
  seoDescription?: string; // Custom summary for search engines and social previews
  testimonials?: CardTestimonial[]; // Social proof / Client recommendations (up to 3)
  pin?: string; // Optional 4-digit PIN for client Mini-CRM / admin access
  features?: ProfileFeatures; // Assigned modules: CRM, Meeting Intelligence & AI minutes quota
}
