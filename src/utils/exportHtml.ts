import { ParticipantProfile } from '../types/card';
import { generateVCardString } from './vcard';
import { formatVideoEmbedUrl } from './video';

/**
 * Escapes HTML characters to prevent XSS in generated static documents.
 */
function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a completely self-contained, mobile-first, responsive HTML page
 * for any digital card. This file has 0 external dependencies (except Google Fonts & Icons),
 * works on GoDaddy, Apache, cPanel, or local file viewing, and never asks for Google login or cookies.
 */
export function generateStandaloneCardHtml(profile: ParticipantProfile): string {
  const vcardText = generateVCardString(profile, `https://iaconkris.com/c/${profile.publicId}`);
  const vcardBase64 = btoa(unescape(encodeURIComponent(vcardText)));
  const vcardDataUri = `data:text/vcard;charset=utf-8;base64,${vcardBase64}`;

  const primaryColor = profile.customPrimaryColor || (
    profile.themeKey === 'negocio' ? '#00685f' :
    profile.themeKey === 'personal' ? '#ac3400' : '#0f172a'
  );

  const cleanPhone = profile.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    profile.whatsappCustomMessage || `Hola ${profile.shortName || profile.name}, vi tu tarjeta digital y me gustaría conectar.`
  )}`;

  const solutionsHtml = (profile.solutions || []).map((s, idx) => `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
        <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:${primaryColor}15; color:${primaryColor}; font-weight:700; font-size:12px;">${idx + 1}</span>
        <h4 style="margin:0; font-size:14px; font-weight:700; color:#1e293b;">${escapeHtml(s.title)}</h4>
      </div>
      <p style="margin:0; font-size:13px; color:#475569; line-height:1.5;">${escapeHtml(s.desc)}</p>
    </div>
  `).join('');

  const alliancesHtml = (profile.networkingTargets || []).map((t) => `
    <div style="display:flex; align-items:flex-start; gap:10px; padding:12px; background:#f1f5f9; border-radius:12px; margin-bottom:8px;">
      <span style="color:#059669; font-size:16px; font-weight:bold; line-height:1;">✓</span>
      <span style="font-size:13px; color:#334155; line-height:1.4;">${escapeHtml(t)}</span>
    </div>
  `).join('');

  const linksHtml = (profile.links || []).map((l) => `
    <a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:between; padding:14px 16px; background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; text-decoration:none; margin-bottom:8px; transition:transform 0.15s, border-color 0.15s;">
      <span style="font-size:14px; font-weight:600; color:#1e293b; display:flex; align-items:center; gap:10px;">
        <span style="font-size:18px;">🔗</span>
        ${escapeHtml(l.label)}
      </span>
      <span style="font-size:16px; color:#94a3b8; margin-left:auto;">→</span>
    </a>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(profile.name)} • Tarjeta Digital</title>
  <meta name="description" content="${escapeHtml(profile.role)} en ${escapeHtml(profile.company)} • ${escapeHtml(profile.valueProp)}">
  <meta property="og:title" content="${escapeHtml(profile.name)} • Tarjeta Digital">
  <meta property="og:description" content="${escapeHtml(profile.role)} en ${escapeHtml(profile.company)}">
  <meta property="og:image" content="${escapeHtml(profile.avatarUrl)}">
  <meta name="theme-color" content="${primaryColor}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      margin: 0;
      padding: 0;
      background: #0f172a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .card-container {
      width: 100%;
      max-width: 440px;
      min-height: 100vh;
      background: #ffffff;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35);
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .banner {
      width: 100%;
      height: 140px;
      background: ${primaryColor};
      background: linear-gradient(135deg, ${primaryColor} 0%, #0f172a 100%);
      position: relative;
    }
    .avatar-wrapper {
      position: relative;
      margin-top: -60px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .avatar-img {
      width: 110px;
      height: 110px;
      border-radius: 28px;
      border: 4px solid #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
      object-fit: cover;
      background: #e2e8f0;
    }
    .badge-verified {
      background: #10b981;
      color: white;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 8px;
    }
    .card-body {
      padding: 16px 20px 32px 20px;
      flex: 1;
    }
    .person-name {
      font-size: 24px;
      font-weight: 800;
      margin: 8px 0 2px 0;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .person-role {
      font-size: 14px;
      font-weight: 600;
      color: ${primaryColor};
      margin: 0;
    }
    .person-company {
      font-size: 13px;
      color: #64748b;
      margin: 2px 0 12px 0;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #ecfdf5;
      color: #047857;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 18px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }
    .btn-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px;
      border-radius: 16px;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 10px;
      transition: opacity 0.2s;
    }
    .btn-vcard {
      background: ${primaryColor};
      color: #ffffff;
      box-shadow: 0 4px 14px 0 ${primaryColor}40;
    }
    .btn-whatsapp {
      background: #25d366;
      color: #ffffff;
    }
    .quick-actions {
      display: grid;
      grid-cols: 2;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      color: #334155;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 24px 0 10px 0;
    }
    .value-prop-box {
      background: #f8fafc;
      border-left: 4px solid ${primaryColor};
      padding: 14px 16px;
      border-radius: 0 14px 14px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #334155;
      font-weight: 500;
    }
    .footer-note {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 30px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="banner"></div>

    <div class="avatar-wrapper">
      <img src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.avatarAlt)}" class="avatar-img" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'">
      <div>
        ${profile.verified ? '<div class="badge-verified">✓ Verificado</div>' : ''}
      </div>
    </div>

    <div class="card-body">
      <h1 class="person-name">${escapeHtml(profile.name)}</h1>
      <p class="person-role">${escapeHtml(profile.role)}</p>
      <p class="person-company">${escapeHtml(profile.company)} • ${escapeHtml(profile.city)}</p>

      <div class="status-pill">
        <span class="status-dot"></span>
        <span>${escapeHtml(profile.status)}</span>
      </div>

      <!-- Action Buttons -->
      <a href="${vcardDataUri}" download="${escapeHtml(profile.publicId)}.vcf" class="btn-main btn-vcard">
        <span>💾</span>
        <span>Guardar en Contactos</span>
      </a>

      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-main btn-whatsapp">
        <span>💬</span>
        <span>Enviar WhatsApp</span>
      </a>

      <div class="quick-actions">
        <a href="tel:${escapeHtml(profile.phone)}" class="btn-secondary">
          <span>📞</span>
          <span>Llamar</span>
        </a>
        <a href="mailto:${escapeHtml(profile.email)}" class="btn-secondary">
          <span>✉️</span>
          <span>Correo</span>
        </a>
      </div>

      ${profile.valueProp ? `
        <div class="section-title">Propuesta de Valor</div>
        <div class="value-prop-box">
          "${escapeHtml(profile.valueProp)}"
        </div>
      ` : ''}

      ${profile.introVideo?.url ? `
        <div class="section-title">${escapeHtml(profile.introVideo.title || 'Video de Presentación')}</div>
        <div style="position:relative; padding-top:56.25%; width:100%; border-radius:14px; overflow:hidden; margin-bottom:14px; background:#000;">
          <iframe src="${escapeHtml(formatVideoEmbedUrl(profile.introVideo.url, false))}" style="position:absolute; inset:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      ` : ''}

      ${solutionsHtml ? `
        <div class="section-title">Servicios y Especialidades</div>
        <div>${solutionsHtml}</div>
      ` : ''}

      ${alliancesHtml ? `
        <div class="section-title">Alianzas Estratégicas Buscadas</div>
        <div>${alliancesHtml}</div>
      ` : ''}

      ${linksHtml ? `
        <div class="section-title">Enlaces Directos</div>
        <div>${linksHtml}</div>
      ` : ''}

      <div class="footer-note">
        Tarjeta Digital • ${escapeHtml(profile.name)} • iaconkris.com
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Initiates direct download of the standalone HTML card in the user's browser.
 */
export function downloadStandaloneCard(profile: ParticipantProfile): void {
  const htmlContent = generateStandaloneCardHtml(profile);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tarjeta-${profile.publicId}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}
