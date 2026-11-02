/**
 * Batería de Pruebas Automatizadas para FASE UX04:
 * Soluciones, Proceso y Evidencia
 * Tribu Creativa QRO • RedConecta MX
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { DigitalCard } from '../src/components/DigitalCard';
import { DEMO_ARCHETYPE_PROFILES } from '../src/data/demoArchetypeProfiles';
import { generateStandaloneCardHtml } from '../src/utils/exportHtml';
import { ParticipantProfile, CardSolution, CardProcessStep } from '../src/types/card';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

console.log('=== VERIFICACIÓN UX 04: SOLUCIONES, PROCESO Y EVIDENCIA ===\n');

// -----------------------------------------------------------------------------
// SECCIÓN 1: DISTINCIÓN ENTRE OFRECIMIENTO (solucion) Y CASO DOCUMENTADO (caso)
// -----------------------------------------------------------------------------
console.log('1. Distinción entre Solución Ofrecida, Caso Documentado y Entrada Heredada:');

const testSolutions: CardSolution[] = [
  {
    type: 'solucion',
    title: 'Consultoría de Estructura Operativa',
    desc: 'Diseño de responsabilidades para equipos en crecimiento.',
    problem: 'Falta de claridad en quién toma decisiones operativas.',
    intervention: 'Mapeo de flujos críticos y acuerdos de delegación.',
    scope: 'Matriz de decisiones y 3 sesiones de alineación.',
    solution: 'Autonomía de mandos medios y reducción de interrupciones.',
    ctaText: 'Solicitar acompañamiento',
    ctaMessage: 'Hola, me interesa la consultoría operativa.'
  },
  {
    type: 'caso',
    title: 'Reorganización de Centro de Distribución',
    desc: 'Caso real de redistribución de turnos y protocolos de entrega.',
    problem: 'Demoras de 4 horas en despacho durante temporada alta.',
    intervention: 'Reorganización de zonas de picking y checklist de salida.',
    scope: 'Protocolo logístico y capacitación a 12 operarios.',
    solution: 'Despachos completados en tiempo récord sin horas extras.',
    evidenceUrl: 'https://ejemplo.com/casos/cedis-queretaro.pdf',
    evidenceLabel: 'Ficha técnica documentada del caso logístico',
    ctaText: 'Consultar caso similar',
    ctaMessage: 'Hola, vi el caso de Cedis y tengo un reto similar.'
  },
  {
    type: 'sin_clasificar',
    title: 'Atención General de Clientes',
    desc: 'Canal abierto para dudas y solicitudes generales.',
    problem: 'Dudas variadas sobre el servicio.',
    intervention: 'Respuesta y canalización oportuna.',
    ctaText: 'Hacer consulta'
  }
];

const mockProfile: ParticipantProfile = {
  ...DEMO_ARCHETYPE_PROFILES[0],
  solutions: testSolutions,
  processSteps: [
    {
      step: 1,
      title: 'Conversación de encuadre',
      desc: 'Revisamos tu situación actual y determinamos si lo que hago puede ayudarte.',
      expectation: 'Videollamada de 30 min • Sin compromiso'
    },
    {
      step: 2,
      title: 'Diagnóstico y plan de trabajo',
      desc: 'Elaboramos una propuesta con entregables y calendario cerrado.',
      expectation: 'Propuesta formal en 5 días hábiles'
    }
  ]
};

const baseCardProps = {
  onOpenQR: () => {},
  onDownloadVCard: () => {}
};

const renderedHtml = ReactDOMServer.renderToStaticMarkup(
  React.createElement(DigitalCard, { profile: mockProfile, ...baseCardProps })
);

assert(
  renderedHtml.includes('Solución Ofrecida') || renderedHtml.includes('Current Offering'),
  '1.1 Renderiza distintivo explícito de Solución Ofrecida'
);

assert(
  renderedHtml.includes('Caso Documentado') || renderedHtml.includes('Documented Case'),
  '1.2 Renderiza distintivo explícito de Caso Documentado'
);

assert(
  renderedHtml.includes('Reorganización de Centro de Distribución'),
  '1.3 Muestra título del caso documentado'
);

assert(
  renderedHtml.includes('Consultoría de Estructura Operativa'),
  '1.4 Muestra título de la solución ofrecida'
);

// -----------------------------------------------------------------------------
// SECCIÓN 2: READ-BEFORE-EXPAND Y ACCESIBILIDAD ARIA
// -----------------------------------------------------------------------------
console.log('\n2. Lectura Previa (Read-Before-Expand) y Accesibilidad ARIA:');

assert(
  renderedHtml.includes('Diseño de responsabilidades para equipos en crecimiento.'),
  '2.1 El resumen de la solución es legible de inmediato sin necesidad de expandir'
);

assert(
  renderedHtml.includes('Caso real de redistribución de turnos y protocolos de entrega.'),
  '2.2 El resumen del caso documentado es legible de inmediato sin necesidad de expandir'
);

assert(
  !renderedHtml.includes('line-clamp-1') && !renderedHtml.includes('line-clamp-2'),
  '2.3 No utiliza restricciones artificiales de line-clamp en los textos descriptivos'
);

assert(
  renderedHtml.includes('aria-expanded="false"') || renderedHtml.includes('aria-expanded="true"'),
  '2.4 Los botones de acordeón cuentan con atributo semántico aria-expanded'
);

assert(
  renderedHtml.includes('aria-controls="solution-panel-0"'),
  '2.5 El botón de acordeón asocia aria-controls al contenedor expandible'
);

assert(
  renderedHtml.includes('id="solution-header-0"'),
  '2.6 El disparador del acordeón tiene un identificador ID unívoco'
);

assert(
  renderedHtml.includes('focus-visible:ring-2') || renderedHtml.includes('focus-visible:ring-teal-500'),
  '2.7 Los botones cuentan con estilos accesibles de foco de teclado (focus-visible)'
);

// -----------------------------------------------------------------------------
// SECCIÓN 3: BLOQUE DE PROCESO ("Cómo se empieza" / "Cómo trabajamos")
// -----------------------------------------------------------------------------
console.log('\n3. Bloque de Proceso ("Cómo se empieza" / "Cómo trabajamos"):');

assert(
  renderedHtml.includes('Cómo se empieza • Proceso de trabajo'),
  '3.1 El bloque de proceso se renderiza con su encabezado descriptivo'
);

assert(
  renderedHtml.includes('Conversación de encuadre') && renderedHtml.includes('Diagnóstico y plan de trabajo'),
  '3.2 Renderiza los títulos de los pasos secuenciales'
);

assert(
  renderedHtml.includes('Videollamada de 30 min • Sin compromiso'),
  '3.3 Muestra la expectativa y duración orientadora para el visitante'
);

const profileWithoutProcess: ParticipantProfile = {
  ...mockProfile,
  processSteps: undefined
};
const htmlWithoutProcess = ReactDOMServer.renderToStaticMarkup(
  React.createElement(DigitalCard, { profile: profileWithoutProcess, ...baseCardProps })
);

assert(
  !htmlWithoutProcess.includes('Cómo se empieza • Proceso de trabajo'),
  '3.4 Omite limpiamente el bloque de proceso cuando no está definido en el perfil'
);

// -----------------------------------------------------------------------------
// SECCIÓN 4: CONFIANZA Y EVIDENCIA REAL
// -----------------------------------------------------------------------------
console.log('\n4. Confianza y Evidencia Real (Sin Estrellas Ficticias):');

const profileWithUnratedTestimonial: ParticipantProfile = {
  ...mockProfile,
  solutions: [],
  networkingTargets: [],
  testimonials: [
    {
      name: 'Ing. Laura Soto',
      role: 'Directora de Planta',
      company: 'Empresa Aliada',
      comment: 'Excelente acompañamiento en la estructuración de turnos.',
      stars: undefined // Sin estrellas forzadas
    }
  ]
};

const htmlUnrated = ReactDOMServer.renderToStaticMarkup(
  React.createElement(DigitalCard, { profile: profileWithUnratedTestimonial, ...baseCardProps })
);

assert(
  !htmlUnrated.includes('★ 5.0 Verificado'),
  '4.1 No presume falsamente "★ 5.0 Verificado" cuando el testimonio carece de calificación'
);

assert(
  htmlUnrated.includes('Referencias de clientes') || htmlUnrated.includes('Testimonio / Recomendación directa'),
  '4.2 Emplea redacción neutral y respetuosa para testimonios cualitativos sin calificar'
);

const profileWithRatedTestimonial: ParticipantProfile = {
  ...mockProfile,
  solutions: [],
  networkingTargets: [],
  testimonials: [
    {
      name: 'Lic. Andrés Peña',
      role: 'Gerente de Operaciones',
      comment: 'Resolución muy profesional.',
      stars: 4
    }
  ]
};

const htmlRated = ReactDOMServer.renderToStaticMarkup(
  React.createElement(DigitalCard, { profile: profileWithRatedTestimonial, ...baseCardProps })
);

assert(
  htmlRated.includes('4.0'),
  '4.3 Muestra con veracidad la calificación real de 4 estrellas sin forzar 5.0'
);

// -----------------------------------------------------------------------------
// SECCIÓN 5: LOS 7 ARQUETIPOS PROFESIONALES EN DEMO_ARCHETYPE_PROFILES
// -----------------------------------------------------------------------------
console.log('\n5. Adaptación por Arquetipo Profesional (Los 7 perfiles demo):');

const expectedProfiles = [
  { id: 'demo-clara-navarro', role: 'profesional_independiente', name: 'Clara Navarro' },
  { id: 'demo-diego-salas', role: 'comercial_asesor', name: 'Diego Salas' },
  { id: 'demo-renata-vidal', role: 'emprendedor_solopreneur', name: 'Renata Vidal' },
  { id: 'demo-jorge-herrera', role: 'empresario_dueno', name: 'Jorge Herrera' },
  { id: 'demo-adriana-torres', role: 'ejecutivo_directivo', name: 'Adriana Torres' },
  { id: 'demo-lucia-cardenas', role: 'salud', name: 'Dra. Lucía Cárdenas' },
  { id: 'demo-gabriela-leon', role: 'institucional_publico', name: 'Mtra. Gabriela León' }
];

expectedProfiles.forEach((exp, idx) => {
  const profile = DEMO_ARCHETYPE_PROFILES.find((p) => p.publicId === exp.id);
  assert(Boolean(profile), `5.${idx + 1}a Perfil ${exp.name} (${exp.role}) existe en el catálogo demo`);
  if (!profile) return;

  const hasSolution = (profile.solutions || []).some((s) => s.type === 'solucion');
  const hasCase = (profile.solutions || []).some((s) => s.type === 'caso');
  const hasProcess = Boolean(profile.processSteps && profile.processSteps.length >= 2);

  assert(hasSolution, `5.${idx + 1}b ${exp.name} cuenta con al menos una solución ofrecida actual`);
  assert(hasCase, `5.${idx + 1}c ${exp.name} cuenta con al menos un caso documentado verificable`);
  assert(hasProcess, `5.${idx + 1}d ${exp.name} define entre 2 y 3 pasos de proceso de trabajo`);

  const caseItem = (profile.solutions || []).find((s) => s.type === 'caso');
  assert(
    Boolean(caseItem?.evidenceUrl && caseItem?.evidenceLabel),
    `5.${idx + 1}e El caso documentado de ${exp.name} tiene evidenceUrl y evidenceLabel definidos`
  );
});

// Verificaciones éticas específicas para Salud e Institucional
const saludProfile = DEMO_ARCHETYPE_PROFILES.find((p) => p.professionalProfile === 'salud')!;
const saludCase = saludProfile.solutions.find((s) => s.type === 'caso')!;
assert(
  Boolean(saludCase.evidenceUrl?.includes('cedula') || saludCase.evidenceLabel?.includes('Cédula')),
  '5.8 Salud: La evidencia del caso documentado enlaza a Cédula Profesional Oficial sin promesas mágicas'
);

const pubProfile = DEMO_ARCHETYPE_PROFILES.find((p) => p.professionalProfile === 'institucional_publico')!;
const pubCase = pubProfile.solutions.find((s) => s.type === 'caso')!;
assert(
  !pubCase.title.toLowerCase().includes('venta') && !pubProfile.valueProp.toLowerCase().includes('precio'),
  '5.9 Institucional: No realiza venta comercial ni fija precios, enfocado en trámites y vinculación pública'
);

// -----------------------------------------------------------------------------
// SECCIÓN 6: EXPORTACIÓN ESTÁTICA HTML (exportHtml.ts)
// -----------------------------------------------------------------------------
console.log('\n6. Consistencia en Exportación Estática HTML (exportHtml.ts):');

const staticHtml = generateStandaloneCardHtml(mockProfile);

assert(
  staticHtml.includes('Caso Documentado'),
  '6.1 Exportación HTML distingue casos documentados con etiqueta visual'
);

assert(
  staticHtml.includes('Solución Ofrecida'),
  '6.2 Exportación HTML distingue soluciones ofrecidas con etiqueta visual'
);

assert(
  staticHtml.includes('Cómo se empieza • Proceso de trabajo'),
  '6.3 Exportación HTML renderiza el bloque de pasos de proceso'
);

assert(
  staticHtml.includes('Conversación de encuadre'),
  '6.4 Exportación HTML preserva los títulos de los pasos de trabajo'
);

assert(
  staticHtml.includes('Ficha técnica documentada del caso logístico'),
  '6.5 Exportación HTML renderiza el enlace de evidencia con su etiqueta'
);

// -----------------------------------------------------------------------------
// RESUMEN FINAL
// -----------------------------------------------------------------------------
console.log('\n========================================');
console.log(`RESULTADO VERIFICACIÓN UX 04: ${passed} de ${passed + failed} pruebas superadas.`);
if (failed === 0) {
  console.log('ESTADO: UX04 lista para revisión');
} else {
  console.log('ESTADO: UX04 con validaciones pendientes');
}
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
