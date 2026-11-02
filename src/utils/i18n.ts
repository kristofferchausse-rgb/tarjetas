import { CardSolution, CardLink, CardTestimonial, NetworkingTargetItem } from '../types/card';

export type CardLanguage = 'es' | 'en';

export const CARD_TRANSLATIONS = {
  es: {
    langName: 'Español (MX)',
    langShort: 'ES',
    saveContact: 'Guardar Contacto',
    saveVCard: 'Guardar vCard',
    chatWhatsapp: 'Escríbeme por WhatsApp',
    call: 'Llamar',
    email: 'Correo',
    schedule: 'Agendar',
    socialChannels: 'Redes & Canales',
    verifiedProfiles: 'Perfiles Verificados',
    valuePropLabel: 'A quién ayudo y con qué:',
    solutionsLabel: '¿Cómo ayudamos & resolvemos?',
    solutionsSubtitle: 'Casos reales de transformación y resultados',
    howWeHelpQuestion: '¿Cómo ayudamos?',
    howItWasSolvedQuestion: '¿Cómo se resolvió?',
    similarNeedQuestion: '¿Tienes una necesidad similar?',
    similarNeedBtn: 'Resolver necesidad similar',
    locationPhysical: 'Ubicación física',
    locationRemote: 'Servicio en línea / Cobertura nacional',
    getDirections: 'Cómo llegar',
    networkingLabel: 'Con quién me interesa conectar',
    featuredLinksLabel: 'Enlaces seleccionados',
    connectLeadBtn: 'Conectar & Compartir mis Datos con',
    designedBy: 'Diseñado por',
    promoQuestion: '¿Quieres una Tarjeta Digital Ejecutiva como esta para tu marca o empresa?',
    promoBtn: 'Solicitar mi Tarjeta vía WhatsApp',
    verifiedCardText: 'Tribu Creativa QRO • Tarjetas Digitales Profesionales',
    verifiedCardId: 'Tarjeta Digital Verificada • ID:',
    shareCardTitle: 'Compartir tarjeta con resumen y preview en WhatsApp',
    shareQrTitle: 'Compartir QR de la tarjeta',
    tapToPlay: 'Toca para reproducir presentación',
    introPitch: 'Intro Video Pitch',
    statusMap: {
      'Disponible para networking': 'Disponible para networking',
      'Disponible para conectar': 'Disponible para conectar',
      'Disponible para asesorías': 'Disponible para asesorías',
      'Disponible': 'Disponible',
      'Proyectos por agenda': 'Proyectos por agenda',
      'Visitas con cita previa': 'Visitas con cita previa',
      'Fechas por confirmar': 'Fechas por confirmar',
      'Abierta a colaboración': 'Abierta a colaboración',
      'Consultas con cita previa': 'Consultas con cita previa',
      'Vinculación con cita': 'Vinculación con cita'
    } as Record<string, string>,
    categories: {
      Agenda: 'Agenda',
      Redes: 'Redes',
      Contacto: 'Contacto',
      Proceso: 'Proceso',
      Recurso: 'Recurso',
      Portafolio: 'Portafolio',
      Proyecto: 'Proyecto',
      Entregable: 'Entregable',
      Evidencia: 'Evidencia',
      Documento: 'Documento',
      Ficha: 'Ficha',
      Catálogo: 'Catálogo',
      Otro: 'Otro'
    } as Record<string, string>,
    // Lead Capture Modal
    leadTitle: 'Conectar Directamente',
    leadSubtitle: 'Envía tus datos de contacto para coordinar una reunión o conversación profesional.',
    leadNameLabel: 'Tu Nombre Completo *',
    leadNamePlaceholder: 'Ej. Lic. Roberto Gómez',
    leadPhoneLabel: 'Teléfono o WhatsApp *',
    leadPhonePlaceholder: '+52 55 1234 5678',
    leadCompanyLabel: 'Tu Empresa o Cargo (Opcional)',
    leadCompanyPlaceholder: 'Ej. Grupo Innovador MX',
    leadMsgLabel: 'Mensaje o Tema de Interés (Opcional)',
    leadMsgPlaceholder: '¿En qué tema te gustaría que conversemos?',
    leadSubmitBtn: 'Enviar por WhatsApp',
    leadSuccessTitle: '¡Datos listos!',
    leadSuccessMsg: 'Te redirigiremos a WhatsApp para enviar el mensaje con tus datos adjuntos.',
    leadContinueBtn: 'Abrir Chat de WhatsApp',
    leadClose: 'Cerrar'
  },
  en: {
    langName: 'US English',
    langShort: 'EN',
    saveContact: 'Save Contact',
    saveVCard: 'Save vCard',
    chatWhatsapp: 'Chat on WhatsApp',
    call: 'Call',
    email: 'Email',
    schedule: 'Schedule',
    socialChannels: 'Social & Channels',
    verifiedProfiles: 'Verified Profiles',
    valuePropLabel: 'Who I help and how:',
    solutionsLabel: 'How we help & solve challenges',
    solutionsSubtitle: 'Real case studies & proven results',
    howWeHelpQuestion: 'How we help',
    howItWasSolvedQuestion: 'How it was solved',
    similarNeedQuestion: 'Have a similar challenge?',
    similarNeedBtn: 'Solve a similar need',
    locationPhysical: 'Physical location',
    locationRemote: 'Online service / Nationwide',
    getDirections: 'Get directions',
    networkingLabel: 'Who I want to connect with',
    featuredLinksLabel: 'Featured links',
    connectLeadBtn: 'Connect & Share my Details with',
    designedBy: 'Designed by',
    promoQuestion: 'Want a High-Converting Executive Digital Card like this for your brand?',
    promoBtn: 'Request my Card on WhatsApp',
    verifiedCardText: 'Tribu Creativa QRO • Professional Digital Cards',
    verifiedCardId: 'Verified Digital Card • ID:',
    shareCardTitle: 'Share card with summary on WhatsApp',
    shareQrTitle: 'Share card QR code',
    tapToPlay: 'Tap to play video presentation',
    introPitch: 'Intro Video Pitch',
    statusMap: {
      'Disponible para networking': 'Available for networking',
      'Disponible para conectar': 'Available to connect',
      'Disponible para asesorías': 'Available for consulting',
      'Disponible': 'Available',
      'Proyectos por agenda': 'Projects by schedule',
      'Visitas con cita previa': 'Visits by appointment',
      'Fechas por confirmar': 'Dates to be confirmed',
      'Abierta a colaboración': 'Open to collaboration',
      'Consultas con cita previa': 'Consultations by appointment',
      'Vinculación con cita': 'Partnerships by appointment'
    } as Record<string, string>,
    categories: {
      Agenda: 'Schedule',
      Redes: 'Social',
      Contacto: 'Contact',
      Proceso: 'Process',
      Recurso: 'Resource',
      Portafolio: 'Portfolio',
      Proyecto: 'Project',
      Entregable: 'Deliverable',
      Evidencia: 'Evidence',
      Documento: 'Document',
      Ficha: 'Factsheet',
      Catálogo: 'Catalog',
      Otro: 'Other'
    } as Record<string, string>,
    // Lead Capture Modal
    leadTitle: 'Direct Connection',
    leadSubtitle: 'Share your professional details to schedule a call or start a conversation.',
    leadNameLabel: 'Your Full Name *',
    leadNamePlaceholder: 'e.g., Robert Gomez',
    leadPhoneLabel: 'Phone or WhatsApp *',
    leadPhonePlaceholder: '+1 555 123 4567',
    leadCompanyLabel: 'Your Company or Role (Optional)',
    leadCompanyPlaceholder: 'e.g., Innovative Group',
    leadMsgLabel: 'Message or Topic of Interest (Optional)',
    leadMsgPlaceholder: 'What project or collaboration would you like to discuss?',
    leadSubmitBtn: 'Send via WhatsApp',
    leadSuccessTitle: 'Ready to send!',
    leadSuccessMsg: 'Redirecting you to WhatsApp to send your details directly.',
    leadContinueBtn: 'Open WhatsApp Chat',
    leadClose: 'Close'
  }
};

export interface ProfileTranslation {
  role?: string;
  company?: string;
  city?: string;
  valueProp?: string;
  status?: string;
  primaryActionLabel?: string;
  whatsappCustomMessage?: string;
  introVideoTitle?: string;
  customFields?: Record<string, string>;
  solutions?: CardSolution[];
  networkingTargets?: (string | NetworkingTargetItem)[];
  links?: CardLink[];
  testimonials?: CardTestimonial[];
}

/**
 * Built-in role and content translations for common executive roles and sample profiles
 */
export const SAMPLE_PROFILE_TRANSLATIONS: Record<string, ProfileTranslation> = {
  // =========================================================================
  // DEMO ARCHETYPE A: Clara Navarro (Organización de Equipos)
  // =========================================================================
  'demo-clara-navarro': {
    role: 'Consultant in Team Organization & Employee Development',
    company: 'Navarro Organizational Development',
    city: 'Santiago de Querétaro, Mexico',
    valueProp:
      'I help small business owners organize team responsibilities, onboard new collaborators, and maintain working agreements. We implement simple processes so teams know how to execute and leadership can focus on what truly requires their attention.',
    status: 'Projects by schedule',
    primaryActionLabel: 'Discuss my team',
    whatsappCustomMessage:
      "Hello Clara, I saw your digital card and would like to discuss how to better organize my team's responsibilities and workflows.",
    introVideoTitle: 'Organizing teamwork so your company can move forward',
    customFields: {
      specialty: 'Work organization, onboarding of new hires, and operational follow-up agreements.',
      clientType: "Small business owners and leaders looking to bring clarity to their team's daily operations.",
      serviceScope: 'Situation review, responsibility agreements, and an execution roadmap tailored to business needs.'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'When Every Decision Ends Up on Your Desk',
        desc: 'Reviewing work distribution to eliminate bottlenecks and clarify decision criteria.',
        problem: 'Tasks stall with uncertainty, multiple people handle the same issue, or projects stop waiting for your personal approval.',
        intervention: 'We analyze how work flows, pinpoint dependency bottlenecks, and establish clear responsibilities and decision authority.',
        scope: 'Responsibility matrix, operational agreements, and a staged rollout plan tailored to your team.',
        solution: 'Every team member understands their ownership, and leadership only steps in where executive intervention is genuinely required.',
        ctaText: 'Streamline responsibilities',
        ctaMessage:
          'Hello Clara, I relate to the issue of decisions piling up on leadership. I would like to explore how your advisory applies to my team.',
        evidenceUrl: 'https://navarroorganizacional.mx/recursos/muestra-mapa-responsabilidades',
        evidenceLabel: 'Sample responsibility matrix (anonymized)'
      },
      {
        type: 'solucion',
        title: 'Structured Onboarding That Brings Clarity from Day One',
        desc: 'Structuring the induction process so new hires gain autonomy and confidence immediately.',
        problem: 'A new hire arrives with no clear roadmap to understand their role, tools, contacts, and performance expectations.',
        intervention: 'We define core learning milestones, designate mentors, and establish early check-in reviews.',
        scope: 'Role-specific onboarding roadmap and support materials with designated review checkpoints.',
        solution: 'Enable seamless, organized ramp-up and eliminate reliance on improvised explanations.',
        ctaText: 'Design an onboarding process',
        ctaMessage:
          'Hello Clara, I would like to learn about your service for organizing new employee onboarding and setting clear expectations.',
        evidenceUrl: 'https://navarroorganizacional.mx/recursos/guia-onboarding-ejemplo',
        evidenceLabel: 'Sample onboarding roadmap & role guide'
      },
      {
        type: 'solucion',
        title: 'Turning Meetings into Actionable Agreements',
        desc: 'Helping teams translate discussions into sustainable action plans with visible follow-up routines.',
        problem: 'Challenges are discussed in meetings, but commitments are left without clear owners, deadlines, or accountability checks.',
        intervention: 'We help the team translate discussions into tangible action items and institute an operational review rhythm they can maintain.',
        scope: 'Accountability template, ownership structure, and a practical follow-up routine suited to the team.',
        solution: 'Ensure follow-through on key agreements and bring pending tasks into focus before they turn into emergencies.',
        ctaText: 'Improve our agreements',
        ctaMessage:
          'Hello Clara, I am interested in improving how my team converts meetings and discussions into accountable follow-up.',
        evidenceUrl: 'https://navarroorganizacional.mx/recursos/formato-acuerdos-muestra',
        evidenceLabel: 'Sample team agreement template (client data omitted)'
      }
    ],
    networkingTargets: [
      {
        target: 'Accounting firms and business consultants advising SMEs',
        purpose: 'Complement their financial or legal advisory when team organization and workflow issues arise.',
        contribution: 'Provide practical tools for team responsibilities, onboarding, and operational follow-up within a coordinated scope.'
      },
      {
        target: 'HR and talent development leads in growing companies',
        purpose: 'Collaborate on initiatives requiring practical, operations-ready tools and methodologies.',
        contribution: 'Translate identified organizational gaps into clear workflows and actionable resources for the team.'
      },
      {
        target: 'Business communities and executive training organizers',
        purpose: 'Bring practical organizational frameworks to entrepreneurs and small business leaders.',
        contribution: 'Share real-world exercises, case studies, and actionable insights on team coordination.'
      }
    ],
    links: [
      {
        label: 'How We Work Together',
        url: 'https://navarroorganizacional.mx/proceso',
        icon: 'route',
        category: 'Proceso'
      },
      {
        label: 'Sample Onboarding Roadmap',
        url: 'https://navarroorganizacional.mx/muestra-incorporacion',
        icon: 'description',
        category: 'Recurso'
      },
      {
        label: 'Team Agreement Template',
        url: 'https://navarroorganizacional.mx/muestra-acuerdos',
        icon: 'file',
        category: 'Recurso'
      },
      {
        label: 'Responsibility Matrix Guide',
        url: 'https://navarroorganizacional.mx/muestra-responsabilidades',
        icon: 'layers',
        category: 'Recurso'
      }
    ],
    testimonials: [
      {
        name: 'Irais Moncada',
        role: 'Business Owner & Client',
        company: 'Consultoría & Servicios',
        comment:
          'Clara has been a key pillar for our business. Thanks to her structured methodology, our team gained immense clarity, eliminated operational bottlenecks, and achieved a collaborative rhythm we had never experienced before. Highly recommended!',
        stars: 5,
        sourceType: 'facebook',
        sourceUrl:
          'https://www.facebook.com/irais.moncada/posts/pfbid0364DQztrWD9c5y1XsaRFzhTpCquxCvfoMVjow1dKSkAVGQh5xM5GSykBasvs5G1Z6l',
        evidenceImageUrl: '/evidence/review-facebook-clara.png',
        evidenceLabel: 'View original Facebook post',
        date: 'December 14, 2022'
      },
      {
        name: 'Luisa Fernanda Arias Cuéllar',
        role: 'Director of Operations',
        company: 'Alianza Corporativa',
        comment:
          'Working with Clara transformed our organizational clarity. Her ability to pinpoint team dynamics, set pragmatic milestones, and align diverse talents is exceptional. A true partner for any company looking to scale sustainably.',
        stars: 5,
        sourceType: 'linkedin',
        sourceUrl:
          'https://www.linkedin.com/in/alexander-evr/details/recommendations/?detailScreenTabIndex=2',
        evidenceImageUrl: '/evidence/review-linkedin-luisa.png',
        evidenceLabel: 'View recommendation on LinkedIn',
        date: 'August 19, 2024'
      }
    ]
  },

  // =========================================================================
  // DEMO ARCHETYPE B: Diego Salas (Asesor Inmobiliario)
  // =========================================================================
  'demo-diego-salas': {
    role: 'Real Estate Advisor for Residential & Commercial Spaces',
    company: 'Salas Real Estate Spaces',
    city: 'Santiago de Querétaro, Mexico',
    valueProp:
      'I guide you in defining what you need from a home or commercial space and reviewing options tailored to your situation. We work with clear criteria so you can compare, ask the right questions, and decide with confidence.',
    status: 'Visits by appointment',
    primaryActionLabel: 'Guide my property search',
    whatsappCustomMessage:
      "Hello Diego, I saw your card and would like to discuss a residential or commercial space. I'd like to define the search criteria for my project.",
    introVideoTitle: 'First your criteria; then the options',
    customFields: {
      sector: 'Real estate advisory for residential and commercial spaces.',
      territory: 'Querétaro and metropolitan area, subject to verified inventory.',
      solutionLines:
        'Home buying/renting, business spaces, and initial consultation for property owners looking to market their property.'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'A Home That Fits Your Next Stage',
        desc: 'Search guidance based on location and lifestyle criteria before booking visits.',
        problem: 'You see countless listings, but have no certainty on which ones truly meet your location, commute, and lifestyle requirements.',
        intervention: 'We pinpoint your search criteria and pre-screen available alternatives before organizing physical tours.',
        scope: 'Selection criteria, verified property data, and smooth coordination of next steps.',
        solution: 'Focus your time on viable options and clarify essential questions before committing.',
        ctaText: 'Review my home search',
        ctaMessage:
          'Hello Diego, I want to guide my home search with clear criteria regarding location, space, and budget.',
        evidenceUrl: 'https://salasespacios.mx/catalogo-vivienda',
        evidenceLabel: 'Verified property factsheets in Querétaro'
      },
      {
        type: 'solucion',
        title: 'A Commercial Space Tailored to Your Business Model',
        desc: 'Evaluating commercial premises based on customer footfall, parking, and operational permits.',
        problem: 'Finding a business location without knowing if the zoning, access, or foot traffic align with your concept.',
        intervention: 'We analyze customer profiles, access logistics, and technical space needs to identify viable commercial spots.',
        scope: 'Commercial evaluation summary and verified options meeting regulatory prerequisites.',
        solution: 'Minimize operational and financial risks before signing commercial leases.',
        ctaText: 'Evaluate commercial spaces',
        ctaMessage:
          'Hello Diego, I am looking for a commercial space for my business and want to review viable locations.',
        evidenceUrl: 'https://salasespacios.mx/catalogo-comercial',
        evidenceLabel: 'Sample commercial evaluation sheet'
      },
      {
        type: 'solucion',
        title: 'Clear Criteria for Marketing Your Property',
        desc: 'Objective pricing and marketing criteria for property owners.',
        problem: 'Uncertainty on market pricing, paperwork requirements, or screening prospective buyers.',
        intervention: 'We perform a comparative market valuation and establish clear guidelines for qualified buyers.',
        scope: 'Valuation report, documentation checklist, and commercial strategy.',
        solution: 'A transparent, orderly marketing process without wasted time or unexpected surprises.',
        ctaText: 'Consult property valuation',
        ctaMessage:
          'Hello Diego, I own a property in Querétaro and want an objective market orientation to sell or rent it.',
        evidenceUrl: 'https://salasespacios.mx/guia-propietarios',
        evidenceLabel: 'Property preparation checklist'
      }
    ],
    networkingTargets: [
      {
        target: 'Notaries and mortgage brokers in Querétaro',
        purpose: 'Streamline title deeds and credit processing for verified clients.',
        contribution: 'Provide thorough documentation and buyers with pre-qualified budgets.'
      },
      {
        target: 'Architects and interior design studios',
        purpose: 'Refer clients seeking remodeling or custom adjustments.',
        contribution: 'Connect buyers ready for architectural adaptation projects.'
      },
      {
        target: 'Corporate HR coordinators relocating executives',
        purpose: 'Assist incoming executives in finding executive housing.',
        contribution: 'Curated, vetted executive inventory with rapid onboarding.'
      }
    ],
    links: [
      {
        label: 'Available Residential Listings',
        url: 'https://salasespacios.mx/catalogo-vivienda',
        icon: 'domain',
        category: 'Catálogo'
      },
      {
        label: 'Commercial Spaces Overview',
        url: 'https://salasespacios.mx/catalogo-comercial',
        icon: 'briefcase',
        category: 'Catálogo'
      },
      {
        label: 'Property Owner Guidance Guide',
        url: 'https://salasespacios.mx/guia-propietarios',
        icon: 'description',
        category: 'Recurso'
      }
    ]
  },

  // =========================================================================
  // DEMO ARCHETYPE C: Renata Vidal (Alimentos & Encuentros de Equipo)
  // =========================================================================
  'demo-renata-vidal': {
    role: 'Catering & Food Coordinator for Team Meetings & Corporate Gatherings',
    company: 'Mesa Clara',
    city: 'Santiago de Querétaro, Mexico',
    valueProp:
      'I design fresh, practical food proposals for team meetings, executive workshops, and business gatherings. Clear menus, reliable timing, and food that elevates the conversation without logistical stress.',
    status: 'Dates to be confirmed',
    primaryActionLabel: 'Quote catering for my event',
    whatsappCustomMessage:
      'Hello Renata, I am planning a meeting and would like to review food options. I can share the date, venue, and estimated guest count.',
    introVideoTitle: 'Food that fosters connection in your meetings',
    customFields: {
      category: 'Fresh catering and culinary coordination for business and private gatherings.',
      serviceZone: 'Querétaro metropolitan area (Juriquilla, Centro, Álamos, El Campanario).'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Workshops & Team Sessions: Food That Energizes',
        desc: 'Fresh, non-heavy catering formats designed for active working sessions.',
        problem: 'Catering is either too formal and slow, or heavy food that induces drowsiness during afternoon strategy sessions.',
        intervention: 'We structure energizing, easy-to-eat menus with fresh seasonal ingredients and continuous beverage stations.',
        scope: 'Turnkey culinary setup, dietary accommodations, and scheduled delivery.',
        solution: 'Keep participants focused and engaged without logistical interruptions.',
        ctaText: 'Plan workshop catering',
        ctaMessage:
          'Hello Renata, we are hosting a strategy session and need food options that keep the team energized.',
        evidenceUrl: 'https://mesaclara.mx/menu-jornadas',
        evidenceLabel: 'Sample corporate workshop menu'
      },
      {
        type: 'solucion',
        title: 'Executive Board Breakfasts & Luncheons',
        desc: 'Discreet, high-touch service for confidential board meetings.',
        problem: 'High-stakes executive meetings require punctual, seamless service with zero disruption.',
        intervention: 'Curated gourmet individual plating, quiet service protocol, and dietary personalization.',
        scope: 'Full setup, tableware, discreet service, and prompt breakdown.',
        solution: 'Executive-level hospitality that lets directors focus 100% on their agenda.',
        ctaText: 'Coordinate executive lunch',
        ctaMessage:
          'Hello Renata, I need executive breakfast/lunch catering for a leadership board meeting.',
        evidenceUrl: 'https://mesaclara.mx/experiencias-mesa',
        evidenceLabel: 'Executive hospitality portfolio'
      },
      {
        type: 'solucion',
        title: 'Celebrations & Milestones: Memorable Grazing Tables',
        desc: 'Artisanal cheese boards, savory bites, and dessert stations for milestone events.',
        problem: 'Standard buffets lack aesthetic appeal and cause long waiting lines.',
        intervention: 'Interactive grazing tables and passed hors d\'oeuvres that encourage spontaneous networking.',
        scope: 'Artisanal styling, floral accents, complete dietary labeling, and service support.',
        solution: 'A visually stunning social focal point that elevates the celebration.',
        ctaText: 'Design a grazing table',
        ctaMessage:
          'Hello Renata, we are celebrating a company milestone and want to explore grazing table concepts.',
        evidenceUrl: 'https://mesaclara.mx/galeria-mesas',
        evidenceLabel: 'Grazing table visual gallery'
      }
    ],
    networkingTargets: [
      {
        target: 'Corporate event planners & executive assistants in Querétaro',
        purpose: 'Provide a reliable, elevated food partner for recurring business sessions.',
        contribution: 'Punctual, aesthetically curated setups with zero operational oversight needed.'
      },
      {
        target: 'Boutique venues, coworking spaces, and executive retreats',
        purpose: 'Establish preferred culinary partnerships for visiting corporate groups.',
        contribution: 'Turnkey culinary execution customized to space constraints and venue guidelines.'
      }
    ],
    links: [
      {
        label: 'Catering Formats & Menus',
        url: 'https://mesaclara.mx/formatos',
        icon: 'menu_book',
        category: 'Catálogo'
      },
      {
        label: 'Visual Portfolio & Setups',
        url: 'https://mesaclara.mx/galeria',
        icon: 'photo_library',
        category: 'Portafolio'
      }
    ]
  },

  // =========================================================================
  // DEMO ARCHETYPE D: Jorge Herrera (Servicios Industriales)
  // =========================================================================
  'demo-jorge-herrera': {
    role: 'Director of Technical Services & Industrial Project Coordination',
    company: 'Nexo Operativo',
    city: 'Santiago de Querétaro, Mexico',
    valueProp:
      'We deliver specialized technical maintenance, mechanical fabrication, and operational support for industrial plants in Bajío. Rapid response, verified safety standards, and reliable technical execution.',
    status: 'Projects by schedule',
    primaryActionLabel: 'Request technical assessment',
    whatsappCustomMessage:
      "Hello Jorge, I reviewed Nexo Operativo's profile and would like to discuss an operational need at our plant.",
    introVideoTitle: 'Industrial precision and operational continuity',
    customFields: {
      sectorsServed: 'Automotive tier-2, aerospace tooling, food packaging, and industrial logistics.',
      coverage: 'Querétaro, San Juan del Río, Celaya, and Bajío industrial corridor.'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Preventive Overhaul & Machinery Calibration',
        desc: 'Scheduled mechanical adjustments and preventive maintenance to prevent unplanned downtime.',
        problem: 'Unexpected production stoppages caused by wear and tear on critical conveyor or machining lines.',
        intervention: 'Comprehensive diagnostic audits, vibration testing, and scheduled component replacements.',
        scope: 'Detailed technical report, parts traceability, and signed inspection checklists.',
        solution: 'Maximize machine availability and extend equipment lifecycle safely.',
        ctaText: 'Schedule technical maintenance',
        ctaMessage:
          'Hello Jorge, I would like to schedule a preventive maintenance inspection for our equipment.',
        evidenceUrl: 'https://nexooperativo.mx/alcance-servicios',
        evidenceLabel: 'Sample technical maintenance audit'
      },
      {
        type: 'solucion',
        title: 'Custom Tooling & Precision Machining',
        desc: 'Rapid-turnaround fabrication of replacement parts and custom tooling fixtures.',
        problem: 'Imported spare parts take weeks to arrive, stalling assembly lines.',
        intervention: 'Reverse engineering, CNC machining, and heat treatment with tight dimensional tolerances.',
        scope: 'Fabricated parts with dimensional inspection certificates and material hardness reports.',
        solution: 'Eliminate foreign supply bottlenecks with local precision manufacturing.',
        ctaText: 'Quote precision parts',
        ctaMessage:
          'Hello Jorge, we need emergency custom machining for specialized plant components.',
        evidenceUrl: 'https://nexooperativo.mx/capacidades-taller',
        evidenceLabel: 'Machining tolerance specifications'
      },
      {
        type: 'solucion',
        title: 'Plant Line Relocation & Equipment Installation',
        desc: 'Safe disassembly, transport, rigging, and mechanical leveling of industrial lines.',
        problem: 'Relocating or adding production equipment without disrupting adjoining operations.',
        intervention: 'Turnkey rigging logistics, structural anchorages, laser leveling, and mechanical hookups.',
        scope: 'Safety work permits (DC-3), civil liability coverage, and commissioning verification.',
        solution: 'Safe, punctual equipment startup meeting strict industrial safety standards.',
        ctaText: 'Quote equipment relocation',
        ctaMessage:
          'Hello Jorge, we have an upcoming equipment relocation and need technical rigging support.',
        evidenceUrl: 'https://nexooperativo.mx/seguridad-industrial',
        evidenceLabel: 'Industrial rigging safety protocols'
      }
    ],
    networkingTargets: [
      {
        target: 'Plant Managers and Maintenance Directors in Bajío Industrial Parks',
        purpose: 'Establish preventive and emergency maintenance support agreements.',
        contribution: 'Rapid on-site response, certified technicians (DC-3), and audited safety protocols.'
      },
      {
        target: 'Industrial equipment integrators & machinery distributors',
        purpose: 'Serve as local installation, warranty, and field servicing partners.',
        contribution: 'Mechanical fabrication workshop, rigging equipment, and certified local teams.'
      }
    ],
    links: [
      {
        label: 'Industrial Technical Capabilities',
        url: 'https://nexooperativo.mx/capacidades',
        icon: 'briefcase',
        category: 'Portafolio'
      },
      {
        label: 'Safety Protocols & Certifications',
        url: 'https://nexooperativo.mx/seguridad',
        icon: 'description',
        category: 'Recurso'
      }
    ]
  },

  // =========================================================================
  // DEMO ARCHETYPE E: Adriana Torres (Operaciones Manufactura)
  // =========================================================================
  'demo-adriana-torres': {
    role: 'Director of Operations & Capability Development',
    company: 'Horizonte Manufactura',
    city: 'Santiago de Querétaro, Mexico',
    valueProp:
      'I lead manufacturing operations, supply chain resilience, and workforce capability development. Aligning leadership, engineering, and plant floor culture to achieve sustainable operational excellence.',
    status: 'Open to collaboration',
    primaryActionLabel: 'Explore executive collaboration',
    whatsappCustomMessage:
      'Hello Adriana, I reviewed your executive profile and would like to propose a conversation regarding operations, talent capabilities, or industrial partnerships.',
    introVideoTitle: 'Operational resilience and human-centered leadership',
    customFields: {
      department: 'Plant Operations, Supply Chain & Talent Capability Strategy.',
      leadershipScope: 'Regional manufacturing facilities with 450+ team members and lean certification programs.'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Lean Culture Transformation & Waste Elimination',
        desc: 'Empowering shop-floor operators with continuous improvement frameworks.',
        problem: 'Operational KPIs plateaued; front-line teams lack structured methods to address recurring bottlenecks.',
        intervention: 'Standardized 5S routines, visual management boards, and gemba walk coaching for supervisors.',
        scope: 'Operational playbook, training modules, and measurable scrap-reduction metrics.',
        solution: 'A sustainable culture of operational ownership and measurable quality improvements.',
        ctaText: 'Discuss operational excellence',
        ctaMessage:
          'Hello Adriana, I would like to discuss lean manufacturing and operational culture transformation.',
        evidenceUrl: 'https://horizontemanufactura.mx/cultura-operativa',
        evidenceLabel: 'Lean operational framework summary'
      },
      {
        type: 'solucion',
        title: 'Supply Chain Localization & Supplier Development',
        desc: 'Building regional supplier networks to mitigate global freight risks.',
        problem: 'Vulnerability to international shipping delays and currency volatility for key raw materials.',
        intervention: 'Supplier audits, technical capability uplift, and regional dual-sourcing roadmaps.',
        scope: 'Supplier qualification matrix, quality assurance protocols, and delivery SLAs.',
        solution: 'Shorter lead times, lower inventory carrying costs, and robust regional resilience.',
        ctaText: 'Explore supplier development',
        ctaMessage:
          'Hello Adriana, I am interested in collaborating on regional supplier development initiatives.',
        evidenceUrl: 'https://horizontemanufactura.mx/desarrollo-proveedores',
        evidenceLabel: 'Supplier quality certification standard'
      },
      {
        type: 'solucion',
        title: 'Technical Talent Upskilling & Retention Programs',
        desc: 'Dual-education pipelines and structured skill pathways for industrial technicians.',
        problem: 'High turnover of specialized technicians and shortage of skilled automation talent.',
        intervention: 'Partnerships with local technical universities and competency-based career ladders.',
        scope: 'Apprenticeship syllabus, internal mentor training, and skill matrix certifications.',
        solution: 'Drastically reduced turnover and a steady pipeline of certified technical leaders.',
        ctaText: 'Collaborate on workforce talent',
        ctaMessage:
          'Hello Adriana, we are developing technical training initiatives and would value your perspective.',
        evidenceUrl: 'https://horizontemanufactura.mx/modelo-formacion',
        evidenceLabel: 'Technical apprenticeship model overview'
      }
    ],
    networkingTargets: [
      {
        target: 'Industrial cluster leaders & manufacturing trade associations (AEROCLUSTER, CLAQ)',
        purpose: 'Drive regional competitiveness, workforce dual-education, and supply-chain initiatives.',
        contribution: 'Direct operational experience, mentorship for emerging leaders, and pilot-program hosting.'
      },
      {
        target: 'Engineering Deans and Technical University Directors',
        purpose: 'Align academic curricula with industrial operational requirements and automation standards.',
        contribution: 'Real-world problem statements, internship programs, and advisory council participation.'
      }
    ],
    links: [
      {
        label: 'Operational Framework & Principles',
        url: 'https://horizontemanufactura.mx/operaciones',
        icon: 'layers',
        category: 'Proceso'
      },
      {
        label: 'Talent Development Case Study',
        url: 'https://horizontemanufactura.mx/caso-talento',
        icon: 'description',
        category: 'Recurso'
      }
    ]
  },

  // =========================================================================
  // DEMO ARCHETYPE F: Dra. Lucía Cárdenas (Médica General)
  // =========================================================================
  'demo-lucia-cardenas': {
    role: 'General Practitioner & Preventive Health',
    company: 'Consultorio Punto Salud',
    city: 'Santiago de Querétaro, Mexico',
    valueProp:
      'Comprehensive general medical consultations, preventive health checkups, and chronic disease management. Warm, evidence-based medical care focused on listening to you and guiding your wellness.',
    status: 'Consultations by appointment',
    primaryActionLabel: 'Book medical appointment',
    whatsappCustomMessage:
      'Hello Dr. Lucía, I saw your digital card and would like information regarding appointment availability, location, and requirements for a general medical checkup.',
    introVideoTitle: 'Preventive care and dedicated time for your health',
    customFields: {
      medicalProfession: 'General Medicine & Family Health',
      medicalSpecialty: 'Preventive Care, Adult Health, Chronic Disease Management',
      licenseId: '12849302',
      institution: 'Facultad de Medicina • Universidad Autónoma de Querétaro'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Comprehensive Health Checkup & Preventive Assessment',
        desc: 'Thorough physical evaluation, metabolic risk screening, and customized wellness plans.',
        problem: 'Postponing checkups until symptoms appear or lacking an integrated overview of overall health.',
        intervention: 'Complete clinical history, vital signs assessment, lab test interpretation, and lifestyle roadmap.',
        scope: 'Written medical report, customized preventive plan, and nutritional/lifestyle recommendations.',
        solution: 'Early detection of risk factors and total clarity on your current health status.',
        ctaText: 'Schedule preventive checkup',
        ctaMessage:
          'Hello Dr. Lucía, I would like to schedule a comprehensive preventive medical checkup.',
        evidenceUrl: 'https://puntosalud.mx/protocolo-revision',
        evidenceLabel: 'Preventive checkup protocol details'
      },
      {
        type: 'solucion',
        title: 'Management & Control of Chronic Metabolic Conditions',
        desc: 'Ongoing management for hypertension, type-2 diabetes, and cholesterol.',
        problem: 'Living with chronic conditions without regular monitoring or feeling overwhelmed by medications.',
        intervention: 'Medication review, home-monitoring guidance, dietary alignment, and regular follow-up goals.',
        scope: 'Personalized treatment plan, monitoring log, and direct follow-up channel.',
        solution: 'Stabilize clinical markers, prevent complications, and enjoy a confident, normal daily routine.',
        ctaText: 'Consult chronic care management',
        ctaMessage:
          'Hello Dr. Lucía, I need medical guidance and monitoring for blood pressure / blood sugar control.',
        evidenceUrl: 'https://puntosalud.mx/guia-paciente-cronico',
        evidenceLabel: 'Chronic care patient guide'
      },
      {
        type: 'solucion',
        title: 'Acute Illness Care & Medical Certification',
        desc: 'Timely consultation for respiratory infections, gastrointestinal issues, and official health certificates.',
        problem: 'Sudden onset of illness requiring accurate diagnosis and evidence-based treatment without self-medicating.',
        intervention: 'Targeted physical examination, rational antibiotic stewardship, and symptom relief prescription.',
        scope: 'Medical diagnosis, official prescription, and follow-up advice.',
        solution: 'Rapid recovery with safe, certified medical guidance.',
        ctaText: 'Request consultation',
        ctaMessage:
          'Hello Dr. Lucía, I have acute symptoms and would like to know your earliest consultation availability.',
        evidenceUrl: 'https://puntosalud.mx/criterios-atencion',
        evidenceLabel: 'Clinic consultation standards'
      }
    ],
    networkingTargets: [
      {
        target: 'Specialist physicians (Cardiologists, Endocrinologists, Gynecologists)',
        purpose: 'Coordinate clinical interconsultations and timely diagnostic referrals.',
        contribution: 'Thorough pre-consultation assessments, detailed clinical notes, and patient follow-through.'
      },
      {
        target: 'Clinical laboratories and imaging diagnostic centers in Querétaro',
        purpose: 'Provide accessible checkup packages and fast digital test results for patients.',
        contribution: 'Evidence-based laboratory orders and transparent communication.'
      }
    ],
    links: [
      {
        label: 'Clinical Consultation Guide & FAQs',
        url: 'https://puntosalud.mx/guia-consulta',
        icon: 'document',
        category: 'Recurso'
      },
      {
        label: 'Clinic Location & Parking Info',
        url: 'https://puntosalud.mx/ubicacion',
        icon: 'globe',
        category: 'Contacto'
      }
    ]
  },

  // =========================================================================
  // DEMO ARCHETYPE G: Mtra. Gabriela León (Vinculación Institucional)
  // =========================================================================
  'demo-gabriela-leon': {
    role: 'Coordinator of Institutional Partnerships & Capability Development',
    company: 'Regional Center for Training & Institutional Liaison',
    city: 'Santiago de Querétaro, Mexico',
    valueProp:
      'We connect academic research, civil society organizations, and industry to co-create training programs, technology transfer, and regional community development initiatives.',
    status: 'Partnerships by appointment',
    primaryActionLabel: 'Propose institutional collaboration',
    whatsappCustomMessage:
      'Hello Gabriela, I saw your profile and would like to share a collaborative proposal between our organization and your institution.',
    introVideoTitle: 'Collaborative bridges for regional innovation',
    customFields: {
      institutionName: 'Regional Center for Training & Institutional Liaison',
      institutionalDepartment: 'Institutional Partnerships & Capability Development',
      territorialScope: 'Bajío Regional Scope'
    },
    solutions: [
      {
        type: 'solucion',
        title: 'Quadripartite Innovation & Applied Research Agreements',
        desc: 'Connecting university researchers with industry challenges and public sector initiatives.',
        problem: 'Valuable academic research remains confined to paper while local industries face technological hurdles.',
        intervention: 'We organize match-making roundtables, structure IP sharing frameworks, and monitor project milestones.',
        scope: 'Formal institutional partnership agreement, governance rules, and mutual milestone reviews.',
        solution: 'Direct application of scientific knowledge to solve practical community and industrial problems.',
        ctaText: 'Explore university-industry agreement',
        ctaMessage:
          'Hello Gabriela, we would like to explore an applied research partnership with your institution.',
        evidenceUrl: 'https://crfv-institucional.org/modelo-convenios',
        evidenceLabel: 'Partnership governance model'
      },
      {
        type: 'solucion',
        title: 'Tailored Workforce Capability & Certification Programs',
        desc: 'Designing accredited training diplomas responding to specific industry shortages.',
        problem: 'Standard academic curricula do not keep pace with emerging technologies and industry standards.',
        intervention: 'Co-design curricula with industry subject-matter experts and academic faculties.',
        scope: 'Accredited training modules, certified instructors, and official competency diplomas.',
        solution: 'Rapid workforce readiness with formal academic credentials and market validation.',
        ctaText: 'Propose training program',
        ctaMessage:
          'Hello Gabriela, our organization wants to co-develop an accredited training program.',
        evidenceUrl: 'https://crfv-institucional.org/catalogo-capacitacion',
        evidenceLabel: 'Competency certification framework'
      },
      {
        type: 'solucion',
        title: 'Regional Community Outreach & Civic Development Forums',
        desc: 'Multi-stakeholder symposiums and citizen engagement roundtables.',
        problem: 'Fragmented social initiatives with duplicative efforts and limited regional reach.',
        intervention: 'We convene civic leaders, chambers, and academic experts around shared regional priorities.',
        scope: 'Event facilitation, white-paper publication, and continuous working committees.',
        solution: 'Aligned regional initiatives with measurable social and economic impact.',
        ctaText: 'Participate in regional forum',
        ctaMessage:
          'Hello Gabriela, we are interested in joining the regional collaboration forums.',
        evidenceUrl: 'https://crfv-institucional.org/memoria-anual',
        evidenceLabel: 'Regional liaison annual report'
      }
    ],
    networkingTargets: [
      {
        target: 'Industry Chambers & Business Councils (COPARMEX, CANACINTRA)',
        purpose: 'Identify regional talent development gaps and establish joint training initiatives.',
        contribution: 'Institutional liaison protocols, academic accreditation, and subsidized training facilities.'
      },
      {
        target: 'Civil Society Organizations & International Development Agencies',
        purpose: 'Channel funding and technical cooperation to high-impact community programs.',
        contribution: 'Audited institutional execution, impact measurement indicators, and civic reach.'
      }
    ],
    links: [
      {
        label: 'Institutional Collaboration Framework',
        url: 'https://crfv-institucional.org/vinculacion',
        icon: 'domain',
        category: 'Proceso'
      },
      {
        label: 'Annual Regional Impact Report',
        url: 'https://crfv-institucional.org/memoria',
        icon: 'document',
        category: 'Recurso'
      }
    ]
  },

  // =========================================================================
  // STANDARD SAMPLE PROFILES
  // =========================================================================
  'sara-sazedi': {
    role: 'Business Consultant & Strategic Partnerships',
    company: 'Sazedi Consulting Group',
    city: 'Mexico City',
    valueProp:
      'I assist business leaders and scale-up founders in securing strategic alliances and expanding their business models.',
    status: 'Available for networking',
    primaryActionLabel: 'Discuss Strategic Partnerships',
    customFields: {
      specialty: 'Strategic Alliances & B2B Scaling',
      clientType: 'Business leaders and scale-up founders',
      serviceScope: '1-on-1 strategic consulting and commercial agreements'
    },
    solutions: [
      {
        title: 'Commercial Alliances Development',
        desc: 'Structuring high-impact distribution channels and business agreements.'
      },
      {
        title: 'Business Growth Advisory',
        desc: 'Optimizing commercial value propositions and market expansion in Mexico.'
      },
      {
        title: 'Executive Mentorship for Entrepreneurs',
        desc: '1-on-1 guidance for strategic decision-making and scaling.'
      }
    ],
    networkingTargets: [
      'CEOs and founders of expanding scale-ups and SMEs.',
      'Angel investors and venture capital funds.',
      'Commercial partners in corporate services and technology.'
    ]
  },
  'alex-vanegas': {
    role: 'Director of RevOps',
    city: 'Mexico City',
    valueProp: 'I help businesses streamline revenue operations and accelerate online sales.',
    solutions: [
      {
        title: 'Revenue Operations (RevOps)',
        desc: 'Help you build pipelines and optimize conversion funnels online.'
      },
      {
        title: 'Executive Sales Strategy',
        desc: 'Align marketing, sales, and customer success for rapid growth.'
      }
    ],
    networkingTargets: [
      'Managing Directors and key decision-makers.',
      'Strategic allies and technology partners.'
    ]
  },
  'sofia-valenzuela': {
    role: 'Senior Consultant in Tax Strategy & Corporate Governance',
    city: 'Mexico City',
    valueProp: 'Designing legally resilient corporate and tax governance structures for international enterprises.',
    solutions: [
      {
        title: 'Corporate Tax Structuring',
        desc: 'Fiscal compliance and risk prevention audits.'
      },
      {
        title: 'Governance & Board Advisory',
        desc: 'Implementing best practices for family offices and boards.'
      }
    ]
  },
  'mateo-arrambide': {
    role: 'Founding Partner & Architect',
    city: 'Querétaro, Qro.',
    valueProp: 'Creating sustainable, iconic architectural spaces for luxury residential and hospitality projects.'
  },
  'cuauhtemoc-gonzalez': {
    role: 'Director of Industrial Automation & Robotics',
    city: 'Monterrey, N.L.',
    valueProp: 'Automating high-precision assembly lines and supply chains with intelligent robotics.'
  },
  'carlos-mendoza': {
    role: 'Wealth Advisor & Corporate Insurance Consultant',
    city: 'Querétaro, Qro.',
    valueProp: 'I guide business owners and executives in safeguarding corporate assets and structuring tax-deductible policies with a transparent process.',
    solutions: [
      {
        title: 'Key-Person Corporate Protection',
        desc: 'Tax-deductible commercial policies protecting partnership continuity.'
      },
      {
        title: 'Tax-Deductible Personal Retirement Plans',
        desc: 'Asset management with fiscal incentives under Mexican tax regulations.'
      }
    ],
    networkingTargets: [
      'Managing directors and founders of mid-sized companies in Bajío.',
      'CPAs and partner tax advisory firms.',
      'HR Directors seeking executive health and benefits packages.'
    ]
  },
  'valeria-trevino': {
    role: 'Director of Digital Transformation & Operations',
    city: 'Monterrey / Mexico City',
    valueProp: 'Leading operational modernization and analytics adoption to streamline core systems and accelerate executive decision-making.',
    solutions: [
      {
        title: 'Regional Operational Stack Modernization',
        desc: 'Unifying operational data pipelines for 4 corporate subsidiaries.'
      },
      {
        title: 'Data Governance & Enterprise AI Adoption',
        desc: 'Security protocols and safe AI adoption frameworks for business units.'
      }
    ],
    networkingTargets: [
      'Managing directors and corporate transformation committees.',
      'IT & Cybersecurity executives in mid-market and enterprise groups.',
      'Executive advisory boards and innovation networks.'
    ]
  },
  'dra-mariana-alvarez': {
    role: 'Pediatric Dentistry & Preventive Orthodontics',
    city: 'Querétaro, Qro.',
    valueProp: 'Guiding oral development in infants, children, and teens through gentle preventive protocols and non-invasive digital technology.',
    solutions: [
      {
        title: 'Preventive Maxillofacial Growth Guidance',
        desc: 'Early intervention to guide jaw growth and teeth alignment without trauma.'
      },
      {
        title: 'Atraumatic Restorative Pediatric Dentistry',
        desc: 'Gentle, minimally invasive care prioritizing emotional comfort.'
      }
    ],
    networkingTargets: [
      'Pediatricians and family physicians for clinical interconsultation.',
      'Child psychologists and allied speech therapists.',
      'Schools and parent-teacher health committees.'
    ]
  },
  'lic-arturo-villarreal': {
    role: 'Director General for Strategic Partnerships & Civic Affairs',
    city: 'Querétaro, Qro.',
    valueProp: 'Coordinating strategic alliances between academia, industry chambers, and public government to drive innovation and regional development.',
    solutions: [
      {
        title: 'Quadripartite Innovation Liaison Council',
        desc: 'Connecting applied research with local manufacturing supply chains.'
      },
      {
        title: 'Local Supplier Advancement Initiative',
        desc: 'Channeling SMEs into aerospace and automotive tier-1 supplier registers.'
      }
    ],
    networkingTargets: [
      'Regional industry chamber leadership (CANACINTRA, COPARMEX).',
      'University presidents and directors of public research institutes.',
      'International cooperation organizations and regional development funds.'
    ]
  }
};


