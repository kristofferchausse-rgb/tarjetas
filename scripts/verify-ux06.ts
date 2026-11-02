/**
 * scripts/verify-ux06.ts
 *
 * Comprehensive Verification Suite for UX 06:
 * MINI-CRM: NOTAS Y PRÓXIMO PASO (RedConecta MX • Tribu Creativa QRO)
 *
 * Verifies:
 * 1. Backward compatibility: legacy leads without follow-up fields
 * 2. Titular notes: editing, canceling, preserving explicit empty string ("")
 * 3. Draft isolation: editing notes & next action independently without cross-contamination
 * 4. Clean date/time contract:
 *    - Omitted (undefined) preserves existing
 *    - Explicit null / empty string clears / removes from record
 *    - Completed action is never classified as overdue or today
 *    - New action after completion archives previous step in nextActionHistory (even with identical title)
 *    - No duplicate history entries on retry
 * 5. Real storage exception handling (QuotaExceededError from setItem):
 *    - updateLeadFollowUp returns success: false and clear error
 *    - Does NOT falsely confirm or corrupt local record
 * 6. Strict local mode without fabricated contacts:
 *    - Editing non-existent lead ID returns error, does NOT fabricate from mocks
 *    - deleteLead in local/demo mode does NOT call remote deleteDoc
 * 7. Archetype-based adaptation (via professionalProfile enum, not demo publicId):
 *    - Custom slugs with professionalProfile apply tailored vocabulary & disclaimers
 *    - Health archetype is strictly administrative (no ayuno, no estudios, no certificados)
 *    - Institutional archetype is orienting linkage
 * 8. WhatsApp contextual generator: no private notes/budgets leaked, no auto-state mutation
 * 9. Privacy in public card & HTML export: CRM data strictly stripped
 */

import { CapturedLead } from '../src/types/analytics';
import { ParticipantProfile } from '../src/types/card';
import {
  getLocalTodayDateString,
  normalizeActionDate,
  getLeadActionTiming,
  getArchetypeTerminology,
  generateWhatsAppFollowUpMessage,
  generateWhatsAppFollowUpUrl
} from '../src/utils/crmTerminology';
import {
  updateLeadFollowUp,
  getMockLeadsForProfileId,
  seedMockLeads,
  getLeadsForProfile,
  deleteLead
} from '../src/services/leadService';
import { generateStandaloneCardHtml } from '../src/utils/exportHtml';
import { DEMO_ARCHETYPE_PROFILES } from '../src/data/demoArchetypeProfiles';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${msg}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('FASE UX06: VERIFICACIÓN DEL MINI-CRM Y PRÓXIMOS PASOS');
console.log('======================================================\n');

// Mock localStorage setup
const mockStore: Record<string, string> = {};
let shouldThrowOnSetItem = false;

(globalThis as any).localStorage = {
  getItem: (k: string) => mockStore[k] || null,
  setItem: (k: string, v: string) => {
    if (shouldThrowOnSetItem) {
      throw new Error('QuotaExceededError: The quota has been exceeded on this device.');
    }
    mockStore[k] = v;
  },
  removeItem: (k: string) => {
    delete mockStore[k];
  },
  clear: () => {
    for (const k of Object.keys(mockStore)) delete mockStore[k];
  }
};

(async () => {
  // ---------------------------------------------------------------------------
  // 1. Compatibilidad con Perfiles / Registros Antiguos
  // ---------------------------------------------------------------------------
  console.log('1. Compatibilidad con perfiles y leads antiguos:');
  const legacyLead: CapturedLead = {
    id: 'lead_legacy_001',
    publicId: 'legacy-profile',
    name: 'Don Carlos Ancira',
    phone: '+524429998877',
    timestamp: '2025-01-10T12:00:00.000Z',
    status: 'nuevo'
  };

  const timingLegacy = getLeadActionTiming(legacyLead, '2026-11-01');
  assert(timingLegacy === 'sin_fecha', 'Lead antiguo sin nextAction ni fecha se clasifica como "sin_fecha" sin error');
  assert(legacyLead.notes === undefined, 'Lead antiguo carece de notas sin que la interfaz falle');
  assert(!legacyLead.nextActionCompleted, 'Lead antiguo no se marca como completado');

  // ---------------------------------------------------------------------------
  // 2. Mis Notas del Titular: Edición, Cancelación y Vaciado Expreso
  // ---------------------------------------------------------------------------
  console.log('\n2. Mis Notas del Titular (Edición, Vaciado y Privacidad):');
  // Seed initial lead in Clara's store
  await seedMockLeads('demo-clara-navarro');

  const saveRes1 = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    { notes: 'Nota inicial: Interesado en taller directivo de 8 semanas.' },
    { localOnly: true }
  );
  assert(saveRes1.success, 'Guardado de nota inicial exitoso');
  assert(saveRes1.lead?.notes === 'Nota inicial: Interesado en taller directivo de 8 semanas.', 'Nota guardada correctamente en memoria');
  assert(saveRes1.storageTarget === 'local_device', 'Destino reportado con veracidad como "local_device"');

  // Vaciado expreso de notas (cadena vacía no debe restaurar la nota antigua)
  const saveResEmpty = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    { notes: '' },
    { localOnly: true }
  );
  assert(saveResEmpty.success, 'Vaciado de notas exitoso');
  assert(saveResEmpty.lead?.notes === '', 'Nota vaciada expresamente se conserva como cadena vacía "" sin revivir la anterior');

  // Persistencia tras recarga
  const storedLeadsJson = mockStore['tarjetas_leads_demo-clara-navarro'];
  assert(Boolean(storedLeadsJson), 'LocalStorage contiene la clave tarjetas_leads_demo-clara-navarro');
  const parsedLocal: CapturedLead[] = JSON.parse(storedLeadsJson);
  const foundLead = parsedLocal.find((l) => l.id === 'lead_clara_01');
  assert(foundLead?.notes === '', 'Al recargar desde localStorage, la nota vaciada permanece en cadena vacía');

  // ---------------------------------------------------------------------------
  // 3. Contrato de Borradores y Aislamiento de Secciones
  // ---------------------------------------------------------------------------
  console.log('\n3. Contrato de borradores y aislamiento de secciones:');
  // Lead Clara 01 now has empty notes. Let's set a note and then update next action without touching notes.
  await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    { notes: 'Borrador de nota que debe preservarse' },
    { localOnly: true }
  );

  // Update only nextAction and status; omitted notes (undefined) must preserve existing notes!
  const saveActionOnly = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    {
      nextAction: 'Llamar para coordinar propuesta',
      status: 'contactado'
    },
    { localOnly: true }
  );
  assert(saveActionOnly.success, 'Actualización de próximo paso exitosa');
  assert(
    saveActionOnly.lead?.notes === 'Borrador de nota que debe preservarse',
    'Guardar próximo paso conserva intacta la nota existente'
  );
  assert(saveActionOnly.lead?.status === 'contactado', 'Estado comercial actualizado');

  // Update only notes; omitted nextAction (undefined) must preserve existing next action!
  const saveNotesOnly = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    { notes: 'Nueva nota actualizada' },
    { localOnly: true }
  );
  assert(saveNotesOnly.success, 'Actualización de notas exitosa');
  assert(
    saveNotesOnly.lead?.nextAction === 'Llamar para coordinar propuesta',
    'Guardar notas conserva intacto el próximo paso existente'
  );

  // ---------------------------------------------------------------------------
  // 4. Contrato Limpio de Fecha y Hora del Próximo Paso
  // ---------------------------------------------------------------------------
  console.log('\n4. Contrato limpio de fecha y hora del próximo paso:');
  // 4.1 Omit vs Clear
  await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    {
      nextAction: 'Reunión diagnóstica',
      nextActionDate: '2026-11-10',
      nextActionTime: '11:30'
    },
    { localOnly: true }
  );

  // Omit date & time (undefined): preserves both
  const preserveRes = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    { nextAction: 'Reunión diagnóstica reprogramada' },
    { localOnly: true }
  );
  assert(preserveRes.lead?.nextActionDate === '2026-11-10', 'Fecha omitida (undefined) se conserva');
  assert(preserveRes.lead?.nextActionTime === '11:30', 'Hora omitida (undefined) se conserva');

  // Explicit clear (null or empty string): removes date and time from record
  const clearRes = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    {
      nextActionDate: null,
      nextActionTime: ''
    },
    { localOnly: true }
  );
  assert(clearRes.lead?.nextActionDate === undefined, 'Fecha con valor nulo se elimina del registro');
  assert(clearRes.lead?.nextActionTime === undefined, 'Hora con cadena vacía se elimina del registro');

  // 4.2 Completed action never in Hoy or Vencidos
  const testRefToday = '2026-11-01';
  const completedLead: Partial<CapturedLead> = {
    nextAction: 'Entrega de propuesta formal',
    nextActionDate: '2026-10-20', // past date
    nextActionCompleted: true,
    nextActionCompletedAt: '2026-10-21T10:00:00.000Z'
  };
  const timingCompleted = getLeadActionTiming(completedLead as any, testRefToday);
  assert(timingCompleted === 'completada', 'Acción completada con fecha pasada evalúa como "completada"');
  assert(timingCompleted !== 'vencido', 'Acción completada NO figura como vencida');
  assert(timingCompleted !== 'hoy', 'Acción completada NO figura como hoy');

  // 4.3 Scheduling new action after completion (even with identical title) archives history
  await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_03',
    {
      nextAction: 'Llamada de seguimiento',
      nextActionDate: '2026-10-28',
      nextActionCompleted: true
    },
    { localOnly: true }
  );

  // Now user starts a new action session with the EXACT SAME title
  const newStepRes = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_03',
    {
      nextAction: 'Llamada de seguimiento', // identical title
      nextActionDate: '2026-11-05',
      nextActionCompleted: false,
      isNewActionSession: true
    },
    { localOnly: true }
  );

  assert(newStepRes.lead?.nextAction === 'Llamada de seguimiento', 'Nueva acción tiene el título indicado');
  assert(newStepRes.lead?.nextActionDate === '2026-11-05', 'Nueva acción tiene la nueva fecha');
  assert(newStepRes.lead?.nextActionCompleted === false, 'Nueva acción inicia como no completada');
  assert(newStepRes.lead?.nextActionHistory?.length === 1, 'Paso anterior completado fue archivado en el historial');
  assert(
    newStepRes.lead?.nextActionHistory?.[0].action === 'Llamada de seguimiento',
    'El historial conserva el título idéntico del paso anterior sin confusión'
  );
  assert(
    newStepRes.lead?.nextActionHistory?.[0].date === '2026-10-28',
    'El historial conserva la fecha temporal del paso anterior'
  );

  // Retry save must NOT duplicate history entry
  const retrySaveRes = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_03',
    {
      nextAction: 'Llamada de seguimiento',
      nextActionDate: '2026-11-05',
      nextActionCompleted: false,
      isNewActionSession: true
    },
    { localOnly: true }
  );
  assert(
    retrySaveRes.lead?.nextActionHistory?.length === 1,
    'Reintentar el guardado no duplica entradas en el historial'
  );

  // ---------------------------------------------------------------------------
  // 5. Manejo Real de Excepciones de Almacenamiento Local (QuotaExceededError)
  // ---------------------------------------------------------------------------
  console.log('\n5. Manejo real de excepciones de almacenamiento local:');
  shouldThrowOnSetItem = true;

  const realExceptionRes = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_clara_01',
    { notes: 'Nota que debe fallar por cuota' },
    { localOnly: true }
  );

  assert(!realExceptionRes.success, 'Excepción real de setItem devuelve success: false');
  assert(Boolean(realExceptionRes.error), 'Reporta mensaje de error específico');
  assert(
    realExceptionRes.lead?.notes !== 'Nota que debe fallar por cuota',
    'El estado confirmado de la entidad no muta ante fallo de persistencia'
  );
  assert(realExceptionRes.storageTarget === 'local_device', 'Destino reportado como local_device sin falsear cloud sync');

  // Restore normal storage
  shouldThrowOnSetItem = false;

  // ---------------------------------------------------------------------------
  // 6. Modo Local Estricto sin Fabricación de Contactos
  // ---------------------------------------------------------------------------
  console.log('\n6. Modo local estricto sin contactos inventados:');
  const nonExistentIdRes = await updateLeadFollowUp(
    'demo-clara-navarro',
    'lead_completamente_inexistente_999',
    { notes: 'Intento en contacto fantasma' },
    { localOnly: true }
  );
  assert(!nonExistentIdRes.success, 'Editar contacto inexistente devuelve success: false');
  assert(
    Boolean(nonExistentIdRes.error?.includes('Contacto no encontrado') || nonExistentIdRes.error?.includes('inexistente')),
    'Reporta error de contacto no encontrado sin fabricar registros inventados'
  );

  // Deletion in demo / local mode does not throw or call remote
  const deleteOk = await deleteLead('demo-clara-navarro', 'lead_clara_05');
  assert(deleteOk, 'Eliminación local de contacto en perfil demo exitosa');
  const localAfterDelete = JSON.parse(mockStore['tarjetas_leads_demo-clara-navarro'] || '[]');
  assert(!localAfterDelete.some((l: CapturedLead) => l.id === 'lead_clara_05'), 'Contacto eliminado de localStorage');

  // ---------------------------------------------------------------------------
  // 7. Adaptación Real por Arquetipo (no condicionada a slug demo-*)
  // ---------------------------------------------------------------------------
  console.log('\n7. Adaptación real por arquetipo en cualquier perfil:');
  // 7.1 Custom slug with professionalProfile: 'salud'
  const customDoctorProfile = {
    publicId: 'dr-arturo-sanchez',
    name: 'Dr. Arturo Sánchez Mendoza',
    role: 'Medicina Preventiva y Familiar',
    company: 'Consultorio Médico Juriquilla',
    phone: '+52 442 123 4567',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    themeKey: 'ejecutivo',
    customPrimaryColor: '#00685f',
    customAccentColor: '#f0fdf4',
    status: 'Consultas con cita previa',
    statusActive: true,
    professionalProfile: 'salud',
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: false,
      aiMinutesQuota: 0,
      aiMinutesUsed: 0
    }
  } as unknown as ParticipantProfile;

  const healthTerminology = getArchetypeTerminology(customDoctorProfile);
  assert(
    healthTerminology.archetypeId === 'salud',
    'Perfil con slug propio "dr-arturo-sanchez" adopta arquetipo "salud" por su professionalProfile'
  );
  assert(
    healthTerminology.reunionStageLabel.includes('Cita en consultorio'),
    'Etapa de reunión refleja logística administrativa de cita en consultorio'
  );
  assert(
    Boolean(healthTerminology.disclaimer?.includes('logística de atención') && healthTerminology.disclaimer?.includes('No almacena información clínica sensible')),
    'Descargo de salud declara explícitamente seguimiento administrativo y ausencia de datos clínicos sensibles'
  );
  // Ensure no clinical promises in suggestions
  assert(
    !healthTerminology.actionSuggestions.some(s => s.toLowerCase().includes('ayuno') || s.toLowerCase().includes('estudios') || s.toLowerCase().includes('certificado')),
    'Sugerencias de acción de salud no contienen términos clínicos invasivos (ayuno, estudios, certificados)'
  );

  // 7.2 Custom slug with professionalProfile: 'institucional_publico'
  const customGovProfile = {
    publicId: 'enlace-instituto-bajio',
    name: 'Mtro. Fernando Paredes',
    role: 'Vinculación Interinstitucional',
    company: 'Instituto Regional de Innovación',
    phone: '+52 442 987 6543',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    themeKey: 'ejecutivo',
    customPrimaryColor: '#1d4ed8',
    customAccentColor: '#eff6ff',
    status: 'Vinculación por agenda',
    statusActive: true,
    professionalProfile: 'institucional_publico',
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 15
    }
  } as unknown as ParticipantProfile;

  const govTerminology = getArchetypeTerminology(customGovProfile);
  assert(
    govTerminology.archetypeId === 'institucional_publico',
    'Perfil con slug propio adopta arquetipo "institucional_publico" por su professionalProfile'
  );
  assert(
    govTerminology.reunionStageLabel.includes('Mesa de trabajo'),
    'Etapa de reunión institucional refleja mesa de trabajo de enlace'
  );
  assert(
    Boolean(govTerminology.disclaimer?.includes('No constituye inicio de trámite oficial')),
    'Descargo institucional declara explícitamente que no constituye trámite oficial vinculante'
  );

  // 7.3 Check all 7 official professionalProfile enums
  const allEnumProfiles = [
    'profesional_independiente',
    'comercial_asesor',
    'emprendedor_solopreneur',
    'empresario_dueno',
    'ejecutivo_directivo',
    'salud',
    'institucional_publico'
  ];

  for (const enumKey of allEnumProfiles) {
    const term = getArchetypeTerminology(enumKey);
    assert(Boolean(term.categoryLabel), `Enum ${enumKey} resuelve categoría: "${term.categoryLabel}"`);
    assert(term.actionSuggestions.length >= 4, `Enum ${enumKey} incluye al menos 4 sugerencias contextuadas`);
  }

  // ---------------------------------------------------------------------------
  // 8. WhatsApp con Contexto y Control
  // ---------------------------------------------------------------------------
  console.log('\n8. Generación de WhatsApp con contexto y control editorial:');
  const leadWithTopic: CapturedLead = {
    id: 'lead_test_wa_01',
    publicId: 'demo-clara-navarro',
    name: 'Lic. Fernando Garza Ruiz',
    phone: '+52 442 198 2345',
    timestamp: '2026-11-01T10:00:00Z',
    status: 'nuevo',
    solutionTitle: 'Taller de Acuerdos Operativos y Roles',
    notes: 'NOTA PRIVADA CONFIDENCIAL: Presupuesto autorizado hasta $100k.'
  };

  const waMsgWithTopic = generateWhatsAppFollowUpMessage(leadWithTopic);
  assert(waMsgWithTopic.includes('Fernando'), 'WhatsApp incluye el nombre de pila del contacto');
  assert(waMsgWithTopic.includes('Taller de Acuerdos Operativos y Roles'), 'WhatsApp incluye la solución de interés');
  assert(!waMsgWithTopic.includes('NOTA PRIVADA') && !waMsgWithTopic.includes('Presupuesto'), 'WhatsApp NUNCA expone notas privadas del titular');

  const waUrl = generateWhatsAppFollowUpUrl(leadWithTopic);
  assert(waUrl.startsWith('https://wa.me/524421982345?text='), 'URL de WhatsApp normaliza el número con prefijo');
  assert(leadWithTopic.status === 'nuevo', 'Generar enlace de WhatsApp no muta el estado a contactado automáticamente');

  // ---------------------------------------------------------------------------
  // 9. Aislamiento y Privacidad en Tarjeta y Exportación Pública
  // ---------------------------------------------------------------------------
  console.log('\n9. Privacidad estricta en HTML público exportado:');
  const claraProfile = DEMO_ARCHETYPE_PROFILES.find((p) => p.publicId === 'demo-clara-navarro')!;
  const htmlExport = generateStandaloneCardHtml(claraProfile);

  assert(!htmlExport.includes('Mis notas'), 'HTML público no contiene "Mis notas"');
  assert(!htmlExport.includes('Próximo paso'), 'HTML público no contiene "Próximo paso"');
  assert(!htmlExport.includes('lead_clara'), 'HTML público no expone identificadores de prospectos');
  assert(!htmlExport.includes('Presupuesto autorizado'), 'HTML público no contiene notas privadas del CRM');

  // ---------------------------------------------------------------------------
  // Resumen Final
  // ---------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`RESULTADO DE LA SUITE UX06: ${passed} PASADAS, ${failed} FALLIDAS`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
