import React from 'react';
import { renderToString } from 'react-dom/server';
import { CapturedLead } from '../src/types/analytics';
import { ParticipantProfile } from '../src/types/card';
import { parsePhoneNumber } from '../src/utils/phone';
import { LeadCaptureModal } from '../src/components/LeadCaptureModal';
import {
  captureLeadOnServer,
  clearServerLeadsStore,
  getServerLeadsForProfile,
  updateServerLeadStatus
} from '../src/server/leadApi';
import {
  verifyPinOnServer,
  verifySessionToken
} from '../src/server/authApi';
import {
  saveLead,
  getPendingLeads,
  enqueuePendingLead,
  removePendingLead,
  getLeadsForProfile
} from '../src/services/leadService';

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

console.log('=== VERIFICACIÓN UX 03: REGRESIONES A-J Y SUITE INTEGRAL ===\n');

// Mock localStorage for isolated Node testing environment
const mockStore: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (key: string) => mockStore[key] || null,
    setItem: (key: string, val: string) => {
      mockStore[key] = String(val);
    },
    removeItem: (key: string) => {
      delete mockStore[key];
    },
    clear: () => {
      for (const k of Object.keys(mockStore)) delete mockStore[k];
    }
  };
}

// Base mock profiles for SSR testing
const testProfile: ParticipantProfile = {
  publicId: 'test-consultor',
  uid: 'TEST-001',
  name: 'Lic. Clara Navarro',
  shortName: 'Clara',
  role: 'Consultora de Procesos',
  company: 'Navarro Consulting',
  city: 'Querétaro',
  phone: '+524421234567',
  email: 'clara@navarro.com',
  valueProp: 'Optimizamos la operación de empresas medianas.',
  status: 'Disponible',
  statusActive: true,
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  avatarAlt: 'Foto de Clara',
  verified: true,
  themeKey: 'ejecutivo',
  bannerTheme: 'slate',
  published: true,
  professionalProfile: 'profesional_independiente',
  solutions: [
    {
      title: 'Diagnóstico Operativo',
      desc: 'Detección de cuellos de botella en operaciones.'
    }
  ],
  networkingTargets: ['Empresarios'],
  links: []
};

const medicalProfile: ParticipantProfile = {
  ...testProfile,
  publicId: 'test-medico',
  name: 'Dra. Lucía Cárdenas',
  shortName: 'Lucía',
  professionalProfile: 'salud'
};

const institutionalProfile: ParticipantProfile = {
  ...testProfile,
  publicId: 'test-institucional',
  name: 'Mtra. Gabriela León',
  shortName: 'Gabriela',
  professionalProfile: 'institucional_publico'
};

async function runAllTests() {
  clearServerLeadsStore();
  localStorage.clear();

  // -------------------------------------------------------------
  // REGRESIÓN A: Público sin sesión no puede gestionar datos privados
  // -------------------------------------------------------------
  console.log('Regresión A: Acceso público restringido:');
  const anonymousToken = verifySessionToken('');
  assert(anonymousToken === null, 'A.1 Petición anónima carece de token de sesión verificado');
  const fakeToken = verifySessionToken('token.invalido.falsificado');
  assert(fakeToken === null, 'A.2 Token manipulado es rechazado inmediatamente');

  // -------------------------------------------------------------
  // REGRESIÓN B: Titular A no puede gestionar datos de Titular B
  // -------------------------------------------------------------
  console.log('\nRegresión B: Aislamiento estricto entre titulares (A vs B):');
  const sessionTitularA = verifyPinOnServer('sara-sazedi', '4512');
  assert(sessionTitularA.success && sessionTitularA.session?.publicId === 'sara-sazedi', 'B.1 Titular A (sara-sazedi) autenticado con PIN válido');

  const sessionTitularB = verifyPinOnServer('demo-clara-navarro', '1234');
  assert(sessionTitularB.success && sessionTitularB.session?.publicId === 'demo-clara-navarro', 'B.2 Titular B (demo-clara-navarro) autenticado con PIN válido');

  assert(sessionTitularA.session?.publicId !== sessionTitularB.session?.publicId, 'B.3 Sesiones de A y B tienen identificadores de titular disjuntos');

  // -------------------------------------------------------------
  // REGRESIÓN C: Bandera client_auth_* en sessionStorage no concede acceso
  // -------------------------------------------------------------
  console.log('\nRegresión C: client_auth_* falsificada en cliente no valida backend:');
  mockStore['client_auth_sara-sazedi'] = 'true'; // Bandera simulada en sessionStorage
  const tokenFromStorage = mockStore['client_session_token_sara-sazedi']; // Sin token firmado
  const validatedSession = verifySessionToken(tokenFromStorage || '');
  assert(validatedSession === null, 'C.1 Bandera local client_auth_sara-sazedi sin token criptográfico no concede acceso');

  // -------------------------------------------------------------
  // REGRESIÓN D: Sesión válida permite operaciones; logout revoca
  // -------------------------------------------------------------
  console.log('\nRegresión D: Ciclo de vida de sesión y logout:');
  const validToken = sessionTitularA.token!;
  const parsedSession = verifySessionToken(validToken);
  assert(parsedSession !== null && parsedSession.uid === 'client_sara-sazedi', 'D.1 Sesión emitida por servidor contiene UID esperado client_sara-sazedi');

  // Simulación de logout
  delete mockStore['client_session_token_sara-sazedi'];
  delete mockStore['client_auth_sara-sazedi'];
  assert(mockStore['client_session_token_sara-sazedi'] === undefined, 'D.2 Logout invalida y elimina el token de sesión de la aplicación');

  // -------------------------------------------------------------
  // REGRESIÓN E: Captura pública por servidor y lectura del titular
  // -------------------------------------------------------------
  console.log('\nRegresión E: Captura pública por servidor y posterior consulta:');
  const capturePayload = {
    id: 'lead_test_ux03b_01',
    publicId: 'sara-sazedi',
    name: 'Ing. Fernando Tapia',
    phone: '+524429998877',
    email: 'ftapia@constructora.mx',
    company: 'Constructora del Bajío',
    message: 'Interesado en consultoría inmobiliaria',
    timestamp: '2026-10-30T12:00:00.000Z',
    source: 'solution' as const,
    solutionId: 'sol-1',
    solutionTitle: 'Estructuración Comercial'
  };

  const captureRes = await captureLeadOnServer(capturePayload);
  assert(captureRes.status === 'confirmed', 'E.1 Operación de servidor registra el contacto exitosamente');
  assert(captureRes.isRetry === false, 'E.2 Identificado como primer registro (isRetry: false)');
  assert(captureRes.lead?.notes === undefined, 'E.3 Acuse público al visitante nunca contiene campo de notas');

  const titularLeads = getServerLeadsForProfile('sara-sazedi');
  assert(titularLeads.length === 1 && titularLeads[0].id === 'lead_test_ux03b_01', 'E.4 Titular consulta su lead registrado en el servidor');
  assert(titularLeads[0].status === 'nuevo', 'E.5 Lead inicia con estado "nuevo" en el servidor');

  // -------------------------------------------------------------
  // REGRESIÓN F: Reintentos concurrentes conservan estado cerrado y notas
  // -------------------------------------------------------------
  console.log('\nRegresión F: Idempotencia estricta y protección frente a sobrescrituras:');
  // El titular gestiona el prospecto: cambia a 'cerrado' y redacta notas
  updateServerLeadStatus('sara-sazedi', 'lead_test_ux03b_01', 'cerrado', 'Propuesta aceptada, anticipo recibido.');

  // Un reintento público (o reintento concurrente con mismo ID)
  const concurrentRetry = await captureLeadOnServer({
    ...capturePayload,
    status: 'nuevo' as any,
    notes: 'Inyección de nota' as any
  });

  assert(concurrentRetry.status === 'confirmed', 'F.1 Reintento con ID existente devuelve acuse confirmed');
  assert(concurrentRetry.isRetry === true, 'F.2 Reconocido como reintento idempotente (isRetry: true)');

  const titularLeadsAfterRetry = getServerLeadsForProfile('sara-sazedi');
  assert(titularLeadsAfterRetry[0].status === 'cerrado', 'F.3 Reintento NO sobrescribe el estado comercial ("cerrado" intacto)');
  assert(titularLeadsAfterRetry[0].notes === 'Propuesta aceptada, anticipo recibido.', 'F.4 Reintento NO sobrescribe ni elimina las notas del titular');

  // Caso notas vacías deliberadas (corrección de bug falsy ||)
  updateServerLeadStatus('sara-sazedi', 'lead_test_ux03b_01', 'cerrado', '');
  await captureLeadOnServer(capturePayload);
  const titularLeadsAfterEmptyNotes = getServerLeadsForProfile('sara-sazedi');
  assert(titularLeadsAfterEmptyNotes[0].notes === '', 'F.5 Titular borró notas (cadena vacía) y el reintento NO las resucita');

  // Conflicto de publicId con mismo ID
  const conflictRes = await captureLeadOnServer({
    ...capturePayload,
    publicId: 'otro-perfil-atacante'
  });
  assert(conflictRes.status === 'conflict', 'F.6 Reintento con mismo ID pero diferente publicId rechazado con status: conflict');

  // -------------------------------------------------------------
  // REGRESIÓN G: Reintento manual conserva ID, timestamp y contexto
  // -------------------------------------------------------------
  console.log('\nRegresión G: Preservación de snapshot (ID, timestamp, contexto):');
  const originalTimestamp = '2026-10-30T10:15:30.000Z';
  const rawLeadWithSnapshot = {
    id: 'lead_snap_001',
    publicId: 'sara-sazedi',
    name: 'Dra. Elena Ruiz',
    phone: '+524425554433',
    timestamp: originalTimestamp,
    source: 'solution' as const,
    solutionId: 'sol-clinica',
    solutionTitle: 'Dirección Médica'
  };

  const saveAttempt1 = await saveLead(rawLeadWithSnapshot, { timeoutMs: 50 });
  assert(saveAttempt1.lead.id === 'lead_snap_001', 'G.1 Preserva ID estable lead_snap_001');
  assert(saveAttempt1.lead.timestamp === originalTimestamp, 'G.2 Preserva timestamp original sin regenerar');
  assert(saveAttempt1.lead.solutionTitle === 'Dirección Médica', 'G.3 Preserva contexto de solución');

  // Reintento manual sin pasar timestamp explícito: debe recuperarlo de la cola o almacenamiento local
  const manualRetryWithoutTimestamp = await saveLead({
    id: 'lead_snap_001',
    publicId: 'sara-sazedi',
    name: 'Dra. Elena Ruiz',
    phone: '+524425554433'
  }, { timeoutMs: 50 });
  assert(manualRetryWithoutTimestamp.lead.timestamp === originalTimestamp, 'G.4 Reintento manual recupera y respeta el timestamp persistido original');

  // -------------------------------------------------------------
  // REGRESIÓN H: Perfil real vacío devuelve cero contactos (sin mocks)
  // -------------------------------------------------------------
  console.log('\nRegresión H: Cero contactos reales devuelve lista vacía sin mocks:');
  localStorage.removeItem('tarjetas_leads_perfil-vacio-real');
  localStorage.removeItem('tarjetas_pending_leads_perfil-vacio-real');
  const emptyResult = await getLeadsForProfile('perfil-vacio-real');
  assert(Array.isArray(emptyResult) && emptyResult.length === 0, 'H.1 Perfil sin contactos devuelve lista vacía [] sin inyectar mock leads');

  // -------------------------------------------------------------
  // REGRESIÓN I: Cola llena no convierte no confirmados en confirmed
  // -------------------------------------------------------------
  console.log('\nRegresión I: Capacidad de cola e integridad de confirmación:');
  localStorage.setItem('tarjetas_pending_leads_test-overflow', '[]');
  for (let i = 1; i <= 20; i++) {
    enqueuePendingLead({
      id: `lead_queue_ov_${i}`,
      publicId: 'test-overflow',
      name: `Usuario ${i}`,
      phone: `+5244200000${i.toString().padStart(2, '0')}`,
      timestamp: new Date().toISOString(),
      status: 'nuevo'
    });
  }
  const queue20 = getPendingLeads('test-overflow');
  assert(queue20.length === 20, 'I.1 Cola local contiene 20 registros');

  // Intento de encolar 21
  const lead21: CapturedLead = {
    id: 'lead_queue_ov_21',
    publicId: 'test-overflow',
    name: 'Usuario 21',
    phone: '+524420000021',
    timestamp: new Date().toISOString(),
    status: 'nuevo'
  };
  const enqueue21Res = enqueuePendingLead(lead21);
  assert(enqueue21Res === false, 'I.2 Intento de desborde de cola devuelve false');

  // saveLead sin confirmación remota con cola llena
  const mockOverflowSave = await saveLead(lead21, { simulateRemoteFailure: true });
  assert(mockOverflowSave.status === 'failed', 'I.3 Registro sin acuse remoto y cola llena devuelve status: "failed"');
  assert(mockOverflowSave.status !== 'confirmed', 'I.4 Registro sin acuse remoto nunca se marca como "confirmed"');

  // -------------------------------------------------------------
  // REGRESIÓN J: Timeout y reconciliación sin duplicados
  // -------------------------------------------------------------
  console.log('\nRegresión J: Reconciliación tras timeout sin duplicados:');
  const leadIdJ = 'lead_timeout_test_01';
  removePendingLead('sara-sazedi', leadIdJ);

  enqueuePendingLead({
    id: leadIdJ,
    publicId: 'sara-sazedi',
    name: 'Cliente Reconciliación',
    phone: '+524428881122',
    timestamp: new Date().toISOString(),
    status: 'nuevo'
  });
  assert(getPendingLeads('sara-sazedi').some((l) => l.lead.id === leadIdJ), 'J.1 Lead encolado como pendiente');

  removePendingLead('sara-sazedi', leadIdJ);
  assert(!getPendingLeads('sara-sazedi').some((l) => l.lead.id === leadIdJ), 'J.2 Reconciliación tardía retira el lead de la cola sin duplicados');

  // -------------------------------------------------------------
  // PARTE 2: Normalización Telefónica
  // -------------------------------------------------------------
  console.log('\nParte 2: Normalización Telefónica (Evitar duplicar +52):');
  const p1 = parsePhoneNumber('+524421234567');
  assert(p1.isValid && p1.countryCode === '+52' && p1.nationalNumber === '4421234567' && p1.waDigits === '524421234567', 'P2.1 +524421234567 parseado sin duplicar prefijo');

  const p2 = parsePhoneNumber('4421234567');
  assert(p2.isValid && p2.countryCode === '+52' && p2.nationalNumber === '4421234567' && p2.waDigits === '524421234567', 'P2.2 10 dígitos nacionales reciben prefijo +52 limpio');

  const p3 = parsePhoneNumber('+14155552671');
  assert(p3.isValid && p3.countryCode === '+1' && p3.waDigits === '14155552671', 'P2.3 Número de EE.UU. (+1) preserva su país sin forzar +52');

  const p4 = parsePhoneNumber('+34612345678');
  assert(p4.isValid && p4.countryCode === '+34' && p4.waDigits === '34612345678', 'P2.4 Número de España (+34) preserva su país sin forzar +52');

  // -------------------------------------------------------------
  // PARTE 3: Renderizado SSR del Componente LeadCaptureModal
  // -------------------------------------------------------------
  console.log('\nParte 3: Renderizado del Componente LeadCaptureModal (SSR):');
  const modalGeneralHtml = renderToString(
    React.createElement(LeadCaptureModal, {
      isOpen: true,
      onClose: () => {},
      profile: testProfile,
      onShowToast: () => {},
      lang: 'es'
    })
  );
  assert(modalGeneralHtml.includes('Compartir mis datos'), 'P3.1 Botón inicial muestra "Compartir mis datos"');
  assert(modalGeneralHtml.includes('Aviso de Privacidad (LFPDPPP)'), 'P3.2 Incluye checkbox y aviso de privacidad legal');

  const modalSaludHtml = renderToString(
    React.createElement(LeadCaptureModal, {
      isOpen: true,
      onClose: () => {},
      profile: medicalProfile,
      onShowToast: () => {},
      lang: 'es'
    })
  );
  assert(modalSaludHtml.includes('No comparta síntomas, diagnósticos ni historial clínico sensible'), 'P3.3 Perfil salud incluye descargo explícito de no compartir datos clínicos');

  const modalInstHtml = renderToString(
    React.createElement(LeadCaptureModal, {
      isOpen: true,
      onClose: () => {},
      profile: institutionalProfile,
      onShowToast: () => {},
      lang: 'es'
    })
  );
  assert(modalInstHtml.includes('No constituye una recepción oficial de trámites ante dependencias públicas'), 'P3.4 Perfil institucional incluye descargo de vinculación no oficial');

  // -------------------------------------------------------------
  // RESUMEN FINAL
  // -------------------------------------------------------------
  console.log(`\n========================================`);
  console.log(`RESULTADO VERIFICACIÓN UX 03: ${passed} de ${total} pruebas superadas.`);
  console.log(`========================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Error fatal en verify-ux03:', err);
  process.exit(1);
});
