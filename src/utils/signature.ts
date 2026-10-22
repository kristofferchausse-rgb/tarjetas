import { ParticipantProfile } from '../types/card';
import { getStablePublicUrl } from './qr';

export interface SignatureOptions {
  themeColor?: string;
  layout?: 'modern' | 'compact';
  showQr?: boolean;
}

/**
 * Generates an email signature formatted with table-based, inline CSS
 * ensuring pixel-perfect rendering across Gmail, Outlook, Apple Mail, and mobile.
 */
export function generateHtmlSignature(
  profile: ParticipantProfile,
  options: SignatureOptions = {}
): string {
  const brandColor = options.themeColor || profile.customPrimaryColor || '#00685f';
  const cardUrl = getStablePublicUrl(profile.publicId, false, false);
  const avatarUrl = profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  if (options.layout === 'compact') {
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #1e293b;">
  <tr>
    <td style="padding-right: 14px; vertical-align: top;">
      <img src="${avatarUrl}" alt="${profile.name}" width="60" height="60" style="border-radius: 50%; display: block; object-fit: cover; border: 2px solid ${brandColor};" />
    </td>
    <td style="vertical-align: top; border-left: 2px solid ${brandColor}; padding-left: 14px;">
      <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${profile.name}</div>
      <div style="font-size: 12px; color: ${brandColor}; font-weight: 600; margin-bottom: 4px;">${profile.role} • ${profile.company}</div>
      <div style="font-size: 12px; color: #475569;">
        <span>📱 <a href="tel:${profile.phone}" style="color: #475569; text-decoration: none;">${profile.phone}</a></span>
        <span style="margin: 0 6px;">|</span>
        <span>✉️ <a href="mailto:${profile.email}" style="color: #475569; text-decoration: none;">${profile.email}</a></span>
      </div>
      <div style="margin-top: 8px;">
        <a href="${cardUrl}" target="_blank" style="display: inline-block; background-color: ${brandColor}; color: #ffffff; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
          📇 Ver mi Tarjeta Digital
        </a>
      </div>
    </td>
  </tr>
</table>`;
  }

  // Modern Executive Layout
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.45; color: #1e293b; max-width: 500px;">
  <tr>
    <td style="padding-right: 18px; vertical-align: middle; text-align: center;">
      <img src="${avatarUrl}" alt="${profile.name}" width="82" height="82" style="border-radius: 50%; display: block; object-fit: cover; border: 3px solid ${brandColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.12);" />
      ${profile.logoUrl ? `<img src="${profile.logoUrl}" alt="${profile.company}" height="20" style="margin-top: 6px; display: block; max-width: 82px;" />` : ''}
    </td>
    <td style="vertical-align: middle; border-left: 3px solid ${brandColor}; padding-left: 18px;">
      <div style="font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -0.2px;">${profile.name}</div>
      <div style="font-size: 13px; color: ${brandColor}; font-weight: 700; margin-top: 2px;">${profile.role}</div>
      <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 8px;">${profile.company} • ${profile.city}</div>
      
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #334155;">
        <tr>
          <td style="padding-bottom: 3px;">
            <span style="font-weight: 600; color: #64748b;">WhatsApp / Tel:</span> 
            <a href="tel:${profile.phone}" style="color: #0f172a; font-weight: 600; text-decoration: none;">${profile.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 3px;">
            <span style="font-weight: 600; color: #64748b;">Email:</span> 
            <a href="mailto:${profile.email}" style="color: #0f172a; text-decoration: none;">${profile.email}</a>
          </td>
        </tr>
      </table>

      <div style="margin-top: 10px;">
        <a href="${cardUrl}" target="_blank" style="display: inline-block; background-color: ${brandColor}; color: #ffffff; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: bold; text-decoration: none; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
          📇 Conoce mi Tarjeta Digital & Servicios
        </a>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 10px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 10px;">
      ✨ Tarjeta Digital Ejecutiva creada por <a href="https://tribucreativaqro.web.app" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 600;">Tribu Creativa QRO</a>
    </td>
  </tr>
</table>`;
}

/**
 * Copies rich HTML signature directly into the user's OS clipboard
 */
export async function copySignatureToClipboard(htmlContent: string, plainText: string): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        })
      ]);
      return true;
    }
  } catch (err) {
    console.warn('[Signature] Modern clipboard copy failed, trying DOM fallback:', err);
  }

  // Fallback using invisible contenteditable element
  try {
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNode(container);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      const successful = document.execCommand('copy');
      selection.removeAllRanges();
      document.body.removeChild(container);
      return successful;
    }
    document.body.removeChild(container);
  } catch (err) {
    console.warn('[Signature] Fallback copy failed:', err);
  }

  return false;
}
