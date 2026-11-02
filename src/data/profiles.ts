import { ParticipantProfile } from '../types/card';
import { DEMO_ARCHETYPE_PROFILES } from './demoArchetypeProfiles';

export { DEMO_ARCHETYPE_PROFILES };

export const INITIAL_PROFILES: ParticipantProfile[] = [

  {
    publicId: 'sara-sazedi',
    uid: 'MX-CDMX-1044',
    published: true,
    name: 'Sara Sazedi',
    shortName: 'Sara Sazedi',
    role: 'Consultora de Negocios & Alianzas Estratégicas',
    company: 'Sazedi Consulting Group',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    city: 'Ciudad de México',
    showLocation: false, // Negocio digital/consultoría: no fuerza ubicación física
    locationMode: 'remoto',
    status: 'Disponible para networking',
    statusActive: true,
    avatarUrl: 'https://iaconkris.com/pics/S1.jpeg',
    avatarAlt: 'Foto profesional de Sara Sazedi',
    verified: true,
    themeKey: 'ejecutivo',
    professionalProfile: 'profesional_independiente',
    customFields: {
      specialty: 'Alianzas Estratégicas & Escalamiento B2B',
      clientType: 'Líderes empresariales y fundadores de scale-ups',
      serviceScope: 'Consultoría estratégica 1 a 1 y convenios comerciales'
    },
    bannerTheme: 'from-slate-900 via-slate-800 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+525512345678',
    pin: '1234',
    features: {
      hasMiniCrm: true,
      hasMeetingIntelligence: true,
      aiMinutesQuota: 120,
      aiMinutesUsed: 26
    },
    whatsappCustomMessage: 'Hola Sara, vi tu tarjeta digital en RedConecta MX y me gustaría conectar contigo.',
    email: 'sara.sazedi@sazediconsulting.com',
    calendarUrl: 'https://calendly.com',
    directoryUrl: 'https://redconecta.mx/directorio/sara-sazedi',
    valueProp: 'Acompaño a líderes empresariales y directores de pymes a consolidar alianzas estratégicas y escalar sus modelos de negocio.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sara-sazedi',
      instagram: 'https://instagram.com/sara.sazedi',
      twitter: 'https://x.com/sarasazedi',
      website: 'https://sazediconsulting.com'
    },
    seoDescription: 'Consultora de Negocios y Alianzas Estratégicas para scale-ups y pymes en México.',
    seoKeywords: ['Consultoría de Negocios', 'Alianzas Estratégicas', 'CDMX', 'Mentoría Ejecutiva'],
    introVideo: {
      title: 'Video de Presentación: Alianzas & Expansión',
      url: 'https://iaconkris.com/pics/Sara.mp4',
      duration: '1:00 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        title: 'Desarrollo de Alianzas Comerciales',
        desc: 'Estructuración de convenios y canales de distribución de alto impacto.',
        problem: 'Scale-ups y pymes con gran producto pero estancadas por falta de canales de distribución y acuerdos B2B estratégicos.',
        solution: 'Diseñamos la estrategia de alianzas y negociación directa, logrando convenios clave que duplicaron su alcance en 90 días.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Sara, vi el caso de Alianzas Comerciales en tu tarjeta y me gustaría resolver una necesidad similar en mi negocio.'
      },
      {
        title: 'Consultoría en Expansión Comercial',
        desc: 'Optimización de propuesta comercial y posicionamiento en el mercado corporativo.',
        problem: 'Empresas con ciclos de venta largos, desalineación comercial y propuesta de valor poco clara ante tomadores de decisión.',
        solution: 'Reestructuramos la oferta de alto valor y la narrativa comercial, elevando 35% la tasa de cierre ante directores generales.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Sara, leí tu caso de Expansión Comercial y tengo un reto similar con el crecimiento de mi empresa.'
      },
      {
        title: 'Mentoría Ejecutiva para Directores',
        desc: 'Acompañamiento 1 a 1 para toma de decisiones y expansión directiva.',
        problem: 'Líderes saturados en la operación diaria sin claridad para decisiones críticas de escalamiento ni estructura de alianzas.',
        solution: 'Sesiones ejecutivas de enfoque y gobernanza para destrabar cuellos de botella y acelerar la toma de decisiones de alto impacto.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Sara, me interesa tu acompañamiento en mentoría directiva para resolver un reto similar en mi liderazgo.'
      }
    ],
    networkingTargets: [
      'Directores generales y fundadores de pymes en expansión.',
      'Inversionistas ángel y fondos de venture capital.',
      'Socios comerciales en servicios corporativos y tecnología.'
    ],
    links: [
      {
        label: 'Agendar Reunión 1 a 1',
        icon: 'calendar_month',
        url: 'https://calendly.com',
        category: 'Agenda'
      },
      {
        label: 'Conectar en LinkedIn Profesional',
        icon: 'open_in_new',
        url: 'https://linkedin.com',
        category: 'Redes'
      },
      {
        label: 'Enviar Correo Directo',
        icon: 'mail',
        url: 'mailto:sara.sazedi@sazediconsulting.com',
        category: 'Contacto'
      }
    ],
    testimonials: [
      {
        name: 'Roberto Méndez',
        role: 'Director General',
        company: 'Grupo Industrial Bajío',
        comment: 'Gracias a la asesoría estratégica de Sara concretamos una alianza binacional que duplicó nuestra capacidad en menos de 6 meses.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      },
      {
        name: 'Dra. Elena Ramos',
        role: 'Founder & CEO',
        company: 'SaludConecta MX',
        comment: 'Su visión de negocio y acompañamiento ejecutivo fueron determinantes para cerrar nuestra ronda seed con éxito.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      }
    ]
  },
  ...DEMO_ARCHETYPE_PROFILES,
  {
    publicId: 'sofia-valenzuela',
    uid: 'MX-CDMX-8921',
    published: true,
    name: 'Mtra. Sofía Valenzuela Cárdenas',
    shortName: 'Sofía Valenzuela',
    role: 'Consultora Senior en Estrategia Fiscal y Gobernanza',
    company: 'Valenzuela & Asociados',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&auto=format&fit=crop&q=80',
    city: 'Ciudad de México',
    showLocation: true, // Despacho con sede física
    locationMode: 'presencial',
    address: 'Torre Reforma 222, Piso 18, Cuauhtémoc, CDMX',
    googleMapsUrl: 'https://maps.google.com/?q=Paseo+de+la+Reforma+222+CDMX',
    status: 'Disponible para asesorías',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de la Mtra. Sofía Valenzuela Cárdenas, consultora en estrategia fiscal en CDMX',
    verified: true,
    themeKey: 'ejecutivo',
    professionalProfile: 'profesional_independiente',
    customFields: {
      specialty: 'Estrategia Fiscal & Blindaje Patrimonial',
      clientType: 'Empresas familiares con facturación +$25M MXN',
      serviceScope: 'Auditorías preventivas ante SAT y protocolos sucesorios'
    },
    bannerTheme: 'from-slate-900 via-slate-800 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+525541234567',
    whatsappCustomMessage: 'Hola Mtra. Sofía Valenzuela, vi tu tarjeta digital en RedConecta MX y me gustaría coordinar una sesión de asesoría.',
    email: 'sofia@valenzuela-fiscal.mx',
    calendarUrl: 'https://calendly.com',
    directoryUrl: 'https://redconecta.mx/directorio/valenzuela-asociados',
    websiteUrl: 'https://valenzuela-fiscal.mx',
    valueProp: 'Optimizo la gobernanza fiscal y patrimonial de empresas familiares mexicanas que facturan +$25M MXN anuales.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sofia-valenzuela-fiscal',
      instagram: 'https://instagram.com/sofia.fiscal',
      youtube: 'https://youtube.com/@sofiavalenzuelafiscal',
      website: 'https://valenzuela-fiscal.mx'
    },
    seoDescription: 'Especialista en gobernanza fiscal, protocolos sucesorios y blindaje patrimonial para empresas familiares en México.',
    seoKeywords: ['Estrategia Fiscal', 'Blindaje Patrimonial', 'Gobernanza Familiar', 'CDMX', 'SAT', 'Sucesión'],
    introVideo: {
      title: 'Mensaje de Bienvenida: Blindaje Fiscal 2026',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      duration: '1:15 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        title: 'Diagnóstico Fiscal Preventivo',
        desc: 'Auditoría integral ante SAT para blindar operaciones, deducciones y cumplimiento.',
        problem: 'Empresas familiares con inconsistencias contables acumuladas y riesgo de auditorías o multas severas del SAT.',
        solution: 'Auditoría preventiva exhaustiva que regularizó el 100% de expedientes y blindó deducciones por $18M MXN.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Mtra. Sofía, me interesa solicitar un Diagnóstico Fiscal Preventivo para mi empresa.'
      },
      {
        title: 'Protocolos de Sucesión Familiar',
        desc: 'Reglas claras de gobernanza para transiciones generacionales sin fricción patrimonial.',
        problem: 'Familias empresarias en conflicto por falta de reglas claras para el relevo directivo y el control patrimonial.',
        solution: 'Diseño de estatutos familiares y fideicomisos que garantizaron la transición pacífica a la 2da y 3ra generación.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Mtra. Sofía, quisiera consultarle sobre protocolos de sucesión para nuestra empresa familiar.'
      },
      {
        title: 'Reestructuración Societaria',
        desc: 'Modelos de holdings patrimoniales eficientes y 100% en regla con leyes mexicanas.',
        problem: 'Estructuras dispersas con duplicidad de costos fiscales y alta exposición patrimonial ante contingencias operativas.',
        solution: 'Consolidación en holding patrimonial que ordenó la tenencia de activos y optimizó la carga impositiva en estricta regla.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Mtra. Sofía, nos interesa evaluar una reestructuración societaria con su despacho.'
      }
    ],
    networkingTargets: [
      'Socios directores de despachos contables y notarías públicas en CDMX.',
      'Directores de Finanzas (CFOs) de medianas empresas manufactureras o de servicios.',
      'Fondos de capital privado buscando aliados de Due Diligence fiscal.'
    ],
    links: [
      {
        label: 'Agendar Sesión de Diagnóstico 1 a 1',
        icon: 'calendar_month',
        url: 'https://calendly.com',
        category: 'Agenda'
      },
      {
        label: 'Casos de Éxito en Empresas Familiares',
        icon: 'menu_book',
        url: 'https://valenzuela-fiscal.mx/casos',
        category: 'Estudios'
      },
      {
        label: 'Perfil Oficial de LinkedIn Verificado',
        icon: 'open_in_new',
        url: 'https://linkedin.com/in/sofia-valenzuela-fiscal',
        category: 'Redes'
      },
      {
        label: 'Descargar Brochure de Servicios Corporativos',
        icon: 'download',
        url: 'https://valenzuela-fiscal.mx/brochure.pdf',
        category: 'Documentos'
      },
      {
        label: 'Sitio Web Valenzuela & Asociados',
        icon: 'language',
        url: 'https://valenzuela-fiscal.mx',
        category: 'Web'
      }
    ],
    testimonials: [
      {
        name: 'Ing. Alejandro Morales',
        role: 'Director de Finanzas',
        company: 'Logística TransMéxico',
        comment: 'Excelente reestructuración fiscal corporativa. Claridad jurídica total, blindaje ante SAT y atención inmediata.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      },
      {
        name: 'Lic. Claudia Garza',
        role: 'Consejera Patrimonial',
        company: 'Family Office Monterrey',
        comment: 'El protocolo sucesorio diseñado por la Mtra. Sofía aseguró la continuidad pacífica y ordenada del patrimonio familiar.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    publicId: 'mateo-arrambide',
    uid: 'MX-GDL-4512',
    published: true,
    name: 'Mateo Arrambide Luján',
    shortName: 'Mateo Arrambide',
    role: 'Diseñador & Fundador de Taller Lumbre',
    company: 'Taller Lumbre Mobiliario & Iluminación',
    logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=100&auto=format&fit=crop&q=80',
    city: 'Guadalajara, Jal.',
    showLocation: true, // Taller y Showroom físico
    locationMode: 'presencial',
    address: 'Calle Libertad 1420, Col. Americana, Guadalajara, Jal.',
    googleMapsUrl: 'https://maps.google.com/?q=Calle+Libertad+1420+Guadalajara',
    status: 'Tomando proyectos Q3/Q4',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto de Mateo Arrambide Luján en taller de mobiliario artesanal en Guadalajara',
    verified: false,
    themeKey: 'negocio',
    professionalProfile: 'emprendedor_solopreneur',
    customFields: {
      category: 'Mobiliario Artesanal de Alto Uso & Esculturas Lumínicas',
      modality: 'Fabricación contract sobre pedido y piezas de autor',
      serviceZone: 'Taller en Guadalajara y envíos a toda la República'
    },
    bannerTheme: 'from-emerald-950 via-teal-900 to-emerald-900',
    bannerImageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+523319876543',
    whatsappCustomMessage: 'Hola Mateo, vi el trabajo de Taller Lumbre en RedConecta MX y tengo un proyecto de interiorismo/hospitalidad.',
    email: 'mateo@tallerlumbre.mx',
    calendarUrl: 'https://calendly.com',
    directoryUrl: 'https://redconecta.mx/directorio/taller-lumbre',
    websiteUrl: 'https://tallerlumbre.mx',
    valueProp: 'Creamos piezas de mobiliario e iluminación a la medida para hoteles boutique y restaurantes con carácter contemporáneo.',
    socialLinks: {
      instagram: 'https://instagram.com/tallerlumbre',
      facebook: 'https://facebook.com/tallerlumbregdl',
      website: 'https://tallerlumbre.mx'
    },
    seoDescription: 'Mobiliario contract e iluminación escultórica contemporánea para proyectos de hospitalidad y gastronomía.',
    seoKeywords: ['Mobiliario Artesanal', 'Diseño de Iluminación', 'Guadalajara', 'Hotelería Boutique', 'Interiorismo'],
    introVideo: {
      title: 'Recorrido por el Taller Lumbre en Guadalajara',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      duration: '2:10 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        title: 'Mobiliario Contract para Hospitalidad',
        desc: 'Fabricación de alto uso con maderas mexicanas certificadas y metales nobles.',
        problem: 'Hoteles boutique y restaurantes de autor recibiendo piezas genéricas que se desgastan rápidamente con uso continuo.',
        solution: 'Diseñamos y fabricamos mobiliario con ensambles artesanales de uso rudo y maderas tropicales certificadas para alta afluencia.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Mateo, vi el mobiliario contract de Taller Lumbre y tengo un proyecto de hospitalidad con una necesidad similar.'
      },
      {
        title: 'Sistemas Lumínicos Escultóricos',
        desc: 'Lámparas monumentales diseñadas específicamente para lobbies, bares y restaurantes.',
        problem: 'Espacios de doble altura o conceptos gastronómicos que carecían de un elemento lumínico icónico que cautivara al comensal.',
        solution: 'Creamos luminarias monumentales en latón martillado y vidrio soplado que se convirtieron en el sello fotográfico del local.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Mateo, busco desarrollar una pieza de iluminación escultórica para un nuevo proyecto de interiorismo.'
      },
      {
        title: 'Desarrollo de Mobiliario a Medida',
        desc: 'Colaboración directa con despachos de arquitectura e interiorismo de toda la república.',
        problem: 'Despachos de interiorismo con ideas conceptuales complejas que los talleres convencionales no saben materializar.',
        solution: 'Acompañamos desde el modelado 3D y prototipado físico hasta la instalación final en obra con garantía de autor.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Mateo, somos un despacho de arquitectura y nos gustaría colaborar con Taller Lumbre en piezas a la medida.'
      }
    ],
    networkingTargets: [
      'Arquitectos e interioristas enfocados en proyectos de hospitalidad en Jalisco y Riviera Nayarit.',
      'Desarrolladores hoteleros y directores de compras de cadenas boutique.',
      'Proveedores de cantera, cerámica de alta temperatura y maderas sustentables.'
    ],
    links: [
      {
        label: 'Catálogo Colección 2025 (PDF)',
        icon: 'auto_stories',
        url: 'https://tallerlumbre.mx/catalogo-2025.pdf',
        category: 'Catálogo'
      },
      {
        label: 'Portafolio de Proyectos Hoteleros',
        icon: 'photo_library',
        url: 'https://tallerlumbre.mx/proyectos',
        category: 'Galería'
      },
      {
        label: 'Agendar Visita al Taller en Guadalajara',
        icon: 'store',
        url: 'https://calendly.com/tallerlumbre',
        category: 'Visita'
      },
      {
        label: 'Instagram Oficial @tallerlumbre.gdl',
        icon: 'camera_alt',
        url: 'https://instagram.com/tallerlumbre.gdl',
        category: 'Social'
      },
      {
        label: 'Sitio Web Taller Lumbre',
        icon: 'language',
        url: 'https://tallerlumbre.mx',
        category: 'Web'
      }
    ],
    testimonials: [
      {
        name: 'Arq. Mariana De la Torre',
        role: 'Directora de Diseño',
        company: 'Estudio Arquitectura Guadalajara',
        comment: 'Taller Lumbre fabricó las luminarias monumentales para nuestro hotel en Sayulita. Calidad de detalle impecable.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    publicId: 'cuauhtemoc-gonzalez',
    uid: 'MX-MTY-7734',
    published: true,
    name: 'Ing. Cuauhtémoc González-Álvarez',
    shortName: 'Cuauhtémoc González',
    role: 'Director de Operaciones & Automatización B2B',
    company: 'Logística Integral del Norte',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80',
    city: 'Monterrey, N.L.',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Parque de Investigación e Innovación Tecnológica (PIIT), Apodaca, N.L.',
    googleMapsUrl: 'https://maps.google.com/?q=PIIT+Apodaca+Nuevo+Leon',
    status: 'En evento presencial',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto del Ing. Cuauhtémoc González-Álvarez, director de automatización en Monterrey',
    verified: true,
    themeKey: 'personal',
    professionalProfile: 'empresario_dueno',
    customFields: {
      sectorsServed: 'Automotriz OEM, Aeroespacial y Logística de Distribución',
      coverage: 'Monterrey, Saltillo y Cobertura Norte del País',
      coreCapabilities: 'Flotillas de robots autónomos (AGVs), analítica en tiempo real e integración Just-in-Time'
    },
    bannerTheme: 'from-stone-900 via-amber-950 to-orange-950',
    customPrimaryColor: '#ac3400',
    phone: '+528182345678',
    whatsappCustomMessage: 'Hola Ing. Cuauhtémoc, vi tu perfil en RedConecta MX y nos interesa evaluar automatización logística.',
    email: 'cuauhtemoc.gonzalez@logisticanorte.com.mx',
    calendarUrl: 'https://calendly.com',
    directoryUrl: 'https://redconecta.mx/directorio/logistica-norte',
    websiteUrl: 'https://logisticanorte.com.mx',
    valueProp: 'Acelero la productividad en cadenas logísticas mediante robótica autónoma y analítica en tiempo real para el sector industrial.',
    introVideo: {
      title: 'Demo en Vivo: Robótica Móvil y AGVs Industriales',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      duration: '1:45 min',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
    },
    solutions: [
      {
        title: 'Automatización de Centros de Distribución',
        desc: 'Integración de AGVs y bandas clasificadoras con 99.8% de disponibilidad operativa.',
        problem: 'Almacenes con demoras en despacho y costos elevados por transporte interno manual de tarimas en planta.',
        solution: 'Implementamos flotilla de robots autónomos (AGVs) y bandas inteligentes, elevando la velocidad de despacho un 38%.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Ing. Cuauhtémoc, queremos evaluar la automatización con AGVs en nuestro centro de distribución.'
      },
      {
        title: 'Reducción de Merma y Tiempos de Picking',
        desc: 'Optimización matemática de rutas en bodega con algoritmos de analítica local.',
        problem: 'Operadores recorriendo distancias excesivas en bodega con errores de surtido de hasta 6% en horas pico.',
        solution: 'Desplegamos software de optimización de rutas y terminales inteligentes, bajando el error a menos del 0.2%.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Ing. Cuauhtémoc, nos interesa implementar algoritmos para optimizar tiempos de picking y rutas.'
      },
      {
        title: 'Consultoría de Nearshoring Logístico',
        desc: 'Adecuación operativa de almacenes para proveeduría automotriz, médica y aeroespacial.',
        problem: 'Plantas industriales que requieren cumplir con estándares internacionales Just-in-Time para clientes OEM.',
        solution: 'Reingeniería de layout y certificación de procesos logísticos para integrarse a cadenas de suministro globales.',
        ctaText: '¿Tienes una necesidad similar?',
        ctaMessage: 'Hola Ing. Cuauhtémoc, requerimos consultoría para adecuar nuestra logística a requerimientos de nearshoring.'
      }
    ],
    networkingTargets: [
      'Vicepresidentes de Cadena de Suministro en plantas automotrices de Nuevo León y Coahuila.',
      'Empresas de e-commerce buscando centros de cumplimiento automatizados en el norte.',
      'Fabricantes de sensores industriales y tecnología PLC de alta gama.'
    ],
    links: [
      {
        label: 'Solicitar Demo de Automatización en Vivo',
        icon: 'precision_manufacturing',
        url: 'https://logisticanorte.com.mx/demo',
        category: 'Demo'
      },
      {
        label: 'Whitepaper: Logística en la era del Nearshoring',
        icon: 'description',
        url: 'https://logisticanorte.com.mx/whitepaper-nearshoring.pdf',
        category: 'Lectura'
      },
      {
        label: 'Conectar en LinkedIn Profesional',
        icon: 'connect_without_contact',
        url: 'https://linkedin.com/in/cuauhtemoc-gonzalez-ops',
        category: 'Redes'
      },
      {
        label: 'Calculadora de Retorno de Inversión (ROI)',
        icon: 'calculate',
        url: 'https://logisticanorte.com.mx/calculadora-roi',
        category: 'Herramienta'
      },
      {
        label: 'Portal Logística Integral del Norte',
        icon: 'domain',
        url: 'https://logisticanorte.com.mx',
        category: 'Web'
      }
    ],
    testimonials: [
      {
        name: 'Lic. Fernando Treviño',
        role: 'VP Operaciones Cadena de Suministro',
        company: 'Autopartes del Norte S.A.',
        comment: 'Implementamos la automatización con AGVs de Cuauhtémoc y redujimos los tiempos de ciclo un 32% en el primer trimestre.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    publicId: 'carlos-mendoza',
    uid: 'MX-QRO-3321',
    published: true,
    name: 'Lic. Carlos Mendoza Vega',
    shortName: 'Carlos Mendoza',
    role: 'Asesor Patrimonial & Seguros Corporativos',
    company: 'Mendoza Consultores Patrimoniales',
    logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=80',
    city: 'Querétaro, Qro.',
    showLocation: true,
    locationMode: 'presencial',
    address: 'Torre Momentum Centro Sur, Piso 7, Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Torre+Momentum+Centro+Sur+Queretaro',
    status: 'Disponible para asesorías',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de Carlos Mendoza Vega, asesor comercial patrimonial en Querétaro',
    verified: true,
    themeKey: 'ejecutivo',
    professionalProfile: 'comercial_asesor',
    customFields: {
      sector: 'Seguros Patrimoniales, Retiro & Hombre Clave',
      territory: 'Querétaro, Bajío y Cobertura Nacional',
      solutionLines: 'Protección de socios clave, planes de retiro deducibles y gastos médicos mayores'
    },
    bannerTheme: 'from-slate-900 via-slate-800 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+524421234567',
    whatsappCustomMessage: 'Hola Carlos, vi tu tarjeta digital en Tribu Creativa QRO y me gustaría solicitar una asesoría patrimonial.',
    email: 'carlos.mendoza@mendozapatrimonial.mx',
    calendarUrl: 'https://calendly.com',
    directoryUrl: 'https://redconecta.mx/directorio/carlos-mendoza',
    websiteUrl: 'https://mendozapatrimonial.mx',
    valueProp: 'Asesoro a empresarios y profesionistas a blindar su patrimonio familiar y estructurar pólizas deducibles con proceso claro y sin letras chiquitas.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/carlos-mendoza-patrimonial',
      instagram: 'https://instagram.com/carlosmendoza.patrimonial',
      website: 'https://mendozapatrimonial.mx'
    },
    seoDescription: 'Asesor comercial en seguros patrimoniales, retiro deducible y pólizas corporativas en Querétaro y el Bajío.',
    seoKeywords: ['Asesor de Seguros', 'Blindaje Patrimonial', 'Querétaro', 'Hombre Clave', 'Planes de Retiro'],
    solutions: [
      {
        title: 'Blindaje de Socios Clave (Hombre Clave)',
        desc: 'Pólizas empresariales deducibles que protegen la continuidad financiera de la sociedad.',
        problem: 'Sociedades mercantiles vulnerables a parálisis operativa o descapitalización ante la ausencia de un socio director.',
        solution: 'Diseño de póliza Hombre Clave 100% deducible de impuestos que garantiza un fondo de liquidez inmediata para la empresa.',
        ctaText: 'Solicitar asesoría o cotización',
        ctaMessage: 'Hola Carlos, vi el caso de Seguro Hombre Clave en tu tarjeta y me interesa cotizar una solución para los socios de mi empresa.'
      },
      {
        title: 'Planes Personales de Retiro (PPR) Deducibles',
        desc: 'Estrategias de inversión patrimonial con beneficio fiscal bajo artículos 151 y 185 LISR.',
        problem: 'Profesionistas y directores que pagan altas tasas de ISR sin un vehículo ordenado de ahorro a largo plazo.',
        solution: 'Estructuración de PPR indexado a monedas fuertes con retorno anual de saldo a favor en la declaración anual.',
        ctaText: 'Solicitar asesoría o cotización',
        ctaMessage: 'Hola Carlos, me interesa una asesoría personalizada para estructurar mi Plan Personal de Retiro deducible.'
      },
      {
        title: 'Gastos Médicos Mayores Colectivos',
        desc: 'Cobertura médica integral para comités ejecutivos y plantas operativas.',
        problem: 'Empresas con rotación de personal clave por falta de prestaciones médicas competitivas.',
        solution: 'Negociación colectiva con aseguradoras líderes, reduciendo costos de prima un 22% con mejor cobertura hospitalaria.',
        ctaText: 'Solicitar asesoría o cotización',
        ctaMessage: 'Hola Carlos, queremos evaluar una propuesta de Gastos Médicos Colectivos para el equipo de nuestra empresa.'
      }
    ],
    networkingTargets: [
      'Directores generales y fundadores de pymes en el Bajío.',
      'Contadores públicos y despachos fiscalistas aliados.',
      'Responsables de Recursos Humanos para prestaciones ejecutivas.'
    ],
    links: [
      {
        label: 'Agendar Asesoría de 25 Minutos',
        icon: 'calendar_month',
        url: 'https://calendly.com',
        category: 'Agenda'
      },
      {
        label: 'Guía de Deducciones Personales SAT (PDF)',
        icon: 'description',
        url: 'https://mendozapatrimonial.mx/guia-sat.pdf',
        category: 'Guía'
      },
      {
        label: 'Perfil LinkedIn Verificado',
        icon: 'open_in_new',
        url: 'https://linkedin.com/in/carlos-mendoza-patrimonial',
        category: 'Redes'
      }
    ],
    testimonials: [
      {
        name: 'Ing. Mauricio Carvajal',
        role: 'Director General',
        company: 'Carvajal Soluciones Industriales',
        comment: 'Carlos nos estructuró la póliza Hombre Clave con absoluta transparencia. Claridad técnica total y acompañamiento impecable.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    publicId: 'valeria-trevino',
    uid: 'MX-MTY-9014',
    published: true,
    name: 'Ing. Valeria Treviño Garza',
    shortName: 'Valeria Treviño',
    role: 'Directora de Transformación Digital & Operaciones',
    company: 'Grupo Innova Operaciones',
    logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
    city: 'Monterrey / CDMX',
    showLocation: false,
    locationMode: 'remoto',
    status: 'Disponible para vinculación',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto de Valeria Treviño Garza, líder ejecutiva de transformación digital',
    verified: true,
    themeKey: 'negocio',
    professionalProfile: 'ejecutivo_directivo',
    customFields: {
      department: 'Dirección de Transformación Digital & TI',
      leadershipScope: 'Coordinación de 4 divisiones operativas en México y Latam',
      liaisonTopics: 'Gobernanza de datos, arquitectura cloud y adopción de IA empresarial'
    },
    bannerTheme: 'from-emerald-950 via-teal-900 to-emerald-900',
    bannerImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+528189876543',
    whatsappCustomMessage: 'Hola Valeria, revisé tu tarjeta directiva y me gustaría conectar profesionalmente contigo.',
    email: 'valeria.trevino@innovagroup.mx',
    calendarUrl: 'https://calendly.com',
    directoryUrl: 'https://redconecta.mx/directorio/valeria-trevino',
    websiteUrl: 'https://innovagroup.mx',
    valueProp: 'Lidero la modernización de procesos críticos y la adopción de analítica para articular áreas de negocio y acelerar la agilidad directiva.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/valeria-trevino-tech',
      twitter: 'https://x.com/valtrevinotech',
      website: 'https://innovagroup.mx'
    },
    seoDescription: 'Directora de Transformación Digital y Operaciones con experiencia en modernización de arquitectura cloud y gobernanza corporativa.',
    seoKeywords: ['Transformación Digital', 'Operaciones', 'Gobernanza Cloud', 'Liderazgo Ejecutivo', 'Monterrey'],
    solutions: [
      {
        title: 'Modernización del Stack Operativo Regional',
        desc: 'Unificación de plataformas de gestión para 4 filiales corporativas.',
        problem: 'Sistemas legados aislados que provocaban demoras de hasta 5 días para consolidar reportes de balance directivo.',
        solution: 'Migración a arquitectura segura en la nube con pipelines de datos en tiempo real que redujeron la consolidación a minutos.',
        ctaText: 'Conversar sobre colaboración directiva',
        ctaMessage: 'Hola Valeria, vi tu iniciativa de modernización operativa y compartimos un reto similar en nuestra dirección.'
      },
      {
        title: 'Gobernanza de Datos & Adopción de IA',
        desc: 'Protocolos de seguridad, ética de datos y automatización para mandos medios.',
        problem: 'Equipos funcionales adoptando herramientas digitales dispersas sin control de ciberseguridad ni lineamientos claros.',
        solution: 'Diseño del marco de gobernanza corporativa y capacitación a más de 180 colaboradores para uso seguro de IA.',
        ctaText: 'Conversar sobre colaboración directiva',
        ctaMessage: 'Hola Valeria, me interesa conversar contigo sobre marcos de gobernanza y adopción de IA en organizaciones.'
      }
    ],
    networkingTargets: [
      'Directores generales y comités de transformación corporativa.',
      'Líderes de TI y ciberseguridad en corporativos medianos y grandes.',
      'Mentores y consejos consultivos de tecnología e innovación.'
    ],
    links: [
      {
        label: 'Perfil LinkedIn Verificado',
        icon: 'open_in_new',
        url: 'https://linkedin.com/in/valeria-trevino-tech',
        category: 'Redes'
      },
      {
        label: 'Artículo: Gobernanza en la era de la IA Empresarial',
        icon: 'menu_book',
        url: 'https://innovagroup.mx/insights/gobernanza-ia',
        category: 'Publicación'
      }
    ]
  },
  {
    publicId: 'dra-mariana-alvarez',
    uid: 'MX-QRO-5412',
    published: true,
    name: 'Dra. Mariana Álvarez Morales',
    shortName: 'Dra. Mariana Álvarez',
    role: 'Odontopediatría & Ortodoncia Preventiva',
    company: 'Clínica Dental Sonrisas QRO',
    logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&auto=format&fit=crop&q=80',
    city: 'Querétaro, Qro.',
    showLocation: true,
    locationMode: 'presencial',
    address: 'Hospital Ángeles Querétaro, Torre Médica II, Consultorio 410, Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Hospital+Angeles+Queretaro',
    status: 'Consultas con cita previa',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de la Dra. Mariana Álvarez Morales en su consultorio en Querétaro',
    verified: true,
    themeKey: 'personal',
    professionalProfile: 'salud',
    customFields: {
      medicalProfession: 'Odontología & Estomatología Infantil',
      medicalSpecialty: 'Odontopediatría y Ortopedia Maxilofacial Preventiva',
      licenseId: 'Céd. Prof. 8492019 • Esp. 1048291',
      institution: 'Universidad Nacional Autónoma de México (UNAM) • Hospital Ángeles QRO',
      bookingUrl: 'https://doctoralia.com.mx'
    },
    bannerTheme: 'from-stone-900 via-amber-950 to-orange-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+524429876543',
    whatsappCustomMessage: 'Hola Dra. Mariana, vi su tarjeta digital y me gustaría solicitar información general sobre una cita odontopediátrica.',
    email: 'citas@dramarianaalvarez.mx',
    calendarUrl: 'https://doctoralia.com.mx',
    directoryUrl: 'https://redconecta.mx/directorio/dra-mariana-alvarez',
    websiteUrl: 'https://dramarianaalvarez.mx',
    valueProp: 'Acompaño el desarrollo bucodental de niñas, niños y adolescentes con protocolos preventivos amigables y tecnología de mínima invasión.',
    socialLinks: {
      instagram: 'https://instagram.com/dramarianaalvarez.dent',
      website: 'https://dramarianaalvarez.mx'
    },
    seoDescription: 'Especialista en Odontopediatría y Ortodoncia Preventiva infantil en Hospital Ángeles Querétaro.',
    seoKeywords: ['Odontopediatría', 'Dentista Infantil', 'Querétaro', 'Hospital Ángeles', 'Ortodoncia Preventiva'],
    solutions: [
      {
        title: 'Manejo Preventivo de Desarrollo Maxilofacial',
        desc: 'Detección temprana de hábitos bucales y guía de erupción dental sin dolor.',
        problem: 'Pacientes en edad preescolar o primaria con respiración bucal, deglución atípica o falta de espacio para dientes permanentes.',
        solution: 'Intervención preventiva con aparatología funcional que guía el crecimiento armónico de los maxilares de forma no invasiva.',
        ctaText: 'Solicitar información de citas',
        ctaMessage: 'Hola Dra. Mariana, me interesa información sobre una valoración de desarrollo bucal para mi hijo/a.'
      },
      {
        title: 'Odontología Restaurativa Atraumática',
        desc: 'Tratamiento de caries temprana con técnicas respetuosas de mínima intervención.',
        problem: 'Niños con miedo al odontólogo o dolor dental por lesiones cariosas en molares primarios.',
        solution: 'Protocolos de odontología biológica sin anestesia invasiva siempre que el caso lo permite, priorizando el bienestar emocional del menor.',
        ctaText: 'Solicitar información de citas',
        ctaMessage: 'Hola Dra. Mariana, quisiera consultar horarios disponibles para una primera revisión dental infantil.'
      }
    ],
    networkingTargets: [
      'Pediatras y médicos familiares para interconsulta en Querétaro.',
      'Psicólogos infantiles y fonoaudiólogos para atención integral.',
      'Colegios y comités de salud escolar.'
    ],
    links: [
      {
        label: 'Agendar Cita en Doctoralia Oficial',
        icon: 'calendar_month',
        url: 'https://doctoralia.com.mx',
        category: 'Citas'
      },
      {
        label: 'Ubicación Consultorio Hospital Ángeles QRO',
        icon: 'store',
        url: 'https://maps.google.com/?q=Hospital+Angeles+Queretaro',
        category: 'Ubicación'
      },
      {
        label: 'Guía para la Primera Visita al Dentista (PDF)',
        icon: 'menu_book',
        url: 'https://dramarianaalvarez.mx/guia-primera-visita.pdf',
        category: 'Lectura'
      }
    ],
    testimonials: [
      {
        name: 'Mtra. Paulina Estrada',
        role: 'Mamá de Mateo (6 años)',
        company: 'Paciente Querétaro',
        comment: 'La paciencia y calidez de la Dra. Mariana cambiaron por completo la experiencia de mi hijo. Ahora va al dentista feliz y sin miedo.',
        stars: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    publicId: 'lic-arturo-villarreal',
    uid: 'MX-QRO-1102',
    published: true,
    name: 'Lic. Arturo Villarreal Peña',
    shortName: 'Arturo Villarreal',
    role: 'Coordinador General de Vinculación y Proyectos Estratégicos',
    company: 'Secretaría de Desarrollo e Innovación',
    logoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100&auto=format&fit=crop&q=80',
    city: 'Querétaro, Qro.',
    showLocation: true,
    locationMode: 'hibrido',
    address: 'Palacio de Gobierno del Estado, Centro Histórico, Querétaro, Qro.',
    googleMapsUrl: 'https://maps.google.com/?q=Palacio+de+Gobierno+Queretaro',
    status: 'Atención a proyectos estratégicos',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto de Arturo Villarreal Peña, Coordinador General de Vinculación',
    verified: true,
    themeKey: 'ejecutivo',
    professionalProfile: 'institucional_publico',
    customFields: {
      institutionName: 'Secretaría de Desarrollo Sustentable e Innovación',
      institutionalDepartment: 'Coordinación General de Vinculación y Proyectos Estratégicos',
      territorialScope: 'Estatal Querétaro y Corredor Bajío',
      publicLiaisonTopics: 'Alianzas cuatripartitas, fomento a pymes y centros públicos de investigación'
    },
    bannerTheme: 'from-slate-900 via-slate-800 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+524423456789',
    whatsappCustomMessage: 'Estimado Lic. Arturo Villarreal, le contacto a través de su tarjeta digital institucional para dar seguimiento a un tema de vinculación.',
    email: 'arturo.villarreal@innovacion.qro.gob.mx',
    calendarUrl: 'https://calendly.com',
    directoryUrl: 'https://redconecta.mx/directorio/arturo-villarreal',
    websiteUrl: 'https://queretaro.gob.mx',
    valueProp: 'Coordinamos alianzas estratégicas entre academia, cámaras empresariales y gobierno para impulsar proyectos de desarrollo y talento en Querétaro.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/arturo-villarreal-qro',
      twitter: 'https://x.com/arturovillarreal',
      website: 'https://queretaro.gob.mx'
    },
    seoDescription: 'Coordinación General de Vinculación y Proyectos Estratégicos en la Secretaría de Desarrollo e Innovación del Estado de Querétaro.',
    seoKeywords: ['Gobierno de Querétaro', 'Vinculación Institucional', 'Proyectos Estratégicos', 'Desarrollo Económico', 'Alianzas'],
    solutions: [
      {
        title: 'Mesa de Vinculación Cuatripartita de Innovación',
        desc: 'Articulación de proyectos de investigación aplicada con la industria manufacturera.',
        problem: 'Centros de investigación con desarrollos de alta tecnología que no lograban transferencia oportuna a las cadenas locales.',
        solution: 'Instalación de la mesa permanente de proyectos estratégicos con 12 convenios de transferencia activa concretados este año.',
        ctaText: 'Contactar al área responsable',
        ctaMessage: 'Estimado Lic. Villarreal, nos interesa presentar un proyecto institucional para la mesa de vinculación.'
      },
      {
        title: 'Programa de Fortalecimiento a Proveedores Locales',
        desc: 'Canalización a certificaciones y cadenas de suministro globales en Querétaro.',
        problem: 'Pymes queretanas con capacidad técnica que requerían apoyo institucional para integrarse al sector aeroespacial y automotriz.',
        solution: 'Convocatoria y acompañamiento institucional que incorporó a 34 empresas queretanas al padrón de proveeduría de primer nivel.',
        ctaText: 'Contactar al área responsable',
        ctaMessage: 'Estimado Lic. Villarreal, solicitamos información sobre el programa de fortalecimiento de proveeduría local.'
      }
    ],
    networkingTargets: [
      'Líderes de cámaras industriales (CANACINTRA, COPARMEX, Caintra).',
      'Rectores de universidades politécnicas y directores de centros CIATEQ, CIDESI.',
      'Organismos multilaterales y fondos de cooperación para el desarrollo sustentable.'
    ],
    links: [
      {
        label: 'Portal Oficial Gobierno del Estado',
        icon: 'domain',
        url: 'https://queretaro.gob.mx',
        category: 'Institucional'
      },
      {
        label: 'Directorio de Programas de Fomento a la Innovación',
        icon: 'menu_book',
        url: 'https://queretaro.gob.mx/innovacion',
        category: 'Programas'
      },
      {
        label: 'Perfil Oficial LinkedIn',
        icon: 'open_in_new',
        url: 'https://linkedin.com/in/arturo-villarreal-qro',
        category: 'Redes'
      }
    ]
  }
];

export function getProfileById(idOrPublicId: string): ParticipantProfile | undefined {
  return INITIAL_PROFILES.find(
    (p) => p.publicId.toLowerCase() === idOrPublicId.toLowerCase() || p.uid.toLowerCase() === idOrPublicId.toLowerCase()
  );
}
