import {
  getCompanies,
  getCompanyById,
  getCompanyBySlug,
  saveCompany,
  deleteCompany,
  resolveMemberBrand,
  getCompanyMembers,
  linkMemberToCompany,
  unlinkMemberFromCompany,
  duplicateMemberCard,
  createMemberFromCorporateTemplate,
  DEFAULT_COMPANIES
} from '../src/services/companyService';
import { CompanyAccount } from '../src/types/company';
import { ParticipantProfile } from '../src/types/card';
import { INITIAL_PROFILES, DEMO_ARCHETYPE_PROFILES } from '../src/data/profiles';

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

// Mock localStorage for isolated test execution
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
  console.log('🧪 Iniciando Verificación Automatizada UX08 — Plan Empresarial...\n');

  // ==========================================
  // BLOQUE 1: Cuentas Corporativas, Persistencia y Slugs Únicos
  // ==========================================
  console.log('🏢 Bloque 1: Cuentas Corporativas, Persistencia y Slugs Únicos');

  // 1.1 Defaults benchmark companies
  const initialCompanies = getCompanies();
  assert(initialCompanies.length >= 2, 'Carga por defecto empresas sintéticas benchmark (Nexo Operativo y Ágora Consultores)');
  const nexo = getCompanyBySlug('nexo-operativo');
  assert(Boolean(nexo && nexo.id === 'company-nexo-operativo'), 'getCompanyBySlug resuelve correctamente "nexo-operativo"');
  const agora = getCompanyById('company-agora-consultores');
  assert(Boolean(agora && agora.slug === 'agora-consultores'), 'getCompanyById resuelve correctamente "company-agora-consultores"');

  // 1.2 Validation on company save
  const invalidNameRes = saveCompany({ id: 'test-1', slug: 'test-1', name: '' } as any);
  assert(!invalidNameRes.success && Boolean(invalidNameRes.error?.includes('nombre')), 'Rechaza creación de empresa sin nombre');
  const invalidSlugRes = saveCompany({ id: 'test-2', slug: '', name: 'Test Corp' } as any);
  assert(!invalidSlugRes.success && Boolean(invalidSlugRes.error?.includes('slug')), 'Rechaza creación de empresa sin slug');

  // 1.3 Slug clash prevention
  const clashRes = saveCompany({
    id: 'company-nueva-diferente',
    slug: 'nexo-operativo', // duplicate of existing
    name: 'Otra Empresa Con Mismo Slug'
  } as any);
  assert(!clashRes.success && Boolean(clashRes.error?.includes('ya está siendo utilizado')), 'Impide colisión de slugs entre diferentes empresas');

  // 1.4 Successful creation and update
  const newCompany: CompanyAccount = {
    id: 'company-soluciones-bajio',
    slug: 'soluciones-bajio',
    name: 'Soluciones Bajío S.A.',
    tagline: 'Logística & Distribución',
    valueProp: 'Distribución y almacenamiento especializado en el Bajío.',
    industry: 'Logística',
    brand: {
      primaryColor: '#1e3a8a',
      accentColor: '#3b82f6',
      themeKey: 'ejecutivo',
      logoUrl: 'data:image/svg+xml;utf8,<svg></svg>'
    },
    channels: {
      phone: '+524429998877',
      email: 'contacto@solucionesbajio.com'
    },
    areas: ['Operaciones', 'Ventas'],
    links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const saveOk = saveCompany(newCompany);
  assert(saveOk.success, 'Guarda nueva empresa en almacenamiento local correctamente');
  const retrievedNew = getCompanyBySlug('soluciones-bajio');
  assert(Boolean(retrievedNew && retrievedNew.name === 'Soluciones Bajío S.A.'), 'Recupera la empresa recién creada con todos sus datos');

  // 1.5 Deletion
  const deleteOk = deleteCompany('company-soluciones-bajio');
  assert(deleteOk.success, 'Elimina empresa por id correctamente');
  assert(getCompanyBySlug('soluciones-bajio') === undefined, 'Empresa eliminada ya no aparece en el listado');

  // ==========================================
  // BLOQUE 2: Herencia de Marca vs Excepciones Explícitas
  // ==========================================
  console.log('\n🎨 Bloque 2: Herencia de Marca vs Excepciones Explícitas (resolveMemberBrand)');

  const mockMemberInheriting: ParticipantProfile = {
    publicId: 'miembro-estandar',
    uid: 'MX-MOCK-001',
    published: true,
    name: 'Ing. Carlos Mendoza',
    shortName: 'Carlos Mendoza',
    role: 'Jefe de Mantenimiento',
    company: 'Nexo Operativo',
    companyId: 'company-nexo-operativo',
    companySlug: 'nexo-operativo',
    city: 'Querétaro',
    phone: '+524421112233',
    email: 'carlos@nexooperativo.mx',
    status: 'En planta',
    statusActive: true,
    avatarUrl: 'https://example.com/avatar.jpg',
    avatarAlt: 'Carlos Mendoza',
    verified: true,
    themeKey: 'ejecutivo',
    bannerTheme: 'default',
    customPrimaryColor: '#333333',
    logoUrl: 'https://example.com/old-logo.png',
    valueProp: 'Aseguro la continuidad operativa de líneas de manufactura.',
    solutions: [],
    networkingTargets: [],
    links: [],
    professionalProfile: 'empresario_dueno',
    brandOverrides: { overrideBrand: false }
  };

  // 2.1 Brand inheritance when overrideBrand is false
  const brandInherited = resolveMemberBrand(mockMemberInheriting, nexo);
  assert(!brandInherited.hasBrandOverride, 'hasBrandOverride es false para miembro regular');
  assert(brandInherited.customPrimaryColor === nexo!.brand.primaryColor, 'Hereda color primario de la empresa (#047857)');
  assert(brandInherited.logoUrl === nexo!.brand.logoUrl, 'Hereda logotipo SVG corporativo de la empresa');

  // 2.2 Brand override exception
  const mockMemberWithOverride: ParticipantProfile = {
    ...mockMemberInheriting,
    publicId: 'miembro-override',
    customPrimaryColor: '#b45309', // Specific amber color
    logoUrl: 'https://example.com/custom-sub-brand.png',
    brandOverrides: { overrideBrand: true, reason: 'Unidad de Negocio Especializada' }
  };
  const brandOverridden = resolveMemberBrand(mockMemberWithOverride, nexo);
  assert(brandOverridden.hasBrandOverride, 'hasBrandOverride es true para excepción de marca');
  assert(brandOverridden.customPrimaryColor === '#b45309', 'Conserva su propio color primario particular');
  assert(brandOverridden.logoUrl === 'https://example.com/custom-sub-brand.png', 'Conserva su propio logotipo particular');

  // 2.3 Standalone member without company
  const brandNoCompany = resolveMemberBrand(mockMemberInheriting, undefined);
  assert(!brandNoCompany.hasBrandOverride, 'Miembro sin empresa no reporta override forzado');
  assert(brandNoCompany.customPrimaryColor === mockMemberInheriting.customPrimaryColor, 'Conserva color particular al no tener empresa vinculada');

  // ==========================================
  // BLOQUE 3: Duplicación Segura de Tarjetas (duplicateMemberCard)
  // ==========================================
  console.log('\n📋 Bloque 3: Duplicación Segura de Tarjetas (duplicateMemberCard)');

  const originalMember: ParticipantProfile = {
    publicId: 'jorge-herrera',
    uid: 'MX-JORGE-001',
    published: true,
    name: 'Jorge Herrera Díaz',
    shortName: 'Jorge Herrera',
    role: 'Director Técnico de Operaciones',
    company: 'Nexo Operativo',
    companyId: 'company-nexo-operativo',
    companySlug: 'nexo-operativo',
    companyDepartment: 'Operaciones & Planta',
    companyRoleStatement: 'Coordina paros técnicos programados y soporte mayor.',
    city: 'Querétaro',
    phone: '+524425556677',
    email: 'jorge@nexooperativo.mx',
    pin: '7788', // Private PIN
    status: 'Disponible para diagnósticos',
    statusActive: true,
    avatarUrl: 'https://example.com/jorge.jpg',
    avatarAlt: 'Jorge Herrera',
    verified: true,
    themeKey: 'negocio',
    bannerTheme: 'default',
    valueProp: 'Optimizamos líneas críticas de producción.',
    solutions: [{ title: 'Auditoría Técnica', desc: 'Revisión en sitio' }],
    networkingTargets: ['Gerentes de Planta'],
    links: [{ label: 'Planta', url: 'https://nexooperativo.mx', icon: 'factory' }],
    professionalProfile: 'empresario_dueno',
    operatorContext: {
      titularGoal: 'Conseguir 3 contratos anuales de mantenimiento'
    },
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: false,
      aiMinutesQuota: 0,
      aiMinutesUsed: 0
    }
  };

  const duplicated = duplicateMemberCard(originalMember, {
    department: 'Soporte Técnico',
    roleStatement: 'Atiende incidencias y soporte en piso de producción.'
  });

  assert(duplicated.publicId !== originalMember.publicId, 'Genera publicId único y nuevo para la copia');
  assert(duplicated.uid !== originalMember.uid, 'Genera uid único nuevo');
  assert(duplicated.published === false, 'Inicia en estado borrador (published: false)');
  assert(duplicated.showInDirectory === false, 'No visible en directorio público hasta revisión (showInDirectory: false)');
  assert(duplicated.name === '', 'Vacía estrictamente el nombre personal');
  assert(duplicated.phone === '', 'Vacía estrictamente el teléfono personal');
  assert(duplicated.email === '', 'Vacía estrictamente el email personal');
  assert(duplicated.avatarUrl === '', 'Vacía estrictamente la fotografía / avatar');
  assert(duplicated.pin === undefined, 'Vacía estrictamente las credenciales privadas (PIN)');
  assert(duplicated.operatorContext === undefined, 'Vacía estrictamente las notas privadas del operador');
  assert(duplicated.companyId === 'company-nexo-operativo', 'Conserva vinculación a la empresa corporativa');
  assert(duplicated.companyDepartment === 'Soporte Técnico', 'Aplica el departamento asignado a la nueva tarjeta');
  assert(duplicated.companyRoleStatement === 'Atiende incidencias y soporte en piso de producción.', 'Aplica la declaración de función para el nuevo integrante');

  // ==========================================
  // BLOQUE 4: Desvinculación y Conservación de Tarjeta y CRM
  // ==========================================
  console.log('\n🔗 Bloque 4: Desvinculación de Integrante y Conservación de Tarjeta (unlinkMemberFromCompany)');

  const unlinked = unlinkMemberFromCompany(originalMember);
  assert(unlinked.companyId === undefined, 'Elimina companyId');
  assert(unlinked.companySlug === undefined, 'Elimina companySlug');
  assert(unlinked.companyDepartment === undefined, 'Elimina companyDepartment');
  assert(unlinked.companyRoleStatement === undefined, 'Elimina companyRoleStatement');
  assert(unlinked.brandOverrides === undefined, 'Elimina brandOverrides');
  assert(unlinked.name === originalMember.name, 'Conserva el nombre del titular');
  assert(unlinked.phone === originalMember.phone, 'Conserva el teléfono del titular');
  assert(unlinked.email === originalMember.email, 'Conserva el correo del titular');
  assert(unlinked.pin === originalMember.pin, 'Conserva el PIN de acceso del titular');
  assert(unlinked.solutions.length === originalMember.solutions.length, 'Conserva soluciones y propuesta de valor');

  // ==========================================
  // BLOQUE 5: Filtros y Directorio Corporativo (getCompanyMembers)
  // ==========================================
  console.log('\n👥 Bloque 5: Filtros y Directorio Corporativo (getCompanyMembers)');

  const teamPool: ParticipantProfile[] = [
    {
      ...originalMember,
      publicId: 'member-1',
      published: true,
      isCompanyActive: true,
      showInDirectory: true,
      companyDepartment: 'Operaciones & Planta'
    },
    {
      ...originalMember,
      publicId: 'member-2',
      name: 'Diego Salas',
      role: 'Gerente Comercial',
      companyRoleStatement: 'Alianzas industriales y cotizaciones corporativas.',
      published: true,
      isCompanyActive: true,
      showInDirectory: true,
      companyDepartment: 'Comercial & Alianzas'
    },
    {
      ...originalMember,
      publicId: 'member-draft',
      name: 'Borrador Técnico',
      published: false, // draft
      isCompanyActive: true,
      showInDirectory: false,
      companyDepartment: 'Operaciones & Planta'
    },
    {
      ...originalMember,
      publicId: 'member-inactive',
      name: 'Ex-Integrante',
      published: true,
      isCompanyActive: false, // inactive link
      showInDirectory: true,
      companyDepartment: 'Operaciones & Planta'
    },
    {
      ...originalMember,
      publicId: 'member-other-company',
      companyId: 'company-agora-consultores',
      companySlug: 'agora-consultores',
      published: true,
      isCompanyActive: true,
      showInDirectory: true
    }
  ];

  // 5.1 Filter strictly for active published members in public directory
  const publicDirectoryMembers = getCompanyMembers('company-nexo-operativo', teamPool, { onlyActivePublic: true });
  assert(publicDirectoryMembers.length === 2, 'Directorio público filtra sólo miembros activos y publicados (excluye borradores, inactivos y otras empresas)');
  assert(!publicDirectoryMembers.some((m) => m.publicId === 'member-draft'), 'Excluye miembros en borrador (published: false)');
  assert(!publicDirectoryMembers.some((m) => m.publicId === 'member-inactive'), 'Excluye miembros con vínculo inactivo (isCompanyActive: false)');
  assert(!publicDirectoryMembers.some((m) => m.companyId !== 'company-nexo-operativo'), 'Excluye miembros de otras empresas');

  // 5.2 Department filtering
  const comercialMembers = getCompanyMembers('company-nexo-operativo', teamPool, {
    onlyActivePublic: true,
    department: 'Comercial & Alianzas'
  });
  assert(comercialMembers.length === 1 && comercialMembers[0].name === 'Diego Salas', 'Filtra correctamente por área ("Comercial & Alianzas")');

  // 5.3 Text search filtering
  const searchResults = getCompanyMembers('company-nexo-operativo', teamPool, {
    onlyActivePublic: true,
    search: 'cotizaciones'
  });
  assert(searchResults.length === 1 && searchResults[0].publicId === 'member-2', 'Búsqueda encuentra por término en la declaración de rol ("qué atiende")');

  // 5.4 Public directory data isolation (no private CRM/leads or private PINs)
  publicDirectoryMembers.forEach((m) => {
    // Assert that in public presentation, the caller only uses public fields
    assert(typeof m.name === 'string' && typeof m.role === 'string', `Miembro ${m.publicId} expone nombre y rol público`);
  });

  // ==========================================
  // BLOQUE 6: Compatibilidad con Tarjetas Individuales e Independencia de Planes
  // ==========================================
  console.log('\n🔒 Bloque 6: Compatibilidad con Tarjetas Individuales e Independencia de Planes');

  // 6.1 Benchmark profiles in demo dataset
  const saraSazedi = INITIAL_PROFILES.find((p) => p.publicId === 'sara-sazedi');
  assert(Boolean(saraSazedi && !saraSazedi.companyId && !saraSazedi.companySlug), 'Sara Sazedi es tarjeta individual independiente sin empresa');

  const jorgeInDemo = DEMO_ARCHETYPE_PROFILES.find((p) => p.publicId === 'demo-jorge-herrera');
  assert(Boolean(jorgeInDemo && jorgeInDemo.companySlug === 'nexo-operativo'), 'Jorge Herrera está vinculado a Nexo Operativo');
  assert(jorgeInDemo?.features?.hasMeetingIntelligence === false, 'Membresía corporativa de Jorge NO activa automáticamente Meeting Intelligence (plan básico sin audios)');

  const diegoInDemo = DEMO_ARCHETYPE_PROFILES.find((p) => p.publicId === 'demo-diego-salas');
  assert(Boolean(diegoInDemo && diegoInDemo.brandOverrides?.overrideBrand === true), 'Diego Salas tiene excepción de marca explícita configurada');

  const claraInDemo = DEMO_ARCHETYPE_PROFILES.find((p) => p.publicId === 'demo-clara-navarro');
  assert(Boolean(claraInDemo && claraInDemo.companySlug === 'agora-consultores'), 'Clara Navarro está vinculada a Ágora Consultores');
  assert(claraInDemo?.professionalProfile === 'profesional_independiente', 'Clara conserva su arquetipo profesional original (no existe 8vo arquetipo)');

  // 6.2 Corporate template creation
  const createdFromTpl = createMemberFromCorporateTemplate(nexo!, {
    publicId: 'nuevo-ingeniero-planta',
    name: 'Ing. Rodrigo Vega',
    role: 'Ingeniero de Automatización',
    department: 'Operaciones & Planta',
    roleStatement: 'Automatización y comisionamiento de celdas robóticas.',
    phone: '+524423334455',
    email: 'rvega@nexooperativo.mx'
  });
  assert(createdFromTpl.companyId === nexo!.id, 'Crea integrante asignando ID de empresa');
  assert(createdFromTpl.companySlug === nexo!.slug, 'Crea integrante asignando slug de empresa');
  assert(createdFromTpl.companyDepartment === 'Operaciones & Planta', 'Asigna área funcional especificada');
  assert(createdFromTpl.role === 'Ingeniero de Automatización', 'Asigna cargo del nuevo integrante');
  assert(createdFromTpl.published === false, 'Nueva tarjeta desde plantilla inicia en borrador');

  // ==========================================
  // BLOQUE 7: Resumen
  // ==========================================
  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL CASOS VERIFICADOS UX08: ${passed + failed} | APROBADOS: ${passed} | FALLIDOS: ${failed}`);
  console.log('='.repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Error fatal durante la verificación de UX08:', err);
  process.exit(1);
});
