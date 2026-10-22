import { ParticipantProfile } from '../types/card';

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
    status: 'Disponible para networking',
    statusActive: true,
    avatarUrl: 'https://iaconkris.com/pics/S1.jpeg',
    avatarAlt: 'Foto profesional de Sara Sazedi',
    verified: true,
    themeKey: 'ejecutivo',
    bannerTheme: 'from-slate-900 via-slate-800 to-slate-950',
    bannerImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    customPrimaryColor: '#00685f',
    phone: '+525512345678',
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
    solutions: [
      {
        title: 'Desarrollo de Alianzas Comerciales',
        desc: 'Estructuración de convenios y canales de distribución de alto impacto.'
      },
      {
        title: 'Consultoría en Crecimiento de Negocios',
        desc: 'Optimización de propuesta comercial y posicionamiento en el mercado mexicano.'
      },
      {
        title: 'Mentoría Ejecutiva para Emprendedores',
        desc: 'Acompañamiento 1 a 1 para toma de decisiones y expansión.'
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
    ]
  },
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
    status: 'Disponible para asesorías',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto profesional de la Mtra. Sofía Valenzuela Cárdenas, consultora en estrategia fiscal en CDMX',
    verified: true,
    themeKey: 'ejecutivo',
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
        desc: 'Auditoría integral ante SAT para blindar operaciones, deducciones y cumplimiento.'
      },
      {
        title: 'Protocolos de Sucesión Familiar',
        desc: 'Reglas claras de gobernanza para transiciones generacionales sin fricción patrimonial.'
      },
      {
        title: 'Reestructuración Societaria',
        desc: 'Modelos de holdings patrimoniales eficientes y 100% en regla con leyes mexicanas.'
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
    status: 'Tomando proyectos Q3/Q4',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto de Mateo Arrambide Luján en taller de mobiliario artesanal en Guadalajara',
    verified: false,
    themeKey: 'negocio',
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
        desc: 'Fabricación de alto uso con maderas mexicanas certificadas y metales nobles.'
      },
      {
        title: 'Sistemas Lumínicos Escultóricos',
        desc: 'Lámparas monumentales diseñadas específicamente para lobbies, bares y restaurantes.'
      },
      {
        title: 'Desarrollo de Mobiliario a Medida',
        desc: 'Colaboración directa con despachos de arquitectura e interiorismo de toda la república.'
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
    status: 'En evento presencial',
    statusActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    avatarAlt: 'Foto del Ing. Cuauhtémoc González-Álvarez, director de automatización en Monterrey',
    verified: true,
    themeKey: 'personal',
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
        desc: 'Integración de AGVs y bandas clasificadoras con 99.8% de disponibilidad operativa.'
      },
      {
        title: 'Reducción de Merma y Tiempos de Picking',
        desc: 'Optimización matemática de rutas en bodega con algoritmos de analítica local.'
      },
      {
        title: 'Consultoría de Nearshoring Logístico',
        desc: 'Adecuación operativa de almacenes para proveeduría automotriz, médica y aeroespacial.'
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
    ]
  }
];

export function getProfileById(idOrPublicId: string): ParticipantProfile | undefined {
  return INITIAL_PROFILES.find(
    (p) => p.publicId.toLowerCase() === idOrPublicId.toLowerCase() || p.uid.toLowerCase() === idOrPublicId.toLowerCase()
  );
}
