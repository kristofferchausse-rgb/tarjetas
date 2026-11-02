import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CapturedLead, LeadOutcome } from '../types/analytics';
import { captureLeadOnServer } from '../server/leadApi';
import { getLocalTodayDateString } from '../utils/crmTerminology';

const COLLECTION_NAME = 'leads';

export function getLocalLeadsEntry(publicId: string): { exists: boolean; leads: CapturedLead[] } {
  try {
    const raw = localStorage.getItem(`tarjetas_leads_${publicId.toLowerCase()}`);
    if (raw === null) {
      return { exists: false, leads: [] };
    }
    return { exists: true, leads: JSON.parse(raw) };
  } catch {
    return { exists: false, leads: [] };
  }
}

function getLocalLeads(publicId: string): CapturedLead[] {
  return getLocalLeadsEntry(publicId).leads;
}

function saveLocalLeads(publicId: string, leads: CapturedLead[]): boolean {
  try {
    localStorage.setItem(`tarjetas_leads_${publicId.toLowerCase()}`, JSON.stringify(leads));
    return true;
  } catch (err) {
    console.warn('[LeadService] LocalStorage setItem failed:', err);
    return false;
  }
}

const hoursAgo = (h: number) => new Date(Date.now() - 1000 * 60 * 60 * h).toISOString();
const daysOffset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return getLocalTodayDateString(d);
};

/**
 * High-value mock contacts for Sara Zea (SAZEDI)
 */
export const SARA_MOCK_LEADS: CapturedLead[] = [
  {
    id: 'lead_sara_01',
    publicId: 'sara-sazedi',
    name: 'Arq. Roberto Morales',
    phone: '+52 442 389 4512',
    email: 'roberto.morales@desarrollosbajio.mx',
    company: 'Desarrollos Residenciales del Bajío',
    role: 'Director de Proyectos',
    message:
      'Hola Sara, me encantó tu enfoque en la sesión de networking. Tenemos un desarrollo de 12 residencias premium en Zibatá y queremos integrar tu consultoría estratégica.',
    timestamp: hoursAgo(2),
    status: 'nuevo',
    notes: 'Interesado en propuesta comercial y alianza para primera etapa en Zibatá.',
    nextAction: 'Preparar propuesta comercial de consultoría para Zibatá',
    nextActionDate: daysOffset(0),
    nextActionTime: '11:00'
  },
  {
    id: 'lead_sara_02',
    publicId: 'sara-sazedi',
    name: 'Ing. Marcela Vega Salgado',
    phone: '+52 442 516 7890',
    email: 'mvega@haciendasanjose.com.mx',
    company: 'Grupo Hotelero Hacienda San José',
    role: 'Gerente de Operaciones & Alianzas',
    message:
      'Vimos tu tarjeta digital en el evento empresarial de Canaco. Queremos estructurar convenios corporativos para nuestras suites ejecutivas.',
    timestamp: hoursAgo(20),
    status: 'contactado',
    notes: 'Le envié por WhatsApp el enlace al caso de estudio. Acordamos enviar propuesta el viernes.',
    nextAction: 'Enviar propuesta ejecutiva por correo electrónico',
    nextActionDate: daysOffset(-2),
    nextActionTime: '17:00'
  },
  {
    id: 'lead_sara_03',
    publicId: 'sara-sazedi',
    name: 'Lic. Fernando Garza Ruiz',
    phone: '+52 442 198 2345',
    email: 'fgarza@nauticaqro.com',
    company: 'Corporativo Plaza Náutica Juriquilla',
    role: 'Socio Director',
    message:
      'Buscamos reestructurar nuestra estrategia de expansión B2B en el Bajío. Urge sesión de diagnóstico la próxima semana.',
    timestamp: hoursAgo(54),
    status: 'reunion',
    notes: 'Reunión agendada para el martes a las 11:00 AM en oficinas de Juriquilla.',
    nextAction: 'Sesión diagnóstica presencial en Juriquilla',
    nextActionDate: daysOffset(3),
    nextActionTime: '11:00'
  },
  {
    id: 'lead_sara_04',
    publicId: 'sara-sazedi',
    name: 'Dra. Valeria Gómez Conde',
    phone: '+52 442 670 1122',
    email: 'valeria.gomez@clinicaalttus.mx',
    company: 'Clínica Dermatológica Alttus Juriquilla',
    role: 'Directora Médica & Propietaria',
    message:
      'Queremos acompañamiento directivo 1 a 1 para abrir nuestra segunda sucursal en Centro Sur.',
    timestamp: hoursAgo(120),
    status: 'cerrado',
    notes: 'Contrato trimestral firmado. Anticipo del 50% recibido y kick-off completado.',
    nextAction: 'Kick-off de acompañamiento directivo',
    nextActionDate: daysOffset(-6),
    nextActionCompleted: true,
    nextActionCompletedAt: hoursAgo(96)
  },
  {
    id: 'lead_sara_05',
    publicId: 'sara-sazedi',
    name: 'Mtro. Alejandro Villaseñor',
    phone: '+52 442 814 3309',
    email: 'avillasenor@fondobajio.mx',
    company: 'Fondo de Inversión Capital Bajío',
    role: 'Director de Portafolio',
    message:
      'Hola Sara, nos interesa que facilites el consejo consultivo trimestral de 3 empresas de nuestro portafolio en Querétaro.',
    timestamp: hoursAgo(144),
    status: 'reunion',
    notes: 'Presentación de metodología programada para el jueves a las 4:00 PM.'
  }
];

/**
 * 5 tailored sets of CRM leads for each of the 7 Demo Archetype Profiles
 */
export const DEMO_PROFILES_MOCK_LEADS: Record<string, CapturedLead[]> = {
  'demo-clara-navarro': [
    {
      id: 'lead_clara_01',
      publicId: 'demo-clara-navarro',
      name: 'Ing. Ricardo Montemayor',
      phone: '+52 442 310 4481',
      email: 'rmontemayor@logisticaqro.mx',
      company: 'Montemayor Logística & Distribución',
      role: 'Director General',
      message:
        'Hola Clara. Crecimos de 14 a 32 personas este año y todas las decisiones operativas siguen pasando por mi escritorio. Necesitamos ordenar responsabilidades.',
      timestamp: hoursAgo(3),
      status: 'nuevo',
      notes: 'Dolor claro de cuello de botella en dirección. Enviar muestra de mapa de responsabilidades.',
      nextAction: 'Enviar muestra de mapa de responsabilidades y agendar llamada diagnóstica',
      nextActionDate: daysOffset(0),
      nextActionTime: '12:00'
    },
    {
      id: 'lead_clara_02',
      publicId: 'demo-clara-navarro',
      name: 'Lic. Mariana Solís',
      phone: '+52 442 489 2210',
      email: 'msolis@grupocima.mx',
      company: 'Grupo Comercial Cima del Bajío',
      role: 'Gerente de Capital Humano',
      message:
        'Hola Clara, vi tu tarjeta en el desayuno de COPARMEX. Queremos estructurar la incorporación de 6 nuevos coordinadores de sucursal el próximo mes.',
      timestamp: hoursAgo(18),
      status: 'contactado',
      notes: 'Se envió guía de ruta de incorporación de 30-60-90 días. Llamada de alcance el jueves.',
      nextAction: 'Llamada de alcance para acordar ruta de incorporación',
      nextActionDate: daysOffset(-2),
      nextActionTime: '16:30'
    },
    {
      id: 'lead_clara_03',
      publicId: 'demo-clara-navarro',
      name: 'Arq. Esteban Villalobos',
      phone: '+52 442 192 8834',
      email: 'esteban@villalobosarquitectos.com',
      company: 'Villalobos Estudio & Construcción',
      role: 'Socio Fundador',
      message:
        'Nuestras reuniones semanales de obra duran 2 horas y aun así se pierden compromisos entre residentes y compras. Buscamos tu taller de acuerdos.',
      timestamp: hoursAgo(48),
      status: 'reunion',
      notes: 'Sesión diagnóstica agendada este miércoles a las 10:00 AM en su despacho de Álamos.',
      nextAction: 'Sesión diagnóstica presencial de acuerdos operativos',
      nextActionDate: daysOffset(3),
      nextActionTime: '10:00'
    },
    {
      id: 'lead_clara_04',
      publicId: 'demo-clara-navarro',
      name: 'C.P. Sofía Elizondo',
      phone: '+52 442 601 7743',
      email: 'selizondo@elizondocontadores.mx',
      company: 'Elizondo & Asociados Despacho Fiscal',
      role: 'Socia Directora',
      message:
        'Queremos formalizar la matriz de roles entre gerentes fiscales y auxiliares para liberar tiempo de los socios.',
      timestamp: hoursAgo(110),
      status: 'cerrado',
      notes: 'Proyecto de 8 semanas aprobado ($68,000 MXN). Primera sesión con líderes realizada con éxito.',
      nextAction: 'Formalización de matriz y primera sesión con líderes',
      nextActionDate: daysOffset(-5),
      nextActionCompleted: true,
      nextActionCompletedAt: hoursAgo(80),
      outcome: {
        type: 'venta_confirmada',
        label: 'Taller de Acuerdos Operativos y Roles',
        registeredAt: daysOffset(-2),
        note: 'Anticipo del 50% cubierto para programa directivo de 8 semanas.'
      }
    },
    {
      id: 'lead_clara_05',
      publicId: 'demo-clara-navarro',
      name: 'Ing. Daniel Castrejón',
      phone: '+52 442 745 1920',
      email: 'dcastrejon@agroindustrialesqro.mx',
      company: 'Agroindustriales del Valle QRO',
      role: 'Director de Operaciones',
      message:
        'Hola Clara, abriremos un segundo turno en planta y necesitamos definir claramente las entregas de turno y responsabilidades de supervisión.',
      timestamp: hoursAgo(136),
      status: 'contactado',
      notes: 'Interesado en programa integral de roles y acuerdos operativos para 12 supervisores.'
    }
  ],

  'demo-diego-salas': [
    {
      id: 'lead_diego_01',
      publicId: 'demo-diego-salas',
      name: 'Dr. Alejandro Cordero',
      phone: '+52 442 512 9087',
      email: 'acordero@cardioqro.mx',
      company: 'Instituto Cardiopulmonar del Bajío',
      role: 'Médico Especialista',
      message:
        'Hola Diego. Mi familia y yo nos mudamos de CDMX a Querétaro en 60 días. Buscamos casa en Juriquilla o El Campanario con presupuesto de $7.5M a $9M MXN.',
      timestamp: hoursAgo(2),
      status: 'nuevo',
      notes: 'Comprador con crédito pre-aprobado y recursos propios. Filtrar 4 opciones con jardín y seguridad.',
      nextAction: 'Filtrar y enviar 4 opciones en Juriquilla con jardín',
      nextActionDate: daysOffset(0),
      nextActionTime: '10:30'
    },
    {
      id: 'lead_diego_02',
      publicId: 'demo-diego-salas',
      name: 'Lic. Paulina Castañeda',
      phone: '+52 442 334 1198',
      email: 'pcastaneda@kafenordico.mx',
      company: 'Kafé Nórdico Tostadores',
      role: 'Fundadora',
      message:
        'Buscamos un local comercial de 90 a 120 m² en zona Álamos o Carretas con uso de suelo comercial y estacionamiento para nuestra segunda cafetería.',
      timestamp: hoursAgo(22),
      status: 'contactado',
      notes: 'Se compartieron 3 fichas técnicas verificadas en Álamos 3ra Sección. Revisando factibilidad de terraza.',
      nextAction: 'Enviar fichas técnicas de Álamos y verificar terraza',
      nextActionDate: daysOffset(-1),
      nextActionTime: '15:00'
    },
    {
      id: 'lead_diego_03',
      publicId: 'demo-diego-salas',
      name: 'Ing. Héctor Becerra',
      phone: '+52 442 781 3340',
      email: 'hbecerra@PrecisionAero.mx',
      company: 'Precision Aero Components',
      role: 'Director de Operaciones',
      message:
        'Necesitamos rentar 2 residencias amuebladas en Zibatá para directivos expatriados que llegan el próximo mes por contrato de 2 años.',
      timestamp: hoursAgo(50),
      status: 'reunion',
      notes: 'Recorrido programado para el viernes a las 9:30 AM en 3 propiedades pre-seleccionadas.',
      nextAction: 'Recorrido en Zibatá con expatriados',
      nextActionDate: daysOffset(2),
      nextActionTime: '09:30'
    },
    {
      id: 'lead_diego_04',
      publicId: 'demo-diego-salas',
      name: 'Sra. Carmen Valladares',
      phone: '+52 442 215 6609',
      email: 'carmen.valladares@prodigy.net.mx',
      company: 'Patrimonio Familiar Valladares',
      role: 'Propietaria',
      message:
        'Hola Diego, quiero poner en venta mi propiedad comercial en Av. Constituyentes con expediente jurídico en regla.',
      timestamp: hoursAgo(96),
      status: 'cerrado',
      notes: 'Contrato de corretaje exclusivo firmado (Valor comercial: $6,400,000 MXN). Sesión fotográfica lista.',
      nextAction: 'Sesión fotográfica de propiedad comercial',
      nextActionDate: daysOffset(-4),
      nextActionCompleted: true,
      nextActionCompletedAt: hoursAgo(72)
    },
    {
      id: 'lead_diego_05',
      publicId: 'demo-diego-salas',
      name: 'Arq. Santiago Lomelí',
      phone: '+52 442 639 4012',
      email: 'slomeli@lomelidesarrollos.mx',
      company: 'Lomelí Desarrollos Boutique',
      role: 'Socio Comercial',
      message:
        'Diego, tenemos 4 residencias en preventa en Altozano y queremos que lideres la comercialización exclusiva con tus inversionistas.',
      timestamp: hoursAgo(132),
      status: 'reunion',
      notes: 'Revisión de carpeta técnica y comisiones este jueves a las 12:30 PM en obra.'
    }
  ],

  'demo-renata-vidal': [
    {
      id: 'lead_renata_01',
      publicId: 'demo-renata-vidal',
      name: 'Lic. Daniela Orozco',
      phone: '+52 442 409 8821',
      email: 'dorozco@bostontech.mx',
      company: 'Boston Tech Hub Querétaro',
      role: 'People & Experience Lead',
      message:
        'Hola Renata. Tendremos un taller de planeación anual de 2 días para 28 líderes en Juriquilla y queremos servicio de coffee break continuo y almuerzo ligero.',
      timestamp: hoursAgo(4),
      status: 'nuevo',
      notes: '28 asistentes (4 vegetarianos, 2 sin gluten). Cotizar formato Jornada Completa Energizante.',
      nextAction: 'Cotizar formato Jornada Completa Energizante (28 pax)',
      nextActionDate: daysOffset(0),
      nextActionTime: '13:00'
    },
    {
      id: 'lead_renata_02',
      publicId: 'demo-renata-vidal',
      name: 'Mtro. Rodrigo Santillán',
      phone: '+52 442 618 4502',
      email: 'rsantillan@consejoempresarialqro.org',
      company: 'Consejo Empresarial del Bajío',
      role: 'Coordinador de Consejos Directivos',
      message:
        'Necesitamos desayuno ejecutivo emplatado para sesión privada de 14 consejeros el próximo jueves a las 8:00 AM en Centro Sur.',
      timestamp: hoursAgo(26),
      status: 'contactado',
      notes: 'Se envió propuesta con 2 opciones de menú ejecutivo y montaje silencioso.',
      nextAction: 'Confirmar selección entre las 2 opciones de menú',
      nextActionDate: daysOffset(-3),
      nextActionTime: '18:00'
    },
    {
      id: 'lead_renata_03',
      publicId: 'demo-renata-vidal',
      name: 'Arq. Camila Fuentes',
      phone: '+52 442 890 1234',
      email: 'camila@fuentesinteriorismo.mx',
      company: 'Fuentes Estudio de Interiorismo',
      role: 'Directora Creativa',
      message:
        'Inauguramos nuestro nuevo showroom en Álamos para 45 invitados y queremos una mesa de quesos artesanales y bocadillos de autor.',
      timestamp: hoursAgo(60),
      status: 'reunion',
      notes: 'Visita al showroom agendada el miércoles 5:00 PM para definir dimensiones de mesa y montaje.',
      nextAction: 'Visita de locación al showroom para medidas de montaje',
      nextActionDate: daysOffset(4),
      nextActionTime: '17:00'
    },
    {
      id: 'lead_renata_04',
      publicId: 'demo-renata-vidal',
      name: 'Ing. Gustavo Pineda',
      phone: '+52 442 311 7892',
      email: 'gpineda@europlast.mx',
      company: 'EuroPlast Automotive Querétaro',
      role: 'Gerente de Planta',
      message:
        'Queremos contratar los desayunos mensuales de resultados para nuestros 22 jefes de área durante todo el trimestre.',
      timestamp: hoursAgo(130),
      status: 'cerrado',
      notes: 'Convenio trimestral cerrado ($42,000 MXN). Primer servicio programado para el día 1 de mes.',
      nextAction: 'Montaje de primer desayuno de resultados',
      nextActionDate: daysOffset(-5),
      nextActionCompleted: true,
      nextActionCompletedAt: hoursAgo(90)
    },
    {
      id: 'lead_renata_05',
      publicId: 'demo-renata-vidal',
      name: 'Lic. Natalia Urquiza',
      phone: '+52 442 918 5520',
      email: 'nurquiza@finanzaspacifico.mx',
      company: 'Banca Patrimonial del Pacífico',
      role: 'Subdirectora de Relaciones VIP',
      message:
        'Hola Renata, organizaremos una cata y cena maridaje privada para 20 clientes patrimoniales el día 24 de este mes.',
      timestamp: hoursAgo(148),
      status: 'contactado',
      notes: 'Enviada propuesta de menú degustación de 4 tiempos. Pendiente confirmar selección de vinos.'
    }
  ],

  'demo-jorge-herrera': [
    {
      id: 'lead_jorge_01',
      publicId: 'demo-jorge-herrera',
      name: 'Ing. Víctor Manuel Lozano',
      phone: '+52 442 590 3312',
      email: 'vlozano@metalurgicabajio.com',
      company: 'Metalúrgica Industrial del Bajío',
      role: 'Gerente de Mantenimiento',
      message:
        'Hola Jorge. Tenemos vibración fuera de rango en 2 transportadores principales de la línea 3 en Parque Industrial Benito Juárez. Requerimos diagnóstico y ajuste.',
      timestamp: hoursAgo(1),
      status: 'nuevo',
      notes: 'Urgencia media-alta. Tienen ventana de paro programado este sábado de 7:00 AM a 3:00 PM.',
      nextAction: 'Confirmar cuadrilla para ventana de paro del sábado',
      nextActionDate: daysOffset(0),
      nextActionTime: '08:30'
    },
    {
      id: 'lead_jorge_02',
      publicId: 'demo-jorge-herrera',
      name: 'Ing. Claudia Rentería',
      phone: '+52 442 278 6543',
      email: 'crenteria@valeo-tier1.mx',
      company: 'Sistemas Automotrices El Marqués',
      role: 'Líder de Ingeniería de Planta',
      message:
        'Buscamos fabricar 18 dispositivos de sujeción (fixtures) en acero inoxidable con entrega en 3 semanas. Puedo compartir planos STEP/PDF.',
      timestamp: hoursAgo(19),
      status: 'contactado',
      notes: 'Planos recibidos. Ingeniería está costeando materiales y horas de maquinado CNC.',
      nextAction: 'Enviar costeo de materiales y maquinado CNC de fixtures',
      nextActionDate: daysOffset(-2),
      nextActionTime: '14:00'
    },
    {
      id: 'lead_jorge_03',
      publicId: 'demo-jorge-herrera',
      name: 'Lic. Marco Antonio Zepeda',
      phone: '+52 442 812 9904',
      email: 'mzepeda@alimentosdelcentro.mx',
      company: 'Procesadora de Alimentos del Centro',
      role: 'Jefe de Compras Técnicas',
      message:
        'Queremos evaluar a Nexo Operativo como proveedor dado de alta con DC-3 y REPSE para reubicación de una línea de envasado.',
      timestamp: hoursAgo(52),
      status: 'reunion',
      notes: 'Levantamiento técnico en planta agendado mañana jueves a las 10:30 AM con equipo de seguridad.',
      nextAction: 'Levantamiento técnico en planta con equipo de seguridad',
      nextActionDate: daysOffset(1),
      nextActionTime: '10:30'
    },
    {
      id: 'lead_jorge_04',
      publicId: 'demo-jorge-herrera',
      name: 'Ing. Raúl Domínguez',
      phone: '+52 442 445 1029',
      email: 'rdominguez@aerotechqro.com',
      company: 'AeroTech Machining Querétaro',
      role: 'Director de Operaciones',
      message:
        'Requerimos póliza semestral de mantenimiento mecánico preventivo para 6 celdas de manufactura.',
      timestamp: hoursAgo(140),
      status: 'cerrado',
      notes: 'Orden de compra OC-8841 liberada por $185,000 MXN. Calendario de intervenciones firmado.',
      nextAction: 'Entrega de cronograma de mantenimiento firmado',
      nextActionDate: daysOffset(-7),
      nextActionCompleted: true,
      nextActionCompletedAt: hoursAgo(120)
    },
    {
      id: 'lead_jorge_05',
      publicId: 'demo-jorge-herrera',
      name: 'Ing. Óscar Valenzuela',
      phone: '+52 442 304 9981',
      email: 'ovalenzuela@logisticafria.mx',
      company: 'Frigoríficos & Logística del Bajío',
      role: 'Jefe de Infraestructura',
      message:
        'Jorge, necesitamos adecuar 4 rampas niveladoras electrohidráulicas y protecciones estructurales en andén de carga.',
      timestamp: hoursAgo(162),
      status: 'contactado',
      notes: 'Se envió presupuesto preliminar con cuadrilla certificada en soldadura y trabajo en alturas.'
    }
  ],

  'demo-adriana-torres': [
    {
      id: 'lead_adriana_01',
      publicId: 'demo-adriana-torres',
      name: 'Ing. Enrique Valdés',
      phone: '+52 442 367 8910',
      email: 'evaldes@claq-automotriz.org',
      company: 'Clúster Automotriz de Querétaro',
      role: 'Coordinador de Comité de Operaciones',
      message:
        'Estimada Adriana, queremos invitarte como ponente principal a la mesa de Excelencia Operativa y Desarrollo de Supervisores el próximo mes.',
      timestamp: hoursAgo(3),
      status: 'nuevo',
      notes: 'Excelente foro con 40 directores de planta del Bajío. Confirmar disponibilidad de agenda.',
      nextAction: 'Confirmar disponibilidad de agenda para panel del clúster',
      nextActionDate: daysOffset(0),
      nextActionTime: '09:00'
    },
    {
      id: 'lead_adriana_02',
      publicId: 'demo-adriana-torres',
      name: 'Dr. Samuel Ibarra',
      phone: '+52 442 701 2389',
      email: 'sibarra@upq-ingenieria.edu.mx',
      company: 'Universidad Politécnica Industrial',
      role: 'Director de Vinculación Académica',
      message:
        'Hola Adriana, buscamos alinear nuestro programa de educación dual en manufactura esbelta con los estándares de Horizonte Manufactura.',
      timestamp: hoursAgo(24),
      status: 'contactado',
      notes: 'Se envió perfil de competencias técnicas para practicantes de 8vo cuatrimestre.',
      nextAction: 'Enviar perfil de competencias técnicas para practicantes',
      nextActionDate: daysOffset(-2),
      nextActionTime: '16:00'
    },
    {
      id: 'lead_adriana_03',
      publicId: 'demo-adriana-torres',
      name: 'Ing. Lorena Téllez',
      phone: '+52 442 554 6712',
      email: 'ltellez@precisionstampings.mx',
      company: 'Precision Stampings Bajío',
      role: 'Gerente General',
      message:
        'Somos proveedor Tier-2 certificado IATF 16949 y queremos presentar nuestras capacidades de estampado local para su programa de localización de proveeduría.',
      timestamp: hoursAgo(64),
      status: 'reunion',
      notes: 'Reunión de evaluación con Gerencia de Calidad y Compras agendada para el martes 12:00 PM.',
      nextAction: 'Reunión de evaluación técnica con Gerencia de Calidad',
      nextActionDate: daysOffset(2),
      nextActionTime: '12:00'
    },
    {
      id: 'lead_adriana_04',
      publicId: 'demo-adriana-torres',
      name: 'Mtro. Patricio Cuevas',
      phone: '+52 442 901 4455',
      email: 'pcuevas@institutolean.mx',
      company: 'Instituto Mexicano de Manufactura Esbelta',
      role: 'Director Regional',
      message:
        'Propuesta de alianza interinstitucional para certificar a 25 líderes de celda y supervisores de planta.',
      timestamp: hoursAgo(150),
      status: 'cerrado',
      notes: 'Convenio de colaboración firmado. Primera generación inicia capacitación el próximo lunes.',
      nextAction: 'Kick-off de primera generación de líderes certificados',
      nextActionDate: daysOffset(-5),
      nextActionCompleted: true,
      nextActionCompletedAt: hoursAgo(85)
    },
    {
      id: 'lead_adriana_05',
      publicId: 'demo-adriana-torres',
      name: 'Ing.Berenice Alcalá',
      phone: '+52 442 677 2014',
      email: 'balcala@aeroespacialbajio.mx',
      company: 'Consorcio Aeroespacial del Centro',
      role: 'Directora de Calidad Operativa',
      message:
        'Adriana, nos encantaría realizar un benchmarking cruzado de pisos de producción y tableros SQDC entre nuestras plantas.',
      timestamp: hoursAgo(168),
      status: 'reunion',
      notes: 'Recorrido recíproco de planta confirmado para el próximo viernes a las 8:30 AM.'
    }
  ],

  'demo-lucia-cardenas': [
    {
      id: 'lead_lucia_01',
      publicId: 'demo-lucia-cardenas',
      name: 'Lic. Gabriela Mondragón',
      phone: '+52 442 398 1120',
      email: 'gmondragon@gmail.com',
      company: 'Paciente en Consultorio Juriquilla',
      role: 'Cita de Valoración General',
      message:
        'Hola Dra. Lucía, vi su tarjeta digital por recomendación de una vecina. Quisiera agendar una cita de valoración en su consultorio esta semana por la tarde.',
      timestamp: hoursAgo(2),
      status: 'nuevo',
      notes: 'Enviar opciones de horarios disponibles en consultorio y confirmar cita para el jueves a las 5:00 PM.',
      nextAction: 'Confirmar horario disponible y enviar ubicación del consultorio',
      nextActionDate: daysOffset(0),
      nextActionTime: '17:00'
    },
    {
      id: 'lead_lucia_02',
      publicId: 'demo-lucia-cardenas',
      name: 'Ing. Carlos Alberto Rivas',
      phone: '+52 442 612 7780',
      email: 'carlos.rivas@outlook.com',
      company: 'Paciente Frecuente',
      role: 'Seguimiento de Consulta',
      message:
        'Hola Doctora, le escribo para confirmar si cuenta con espacio disponible el viernes para consulta presencial en el consultorio.',
      timestamp: hoursAgo(21),
      status: 'contactado',
      notes: 'Recepción confirmó disponibilidad en agenda de consultorio. Cita tentativa para el viernes 11:00 AM.',
      nextAction: 'Confirmar asistencia a cita en agenda del consultorio',
      nextActionDate: daysOffset(-1),
      nextActionTime: '11:00'
    },
    {
      id: 'lead_lucia_03',
      publicId: 'demo-lucia-cardenas',
      name: 'Dr. Mauricio Salgado',
      phone: '+52 442 450 9931',
      email: 'msalgado@endocrinologiaqro.mx',
      company: 'Centro de Especialidades Médicas QRO',
      role: 'Médico Especialista',
      message:
        'Estimada Dra. Cárdenas, me gustaría coordinar canalización administrativa recíproca de pacientes para atención en consultorios de la zona.',
      timestamp: hoursAgo(70),
      status: 'reunion',
      notes: 'Llamada de coordinación administrativa agendada para el miércoles a la 1:30 PM.',
      nextAction: 'Llamada de coordinación de interconsulta médica',
      nextActionDate: daysOffset(3),
      nextActionTime: '13:30'
    },
    {
      id: 'lead_lucia_04',
      publicId: 'demo-lucia-cardenas',
      name: 'Lic. Regina Alcántara',
      phone: '+52 442 823 4019',
      email: 'ralcantara@colegioverdevalle.edu.mx',
      company: 'Colegio Verde Valle Querétaro',
      role: 'Coordinadora Administrativa',
      message:
        'Requerimos programar citas de atención y valoración en consultorio para el personal administrativo de nuestra sede.',
      timestamp: hoursAgo(125),
      status: 'cerrado',
      notes: 'Jornada de citas en consultorio completada conforme al calendario acordado.',
      nextAction: 'Confirmar registro de citas y cierre de fechas acordadas',
      nextActionDate: daysOffset(-6),
      nextActionCompleted: true,
      nextActionCompletedAt: hoursAgo(100),
      outcome: {
        type: 'cita_confirmada',
        label: 'Cita de valoración en consultorio agendada',
        registeredAt: daysOffset(-3),
        note: 'Cita acordada y aceptada en agenda de consultorio para valoración de salud ocupacional.'
      }
    },
    {
      id: 'lead_lucia_05',
      publicId: 'demo-lucia-cardenas',
      name: 'Mtra. Claudia Peñaloza',
      phone: '+52 442 508 3917',
      email: 'claudia.penaloza@nutricionclinicaqro.mx',
      company: 'Clínica de Nutrición',
      role: 'Nutrióloga',
      message:
        'Hola Dra. Lucía, me encantaría coordinar horarios de atención conjunta para canalización de citas entre consultorios.',
      timestamp: hoursAgo(152),
      status: 'contactado',
      notes: 'Se compartieron vías de contacto y horarios de recepción para coordinación.'
    }
  ],

  'demo-gabriela-leon': [
    {
      id: 'lead_gabriela_01',
      publicId: 'demo-gabriela-leon',
      name: 'Mtra. Elena Beristain',
      phone: '+52 442 341 8876',
      email: 'eberistain@fundacionimpulso.org',
      company: 'Fundación Impulso Comunitario QRO',
      role: 'Directora de Programas Sociales',
      message:
        'Hola Gabriela. Queremos presentar una iniciativa conjunta de capacitación en habilidades digitales para 120 jóvenes de municipios del semidesierto.',
      timestamp: hoursAgo(3),
      status: 'nuevo',
      notes: 'Propuesta muy bien estructurada con población objetivo y contrapartida definidas.',
      nextAction: 'Revisar propuesta técnica de capacitación para jóvenes',
      nextActionDate: daysOffset(0),
      nextActionTime: '10:00'
    },
    {
      id: 'lead_gabriela_02',
      publicId: 'demo-gabriela-leon',
      name: 'Ing. Javier Solórzano',
      phone: '+52 442 509 3321',
      email: 'jsolorzano@canacintraqro.org.mx',
      company: 'Comisión de Talento Pyme • Cámara Industrial',
      role: 'Vicepresidente de Vinculación',
      message:
        'Estimada Mtra. Gabriela, buscamos articular un diplomado técnico para supervisores de pymes manufactureras con aval del Centro Regional.',
      timestamp: hoursAgo(25),
      status: 'contactado',
      notes: 'Se envió formato orientador de iniciativas y lineamientos de revisión académica.',
      nextAction: 'Enviar lineamientos de revisión académica para diplomado',
      nextActionDate: daysOffset(-2),
      nextActionTime: '15:30'
    },
    {
      id: 'lead_gabriela_03',
      publicId: 'demo-gabriela-leon',
      name: 'Dra. Patricia Mondragón',
      phone: '+52 442 776 5410',
      email: 'pmondragon@ciateq-innovacion.mx',
      company: 'Centro Público de Investigación Aplicada',
      role: 'Coordinadora de Transferencia de Conocimiento',
      message:
        'Queremos instalar una mesa interinstitucional para divulgación tecnológica y formación continua en sustentabilidad hídrica.',
      timestamp: hoursAgo(68),
      status: 'reunion',
      notes: 'Mesa de trabajo programada el jueves a las 11:00 AM con Dirección Académica y Jurídico.',
      nextAction: 'Mesa de trabajo interinstitucional con Dirección Académica',
      nextActionDate: daysOffset(2),
      nextActionTime: '11:00'
    },
    {
      id: 'lead_gabriela_04',
      publicId: 'demo-gabriela-leon',
      name: 'Lic. Humberto Castañón',
      phone: '+52 442 290 6615',
      email: 'hcastanon@rededucativabajio.org',
      company: 'Red Educativa del Bajío A.C.',
      role: 'Director General',
      message:
        'Seguimiento a la firma del convenio marco de colaboración para talleres de formación docente regional.',
      timestamp: hoursAgo(140),
      status: 'cerrado',
      notes: 'Convenio institucional validado y firmado por las áreas competentes. Convocatoria publicada.',
      nextAction: 'Publicación de bases de convocatoria de formación docente',
      nextActionDate: daysOffset(-5),
      nextActionCompleted: true,
      nextActionCompletedAt: hoursAgo(80)
    },
    {
      id: 'lead_gabriela_05',
      publicId: 'demo-gabriela-leon',
      name: 'Mtro. Arturo Zárate',
      phone: '+52 442 819 4201',
      email: 'azarate@secretariadesarrollo.gob.mx',
      company: 'Dirección de Impulso al Empleo Regional',
      role: 'Coordinador de Programas',
      message:
        'Estimada Gabriela, buscamos coordinar la convocatoria anual de becas de certificación técnica para mujeres en la industria.',
      timestamp: hoursAgo(164),
      status: 'reunion',
      notes: 'Revisión de bases de convocatoria agendada para el lunes a las 9:30 AM.'
    }
  ]
};

/**
 * Generates 5 realistic mock leads for any profile ID
 */
export function getMockLeadsForProfileId(publicId: string): CapturedLead[] {
  const cleanId = publicId.trim().toLowerCase();
  if (cleanId === 'sara-sazedi') return SARA_MOCK_LEADS;
  if (DEMO_PROFILES_MOCK_LEADS[cleanId]) return DEMO_PROFILES_MOCK_LEADS[cleanId];

  return [
    {
      id: `lead_${cleanId}_01`,
      publicId: cleanId,
      name: 'Lic. Roberto Morales Vega',
      phone: '+52 442 389 4512',
      email: 'roberto.morales@corporativobajio.mx',
      company: 'Grupo Empresarial del Bajío',
      role: 'Director de Operaciones',
      message:
        'Revisé tu tarjeta digital y nos interesa agendar una conversación esta semana para evaluar tu propuesta de servicios.',
      timestamp: hoursAgo(3),
      status: 'nuevo',
      notes: 'Prospecto calificado captado desde QR en reunión empresarial.'
    },
    {
      id: `lead_${cleanId}_02`,
      publicId: cleanId,
      name: 'Ing. Marcela Salgado',
      phone: '+52 442 516 7890',
      email: 'msalgado@innovacionqro.com.mx',
      company: 'Innovación & Proyectos QRO',
      role: 'Gerente de Compras y Alianzas',
      message:
        'Hola, vi tus casos documentados en la tarjeta digital y tenemos un requerimiento muy similar para este trimestre.',
      timestamp: hoursAgo(22),
      status: 'contactado',
      notes: 'Se envió información inicial por WhatsApp y se acordó llamada de seguimiento.'
    },
    {
      id: `lead_${cleanId}_03`,
      publicId: cleanId,
      name: 'Lic. Fernando Garza Ruiz',
      phone: '+52 442 198 2345',
      email: 'fgarza@plazanautica.mx',
      company: 'Corporativo Juriquilla',
      role: 'Socio Director',
      message: 'Nos gustaría revisar una propuesta de alcance formal para nuestro equipo directivo.',
      timestamp: hoursAgo(56),
      status: 'reunion',
      notes: 'Sesión de revisión agendada para el martes a las 11:00 AM.'
    },
    {
      id: `lead_${cleanId}_04`,
      publicId: cleanId,
      name: 'Dra. Valeria Gómez Conde',
      phone: '+52 442 670 1122',
      email: 'valeria.gomez@alttus.mx',
      company: 'Grupo Alttus Querétaro',
      role: 'Directora General',
      message: 'Excelente claridad en tu tarjeta digital. Autorizamos avanzar con la propuesta presentada.',
      timestamp: hoursAgo(120),
      status: 'cerrado',
      notes: 'Acuerdo cerrado satisfactoriamente. Inicio de actividades programado.'
    },
    {
      id: `lead_${cleanId}_05`,
      publicId: cleanId,
      name: 'Mtro. Alejandro Villaseñor',
      phone: '+52 442 814 3309',
      email: 'avillasenor@capitalbajio.mx',
      company: 'Consejo Empresarial Querétaro',
      role: 'Director de Alianzas B2B',
      message: 'Nos gustaría invitarte a presentar tu solución ante las empresas socias del comité este mes.',
      timestamp: hoursAgo(144),
      status: 'contactado',
      notes: 'Se envió dossier ejecutivo por correo electrónico.'
    }
  ];
}

export interface SeedMockLeadsResult {
  success: boolean;
  leads: CapturedLead[];
  error?: string;
}

/**
 * Seeds or restores mock leads exclusively for demo profiles.
 * Never overwrites real customer leads with mock data.
 * Does NOT write or seed mock leads into remote Firestore production.
 */
export async function seedMockLeads(
  publicId: string,
  options?: { force?: boolean }
): Promise<SeedMockLeadsResult> {
  const cleanId = publicId.trim().toLowerCase();
  if (!cleanId.startsWith('demo-') && !options?.force) {
    console.warn('[LeadService] seedMockLeads rejected for non-demo profile:', cleanId);
    return {
      success: false,
      leads: [],
      error: 'La restauración de ejemplos está restringida exclusivamente a perfiles de demostración.'
    };
  }

  const mockData = getMockLeadsForProfileId(cleanId).map((m) => ({
    ...m,
    isDemo: true,
    syncStatus: 'unverified' as const
  }));
  const saved = saveLocalLeads(cleanId, mockData);
  if (!saved) {
    return {
      success: false,
      leads: [],
      error: 'Error al persistir contactos de ejemplo en el almacenamiento local.'
    };
  }
  return {
    success: true,
    leads: mockData
  };
}

export type SaveLeadSyncStatus = 'confirmed' | 'pending' | 'failed';

export interface SaveLeadResult {
  status: SaveLeadSyncStatus;
  lead: CapturedLead;
  error?: string;
  isRetry?: boolean;
}

export interface PendingLeadEntry {
  lead: CapturedLead;
  attempts: number;
  lastAttemptAt: string;
  lastError?: string;
}

const PENDING_QUEUE_PREFIX = 'tarjetas_pending_leads_';

export function getPendingLeads(publicId: string): PendingLeadEntry[] {
  try {
    const raw = localStorage.getItem(`${PENDING_QUEUE_PREFIX}${publicId.trim().toLowerCase()}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePendingQueue(publicId: string, queue: PendingLeadEntry[]): boolean {
  try {
    localStorage.setItem(`${PENDING_QUEUE_PREFIX}${publicId.trim().toLowerCase()}`, JSON.stringify(queue));
    return true;
  } catch {
    return false;
  }
}

function buildVisitorPayload(lead: CapturedLead): Record<string, any> {
  const payload: Record<string, any> = {
    id: lead.id,
    publicId: lead.publicId,
    name: lead.name,
    phone: lead.phone,
    timestamp: lead.timestamp,
    source: lead.source || 'general'
  };
  if (lead.email && lead.email.trim()) payload.email = lead.email.trim();
  if (lead.company && lead.company.trim()) payload.company = lead.company.trim();
  if (lead.role && lead.role.trim()) payload.role = lead.role.trim();
  if (lead.message && lead.message.trim()) payload.message = lead.message.trim();
  if (lead.solutionId) payload.solutionId = lead.solutionId;
  if (lead.solutionTitle) payload.solutionTitle = lead.solutionTitle;
  return payload;
}

export function enqueuePendingLead(lead: CapturedLead, error?: string): boolean {
  const cleanId = lead.publicId.trim().toLowerCase();
  const queue = getPendingLeads(cleanId);
  const existingIdx = queue.findIndex((e) => e.lead.id === lead.id);

  // Strip notes so private notes are never stored in visitor's pending queue
  const sanitizedLead: CapturedLead = {
    ...lead,
    notes: undefined
  };

  const entry: PendingLeadEntry = {
    lead: sanitizedLead,
    attempts: existingIdx >= 0 ? queue[existingIdx].attempts + 1 : 1,
    lastAttemptAt: new Date().toISOString(),
    lastError: error
  };

  if (existingIdx >= 0) {
    const updated = [...queue];
    updated[existingIdx] = entry;
    return savePendingQueue(cleanId, updated);
  }

  // Capacity cap: max 20 unconfirmed items. Do NOT drop existing unconfirmed items.
  if (queue.length >= 20) {
    return false;
  }

  const updated = [entry, ...queue];
  return savePendingQueue(cleanId, updated);
}

export function removePendingLead(publicId: string, leadId: string): void {
  const cleanId = publicId.trim().toLowerCase();
  const queue = getPendingLeads(cleanId);
  const updated = queue.filter((e) => e.lead.id !== leadId);
  savePendingQueue(cleanId, updated);
}

/**
 * Saves a new captured lead or reattempts an existing pending lead.
 * Server-side idempotent operation with stable ID and timestamp preservation.
 * Distinguishes 3 explicit outcomes:
 * - 'confirmed': Successfully recorded by the server without altering existing titular notes or status.
 * - 'pending': Durable in local browser queue, but remote confirmation pending/failed/timed out.
 * - 'failed': Neither local nor remote storage could record the lead (e.g. queue full or storage disabled).
 */
export async function saveLead(
  leadData: Omit<CapturedLead, 'id' | 'timestamp' | 'status'> & {
    id?: string;
    timestamp?: string;
    status?: CapturedLead['status'];
  },
  options: { timeoutMs?: number; simulateRemoteFailure?: boolean } = {}
): Promise<SaveLeadResult> {
  const cleanId = leadData.publicId.trim().toLowerCase();
  // Preserve stable ID across retries of the same record
  const id = leadData.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Preserve original timestamp across retries: check queue or local storage if not provided in leadData
  let timestamp = leadData.timestamp;
  if (!timestamp) {
    const existingQueue = getPendingLeads(cleanId);
    const queueEntry = existingQueue.find((q) => q.lead.id === id);
    if (queueEntry?.lead.timestamp) {
      timestamp = queueEntry.lead.timestamp;
    } else {
      const localLeads = getLocalLeads(cleanId);
      const localEntry = localLeads.find((l) => l.id === id);
      timestamp = localEntry?.timestamp || new Date().toISOString();
    }
  }

  const status: CapturedLead['status'] = 'nuevo';
  const isRetry = Boolean(leadData.id);

  // Strip notes from public lead submission to prevent tampering with or leaking titular notes
  const leadToSave: CapturedLead = {
    ...leadData,
    id,
    publicId: cleanId,
    timestamp,
    status,
    source: leadData.source || 'general',
    solutionId: leadData.solutionId || undefined,
    solutionTitle: leadData.solutionTitle || undefined,
    notes: undefined
  };

  // 1. Attempt durable local storage save (marked as pending until remote confirmation)
  let localSaved = false;
  try {
    const local = getLocalLeads(cleanId);
    const existingIdx = local.findIndex((l) => l.id === id);
    let updated: CapturedLead[];
    if (existingIdx >= 0) {
      updated = [...local];
      updated[existingIdx] = {
        ...leadToSave,
        status: updated[existingIdx].status || leadToSave.status,
        notes: updated[existingIdx].notes, // preserve existing titular notes locally if any
        syncStatus: 'pending'
      };
    } else {
      updated = [{ ...leadToSave, syncStatus: 'pending' }, ...local];
    }
    saveLocalLeads(cleanId, updated);
    localSaved = true;
  } catch (localErr) {
    console.warn('[LeadService] Local storage failed:', localErr);
    localSaved = false;
  }

  // 2. Server-side capture operation with bounded timeout
  const timeoutMs = options.timeoutMs ?? 5000;
  let remoteConfirmed = false;
  let remoteError: string | undefined;

  const visitorPayload = buildVisitorPayload(leadToSave);

  const remoteOperation = (async () => {
    if (options.simulateRemoteFailure) {
      throw new Error('SIMULATED_NETWORK_FAILURE');
    }
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        const resp = await fetch('/api/leads/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitorPayload)
        });
        const contentType = resp.headers.get('content-type') || '';
        if (resp.ok && contentType.includes('application/json')) {
          return await resp.json();
        } else if (resp.status === 409) {
          throw new Error('Conflicto de identidad: El ID ya pertenece a otro perfil.');
        }
      } catch (fetchErr: any) {
        if (fetchErr.message?.includes('Conflicto')) throw fetchErr;
      }

      // If server API endpoint is not active (static Firebase Hosting), save directly to Firestore
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        if (isRetry) {
          try {
            await updateDoc(docRef, visitorPayload);
          } catch (updateErr: any) {
            const errCode = updateErr?.code;
            const errMsg = updateErr?.message || '';
            if (
              errCode === 'not-found' ||
              errMsg.includes('No document to update') ||
              errMsg.toLowerCase().includes('not found')
            ) {
              await setDoc(docRef, { ...visitorPayload, status: 'nuevo' });
            } else {
              throw updateErr;
            }
          }
        } else {
          await setDoc(docRef, { ...visitorPayload, status: 'nuevo' });
        }
        return {
          status: 'confirmed',
          isRetry,
          lead: { ...leadToSave, syncStatus: 'confirmed' }
        };
      } catch (firestoreErr) {
        // Fallback to server helper if offline
        return await captureLeadOnServer(visitorPayload as any);
      }
    } else {
      // In Node / SSR / test environment
      return await captureLeadOnServer(visitorPayload as any);
    }
  })();

  // Background reconciliation for late confirmation (arriving after timeout)
  remoteOperation
    .then((serverRes) => {
      if (serverRes?.status === 'confirmed') {
        removePendingLead(cleanId, id);
        try {
          const local = getLocalLeads(cleanId);
          const updated = local.map((l) =>
            l.id === id ? { ...l, syncStatus: 'confirmed' as const } : l
          );
          saveLocalLeads(cleanId, updated);
        } catch {}
      }
    })
    .catch(() => {
      // Handled silently; errors during active attempt are caught by Promise.race below
    });

  try {
    let timerId: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(new Error('TIMEOUT_REMOTE_CONFIRMATION')), timeoutMs);
    });

    try {
      const serverRes: any = await Promise.race([remoteOperation, timeoutPromise]);
      if (serverRes && serverRes.status === 'confirmed') {
        remoteConfirmed = true;
      } else {
        remoteError = serverRes?.error || 'Error al confirmar en el servidor';
      }
    } finally {
      clearTimeout(timerId);
    }
  } catch (err: any) {
    remoteError = err?.message || 'Remote write failed';
    console.warn('[LeadService] Server lead capture failed or timed out:', remoteError);
  }

  // 3. Branching on explicit outcomes
  if (remoteConfirmed) {
    // Confirmed remotely: remove from pending queue
    removePendingLead(cleanId, id);

    // Update local cache to reflect syncStatus: 'confirmed'
    if (localSaved) {
      try {
        const local = getLocalLeads(cleanId);
        const updated = local.map((l) =>
          l.id === id ? { ...leadToSave, syncStatus: 'confirmed' as const } : l
        );
        saveLocalLeads(cleanId, updated);
      } catch {}
    }

    return {
      status: 'confirmed',
      lead: { ...leadToSave, syncStatus: 'confirmed' },
      isRetry
    };
  }

  // Remote confirmation not received; attempt enqueue in local queue
  const enqueued = enqueuePendingLead(leadToSave, remoteError);

  if (enqueued && localSaved) {
    return {
      status: 'pending',
      lead: { ...leadToSave, syncStatus: 'pending' },
      error: remoteError,
      isRetry
    };
  }

  // Both remote failed and either queue is full or local storage unavailable
  return {
    status: 'failed',
    lead: { ...leadToSave, syncStatus: 'failed' },
    error: !enqueued
      ? 'Cola de pendientes completa (máximo 20 contactos). No se pueden conservar nuevos envíos sin confirmación remota.'
      : (remoteError || 'Almacenamiento local y remoto no disponibles'),
    isRetry
  };
}

/**
 * Processes queued pending leads for a profile with exponential backoff and limits.
 * Called on network reconnection, card mount, or manual retry.
 * Does NOT trigger WhatsApp automatically.
 */
export async function processPendingLeads(
  publicId: string
): Promise<{ confirmed: string[]; stillPending: string[] }> {
  const cleanId = publicId.trim().toLowerCase();
  const queue = getPendingLeads(cleanId);

  if (queue.length === 0) {
    return { confirmed: [], stillPending: [] };
  }

  const confirmed: string[] = [];
  const stillPending: string[] = [];
  const now = Date.now();

  for (const entry of queue) {
    // Circuit breaker: persistent validation or permission errors stop retrying after 5 attempts
    if (entry.attempts >= 5) {
      stillPending.push(entry.lead.id);
      continue;
    }

    // Cooldown check: progressive delay (e.g. 5s, 10s, 20s, 40s)
    const cooldownMs = Math.min(60000, 5000 * Math.pow(2, entry.attempts - 1));
    const lastAttemptTime = new Date(entry.lastAttemptAt).getTime();
    if (now - lastAttemptTime < cooldownMs) {
      stillPending.push(entry.lead.id);
      continue;
    }

    // Attempt save with 4s timeout
    const res = await saveLead(entry.lead, { timeoutMs: 4000 });
    if (res.status === 'confirmed') {
      confirmed.push(entry.lead.id);
    } else {
      stillPending.push(entry.lead.id);
    }
  }

  return { confirmed, stillPending };
}

/**
 * Fetches captured leads for a given publicId.
 * Never injects mock leads into real customer profiles.
 * If zero real contacts exist, returns an empty array.
 */
export async function getLeadsForProfile(
  publicId: string,
  options: { includeDemo?: boolean } = {}
): Promise<CapturedLead[]> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalLeads(cleanId);
  const pendingQueue = getPendingLeads(cleanId);
  const pendingIds = new Set(pendingQueue.map((p) => p.lead.id));

  // Explicit demo mode or demo archetype profiles:
  // If local storage has an entry (even if empty []), respect it! Do not repopulate a deliberately empty list.
  // Only seed mock leads on initial absence of data (key not present in localStorage).
  if (options.includeDemo || cleanId.startsWith('demo-')) {
    const entry = getLocalLeadsEntry(cleanId);
    if (entry.exists) {
      return entry.leads;
    }
    const mock = getMockLeadsForProfileId(cleanId).map((m) => ({
      ...m,
      isDemo: true,
      syncStatus: 'unverified' as const
    }));
    saveLocalLeads(cleanId, mock);
    return mock;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('publicId', '==', cleanId));
    const snap = await getDocs(q);

    // If Firestore query succeeded (whether 0, 1, or more leads):
    const remoteLeads: CapturedLead[] = [];
    snap.forEach((d) => {
      remoteLeads.push({
        ...(d.data() as CapturedLead),
        syncStatus: 'confirmed'
      });
    });

    const remoteIds = new Set(remoteLeads.map((l) => l.id));

    // Include locally pending leads that haven't landed remotely yet
    const localPendingOnly = local
      .filter((l) => pendingIds.has(l.id) && !remoteIds.has(l.id))
      .map((l) => ({ ...l, syncStatus: 'pending' as const }));

    const merged = [...remoteLeads, ...localPendingOnly];

    // Sort newest first
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Update local storage cache with real leads ONLY
    saveLocalLeads(cleanId, merged);
    return merged;
  } catch (err) {
    console.warn('[LeadService] Firestore load failed, falling back to local leads cache:', err);
  }

  // If Firestore query failed (e.g. offline/network error), return local cache
  // BUT do not assume confirmed unless it had received confirmation!
  if (local.length > 0) {
    const merged = local.map((l) => ({
      ...l,
      syncStatus: pendingIds.has(l.id)
        ? ('pending' as const)
        : l.syncStatus === 'confirmed'
        ? ('confirmed' as const)
        : ('unverified' as const)
    }));
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return merged;
  }

  // Pure empty result for real profiles without contacts: NEVER inject mocks into real profiles!
  return [];
}

export interface UpdateLeadFollowUpPayload {
  status?: CapturedLead['status'];
  notes?: string;
  nextAction?: string | null;
  nextActionDate?: string | null;
  nextActionTime?: string | null;
  nextActionCompleted?: boolean;
  isNewActionSession?: boolean;
  outcome?: LeadOutcome | null; // explicit outcome or null to clear
}

export interface UpdateFollowUpResult {
  success: boolean;
  lead?: CapturedLead;
  isLocalOnly: boolean;
  storageTarget: 'local_device' | 'remote_sync';
  error?: string;
}

/**
 * Updates titular notes, next action, timing and status with verifiably isolated local persistence.
 * Rules:
 * - Empty string notes ('') are preserved as empty string without reverting to previous text.
 * - Local storage isolation per publicId and lead id.
 * - Date/time contract: omitted = keep existing, explicit null/empty string = remove/clear.
 * - Completed actions are stamped and recorded in history if a new next action is later defined.
 * - Never transforms local save into a false remote confirmation ('confirmed').
 * - In local/demo mode: missing contact returns error without fabricating from mocks.
 */
export async function updateLeadFollowUp(
  publicId: string,
  leadId: string,
  updates: UpdateLeadFollowUpPayload,
  options?: { localOnly?: boolean; simulateStorageFailure?: boolean }
): Promise<UpdateFollowUpResult> {
  const cleanId = publicId.trim().toLowerCase();

  if (options?.simulateStorageFailure) {
    return {
      success: false,
      isLocalOnly: true,
      storageTarget: 'local_device',
      error: 'Error de almacenamiento simulado: el dispositivo rechazó la escritura local.'
    };
  }

  const local = getLocalLeads(cleanId);
  const targetIdx = local.findIndex((l) => l.id === leadId);

  if (targetIdx < 0) {
    return {
      success: false,
      isLocalOnly: true,
      storageTarget: 'local_device',
      error: `Contacto no encontrado (ID: ${leadId})`
    };
  }

  const targetLead = local[targetIdx];

  // Helper for clear vs omit contract:
  // - undefined: keep existing value
  // - null or '': clear/delete value
  // - string: set new value
  const resolveField = (newVal: string | null | undefined, currentVal?: string): string | undefined => {
    if (newVal === null || newVal === '') return undefined;
    if (newVal !== undefined) return newVal;
    return currentVal;
  };

  const nextAction = resolveField(updates.nextAction, targetLead.nextAction);
  const nextActionDate = resolveField(updates.nextActionDate, targetLead.nextActionDate);
  const nextActionTime = resolveField(updates.nextActionTime, targetLead.nextActionTime);

  // Preserve history if previous action was completed and a new next action is scheduled
  const history = targetLead.nextActionHistory ? [...targetLead.nextActionHistory] : [];
  const shouldArchivePrevious =
    targetLead.nextActionCompleted &&
    Boolean(targetLead.nextAction?.trim()) &&
    (updates.isNewActionSession === true || (updates.nextAction !== undefined && updates.nextActionCompleted === false));

  if (shouldArchivePrevious) {
    const lastItem = history[history.length - 1];
    const isDuplicate =
      lastItem &&
      lastItem.action === targetLead.nextAction &&
      lastItem.date === targetLead.nextActionDate &&
      lastItem.time === targetLead.nextActionTime &&
      lastItem.completedAt === (targetLead.nextActionCompletedAt || lastItem.completedAt);

    if (!isDuplicate) {
      history.push({
        action: targetLead.nextAction!,
        date: targetLead.nextActionDate,
        time: targetLead.nextActionTime,
        completedAt: targetLead.nextActionCompletedAt || new Date().toISOString()
      });
    }
  }

  const nowIso = new Date().toISOString();
  let nextActionCompleted: boolean;
  let nextActionCompletedAt: string | undefined;

  if (shouldArchivePrevious) {
    nextActionCompleted = false;
    nextActionCompletedAt = undefined;
  } else if (updates.nextActionCompleted !== undefined) {
    nextActionCompleted = updates.nextActionCompleted;
    nextActionCompletedAt =
      updates.nextActionCompleted === true && !targetLead.nextActionCompleted
        ? nowIso
        : updates.nextActionCompleted === false
        ? undefined
        : targetLead.nextActionCompletedAt;
  } else {
    nextActionCompleted = targetLead.nextActionCompleted || false;
    nextActionCompletedAt = targetLead.nextActionCompletedAt;
  }

  let outcome: LeadOutcome | undefined;
  if (updates.outcome === null) {
    outcome = undefined; // explicit clearing
  } else if (updates.outcome !== undefined) {
    outcome = updates.outcome;
  } else {
    outcome = targetLead.outcome;
  }

  const updatedLead: CapturedLead = {
    ...targetLead,
    status: updates.status !== undefined ? updates.status : targetLead.status,
    notes: updates.notes !== undefined ? updates.notes : targetLead.notes,
    nextAction,
    nextActionDate,
    nextActionTime,
    nextActionCompleted,
    nextActionCompletedAt,
    nextActionHistory: history.length > 0 ? history : undefined,
    localSavedAt: nowIso,
    outcome
  };

  const newLocalList = [...local];
  newLocalList[targetIdx] = updatedLead;

  const saved = saveLocalLeads(cleanId, newLocalList);
  if (!saved) {
    return {
      success: false,
      lead: targetLead,
      isLocalOnly: true,
      storageTarget: 'local_device',
      error: 'No se pudo escribir en el almacenamiento del navegador. El borrador se mantiene en memoria.'
    };
  }

  const isDemoOrLocal = targetLead.isDemo || cleanId.startsWith('demo-') || options?.localOnly !== false;

  if (isDemoOrLocal) {
    return {
      success: true,
      lead: updatedLead,
      isLocalOnly: true,
      storageTarget: 'local_device'
    };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    await updateDoc(docRef, {
      status: updatedLead.status,
      notes: updatedLead.notes || '',
      nextAction: updatedLead.nextAction || '',
      nextActionDate: updatedLead.nextActionDate || '',
      nextActionTime: updatedLead.nextActionTime || '',
      nextActionCompleted: updatedLead.nextActionCompleted || false
    });
    return {
      success: true,
      lead: updatedLead,
      isLocalOnly: false,
      storageTarget: 'remote_sync'
    };
  } catch (err) {
    return {
      success: true,
      lead: updatedLead,
      isLocalOnly: true,
      storageTarget: 'local_device',
      error: 'Guardado en este dispositivo (pendiente de sincronización remota).'
    };
  }
}

/**
 * Updates a lead status (e.g. 'nuevo' -> 'contactado' -> 'reunion' -> 'cerrado' -> 'descartado')
 */
export async function updateLeadStatus(
  publicId: string,
  leadId: string,
  status: CapturedLead['status'],
  notes?: string
): Promise<boolean> {
  const res = await updateLeadFollowUp(publicId, leadId, {
    status,
    ...(notes !== undefined ? { notes } : {})
  });
  return res.success;
}

/**
 * Deletes a lead
 */
export async function deleteLead(publicId: string, leadId: string): Promise<boolean> {
  const cleanId = publicId.trim().toLowerCase();

  // 1. Local delete
  const local = getLocalLeads(cleanId);
  const targetLead = local.find((l) => l.id === leadId);
  const saved = saveLocalLeads(
    cleanId,
    local.filter((l) => l.id !== leadId)
  );

  const isDemoOrLocal = targetLead?.isDemo || cleanId.startsWith('demo-');
  if (isDemoOrLocal) {
    return saved;
  }

  // 2. Remote delete for real non-demo profiles only
  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('[LeadService] Could not delete from Firestore:', err);
    return false;
  }
}
