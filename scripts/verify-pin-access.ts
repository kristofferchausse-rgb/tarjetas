import { verifyPinClient } from '../src/services/authClient';
import { INITIAL_PROFILES } from '../src/data/profiles';

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

async function runPinTests() {
  console.log('🧪 Verificando Autenticación por PIN...');
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

  // 1. PIN universal por defecto 1234 funciona para todos los perfiles base
  for (const profile of INITIAL_PROFILES.slice(0, 5)) {
    const res1234 = await verifyPinClient(profile.publicId, '1234', profile);
    assert(res1234.success === true, `PIN universal '1234' autentica a '${profile.name}' (${profile.publicId})`);
  }

  // 2. PIN maestro de agencia 9988 funciona para perfiles
  const sara = INITIAL_PROFILES.find(p => p.publicId === 'sara-sazedi')!;
  const resMaster = await verifyPinClient(sara.publicId, '9988', sara);
  assert(resMaster.success === true, `PIN maestro '9988' autentica a '${sara.name}'`);

  // 3. PIN explícito del perfil funciona
  const diego = INITIAL_PROFILES.find(p => p.publicId === 'demo-diego-salas')!;
  if (diego.pin) {
    const resDiegoPin = await verifyPinClient(diego.publicId, diego.pin, diego);
    assert(resDiegoPin.success === true, `PIN explícito '${diego.pin}' autentica a Diego Salas`);
  }

  // 4. Últimos 4 dígitos del teléfono funcionan
  if (diego.phone) {
    const digits = diego.phone.replace(/\D/g, '').slice(-4);
    const resPhone = await verifyPinClient(diego.publicId, digits, diego);
    assert(resPhone.success === true, `Últimos 4 dígitos del teléfono '${digits}' autentican a Diego Salas`);
  }

  // 5. Perfil nuevo sin PIN ni teléfono previo acepta 1234
  const customProfile = {
    id: 'custom-card-999',
    publicId: 'nueva-tarjeta-creada',
    name: 'Contacto Prueba',
    phone: '',
    pin: '',
  };
  const resCustom1234 = await verifyPinClient(customProfile.publicId, '1234', customProfile as any);
  assert(resCustom1234.success === true, `Tarjeta nueva sin PIN previo acepta '1234'`);

  // 6. PIN inválido arbitrario es rechazado
  const resBad = await verifyPinClient(customProfile.publicId, '0000', customProfile as any);
  assert(resBad.success === false, `PIN incorrecto '0000' es rechazado`);

  console.log(`\n============================================================`);
  console.log(`TOTAL CASOS PIN: ${total} | APROBADOS: ${passed} | FALLIDOS: ${total - passed}`);
  console.log(`============================================================`);
}

runPinTests();
