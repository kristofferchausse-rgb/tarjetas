import { ParticipantProfile } from '../types/card';

/**
 * Builds an RFC 2426 vCard 3.0 string with full UTF-8 character encoding support.
 * Accents and special Latin characters (á, é, í, ó, ú, ñ, Á, É, Í, Ó, Ú, Ñ) are preserved.
 */
export function generateVCardString(profile: ParticipantProfile, originUrl?: string): string {
  const cardUrl = originUrl || `https://redconecta.mx/c/${profile.publicId}`;
  
  // Parse name components thoughtfully
  const rawName = profile.name.trim();
  const nameParts = rawName.split(/\s+/);
  
  let prefix = '';
  let restOfNames = [...nameParts];
  
  // Check for common professional titles
  if (['Mtra.', 'Mtro.', 'Ing.', 'Lic.', 'Dr.', 'Dra.', 'Arq.', 'CP.'].includes(nameParts[0])) {
    prefix = nameParts[0];
    restOfNames = nameParts.slice(1);
  }
  
  let firstName = '';
  let lastName = '';
  
  if (restOfNames.length === 1) {
    firstName = restOfNames[0];
  } else if (restOfNames.length === 2) {
    firstName = restOfNames[0];
    lastName = restOfNames[1];
  } else {
    // In Mexico, typical naming has 1 or 2 first names and 2 surnames (paterno y materno)
    firstName = restOfNames[0];
    lastName = restOfNames.slice(1).join(' ');
  }

  // Escape special vCard characters (\, ;, ,)
  const sanitize = (text: string) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  };

  const socialLines: string[] = [];
  if (profile.socialLinks?.linkedin) {
    socialLines.push(`X-SOCIALPROFILE;type=linkedin:${sanitize(profile.socialLinks.linkedin)}`);
  }
  if (profile.socialLinks?.instagram) {
    socialLines.push(`X-SOCIALPROFILE;type=instagram:${sanitize(profile.socialLinks.instagram)}`);
  }

  const noteText = [
    profile.valueProp,
    `---`,
    `Tarjeta Digital Oficial: ${cardUrl}`,
    `Diseñado por: Tribu Creativa QRO (https://tribucreativaqro.web.app)`
  ].filter(Boolean).join('\n');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `PRODID:-//Tribu Creativa QRO//Tarjetas Digitales//ES`,
    `FN;CHARSET=UTF-8:${sanitize(profile.name)}`,
    `N;CHARSET=UTF-8:${sanitize(lastName)};${sanitize(firstName)};;${sanitize(prefix)};`,
    `ORG;CHARSET=UTF-8:${sanitize(profile.company)}`,
    `TITLE;CHARSET=UTF-8:${sanitize(profile.role)}`,
    `TEL;TYPE=CELL,VOICE,pref:${profile.phone}`,
    `EMAIL;TYPE=WORK,INTERNET:${sanitize(profile.email)}`,
    `ADR;TYPE=WORK;CHARSET=UTF-8:;;;${sanitize(profile.city)};;;México`,
    `URL:${cardUrl}`,
    `URL;TYPE=CREATOR:https://tribucreativaqro.web.app`,
    ...socialLines,
    `NOTE;CHARSET=UTF-8:${sanitize(noteText)}`,
    `X-COMMUNITY:Tribu Creativa QRO`,
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ];

  return lines.join('\r\n');
}

/**
 * Triggers the browser download of the .vcf file for the given profile.
 */
export function downloadVCardFile(profile: ParticipantProfile, originUrl?: string): boolean {
  try {
    const vcardString = generateVCardString(profile, originUrl);
    // Explicit UTF-8 MIME Blob
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    // Sanitized filename
    const filename = `${profile.publicId || 'contacto'}.vcf`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 150);

    return true;
  } catch (err) {
    console.error('Error generating vCard:', err);
    return false;
  }
}
