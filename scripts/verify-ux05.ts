import { DEMO_ARCHETYPE_PROFILES } from '../src/data/demoArchetypeProfiles';
import { INITIAL_PROFILES } from '../src/data/profiles';
import { normalizeNetworkingTarget, normalizeNetworkingTargets, resolvePrimaryAction, getDeduplicatedLinks, normalizeUrlForComparison } from '../src/utils/cardHelpers';
import { generateStandaloneCardHtml } from '../src/utils/exportHtml';
import { ParticipantProfile, CardLink } from '../src/types/card';
import * as fs from 'fs';
import * as path from 'path';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passCount++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failCount++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

console.log('\n======================================================');
console.log('FASE UX05: VERIFICACIÓN INTEGRAL DE NAVEGACIÓN Y FLUJO');
console.log('======================================================\n');

// -----------------------------------------------------------------
// 1. DEDUPLICACIÓN INTELIGENTE DE RECURSOS (LINKS)
// -----------------------------------------------------------------
console.log('--- 1. Deduplicación Inteligente de Enlaces y Recursos (Fixtures A-G) ---');

// Fixture A: La misma URL repetida se consolida
const fixtureA = [
  { label: 'Catálogo Oficial', url: 'https://ejemplo.com/docs/catalogo.pdf' },
  { label: 'Catálogo Espejo', url: 'https://ejemplo.com/docs/catalogo.pdf' }
];
const resA = getDeduplicatedLinks(fixtureA);
assert(resA.length === 1, 'Fixture A: La misma URL repetida se consolida a un único recurso');

// Fixture B: /catalogo?producto=A y /catalogo?producto=B se conservan
const fixtureB = [
  { label: 'Producto Alfa', url: '/catalogo?producto=A' },
  { label: 'Producto Beta', url: '/catalogo?producto=B' }
];
const resB = getDeduplicatedLinks(fixtureB);
assert(resB.length === 2, 'Fixture B: Parámetros funcionales de producto se conservan diferenciados');

// Fixture C: /archivo/AbC y /archivo/abc se conservan
const fixtureC = [
  { label: 'Archivo Sensible Mayúsculas', url: '/archivo/AbC' },
  { label: 'Archivo Minúsculas', url: '/archivo/abc' }
];
const resC = getDeduplicatedLinks(fixtureC);
assert(resC.length === 2, 'Fixture C: Mayúsculas de la ruta se conservan diferenciadas');

// Fixture D: /guia#requisitos y /guia#costos se conservan
const fixtureD = [
  { label: 'Guía: Requisitos', url: '/guia#requisitos' },
  { label: 'Guía: Costos', url: '/guia#costos' }
];
const resD = getDeduplicatedLinks(fixtureD);
assert(resD.length === 2, 'Fixture D: Fragmentos/hash hacia diferentes secciones se conservan');

// Fixture E: Un recurso no desaparece por coincidir con una acción que está oculta o no disponible
// Caso E1: Acción primaria deshabilitada (enabled: false) no elimina el recurso
const profileDisabledPrimary: Partial<ParticipantProfile> = {
  primaryAction: {
    enabled: false,
    actionType: 'custom_link',
    customUrl: 'https://ejemplo.com/registro'
  },
  links: [
    { label: 'Enlace de Registro', url: 'https://ejemplo.com/registro', icon: 'link' }
  ]
};
const primaryDisabled = resolvePrimaryAction(profileDisabledPrimary as ParticipantProfile);
const resE1 = getDeduplicatedLinks(profileDisabledPrimary.links, primaryDisabled, profileDisabledPrimary);
assert(resE1.length === 1, 'Fixture E.1: Enlace no se elimina si la acción principal está deshabilitada');

// Caso E2: Modalidad remota (no renderiza mapa) conserva enlace a Google Maps en recursos
const profileRemoteMaps: Partial<ParticipantProfile> = {
  locationMode: 'remoto',
  googleMapsUrl: 'https://maps.google.com/?q=OficinaVirtual',
  links: [
    { label: 'Mapa de Referencia', url: 'https://maps.google.com/?q=OficinaVirtual', icon: 'link' }
  ]
};
const primaryMock = resolvePrimaryAction(profileRemoteMaps as ParticipantProfile);
const resE2 = getDeduplicatedLinks(profileRemoteMaps.links, primaryMock, profileRemoteMaps);
assert(resE2.length === 1, 'Fixture E.2: Enlace a Maps se conserva si la tarjeta es remota y no muestra mapa en cabecera');

// Fixture F: La tarjeta React y su exportación HTML conservan los mismos recursos pertinentes
const profileF: ParticipantProfile = {
  ...DEMO_ARCHETYPE_PROFILES[0],
  links: [
    { label: 'Recurso Válido 1', url: 'https://ejemplo.com/rec1', icon: 'link' },
    { label: 'Recurso Válido 2', url: 'https://ejemplo.com/rec2', icon: 'link' },
    { label: 'Recurso Repetido', url: 'https://ejemplo.com/rec1', icon: 'link' }
  ]
};
const primaryF = resolvePrimaryAction(profileF);
const reactLinksF = getDeduplicatedLinks(profileF.links, primaryF, profileF);
const htmlF = generateStandaloneCardHtml(profileF);
assert(reactLinksF.length === 2, 'Fixture F: React deduplica correctamente a 2 recursos');
assert(htmlF.includes('Recurso Válido 1') && htmlF.includes('Recurso Válido 2'), 'Fixture F: Exportación HTML conserva ambos recursos');
assert((htmlF.match(/Recurso Válido 1/g) || []).length === 1, 'Fixture F: Exportación HTML no repite el enlace duplicado');

// Fixture G: La URL original de cada recurso sigue intacta
const fixtureG = [
  { label: 'URL Con Mayúsculas y Parámetros', url: 'https://EJEMPLO.com/Ruta/Documento.pdf?Token=XYZ123#seccion2' }
];
const resG = getDeduplicatedLinks(fixtureG);
assert(resG[0].url === 'https://EJEMPLO.com/Ruta/Documento.pdf?Token=XYZ123#seccion2', 'Fixture G: La URL original se conserva exactamente intacta en el objeto devuelto');

// Exclusión de parámetros de seguimiento de marketing (utm_*, fbclid)
assert(
  normalizeUrlForComparison('https://ejemplo.com/articulo?utm_source=twitter&utm_medium=social') ===
  normalizeUrlForComparison('https://ejemplo.com/articulo'),
  'Normalizador: Excluye expresamente parámetros de seguimiento (utm_*) sin alterar la ruta'
);

// -----------------------------------------------------------------
// 2. ORDEN SECUENCIAL Y ARQUITECTURA DE CONTENIDO
// -----------------------------------------------------------------
console.log('\n--- 2. Orden Secuencial del Recorrido Vertical ---');

// Perfil estándar (e.g. clara-navarro: consultoría comercial)
const clara = DEMO_ARCHETYPE_PROFILES.find(p => p.publicId === 'demo-clara-navarro')!;
const isClaraCollaboration =
  clara.primaryAction?.actionType === 'collaboration' ||
  clara.professionalProfile === 'institucional_publico' ||
  clara.professionalProfile === 'ejecutivo_directivo';

assert(isClaraCollaboration === false, 'demo-clara-navarro es un perfil comercial estándar (!isCollaborationOriented)');

// Perfil directivo (e.g. adriana-torres: ejecutiva directiva)
const adriana = DEMO_ARCHETYPE_PROFILES.find(p => p.publicId === 'demo-adriana-torres')!;
const isAdrianaCollaboration =
  adriana.primaryAction?.actionType === 'collaboration' ||
  adriana.professionalProfile === 'institucional_publico' ||
  adriana.professionalProfile === 'ejecutivo_directivo';

assert(isAdrianaCollaboration === true, 'demo-adriana-torres es un perfil de vinculación directiva (isCollaborationOriented)');

// Perfil institucional público (e.g. gabriela-leon: institucional público)
const gabriela = DEMO_ARCHETYPE_PROFILES.find(p => p.publicId === 'demo-gabriela-leon')!;
const isGabrielaCollaboration =
  gabriela.primaryAction?.actionType === 'collaboration' ||
  gabriela.professionalProfile === 'institucional_publico' ||
  gabriela.professionalProfile === 'ejecutivo_directivo';

assert(isGabrielaCollaboration === true, 'demo-gabriela-leon es un perfil institucional público (isCollaborationOriented)');

// -----------------------------------------------------------------
// 3. EXPORTACIÓN HTML ESTÁTICA Y RESPALDO
// -----------------------------------------------------------------
console.log('\n--- 3. Exportación HTML Estática e Inclusión de Testimonios ---');

const claraHtml = generateStandaloneCardHtml(clara);
assert(claraHtml.includes('Soluciones y Casos Documentados') || claraHtml.includes('Servicios y Especialidades'), 'HTML de Clara incluye sección de soluciones');
assert(claraHtml.includes('Cómo se empieza • Proceso de trabajo'), 'HTML de Clara incluye pasos de proceso de trabajo');
assert(claraHtml.includes('Testimonios y Recomendaciones'), 'HTML de Clara incluye sección de testimonios');
assert(claraHtml.includes('Irais Moncada'), 'HTML de Clara incluye autor del testimonio');
assert(claraHtml.includes('Recursos Útiles para Decidir'), 'HTML de Clara incluye recursos útiles deduplicados');
assert(claraHtml.includes('Alianzas y Vinculación Estratégica'), 'HTML de Clara incluye alianzas');
assert(claraHtml.includes('Tecnología de Tarjetas Digitales • Tribu Creativa QRO • RedConecta MX'), 'HTML exportado incluye pie de autoría discreto de RedConecta MX');

// Verificar orden de secciones en HTML para perfil estándar
const claraSolPos = claraHtml.indexOf('Soluciones y Casos Documentados');
const claraTestPos = claraHtml.indexOf('Testimonios y Recomendaciones');
const claraRecPos = claraHtml.indexOf('Recursos Útiles para Decidir');
const claraAllPos = claraHtml.indexOf('Alianzas y Vinculación Estratégica');

assert(claraSolPos < claraTestPos, 'En perfil estándar: Soluciones precede a Testimonios');
assert(claraTestPos < claraRecPos, 'En perfil estándar: Testimonios precede a Recursos Útiles');
assert(claraRecPos < claraAllPos, 'En perfil estándar: Recursos Útiles precede a Alianzas');

// Verificar orden de secciones en HTML para perfil de colaboración
const adrianaHtml = generateStandaloneCardHtml(adriana);
const adrSolPos = adrianaHtml.indexOf('Servicios, Programas y Casos');
const adrAllPos = adrianaHtml.indexOf('Alianzas y Vinculación Estratégica');
const adrProcPos = adrianaHtml.indexOf('Cómo se empieza • Proceso de vinculación');
const adrTestPos = adrianaHtml.indexOf('Testimonios y Respaldos');

assert(adrSolPos !== -1 && adrAllPos !== -1, 'HTML institucional contiene Programas y Alianzas');
assert(adrSolPos < adrAllPos, 'En perfil de colaboración: Programas precede a Alianzas');
assert(adrAllPos < adrProcPos, 'En perfil de colaboración: Alianzas precede a Proceso');
assert(adrProcPos < adrTestPos, 'En perfil de colaboración: Proceso precede a Respaldos');

// -----------------------------------------------------------------
// 4. DISTINCIÓN INEQUÍVOCA DE LAS 4 ACCIONES
// -----------------------------------------------------------------
console.log('\n--- 4. Jerarquía y Distinción Inequívoca de las 4 Acciones ---');

const digitalCardSrc = fs.readFileSync(path.resolve(process.cwd(), 'src/components/DigitalCard.tsx'), 'utf8');

// Acción 1: Guardar contacto (vCard)
assert(digitalCardSrc.includes('onDownloadVCard'), 'Acción 1: invoca onDownloadVCard para descargar vCard');
assert(digitalCardSrc.includes('Guardar contacto en el dispositivo'), 'Acción 1: etiqueta/tooltip clara "Guardar contacto en el dispositivo"');
assert(!digitalCardSrc.includes('Guardado en agenda'), 'Acción 1: no emite falsas afirmaciones de haber sido guardado automáticamente en la agenda del teléfono');

// Acción 2: Compartir tarjeta
assert(digitalCardSrc.includes('handleQuickShare'), 'Acción 2: invoca handleQuickShare para enlace público o modal');
assert(digitalCardSrc.includes('Compartir tarjeta digital'), 'Acción 2: etiqueta explícita "Compartir tarjeta digital"');

// Acción 3: Ver código QR
assert(digitalCardSrc.includes('handleTriggerQR'), 'Acción 3: invoca handleTriggerQR para ver QRModal');
assert(digitalCardSrc.includes('Ver código QR'), 'Acción 3: etiqueta explícita "Ver código QR"');

// Acción 4: Compartir mis datos (Lead Capture)
assert(digitalCardSrc.includes('connectLeadBtn') || digitalCardSrc.includes('Compartir mis datos'), 'Acción 4: botón directo para captar y compartir datos del visitante');
assert(digitalCardSrc.includes("setSelectedLeadContext({ source: 'general' })"), 'Acción 4: establece contexto general de captura');

// -----------------------------------------------------------------
// 5. PIE DE TARJETA, HERRAMIENTAS Y ZONA SEGURA (SAFE AREA)
// -----------------------------------------------------------------
console.log('\n--- 5. Pie de Tarjeta, Herramientas del Titular y Safe Area ---');

assert(digitalCardSrc.includes('pb-36 sm:pb-40'), 'Contenedor principal cuenta con holgura pb-36 sm:pb-40 para que el dock fijo no tape contenido');
assert(digitalCardSrc.includes('env(safe-area-inset-bottom'), 'Dock inferior flotante incluye padding con safe-area-inset-bottom para notch/barras de navegación móviles');
assert(digitalCardSrc.includes('Herramientas del Titular'), 'Acceso a utilidades del titular está agrupado de forma colapsable');
assert(digitalCardSrc.includes('Tecnología de Tarjetas Digitales por'), 'Atribución a Tribu Creativa QRO / RedConecta MX es discreta y elegante');
assert(digitalCardSrc.includes('Aviso de Privacidad (LFPDPPP)'), 'Incluye enlace de cumplimiento normativo a Aviso de Privacidad');
assert(digitalCardSrc.includes('Términos del Servicio'), 'Incluye enlace de cumplimiento normativo a Términos del Servicio');
assert(digitalCardSrc.includes('Derechos ARCO'), 'Incluye enlace de cumplimiento normativo a Derechos ARCO');

// -----------------------------------------------------------------
// 6. SECCIONES VACÍAS NO GENERAN DOM VACÍO (CERO RESIDUOS)
// -----------------------------------------------------------------
console.log('\n--- 6. Verificación de Residuos Nulos en Secciones Vacías ---');

const minimalProfile: ParticipantProfile = {
  uid: 'min-001',
  publicId: 'demo-minimal',
  name: 'Mínimo Ejemplo',
  shortName: 'Mínimo',
  role: 'Especialista',
  company: 'Empresa',
  phone: '4421234567',
  email: 'minimo@ejemplo.com',
  city: 'Querétaro',
  status: 'Disponible',
  published: true,
  statusActive: true,
  verified: true,
  bannerTheme: 'slate',
  valueProp: 'Propuesta concreta de valor',
  avatarUrl: 'https://ejemplo.com/avatar.jpg',
  avatarAlt: 'Foto de Mínimo',
  themeKey: 'ejecutivo',
  professionalProfile: 'profesional_independiente',
  solutions: [], // VACÍO
  networkingTargets: [], // VACÍO
  testimonials: [], // VACÍO
  links: [] // VACÍO
};

const minimalHtml = generateStandaloneCardHtml(minimalProfile);
assert(!minimalHtml.includes('Soluciones y Casos Documentados'), 'Si solutions está vacío, no se imprime título de soluciones');
assert(!minimalHtml.includes('Testimonios y Recomendaciones'), 'Si testimonials está vacío, no se imprime título de testimonios');
assert(!minimalHtml.includes('Recursos Útiles para Decidir'), 'Si links está vacío, no se imprime título de recursos');
assert(!minimalHtml.includes('Alianzas y Vinculación Estratégica'), 'Si networkingTargets está vacío, no se imprime título de alianzas');

console.log('\n======================================================');
console.log(`RESULTADO DE LA SUITE UX05: ${passCount} PASADAS, ${failCount} FALLIDAS`);
console.log('======================================================\n');

if (failCount > 0) {
  process.exit(1);
}
