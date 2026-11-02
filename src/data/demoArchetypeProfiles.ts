import { ParticipantProfile, CardTestimonial } from '../types/card';

export const SHARED_VERIFIED_TESTIMONIALS: CardTestimonial[] = [
  {
    name: 'Irais Moncada',
    role: 'Alumna y Cliente Verificada',
    company: 'Recomendación en Facebook',
    comment:
      'El mejor curso de inglés que he tomado!! Incluso me mudé a Australia y mis cursos no son tan profesionales como los que da Kristoffer 👌 100% recomendado! Aprendes a un nivel profesional con sus clases dinámicas y sobre todo te fuerzas a hablar.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    stars: 5,
    sourceType: 'facebook',
    sourceUrl:
      'https://www.facebook.com/irais.moncada/posts/pfbid0364DQztrWD9c5y1XsaRFzhTpCquxCvfoMVjow1dKSkAVGQh5xM5GSykBasvs5G1Z6l',
    evidenceImageUrl: '/evidence/review-facebook-clara.png',
    evidenceLabel: 'Ver publicación en Facebook',
    date: '14 de diciembre de 2022'
  },
  {
    name: 'Luisa Fernanda Arias Cuéllar',
    role: 'Customer Experience Manager',
    company: 'Recomendación en LinkedIn • Customer Success & CRM',
    comment:
      'Tuve la oportunidad de trabajar con Alexander Vanegas durante la implementación de HubSpot, en su rol como partner implementador desde Dinterweb. Su capacidad para entender el negocio, traducirlo en soluciones concretas y alinear a los equipos fue determinante para el avance del proyecto.\n\nAlexander combina pensamiento estratégico con una ejecución impecable. Es una persona altamente responsable, estructurada y con un criterio claro para priorizar lo que realmente genera impacto. Más allá de cualquier herramienta o contexto específico, destaco su habilidad para construir trabajo cohesionado, anticiparse a los desafíos y mantener el foco en resultados.\n\nSin duda, es un aliado clave para cualquier organización que busque no solo implementar, sino realmente transformar la manera en que ejecuta su estrategia.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    stars: 5,
    sourceType: 'linkedin',
    sourceUrl:
      'https://www.linkedin.com/in/alexander-evr/details/recommendations/?detailScreenTabIndex=2',
    evidenceImageUrl: '/evidence/review-linkedin-luisa.png',
    evidenceLabel: 'Ver recomendación en LinkedIn',
    date: '19 de marzo de 2026'
  }
];

// Helper to create crisp, high-definition SVG emblems for demo brands
function createSvgLogo(initials: string, primaryColor: string, bgColor: string = '#ffffff'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}" />
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="36" fill="url(#grad)" stroke="${primaryColor}" stroke-width="4" stroke-opacity="0.2"/>
  <circle cx="80" cy="80" r="54" fill="${primaryColor}" fill-opacity="0.08" />
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-weight="900" font-size="44" fill="${primaryColor}" letter-spacing="-1">${initials}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEMO_ARCHETYPE_PROFILES: ParticipantProfile[] = [
  // =========================================================================
  // ARQUETIPO A: Profesional independiente / consultor — Clara Navarro
  // =========================================================================
  {
    publicId: 'demo-clara-navarro',
    uid: 'DEMO-QRO-001A',
    published: true,
    verified: true,
    name: 'Clara Navarro',
    shortName: 'Clara',
    role: 'Consultora en organización de equipos y desarrollo de colaboradores',
    company: 'Navarro Desarrollo Organizacional',
    logoUrl: createSvgLogo('NDO', '#0F766E', '#F8FAFC'),
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de Clara Navarro, consultora en organización de equipos',
    bannerTheme: 'from-slate-900 via-teal-950 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Av. Constituyentes 120, Col. El Carrizal, Santiago de Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Av+Constituyentes+120+Santiago+de+Queretaro',
    phone: '+524422194011',
    whatsappCustomMessage:
      'Hola Clara. Vi tu tarjeta y quiero conversar sobre cómo organizar mejor las responsabilidades y la forma de trabajar de mi equipo.',
    email: 'clara@navarroorganizacional.mx',
    calendarUrl: 'https://calendly.com/clara-navarro/conversacion-equipo',
    websiteUrl: 'https://navarroorganizacional.mx',
    pin: '4011',
    themeKey: 'ejecutivo',
    customPrimaryColor: '#0F766E',
    customAccentColor: '#0F172A',
    status: 'Proyectos por agenda',
    statusActive: true,
    professionalProfile: 'profesional_independiente',
    companyId: 'company-agora-consultores',
    companySlug: 'agora-consultores',
    companyDepartment: 'Desarrollo de Equipos',
    companyRoleStatement: 'Te apoya en la estructuración de roles, comunicación y acuerdos de trabajo en tu equipo directivo.',
    isCompanyActive: true,
    showInDirectory: true,
    brandOverrides: { overrideBrand: false },
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 14
    },
    customFields: {
      specialty: 'Organización del trabajo, incorporación de colaboradores y acuerdos de seguimiento.',
      clientType: 'Dueños y responsables de pequeñas empresas que buscan dar más claridad a la operación de su equipo.',
      serviceScope: 'Revisión de la situación, acuerdos de responsabilidades y un plan de aplicación definido según la necesidad del negocio.',
      photoDescription: 'Retrato profesional con expresión cercana, luz natural y fondo neutro. Vestimenta sobria; composición que transmita claridad y disposición para escuchar.'
    },
    valueProp:
      'Ayudo a pequeñas empresas a ordenar responsabilidades, incorporar colaboradores y sostener acuerdos de trabajo. Aterrizamos procesos sencillos para que el equipo sepa cómo actuar y la dirección pueda concentrarse en lo que requiere su atención.',
    primaryAction: {
      enabled: true,
      actionType: 'whatsapp',
      label: 'Conversar sobre mi equipo',
      sublabel: 'Revisemos responsabilidades y acuerdos de trabajo',
      customMessage:
        'Hola Clara. Vi tu tarjeta y quiero conversar sobre cómo organizar mejor las responsabilidades y la forma de trabajar de mi equipo.'
    },
    introVideo: {
      title: 'Organizar el trabajo para que el equipo pueda avanzar',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '1:10 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Cuando cada decisión termina en tu escritorio',
        desc: 'Revisión de la distribución del trabajo para eliminar puntos de dependencia y clarificar responsabilidades.',
        problem: 'Las tareas avanzan con dudas, varias personas atienden lo mismo o los asuntos se detienen esperando tu intervención.',
        intervention: 'Revisamos cómo se distribuye el trabajo, identificamos puntos de dependencia y acordamos responsabilidades y criterios de decisión.',
        scope: 'Mapa de responsabilidades, acuerdos operativos y una secuencia inicial de aplicación, según el alcance convenido.',
        solution: 'Que cada persona comprenda qué le corresponde y que la dirección pueda distinguir los asuntos que realmente necesitan su participación.',
        ctaText: 'Ordenar responsabilidades',
        ctaMessage:
          'Hola Clara. Me identifico con el tema de responsabilidades y decisiones que se concentran en la dirección. Quisiera revisar cómo aplicaría tu acompañamiento a mi equipo.',
        evidenceUrl: 'https://navarroorganizacional.mx/recursos/muestra-mapa-responsabilidades',
        evidenceLabel: 'Muestra de mapa de responsabilidades (ejemplo anonimizado)'
      },
      {
        type: 'caso',
        title: 'Caso documentado: Reducción de puntos de bloqueo en comercializadora de 18 colaboradores',
        desc: 'Intervención integral para descongestionar la toma de decisiones operativas concentradas en dirección general.',
        problem: 'El fundador atendía más de 30 consultas operativas diarias por falta de matriz de decisión delegada, retrasando despachos y compras.',
        intervention: 'Mapeo de 4 procesos críticos, asignación de responsables únicos por etapa y protocolo de escalamiento semanal.',
        scope: 'Matriz de decisiones operativas, manual de delegación y 4 sesiones de alineación con líderes de área.',
        solution: 'Las consultas a dirección se concentraron en asuntos estratégicos, reduciendo interrupciones diarias en 60% según bitácora de seguimiento.',
        ctaText: 'Consultar caso similar',
        ctaMessage:
          'Hola Clara. Vi el caso documentado de la comercializadora en Querétaro y me interesa revisar una intervención similar para mi equipo.',
        evidenceUrl: 'https://navarroorganizacional.mx/casos/comercializadora-queretaro-2025.pdf',
        evidenceLabel: 'Ficha técnica del caso y formato de matriz anonimizado'
      },
      {
        type: 'solucion',
        title: 'Una incorporación que dé claridad desde el comienzo',
        desc: 'Estructuración del proceso de inducción para que los nuevos colaboradores tengan autonomía desde su llegada.',
        problem: 'Llega una nueva persona y no hay una ruta clara para conocer su función, herramientas, contactos y expectativas.',
        intervention: 'Definimos qué necesita aprender, quién puede acompañarla y cómo revisar sus primeros avances.',
        scope: 'Ruta de incorporación y materiales de apoyo adaptados al rol, con responsables de acompañamiento.',
        solution: 'Facilitar una entrada más ordenada y reducir la dependencia de explicaciones improvisadas.',
        ctaText: 'Preparar una incorporación',
        ctaMessage:
          'Hola Clara. Quiero conocer tu servicio para organizar la incorporación de nuevos colaboradores y aclarar expectativas desde el inicio.',
        evidenceUrl: 'https://navarroorganizacional.mx/recursos/guia-onboarding-ejemplo',
        evidenceLabel: 'Muestra de ruta de incorporación y guía de rol'
      }
    ],
    processSteps: [
      {
        step: 1,
        title: 'Conversación inicial de encuadre',
        desc: 'Revisamos cómo está estructurado el equipo hoy, qué cuellos de botella existen y si mi acompañamiento hace sentido para tu momento.',
        expectation: 'Videollamada de 30 min • Sin compromiso'
      },
      {
        step: 2,
        title: 'Diagnóstico de responsabilidades y propuesta',
        desc: 'Levantamos la matriz actual con líderes de área y presentamos una propuesta de intervención acotada con entregables claros.',
        expectation: 'Sesión de trabajo y entrega de documento en 5 días hábiles'
      },
      {
        step: 3,
        title: 'Acompañamiento y transferencia operativa',
        desc: 'Facilitamos los acuerdos, probamos la nueva rutina con el equipo y dejamos instalado el sistema de seguimiento.',
        expectation: 'Ciclos de 4 a 6 semanas con revisiones quincenales'
      }
    ],
    networkingTargets: [
      {
        target: 'Despachos contables y consultores que acompañan pymes',
        purpose: 'Complementar sus proyectos cuando aparece una necesidad de organización de equipos.',
        contribution: 'Aportar herramientas de responsabilidades, incorporación y seguimiento dentro de un alcance coordinado.'
      },
      {
        target: 'Responsables de talento y desarrollo de colaboradores',
        purpose: 'Colaborar en proyectos que necesiten materiales y prácticas aplicables a la operación.',
        contribution: 'Convertir necesidades detectadas en rutas de trabajo y recursos que el equipo pueda utilizar.'
      },
      {
        target: 'Comunidades empresariales y organizadores de formación',
        purpose: 'Acercar herramientas de organización a personas que dirigen pequeños negocios.',
        contribution: 'Compartir ejemplos, ejercicios y conversaciones prácticas sobre coordinación de equipos.'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/demo-clara-navarro',
      instagram: 'https://instagram.com/claranavarro.org',
      facebook: 'https://facebook.com/navarrodesarrolloorganizacional',
      website: 'https://navarroorganizacional.mx'
    },
    links: [
      {
        label: 'Cómo trabajamos juntos',
        url: 'https://navarroorganizacional.mx/proceso',
        icon: 'route',
        category: 'Proceso'
      },
      {
        label: 'Ejemplo de una ruta de incorporación',
        url: 'https://navarroorganizacional.mx/muestra-incorporacion',
        icon: 'description',
        category: 'Entregable'
      },
      {
        label: 'Opiniones autorizadas de clientes',
        url: 'https://navarroorganizacional.mx/resenas',
        icon: 'rate_review',
        category: 'Reseñas'
      }
    ],
    testimonials: [
      {
        name: 'Irais Moncada',
        role: 'Alumna y Cliente Verificada',
        company: 'Recomendación en Facebook',
        comment:
          'El mejor curso de inglés que he tomado!! Incluso me mudé a Australia y mis cursos no son tan profesionales como los que da Kristoffer 👌 100% recomendado! Aprendes a un nivel profesional con sus clases dinámicas y sobre todo te fuerzas a hablar.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        stars: 5,
        sourceType: 'facebook',
        sourceUrl:
          'https://www.facebook.com/irais.moncada/posts/pfbid0364DQztrWD9c5y1XsaRFzhTpCquxCvfoMVjow1dKSkAVGQh5xM5GSykBasvs5G1Z6l',
        evidenceImageUrl: '/evidence/review-facebook-clara.png',
        evidenceLabel: 'Ver publicación en Facebook',
        date: '14 de diciembre de 2022'
      },
      {
        name: 'Luisa Fernanda Arias Cuéllar',
        role: 'Customer Experience Manager',
        company: 'Recomendación en LinkedIn • Customer Success & CRM',
        comment:
          'Tuve la oportunidad de trabajar con Alexander Vanegas durante la implementación de HubSpot, en su rol como partner implementador desde Dinterweb. Su capacidad para entender el negocio, traducirlo en soluciones concretas y alinear a los equipos fue determinante para el avance del proyecto.\n\nAlexander combina pensamiento estratégico con una ejecución impecable. Es una persona altamente responsable, estructurada y con un criterio claro para priorizar lo que realmente genera impacto. Más allá de cualquier herramienta o contexto específico, destaco su habilidad para construir trabajo cohesionado, anticiparse a los desafíos y mantener el foco en resultados.\n\nSin duda, es un aliado clave para cualquier organización que busque no solo implementar, sino realmente transformar la manera en que ejecuta su estrategia.',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        stars: 5,
        sourceType: 'linkedin',
        sourceUrl:
          'https://www.linkedin.com/in/alexander-evr/details/recommendations/?detailScreenTabIndex=2',
        evidenceImageUrl: '/evidence/review-linkedin-luisa.png',
        evidenceLabel: 'Ver recomendación en LinkedIn',
        date: '19 de marzo de 2026'
      }
    ],
    operatorContext: {
      titularGoal: 'Desarrollar una práctica de consultoría reconocida por convertir problemas de organización en acciones aplicables.',
      targetAudienceSituation: 'Una persona que dirige una empresa y descubre que muchas decisiones o problemas vuelven siempre a ella.',
      presentationDifficulty: 'Su experiencia se reduce a la etiqueta genérica de consultora y el prospecto no identifica en qué situaciones conviene llamarla.',
      whatToProtectOrBuild: 'Construir relaciones de trabajo duraderas y una cartera de proyectos alineada con su especialidad.',
      observableSuccessChange: 'Que las consultas lleguen con una necesidad reconocible y que los contactos relevantes avancen a una conversación de alcance.',
      photoProductionNotes: 'Retrato profesional con expresión cercana, luz natural y fondo neutro. Vestimenta sobria; composición que transmita claridad y disposición para escuchar.',
      internalNotes: 'Evidencia a conectar: Un ejemplo autorizado y anonimizado de mapa de responsabilidades cuando esté disponible.'
    },
    seoDescription:
      'Organización de responsabilidades, incorporación de colaboradores y seguimiento de acuerdos para pequeñas empresas. Conoce el enfoque de Clara Navarro en Querétaro.',
    seoKeywords: [
      'Clara Navarro',
      'Organización de Equipos',
      'Consultoría Pyme Querétaro',
      'Desarrollo Organizacional',
      'Acuerdos de Trabajo'
    ]
  },

  // =========================================================================
  // ARQUETIPO B: Comercial / asesor de ventas — Diego Salas
  // =========================================================================
  {
    publicId: 'demo-diego-salas',
    uid: 'DEMO-QRO-002B',
    published: true,
    verified: true,
    name: 'Diego Salas',
    shortName: 'Diego',
    role: 'Asesor inmobiliario para vivienda y espacios de negocio',
    company: 'Salas Espacios Inmobiliarios',
    logoUrl: createSvgLogo('SEI', '#065F46', '#F8FAFC'),
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de Diego Salas, asesor inmobiliario en Querétaro',
    bannerTheme: 'from-emerald-950 via-teal-900 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Blvd. Bernardo Quintana 4100, Álamos 3ra Secc, Santiago de Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Blvd+Bernardo+Quintana+4100+Santiago+de+Queretaro',
    phone: '+524423851920',
    whatsappCustomMessage:
      'Hola Diego. Vi tu tarjeta y quiero conversar sobre un espacio para vivienda o negocio. Me gustaría definir los criterios para orientar mi búsqueda.',
    email: 'diego@salasespacios.mx',
    calendarUrl: 'https://calendly.com/diego-salas/orientacion-inmobiliaria',
    websiteUrl: 'https://salasespacios.mx',
    pin: '1920',
    themeKey: 'negocio',
    customPrimaryColor: '#065F46',
    customAccentColor: '#D6A03A',
    status: 'Visitas con cita previa',
    statusActive: true,
    professionalProfile: 'comercial_asesor',
    companyId: 'company-nexo-operativo',
    companySlug: 'nexo-operativo',
    companyDepartment: 'Comercial & Alianzas',
    companyRoleStatement: 'Te orienta en la ubicación, naves industriales y espacios operativos para tu empresa.',
    isCompanyActive: true,
    showInDirectory: true,
    brandOverrides: { overrideBrand: true, customPrimaryColor: '#065F46' },
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 22
    },
    customFields: {
      sector: 'Servicios inmobiliarios para vivienda y espacios comerciales.',
      territory: 'Querétaro y zona metropolitana, sujeto a ubicación e inventario confirmado.',
      solutionLines: 'Búsqueda de vivienda, búsqueda de espacios para negocio y orientación inicial a propietarios interesados en comercializar un inmueble.',
      photoDescription: 'Retrato cercano en un espacio neutro con luz natural. Vestimenta profesional sin elementos de lujo que distraigan de la atención personal.'
    },
    valueProp:
      'Te acompaño a definir qué necesitas de una vivienda o espacio de negocio y a revisar opciones acordes con tu situación. Trabajamos con criterios claros para que puedas comparar, preguntar y decidir con mejor información.',
    primaryAction: {
      enabled: true,
      actionType: 'whatsapp',
      label: 'Orientar mi búsqueda',
      sublabel: 'Definamos criterios de ubicación, uso y presupuesto',
      customMessage:
        'Hola Diego. Vi tu tarjeta y quiero conversar sobre un espacio para vivienda o negocio. Me gustaría definir los criterios para orientar mi búsqueda.'
    },
    introVideo: {
      title: 'Primero tus criterios; después las opciones',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '1:05 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Una vivienda que encaje con tu siguiente etapa',
        desc: 'Orientación de búsqueda con criterios de ubicación y uso antes de programar visitas.',
        problem: 'Ves muchas opciones, pero no tienes claro cuáles responden a tus necesidades de ubicación, uso y condiciones.',
        intervention: 'Aterrizamos tus criterios de búsqueda y revisamos alternativas disponibles antes de organizar visitas.',
        scope: 'Criterios de selección, información de opciones confirmadas y coordinación de los siguientes pasos que se acuerden.',
        solution: 'Concentrar tu atención en opciones pertinentes y reconocer qué preguntas necesitas resolver antes de decidir.',
        ctaText: 'Revisar mi búsqueda de vivienda',
        ctaMessage:
          'Hola Diego. Quiero orientar mi búsqueda de vivienda. Me interesa conversar sobre ubicación, necesidades de uso y condiciones para revisar opciones pertinentes.',
        evidenceUrl: 'https://salasespacios.mx/catalogo-vivienda',
        evidenceLabel: 'Fichas de inmuebles verificados en Querétaro'
      },
      {
        type: 'caso',
        title: 'Caso documentado: Reubicación de oficina corporativa y showroom en El Campanario',
        desc: 'Búsqueda especializada para firma de tecnología que requería 320 m² con factibilidad técnica inmediata.',
        problem: 'Empresa de tecnología requería 320 m² con factibilidad de fibra óptica simétrica, 12 cajones y entrega en menos de 45 días.',
        intervention: 'Filtro técnico previo de 14 inmuebles, dictamen de uso de suelo y negociación de periodo de gracia para adecuaciones.',
        scope: 'Expediente comparativo de 3 alternativas viables, dictamen legal de contrato de arrendamiento y entrega física.',
        solution: 'Instalación completada en 38 días con contrato a 3 años y 45 días de gracia para adecuaciones de cableado e interiores.',
        ctaText: 'Consultar caso similar',
        ctaMessage:
          'Hola Diego. Vi el caso de reubicación corporativa en El Campanario y requiero asesoría para un espacio de oficina con requerimientos específicos.',
        evidenceUrl: 'https://salasespacios.mx/casos/reubicacion-tecnologia-queretaro.pdf',
        evidenceLabel: 'Ficha descriptiva del caso inmobiliario con testimonio de cliente'
      },
      {
        type: 'solucion',
        title: 'Preparar la presentación de tu propiedad',
        desc: 'Asesoría para propietarios para organizar documentación y proyectar un inmueble con claridad.',
        problem: 'Quieres ofrecer un inmueble, pero no sabes qué información reunir o cómo explicar sus características a los interesados.',
        intervention: 'Revisamos la información disponible y definimos una presentación clara y los pasos de comercialización que pueden acordarse.',
        scope: 'Lista de información necesaria, presentación del inmueble y propuesta de acompañamiento para tu revisión.',
        solution: 'Comenzar con expectativas claras y responder a interesados con información consistente.',
        ctaText: 'Conversar sobre mi propiedad',
        ctaMessage:
          'Hola Diego. Soy propietario y quiero conocer qué información y pasos necesitamos para presentar mi inmueble a posibles interesados.',
        evidenceUrl: 'https://salasespacios.mx/guia-propietarios',
        evidenceLabel: 'Checklist de documentación y presentación inmobiliaria'
      }
    ],
    processSteps: [
      {
        step: 1,
        title: 'Filtro de criterios y viabilidad',
        desc: 'Definimos zona, presupuesto, uso de suelo o espacio necesario antes de salir a ver opciones sin rumbo.',
        expectation: 'Conversación telefónica o café de 20 min'
      },
      {
        step: 2,
        title: 'Selección acotada y visitas técnicas',
        desc: 'Presentamos una terna de opciones verificadas legal y documentalmente, coordinando recorrido en un solo bloque.',
        expectation: 'Recorrido de 2 a 3 inmuebles seleccionados'
      },
      {
        step: 3,
        title: 'Cierre, dictamen legal y entrega',
        desc: 'Revisamos contrato con área jurídica, condiciones de entrega y acompañamos firma de escrituras o arrendamiento.',
        expectation: 'Acompañamiento integral hasta la entrega de llaves'
      }
    ],
    networkingTargets: [
      {
        target: 'Responsables de recursos humanos y reubicación',
        purpose: 'Orientar búsquedas de vivienda relacionadas con cambios de residencia.',
        contribution: 'Recoger criterios de búsqueda y coordinar información y visitas según las opciones disponibles.'
      },
      {
        target: 'Arquitectos y especialistas en espacios comerciales',
        purpose: 'Relacionar la búsqueda del inmueble con las necesidades del negocio.',
        contribution: 'Facilitar información y coordinación para que los especialistas revisen lo que les corresponde.'
      },
      {
        target: 'Personas que desean recomendar a alguien',
        purpose: 'Dar continuidad a una referencia con la necesidad y los criterios del interesado.',
        contribution: 'Una conversación de orientación clara, con permiso de la persona referida para compartir sus datos.'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/demo-diego-salas',
      instagram: 'https://instagram.com/diegosalas.inmobiliario',
      facebook: 'https://facebook.com/salasespacios',
      website: 'https://salasespacios.mx'
    },
    links: [
      {
        label: 'Opciones disponibles para revisar',
        url: 'https://salasespacios.mx/inventario',
        icon: 'domain',
        category: 'Inventario'
      },
      {
        label: 'Prepara tu conversación de búsqueda',
        url: 'https://salasespacios.mx/guia-busqueda',
        icon: 'checklist',
        category: 'Herramienta'
      },
      {
        label: 'Opiniones autorizadas',
        url: 'https://salasespacios.mx/resenas',
        icon: 'star_outline',
        category: 'Reseñas'
      }
    ],
    testimonials: [
      ...SHARED_VERIFIED_TESTIMONIALS,
      {
        name: 'Pablo (Personaje Ficticio)',
        role: 'Interesado en un espacio de negocio',
        company: 'Empresa Ficticia de Demostración',
        comment:
          'RESEÑA FICTICIA — DEMOSTRACIÓN: Antes de revisar opciones, Diego nos ayudó a ordenar los criterios que necesitábamos. La comunicación fue clara y pudimos plantear preguntas más concretas durante las visitas.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        stars: undefined
      }
    ],
    operatorContext: {
      titularGoal: 'Construir una cartera de relaciones que lo recomienden por escuchar y orientar una búsqueda con claridad.',
      targetAudienceSituation: 'Una persona que necesita mudarse, encontrar un espacio para su negocio o explorar cómo comercializar una propiedad.',
      presentationDifficulty: 'Recibe solicitudes genéricas y dedica tiempo a mostrar opciones que no coinciden con las necesidades del interesado.',
      whatToProtectOrBuild: 'Desarrollar relaciones duraderas y una forma de trabajar más ordenada y previsible.',
      observableSuccessChange: 'Que los interesados compartan sus criterios y avancen a una conversación o visita pertinente.',
      photoProductionNotes: 'Retrato cercano en un espacio neutro con luz natural. Vestimenta profesional sin elementos de lujo que distraigan de la atención personal.'
    },
    seoDescription:
      'Define tus criterios y revisa opciones de vivienda o espacios para negocio. Conoce el enfoque de acompañamiento inmobiliario de Diego Salas en Querétaro.',
    seoKeywords: [
      'Diego Salas',
      'Asesor Inmobiliario Querétaro',
      'Vivienda Querétaro',
      'Locales Comerciales',
      'Espacios de Negocio'
    ]
  },

  // =========================================================================
  // ARQUETIPO C: Emprendedor / solopreneur — Renata Vidal
  // =========================================================================
  {
    publicId: 'demo-renata-vidal',
    uid: 'DEMO-QRO-003C',
    published: true,
    verified: true,
    name: 'Renata Vidal',
    shortName: 'Renata',
    role: 'Coordinadora de alimentos para reuniones y encuentros de equipo',
    company: 'Mesa Clara',
    logoUrl: createSvgLogo('MC', '#B45A44', '#FFF7ED'),
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de Renata Vidal, fundadora de Mesa Clara',
    bannerTheme: 'from-amber-950 via-stone-900 to-amber-900',
    bannerImageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&auto=format&fit=crop&q=80',
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Cto. Jardín Poniente 85, Col. Álamos, Santiago de Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Alamos+Santiago+de+Queretaro',
    phone: '+524424902188',
    whatsappCustomMessage:
      'Hola Renata. Estoy organizando una reunión y quiero revisar opciones de alimentos. Te puedo compartir fecha, ubicación y número aproximado de asistentes.',
    email: 'renata@mesaclara.mx',
    calendarUrl: 'https://calendly.com/renata-vidal/coordinacion-mesa',
    websiteUrl: 'https://mesaclara.mx',
    pin: '2188',
    themeKey: 'personal',
    customPrimaryColor: '#B45A44',
    customAccentColor: '#FFF7ED',
    status: 'Fechas por confirmar',
    statusActive: true,
    professionalProfile: 'emprendedor_solopreneur',
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 9
    },
    customFields: {
      category: 'Alimentos y coordinación de servicio para reuniones, talleres y encuentros de equipo.',
      modality: 'Servicio',
      serviceZone: 'Querétaro y ubicaciones que se confirmen al revisar cada solicitud.',
      photoDescription: 'Retrato cálido con luz natural, en un espacio de trabajo limpio y sencillo. Vestimenta profesional apropiada a la actividad.'
    },
    valueProp:
      'Ayudo a quienes organizan reuniones y capacitaciones a resolver los alimentos con una propuesta clara de opciones, cantidades y servicio. Revisamos los detalles con anticipación para que puedas concentrarte en las personas y en el propósito del encuentro.',
    primaryAction: {
      enabled: true,
      actionType: 'whatsapp',
      label: 'Planear mi reunión',
      sublabel: 'Compárteme fecha, lugar y número de asistentes',
      customMessage:
        'Hola Renata. Estoy organizando una reunión y quiero revisar opciones de alimentos. Te puedo compartir fecha, ubicación y número aproximado de asistentes.'
    },
    introVideo: {
      title: 'Una propuesta clara para recibir a tu equipo',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '0:55 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Una pausa de café que encaje con tu sesión',
        desc: 'Montaje cuidado de café, infusiones y bocadillos frescos que apoyen el ritmo de trabajo.',
        problem: 'Estás preparando un taller o reunión y necesitas resolver la pausa sin distraerte de la actividad principal.',
        intervention: 'Revisamos horario, ubicación, cantidad de personas y necesidades del encuentro para proponerte opciones de servicio.',
        scope: 'Propuesta de alimentos y bebidas con cantidades, elementos incluidos y condiciones claramente descritos.',
        solution: 'Tener una parte de la organización definida y saber qué corresponde preparar a cada parte.',
        ctaText: 'Cotizar una pausa de café',
        ctaMessage:
          'Hola Renata. Quiero revisar una pausa de café para una reunión. Te compartiré fecha, lugar, horario y número aproximado de asistentes.',
        evidenceUrl: 'https://mesaclara.mx/menu-pausas',
        evidenceLabel: 'Menú vigente de pausas de café y bocadillos'
      },
      {
        type: 'caso',
        title: 'Caso documentado: Servicio de coffee break continuo para congreso médico de 90 especialistas',
        desc: 'Atención ágil en 3 recesos cronometrados de 15 minutos en hotel sede sin demoras en el auditorio.',
        problem: 'El comité organizador requería atención fluida en 3 recesos de 15 minutos sin generar filas ni retrasar el cronograma médico.',
        intervention: 'Doble estación de servicio simultánea con termos térmicos de alta capacidad, bocadillos individuales etiquetados y menú sin gluten.',
        scope: 'Montaje completo, loza biodegradable, 2 personas de atención continua in situ y reposición durante 6 horas.',
        solution: 'Cero retrasos en reinicio de conferencias y servicio 100% oportuno para los 90 participantes sin mermas.',
        ctaText: 'Consultar caso similar',
        ctaMessage:
          'Hola Renata. Vi el caso documentado del congreso médico y quiero cotizar un servicio con atención ágil para un evento corporativo.',
        evidenceUrl: 'https://mesaclara.mx/casos/congreso-medico-2025.pdf',
        evidenceLabel: 'Memoria gráfica del montaje y carta de recomendación del comité'
      },
      {
        type: 'solucion',
        title: 'Alimentos para una jornada de trabajo',
        desc: 'Menús equilibrados y oportunos pensados para sesiones de varias horas sin interrupciones.',
        problem: 'Tu equipo tendrá una sesión de varias horas y necesitas organizar la alimentación de acuerdo con el programa.',
        intervention: 'Relacionamos las opciones de alimentos con la duración, los espacios y las condiciones del encuentro.',
        scope: 'Propuesta de servicio para revisión, con horarios, cantidades y responsabilidades definidas antes de confirmar.',
        solution: 'Facilitar una jornada organizada y anticipar detalles que podrían interrumpir la sesión.',
        ctaText: 'Planear una jornada de equipo',
        ctaMessage:
          'Hola Renata. Estoy coordinando una jornada de trabajo y quiero revisar cómo organizar los alimentos de acuerdo con el programa y el número de personas.',
        evidenceUrl: 'https://mesaclara.mx/propuesta-jornadas',
        evidenceLabel: 'Muestra de propuesta para jornadas intensivas'
      }
    ],
    processSteps: [
      {
        step: 1,
        title: 'Definición de fecha, sede y número de asistentes',
        desc: 'Nos compartes la dinámica de tu evento, horario de pausas y cualquier requerimiento alimenticio o intolerancia.',
        expectation: 'Respuesta con propuesta inicial en menos de 24 horas'
      },
      {
        step: 2,
        title: 'Menú seleccionado y logística confirmada',
        desc: 'Elegimos la combinación de bocadillos, café de especialidad y bebidas; confirmamos accesos y montaje en sede.',
        expectation: 'Ficha logística detallada con horarios de llegada y montaje'
      },
      {
        step: 3,
        title: 'Montaje puntual y servicio impecable',
        desc: 'Llegamos 45 min antes del inicio, dejamos la estación lista y limpia para que te enfoques en tus invitados.',
        expectation: 'Montaje listo 15 minutos antes de la llegada del primer asistente'
      }
    ],
    networkingTargets: [
      {
        target: 'Facilitadores, capacitadores y organizadores de talleres',
        purpose: 'Coordinar la alimentación como parte de una experiencia de aprendizaje bien preparada.',
        contribution: 'Propuestas que se relacionen con el programa, espacio y cantidad de asistentes.'
      },
      {
        target: 'Espacios de reunión y comunidades empresariales',
        purpose: 'Explorar servicios para encuentros realizados en sus instalaciones.',
        contribution: 'Claridad de opciones, alcance y coordinación previa del servicio.'
      },
      {
        target: 'Responsables de administración y organización interna',
        purpose: 'Facilitar la preparación de reuniones recurrentes de sus equipos.',
        contribution: 'Un canal directo para revisar necesidades y documentar los detalles de cada solicitud.'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/demo-renata-vidal',
      instagram: 'https://instagram.com/mesaclaraqro',
      facebook: 'https://facebook.com/mesaclaraqro',
      website: 'https://mesaclara.mx'
    },
    links: [
      {
        label: 'Ver opciones de menú',
        url: 'https://mesaclara.mx/menu',
        icon: 'restaurant_menu',
        category: 'Menú'
      },
      {
        label: 'Qué compartir para preparar una propuesta',
        url: 'https://mesaclara.mx/guia',
        icon: 'assignment',
        category: 'Guía'
      },
      {
        label: 'Conocer presentaciones reales',
        url: 'https://mesaclara.mx/galeria',
        icon: 'photo_camera',
        category: 'Galería'
      }
    ],
    testimonials: [
      ...SHARED_VERIFIED_TESTIMONIALS,
      {
        name: 'Laura (Personaje Ficticio)',
        role: 'Organizadora de capacitación',
        company: 'Empresa Ficticia de Demostración',
        comment:
          'RESEÑA FICTICIA — DEMOSTRACIÓN: La propuesta nos permitió entender qué estaba incluido y qué debíamos preparar nosotros. Tener los detalles claros ayudó a coordinar la pausa dentro del programa de la sesión.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        stars: undefined
      }
    ],
    operatorContext: {
      titularGoal: 'Recibir solicitudes con información suficiente para preparar una propuesta pertinente.',
      targetAudienceSituation: 'Una persona que organiza una reunión o capacitación y necesita coordinar los alimentos sin dispersarse en detalles.',
      presentationDifficulty: 'Recibe mensajes incompletos que obligan a reconstruir fecha, ubicación, cantidad y tipo de encuentro.',
      whatToProtectOrBuild: 'Desarrollar un negocio sostenible que sea reconocido por la claridad y el cuidado de su coordinación.',
      observableSuccessChange: 'Que las consultas indiquen los datos básicos y avancen a una propuesta cuyo alcance sea comprendido.',
      photoProductionNotes: 'Retrato cálido con luz natural, en un espacio de trabajo limpio y sencillo. Vestimenta profesional apropiada a la actividad.'
    },
    seoDescription:
      'Opciones de alimentos para reuniones, talleres y encuentros de equipo. Comparte los detalles de tu evento y revisa una propuesta con Mesa Clara en Querétaro.',
    seoKeywords: [
      'Mesa Clara',
      'Renata Vidal',
      'Alimentos para Reuniones',
      'Coffee Break Querétaro',
      'Catering Corporativo'
    ]
  },

  // =========================================================================
  // ARQUETIPO D: Empresario / dueño de negocio — Jorge Herrera
  // =========================================================================
  {
    publicId: 'demo-jorge-herrera',
    uid: 'DEMO-QRO-004D',
    published: true,
    verified: true,
    name: 'Jorge Herrera',
    shortName: 'Jorge',
    role: 'Director de servicios técnicos y coordinación de proyectos industriales',
    company: 'Nexo Operativo',
    logoUrl: createSvgLogo('NXO', '#047857', '#F8FAFC'),
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de Jorge Herrera, director de Nexo Operativo',
    bannerTheme: 'from-slate-950 via-emerald-950 to-slate-900',
    bannerImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80',
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Parque Industrial Benito Juárez, Acceso III No. 14, Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Parque+Industrial+Benito+Juarez+Queretaro',
    phone: '+524425623091',
    whatsappCustomMessage:
      'Hola Jorge. Vi el perfil de Nexo Operativo y quiero revisar una necesidad técnica de nuestra operación. Me interesa definir el alcance y la información necesaria para una propuesta.',
    email: 'jorge@nexooperativo.mx',
    calendarUrl: 'https://calendly.com/jorge-herrera/levantamiento-tecnico',
    websiteUrl: 'https://nexooperativo.mx',
    pin: '3091',
    themeKey: 'negocio',
    customPrimaryColor: '#047857',
    customAccentColor: '#0B1220',
    status: 'Proyectos por agenda',
    statusActive: true,
    professionalProfile: 'empresario_dueno',
    companyId: 'company-nexo-operativo',
    companySlug: 'nexo-operativo',
    companyDepartment: 'Dirección General',
    companyRoleStatement: 'Te orienta en la viabilidad técnica, tiempos y acuerdos operativos de tu proyecto industrial.',
    isCompanyActive: true,
    showInDirectory: true,
    brandOverrides: { overrideBrand: false },
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: false,
      aiMinutesQuota: 0,
      aiMinutesUsed: 0
    },
    customFields: {
      sectorsServed: 'Empresas de manufactura y negocios con necesidades de mantenimiento y coordinación técnica.',
      coreCapabilities: 'Coordinación de levantamientos, alcances de servicio y seguimiento documentado de intervenciones acordadas. La capacidad específica se confirma por proyecto.',
      coverage: 'Querétaro y proyectos del Bajío cuya ubicación, alcance y disponibilidad se confirmen previamente.',
      photoDescription: 'Retrato profesional en un entorno técnico ordenado, sin simular instalaciones, personal o equipo que la empresa no posea.'
    },
    valueProp:
      'Ayudamos a empresas a preparar y coordinar servicios técnicos que contribuyan a sostener su operación. Partimos de un alcance claro y de compromisos de seguimiento para que mantenimiento, operación y compras puedan decidir y coordinarse con mejor información.',
    primaryAction: {
      enabled: true,
      actionType: 'whatsapp',
      label: 'Revisar mi requerimiento',
      sublabel: 'Delimitemos el alcance técnico y las necesidades del servicio',
      customMessage:
        'Hola Jorge. Vi el perfil de Nexo Operativo y quiero revisar una necesidad técnica de nuestra operación. Me interesa definir el alcance y la información necesaria para una propuesta.'
    },
    introVideo: {
      title: 'Un servicio empieza con un alcance comprensible',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '1:10 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Definir el alcance antes de intervenir',
        desc: 'Levantamiento técnico para diagnosticar requerimientos de planta sin asumir alcances apresurados.',
        problem: 'Existe una necesidad técnica, pero la información inicial no permite delimitar qué debe revisarse o atenderse.',
        intervention: 'Recopilamos el contexto con el responsable de la operación y coordinamos el levantamiento que resulte pertinente.',
        scope: 'Descripción de la necesidad, información disponible y propuesta de alcance para su revisión. La intervención se contrata por separado cuando corresponda.',
        solution: 'Tomar decisiones de contratación con una comprensión más clara del trabajo y sus condiciones.',
        ctaText: 'Definir un alcance',
        ctaMessage:
          'Hola Jorge. Necesitamos delimitar un servicio técnico. Quisiera revisar contigo el contexto, la información disponible y los pasos para preparar un alcance.',
        evidenceUrl: 'https://nexooperativo.mx/alcance-muestra',
        evidenceLabel: 'Ejemplo de delimitación de alcance técnico'
      },
      {
        type: 'caso',
        title: 'Caso documentado: Mantenimiento preventivo mayor a sistema de aire comprimido en planta Tier 2',
        desc: 'Auditoría integral por ultrasonido y reemplazo preventivo en línea crítica de ensamble automotriz.',
        problem: 'Pérdidas de presión no diagnosticadas generaban paros intermitentes de línea de ensamble durante el segundo turno de producción.',
        intervention: 'Auditoría por ultrasonido en 850 metros lineales de tubería, reemplazo de 12 acoples fatigados y reconfiguración de presiones de descarga.',
        scope: 'Levantamiento termográfico, dictamen de fugas, refaccionamiento certificado y pruebas de presión con reporte avalado por ingeniería.',
        solution: 'Recuperación de 1.8 bar de presión constante en cabezal principal y eliminación de paros por caída de presión durante 9 meses consecutivos.',
        ctaText: 'Consultar caso similar',
        ctaMessage:
          'Hola Jorge. Vi el caso documentado de planta automotriz en el Bajío y requiero una auditoría técnica en nuestras instalaciones.',
        evidenceUrl: 'https://nexooperativo.mx/casos/planta-automotriz-bajio-2025.pdf',
        evidenceLabel: 'Dictamen técnico de auditoría y acta de recepción de planta'
      },
      {
        type: 'solucion',
        title: 'Preparar un requerimiento de refacciones o componentes',
        desc: 'Estructuración técnica de especificaciones de suministro para compras y mantenimiento.',
        problem: 'Hay un requerimiento de suministro, pero faltan referencias, cantidades o condiciones para comparar opciones.',
        intervention: 'Revisamos la información del requerimiento y coordinamos la confirmación de las especificaciones y condiciones con las partes responsables.',
        scope: 'Requerimiento documentado y propuesta comercial cuando sea posible confirmarla; existencias, compatibilidad y plazos se verifican expresamente.',
        solution: 'Reducir ambigüedades en la solicitud y facilitar una comparación de opciones con información consistente.',
        ctaText: 'Revisar un requerimiento',
        ctaMessage:
          'Hola Jorge. Quiero revisar un requerimiento de refacciones o componentes y confirmar qué información necesitamos para una propuesta.',
        evidenceUrl: 'https://nexooperativo.mx/formato-requerimiento',
        evidenceLabel: 'Formato de requerimiento y fichas técnicas de componentes'
      }
    ],
    processSteps: [
      {
        step: 1,
        title: 'Levantamiento técnico en sitio',
        desc: 'Acudimos a tu instalación para inspeccionar equipos, tomar lecturas y recopilar requerimientos operativos directamente con tus ingenieros.',
        expectation: 'Visita técnica de 1 a 2 horas previa coordinación de acceso'
      },
      {
        step: 2,
        title: 'Dictamen y propuesta con alcance acotado',
        desc: 'Entregamos el diagnóstico documentado con matriz de piezas, tiempos de ejecución y presupuesto cerrado sin cargos ocultos.',
        expectation: 'Entrega de propuesta formal en 48 a 72 horas'
      },
      {
        step: 3,
        title: 'Ejecución y entrega con acta técnica',
        desc: 'Intervenimos en ventana programada con personal acreditado en seguridad industrial, entregando bitácora y garantía de servicio.',
        expectation: 'Firma de acta de conformidad y entrega de reporte fotográfico'
      }
    ],
    networkingTargets: [
      {
        target: 'Responsables de mantenimiento, operación y compras',
        purpose: 'Establecer conversaciones sobre necesidades reales de servicio y suministro.',
        contribution: 'Ordenar requerimientos y explicar el alcance que Nexo Operativo puede asumir.'
      },
      {
        target: 'Especialistas y proveedores técnicos complementarios',
        purpose: 'Explorar colaboración en proyectos que requieran capacidades de distintas empresas.',
        contribution: 'Coordinación de información, responsabilidades y seguimiento dentro de acuerdos definidos.'
      },
      {
        target: 'Comunidades industriales y organizaciones empresariales',
        purpose: 'Conocer necesidades del ecosistema y construir relaciones de colaboración.',
        contribution: 'Compartir capacidades de forma concreta y participar en conversaciones de solución con alcance verificable.'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/demo-jorge-herrera',
      instagram: 'https://instagram.com/nexooperativo',
      facebook: 'https://facebook.com/nexooperativomx',
      website: 'https://nexooperativo.mx'
    },
    links: [
      {
        label: 'Conocer nuestras capacidades',
        url: 'https://nexooperativo.mx/capacidades',
        icon: 'precision_manufacturing',
        category: 'Capacidades'
      },
      {
        label: 'Preparar un requerimiento técnico',
        url: 'https://nexooperativo.mx/requerimiento',
        icon: 'assignment',
        category: 'Herramienta'
      },
      {
        label: 'Ejemplo de un alcance de servicio',
        url: 'https://nexooperativo.mx/alcance-muestra',
        icon: 'fact_check',
        category: 'Muestra'
      }
    ],
    testimonials: [
      ...SHARED_VERIFIED_TESTIMONIALS,
      {
        name: 'Miguel (Personaje Ficticio)',
        role: 'Responsable de mantenimiento',
        company: 'Empresa Ficticia de Demostración',
        comment:
          'RESEÑA FICTICIA — DEMOSTRACIÓN: La conversación inicial nos ayudó a ordenar la información y a entender qué estaba incluido en la propuesta. Fue útil contar con responsables y puntos de revisión definidos.',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        stars: undefined
      }
    ],
    operatorContext: {
      titularGoal: 'Facilitar conversaciones comerciales centradas en capacidades y alcance, en lugar de solicitudes ambiguas de precio o disponibilidad.',
      targetAudienceSituation: 'Responsables de mantenimiento, operación y compras que necesitan entender si la empresa puede atender una necesidad específica.',
      presentationDifficulty: 'La información comercial y técnica depende de explicaciones repetidas del propietario y de referencias informales.',
      whatToProtectOrBuild: 'Construir una empresa con relaciones duraderas, mejor coordinación y una presentación que también pueda utilizar su equipo.',
      observableSuccessChange: 'Recibir requerimientos mejor descritos y avanzar a levantamientos o propuestas con un alcance entendido.',
      photoProductionNotes: 'Retrato profesional en un entorno técnico ordenado, sin simular instalaciones, personal o equipo que la empresa no posea.'
    },
    seoDescription:
      'Revisa necesidades de servicio técnico, requerimientos de componentes y coordinación de proyectos. Conoce las capacidades propuestas por Nexo Operativo en Querétaro.',
    seoKeywords: [
      'Nexo Operativo',
      'Jorge Herrera',
      'Servicios Técnicos Industriales',
      'Mantenimiento Industrial Bajío',
      'Proyectos Industriales'
    ]
  },

  // =========================================================================
  // ARQUETIPO E: Ejecutivo / directivo corporativo — Adriana Torres
  // =========================================================================
  {
    publicId: 'demo-adriana-torres',
    uid: 'DEMO-QRO-005E',
    published: true,
    verified: true,
    name: 'Adriana Torres',
    shortName: 'Adriana',
    role: 'Directora de Operaciones y Desarrollo de Capacidades',
    company: 'Horizonte Manufactura',
    logoUrl: createSvgLogo('HM', '#A67C52', '#1E293B'),
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto ejecutiva de Adriana Torres, Directora de Operaciones',
    bannerTheme: 'from-slate-900 via-slate-800 to-amber-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Av. 5 de Febrero 1351, Complejo Industrial, Santiago de Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Av+5+de+Febrero+Queretaro',
    phone: '+524426719234',
    whatsappCustomMessage:
      'Hola Adriana. Vi tu perfil y quisiera proponerte una conversación de colaboración relacionada con operaciones, desarrollo de capacidades o vinculación empresarial.',
    email: 'atorres@horizontemanufactura.mx',
    calendarUrl: 'https://calendly.com/adriana-torres-hm/vinculacion-estrategica',
    websiteUrl: 'https://horizontemanufactura.mx',
    pin: '9234',
    themeKey: 'ejecutivo',
    customPrimaryColor: '#1E293B',
    customAccentColor: '#A67C52',
    status: 'Abierta a colaboración',
    statusActive: true,
    professionalProfile: 'ejecutivo_directivo',
    companyId: 'company-agora-consultores',
    companySlug: 'agora-consultores',
    companyDepartment: 'Consultoría Estratégica',
    companyRoleStatement: 'Acompaña la alineación de metas operativas y liderazgo para comités de dirección.',
    isCompanyActive: true,
    showInDirectory: true,
    brandOverrides: { overrideBrand: false },
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 25
    },
    customFields: {
      department: 'Operaciones y desarrollo de capacidades organizacionales.',
      leadershipScope: 'Coordinación entre responsables de operación, áreas de apoyo y proyectos de mejora dentro del alcance de su organización.',
      liaisonTopics: 'Colaboración con proveedores, aprendizaje entre organizaciones y conexión entre formación y necesidades operativas.',
      photoDescription: 'Retrato ejecutivo cercano, con luz natural y fondo sobrio. Evitar instalaciones o distintivos de empresas reales ajenas a esta demostración.'
    },
    valueProp:
      'Desde mi función en operaciones, busco conectar personas y organizaciones que puedan aportar a proyectos de mejora y desarrollo de capacidades. Me interesa que cada conversación tenga un propósito claro y una propuesta de colaboración relacionada con necesidades reales.',
    primaryAction: {
      enabled: true,
      actionType: 'whatsapp',
      label: 'Proponer una colaboración',
      sublabel: 'Exploremos propósito, aportación y siguientes pasos',
      customMessage:
        'Hola Adriana. Vi tu perfil y quisiera proponerte una conversación de colaboración relacionada con operaciones, desarrollo de capacidades o vinculación empresarial.'
    },
    introVideo: {
      title: 'Conversaciones que conectan capacidades',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '1:00 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Colaboración con proveedores y especialistas',
        desc: 'Revisión y canalización de capacidades técnicas orientadas a la optimización operativa de la empresa.',
        problem: 'Tienes una capacidad o propuesta relacionada con operación, pero necesitas identificar si existe un espacio pertinente para conversar.',
        intervention: 'Reviso el propósito de la propuesta y, cuando corresponde a mi función, exploro una conversación o el canal interno adecuado.',
        scope: 'Una revisión inicial de pertinencia y orientación del siguiente paso; cualquier contratación o acuerdo sigue el proceso de la organización.',
        solution: 'Evitar conversaciones descontextualizadas y facilitar una interlocución con un propósito definido.',
        ctaText: 'Presentar una capacidad',
        ctaMessage:
          'Hola Adriana. Quiero presentarte una capacidad de nuestra organización relacionada con operaciones. Me gustaría compartir su aplicación y explorar si tiene sentido una conversación.',
        evidenceUrl: 'https://horizontemanufactura.mx/proveedores',
        evidenceLabel: 'Criterios corporativos de vinculación con proveedores'
      },
      {
        type: 'caso',
        title: 'Caso documentado: Rediseño del modelo de homologación técnica con proveedores estratégicos',
        desc: 'Alineación de 12 capacidades críticas y reducción de tiempos de integración operativa.',
        problem: 'El área de compras y operaciones evaluaba a proveedores con criterios dispersos, generando demoras de hasta 4 meses en integración.',
        intervention: 'Instalación de comité de homologación técnica, matriz unificada de capacidades operativas y mesa trimestral de innovación abierta.',
        scope: 'Marco de gobernanza interna, matriz de 12 capacidades críticas y piloto con 6 proveedores clave del clúster automotriz.',
        solution: 'Tiempo de homologación reducido de 16 a 5 semanas con 3 proyectos conjuntos de ahorro energético implementados en líneas.',
        ctaText: 'Consultar caso similar',
        ctaMessage:
          'Hola Adriana. Me interesa conocer más sobre el modelo de homologación técnica de proveedores y explorar sinergias institucionales.',
        evidenceUrl: 'https://horizontemanufactura.mx/casos/modelo-vinculacion-proveedores.pdf',
        evidenceLabel: 'Publicación institucional y memoria del comité de vinculación'
      },
      {
        type: 'solucion',
        title: 'Vincular formación y necesidades de operación',
        desc: 'Conexión entre programas académicos y las habilidades técnicas críticas en líneas de producción.',
        problem: 'Una institución o especialista quiere acercar una propuesta de formación a necesidades del trabajo.',
        intervention: 'Converso sobre el problema que se busca atender, las capacidades involucradas y las condiciones para evaluar una colaboración.',
        scope: 'Una conversación de alcance y pertinencia; los programas y compromisos se definen mediante los canales correspondientes.',
        solution: 'Alinear mejor el diálogo entre quienes forman personas y quienes conocen los retos de la operación.',
        ctaText: 'Conversar sobre formación',
        ctaMessage:
          'Hola Adriana. Quiero explorar una colaboración entre formación y necesidades de operación. Puedo compartirte el objetivo, las capacidades que aborda y la aportación de nuestra organización.',
        evidenceUrl: 'https://horizontemanufactura.mx/vinculacion',
        evidenceLabel: 'Proyectos de colaboración formativa aprobados'
      }
    ],
    processSteps: [
      {
        step: 1,
        title: 'Nota ejecutiva de pertinencia institucional',
        desc: 'Revisión preliminar del objetivo, alcance y aportación de la iniciativa para confirmar alineación con prioridades de la planta.',
        expectation: 'Respuesta institucional en un plazo de 5 días hábiles'
      },
      {
        step: 2,
        title: 'Mesa de diálogo y delimitación de alcance',
        desc: 'Sesión de trabajo con los responsables de las áreas operativas involucradas para definir metas y compromisos mutuos.',
        expectation: 'Reunión ejecutiva de 45 min con orden del día preestablecido'
      },
      {
        step: 3,
        title: 'Canalización y gobernanza formal',
        desc: 'Formalización de acuerdos mediante los conductos jurídicos y de compras corporativas para su ejecución documentada.',
        expectation: 'Canalización directa con áreas de compras o convenios'
      }
    ],
    networkingTargets: [
      {
        target: 'Responsables de operación y desarrollo organizacional',
        purpose: 'Intercambiar experiencias en torno a desafíos concretos de coordinación y capacidades.',
        contribution: 'Una perspectiva operativa y disposición para definir conversaciones con propósito.'
      },
      {
        target: 'Proveedores y especialistas con capacidades verificables',
        purpose: 'Explorar propuestas relacionadas con necesidades y prioridades organizacionales.',
        contribution: 'Orientación inicial sobre pertinencia y canales dentro de su función.'
      },
      {
        target: 'Instituciones educativas y comunidades profesionales',
        purpose: 'Relacionar experiencias de trabajo, aprendizaje y colaboración entre organizaciones.',
        contribution: 'Diálogo sobre necesidades de capacidades y posibles formatos de vinculación.'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/demo-adriana-torres',
      instagram: 'https://instagram.com/horizontemanufactura',
      facebook: 'https://facebook.com/horizontemanufacturamx',
      website: 'https://horizontemanufactura.mx'
    },
    links: [
      {
        label: 'Conocer la organización',
        url: 'https://horizontemanufactura.mx',
        icon: 'corporate_fare',
        category: 'Corporativo'
      },
      {
        label: 'Temas de colaboración profesional',
        url: 'https://horizontemanufactura.mx/vinculacion',
        icon: 'handshake',
        category: 'Vinculación'
      },
      {
        label: 'Participaciones y materiales públicos',
        url: 'https://horizontemanufactura.mx/recursos',
        icon: 'article',
        category: 'Materiales'
      }
    ],
    testimonials: [
      ...SHARED_VERIFIED_TESTIMONIALS,
      {
        name: 'Felipe (Personaje Ficticio)',
        role: 'Colega en colaboración interinstitucional',
        company: 'Organización Ficticia de Demostración',
        comment:
          'RESEÑA FICTICIA — DEMOSTRACIÓN: Adriana ayudó a que la conversación tuviera un objetivo y a distinguir qué podía aportar cada parte. Esa claridad facilitó definir un siguiente paso con sentido para las organizaciones.',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        stars: undefined
      }
    ],
    operatorContext: {
      titularGoal: 'Orientar sus encuentros profesionales hacia colaboraciones pertinentes para su función.',
      targetAudienceSituation: 'Representantes de organizaciones, proveedores y especialistas con una propuesta relacionada con sus responsabilidades.',
      presentationDifficulty: 'Su cargo atrae contactos generales que no explican qué colaboración buscan ni por qué sería relevante.',
      whatToProtectOrBuild: 'Desarrollar una trayectoria reconocida por generar colaboración útil y fortalecer capacidades de los equipos.',
      observableSuccessChange: 'Que las propuestas recibidas expliquen propósito, aportación y siguiente paso, y avancen a conversaciones relevantes.',
      photoProductionNotes: 'Retrato ejecutivo cercano, con luz natural y fondo sobrio. Evitar instalaciones o distintivos de empresas reales ajenas a esta demostración.'
    },
    seoDescription:
      'Conoce los temas de vinculación de Adriana Torres: operaciones, desarrollo de capacidades y colaboración entre organizaciones con un propósito claro.',
    seoKeywords: [
      'Adriana Torres',
      'Directora de Operaciones',
      'Horizonte Manufactura',
      'Vinculación Industrial Querétaro',
      'Desarrollo de Capacidades'
    ]
  },

  // =========================================================================
  // ARQUETIPO F: Sector salud / médico / especialista — Dra. Lucía Cárdenas
  // =========================================================================
  {
    publicId: 'demo-lucia-cardenas',
    uid: 'DEMO-QRO-006F',
    published: true,
    verified: true,
    name: 'Dra. Lucía Cárdenas',
    shortName: 'Dra. Lucía',
    role: 'Médica general',
    company: 'Consultorio Punto Salud',
    logoUrl: createSvgLogo('+PS', '#8C5E52', '#FBF7F3'),
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de la Dra. Lucía Cárdenas, médica general',
    bannerTheme: 'from-stone-900 via-rose-950 to-stone-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&auto=format&fit=crop&q=80',
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'presencial',
    address: 'Av. Universidad Poniente 240, Consultorio 3B, Centro Histórico, Santiago de Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Av+Universidad+Poniente+240+Santiago+de+Queretaro',
    phone: '+524427804415',
    whatsappCustomMessage:
      'Hola, Dra. Lucía. Vi su tarjeta y quisiera información sobre disponibilidad, ubicación y requisitos para una consulta de medicina general.',
    email: 'citas@puntosalud.mx',
    calendarUrl: 'https://doctoralia.com.mx/demo-dra-lucia-cardenas/medico-general',
    websiteUrl: 'https://puntosalud.mx',
    pin: '4415',
    themeKey: 'personal',
    customPrimaryColor: '#8C5E52',
    customAccentColor: '#FBF7F3',
    status: 'Consultas con cita previa',
    statusActive: true,
    professionalProfile: 'salud',
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 12
    },
    customFields: {
      medicalProfession: 'Medicina general',
      licenseId: '7849102',
      specialtyLicenseId: '',
      institution: 'Consultorio Punto Salud',
      bookingUrl: 'https://doctoralia.com.mx/demo-dra-lucia-cardenas/medico-general',
      photoDescription: 'Retrato profesional cálido, fondo claro y expresión cercana. Vestimenta acorde con la práctica real de la titular; sin sellos ni distintivos inventados.'
    },
    valueProp:
      'Ofrezco consulta de medicina general para personas que buscan una valoración y una explicación clara de los siguientes pasos. La atención se adapta a la situación de cada persona y orienta el seguimiento o la referencia que corresponda.',
    primaryAction: {
      enabled: true,
      actionType: 'calendar',
      label: 'Solicitar una cita',
      sublabel: 'Canal administrativo para disponibilidad y horarios',
      customUrl: 'https://doctoralia.com.mx/demo-dra-lucia-cardenas/medico-general'
    },
    introVideo: {
      title: 'Conoce mi práctica y cómo solicitar una consulta',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '1:00 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Primera consulta de medicina general',
        desc: 'Consulta inicial de valoración con tiempo dedicado para resolver dudas y definir el proceso de atención.',
        problem: 'Quieres iniciar una valoración y conocer el proceso para acudir a consulta.',
        intervention: 'Se realiza la valoración correspondiente durante la consulta y se explican los hallazgos y siguientes pasos según la situación.',
        scope: 'Consulta dentro del alcance de medicina general; cualquier seguimiento, estudio o referencia se determina durante la atención.',
        solution: 'Comprender mejor la orientación médica y los pasos que se acuerden para tu atención.',
        ctaText: 'Preguntar por primera consulta',
        ctaMessage:
          'Hola, Dra. Lucía. Quisiera información administrativa sobre una primera consulta de medicina general: disponibilidad, ubicación y qué necesito llevar.',
        evidenceUrl: 'https://puntosalud.mx/primera-consulta',
        evidenceLabel: 'Guía de preparación para primera consulta'
      },
      {
        type: 'caso',
        title: 'Caso documentado: Protocolo de acompañamiento y apego a tratamiento en paciente con hipertensión inicial',
        desc: 'Valoración presencial y educación en estilo de vida con automonitoreo tensional estructurado.',
        problem: 'Paciente adulto con cifras tensionales elevadas en chequeo laboral sin seguimiento médico formal ni comprensión de factores de riesgo.',
        intervention: 'Valoración clínica presencial completa, perfil bioquímico básico, diario de automonitoreo tensional y ajuste gradual de hábitos de vida.',
        scope: 'Consulta inicial, revisión de estudios de laboratorio, plan de metas de estilo de vida y 2 consultas de control en consultorio.',
        solution: 'Estabilización de cifras tensionales en rango meta en 8 semanas con apego terapéutico documentado y comprensión clara del paciente sobre su autocuidado.',
        ctaText: 'Consultar seguimiento médico',
        ctaMessage:
          'Hola, Dra. Lucía. Quisiera orientación sobre cómo iniciar un protocolo de control y seguimiento preventivo en su consultorio.',
        evidenceUrl: 'https://cedula.buholegal.com/7849102/',
        evidenceLabel: 'Verificación pública de Cédula Profesional Federal de Médico Cirujano'
      },
      {
        type: 'solucion',
        title: 'Orientación preventiva dentro de la consulta',
        desc: 'Revisión periódica de salud, hábitos y recomendaciones preventivas acordes a cada etapa de vida.',
        problem: 'Quieres conversar con un profesional sobre prevención y cuidado de tu salud dentro de una valoración.',
        intervention: 'Durante la consulta se revisan los antecedentes y necesidades que correspondan y se explican las orientaciones pertinentes.',
        scope: 'Orientación individual en consulta; las recomendaciones se determinan a partir de la valoración.',
        solution: 'Contar con una explicación comprensible de los pasos de cuidado que se acuerden.',
        ctaText: 'Informarme sobre una consulta',
        ctaMessage:
          'Hola, Dra. Lucía. Me gustaría conocer disponibilidad y requisitos para una consulta de medicina general con orientación preventiva.',
        evidenceUrl: 'https://puntosalud.mx/prevencion',
        evidenceLabel: 'Orientación sobre chequeos y cuidados preventivos'
      }
    ],
    processSteps: [
      {
        step: 1,
        title: 'Agendamiento y confirmación de cita',
        desc: 'Selecciona fecha y hora disponible por Doctoralia o vía telefónica con recepción; no se atienden urgencias por este canal.',
        expectation: 'Confirmación inmediata y recordatorio 24h antes'
      },
      {
        step: 2,
        title: 'Valoración presencial en consultorio',
        desc: 'Historia clínica detallada, exploración física completa, revisión de estudios previos y diálogo claro sobre hallazgos.',
        expectation: 'Consulta médica dedicada de 40 a 50 minutos'
      },
      {
        step: 3,
        title: 'Plan de cuidado y seguimiento acordado',
        desc: 'Entrega de receta médica con cédula visible, indicaciones por escrito y definición de fecha o criterios para tu siguiente control.',
        expectation: 'Plan terapéutico personalizado con metas medibles'
      }
    ],
    networkingTargets: [
      {
        target: 'Profesionales de salud y colegas',
        purpose: 'Facilitar el contacto profesional y la orientación de referencias por los canales adecuados.',
        contribution: 'Una descripción clara de la práctica y disposición para coordinar comunicación dentro del alcance profesional.'
      },
      {
        target: 'Responsables de bienestar y atención en organizaciones',
        purpose: 'Conocer necesidades de orientación y explorar si existe una colaboración pertinente.',
        contribution: 'Una conversación sobre alcance, condiciones y canales, sin asumir servicios que no hayan sido acordados.'
      },
      {
        target: 'Instituciones y espacios de formación en salud',
        purpose: 'Explorar actividades de educación y comunicación relacionadas con medicina general.',
        contribution: 'Participación profesional sujeta a disponibilidad, alcance y validación de los contenidos.'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/demo-lucia-cardenas',
      instagram: 'https://instagram.com/dralucia.cardenas',
      facebook: 'https://facebook.com/consultoriopuntosalud',
      website: 'https://puntosalud.mx'
    },
    links: [
      {
        label: 'Preparar mi consulta',
        url: 'https://puntosalud.mx/preparacion',
        icon: 'medical_services',
        category: 'Atención'
      },
      {
        label: 'Ubicación y acceso al consultorio',
        url: 'https://maps.google.com/?q=Av+Universidad+Poniente+240+Santiago+de+Queretaro',
        icon: 'place',
        category: 'Ubicación'
      },
      {
        label: 'Trayectoria y credenciales',
        url: 'https://puntosalud.mx/credenciales',
        icon: 'verified',
        category: 'Credenciales'
      },
      {
        label: 'Opiniones autorizadas',
        url: 'https://puntosalud.mx/resenas',
        icon: 'star_outline',
        category: 'Reseñas'
      }
    ],
    testimonials: [
      ...SHARED_VERIFIED_TESTIMONIALS,
      {
        name: 'Paciente de Demostración (Ficticio)',
        role: 'Opinión sobre la comunicación del consultorio',
        company: 'Ejemplo Ficticio de Demostración',
        comment:
          'RESEÑA FICTICIA — DEMOSTRACIÓN: Antes de la cita pude encontrar la ubicación y preguntar qué necesitaba llevar. Durante la consulta tuve espacio para hacer preguntas y comprender los siguientes pasos.',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        stars: undefined
      }
    ],
    operatorContext: {
      titularGoal: 'Facilitar que una persona comprenda su práctica y encuentre el canal para solicitar información de consulta.',
      targetAudienceSituation: 'Personas interesadas en consulta de medicina general y colegas que necesitan una referencia profesional clara.',
      presentationDifficulty: 'Las recomendaciones llegan sin información suficiente sobre servicio, ubicación o forma de agendar.',
      whatToProtectOrBuild: 'Construir una práctica sostenible y reconocida por la claridad de la atención y la comunicación.',
      observableSuccessChange: 'Que las consultas administrativas lleguen al canal adecuado y que las personas comprendan cómo solicitar una cita.',
      photoProductionNotes: 'Retrato profesional cálido, fondo claro y expresión cercana. Vestimenta acorde con la práctica real de la titular; sin sellos ni distintivos inventados.'
    },
    seoDescription:
      'Conoce la práctica de medicina general de la Dra. Lucía Cárdenas, la ubicación del consultorio y los canales para solicitar información de citas en Querétaro.',
    seoKeywords: [
      'Dra. Lucía Cárdenas',
      'Médica General Querétaro',
      'Consulta Médica',
      'Punto Salud',
      'Atención Médica'
    ]
  },

  // =========================================================================
  // ARQUETIPO G: Institucional / sector público / academia — Mtra. Gabriela León
  // =========================================================================
  {
    publicId: 'demo-gabriela-leon',
    uid: 'DEMO-QRO-007G',
    published: true,
    verified: true,
    name: 'Mtra. Gabriela León',
    shortName: 'Gabriela',
    role: 'Coordinadora de Vinculación Institucional y Desarrollo de Capacidades',
    company: 'Centro Regional de Formación y Vinculación',
    logoUrl: createSvgLogo('CRFV', '#1D4ED8', '#F8FAFC'),
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto oficial de la Mtra. Gabriela León, Coordinadora de Vinculación',
    bannerTheme: 'from-slate-900 via-blue-950 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
    city: 'Santiago de Querétaro, Querétaro',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Av. Los Arcos 102, Col. Carretas, Santiago de Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Los+Arcos+Queretaro',
    phone: '+524428916327',
    whatsappCustomMessage:
      'Hola Gabriela. Vi tu perfil y quisiera compartir una propuesta de colaboración entre nuestra organización y la institución. Puedo describir su propósito, las personas a las que busca beneficiar y nuestra aportación.',
    email: 'vinculacion@crfv-institucional.org',
    calendarUrl: 'https://calendly.com/gabriela-leon-crfv/sesion-vinculacion',
    websiteUrl: 'https://crfv-institucional.org',
    pin: '6327',
    themeKey: 'ejecutivo',
    customPrimaryColor: '#1D4ED8',
    customAccentColor: '#1E293B',
    status: 'Vinculación con cita',
    statusActive: true,
    professionalProfile: 'institucional_publico',
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 16
    },
    customFields: {
      institutionName: 'Centro Regional de Formación y Vinculación',
      institutionalDepartment: 'Vinculación Institucional y Desarrollo de Capacidades',
      territorialScope: 'Ámbito regional Bajío',
      publicLiaisonTopics: 'Colaboración entre organizaciones, formación relacionada con necesidades del trabajo y propuestas de vinculación con un propósito definido.',
      photoDescription: 'Retrato profesional accesible y sobrio, sin sellos, escudos o distintivos de dependencias reales.'
    },
    valueProp:
      'Facilito conversaciones entre organizaciones, instituciones educativas y actores comunitarios para convertir necesidades compartidas en propuestas de colaboración claras. Mi función es orientar cada iniciativa hacia el área competente y ayudar a definir su propósito y los siguientes pasos de revisión.',
    primaryAction: {
      enabled: true,
      actionType: 'whatsapp',
      label: 'Proponer colaboración',
      sublabel: 'Presenta objetivo, destinatarios y aportación de tu entidad',
      customMessage:
        'Hola Gabriela. Vi tu perfil y quisiera compartir una propuesta de colaboración entre nuestra organización y la institución. Puedo describir su propósito, las personas a las que busca beneficiar y nuestra aportación.'
    },
    introVideo: {
      title: 'Propósito, aportación y siguiente paso',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '1:05 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Relacionar formación y necesidades del trabajo',
        desc: 'Orientación y diseño preliminar para vincular programas formativos con demandas laborales concretas.',
        problem: 'Tu organización identifica una necesidad de capacidades y quiere explorar una colaboración con una institución de formación.',
        intervention: 'Orientamos una conversación sobre el público, el objetivo y las capacidades que se busca desarrollar.',
        scope: 'Revisión inicial de la propuesta y canalización al área competente. El diseño de actividades y cualquier compromiso se revisan por los canales institucionales.',
        solution: 'Plantear una colaboración con objetivos e interlocutores mejor definidos.',
        ctaText: 'Proponer una colaboración formativa',
        ctaMessage:
          'Hola Gabriela. Nuestra organización quiere explorar una colaboración formativa. Puedo compartir el público, la necesidad de capacidades y la aportación que proponemos.',
        evidenceUrl: 'https://crfv-institucional.org/colaboracion-formativa',
        evidenceLabel: 'Lineamientos de vinculación para formación'
      },
      {
        type: 'caso',
        title: 'Caso documentado: Articulación del convenio marco de estadías formativas con 12 preparatorias técnicas',
        desc: 'Mecanismo institucional homogéneo para vincular alumnos de último grado con talleres industriales.',
        problem: 'Escuelas técnicas de la zona metropolitana carecían de un mecanismo homogéneo para canalizar alumnos a estadías formativas supervisadas.',
        intervention: 'Instalación de mesa de enlace interinstitucional, redacción del catálogo unificado de competencias y ventanilla única de registro escolar.',
        scope: 'Convenio marco de colaboración, protocolo de seguimiento de estadías y padrón coordinado con autoridades educativas del estado.',
        solution: 'Incorporación de 340 estudiantes a estadías formales en el ciclo escolar con bitácora de competencias y cero incidencias administrativas.',
        ctaText: 'Consultar vinculación',
        ctaMessage:
          'Hola Gabriela. Me interesa consultar el esquema de vinculación y los requisitos para participar en convenios de colaboración formativa.',
        evidenceUrl: 'https://crfv-institucional.org/casos/convenio-preparatorias-2025.pdf',
        evidenceLabel: 'Publicación oficial del convenio marco y catálogo de estadías'
      },
      {
        type: 'solucion',
        title: 'Identificar el canal de vinculación adecuado',
        desc: 'Canalización institucional certera hacia dependencias, facultades o coordinaciones responsables.',
        problem: 'Quieres conversar con la institución y necesitas saber si tu tema corresponde a esta área.',
        intervention: 'Revisamos el asunto y orientamos hacia el canal competente cuando la información disponible lo permita.',
        scope: 'Información de contacto y orientación institucional dentro de las responsabilidades publicadas.',
        solution: 'Facilitar una interlocución pertinente y reducir expectativas equivocadas sobre la función del área.',
        ctaText: 'Consultar el canal adecuado',
        ctaMessage:
          'Hola Gabriela. Necesito orientación para identificar el canal institucional adecuado para un asunto de vinculación. Puedo compartir una descripción breve del tema.',
        evidenceUrl: 'https://crfv-institucional.org/directorio',
        evidenceLabel: 'Directorio institucional y áreas de competencia'
      }
    ],
    processSteps: [
      {
        step: 1,
        title: 'Presentación formal de la propuesta o consulta',
        desc: 'Recepción de ficha descriptiva indicando competencia legal, población beneficiaria y aportación mutua de la entidad.',
        expectation: 'Acuse de recibo y revisión preliminar en 3 a 5 días hábiles'
      },
      {
        step: 2,
        title: 'Mesa de vinculación y dictamen técnico',
        desc: 'Reunión de trabajo interinstitucional para verificar delimitación territorial, marco normativo y recursos disponibles.',
        expectation: 'Dictamen de viabilidad técnica e institucional'
      },
      {
        step: 3,
        title: 'Formalización de convenio y seguimiento',
        desc: 'Firma de instrumento jurídico correspondiente y designación de enlaces operativos para ejecución transparente.',
        expectation: 'Publicación en padrón de convenios institucionales vigentes'
      }
    ],
    networkingTargets: [
      {
        target: 'Instituciones educativas y responsables de formación',
        purpose: 'Explorar proyectos relacionados con necesidades de capacidades de personas y organizaciones.',
        contribution: 'Orientación de la conversación y articulación de interlocutores dentro de su función.'
      },
      {
        target: 'Empresas, asociaciones y organizaciones comunitarias',
        purpose: 'Identificar propósitos compartidos y propuestas de colaboración pertinentes.',
        contribution: 'Claridad sobre información necesaria, competencias y pasos de revisión.'
      },
      {
        target: 'Áreas e instituciones con funciones complementarias',
        purpose: 'Facilitar canalización y coordinación en temas que requieran distintos interlocutores.',
        contribution: 'Comunicación de responsabilidades y conexión mediante canales autorizados.'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/demo-gabriela-leon',
      instagram: 'https://instagram.com/crfv.vinculacion',
      facebook: 'https://facebook.com/crfvinstitucional',
      website: 'https://crfv-institucional.org'
    },
    links: [
      {
        label: 'Conocer la institución y su función',
        url: 'https://crfv-institucional.org',
        icon: 'account_balance',
        category: 'Institución'
      },
      {
        label: 'Preparar una propuesta de colaboración',
        url: 'https://crfv-institucional.org/propuesta-guia',
        icon: 'assignment',
        category: 'Guía'
      },
      {
        label: 'Consultar canales institucionales',
        url: 'https://crfv-institucional.org/directorio',
        icon: 'contact_page',
        category: 'Directorio'
      },
      {
        label: 'Proyectos y actividades públicas',
        url: 'https://crfv-institucional.org/proyectos',
        icon: 'hub',
        category: 'Proyectos'
      }
    ],
    testimonials: [
      ...SHARED_VERIFIED_TESTIMONIALS,
      {
        name: 'Teresa (Personaje Ficticio)',
        role: 'Representante de organización educativa',
        company: 'Institución Ficticia de Demostración',
        comment:
          'RESEÑA FICTICIA — DEMOSTRACIÓN: La orientación nos ayudó a expresar para qué queríamos colaborar y qué podía aportar cada organización. También comprendimos qué área debía revisar la propuesta y cuál era el siguiente paso.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        stars: undefined
      }
    ],
    operatorContext: {
      titularGoal: 'Recibir propuestas con propósito y datos básicos para orientar su revisión.',
      targetAudienceSituation: 'Representantes de organizaciones, instituciones educativas y actores comunitarios que buscan una colaboración pertinente.',
      presentationDifficulty: 'Recibe solicitudes generales que no explican a quién beneficiarían, qué se propone ni qué puede aportar cada parte.',
      whatToProtectOrBuild: 'Contribuir a proyectos útiles y construir relaciones institucionales con continuidad y claridad de responsabilidades.',
      observableSuccessChange: 'Que las propuestas permitan identificar pertinencia, interlocutores y siguiente paso de revisión.',
      photoProductionNotes: 'Retrato profesional accesible y sobrio, sin sellos, escudos o distintivos de dependencias reales.'
    },
    seoDescription:
      'Conoce los temas de vinculación de Gabriela León y cómo presentar una propuesta de colaboración entre organizaciones e instituciones de formación en Querétaro.',
    seoKeywords: [
      'Mtra. Gabriela León',
      'Vinculación Institucional',
      'CRFV Querétaro',
      'Desarrollo de Capacidades',
      'Colaboración Interinstitucional'
    ]
  }
];
