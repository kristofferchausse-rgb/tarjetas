import QRCode from 'qrcode';
import { ParticipantProfile } from '../types/card';
import { getStablePublicUrl } from './qr';

export interface WallpaperOptions {
  themeColor?: string;
  includeAvatar?: boolean;
  tagline?: string;
}

/**
 * Loads an image from URL into an HTMLImageElement safely (handling CORS where possible)
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // If CORS fails, resolve null so canvas doesn't crash
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Generates an HD 1080x2340 Lockscreen Wallpaper with embedded QR Code,
 * profile details, and dedicated clock-safe zone at top.
 */
export async function generateLockscreenWallpaper(
  profile: ParticipantProfile,
  options: WallpaperOptions = {}
): Promise<string> {
  const width = 1080;
  const height = 2340;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const brandColor = options.themeColor || profile.customPrimaryColor || '#00685f';
  const targetUrl = getStablePublicUrl(profile.publicId, false, false);

  // 1. Background Gradient (Sleek dark executive look with brand gradient)
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#090d16');
  bgGradient.addColorStop(0.35, '#0f172a');
  bgGradient.addColorStop(0.7, '#131e33');
  bgGradient.addColorStop(1, '#060a12');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle radial glow behind the QR card
  const radialGlow = ctx.createRadialGradient(width / 2, height * 0.62, 50, width / 2, height * 0.62, 550);
  radialGlow.addColorStop(0, `${brandColor}40`);
  radialGlow.addColorStop(0.5, `${brandColor}15`);
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Top Section: Clock Safe Zone Indicator (Dotted subtle guide or clean space)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('• TARJETA DIGITAL EJECUTIVA •', width / 2, 220);
  ctx.restore();

  // 4. Middle Profile Section (Starts around y = 620)
  const profileCenterY = 740;

  // Try to load and draw Avatar if enabled
  if (options.includeAvatar !== false && profile.avatarUrl) {
    const avatarImg = await loadImage(profile.avatarUrl);
    const avatarRadius = 110;
    const avatarY = profileCenterY - 40;

    // Outer brand glow ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, avatarY, avatarRadius + 8, 0, Math.PI * 2);
    ctx.fillStyle = brandColor;
    ctx.shadowColor = brandColor;
    ctx.shadowBlur = 35;
    ctx.fill();
    ctx.restore();

    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        avatarImg,
        width / 2 - avatarRadius,
        avatarY - avatarRadius,
        avatarRadius * 2,
        avatarRadius * 2
      );
      ctx.restore();
    } else {
      // Fallback initial
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 80px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(profile.name.charAt(0).toUpperCase(), width / 2, avatarY);
      ctx.restore();
    }
  }

  // Name
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 20;
  ctx.fillText(profile.name, width / 2, 930);

  // Role & Company
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(profile.role, width / 2, 985);

  ctx.fillStyle = brandColor;
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(profile.company, width / 2, 1030);
  ctx.restore();

  // 5. QR Code Card Container
  const cardWidth = 620;
  const cardHeight = 620;
  const cardX = (width - cardWidth) / 2;
  const cardY = 1110;
  const cardRadius = 42;

  // Draw white rounded card with shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Generate QR Code data URL
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 500,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  const qrImg = await loadImage(qrDataUrl);
  if (qrImg) {
    const qrSize = 520;
    const qrX = cardX + (cardWidth - qrSize) / 2;
    const qrY = cardY + (cardHeight - qrSize) / 2;
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  }

  // 6. Action Callout below QR Card
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Apunta tu cámara para conectar', width / 2, 1800);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Guarda mi contacto directo • Sin instalar apps', width / 2, 1845);
  ctx.restore();

  // 7. Footer Agency Tag
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('TRIBU CREATIVA QRO • TARJETA DIGITAL INTELIGENTE', width / 2, 2220);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/**
 * Helper to download the generated wallpaper directly
 */
export function downloadWallpaperFile(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 150);
}
