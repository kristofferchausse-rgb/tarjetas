import QRCode from 'qrcode';
import { ParticipantProfile } from '../types/card';

export interface QRGenerationResult {
  svgString: string;
  pngDataUrl: string;
}

/**
 * Encodes a custom profile into a compact, portable URL parameter
 * so ANY device scanning the QR code immediately imports and sees the card.
 */
export function encodeCardPayload(profile: ParticipantProfile): string {
  try {
    const compact = {
      id: profile.publicId,
      u: profile.uid,
      n: profile.name,
      s: profile.shortName,
      r: profile.role,
      c: profile.company,
      ci: profile.city,
      st: profile.status,
      a: profile.avatarUrl,
      t: profile.themeKey,
      p: profile.phone,
      w: profile.whatsappCustomMessage,
      e: profile.email,
      v: profile.valueProp,
      sol: profile.solutions,
      net: profile.networkingTargets,
      l: profile.links,
      cp: profile.customPrimaryColor,
      lg: profile.logoUrl,
      bi: profile.bannerImageUrl,
      iv: profile.introVideo
    };
    return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(compact)))));
  } catch (err) {
    return '';
  }
}

/**
 * Decodes a portable card parameter from the URL.
 */
export function decodeCardPayload(encoded: string): ParticipantProfile | null {
  try {
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    const c = JSON.parse(jsonStr);
    return {
      publicId: c.id,
      uid: c.u || `MX-EXT-${Math.floor(1000 + Math.random() * 9000)}`,
      published: true,
      name: c.n,
      shortName: c.s || c.n,
      role: c.r || 'Profesionista',
      company: c.c || 'Empresa Independiente',
      city: c.ci || 'México',
      status: c.st || 'Disponible',
      statusActive: true,
      avatarUrl: c.a || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      avatarAlt: `Foto de ${c.n}`,
      verified: true,
      themeKey: c.t || 'ejecutivo',
      bannerTheme:
        c.t === 'negocio'
          ? 'from-emerald-950 via-teal-900 to-emerald-900'
          : c.t === 'personal'
          ? 'from-stone-900 via-amber-950 to-orange-950'
          : 'from-slate-900 via-slate-800 to-slate-950',
      bannerImageUrl: c.bi,
      customPrimaryColor: c.cp,
      logoUrl: c.lg,
      phone: c.p || '+525512345678',
      whatsappCustomMessage: c.w || `Hola ${c.s || c.n}, vi tu tarjeta digital en RedConecta MX y me gustaría conectar.`,
      email: c.e || `${c.id}@redconecta.mx`,
      valueProp: c.v || '',
      introVideo: c.iv,
      solutions: c.sol || [],
      networkingTargets: c.net || [],
      links: c.l || []
    };
  } catch (err) {
    return null;
  }
}

export const SHARED_APP_BASE_URL = 'https://tribucreativaqro.web.app';

/**
 * Returns the stable public URL for a participant profile.
 * Automatically converts any private dev URLs (ais-dev-) to public shared preview URLs (ais-pre-)
 * so recipients on mobile browsers (Safari/Chrome) never face cookie blocking or Google 403 errors.
 */
export function getStablePublicUrl(
  profileOrId: string | ParticipantProfile,
  useProductionDomain = false,
  includePortablePayload = false,
  customDomainOverride?: string,
  useHash = false
): string {
  const publicId = typeof profileOrId === 'string' ? profileOrId : profileOrId.publicId;
  let baseDomain = SHARED_APP_BASE_URL;

  if (customDomainOverride && customDomainOverride.trim().length > 0) {
    let clean = customDomainOverride.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    clean = clean.replace(/\/+$/, '');
    baseDomain = clean;
  } else if (useProductionDomain) {
    baseDomain = 'https://redconecta.mx';
  } else if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('ais-dev-')) {
      baseDomain = origin.replace('ais-dev-', 'ais-pre-');
    } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      baseDomain = SHARED_APP_BASE_URL;
    } else {
      baseDomain = origin;
    }
  }

  const routePath = useHash ? `/#/c/${publicId}` : `/c/${publicId}`;
  let url = `${baseDomain}${routePath}`;

  if (includePortablePayload && typeof profileOrId !== 'string') {
    const payload = encodeCardPayload(profileOrId);
    if (payload) {
      url += `?d=${payload}`;
    }
  }

  return url;
}

/**
 * Generates both SVG markup and PNG data URL for the target URL with proper quiet zone margin.
 */
export async function generateQRCodeAssets(targetUrl: string): Promise<QRGenerationResult> {
  const svgString = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 3,
    color: {
      dark: '#0f172a', // Deep slate for high contrast
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });

  const pngDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 640,
    margin: 3,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });

  return { svgString, pngDataUrl };
}

/**
 * Triggers browser download of QR code in SVG format.
 */
export function downloadQRCodeSvg(svgString: string, filename = 'qr-tarjeta-redconecta.svg'): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 150);
}

/**
 * Triggers browser download of QR code in PNG format.
 */
export function downloadQRCodePng(pngDataUrl: string, filename = 'qr-tarjeta-redconecta.png'): void {
  const a = document.createElement('a');
  a.href = pngDataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 150);
}
