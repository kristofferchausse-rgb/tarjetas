import { ParticipantProfile } from '../types/card';
import { getStablePublicUrl } from './qr';

export const AGENCY_NAME = 'Tribu Creativa QRO';
export const AGENCY_URL = 'https://tribucreativaqro.web.app';
export const AGENCY_TAGLINE = 'Estudio de Diseño de Identidades y Tarjetas Digitales Ejecutivas';

/**
 * Updates DOM head elements (Title, Meta Description, Open Graph, Twitter Cards, Canonical)
 * for optimal SEO and rich preview when sharing the link on WhatsApp, LinkedIn, iMessage, etc.
 */
export function updateCardHeadSEO(profile: ParticipantProfile): void {
  if (typeof document === 'undefined') return;

  const cardUrl = getStablePublicUrl(profile.publicId);
  const title = `${profile.name} — ${profile.role} | ${profile.company}`;
  const summary = profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}. Tarjeta Digital ejecutiva${profile.showLocation !== false && profile.city ? ` en ${profile.city}` : ''}.`;
  const imageUrl = profile.avatarUrl;

  // 1. Document Title
  document.title = title;

  // Helper to set or create a meta tag by name or property
  const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
    let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Search Meta
  setMetaTag('name', 'description', summary);
  const keywords = [
    profile.name,
    profile.shortName,
    profile.role,
    profile.company,
    profile.city,
    'Tarjeta Digital',
    'Networking',
    'vCard 3.0',
    ...(profile.seoKeywords || []),
    ...(profile.solutions?.map((s) => s.title) || [])
  ].filter(Boolean).join(', ');
  setMetaTag('name', 'keywords', keywords);
  setMetaTag('name', 'author', `${profile.name} • Diseñado por ${AGENCY_NAME}`);

  // 3. Open Graph (WhatsApp, Facebook, LinkedIn, iMessage preview)
  setMetaTag('property', 'og:type', 'profile');
  setMetaTag('property', 'og:title', `${profile.name} • ${profile.role}`);
  setMetaTag('property', 'og:description', summary);
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:url', cardUrl);
  setMetaTag('property', 'og:site_name', `${AGENCY_NAME} • Tarjetas Digitales`);

  // 4. Twitter / X Card
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', `${profile.name} • ${profile.role}`);
  setMetaTag('name', 'twitter:description', summary);
  setMetaTag('name', 'twitter:image', imageUrl);

  // 5. Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', cardUrl);

  // 6. JSON-LD Schema for AEO (Answer Engine Optimization) & Google Knowledge Graph
  injectSchemaJsonLd(profile, cardUrl);
}

/**
 * Injects Schema.org JSON-LD structured data with Person, ProfilePage, and Organization backlinks.
 */
function injectSchemaJsonLd(profile: ParticipantProfile, cardUrl: string): void {
  const existingScript = document.getElementById('card-jsonld-schema');
  if (existingScript) {
    existingScript.remove();
  }

  // Gather social links into sameAs
  const sameAsLinks: string[] = [];
  if (profile.websiteUrl) sameAsLinks.push(profile.websiteUrl);
  if (profile.directoryUrl) sameAsLinks.push(profile.directoryUrl);
  if (profile.socialLinks) {
    const s = profile.socialLinks;
    if (s.linkedin) sameAsLinks.push(s.linkedin);
    if (s.instagram) sameAsLinks.push(s.instagram);
    if (s.facebook) sameAsLinks.push(s.facebook);
    if (s.twitter) sameAsLinks.push(s.twitter);
    if (s.youtube) sameAsLinks.push(s.youtube);
    if (s.tiktok) sameAsLinks.push(s.tiktok);
    if (s.github) sameAsLinks.push(s.github);
    if (s.website) sameAsLinks.push(s.website);
  }
  if (profile.links && profile.links.length > 0) {
    for (const l of profile.links) {
      if (l.url && !sameAsLinks.includes(l.url)) {
        sameAsLinks.push(l.url);
      }
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${cardUrl}#person`,
        name: profile.name,
        alternateName: profile.shortName,
        jobTitle: profile.role,
        worksFor: {
          '@type': 'Organization',
          name: profile.company,
          ...(profile.logoUrl ? { logo: profile.logoUrl } : {})
        },
        image: profile.avatarUrl,
        telephone: profile.phone,
        email: profile.email,
        description: profile.valueProp || profile.seoDescription,
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.city,
          addressCountry: 'MX'
        },
        url: cardUrl,
        sameAs: sameAsLinks,
        knowsAbout: profile.solutions?.map((s) => s.title) || []
      },
      {
        '@type': 'Organization',
        '@id': `${AGENCY_URL}/#organization`,
        name: AGENCY_NAME,
        url: AGENCY_URL,
        description: AGENCY_TAGLINE
      },
      {
        '@type': 'ProfilePage',
        '@id': cardUrl,
        url: cardUrl,
        name: `Tarjeta Digital de ${profile.name}`,
        isPartOf: {
          '@type': 'WebSite',
          name: `${AGENCY_NAME} • Tarjetas Digitales`,
          url: AGENCY_URL
        },
        about: { '@id': `${cardUrl}#person` },
        creator: { '@id': `${AGENCY_URL}/#organization` },
        publisher: { '@id': `${AGENCY_URL}/#organization` }
      }
    ]
  };

  const script = document.createElement('script');
  script.id = 'card-jsonld-schema';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

/**
 * Returns formatted sharing text with card summary and viral backlink to Tribu Creativa QRO.
 */
export function getViralSharePayload(profile: ParticipantProfile) {
  const cardUrl = getStablePublicUrl(profile.publicId);
  const summary = profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}`;
  
  const whatsappText = `📇 *${profile.name}* — ${profile.role} en ${profile.company}\n\n"${summary}"\n\n🔗 Conoce mi tarjeta digital y guarda mi contacto directo:\n${cardUrl}\n\n✨ _Diseñada por ${AGENCY_NAME}_ (${AGENCY_URL})`;

  const nativeShareData = {
    title: `${profile.name} • ${profile.role}`,
    text: `${summary} — Tarjeta Digital de ${profile.shortName} creada con ${AGENCY_NAME}:`,
    url: cardUrl
  };

  return {
    cardUrl,
    summary,
    whatsappText,
    nativeShareData
  };
}
