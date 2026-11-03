import { addManualLead, updateLeadFollowUp, getLeadsForProfile } from '../src/services/leadService';
import { getLocalTodayDateString } from '../src/utils/crmTerminology';

// Mock localStorage for node environment
const mockStorage: Record<string, string> = {};
(globalThis as any).window = (globalThis as any).window || {};
(globalThis as any).window.localStorage = {
  getItem: (key: string) => (key in mockStorage ? mockStorage[key] : null),
  setItem: (key: string, val: string) => { mockStorage[key] = String(val); },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
(globalThis as any).localStorage = (globalThis as any).window.localStorage;

async function runManualLeadsAndAppointmentsTests() {
  console.log('🧪 Verificando Alta Manual de Prospectos y Citas en el CRM...');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, msg: string) {
    total++;
    if (condition) {
      console.log(`  ✅ ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FALLÓ: ${msg}`);
      process.exitCode = 1;
    }
  }

  const testProfileId = 'demo-test-crm-card';
  const todayStr = getLocalTodayDateString();

  // 1. Validación de campos obligatorios
  const emptyNameRes = await addManualLead(testProfileId, {
    name: '',
    phone: '+52 442 123 4567'
  });
  assert(emptyNameRes.success === false, 'Rechaza prospecto sin nombre');

  const emptyPhoneRes = await addManualLead(testProfileId, {
    name: 'Carlos Fuentes',
    phone: ''
  });
  assert(emptyPhoneRes.success === false, 'Rechaza prospecto sin teléfono/WhatsApp');

  // 2. Alta exitosa de prospecto manual regular
  const resLead = await addManualLead(testProfileId, {
    name: 'Ing. Rodrigo Cárdenas',
    phone: '+52 442 888 9900',
    email: 'rodrigo@cardenas.com',
    company: 'Cárdenas Consultores',
    role: 'Socio Director',
    status: 'contactado',
    notes: 'Interesado en 15 tarjetas para su equipo de ventas.'
  });

  assert(resLead.success === true, 'Crea prospecto manual exitosamente');
  assert(Boolean(resLead.lead?.id), 'Genera ID único para el prospecto');
  assert(resLead.lead?.name === 'Ing. Rodrigo Cárdenas', 'Preserva nombre completo');
  assert(resLead.lead?.phone === '+52 442 888 9900', 'Preserva teléfono');
  assert(resLead.lead?.company === 'Cárdenas Consultores', 'Preserva empresa');
  assert(resLead.lead?.status === 'contactado', 'Aplica estado comercial inicial');
  assert(resLead.lead?.notes === 'Interesado en 15 tarjetas para su equipo de ventas.', 'Almacena notas confidenciales');

  // 3. Alta de prospecto manual con CITA programada directamente
  const resLeadWithAppt = await addManualLead(testProfileId, {
    name: 'Dra. Mariana Gómez',
    phone: '+52 442 333 4455',
    company: 'Clínica Bajío',
    role: 'Directora Médica',
    status: 'reunion',
    notes: 'Requiere sesión de demostración del sistema.',
    nextAction: '📍 Cita de valoración y demo',
    nextActionDate: todayStr,
    nextActionTime: '11:30',
    outcome: {
      type: 'cita_confirmada',
      registeredAt: todayStr,
      label: 'Cita de valoración y demo',
      note: 'Confirmada por WhatsApp'
    }
  });

  assert(resLeadWithAppt.success === true, 'Crea prospecto con cita programada');
  assert(resLeadWithAppt.lead?.status === 'reunion', 'Estado comercial es reunion/cita');
  assert(resLeadWithAppt.lead?.nextAction === '📍 Cita de valoración y demo', 'Próximo paso contiene la cita');
  assert(resLeadWithAppt.lead?.nextActionDate === todayStr, 'Fecha de la cita preservada');
  assert(resLeadWithAppt.lead?.nextActionTime === '11:30', 'Hora de la cita preservada');
  assert(resLeadWithAppt.lead?.outcome?.type === 'cita_confirmada', 'Registra hito de cita_confirmada');

  // 4. Agendar cita en un contacto existente
  const updateRes = await updateLeadFollowUp(testProfileId, resLead.lead!.id, {
    status: 'reunion',
    nextAction: '📹 Reunión virtual de cierre',
    nextActionDate: '2026-11-10',
    nextActionTime: '16:00',
    outcome: {
      type: 'cita_confirmada',
      registeredAt: '2026-11-10',
      label: 'Reunión virtual de cierre',
      note: 'Enlace de Meet enviado'
    }
  });

  assert(updateRes.success === true, 'Agenda cita exitosamente en contacto existente');
  assert(updateRes.lead?.status === 'reunion', 'Actualiza estado del contacto a reunión');
  assert(updateRes.lead?.nextAction === '📹 Reunión virtual de cierre', 'Asigna próximo paso con la reunión');
  assert(updateRes.lead?.nextActionDate === '2026-11-10', 'Asigna fecha a la cita existente');
  assert(updateRes.lead?.nextActionTime === '16:00', 'Asigna hora a la cita existente');
  assert(updateRes.lead?.outcome?.type === 'cita_confirmada', 'Registra resultado cita_confirmada');

  // 5. Persistencia y orden de contactos en el CRM
  const allLeads = await getLeadsForProfile(testProfileId);
  assert(allLeads.length === 2, 'Recupera los 2 contactos agregados');
  assert(allLeads[0].name === 'Dra. Mariana Gómez', 'El contacto más reciente aparece primero');

  // 6. Conteo de citas
  const citasCount = allLeads.filter(
    (l) =>
      l.status === 'reunion' ||
      l.outcome?.type === 'cita_confirmada' ||
      Boolean(
        l.nextAction &&
          (l.nextAction.toLowerCase().includes('cita') ||
            l.nextAction.toLowerCase().includes('reuni') ||
            l.nextAction.startsWith('📍') ||
            l.nextAction.startsWith('📹'))
      )
  ).length;

  assert(citasCount === 2, 'Ambos contactos califican correctamente para el filtro de Citas');

  console.log(`\n============================================================`);
  console.log(`TOTAL CASOS ALTA MANUAL & CITAS: ${total} | APROBADOS: ${passed} | FALLIDOS: ${total - passed}`);
  console.log(`============================================================`);
}

runManualLeadsAndAppointmentsTests();
