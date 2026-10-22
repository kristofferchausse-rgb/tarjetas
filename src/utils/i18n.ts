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
    solutionsLabel: 'Qué puedo ayudarte a resolver',
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
      'Disponible': 'Disponible'
    } as Record<string, string>,
    categories: {
      Agenda: 'Agenda',
      Redes: 'Redes',
      Contacto: 'Contacto'
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
    solutionsLabel: 'How I can help you solve challenges',
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
      'Disponible': 'Available'
    } as Record<string, string>,
    categories: {
      Agenda: 'Schedule',
      Redes: 'Social',
      Contacto: 'Contact'
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

/**
 * Built-in role and content translations for common executive roles and sample profiles
 */
export const SAMPLE_PROFILE_TRANSLATIONS: Record<
  string,
  {
    role?: string;
    city?: string;
    valueProp?: string;
    solutions?: { title: string; desc: string }[];
    networkingTargets?: string[];
  }
> = {
  'sara-sazedi': {
    role: 'Business Consultant & Strategic Partnerships',
    city: 'Mexico City',
    valueProp:
      'I assist business leaders and scale-up founders in securing strategic alliances and expanding their business models.',
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
  }
};
