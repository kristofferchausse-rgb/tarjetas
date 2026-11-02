import { CardLink, CardTheme } from './card';

export interface CompanyBrand {
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  themeKey?: CardTheme;
  bannerImageUrl?: string;
}

export interface CompanyChannels {
  website?: string;
  linkedin?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CompanyAccount {
  id: string; // Unique ID, e.g. 'company-nexo-operativo'
  slug: string; // URL slug, e.g. 'nexo-operativo'
  name: string; // e.g. 'Nexo Operativo'
  tagline?: string; // Short tagline, e.g. 'Servicios Técnicos & Proyectos Industriales'
  valueProp: string; // "Coordinación técnica y servicios operativos para plantas de manufactura en Querétaro y la región Bajío."
  industry: string; // e.g. 'Manufactura & Servicios Industriales'
  brand: CompanyBrand;
  channels: CompanyChannels;
  areas: string[]; // e.g. ['Dirección General', 'Operaciones & Planta', 'Soporte Técnico', 'Comercial & Alianzas']
  links?: CardLink[]; // Corporate links inherited by default
  createdAt?: string;
  updatedAt?: string;
}

export interface MemberBrandOverrides {
  overrideBrand?: boolean; // When true, member does NOT inherit company colors/logo
  customPrimaryColor?: string;
  customAccentColor?: string;
  customLogoUrl?: string;
  reason?: string; // Motivo o justificación de la excepción de marca (ej. unidad de negocio autónoma)
}

