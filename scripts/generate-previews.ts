import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PROFILES } from '../src/data/profiles';
import { ParticipantProfile } from '../src/types/card';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const BASE_HTML_PATH = path.resolve(DIST_DIR, 'index.html');
const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/tribucreativaqro/databases/(default)/documents/profiles';

const BASE_DOMAIN = 'https://tribucreativaqro.web.app';
const AGENCY_NAME = 'Tribu Creativa QRO';
const AGENCY_URL = 'https://tribucreativaqro.web.app';

function parseFirestoreValue(v: any): any {
  if (!v) return undefined;
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return parseInt(v.integerValue, 10);
  if ('doubleValue' in v) return parseFloat(v.doubleValue);
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(parseFirestoreValue);
  if ('mapValue' in v) {
    const res: Record<string, any> = {};
    for (const [k, val] of Object.entries(v.mapValue.fields || {})) {
      res[k] = parseFirestoreValue(val);
    }
    return res;
  }
  return undefined;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function fetchFirestoreProfiles(): Promise<ParticipantProfile[]> {
  try {
    console.log('📡 [Pre-render] Consultando perfiles activos desde Firestore REST API...');
    const res = await fetch(FIRESTORE_URL, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      console.warn(`⚠️ [Pre-render] Firestore REST respondió con status ${res.status}`);
      return [];
    }
    const data = await res.json();
    const documents = data.documents || [];
    const profiles: ParticipantProfile[] = [];

    for (const doc of documents) {
      const p: Record<string, any> = {};
      for (const [k, v] of Object.entries(doc.fields || {})) {
        p[k] = parseFirestoreValue(v);
      }
      if (p.publicId && p.name) {
        profiles.push(p as ParticipantProfile);
      }
    }

    console.log(`✅ [Pre-render] ${profiles.length} perfiles recuperados de Firestore.`);
    return profiles;
  } catch (err) {
    console.warn('⚠️ [Pre-render] No se pudo conectar a Firestore REST (usando datos locales):', err);
    return [];
  }
}

function generatePersonalizedHtml(baseHtml: string, profile: ParticipantProfile): string {
  const cardUrl = `${BASE_DOMAIN}/c/${profile.publicId}`;
  const pageTitle = `${profile.name} — ${profile.role} | ${profile.company}`;
  const ogTitle = `${profile.name} • ${profile.role}`;
  const summary =
    profile.seoDescription ||
    profile.valueProp ||
    `${profile.role} en ${profile.company}. Tarjeta Digital ejecutiva en ${profile.city || 'México'}.`;
  
  const avatarImage =
    profile.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  let html = baseHtml;

  // 1. Title tag
  html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(pageTitle)}</title>`);

  // 2. Standard Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/is,
    `<meta name="description" content="${escapeHtml(summary)}" />`
  );

  // 3. Open Graph Tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:description" content="${escapeHtml(summary)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:url" content="${cardUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:image" content="${escapeHtml(avatarImage)}" />\n    <meta property="og:image:secure_url" content="${escapeHtml(avatarImage)}" />\n    <meta property="og:image:alt" content="Foto de ${escapeHtml(profile.name)}" />\n    <link rel="image_src" href="${escapeHtml(avatarImage)}" />\n    <link rel="canonical" href="${cardUrl}" />`
  );

  // 4. Twitter / X Card
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/is,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/is,
    `<meta name="twitter:description" content="${escapeHtml(summary)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/is,
    `<meta name="twitter:image" content="${escapeHtml(avatarImage)}" />`
  );

  // 4b. Optional og:video tags if introVideo is provided
  if (profile.introVideo?.url) {
    const ytMatch = profile.introVideo.url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    const videoEmbed = ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : profile.introVideo.url;
    const ogVideoTags = `\n    <meta property="og:video" content="${escapeHtml(videoEmbed)}" />\n    <meta property="og:video:secure_url" content="${escapeHtml(videoEmbed)}" />\n    <meta property="og:video:type" content="text/html" />\n    <meta property="og:video:width" content="1280" />\n    <meta property="og:video:height" content="720" />`;
    html = html.replace('</head>', `${ogVideoTags}\n  </head>`);
  }

  // 5. Inject Structured Data JSON-LD for this person
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    worksFor: {
      '@type': 'Organization',
      name: profile.company,
      ...(profile.logoUrl ? { logo: profile.logoUrl } : {})
    },
    image: avatarImage,
    telephone: profile.phone,
    email: profile.email,
    description: summary,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.city || 'México',
      addressCountry: 'MX'
    },
    url: cardUrl
  };

  const schemaScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(personSchema, null, 2)}\n    </script>`;
  html = html.replace('</head>', `${schemaScript}\n  </head>`);

  return html;
}

async function main() {
  console.log('🚀 [Pre-render] Iniciando generación de previews personalizados para WhatsApp / Redes Sociales...');

  if (!fs.existsSync(BASE_HTML_PATH)) {
    console.error(`❌ No se encontró el archivo base en ${BASE_HTML_PATH}. Ejecuta "npm run build" primero.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(BASE_HTML_PATH, 'utf-8');

  // Fetch Firestore profiles and merge with local initial profiles
  const cloudProfiles = await fetchFirestoreProfiles();
  const profilesMap = new Map<string, ParticipantProfile>();

  // Local initial profiles
  for (const p of INITIAL_PROFILES) {
    if (p.publicId) {
      profilesMap.set(p.publicId.toLowerCase(), p);
    }
  }

  // Cloud profiles override local and add new
  for (const cp of cloudProfiles) {
    if (cp.publicId) {
      profilesMap.set(cp.publicId.toLowerCase(), cp);
    }
  }

  const allProfiles = Array.from(profilesMap.values());
  console.log(`📦 [Pre-render] Total de tarjetas a pre-renderizar: ${allProfiles.length}`);

  let generatedCount = 0;

  for (const profile of allProfiles) {
    const publicId = profile.publicId.toLowerCase().trim();
    const personalizedHtml = generatePersonalizedHtml(baseHtml, profile);

    // 1. Directory format: dist/c/<id>/index.html
    const dirPath = path.resolve(DIST_DIR, 'c', publicId);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.resolve(dirPath, 'index.html'), personalizedHtml, 'utf-8');

    // 2. Direct file format: dist/c/<id>.html (ensures match with or without trailing slash)
    fs.writeFileSync(path.resolve(DIST_DIR, 'c', `${publicId}.html`), personalizedHtml, 'utf-8');

    console.log(`  ✨ Pre-renderizado /c/${publicId} -> [${profile.name}] con foto: ${profile.avatarUrl || 'default'}`);
    generatedCount++;
  }

  console.log(`🎉 [Pre-render] ¡Completado exitosamente! Se generaron ${generatedCount} micrositios con Open Graph personalizado.`);
}

main().catch((err) => {
  console.error('❌ Error en script de pre-render:', err);
  process.exit(1);
});
