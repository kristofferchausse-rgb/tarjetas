import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MeetingRecording } from '../types/meeting';

const COLLECTION_NAME = 'meetings';

const hoursAgo = (h: number) => new Date(Date.now() - 1000 * 60 * 60 * h).toISOString();

export const SARA_MOCK_MEETINGS: MeetingRecording[] = [
  {
    id: 'meet_sara_01',
    publicId: 'sara-sazedi',
    leadId: 'lead_sara_01',
    leadName: 'Arq. Roberto Morales',
    leadCompany: 'Desarrollos Residenciales del Bajío',
    title: 'Acuerdos Bioclimáticos Zibatá (12 Residencias Premium)',
    timestamp: hoursAgo(3),
    durationSeconds: 860,
    dealTemperature: 'caliente',
    category: 'reunion_presencial',
    budgetMentioned: '$350,000 MXN',
    summary: [
      'Roberto presentó el plano maestro para 12 residencias premium en Zibatá.',
      'Su principal dolor son quejas de compradores por sobrecalentamiento en fachadas poniente.',
      'Requieren consultoría de diseño pasivo, ventilación cruzada e interiorismo bioclimático con cantera local.',
      'Presupuesto preliminar aprobado para la etapa de proyecto ejecutivo: $350,000 MXN.'
    ],
    painPoints: [
      'Sobrecalentamiento excesivo en recámaras secundarias durante verano.',
      'Descontento con el despacho de arquitectura anterior por falta de conocimiento bioclimático.',
      'Urgencia para tener casas muestra listas para preventa en primer trimestre.'
    ],
    actionItems: [
      {
        id: 'act_1',
        task: 'Enviar propuesta técnica y alcance bioclimático detallado',
        assignee: 'Sara Sazedi',
        dueDate: 'Viernes 4:00 PM',
        completed: false
      },
      {
        id: 'act_2',
        task: 'Compartir archivos CAD/DWG de fachadas y cortes estructurales',
        assignee: 'Arq. Roberto Morales',
        dueDate: 'Miércoles mediodía',
        completed: false
      },
      {
        id: 'act_3',
        task: 'Coordinar visita de medición solar en sitio con equipo técnico',
        assignee: 'Sara Sazedi',
        dueDate: 'Próximo lunes 10:00 AM',
        completed: false
      }
    ],
    transcript:
      'Roberto Morales: Hola Sara, qué gusto saludarte. Como te comenté en el evento de networking, traemos 12 residencias premium en Zibatá y queremos que tu despacho tome la consultoría.\n\nSara Sazedi: Me parece extraordinario Roberto. Platícame, ¿cuál es el principal reto que detectaron?\n\nRoberto Morales: En el desarrollo anterior tuvimos quejas severas de sobrecalentamiento en fachadas poniente. Traemos un presupuesto estimado de 350 mil pesos para el proyecto ejecutivo.\n\nSara Sazedi: Te hago llegar la propuesta formal este viernes antes de las 4:00 PM.'
  },
  {
    id: 'meet_sara_02',
    publicId: 'sara-sazedi',
    leadId: 'lead_sara_02',
    leadName: 'Ing. Marcela Vega Salgado',
    leadCompany: 'Grupo Hotelero Hacienda San José',
    title: 'Remodelación Suites Ejecutivas Sustentables',
    timestamp: hoursAgo(26),
    durationSeconds: 525,
    dealTemperature: 'caliente',
    category: 'llamada_telefonica',
    budgetMentioned: '$600,000 MXN (Fase 1)',
    summary: [
      'Marcela busca certificar en sustentabilidad las 8 suites ejecutivas del hotel boutique.',
      'Buscan sustituir materiales sintéticos por maderas certificadas y pinturas minerales libres de VOCs.',
      'Aprobación final del consejo administrativo programada para fin de mes.'
    ],
    painPoints: [
      'Olores a pintura y solventes que molestaban a huéspedes frecuentes.',
      'Gasto excesivo de electricidad en minisplits en temporada de calor.'
    ],
    actionItems: [
      {
        id: 'act_4',
        task: 'Enviar catálogo de acabados naturales y ficha técnica de COVs',
        assignee: 'Sara Sazedi',
        dueDate: 'Jueves',
        completed: true
      },
      {
        id: 'act_5',
        task: 'Presentación ejecutiva ante dirección de operaciones del hotel',
        assignee: 'Sara Sazedi y Marcela Vega',
        dueDate: 'Lunes 11:00 AM',
        completed: false
      }
    ],
    transcript:
      'Marcela Vega: Hola Sara, revisé tu tarjeta digital y el video de caso de éxito. Queremos remodelar nuestras 8 suites ejecutivas con materiales libres de químicos.\n\nSara Sazedi: Es un proyecto perfecto. Podemos integrar cantera regional y ventilación estratificada.\n\nMarcela Vega: Justo lo que buscamos. Tenemos sesión con el consejo para autorizar la Fase 1 estimada en 600 mil pesos.'
  },
  {
    id: 'meet_sara_03',
    publicId: 'sara-sazedi',
    leadId: 'lead_sara_03',
    leadName: 'Lic. Fernando Garza Ruiz',
    leadCompany: 'Corporativo Plaza Náutica Juriquilla',
    title: 'Audio-Nota: Pérgolas Solares Terraza Corporativa',
    timestamp: hoursAgo(75),
    durationSeconds: 72,
    dealTemperature: 'tibio',
    category: 'audio_nota',
    budgetMentioned: '$180,000 MXN estimados',
    summary: [
      'Nota de voz grabada al salir de reunión de pasillo con Fernando Garza en Plaza Náutica.',
      'Tienen 450 m² de terraza corporativa desaprovechada por falta de sombra.',
      'Interés en pérgolas bioclimáticas con captación solar para iluminación nocturna.'
    ],
    painPoints: [
      'Área de terraza vacía entre las 11:00 y las 17:00 por radiación solar directa.'
    ],
    actionItems: [
      {
        id: 'act_6',
        task: 'Levantamiento arquitectónico y estudio de asoleamiento en sitio',
        assignee: 'Sara Sazedi',
        dueDate: 'Martes 11:00 AM',
        completed: true
      }
    ],
    transcript:
      'Sara Sazedi (Nota de voz post-reunión): Acabo de platicar brevemente con Fernando Garza de Corporativo Plaza Náutica. Tienen 450 metros cuadrados de terraza corporativa desaprovechados. Quedamos de hacer el levantamiento físico el próximo martes a las 11:00 AM en sitio.'
  },
  {
    id: 'meet_sara_04',
    publicId: 'sara-sazedi',
    leadId: 'lead_sara_04',
    leadName: 'Dra. Valeria Gómez Conde',
    leadCompany: 'Clínica Dermatológica Alttus Juriquilla',
    title: 'Kick-off Expansión Segunda Sucursal Centro Sur',
    timestamp: hoursAgo(118),
    durationSeconds: 690,
    dealTemperature: 'caliente',
    category: 'reunion_presencial',
    budgetMentioned: '$240,000 MXN (Cerrado)',
    summary: [
      'Definición de cronograma de 10 semanas para apertura de sucursal Centro Sur.',
      'Se validó layout de 4 consultorios dermatológicos y área de recepción.',
      'Anticipo del 50% liquidado y arranque de obra interior confirmado.'
    ],
    painPoints: [
      'Retrasos previos con contratistas generales sin supervisión ejecutiva.',
      'Necesidad de inaugurar antes del cierre del trimestre.'
    ],
    actionItems: [
      {
        id: 'act_7',
        task: 'Entregar cronograma maestro de proveedores y acabados',
        assignee: 'Sara Sazedi',
        dueDate: 'Completado',
        completed: true
      },
      {
        id: 'act_8',
        task: 'Revisión semanal de avance todos los jueves 9:00 AM',
        assignee: 'Sara Sazedi y Dra. Valeria Gómez',
        dueDate: 'Jueves 9:00 AM',
        completed: false
      }
    ],
    transcript:
      'Dra. Valeria Gómez: Gracias por la claridad del alcance, Sara. Ya quedó transferido el anticipo del 50% para arrancar el proyecto ejecutivo de la sucursal Centro Sur.\n\nSara Sazedi: Excelente Valeria, este jueves a las 9:00 AM revisamos el primer corte de proveedores en sitio.'
  }
];

/**
 * 4 tailored sets of Meeting Intelligence recordings for each of the 7 Demo Archetype Profiles
 */
export const DEMO_PROFILES_MOCK_MEETINGS: Record<string, MeetingRecording[]> = {
  'demo-clara-navarro': [
    {
      id: 'meet_clara_01',
      publicId: 'demo-clara-navarro',
      leadId: 'lead_clara_01',
      leadName: 'Ing. Ricardo Montemayor',
      leadCompany: 'Montemayor Logística & Distribución',
      title: 'Diagnóstico de Responsabilidades y Delegación Operativa',
      timestamp: hoursAgo(4),
      durationSeconds: 940,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$75,000 MXN (Programa 8 semanas)',
      summary: [
        'Ricardo expuso que al crecer de 14 a 32 colaboradores, todas las autorizaciones de rutas e incidencias siguen concentradas en él.',
        'Los 4 supervisores de tráfico carecen de matriz de decisión y escalan cualquier imprevisto menor.',
        'Se propuso intervenir con mapa de responsabilidades por puesto y ritual semanal de seguimiento de acuerdos.',
        'Presupuesto de $75,000 MXN pre-aprobado para iniciar el próximo lunes.'
      ],
      painPoints: [
        'Dirección saturada con más de 40 llamadas operativas al día.',
        'Supervisores con temor a tomar decisiones por falta de criterios escritos.',
        'Duplicidad de funciones entre almacén y facturación.'
      ],
      actionItems: [
        {
          id: 'clara_act_1',
          task: 'Enviar carta propuesta con alcance de 8 semanas y entregables',
          assignee: 'Clara Navarro',
          dueDate: 'Jueves 2:00 PM',
          completed: false
        },
        {
          id: 'clara_act_2',
          task: 'Compartir organigrama actual y lista de los 4 supervisores clave',
          assignee: 'Ing. Ricardo Montemayor',
          dueDate: 'Viernes 11:00 AM',
          completed: true
        },
        {
          id: 'clara_act_3',
          task: 'Agendar entrevistas individuales de 30 min con jefes de área',
          assignee: 'Clara Navarro',
          dueDate: 'Lunes 9:00 AM',
          completed: false
        }
      ],
      transcript:
        'Ricardo Montemayor: Clara, hoy siento que soy el bombero de mi propia empresa. Crecimos a 32 personas pero cada cambio de ruta o reclamo de cliente termina en mi celular.\n\nClara Navarro: Es una etapa muy común cuando el equipo crece rápido. No es falta de capacidad de tus supervisores, sino que aún no tienen un marco claro de qué decisiones sí les corresponden y bajo qué criterio.\n\nRicardo Montemayor: Justo eso necesito. Si logramos que los 4 supervisores resuelvan el 80% de la operación diaria con acuerdos claros, me cambias la vida. Tenemos 75 mil pesos considerados para esta consultoría.'
    },
    {
      id: 'meet_clara_02',
      publicId: 'demo-clara-navarro',
      leadId: 'lead_clara_02',
      leadName: 'Lic. Mariana Solís',
      leadCompany: 'Grupo Comercial Cima del Bajío',
      title: 'Diseño de Ruta de Incorporación (6 Coordinadores de Sucursal)',
      timestamp: hoursAgo(22),
      durationSeconds: 610,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: '$48,000 MXN',
      summary: [
        'Grupo Cima abrirá 2 sucursales y contratará 6 nuevos coordinadores el próximo mes.',
        'En contrataciones pasadas sufrieron rotación temprana en los primeros 45 días por falta de acompañamiento estructurado.',
        'Se diseñará guía de incorporación 30-60-90 días con hitos verificables por semana.'
      ],
      painPoints: [
        'Inducción improvisada donde cada gerente enseña de forma distinta.',
        'Curva de aprendizaje lenta que afecta las ventas del primer trimestre.'
      ],
      actionItems: [
        {
          id: 'clara_act_4',
          task: 'Enviar muestra anonimizada de ruta de incorporación 30-60-90',
          assignee: 'Clara Navarro',
          dueDate: 'Hoy 5:00 PM',
          completed: true
        },
        {
          id: 'clara_act_5',
          task: 'Presentar alcance final a Dirección de Operaciones',
          assignee: 'Clara Navarro y Mariana Solís',
          dueDate: 'Viernes 10:00 AM',
          completed: false
        }
      ],
      transcript:
        'Mariana Solís: Hola Clara, gracias por tomar la llamada. El mes entrante ingresan 6 coordinadores nuevos y no queremos repetir el caos del año pasado donde dos renunciaron al primer mes porque nadie les explicó qué se esperaba de ellos.\n\nClara Navarro: Con una ruta de incorporación de 4 semanas con entregables claros y un responsable de acompañamiento, el nuevo colaborador gana confianza desde el primer día.'
    },
    {
      id: 'meet_clara_03',
      publicId: 'demo-clara-navarro',
      leadId: 'lead_clara_03',
      leadName: 'Arq. Esteban Villalobos',
      leadCompany: 'Villalobos Estudio & Construcción',
      title: 'Audio-Nota: Taller de Seguimiento de Acuerdos en Obra',
      timestamp: hoursAgo(50),
      durationSeconds: 95,
      dealTemperature: 'tibio',
      category: 'audio_nota',
      budgetMentioned: '$32,000 MXN',
      summary: [
        'Nota de voz posterior al café con el Arq. Esteban Villalobos en Álamos.',
        'Sus juntas de los lunes con residentes de obra y compras duran más de 2 horas sin minuta accionable.',
        'Requieren implementar formato ágil de compromisos de 30 minutos con responsables y fechas.'
      ],
      painPoints: [
        'Materiales que llegan tarde a obra porque los acuerdos quedan solo platicados.',
        'Desgaste entre el área de proyectos y compras.'
      ],
      actionItems: [
        {
          id: 'clara_act_6',
          task: 'Asistir como observadora a su junta semanal de obra del miércoles',
          assignee: 'Clara Navarro',
          dueDate: 'Miércoles 10:00 AM',
          completed: false
        }
      ],
      transcript:
        'Clara Navarro (Nota de voz): Acabo de salir de reunión con Esteban Villalobos. Su principal frustración son las juntas interminables de los lunes donde todos opinan pero nadie anota quién queda responsable de cada compra de obra. Quedamos en que asistiré este miércoles a las 10 AM a observar su reunión y presentarles el sistema de seguimiento.'
    },
    {
      id: 'meet_clara_04',
      publicId: 'demo-clara-navarro',
      leadId: 'lead_clara_04',
      leadName: 'C.P. Sofía Elizondo',
      leadCompany: 'Elizondo & Asociados Despacho Fiscal',
      title: 'Cierre de Matriz de Roles y Gobernanza Operativa',
      timestamp: hoursAgo(115),
      durationSeconds: 780,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$68,000 MXN (Contratado)',
      summary: [
        'Revisión y firma del plan de intervención para 3 socios y 18 contadores del despacho.',
        'Se definieron los tableros de asignación de clientes y criterios de revisión fiscal.',
        'Los socios esperan liberar 12 horas semanales dedicadas antes a supervisión operativa.'
      ],
      painPoints: [
        'Cuellos de botella en cierres mensuales por falta de filtros intermedios.'
      ],
      actionItems: [
        {
          id: 'clara_act_7',
          task: 'Entregar matriz definitiva de responsabilidades a los 3 socios',
          assignee: 'Clara Navarro',
          dueDate: 'Completado',
          completed: true
        },
        {
          id: 'clara_act_8',
          task: 'Primera sesión de calibración quincenal con líderes de equipo',
          assignee: 'Clara Navarro',
          dueDate: 'Martes 4:00 PM',
          completed: false
        }
      ],
      transcript:
        'Sofía Elizondo: Clara, los tres socios estamos totalmente de acuerdo con la propuesta de 68 mil pesos. Arrancamos formalmente con los líderes de equipo para dejar lista la matriz antes del cierre mensual.'
    }
  ],

  'demo-diego-salas': [
    {
      id: 'meet_diego_01',
      publicId: 'demo-diego-salas',
      leadId: 'lead_diego_01',
      leadName: 'Dr. Alejandro Cordero',
      leadCompany: 'Instituto Cardiopulmonar del Bajío',
      title: 'Definición de Criterios Residenciales (Juriquilla / Campanario)',
      timestamp: hoursAgo(3),
      durationSeconds: 820,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$8,200,000 MXN (Compra Residencial)',
      summary: [
        'El Dr. Cordero se traslada de CDMX a Querétaro en 60 días con su esposa y dos hijos.',
        'Requiere residencia de 3 recámaras + estudio en planta baja, jardín mínimo de 80 m² y cercanía a colegios en Juriquilla o El Campanario.',
        'Cuenta con $4.5M MXN en recursos propios y línea hipotecaria pre-autorizada por $4M MXN.'
      ],
      painPoints: [
        'Ha visto más de 30 portales en internet con propiedades repetidas o ya vendidas.',
        'Solo dispone de este sábado por la mañana para visitar opciones reales.'
      ],
      actionItems: [
        {
          id: 'diego_act_1',
          task: 'Enviar dossier comparativo con las 4 residencias que cumplen el 100% del filtro',
          assignee: 'Diego Salas',
          dueDate: 'Jueves 1:00 PM',
          completed: true
        },
        {
          id: 'diego_act_2',
          task: 'Confirmar ruta de visitas agendadas para el sábado de 9:30 AM a 1:30 PM',
          assignee: 'Diego Salas',
          dueDate: 'Viernes 10:00 AM',
          completed: false
        },
        {
          id: 'diego_act_3',
          task: 'Validar estatus libre de gravamen de las 2 opciones favoritas',
          assignee: 'Diego Salas',
          dueDate: 'Viernes 5:00 PM',
          completed: false
        }
      ],
      transcript:
        'Dr. Alejandro Cordero: Diego, qué alivio platicar con alguien que primero pregunta qué necesitamos antes de mandarme veinte ligas sin filtro. Buscamos mudarnos en dos meses y mi presupuesto tope es de 8.2 millones.\n\nDiego Salas: Cuenta con ello, doctor. Con los criterios que definimos hoy —estudio en planta baja, orientación oriente-poniente y seguridad 24/7— voy a filtrar únicamente 4 propiedades verificadas jurídicamente para que su visita del sábado sea 100% productiva.'
    },
    {
      id: 'meet_diego_02',
      publicId: 'demo-diego-salas',
      leadId: 'lead_diego_02',
      leadName: 'Lic. Paulina Castañeda',
      leadCompany: 'Kafé Nórdico Tostadores',
      title: 'Búsqueda de Local Comercial Sucursal Álamos / Carretas',
      timestamp: hoursAgo(24),
      durationSeconds: 590,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: '$42,000 MXN / mes (Arrendamiento 3 años)',
      summary: [
        'Paulina busca abrir la segunda sucursal de Kafé Nórdico en un corredor caminable de Álamos o Carretas.',
        'Indispensable: superficie de 90 a 120 m², terraza exterior, acometida trifásica para tostador y dictamen de giro comercial autorizado.',
        'Renta objetivo: hasta $42,000 MXN mensuales con contrato inicial de 3 años.'
      ],
      painPoints: [
        'Perdió dos meses negociando un local anterior que no tenía factibilidad de giro para cafetería con terraza.'
      ],
      actionItems: [
        {
          id: 'diego_act_4',
          task: 'Verificar dictamen de uso de suelo de los 2 locales de Álamos 3ra Sección',
          assignee: 'Diego Salas',
          dueDate: 'Miércoles 4:00 PM',
          completed: true
        },
        {
          id: 'diego_act_5',
          task: 'Recorrido físico con el arquitecto de Paulina en ambos locales',
          assignee: 'Diego Salas y Paulina Castañeda',
          dueDate: 'Jueves 11:00 AM',
          completed: false
        }
      ],
      transcript:
        'Paulina Castañeda: Hola Diego, nuestro principal temor es rentar un espacio hermoso y que luego municipio no nos autorice la licencia de cafetería y tostador.\n\nDiego Salas: Por eso antes de programar el recorrido del jueves ya solicité las constancias de factibilidad de giro en los dos locales de Álamos.'
    },
    {
      id: 'meet_diego_03',
      publicId: 'demo-diego-salas',
      leadId: 'lead_diego_03',
      leadName: 'Ing. Héctor Becerra',
      leadCompany: 'Precision Aero Components',
      title: 'Audio-Nota: Reubicación de 2 Directivos Expatriados en Zibatá',
      timestamp: hoursAgo(54),
      durationSeconds: 88,
      dealTemperature: 'tibio',
      category: 'audio_nota',
      budgetMentioned: '$34,000 MXN / mes por residencia',
      summary: [
        'Nota de voz tras llamada con Héctor Becerra de Precision Aero.',
        'Llegan 2 directores de ingeniería de Francia por contrato de 24 meses.',
        'Requieren facturación fiscal de arrendamiento, póliza jurídica corporativa y casas 100% equipadas.'
      ],
      painPoints: [
        'Muchos propietarios particulares no emiten factura fiscal de arrendamiento a empresas.'
      ],
      actionItems: [
        {
          id: 'diego_act_6',
          task: 'Enviar listado de 5 residencias amuebladas con facturación fiscal confirmada',
          assignee: 'Diego Salas',
          dueDate: 'Jueves 12:00 PM',
          completed: true
        }
      ],
      transcript:
        'Diego Salas (Nota de voz): Acabo de colgar con Héctor Becerra de Precision Aero. Necesitan dos casas amuebladas en Zibatá para directivos que llegan el mes próximo, pero es requisito indispensable que los propietarios emitan CFDI de arrendamiento. Ya tengo 5 opciones filtradas para el recorrido del viernes.'
    },
    {
      id: 'meet_diego_04',
      publicId: 'demo-diego-salas',
      leadId: 'lead_diego_04',
      leadName: 'Sra. Carmen Valladares',
      leadCompany: 'Patrimonio Familiar Valladares',
      title: 'Recepción de Expediente y Valuación Comercial Av. Constituyentes',
      timestamp: hoursAgo(98),
      durationSeconds: 740,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$6,400,000 MXN (Exclusiva Firmada)',
      summary: [
        'Se revisó escritura pública, certificado de libertad de gravamen y predial pagado de la propiedad comercial en Constituyentes.',
        'Se presentó estudio comparativo de mercado ubicando el valor óptimo de salida en $6,400,000 MXN.',
        'Se firmó contrato de intermediación exclusiva con comisión del 5%.'
      ],
      painPoints: [
        'Incertidumbre sobre impuestos ISR por enajenación y filtro de seguridad para visitas.'
      ],
      actionItems: [
        {
          id: 'diego_act_7',
          task: 'Entregar pre-cálculo notarial de exención/retención de ISR',
          assignee: 'Diego Salas',
          dueDate: 'Completado',
          completed: true
        },
        {
          id: 'diego_act_8',
          task: 'Publicar ficha técnica verificada y presentar a 3 inversionistas en cartera',
          assignee: 'Diego Salas',
          dueDate: 'Lunes',
          completed: false
        }
      ],
      transcript:
        'Sra. Carmen Valladares: Me da mucha tranquilidad que revisen primero los documentos con la notaría y que solo lleven compradores previamente identificados, Diego.\n\nDiego Salas: Así trabajamos doña Carmen. Con el expediente completo en orden, esta semana presentamos la propiedad a tres inversionistas patrimoniales.'
    }
  ],

  'demo-renata-vidal': [
    {
      id: 'meet_renata_01',
      publicId: 'demo-renata-vidal',
      leadId: 'lead_renata_01',
      leadName: 'Lic. Daniela Orozco',
      leadCompany: 'Boston Tech Hub Querétaro',
      title: 'Coordinación Gastronómica: Offsite Anual de Liderazgo (28 personas)',
      timestamp: hoursAgo(5),
      durationSeconds: 680,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$38,500 MXN (2 Jornadas Completas)',
      summary: [
        'Boston Tech realizará su planeación estratégica anual durante 2 días completos en Juriquilla.',
        'Buscan estación continua de café de especialidad, snacks saludables matutinos, almuerzo ligero que no dé sueño y cierre vespertino.',
        'Se contemplan 4 menús vegetarianos etiquetados y 2 libres de gluten.'
      ],
      painPoints: [
        'En su evento anterior el proveedor entregó alimentos pesados tarde, retrasando la agenda directiva 45 minutos.',
        'Necesitan montaje silencioso fuera de la sala mientras los directores sesionan.'
      ],
      actionItems: [
        {
          id: 'renata_act_1',
          task: 'Enviar propuesta con desglose de horarios de montaje y menú por día',
          assignee: 'Renata Vidal',
          dueDate: 'Jueves 12:00 PM',
          completed: false
        },
        {
          id: 'renata_act_2',
          task: 'Confirmar contacto de administración del venue en Juriquilla para acceso de equipo',
          assignee: 'Lic. Daniela Orozco',
          dueDate: 'Viernes',
          completed: true
        },
        {
          id: 'renata_act_3',
          task: 'Enviar datos fiscales de Mesa Clara para alta de proveedor',
          assignee: 'Renata Vidal',
          dueDate: 'Jueves 4:00 PM',
          completed: false
        }
      ],
      transcript:
        'Daniela Orozco: Hola Renata, para nosotros la puntualidad del coffee break y del almuerzo es sagrada porque traemos directores de tres países con agenda minuto a minuto.\n\nRenata Vidal: Totalmente entendido Daniela. Nosotros llegamos 60 minutos antes de cada bloque, montamos en silencio con todo etiquetado para tus 4 invitados vegetarianos y 2 gluten-free, y dejamos la estación lista al minuto exacto.'
    },
    {
      id: 'meet_renata_02',
      publicId: 'demo-renata-vidal',
      leadId: 'lead_renata_02',
      leadName: 'Mtro. Rodrigo Santillán',
      leadCompany: 'Consejo Empresarial del Bajío',
      title: 'Desayuno Ejecutivo para Sesión de Consejo (14 Consejeros)',
      timestamp: hoursAgo(28),
      durationSeconds: 460,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: '$14,800 MXN',
      summary: [
        'Sesión privada de consejo el jueves a las 8:00 AM en sala de juntas del piso 12 en Centro Sur.',
        'Formato elegido: Desayuno ejecutivo individual en tres tiempos ligeros con vajilla de cerámica y cristalería incluida.',
        'Montaje completo a las 7:30 AM y retiro al finalizar la sesión a las 10:30 AM.'
      ],
      painPoints: [
        'La sala de consejo no cuenta con cocina ni personal de apoyo propio.'
      ],
      actionItems: [
        {
          id: 'renata_act_4',
          task: 'Confirmar lista de placas vehiculares para acceso a estacionamiento de Centro Sur',
          assignee: 'Renata Vidal',
          dueDate: 'Miércoles 1:00 PM',
          completed: true
        },
        {
          id: 'renata_act_5',
          task: 'Recepción de anticipo del 50% para bloqueo de fecha',
          assignee: 'Mtro. Rodrigo Santillán',
          dueDate: 'Miércoles 5:00 PM',
          completed: false
        }
      ],
      transcript:
        'Rodrigo Santillán: Renata, nos gustó mucho que tu propuesta ya incluya toda la cristalería, termos y el retiro completo sin que nuestro equipo tenga que lavar o recoger nada.\n\nRenata Vidal: Así es Rodrigo, llegamos 7:15 AM para que a las 7:45 que llegan los primeros consejeros el café y la mesa estén impecables.'
    },
    {
      id: 'meet_renata_03',
      publicId: 'demo-renata-vidal',
      leadId: 'lead_renata_03',
      leadName: 'Arq. Camila Fuentes',
      leadCompany: 'Fuentes Estudio de Interiorismo',
      title: 'Audio-Nota: Mesa de Quesos y Charcutería Inauguración Showroom',
      timestamp: hoursAgo(62),
      durationSeconds: 82,
      dealTemperature: 'tibio',
      category: 'audio_nota',
      budgetMentioned: '$26,000 MXN',
      summary: [
        'Nota de voz tras hablar con la Arq. Camila Fuentes sobre el cóctel de inauguración de su showroom.',
        '45 invitados VIP entre arquitectos, clientes y desarrolladores.',
        'Quieren una mesa central estética con quesos regionales de Querétaro, frutos secos, pan artesanal y bocadillos fáciles de tomar de pie.'
      ],
      painPoints: [
        'Quieren evitar bocadillos con salsas que puedan manchar el mobiliario de exhibición del showroom.'
      ],
      actionItems: [
        {
          id: 'renata_act_6',
          task: 'Visitar el showroom el miércoles 5:00 PM para medir la isla de mármol central',
          assignee: 'Renata Vidal',
          dueDate: 'Miércoles 5:00 PM',
          completed: false
        }
      ],
      transcript:
        'Renata Vidal (Nota de voz): Acabo de hablar con Camila Fuentes. Para la inauguración de su showroom de interiorismo es clave que todos los bocadillos sean secos, limpios y de un solo bocado para proteger los muebles en exhibición. El miércoles a las 5 PM voy a ver la isla central donde montaremos la mesa.'
    },
    {
      id: 'meet_renata_04',
      publicId: 'demo-renata-vidal',
      leadId: 'lead_renata_04',
      leadName: 'Ing. Gustavo Pineda',
      leadCompany: 'EuroPlast Automotive Querétaro',
      title: 'Convenio Trimestral de Desayunos de Resultados en Planta',
      timestamp: hoursAgo(132),
      durationSeconds: 615,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$42,000 MXN (Cerrado)',
      summary: [
        'Cierre de programación trimestral para las juntas mensuales de resultados con 22 jefes de área.',
        'Entrega puntual el primer viernes de cada mes a las 8:15 AM en sala de capacitación de planta.',
        'Facturación mensual autorizada por compras.'
      ],
      painPoints: [
        'Proveedores anteriores incumplían con los requisitos de acceso e higiene del parque industrial.'
      ],
      actionItems: [
        {
          id: 'renata_act_7',
          task: 'Alta en portal de proveedores y envío de opinión de cumplimiento',
          assignee: 'Renata Vidal',
          dueDate: 'Completado',
          completed: true
        }
      ],
      transcript:
        'Gustavo Pineda: Renata, ya quedó liberada la orden de compra por los tres meses. Nos dio mucha confianza el orden de tu propuesta y el cumplimiento de horarios en planta.'
    }
  ],

  'demo-jorge-herrera': [
    {
      id: 'meet_jorge_01',
      publicId: 'demo-jorge-herrera',
      leadId: 'lead_jorge_01',
      leadName: 'Ing. Víctor Manuel Lozano',
      leadCompany: 'Metalúrgica Industrial del Bajío',
      title: 'Alineación y Ajuste Mecánico en Transportadores Línea 3',
      timestamp: hoursAgo(2),
      durationSeconds: 910,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$94,000 MXN',
      summary: [
        'Revisión técnica en piso de planta junto al Ing. Lozano sobre vibración en 2 transportadores de cadena de Línea 3.',
        'Se detectó desgaste en chumaceras principales y desalineación en eje motriz.',
        'Intervención programada para ventana de paro de este sábado de 7:00 AM a 3:00 PM con 4 técnicos certificados DC-3.'
      ],
      painPoints: [
        'Riesgo de paro no programado que costaría más de $180,000 MXN por turno detenido.',
        'Urgencia de contar con reporte firmable para auditoría interna de mantenimiento.'
      ],
      actionItems: [
        {
          id: 'jorge_act_1',
          task: 'Enviar cotización formal con listado de refacciones SKF y mano de obra especializada',
          assignee: 'Jorge Herrera',
          dueDate: 'Hoy 4:00 PM',
          completed: true
        },
        {
          id: 'jorge_act_2',
          task: 'Enviar vigencias SUA/IMSS, REPSE y certificados DC-3 de la cuadrilla',
          assignee: 'Jorge Herrera',
          dueDate: 'Jueves 11:00 AM',
          completed: false
        },
        {
          id: 'jorge_act_3',
          task: 'Liberar permiso de trabajo seguro y bloqueo LOTO con EHS de planta',
          assignee: 'Ing. Víctor Manuel Lozano',
          dueDate: 'Viernes 1:00 PM',
          completed: false
        }
      ],
      transcript:
        'Víctor Lozano: Jorge, no podemos arriesgarnos a que la línea 3 truene a mitad de semana. Tenemos ventana este sábado de 7 de la mañana a 3 de la tarde.\n\nJorge Herrera: Cuenta con nuestro equipo, Víctor. Hoy mismo te mando la cotización por los 94 mil pesos incluyendo el reemplazo de chumaceras, alineación láser y el reporte técnico con mediciones antes y después.'
    },
    {
      id: 'meet_jorge_02',
      publicId: 'demo-jorge-herrera',
      leadId: 'lead_jorge_02',
      leadName: 'Ing. Claudia Rentería',
      leadCompany: 'Sistemas Automotrices El Marqués',
      title: 'Fabricación de 18 Dispositivos de Sujeción (Fixtures Inox)',
      timestamp: hoursAgo(20),
      durationSeconds: 670,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: '$162,000 MXN',
      summary: [
        'Revisión de planos STEP y tolerancias geométricas para 18 fixtures de ensamble en acero inoxidable 304.',
        'Se propuso entregar 2 piezas piloto en 6 días hábiles para validación en línea antes de correr las 16 restantes.',
        'Incluye certificado dimensional por pieza.'
      ],
      painPoints: [
        'Su proveedor extranjero actual les dio 9 semanas de tiempo de entrega.'
      ],
      actionItems: [
        {
          id: 'jorge_act_4',
          task: 'Enviar propuesta económica con cronograma de pieza piloto en Día 6',
          assignee: 'Jorge Herrera',
          dueDate: 'Jueves 10:00 AM',
          completed: true
        },
        {
          id: 'jorge_act_5',
          task: 'Autorización de requisición de compra en sistema SAP',
          assignee: 'Ing. Claudia Rentería',
          dueDate: 'Viernes 12:00 PM',
          completed: false
        }
      ],
      transcript:
        'Claudia Rentería: Jorge, si me entregas las 2 piezas piloto en 6 días para liberarlas con calidad y el lote completo en 3 semanas, el proyecto es de ustedes.\n\nJorge Herrera: Trato hecho, Claudia. Nuestro taller CNC ya revisó las tolerancias y tenemos el acero inoxidable 304 en stock.'
    },
    {
      id: 'meet_jorge_03',
      publicId: 'demo-jorge-herrera',
      leadId: 'lead_jorge_03',
      leadName: 'Lic. Marco Antonio Zepeda',
      leadCompany: 'Procesadora de Alimentos del Centro',
      title: 'Audio-Nota: Levantamiento Reubicación Línea de Envasado',
      timestamp: hoursAgo(53),
      durationSeconds: 92,
      dealTemperature: 'tibio',
      category: 'audio_nota',
      budgetMentioned: '$125,000 MXN estimados',
      summary: [
        'Nota de voz tras llamada con Marco Zepeda de Compras Técnicas.',
        'Van a mover una línea de envasado de la nave A a la nave B el próximo mes.',
        'Requieren maniobra mecánica, nivelación, anclaje químico y reconexión neumática.'
      ],
      painPoints: [
        'Necesitan proveedor con REPSE vigente y protocolo sanitario para planta de alimentos.'
      ],
      actionItems: [
        {
          id: 'jorge_act_6',
          task: 'Asistir a levantamiento físico en planta con calzado de seguridad y cofia',
          assignee: 'Jorge Herrera',
          dueDate: 'Jueves 10:30 AM',
          completed: false
        }
      ],
      transcript:
        'Jorge Herrera (Nota de voz): Hablé con Marco Zepeda de Procesadora de Alimentos. Mañana jueves a las 10:30 AM hacemos el levantamiento en planta para la reubicación de su línea de envasado. Llevar carpeta impresa de REPSE y DC-3 de maniobras.'
    },
    {
      id: 'meet_jorge_04',
      publicId: 'demo-jorge-herrera',
      leadId: 'lead_jorge_04',
      leadName: 'Ing. Raúl Domínguez',
      leadCompany: 'AeroTech Machining Querétaro',
      title: 'Arranque de Póliza Semestral de Mantenimiento Preventivo',
      timestamp: hoursAgo(142),
      durationSeconds: 790,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$185,000 MXN (OC-8841)',
      summary: [
        'Firma de calendario de mantenimiento preventivo para 6 celdas de manufactura.',
        'Se asignó ingeniero residente líder de cuenta y bitácora digital de entregables por intervención.'
      ],
      painPoints: [
        'Falta de trazabilidad documental en mantenimientos preventivos anteriores.'
      ],
      actionItems: [
        {
          id: 'jorge_act_7',
          task: 'Entregar carpeta de bitácoras y matriz de escalación 24/7',
          assignee: 'Jorge Herrera',
          dueDate: 'Completado',
          completed: true
        }
      ],
      transcript:
        'Raúl Domínguez: Ya tienes la orden de compra OC-8841 liberada, Jorge. Lo que más valoramos fue la estructura de reportes para nuestras auditorías AS9100.'
    }
  ],

  'demo-adriana-torres': [
    {
      id: 'meet_adriana_01',
      publicId: 'demo-adriana-torres',
      leadId: 'lead_adriana_01',
      leadName: 'Ing. Enrique Valdés',
      leadCompany: 'Clúster Automotriz de Querétaro',
      title: 'Mesa Directiva: Estándares de Liderazgo de Piso y Cultura Lean',
      timestamp: hoursAgo(4),
      durationSeconds: 880,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: 'Alianza Estratégica Regional',
      summary: [
        'Se definió la participación de Adriana en el Comité de Operaciones del Clúster Automotriz.',
        'Horizonte Manufactura compartirá su metodología de desarrollo de supervisores de piso ante 40 directores de planta.',
        'Se abrirán 3 mesas de trabajo inter-empresas sobre retención de talento técnico.'
      ],
      painPoints: [
        'Alta rotación de supervisores de primera línea en parques industriales del Bajío.',
        'Brecha entre indicadores directivos y la ejecución diaria en piso de producción.'
      ],
      actionItems: [
        {
          id: 'adriana_act_1',
          task: 'Compartir síntesis ejecutiva del caso de formación de supervisores',
          assignee: 'Adriana Torres',
          dueDate: 'Viernes 1:00 PM',
          completed: false
        },
        {
          id: 'adriana_act_2',
          task: 'Enviar agenda oficial del foro y lista de directores participantes',
          assignee: 'Ing. Enrique Valdés',
          dueDate: 'Jueves',
          completed: true
        }
      ],
      transcript:
        'Enrique Valdés: Adriana, el modelo que implementaste para reducir la rotación de técnicos y empoderar a los supervisores de celda es justo lo que las plantas del clúster necesitan conocer.\n\nAdriana Torres: Con todo gusto Enrique. Prepararé un caso práctico enfocado en cómo traducir los objetivos de planta en rutinas diarias claras para los líderes de equipo.'
    },
    {
      id: 'meet_adriana_02',
      publicId: 'demo-adriana-torres',
      leadId: 'lead_adriana_02',
      leadName: 'Dr. Samuel Ibarra',
      leadCompany: 'Universidad Politécnica Industrial',
      title: 'Programa de Educación Dual e Ingeniería en Planta',
      timestamp: hoursAgo(25),
      durationSeconds: 640,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: 'Convenio Educación Dual (8 Becarios)',
      summary: [
        'Revisión de matriz de competencias para integrar a 8 estudiantes de último año en proyectos de mejora continua.',
        'Cada estudiante contará con un mentor técnico certificado dentro de la planta y un proyecto medible de reducción de merma.'
      ],
      painPoints: [
        'Recién egresados que llegan a la industria sin experiencia en resolución estructurada de problemas (A3 / 8D).'
      ],
      actionItems: [
        {
          id: 'adriana_act_3',
          task: 'Validar los 4 proyectos de mejora continua donde participarán los alumnos duales',
          assignee: 'Adriana Torres',
          dueDate: 'Lunes 10:00 AM',
          completed: false
        },
        {
          id: 'adriana_act_4',
          task: 'Enviar pre-selección de 12 candidatos con promedio destacado',
          assignee: 'Dr. Samuel Ibarra',
          dueDate: 'Jueves',
          completed: true
        }
      ],
      transcript:
        'Dr. Samuel Ibarra: Adriana, tu tarjeta digital nos permitió identificar exactamente qué perfil de colaboración busca tu dirección de operaciones.\n\nAdriana Torres: Esa es la idea doctor: que cada alumno dual entre a resolver un proyecto real acompañado por nuestros ingenieros senior.'
    },
    {
      id: 'meet_adriana_03',
      publicId: 'demo-adriana-torres',
      leadId: 'lead_adriana_03',
      leadName: 'Ing. Lorena Téllez',
      leadCompany: 'Precision Stampings Bajío',
      title: 'Audio-Nota: Evaluación de Proveedor Local de Estampado Tier-2',
      timestamp: hoursAgo(65),
      durationSeconds: 85,
      dealTemperature: 'tibio',
      category: 'audio_nota',
      budgetMentioned: 'Programa Desarrollo de Proveedores',
      summary: [
        'Nota de voz tras revisar el dossier técnico de Precision Stampings Bajío.',
        'Cuentan con certificación IATF 16949 y prensas de 400 toneladas en Querétaro.',
        'Se canalizará a evaluación conjunta con Gerencia de Calidad y Cadena de Suministro.'
      ],
      painPoints: [
        'Tiempos de tránsito de 5 semanas en componentes estampados importados.'
      ],
      actionItems: [
        {
          id: 'adriana_act_5',
          task: 'Coordinar auditoría técnica preliminar con el equipo de Calidad de Proveedores',
          assignee: 'Adriana Torres',
          dueDate: 'Martes 12:00 PM',
          completed: false
        }
      ],
      transcript:
        'Adriana Torres (Nota de voz): Revisé la propuesta de Lorena Téllez de Precision Stampings. Tienen capacidad local certificada IATF que puede ayudarnos a sustituir dos números de parte importados. El martes al mediodía los recibimos con Calidad y Compras.'
    },
    {
      id: 'meet_adriana_04',
      publicId: 'demo-adriana-torres',
      leadId: 'lead_adriana_04',
      leadName: 'Mtro. Patricio Cuevas',
      leadCompany: 'Instituto Mexicano de Manufactura Esbelta',
      title: 'Certificación Interna de 25 Líderes de Celda y Supervisores',
      timestamp: hoursAgo(152),
      durationSeconds: 720,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: '$145,000 MXN (Aprobado)',
      summary: [
        'Aprobación del programa práctico de certificación en piso de planta para 25 líderes operativos.',
        '80% aplicación práctica en línea de producción y 20% metodología en aula.'
      ],
      painPoints: [
        'Cursos teóricos anteriores que no se traducían en mejoras operativas en turno.'
      ],
      actionItems: [
        {
          id: 'adriana_act_6',
          task: 'Inaugurar primera sesión con los 25 líderes seleccionados',
          assignee: 'Adriana Torres',
          dueDate: 'Completado',
          completed: true
        }
      ],
      transcript:
        'Patricio Cuevas: Todo listo Adriana, el programa quedó 100% adaptado a las líneas de Horizonte Manufactura y arrancamos el lunes en piso.'
    }
  ],

  'demo-lucia-cardenas': [
    {
      id: 'meet_lucia_01',
      publicId: 'demo-lucia-cardenas',
      leadId: 'lead_lucia_01',
      leadName: 'Lic. Gabriela Mondragón',
      leadCompany: 'Paciente Particular • Juriquilla',
      title: 'Orientación Previa a Valoración Médica Integral',
      timestamp: hoursAgo(3),
      durationSeconds: 420,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: 'Consulta de Valoración Integral',
      summary: [
        'Gabriela solicitó orientación sobre qué estudios llevar a su primera consulta de chequeo preventivo.',
        'Se le explicaron los horarios de atención, ubicación del consultorio con estacionamiento y preparación de ayuno.',
        'Cita confirmada para este jueves a las 5:00 PM.'
      ],
      painPoints: [
        'Lleva dos años posponiendo su revisión anual por falta de tiempo y dudas sobre qué análisis realizarse antes.'
      ],
      actionItems: [
        {
          id: 'lucia_act_1',
          task: 'Enviar por WhatsApp ficha de preparación y ubicación en Google Maps',
          assignee: 'Consultorio Dra. Lucía Cárdenas',
          dueDate: 'Completado',
          completed: true
        },
        {
          id: 'lucia_act_2',
          task: 'Realizar historia clínica integral y revisión de estudios en consulta',
          assignee: 'Dra. Lucía Cárdenas',
          dueDate: 'Jueves 5:00 PM',
          completed: false
        }
      ],
      transcript:
        'Gabriela Mondragón: Doctora, me dio mucha confianza ver en su tarjeta digital qué incluye la valoración inicial y cómo prepararme.\n\nDra. Lucía Cárdenas: Qué gusto Gabriela. Te esperamos este jueves a las 5:00 PM; trae por favor tus estudios del año pasado y la lista de cualquier medicamento o suplemento que tomes actualmente.'
    },
    {
      id: 'meet_lucia_02',
      publicId: 'demo-lucia-cardenas',
      leadId: 'lead_lucia_02',
      leadName: 'Ing. Carlos Alberto Rivas',
      leadCompany: 'Seguimiento Metabólico',
      title: 'Revisión de Bitácora de Presión Arterial y Control Glucémico',
      timestamp: hoursAgo(23),
      durationSeconds: 510,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: 'Consulta de Seguimiento Crónico',
      summary: [
        'El paciente acudió con bitácora ordenada de 14 días de tomas domiciliarias y resultados de laboratorio.',
        'Se observó mejoría sostenida en niveles de glucosa en ayuno y apego adecuado al tratamiento.',
        'Se entregaron indicaciones escritas claras y signos de alarma.'
      ],
      painPoints: [
        'En consultas previas fuera del consultorio sentía que no le explicaban el porqué de cada ajuste.'
      ],
      actionItems: [
        {
          id: 'lucia_act_3',
          task: 'Entregar hoja de seguimiento actualizada y plan de hábitos',
          assignee: 'Dra. Lucía Cárdenas',
          dueDate: 'Completado',
          completed: true
        },
        {
          id: 'lucia_act_4',
          task: 'Programar control trimestral de seguimiento en recepción',
          assignee: 'Ing. Carlos Alberto Rivas',
          dueDate: 'Próximo trimestre',
          completed: false
        }
      ],
      transcript:
        'Carlos Rivas: Gracias doctora, tener las indicaciones por escrito y saber exactamente cómo registrar mi presión en casa me ha ayudado muchísimo a mantenerme constante.'
    },
    {
      id: 'meet_lucia_03',
      publicId: 'demo-lucia-cardenas',
      leadId: 'lead_lucia_03',
      leadName: 'Dr. Mauricio Salgado',
      leadCompany: 'Centro de Especialidades Médicas QRO',
      title: 'Audio-Nota: Protocolo de Referencia e Interconsulta con Endocrinología',
      timestamp: hoursAgo(72),
      durationSeconds: 78,
      dealTemperature: 'tibio',
      category: 'audio_nota',
      budgetMentioned: 'Red de Interconsulta Médica',
      summary: [
        'Nota de voz sobre acuerdo de colaboración profesional con el Dr. Mauricio Salgado (Endocrinólogo).',
        'Se definió formato de resumen clínico de referencia para pacientes que requieren valoración subespecializada.',
        'Asegura continuidad de información entre medicina general y especialidad.'
      ],
      painPoints: [
        'Pacientes que llegan a consulta de especialidad sin resumen clínico previo ni laboratorios base.'
      ],
      actionItems: [
        {
          id: 'lucia_act_5',
          task: 'Compartir formato estándar de nota de referencia médica',
          assignee: 'Dra. Lucía Cárdenas',
          dueDate: 'Miércoles 1:30 PM',
          completed: false
        }
      ],
      transcript:
        'Dra. Lucía Cárdenas (Nota de voz): Conversé con el Dr. Mauricio Salgado para estandarizar nuestras notas de referencia e interconsulta. Así cuando un paciente requiera valoración endocrinológica lleva ya su historial y laboratorios iniciales ordenados.'
    },
    {
      id: 'meet_lucia_04',
      publicId: 'demo-lucia-cardenas',
      leadId: 'lead_lucia_04',
      leadName: 'Lic. Regina Alcántara',
      leadCompany: 'Colegio Verde Valle Querétaro',
      title: 'Coordinación de Certificados Médicos para Personal Docente',
      timestamp: hoursAgo(128),
      durationSeconds: 490,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: '$13,500 MXN (15 Valoraciones)',
      summary: [
        'Se programaron bloques de horarios escalonados para realizar la valoración clínica de 15 docentes.',
        'Cada docente recibió su certificado médico oficial tras evaluación física completa.'
      ],
      painPoints: [
        'Necesidad de horarios vespertinos programados para no interrumpir clases.'
      ],
      actionItems: [
        {
          id: 'lucia_act_6',
          task: 'Entrega de certificados médicos y comprobantes fiscales al colegio',
          assignee: 'Consultorio Dra. Lucía Cárdenas',
          dueDate: 'Completado',
          completed: true
        }
      ],
      transcript:
        'Regina Alcántara: Doctora Lucía, muchas gracias por la organización por citas escalonadas; todos los maestros salieron muy contentos con el trato y la puntualidad.'
    }
  ],

  'demo-gabriela-leon': [
    {
      id: 'meet_gabriela_01',
      publicId: 'demo-gabriela-leon',
      leadId: 'lead_gabriela_01',
      leadName: 'Mtra. Elena Beristain',
      leadCompany: 'Fundación Impulso Comunitario QRO',
      title: 'Revisión de Propuesta: Habilidades Digitales para 120 Jóvenes',
      timestamp: hoursAgo(4),
      durationSeconds: 830,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: 'Convenio de Co-Inversión Social',
      summary: [
        'Elena presentó la ficha técnica del programa de capacitación digital para 120 jóvenes en 3 municipios.',
        'La Fundación aporta convocatoria comunitaria, equipamiento móvil y seguimiento de beneficiarios.',
        'Se canalizará la propuesta a la Coordinación Académica para revisión curricular y validación jurídica.'
      ],
      painPoints: [
        'En acercamientos anteriores con otras instituciones desconocían qué requisitos debía incluir el oficio técnico.'
      ],
      actionItems: [
        {
          id: 'gabriela_act_1',
          task: 'Turnar expediente técnico a Coordinación Académica con nota de pertinencia',
          assignee: 'Mtra. Gabriela León',
          dueDate: 'Jueves 1:00 PM',
          completed: false
        },
        {
          id: 'gabriela_act_2',
          task: 'Adjuntar acta constitutiva y carta de aportación institucional de la Fundación',
          assignee: 'Mtra. Elena Beristain',
          dueDate: 'Viernes 12:00 PM',
          completed: true
        },
        {
          id: 'gabriela_act_3',
          task: 'Programar mesa de revisión técnica tripartita',
          assignee: 'Mtra. Gabriela León',
          dueDate: 'Martes 10:00 AM',
          completed: false
        }
      ],
      transcript:
        'Elena Beristain: Gabriela, la guía que tienes en tu tarjeta digital nos ayudó muchísimo a traer hoy definido el público objetivo, las horas de formación y lo que nuestra fundación aporta.\n\nMtra. Gabriela León: Eso agiliza todo el proceso, Elena. Con estos elementos completos puedo turnarlo hoy mismo al área académica para su dictamen técnico.'
    },
    {
      id: 'meet_gabriela_02',
      publicId: 'demo-gabriela-leon',
      leadId: 'lead_gabriela_02',
      leadName: 'Ing. Javier Solórzano',
      leadCompany: 'Comisión de Talento Pyme • Cámara Industrial',
      title: 'Articulación de Diplomado Técnico para Supervisores Pyme',
      timestamp: hoursAgo(27),
      durationSeconds: 690,
      dealTemperature: 'caliente',
      category: 'llamada_telefonica',
      budgetMentioned: 'Programa Autofinanciable (30 Empresas)',
      summary: [
        'La comisión industrial busca co-diseñar un programa de 60 horas para mandos medios de pymes locales.',
        'Se revisaron los lineamientos institucionales, tiempos de aprobación de consejo y responsabilidades de cada entidad.'
      ],
      painPoints: [
        'Pymes locales que no pueden costear consultorías individuales pero requieren profesionalizar a sus mandos medios.'
      ],
      actionItems: [
        {
          id: 'gabriela_act_4',
          task: 'Enviar lineamientos oficiales para propuestas de educación continua',
          assignee: 'Mtra. Gabriela León',
          dueDate: 'Completado',
          completed: true
        },
        {
          id: 'gabriela_act_5',
          task: 'Entregar resultados del sondeo de necesidades en las 30 empresas afiliadas',
          assignee: 'Ing. Javier Solórzano',
          dueDate: 'Lunes 11:00 AM',
          completed: false
        }
      ],
      transcript:
        'Javier Solórzano: Agradecemos mucho la claridad sobre qué sí corresponde a tu área de vinculación y cuáles son los tiempos reales de revisión académica, Gabriela.'
    },
    {
      id: 'meet_gabriela_03',
      publicId: 'demo-gabriela-leon',
      leadId: 'lead_gabriela_03',
      leadName: 'Dra. Patricia Mondragón',
      leadCompany: 'Centro Público de Investigación Aplicada',
      title: 'Audio-Nota: Mesa Interinstitucional de Sustentabilidad Hídrica',
      timestamp: hoursAgo(70),
      durationSeconds: 90,
      dealTemperature: 'tibio',
      category: 'audio_nota',
      budgetMentioned: 'Foro Regional Interinstitucional',
      summary: [
        'Nota de voz tras llamada con la Dra. Patricia Mondragón.',
        'Propone realizar un foro técnico abierto sobre aprovechamiento de agua en procesos productivos y comunitarios.',
        'Se convocará a Dirección Académica y Comunicación Institucional el jueves a las 11:00 AM.'
      ],
      painPoints: [
        'Necesidad de articular investigadores con actores comunitarios y municipios en un lenguaje accesible.'
      ],
      actionItems: [
        {
          id: 'gabriela_act_6',
          task: 'Confirmar sala de juntas y enlace de videollamada para mesa del jueves',
          assignee: 'Mtra. Gabriela León',
          dueDate: 'Miércoles 4:00 PM',
          completed: true
        }
      ],
      transcript:
        'Mtra. Gabriela León (Nota de voz): Conversé con la Dra. Patricia Mondragón sobre la jornada de divulgación en sustentabilidad hídrica. Este jueves a las 11 AM sentamos en la misma mesa a los investigadores con el área de extensión para definir el programa.'
    },
    {
      id: 'meet_gabriela_04',
      publicId: 'demo-gabriela-leon',
      leadId: 'lead_gabriela_04',
      leadName: 'Lic. Humberto Castañón',
      leadCompany: 'Red Educativa del Bajío A.C.',
      title: 'Formalización de Convenio Marco para Formación Docente',
      timestamp: hoursAgo(144),
      durationSeconds: 760,
      dealTemperature: 'caliente',
      category: 'reunion_presencial',
      budgetMentioned: 'Convenio Marco Institucional Firmado',
      summary: [
        'Concluyó la revisión jurídica y se firmó el convenio marco de colaboración con Red Educativa del Bajío.',
        'Se estableció calendario trimestral de seguimiento y enlaces operativos designados por ambas instituciones.'
      ],
      painPoints: [
        'Convenios anteriores que quedaban firmados pero sin plan de trabajo ni enlaces de seguimiento.'
      ],
      actionItems: [
        {
          id: 'gabriela_act_7',
          task: 'Publicar convocatoria conjunta en los canales oficiales autorizados',
          assignee: 'Mtra. Gabriela León y Lic. Humberto Castañón',
          dueDate: 'Completado',
          completed: true
        }
      ],
      transcript:
        'Humberto Castañón: Qué diferencia cuando desde el primer contacto todo está ordenado, Gabriela. Ya tenemos el convenio firmado y el cronograma del primer taller en marcha.'
    }
  ]
};

export function getMockMeetingsForProfileId(publicId: string): MeetingRecording[] {
  const cleanId = publicId.trim().toLowerCase();
  if (cleanId === 'sara-sazedi') return SARA_MOCK_MEETINGS;
  if (DEMO_PROFILES_MOCK_MEETINGS[cleanId]) return DEMO_PROFILES_MOCK_MEETINGS[cleanId];

  return SARA_MOCK_MEETINGS.map((m, idx) => ({
    ...m,
    id: `meet_${cleanId}_0${idx + 1}`,
    publicId: cleanId
  }));
}

function getLocalMeetings(publicId: string): MeetingRecording[] {
  try {
    const raw = localStorage.getItem(`tarjetas_meetings_${publicId.toLowerCase()}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMeetings(publicId: string, meetings: MeetingRecording[]): void {
  try {
    localStorage.setItem(`tarjetas_meetings_${publicId.toLowerCase()}`, JSON.stringify(meetings));
  } catch {}
}

/**
 * Seeds mock meetings locally and to Firestore
 */
export async function seedMockMeetings(publicId: string): Promise<MeetingRecording[]> {
  const cleanId = publicId.trim().toLowerCase();
  const mockData = getMockMeetingsForProfileId(cleanId);

  if (mockData.length === 0) return [];

  // 1. Save locally
  saveLocalMeetings(cleanId, mockData);

  // 2. Sync to Firestore in background
  try {
    for (const item of mockData) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await setDoc(docRef, item);
    }
  } catch (err) {
    console.warn('[MeetingService] Could not sync mock meetings to Firestore:', err);
  }

  return mockData;
}

/**
 * Fetches all meetings for a profile, sorted newest first
 */
export async function getMeetingsForProfile(publicId: string): Promise<MeetingRecording[]> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalMeetings(cleanId);
  const mockBaseline = getMockMeetingsForProfileId(cleanId);

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('publicId', '==', cleanId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const remote: MeetingRecording[] = [];
      snap.forEach((d) => {
        remote.push(d.data() as MeetingRecording);
      });

      const existingIds = new Set(remote.map((m) => m.id));
      const missingMocks = mockBaseline.filter((m) => !existingIds.has(m.id));
      const merged = [...remote, ...missingMocks];

      // Sort newest first
      merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      saveLocalMeetings(cleanId, merged);
      return merged;
    }
  } catch (err) {
    console.warn('[MeetingService] Firestore load failed, using local meetings:', err);
  }

  if (local.length > 0) {
    const existingIds = new Set(local.map((m) => m.id));
    const missingMocks = mockBaseline.filter((m) => !existingIds.has(m.id));
    const merged = [...local, ...missingMocks].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    saveLocalMeetings(cleanId, merged);
    return merged;
  }

  // Auto-seed realistic 4-set mock meetings for Sara and all 7 demo profiles
  return await seedMockMeetings(cleanId);
}

/**
 * Saves a new meeting recording
 */
export async function saveMeeting(
  meetingData: Omit<MeetingRecording, 'id' | 'timestamp'>
): Promise<MeetingRecording> {
  const cleanId = meetingData.publicId.trim().toLowerCase();
  const id = `meet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newMeeting: MeetingRecording = {
    ...meetingData,
    id,
    publicId: cleanId,
    timestamp: new Date().toISOString()
  };

  // 1. Save locally
  const local = getLocalMeetings(cleanId);
  const updated = [newMeeting, ...local];
  saveLocalMeetings(cleanId, updated);

  // 2. Sync to Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await setDoc(docRef, newMeeting);
  } catch (err) {
    console.warn('[MeetingService] Could not save to Firestore, saved locally:', err);
  }

  return newMeeting;
}

/**
 * Toggles an action item completed state
 */
export async function toggleMeetingActionItem(
  publicId: string,
  meetingId: string,
  actionItemId: string,
  completed: boolean
): Promise<boolean> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalMeetings(cleanId);

  const updated = local.map((m) => {
    if (m.id !== meetingId) return m;
    const updatedItems = m.actionItems.map((item) =>
      item.id === actionItemId ? { ...item, completed } : item
    );
    return { ...m, actionItems: updatedItems };
  });

  saveLocalMeetings(cleanId, updated);

  try {
    const docRef = doc(db, COLLECTION_NAME, meetingId);
    const targetMeeting = updated.find((m) => m.id === meetingId);
    if (targetMeeting) {
      await updateDoc(docRef, { actionItems: targetMeeting.actionItems });
    }
    return true;
  } catch (err) {
    console.warn('[MeetingService] Could not update action item in Firestore:', err);
    return false;
  }
}

/**
 * Deletes a meeting
 */
export async function deleteMeeting(publicId: string, meetingId: string): Promise<boolean> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalMeetings(cleanId);

  saveLocalMeetings(
    cleanId,
    local.filter((m) => m.id !== meetingId)
  );

  try {
    const docRef = doc(db, COLLECTION_NAME, meetingId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('[MeetingService] Could not delete from Firestore:', err);
    return false;
  }
}
