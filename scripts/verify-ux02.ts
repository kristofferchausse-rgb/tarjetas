import React from 'react';
import { renderToString } from 'react-dom/server';
import { resolvePrimaryAction, shouldShowPhysicalLocation, getEffectiveCalendarUrl } from '../src/utils/cardHelpers';
import { ParticipantProfile, PrimaryActionConfig } from '../src/types/card';
import { CARD_TRANSLATIONS } from '../src/utils/i18n';
import { DigitalCard } from '../src/components/DigitalCard';
import { generateStandaloneCardHtml } from '../src/utils/exportHtml';

let passed = 0;
let total = 0;

function assert(condition: boolean, desc: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
  }
}

console.log('=== VERIFICACIÓN UX 02 / UX 02A: COMPROBACIÓN EXHAUSTIVA ===\n');

// Base test profile
const baseProfile: ParticipantProfile = {
  publicId: 'test-profile',
  uid: 'TEST-001',
  name: 'Lic. Roberto Morales S.',
  shortName: 'Roberto',
  role: 'Consultor de Estrategia Comercial',
  company: 'Morales & Asociados Consultores',
  city: 'Santiago de Querétaro',
  address: 'Av. Constituyentes 123, Col. Centro',
  googleMapsUrl: 'https://maps.google.com/?q=Queretaro',
  phone: '+524421234567',
  email: 'roberto@moralesconsultores.com',
  valueProp: 'Alineamos equipos de venta B2B para incrementar conversiones complejas en ciclos de 90 días.',
  status: 'Disponible para Proyectos',
  statusActive: true,
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  avatarAlt: 'Foto de Roberto Morales',
  verified: true,
  themeKey: 'ejecutivo',
  bannerTheme: 'slate',
  published: true,
  professionalProfile: 'profesional_independiente',
  customFields: {
    specialty: 'Estrategia Comercial B2B',
    clientType: 'Empresas Medianas',
    serviceScope: 'Nacional y Regional'
  },
  solutions: [
    {
      title: 'Diagnóstico de Pipeline Comercial',
      desc: 'Evaluación cuantitativa y cualitativa del proceso de ventas para detectar fugas de prospectos calificados.',
      problem: 'Ciclos de venta estancados y baja tasa de cierre.',
      solution: 'Reestructuración de embudo y capacitación táctica.'
    }
  ],
  networkingTargets: [
    {
      target: 'Directores Generales de Empresas B2B',
      purpose: 'Vincular programas de consultoría comercial',
      contribution: 'Diagnóstico gratuito de embudo'
    }
  ],
  links: []
};

const t = CARD_TRANSLATIONS.es;

// -------------------------------------------------------------
// 1. Verificación de los 6 tipos de acción (Helper)
// -------------------------------------------------------------
console.log('1. Verificación de los 6 tipos de acción (Helper):');

// 1.1 WhatsApp
const pWhatsapp = { ...baseProfile, primaryAction: { enabled: true, actionType: 'whatsapp' as const } };
const resWa = resolvePrimaryAction(pWhatsapp, t);
assert(resWa.actionType === 'whatsapp' && resWa.isValid && resWa.href.includes('wa.me/524421234567'), 'WhatsApp genera URL válida con waDigits');

// 1.2 Calendar
const pCal = { ...baseProfile, calendarUrl: 'https://calendly.com/test', primaryAction: { enabled: true, actionType: 'calendar' as const } };
const resCal = resolvePrimaryAction(pCal, t);
assert(resCal.actionType === 'calendar' && resCal.isValid && resCal.href === 'https://calendly.com/test', 'Calendar resuelve URL y estado válido');

// 1.3 Collaboration
const pCollab = { ...baseProfile, primaryAction: { enabled: true, actionType: 'collaboration' as const, customUrl: 'https://forms.gle/test' } };
const resCollab = resolvePrimaryAction(pCollab, t);
assert(resCollab.actionType === 'collaboration' && resCollab.isValid && resCollab.href === 'https://forms.gle/test', 'Collaboration resuelve enlace externo y tipo correcto');

// 1.4 Custom Link
const pCustomLink = { ...baseProfile, primaryAction: { enabled: true, actionType: 'custom_link' as const, customUrl: 'example.com/landing' } };
const resCustomLink = resolvePrimaryAction(pCustomLink, t);
assert(resCustomLink.actionType === 'custom_link' && resCustomLink.isValid && resCustomLink.href === 'https://example.com/landing', 'Custom Link añade prefijo https:// y es válido');

// 1.5 Phone
const pPhone = { ...baseProfile, primaryAction: { enabled: true, actionType: 'phone' as const } };
const resPhone = resolvePrimaryAction(pPhone, t);
assert(resPhone.actionType === 'phone' && resPhone.isValid && resPhone.href === 'tel:+524421234567', 'Phone resuelve tel: URI y estado válido');

// 1.6 Email
const pEmail = { ...baseProfile, primaryAction: { enabled: true, actionType: 'email' as const } };
const resEmail = resolvePrimaryAction(pEmail, t);
assert(resEmail.actionType === 'email' && resEmail.isValid && resEmail.href === 'mailto:roberto@moralesconsultores.com', 'Email resuelve mailto: URI y estado válido');

// -------------------------------------------------------------
// 2. Precedencia de etiquetas: customLabel vs label (Helper)
// -------------------------------------------------------------
console.log('\n2. Precedencia de etiquetas (customLabel / label):');

// 2.1 Solo label
const pSoloLabel = { ...baseProfile, primaryAction: { enabled: true, actionType: 'whatsapp' as const, label: 'Etiqueta Canónica' } };
assert(resolvePrimaryAction(pSoloLabel, t).label === 'Etiqueta Canónica', 'Solo label: se respeta label');

// 2.2 Solo customLabel
const pSoloCustom = { ...baseProfile, primaryAction: { enabled: true, actionType: 'whatsapp' as const, customLabel: 'Etiqueta Alias' } };
assert(resolvePrimaryAction(pSoloCustom, t).label === 'Etiqueta Alias', 'Solo customLabel: se reconoce como alias');

// 2.3 Ambos poblados y difieren (preferir customLabel como intención procedente del editor)
const pAmbos = { ...baseProfile, primaryAction: { enabled: true, actionType: 'whatsapp' as const, label: 'Viejo Label', customLabel: 'Nuevo Custom' } };
assert(resolvePrimaryAction(pAmbos, t).label === 'Nuevo Custom', 'Ambos presentes y difieren: se prefiere customLabel');

// 2.4 Borrado de personalización (ambos vacíos -> usa fallback por arquetipo)
const pVacio = { ...baseProfile, primaryAction: { enabled: true, actionType: 'whatsapp' as const, label: '', customLabel: '' } };
assert(resolvePrimaryAction(pVacio, t).label === t.chatWhatsapp, 'Etiquetas vacías: recurre al default sin revivir texto antiguo');

// 2.5 Configuración ausente (perfil legacy sin primaryAction)
const pLegacy = { ...baseProfile, primaryAction: undefined };
const resLegacy = resolvePrimaryAction(pLegacy, t);
assert(resLegacy.enabled === true && resLegacy.actionType === 'whatsapp', 'Perfil legacy sin primaryAction: fallback a WhatsApp activo');

// 2.6 enabled === false explícito
const pDisabled = { ...baseProfile, primaryAction: { enabled: false, actionType: 'whatsapp' as const } };
assert(resolvePrimaryAction(pDisabled, t).enabled === false, 'enabled: false explícito: action marcada como deshabilitada');

// -------------------------------------------------------------
// 3. Manejo de destino no disponible (Helper)
// -------------------------------------------------------------
console.log('\n3. Manejo de destino no disponible:');

// Calendar sin URL
const pCalNoUrl = { ...baseProfile, calendarUrl: '', primaryAction: { enabled: true, actionType: 'calendar' as const } };
const resCalNoUrl = resolvePrimaryAction(pCalNoUrl, t);
assert(resCalNoUrl.isValid === false && resCalNoUrl.href === '', 'Calendar sin URL: isValid es false y href vacío (no genera enlace roto #)');

// Custom link sin URL
const pLinkNoUrl = { ...baseProfile, primaryAction: { enabled: true, actionType: 'custom_link' as const, customUrl: '' } };
const resLinkNoUrl = resolvePrimaryAction(pLinkNoUrl, t);
assert(resLinkNoUrl.isValid === false && resLinkNoUrl.href === '', 'Custom link sin URL: isValid es false y href vacío');

// Phone sin teléfono válido
const pPhoneInvalid = { ...baseProfile, phone: '', primaryAction: { enabled: true, actionType: 'phone' as const } };
const resPhoneInv = resolvePrimaryAction(pPhoneInvalid, t);
assert(resPhoneInv.isValid === false && resPhoneInv.href === '', 'Phone sin teléfono: isValid es false y href vacío');

// Email sin email válido
const pEmailInvalid = { ...baseProfile, email: 'invalido-sin-arroba', primaryAction: { enabled: true, actionType: 'email' as const } };
const resEmailInv = resolvePrimaryAction(pEmailInvalid, t);
assert(resEmailInv.isValid === false && resEmailInv.href === '', 'Email sin arroba: isValid es false y href vacío');

// -------------------------------------------------------------
// 4. Centralización de Modalidad y Ubicación (Helper)
// -------------------------------------------------------------
console.log('\n4. Centralización de Modalidad y Ubicación (Helper):');

// 4.1 remoto con showLocation ausente/undefined
const pRemotoUndef = { ...baseProfile, locationMode: 'remoto' as const, showLocation: undefined };
assert(shouldShowPhysicalLocation(pRemotoUndef) === false, 'remoto con showLocation ausente: oculta ubicación física');

// 4.2 remoto con showLocation true (locationMode tiene precedencia)
const pRemotoTrue = { ...baseProfile, locationMode: 'remoto' as const, showLocation: true };
assert(shouldShowPhysicalLocation(pRemotoTrue) === false, 'remoto con showLocation true: locationMode tiene precedencia y oculta');

// 4.3 presencial con showLocation !== false
const pPresencial = { ...baseProfile, locationMode: 'presencial' as const, showLocation: true };
assert(shouldShowPhysicalLocation(pPresencial) === true, 'presencial con showLocation true: muestra ubicación física');

// 4.4 hibrido con showLocation !== false
const pHibrido = { ...baseProfile, locationMode: 'hibrido' as const, showLocation: true };
assert(shouldShowPhysicalLocation(pHibrido) === true, 'hibrido con showLocation true: muestra ubicación física');

// 4.5 perfil legacy sin locationMode
const pLegacyLoc = { ...baseProfile, locationMode: undefined, showLocation: true };
assert(shouldShowPhysicalLocation(pLegacyLoc) === true, 'legacy sin locationMode y showLocation true: muestra ubicación');

const pLegacyLocOff = { ...baseProfile, locationMode: undefined, showLocation: false };
assert(shouldShowPhysicalLocation(pLegacyLocOff) === false, 'legacy con showLocation false: oculta ubicación');

// -------------------------------------------------------------
// 5. Validación del Componente Renderizado (DigitalCard JSX SSR)
// -------------------------------------------------------------
console.log('\n5. Validación del Componente Renderizado (DigitalCard JSX SSR):');

// 5.1 Etiqueta larga sin restricciones de truncado (no line-clamp-2, no truncate)
const longActionLabel = 'Solicitar consultoría estratégica para optimización comercial y diagnóstico gratuito';
const pLongLabel: ParticipantProfile = {
  ...baseProfile,
  primaryAction: {
    enabled: true,
    actionType: 'whatsapp',
    customLabel: longActionLabel
  }
};

const renderedLongHtml = renderToString(
  React.createElement(DigitalCard, {
    profile: pLongLabel,
    onOpenQR: () => {},
    onDownloadVCard: () => {},
    isStandalone: true
  })
);

assert(
  renderedLongHtml.includes(longActionLabel),
  'Componente: Renderiza el texto completo de la etiqueta larga sin alteración'
);

// Extraer el nodo del botón de la acción principal para validar que no tiene truncado
const actionAnchorIdx = renderedLongHtml.indexOf(longActionLabel);
const actionMarkupSnippet = renderedLongHtml.slice(Math.max(0, actionAnchorIdx - 200), actionAnchorIdx + longActionLabel.length + 100);

assert(
  !actionMarkupSnippet.includes('line-clamp') &&
  !actionMarkupSnippet.includes('truncate') &&
  !actionMarkupSnippet.includes('overflow-hidden') &&
  actionMarkupSnippet.includes('whitespace-normal'),
  'Componente: El texto de la acción principal no tiene restricciones de truncado (sin line-clamp, sin truncate) y permite salto de línea libre con whitespace-normal'
);

// 5.2 Posición y unicidad de valueProp
const valuePropPos = renderedLongHtml.indexOf(baseProfile.valueProp);
const primaryActionPos = renderedLongHtml.indexOf(longActionLabel);
assert(
  valuePropPos !== -1 && primaryActionPos !== -1 && valuePropPos < primaryActionPos,
  'Componente: valueProp aparece físicamente ANTES del grupo de acciones primarias'
);

// Unicidad: valueProp aparece exactamente una sola vez en el DOM
const valuePropMatches = (renderedLongHtml.match(new RegExp(baseProfile.valueProp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
assert(
  valuePropMatches === 1,
  `Componente: valueProp aparece exactamente una sola vez en el DOM (encontrado: ${valuePropMatches})`
);

// 5.3 Modalidad Remoto en Componente: Oculta dirección física y link de mapa en el HTML
const pRemotoComponent: ParticipantProfile = {
  ...baseProfile,
  locationMode: 'remoto',
  showLocation: undefined,
  address: 'Av. Constituyentes 123, Col. Centro',
  googleMapsUrl: 'https://maps.google.com/?q=Queretaro'
};

const renderedRemotoHtml = renderToString(
  React.createElement(DigitalCard, {
    profile: pRemotoComponent,
    onOpenQR: () => {},
    onDownloadVCard: () => {},
    isStandalone: true
  })
);

assert(
  !renderedRemotoHtml.includes('Av. Constituyentes 123') && !renderedRemotoHtml.includes('maps.google.com'),
  'Componente (remoto): Oculta completamente la dirección física y el enlace a Google Maps en el DOM'
);

assert(
  pRemotoComponent.address === 'Av. Constituyentes 123, Col. Centro' && Boolean(pRemotoComponent.googleMapsUrl),
  'Componente (remoto): Los datos almacenados de dirección y mapa se preservan intactos en el modelo'
);

assert(
  renderedRemotoHtml.includes('Servicio en línea') || renderedRemotoHtml.includes('Cobertura nacional'),
  'Componente (remoto): Muestra indicador explícito de servicio en línea / modalidad remota'
);

// 5.4 Modalidad Presencial en Componente: Muestra la ubicación y mapa
const pPresencialComponent: ParticipantProfile = {
  ...baseProfile,
  locationMode: 'presencial',
  showLocation: true,
  address: 'Av. Constituyentes 123, Col. Centro'
};

const renderedPresencialHtml = renderToString(
  React.createElement(DigitalCard, {
    profile: pPresencialComponent,
    onOpenQR: () => {},
    onDownloadVCard: () => {},
    isStandalone: true
  })
);

assert(
  renderedPresencialHtml.includes('Santiago de Querétaro'),
  'Componente (presencial): Muestra la ubicación física del titular'
);

// 5.5 Acción Principal Deshabilitada (enabled: false): No renderiza botón primario, preserva Guardar Contacto
const pDisabledComponent: ParticipantProfile = {
  ...baseProfile,
  primaryAction: {
    enabled: false,
    actionType: 'whatsapp',
    customLabel: 'Boton WhatsApp Deshabilitado'
  }
};

const renderedDisabledHtml = renderToString(
  React.createElement(DigitalCard, {
    profile: pDisabledComponent,
    onOpenQR: () => {},
    onDownloadVCard: () => {},
    isStandalone: true
  })
);

assert(
  !renderedDisabledHtml.includes('Boton WhatsApp Deshabilitado') && (renderedDisabledHtml.includes('Guardar Contacto') || renderedDisabledHtml.includes('Guardar contacto')),
  'Componente (disabled): Omite el botón de acción principal deshabilitado y preserva el botón de Guardar contacto'
);

// 5.6 Destino Inválido (isValid: false): No genera enlace roto #
const pInvalidDestComponent: ParticipantProfile = {
  ...baseProfile,
  calendarUrl: '',
  primaryAction: {
    enabled: true,
    actionType: 'calendar',
    customUrl: ''
  }
};

const renderedInvalidHtml = renderToString(
  React.createElement(DigitalCard, {
    profile: pInvalidDestComponent,
    onOpenQR: () => {},
    onDownloadVCard: () => {},
    isStandalone: true
  })
);

assert(
  !renderedInvalidHtml.includes('href="#"') && !renderedInvalidHtml.includes('href=""'),
  'Componente (destino inválido): No genera botones rotos con href="#" ni href=""'
);

// -------------------------------------------------------------
// 6. Validación de Consistencia con Exportación Estática (exportHtml.ts)
// -------------------------------------------------------------
console.log('\n6. Validación de Consistencia con Exportación Estática (exportHtml.ts):');

const exportedHtml = generateStandaloneCardHtml(pLongLabel);

assert(
  exportedHtml.includes(longActionLabel),
  'Exportación HTML: Renderiza la etiqueta personalizada de la acción principal'
);

const exportValuePropPos = exportedHtml.indexOf(baseProfile.valueProp);
const exportPrimaryPos = exportedHtml.indexOf(longActionLabel);
assert(
  exportValuePropPos !== -1 && exportPrimaryPos !== -1 && exportValuePropPos < exportPrimaryPos,
  'Exportación HTML: valueProp se ubica ANTES de las acciones principales, igual que la vista reactiva'
);

const exportedRemotoHtml = generateStandaloneCardHtml(pRemotoComponent);
assert(
  !exportedRemotoHtml.includes('Av. Constituyentes 123'),
  'Exportación HTML (remoto): Respeta shouldShowPhysicalLocation y oculta la dirección física'
);

// -------------------------------------------------------------
// RESUMEN
// -------------------------------------------------------------
console.log(`\n========================================`);
console.log(`RESULTADO: ${passed} de ${total} pruebas superadas.`);
console.log(`========================================\n`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
