export type CardTheme = 'ejecutivo' | 'negocio' | 'personal';

export interface CardSolution {
  title: string;
  desc: string;
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
}
