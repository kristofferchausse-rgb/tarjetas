import {
  getLeadsForProfile,
  updateLeadFollowUp,
  deleteLead,
  seedMockLeads,
  getMockLeadsForProfileId,
  getLocalLeadsEntry
} from '../src/services/leadService';
import {
  getOutcomeTerminology,
  getArchetypeTerminology,
  getLeadActionTiming,
  getLocalTodayDateString
} from '../src/utils/crmTerminology';
import {
  hasCardActivity,
  calculateCardActivitySummary,
  calculateTitularOutcomesSummary,
  formatOutcomeDisplayLabel
} from '../src/utils/metricsCalculations';
import { sanitizeEventLabel, recordActivity, getStoredStats } from '../src/utils/analytics';
import { CapturedLead, LeadOutcome, LeadOutcomeType, CardStats } from '../src/types/analytics';
import { ProfessionalProfileType, ParticipantProfile } from '../src/types/card';

let passed = 0;
let failed = 0;

function assert(cond: boolean, desc: string) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${desc}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${desc}`);
  }
}

// Mock localStorage for isolated deterministic testing
const mockStorage: Record<string, string> = {};
(globalThis as any).window = (globalThis as any).window || {};
(globalThis as any).window.localStorage = {
  getItem: (key: string) => (key in mockStorage ? mockStorage[key] : null),
  setItem: (key: string, val: string) => {
    mockStorage[key] = String(val);
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  }
};
(globalThis as any).localStorage = (globalThis as any).window.localStorage;

async function runTests() {
  console.log('🧪 Iniciando Verificación de Cierre UX07...\n');

  // ==========================================
  // BLOQUE 1: Aislar Demostraciones y Respetar el Vacío ([])
  // ==========================================
  console.log('📋 Bloque 1: Aislar Demostraciones y Respetar el Vacío ([])');
  const demoProfileId = 'demo-clara-navarro';
  const realProfileId = 'sara-sazedi';

  // 1.1 Initial load of demo profile seeds initial mocks
  (globalThis as any).localStorage.removeItem(`tarjetas_leads_${demoProfileId}`);
  const initialDemoLeads = await getLeadsForProfile(demoProfileId);
  assert(initialDemoLeads.length > 0, 'Perfil demo no inicializado carga ejemplos iniciales');

  // 1.2 Delete all demo leads until empty
  for (const l of initialDemoLeads) {
    await deleteLead(demoProfileId, l.id);
  }
  const emptyEntry = getLocalLeadsEntry(demoProfileId);
  assert(emptyEntry.exists === true, 'Clave en localStorage existe tras eliminar todos los leads');
  assert(emptyEntry.leads.length === 0, 'La lista en localStorage es deliberadamente []');

  // 1.3 Reload / query: MUST NOT repopulate []
  const reloadedEmptyLeads = await getLeadsForProfile(demoProfileId);
  assert(reloadedEmptyLeads.length === 0, 'Consultar o recargar una lista demo deliberadamente vacía respeta [] y no la repuebla');

  // 1.4 Explicit restore via seedMockLeads succeeds for demo profiles
  const restoreRes = await seedMockLeads(demoProfileId);
  assert(restoreRes.success === true, 'seedMockLeads explícito en perfil demo tiene éxito');
  assert(restoreRes.leads.length > 0, 'seedMockLeads devuelve los ejemplos restaurados');

  // 1.5 Protect real customer profiles from mock seeding
  const realInitialLeads: CapturedLead[] = [
    {
      id: 'lead_real_01',
      publicId: realProfileId,
      name: 'Cliente Real VIP',
      phone: '+52 442 123 4567',
      timestamp: new Date().toISOString(),
      status: 'nuevo',
      notes: 'Notas reales confidenciales del titular'
    }
  ];
  (globalThis as any).localStorage.setItem(
    `tarjetas_leads_${realProfileId}`,
    JSON.stringify(realInitialLeads)
  );

  const realSeedAttempt = await seedMockLeads(realProfileId);
  assert(realSeedAttempt.success === false, 'seedMockLeads rechaza sobreescribir perfiles que no son demo');
  const preservedRealEntry = getLocalLeadsEntry(realProfileId);
  assert(
    preservedRealEntry.leads.length === 1 && preservedRealEntry.leads[0].name === 'Cliente Real VIP',
    'Los contactos y notas reales del titular permanecen intactos ante intentos de seeding'
  );

  // ==========================================
  // BLOQUE 2: Actividad Observada vs Sintética y Existencia con Cualquier Contador
  // ==========================================
  console.log('\n📋 Bloque 2: Fuentes y Conteos Coherentes de Actividad');

  // 2.1 Profile with only calls/email/calendar/video is NOT "Sin datos"
  const statsOnlyCalls: CardStats = {
    publicId: 'perfil-llamadas',
    views: 0,
    qrScans: 0,
    shares: 0,
    vcardDownloads: 0,
    whatsappClicks: 0,
    callClicks: 3,
    emailClicks: 0,
    calendarClicks: 0,
    linkClicks: 0,
    videoPlays: 0,
    lastActive: new Date().toISOString()
  };
  assert(hasCardActivity(statsOnlyCalls) === true, 'Perfil con solo llamadas registra existencia de actividad (hasCardActivity: true)');
  const summaryCalls = calculateCardActivitySummary(statsOnlyCalls, 'perfil-llamadas');
  assert(summaryCalls.source !== 'none', 'Perfil con llamadas no muestra fuente "none" (no dice "Sin datos registrados")');

  const statsOnlyVideo: CardStats = {
    publicId: 'perfil-video',
    views: 0,
    qrScans: 0,
    shares: 0,
    vcardDownloads: 0,
    whatsappClicks: 0,
    callClicks: 0,
    emailClicks: 0,
    calendarClicks: 0,
    linkClicks: 0,
    videoPlays: 5,
    lastActive: new Date().toISOString()
  };
  assert(hasCardActivity(statsOnlyVideo) === true, 'Perfil con solo reproducciones de video registra actividad');

  // 2.2 Synthetic fixture vs Local observed source separation
  const syntheticStats: CardStats = {
    publicId: 'demo-clara-navarro',
    views: 100,
    qrScans: 40,
    shares: 10,
    vcardDownloads: 20,
    whatsappClicks: 25,
    callClicks: 5,
    emailClicks: 5,
    calendarClicks: 10,
    linkClicks: 15,
    videoPlays: 10,
    lastActive: new Date().toISOString(),
    isSynthetic: true
  };
  const syntheticSummary = calculateCardActivitySummary(syntheticStats);
  assert(syntheticSummary.source === 'synthetic', 'Stats con isSynthetic: true resuelven fuente "synthetic" (Demostración Sintética)');

  const localObservedStats: CardStats = {
    ...syntheticStats,
    isSynthetic: false
  };
  const localSummary = calculateCardActivitySummary(localObservedStats);
  assert(localSummary.source === 'local', 'Stats con eventos locales resuelven fuente "local" (Registrado en este dispositivo)');

  // 2.3 Zero-data profile
  const zeroStats: CardStats = {
    publicId: 'perfil-cero',
    views: 0,
    qrScans: 0,
    shares: 0,
    vcardDownloads: 0,
    whatsappClicks: 0,
    callClicks: 0,
    emailClicks: 0,
    calendarClicks: 0,
    linkClicks: 0,
    videoPlays: 0,
    lastActive: ''
  };
  const zeroSummary = calculateCardActivitySummary(zeroStats);
  assert(zeroSummary.source === 'none', 'Perfil con 0 actividad resuelve fuente "none" (Sin datos registrados)');
  assert(zeroSummary.actionsPer100Views === '—', '0 vistas resuelve ratio como "—"');

  // ==========================================
  // BLOQUE 3: Separación de Procedencia de Resultados y CRM
  // ==========================================
  console.log('\n📋 Bloque 3: Separación de Procedencia CRM y Aislamiento de Mocks');
  // Mixed lead list in a titular profile: should exclude isDemo leads
  const mixedLeads: CapturedLead[] = [
    {
      id: 'lead_real_sale',
      publicId: realProfileId,
      name: 'Venta Real',
      phone: '+52 442 111 2222',
      timestamp: new Date().toISOString(),
      status: 'cerrado',
      outcome: {
        type: 'venta_confirmada',
        label: 'Contrato Anual',
        registeredAt: '2026-11-01'
      }
    },
    {
      id: 'lead_demo_infiltrated',
      publicId: realProfileId,
      name: 'Contacto Falso Demo',
      phone: '+52 442 999 8888',
      timestamp: new Date().toISOString(),
      status: 'cerrado',
      isDemo: true, // Mock lead
      outcome: {
        type: 'venta_confirmada',
        label: 'Venta Falsa',
        registeredAt: '2026-11-01'
      }
    }
  ];

  const titularOutcomeSummary = calculateTitularOutcomesSummary(mixedLeads, false); // Real profile
  assert(
    titularOutcomeSummary.total === 1 && titularOutcomeSummary.byType.venta_confirmada === 1,
    'En perfil de titular real, los contactos isDemo NO inflan los resultados ni el total'
  );

  const demoOutcomeSummary = calculateTitularOutcomesSummary(mixedLeads, true); // Demo scope
  assert(
    demoOutcomeSummary.isDemoScope === true,
    'En perfil demo, el resumen se marca explícitamente con isDemoScope: true'
  );

  // ==========================================
  // BLOQUE 4: Un Solo Significado para Cada Resultado
  // ==========================================
  console.log('\n📋 Bloque 4: Un Solo Significado para Cada Resultado (Cita Acordada y Aceptada)');

  // 4.1 'cita_confirmada' MUST NOT say "realizada" or "completada" in any archetype
  const archetypes: ProfessionalProfileType[] = [
    'salud',
    'institucional_publico',
    'profesional_independiente',
    'comercial_asesor',
    'emprendedor_solopreneur',
    'empresario_dueno',
    'ejecutivo_directivo'
  ];

  for (const arch of archetypes) {
    const term = getOutcomeTerminology('cita_confirmada', arch);
    const labelLower = term.label.toLowerCase();
    const descLower = term.description.toLowerCase();

    assert(!labelLower.includes('realizada') && !labelLower.includes('completada'), `[${arch}] etiqueta cita_confirmada no dice realizada/completada`);
    assert(!descLower.includes('realizada') && !descLower.includes('completada'), `[${arch}] descripción cita_confirmada no dice realizada/completada`);
    assert(
      labelLower.includes('agendada') || labelLower.includes('cita') || labelLower.includes('reunión'),
      `[${arch}] cita_confirmada refleja cita o reunión agendada/acordada`
    );
  }

  // 4.2 Salud retains administrative focus
  const saludTerm = getOutcomeTerminology('cita_confirmada', 'salud');
  assert(
    saludTerm.description.toLowerCase().includes('administrativo') || saludTerm.description.toLowerCase().includes('consultorio'),
    'Salud conserva enfoque administrativo de agenda en consultorio'
  );

  // 4.3 Institucional public liaison focus
  const instTerm = getOutcomeTerminology('cita_confirmada', 'institucional_publico');
  assert(
    instTerm.label.toLowerCase().includes('audiencia') || instTerm.label.toLowerCase().includes('reunión'),
    'Institucional adopta término de reunión o audiencia pública agendada'
  );

  // 4.4 Format outcome display label with fallback
  const outcomeWithoutCustomLabel: LeadOutcome = {
    type: 'cita_confirmada',
    registeredAt: '2026-11-01'
  };
  const formattedWithout = formatOutcomeDisplayLabel(outcomeWithoutCustomLabel, 'salud');
  assert(
    formattedWithout === 'Cita en consultorio agendada',
    'Si outcome.label falta o está vacío, muestra limpiamente el nombre adaptado del tipo'
  );

  const outcomeWithCustomLabel: LeadOutcome = {
    type: 'cita_confirmada',
    label: 'Primera Valoración Dental',
    registeredAt: '2026-11-01'
  };
  const formattedWith = formatOutcomeDisplayLabel(outcomeWithCustomLabel, 'salud');
  assert(
    formattedWith.includes('Cita en consultorio agendada') && formattedWith.includes('Primera Valoración Dental'),
    'Si hay título personalizado, complementa el nombre del tipo'
  );

  // ==========================================
  // BLOQUE 5: Instrumentación Segura y Privacidad de Eventos
  // ==========================================
  console.log('\n📋 Bloque 5: Instrumentación Segura y Privacidad de Eventos');

  // 5.1 Decoys of private data sanitized in telemetry labels
  const dirtyLabel = 'Interesado en cita con Dra. Perez, tel: 442-123-4567, email: paciente@gmail.com, pin: 9999, nota: tratamiento confidencial';
  const sanitized = sanitizeEventLabel(dirtyLabel);
  assert(!sanitized?.includes('442-123-4567'), 'Teléfono señuelo eliminado del label sanitizado');
  assert(!sanitized?.includes('paciente@gmail.com'), 'Email señuelo eliminado del label sanitizado');
  assert(!sanitized?.includes('9999'), 'PIN señuelo eliminado del label sanitizado');
  assert(Boolean(sanitized?.includes('[teléfono protegido]')), 'Reemplazado por marcador de protección');

  // 5.2 Technical deduplication: rapid double invocation (< 800ms)
  const initialViewsSara = getStoredStats()['sara-sazedi']?.views || 0;
  recordActivity('sara-sazedi', 'Sara Sazedi', 'view', 'Vista de Prueba 1');
  const countAfter1 = getStoredStats()['sara-sazedi'].views;
  recordActivity('sara-sazedi', 'Sara Sazedi', 'view', 'Vista de Prueba 1'); // Immediate duplicate
  const countAfter2 = getStoredStats()['sara-sazedi'].views;
  assert(countAfter2 === countAfter1, 'Repetición técnica inmediata (< 800ms) del mismo evento es deduplicada y no suma dos veces');

  // ==========================================
  // BLOQUE 6: Resumen de Resultados
  // ==========================================
  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL CASOS VERIFICADOS UX07: ${passed + failed} | APROBADOS: ${passed} | FALLIDOS: ${failed}`);
  console.log('='.repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Error fatal durante la verificación:', err);
  process.exit(1);
});
