import { ProfessionalProfileType, ProfileCustomFields } from '../types/card';
import { CardLanguage } from '../utils/i18n';

export interface ProfileOptionalFieldDefinition {
  key: keyof ProfileCustomFields;
  label: { es: string; en: string };
  placeholder: { es: string; en: string };
  helpText: { es: string; en: string };
}

export interface ProfessionalProfileDefinition {
  id: ProfessionalProfileType;
  name: { es: string; en: string };
  shortName: { es: string; en: string };
  badgeLabel: { es: string; en: string };
  targetAudience: { es: string; en: string };
  objective: { es: string; en: string };
  highlightPoints: { es: string[]; en: string[] };
  labels: {
    roleLabel: { es: string; en: string };
    rolePlaceholder: { es: string; en: string };
    companyLabel: { es: string; en: string };
    companyPlaceholder: { es: string; en: string };
    valuePropLabel: { es: string; en: string };
    valuePropPlaceholder: { es: string; en: string };
    solutionsSectionTitle: { es: string; en: string };
    solutionsSectionSubtitle: { es: string; en: string };
    solutionCaseQuestion1: { es: string; en: string };
    solutionCaseQuestion2: { es: string; en: string };
    solutionCtaQuestion: { es: string; en: string };
    solutionCtaDefault: { es: string; en: string };
    networkingSectionTitle: { es: string; en: string };
    primaryActionLabel: { es: string; en: string };
    whatsappActionLabel: { es: string; en: string };
    leadCaptureMessageLabel: { es: string; en: string };
    leadCaptureMessagePlaceholder: { es: string; en: string };
  };
  optionalFields: ProfileOptionalFieldDefinition[];
  sampleHelpers: {
    role: string;
    company: string;
    valueProp: string;
    sampleCase: {
      title: string;
      problem: string;
      solution: string;
      ctaText: string;
    };
    networking: string[];
  };
}

export const PROFESSIONAL_PROFILES: Record<ProfessionalProfileType, ProfessionalProfileDefinition> = {
  profesional_independiente: {
    id: 'profesional_independiente',
    name: {
      es: 'Profesional Independiente',
      en: 'Independent Professional'
    },
    shortName: {
      es: 'Independiente',
      en: 'Independent'
    },
    badgeLabel: {
      es: 'Profesional Especialista',
      en: 'Specialist Professional'
    },
    targetAudience: {
      es: 'Consultores, arquitectos, contadores, abogados y especialistas independientes.',
      en: 'Consultants, architects, accountants, lawyers, and independent specialists.'
    },
    objective: {
      es: 'Que se comprenda y valore su especialidad, facilitando consultas de alto valor y confianza.',
      en: 'Communicate the value of your specialty and facilitate high-trust professional inquiries.'
    },
    highlightPoints: {
      es: ['A quién ayuda', 'Problemas que atiende', 'Especialización', 'Forma de trabajo', 'Casos reales'],
      en: ['Who you help', 'Problems addressed', 'Specialization', 'Working methodology', 'Real cases']
    },
    labels: {
      roleLabel: {
        es: 'Especialidad o Práctica Profesional',
        en: 'Specialty or Professional Practice'
      },
      rolePlaceholder: {
        es: 'Ej. Consultora en Estrategia Fiscal y Gobernanza',
        en: 'e.g. Senior Tax Strategy & Governance Consultant'
      },
      companyLabel: {
        es: 'Despacho, Firma o Marca Profesional',
        en: 'Firm, Studio or Professional Brand'
      },
      companyPlaceholder: {
        es: 'Ej. Valenzuela & Asociados',
        en: 'e.g. Valenzuela & Associates'
      },
      valuePropLabel: {
        es: 'A quién ayudo y con qué:',
        en: 'Who I help and how:'
      },
      valuePropPlaceholder: {
        es: 'Acompaño a empresas y directores a resolver retos complejos mediante...',
        en: 'I assist business leaders in overcoming complex challenges through...'
      },
      solutionsSectionTitle: {
        es: 'Especialidades y Casos de Trabajo',
        en: 'Practice Areas & Proven Case Studies'
      },
      solutionsSectionSubtitle: {
        es: 'Casos reales de intervención y resultados documentados',
        en: 'Documented casework, methodology, and tangible results'
      },
      solutionCaseQuestion1: {
        es: '¿Cómo ayudamos?',
        en: 'How we help'
      },
      solutionCaseQuestion2: {
        es: '¿Cómo se resolvió?',
        en: 'How it was resolved'
      },
      solutionCtaQuestion: {
        es: '¿Tienes una necesidad similar?',
        en: 'Have a similar challenge?'
      },
      solutionCtaDefault: {
        es: 'Conversar sobre una necesidad',
        en: 'Discuss a similar need'
      },
      networkingSectionTitle: {
        es: 'Con quién me interesa conectar y colaborar',
        en: 'Who I want to connect and collaborate with'
      },
      primaryActionLabel: {
        es: 'Guardar Contacto Profesional',
        en: 'Save Professional Contact'
      },
      whatsappActionLabel: {
        es: 'Escríbeme por WhatsApp',
        en: 'Chat on WhatsApp'
      },
      leadCaptureMessageLabel: {
        es: 'Mensaje o necesidad a consultar (Opcional)',
        en: 'Message or inquiry topic (Optional)'
      },
      leadCaptureMessagePlaceholder: {
        es: '¿En qué tema o proyecto te gustaría que colaboremos?',
        en: 'What project or challenge would you like to discuss?'
      }
    },
    optionalFields: [
      {
        key: 'specialty',
        label: {
          es: 'Especialidad / Área de Enfoque',
          en: 'Specialty / Focus Area'
        },
        placeholder: {
          es: 'Ej. Derecho Corporativo & Protocolos de Sucesión Familiar',
          en: 'e.g. Corporate Law & Family Succession Planning'
        },
        helpText: {
          es: 'Define con precisión tu nicho técnico para atraer las consultas correctas.',
          en: 'Defines your exact technical niche to attract qualified inquiries.'
        }
      },
      {
        key: 'clientType',
        label: {
          es: 'Tipo de Cliente Atendido',
          en: 'Target Client Profile'
        },
        placeholder: {
          es: 'Ej. Empresas medianas con facturación +$20M MXN y family offices',
          en: 'e.g. Mid-market enterprises ($20M+ revenue) and family offices'
        },
        helpText: {
          es: 'Ayuda a que quien revise tu perfil identifique si su perfil coincide con tu práctica.',
          en: 'Helps visitors immediately identify if they are an ideal fit.'
        }
      },
      {
        key: 'serviceScope',
        label: {
          es: 'Alcance del Servicio',
          en: 'Scope of Service'
        },
        placeholder: {
          es: 'Ej. Dictámenes preventivos, asesoría mensual y litigio estratégico',
          en: 'e.g. Preventive audits, ongoing advisory, and strategic litigation'
        },
        helpText: {
          es: 'Explica el formato habitual de entrega de tus intervenciones.',
          en: 'Clarifies the typical engagement format and delivery model.'
        }
      }
    ],
    sampleHelpers: {
      role: 'Consultora Senior en Estrategia Fiscal y Gobernanza',
      company: 'Valenzuela & Asociados',
      valueProp: 'Acompaño a empresas familiares y directores generales a blindar su patrimonio corporativo ante auditorías y contingencias legales.',
      sampleCase: {
        title: 'Diagnóstico Fiscal & Protocolo Preventivo',
        problem: 'Empresa mediana con inconsistencias acumuladas y riesgo de auditoría formal.',
        solution: 'Auditoría preventiva de 4 semanas que regularizó el 100% de expedientes sin contingencias.',
        ctaText: 'Conversar sobre una necesidad'
      },
      networking: [
        'Directores generales y fundadores de empresas en crecimiento.',
        'Directores de Finanzas (CFOs) y despachos contables aliados.',
        'Notarías y firmas legales de derecho corporativo.'
      ]
    }
  },

  comercial_asesor: {
    id: 'comercial_asesor',
    name: {
      es: 'Comercial / Asesor',
      en: 'Commercial / Advisor'
    },
    shortName: {
      es: 'Comercial',
      en: 'Commercial'
    },
    badgeLabel: {
      es: 'Asesor Comercial',
      en: 'Commercial Advisor'
    },
    targetAudience: {
      es: 'Asesores inmobiliarios, de seguros, representantes de ventas, ejecutivos de cuenta y desarrollo comercial.',
      en: 'Real estate brokers, insurance advisors, sales representatives, and account executives.'
    },
    objective: {
      es: 'Orientar el interés recibido y facilitar que la conversación continúe con contexto claro.',
      en: 'Channel incoming interest and continue discussions with contextual inquiry data.'
    },
    highlightPoints: {
      es: ['Necesidades que atiende', 'Líneas de solución', 'Cobertura geográfica', 'Proceso de asesoría', 'Evidencia'],
      en: ['Needs addressed', 'Solution lines', 'Geographic territory', 'Advisory process', 'Evidence']
    },
    labels: {
      roleLabel: {
        es: 'Línea de Asesoría o Representación',
        en: 'Advisory Specialty or Representation'
      },
      rolePlaceholder: {
        es: 'Ej. Asesor Patrimonial Certificado & Seguros Corporativos',
        en: 'e.g. Certified Wealth & Commercial Insurance Advisor'
      },
      companyLabel: {
        es: 'Empresa Representada, Agencia o Brokerage',
        en: 'Represented Firm, Agency or Brokerage'
      },
      companyPlaceholder: {
        es: 'Ej. Seguros Monterrey New York Life / Inmobiliaria Bajío',
        en: 'e.g. Commercial Brokerage Group / Real Estate Partner'
      },
      valuePropLabel: {
        es: 'Propuesta de Asesoría & Soluciones:',
        en: 'Advisory Value & Solutions:'
      },
      valuePropPlaceholder: {
        es: 'Asesoro a familias y empresas a seleccionar la solución idónea en...',
        en: 'I guide families and companies to secure the ideal solution in...'
      },
      solutionsSectionTitle: {
        es: 'Soluciones y Casos Atendidos',
        en: 'Solutions & Client Scenarios'
      },
      solutionsSectionSubtitle: {
        es: 'Proceso de asesoría transparente y casos de orientación exitosa',
        en: 'Transparent advisory roadmap with proven client outcomes'
      },
      solutionCaseQuestion1: {
        es: '¿Qué necesidad atendemos?',
        en: 'Need addressed'
      },
      solutionCaseQuestion2: {
        es: '¿Qué solución se brindó?',
        en: 'Solution provided'
      },
      solutionCtaQuestion: {
        es: '¿Buscas una solución para tu caso?',
        en: 'Looking for a solution tailored to you?'
      },
      solutionCtaDefault: {
        es: 'Solicitar asesoría o cotización',
        en: 'Request advisory or quote'
      },
      networkingSectionTitle: {
        es: 'Alianzas y perfiles comerciales de interés',
        en: 'Strategic commercial alliances of interest'
      },
      primaryActionLabel: {
        es: 'Guardar Contacto de Asesor',
        en: 'Save Advisor Contact'
      },
      whatsappActionLabel: {
        es: 'Solicitar Asesoría por WhatsApp',
        en: 'Request Advisory on WhatsApp'
      },
      leadCaptureMessageLabel: {
        es: 'Solución de interés o cotización deseada (Opcional)',
        en: 'Solution of interest or quote requested (Optional)'
      },
      leadCaptureMessagePlaceholder: {
        es: 'Indica la propiedad, póliza o solución sobre la que requieres información.',
        en: 'Specify the property, policy, or solution you would like details on.'
      }
    },
    optionalFields: [
      {
        key: 'sector',
        label: {
          es: 'Sector / Industria',
          en: 'Industry / Sector'
        },
        placeholder: {
          es: 'Ej. Inmobiliario Residencial Premier & Terrenos Industriales',
          en: 'e.g. Premier Residential & Industrial Real Estate'
        },
        helpText: {
          es: 'Área económica principal donde orientas tus soluciones.',
          en: 'Primary industry in which you deliver advisory.'
        }
      },
      {
        key: 'territory',
        label: {
          es: 'Territorio / Zona de Cobertura',
          en: 'Territory / Coverage Area'
        },
        placeholder: {
          es: 'Ej. Querétaro, San Miguel de Allende y Corredor Bajío',
          en: 'e.g. Queretaro, Bajio Region & Central Mexico'
        },
        helpText: {
          es: 'Zona geográfica o mercado donde brindas atención y seguimiento.',
          en: 'Geographic market where you offer advisory and service.'
        }
      },
      {
        key: 'solutionLines',
        label: {
          es: 'Líneas de Solución / Catálogo',
          en: 'Solution Lines / Offerings'
        },
        placeholder: {
          es: 'Ej. Planes de retiro deducibles, pólizas de hombre clave, gastos médicos',
          en: 'e.g. Executive retirement plans, key-man coverage, group health'
        },
        helpText: {
          es: 'Menciona los 3 o 4 productos o servicios clave que gestionas.',
          en: 'Lists the core products or services you represent.'
        }
      }
    ],
    sampleHelpers: {
      role: 'Asesor Patrimonial & Seguros Corporativos',
      company: 'Grupo Asegurador del Bajío',
      valueProp: 'Asesoro a empresarios y profesionistas a blindar su patrimonio familiar y optimizar deducciones fiscales mediante planes corporativos.',
      sampleCase: {
        title: 'Plan de Retiro Corporativo & Hombre Clave',
        problem: 'Empresa socia sin protección financiera ante la eventual ausencia de un socio clave.',
        solution: 'Estructuración de póliza Hombre Clave 100% deducible que garantizó la liquidez de la sociedad.',
        ctaText: 'Solicitar asesoría o cotización'
      },
      networking: [
        'Dueños de negocios y profesionistas con interés en blindaje patrimonial.',
        'Directores de Recursos Humanos para prestaciones ejecutivas.',
        'Notarios, contadores y asesores patrimoniales complementarios.'
      ]
    }
  },

  emprendedor_solopreneur: {
    id: 'emprendedor_solopreneur',
    name: {
      es: 'Emprendedor / Solopreneur',
      en: 'Entrepreneur / Solopreneur'
    },
    shortName: {
      es: 'Emprendedor',
      en: 'Solopreneur'
    },
    badgeLabel: {
      es: 'Emprendedor / Creador',
      en: 'Founder / Maker'
    },
    targetAudience: {
      es: 'Personas que gestionan su propio negocio, marca o taller y atienden directamente a sus clientes.',
      en: 'Independent founders, makers, artisans, and practitioners running customer-facing businesses.'
    },
    objective: {
      es: 'Presentar una oferta comprensible, cercana y facilitar el siguiente paso de compra o encargo.',
      en: 'Present a clear, compelling offer and make starting a project or order effortless.'
    },
    highlightPoints: {
      es: ['Qué ofrece', 'Para quién está diseñado', 'Qué necesidad atiende', 'Cómo comenzar'],
      en: ['What you offer', 'Who it is designed for', 'Need it solves', 'How to get started']
    },
    labels: {
      roleLabel: {
        es: 'Giro, Rol u Oficio',
        en: 'Craft, Role or Specialty'
      },
      rolePlaceholder: {
        es: 'Ej. Diseñador & Fundador de Taller Lumbre',
        en: 'e.g. Designer & Founder of Lumbre Studio'
      },
      companyLabel: {
        es: 'Negocio, Marca o Taller',
        en: 'Business, Brand or Studio'
      },
      companyPlaceholder: {
        es: 'Ej. Taller Lumbre Mobiliario & Iluminación',
        en: 'e.g. Lumbre Lighting & Furniture Studio'
      },
      valuePropLabel: {
        es: 'Qué ofrecemos y a quién ayudamos:',
        en: 'What we offer and who we serve:'
      },
      valuePropPlaceholder: {
        es: 'Creamos soluciones de... para clientes que buscan...',
        en: 'We craft bespoke... for clients looking for...'
      },
      solutionsSectionTitle: {
        es: 'Oferta Principal y Proyectos Desarrollados',
        en: 'Core Offerings & Signature Projects'
      },
      solutionsSectionSubtitle: {
        es: 'Cómo ayudamos a clientes y espacios con piezas y servicios directos',
        en: 'How we help clients and spaces with direct service and craft'
      },
      solutionCaseQuestion1: {
        es: '¿Qué encargo o necesidad atendemos?',
        en: 'Request or challenge solved'
      },
      solutionCaseQuestion2: {
        es: '¿Cómo se desarrolló y entregó?',
        en: 'How it was crafted & delivered'
      },
      solutionCtaQuestion: {
        es: '¿Tienes un encargo o proyecto similar?',
        en: 'Have a custom project or order?'
      },
      solutionCtaDefault: {
        es: 'Iniciar consulta o pedido',
        en: 'Start inquiry or order'
      },
      networkingSectionTitle: {
        es: 'Con quién nos interesa colaborar',
        en: 'Who we want to collaborate with'
      },
      primaryActionLabel: {
        es: 'Guardar Contacto',
        en: 'Save Contact'
      },
      whatsappActionLabel: {
        es: 'Conversar por WhatsApp',
        en: 'Chat on WhatsApp'
      },
      leadCaptureMessageLabel: {
        es: 'Tu idea, pedido o consulta (Opcional)',
        en: 'Your project, order or inquiry (Optional)'
      },
      leadCaptureMessagePlaceholder: {
        es: 'Cuéntanos brevemente qué pieza o servicio tienes en mente.',
        en: 'Tell us briefly what project or product you have in mind.'
      }
    },
    optionalFields: [
      {
        key: 'category',
        label: {
          es: 'Categoría o Giro del Negocio',
          en: 'Business Category'
        },
        placeholder: {
          es: 'Ej. Mobiliario Contract, Café de Especialidad, Consultoría Creativa',
          en: 'e.g. Custom Furniture, Specialty Coffee, Creative Studio'
        },
        helpText: {
          es: 'Giro general para clasificar tu oferta con claridad.',
          en: 'General classification to clarify your business offering.'
        }
      },
      {
        key: 'modality',
        label: {
          es: 'Modalidad de Oferta',
          en: 'Delivery Modality'
        },
        placeholder: {
          es: 'Ej. Fabricación sobre pedido, venta directa en taller y envíos',
          en: 'e.g. Made-to-order, studio direct sales, and nationwide shipping'
        },
        helpText: {
          es: 'Explica si vendes producto sobre pedido, servicio o asesoría.',
          en: 'Specifies whether your model is custom orders, services, or studio visits.'
        }
      },
      {
        key: 'serviceZone',
        label: {
          es: 'Zona o Cobertura de Atención',
          en: 'Service Territory / Shipping'
        },
        placeholder: {
          es: 'Ej. Showroom en Guadalajara + Envíos a todo México',
          en: 'e.g. Studio in Guadalajara + Nationwide delivery'
        },
        helpText: {
          es: 'Indica si tu alcance es local, regional o con envíos.',
          en: 'Informs visitors whether you are local or ship nationally.'
        }
      }
    ],
    sampleHelpers: {
      role: 'Diseñador & Fundador de Taller Lumbre',
      company: 'Taller Lumbre Mobiliario & Iluminación',
      valueProp: 'Creamos piezas de mobiliario e iluminación a la medida para hoteles boutique y restaurantes con carácter contemporáneo.',
      sampleCase: {
        title: 'Mobiliario Contract para Hospitalidad',
        problem: 'Hotel boutique que requería mobiliario de uso rudo sin perder la estética artesanal de autor.',
        solution: 'Fabricamos 45 piezas en maderas tropicales con ensambles reforzados y entrega llave en mano.',
        ctaText: 'Iniciar consulta o pedido'
      },
      networking: [
        'Arquitectos e interioristas enfocados en hospitalidad.',
        'Desarrolladores hoteleros y directores de compras.',
        'Proveedores de maderas certificadas y metales nobles.'
      ]
    }
  },

  empresario_dueno: {
    id: 'empresario_dueno',
    name: {
      es: 'Empresario / Dueño de Negocio',
      en: 'Business Owner / Entrepreneur'
    },
    shortName: {
      es: 'Empresario',
      en: 'Business Owner'
    },
    badgeLabel: {
      es: 'Dueño de Empresa / Pyme',
      en: 'Enterprise Owner / SME'
    },
    targetAudience: {
      es: 'Propietarios de pymes, empresas familiares, directores generales con participación y socios industriales.',
      en: 'Owners of SMEs, family businesses, managing partners, and industrial enterprise leaders.'
    },
    objective: {
      es: 'Comunicar capacidades instaladas, experiencia y facilitar relaciones comerciales y alianzas estratégicas.',
      en: 'Communicate operational capacity and track record to facilitate B2B alliances and contracts.'
    },
    highlightPoints: {
      es: ['Empresa y trayectoria', 'Capacidades instaladas', 'Especialidades', 'Cobertura', 'Casos de éxito'],
      en: ['Company track record', 'Installed capacity', 'Specialties', 'Coverage', 'Proven cases']
    },
    labels: {
      roleLabel: {
        es: 'Cargo o Dirección General',
        en: 'Executive Role / Ownership'
      },
      rolePlaceholder: {
        es: 'Ej. Director General & Socio Fundador',
        en: 'e.g. Managing Director & Founding Partner'
      },
      companyLabel: {
        es: 'Empresa o Grupo Empresarial',
        en: 'Company or Corporate Group'
      },
      companyPlaceholder: {
        es: 'Ej. Logística Integral del Norte S.A. de C.V.',
        en: 'e.g. Northern Logistics Systems S.A.'
      },
      valuePropLabel: {
        es: 'Capacidades de la empresa y valor que aportamos:',
        en: 'Enterprise capabilities & business value delivered:'
      },
      valuePropPlaceholder: {
        es: 'Aceleramos la productividad de cadenas industriales mediante...',
        en: 'We accelerate industrial productivity through...'
      },
      solutionsSectionTitle: {
        es: 'Capacidades y Casos Empresariales',
        en: 'Corporate Capabilities & Proven Cases'
      },
      solutionsSectionSubtitle: {
        es: 'Solvencia técnica, infraestructura instalada y casos reales',
        en: 'Technical credibility, infrastructure, and measurable B2B outcomes'
      },
      solutionCaseQuestion1: {
        es: '¿Qué reto operativo o comercial atendemos?',
        en: 'Operational or supply challenge faced'
      },
      solutionCaseQuestion2: {
        es: '¿Cómo se resolvió con nuestras capacidades?',
        en: 'How our capabilities delivered the solution'
      },
      solutionCtaQuestion: {
        es: '¿Buscas un aliado con esta capacidad instalada?',
        en: 'Looking for a verified partner with these capabilities?'
      },
      solutionCtaDefault: {
        es: 'Explorar colaboración o propuesta',
        en: 'Explore partnership or proposal'
      },
      networkingSectionTitle: {
        es: 'Alianzas comerciales e institucionales prioritarias',
        en: 'Priority commercial and institutional alliances'
      },
      primaryActionLabel: {
        es: 'Guardar Contacto Empresarial',
        en: 'Save Corporate Contact'
      },
      whatsappActionLabel: {
        es: 'Conversar con Dirección General',
        en: 'Connect with Executive Office'
      },
      leadCaptureMessageLabel: {
        es: 'Tema de colaboración o solicitud de propuesta (Opcional)',
        en: 'Collaboration topic or RFP inquiry (Optional)'
      },
      leadCaptureMessagePlaceholder: {
        es: 'Describe la necesidad de tu empresa o la alianza que te interesa explorar.',
        en: 'Describe your company need or the commercial alliance you wish to explore.'
      }
    },
    optionalFields: [
      {
        key: 'sectorsServed',
        label: {
          es: 'Sectores Atendidos',
          en: 'Sectors Served'
        },
        placeholder: {
          es: 'Ej. Automotriz OEM, Aeroespacial, Cadena Fría y Centros de Distribución',
          en: 'e.g. Automotive OEM, Aerospace, Cold Chain & Distribution Centers'
        },
        helpText: {
          es: 'Industrias principales donde la empresa cuenta con certificaciones o clientes.',
          en: 'Key industries where your enterprise holds active contracts or certifications.'
        }
      },
      {
        key: 'coverage',
        label: {
          es: 'Cobertura Operativa',
          en: 'Operational Coverage'
        },
        placeholder: {
          es: 'Ej. Planta en Monterrey, patio logístico en Saltillo y cobertura nacional',
          en: 'e.g. Monterrey manufacturing plant, logistics hub, and nationwide network'
        },
        helpText: {
          es: 'Presencia geográfica de plantas, bodegas o centros de distribución.',
          en: 'Geographic footprint of plants, facilities, and service hubs.'
        }
      },
      {
        key: 'coreCapabilities',
        label: {
          es: 'Capacidades Principales Instaladas',
          en: 'Core Installed Capabilities'
        },
        placeholder: {
          es: 'Ej. Flotilla de 60 AGVs, certificación ISO 9001:2015, integración Just-in-Time',
          en: 'e.g. Fleet of 60 AGVs, ISO 9001:2015 certified, Just-in-Time integration'
        },
        helpText: {
          es: 'Cifras o activos clave que validan la capacidad técnica instalada.',
          en: 'Key technical assets and operational metrics that prove capability.'
        }
      }
    ],
    sampleHelpers: {
      role: 'Director de Operaciones & Automatización B2B',
      company: 'Logística Integral del Norte',
      valueProp: 'Acelero la productividad en cadenas logísticas mediante robótica autónoma y analítica en tiempo real para el sector industrial.',
      sampleCase: {
        title: 'Automatización de Centros de Distribución',
        problem: 'Almacenes con demoras en despacho y transporte interno manual de tarimas.',
        solution: 'Implementamos flotilla de robots autónomos (AGVs), elevando la velocidad de despacho 38%.',
        ctaText: 'Explorar colaboración o propuesta'
      },
      networking: [
        'Vicepresidentes de Cadena de Suministro en plantas automotrices.',
        'Empresas de e-commerce buscando centros automatizados de cumplimiento.',
        'Proveedores tecnológicos de software PLC y sensores industriales.'
      ]
    }
  },

  ejecutivo_directivo: {
    id: 'ejecutivo_directivo',
    name: {
      es: 'Ejecutivo / Directivo',
      en: 'Executive / Director'
    },
    shortName: {
      es: 'Ejecutivo',
      en: 'Executive'
    },
    badgeLabel: {
      es: 'Líder Corporativo / Directivo',
      en: 'Corporate Leader / Director'
    },
    targetAudience: {
      es: 'Líderes de área, directores funcionales, vicepresidentes y gerentes de corporativos y organizaciones.',
      en: 'Department leaders, functional directors, VPs, and executive managers in corporate organizations.'
    },
    objective: {
      es: 'Hacer comprensible su aportación directiva y orientar relaciones profesionales relevantes sin forzar un tono de venta personal.',
      en: 'Articulate executive contribution and foster relevant strategic relationships without sounding like a vendor.'
    },
    highlightPoints: {
      es: ['Responsabilidad de área', 'Experiencia acumulada', 'Aportaciones y proyectos clave', 'Objetivos de vinculación'],
      en: ['Functional leadership', 'Track record', 'Key initiatives', 'Liaison & collaboration goals']
    },
    labels: {
      roleLabel: {
        es: 'Responsabilidad Directiva / Cargo',
        en: 'Executive Role / Functional Title'
      },
      rolePlaceholder: {
        es: 'Ej. Directora de Transformación Digital & Operaciones',
        en: 'e.g. Director of Digital Transformation & Operations'
      },
      companyLabel: {
        es: 'Organización, Empresa o Corporativo',
        en: 'Organization, Company or Corporate Group'
      },
      companyPlaceholder: {
        es: 'Ej. Grupo Financiero del Centro / Corporativo Industrial',
        en: 'e.g. Central Financial Group / Enterprise Tech'
      },
      valuePropLabel: {
        es: 'Enfoque directivo y contribución clave:',
        en: 'Executive focus & core contributions:'
      },
      valuePropPlaceholder: {
        es: 'Lidero iniciativas de transformación y gobernanza orientadas a...',
        en: 'I lead organizational transformation and governance initiatives focused on...'
      },
      solutionsSectionTitle: {
        es: 'Iniciativas Estratégicas y Resultados Clave',
        en: 'Strategic Initiatives & Key Outcomes'
      },
      solutionsSectionSubtitle: {
        es: 'Aportaciones de liderazgo, transformación y proyectos documentados',
        en: 'Documented leadership milestones, governance, and organizational impact'
      },
      solutionCaseQuestion1: {
        es: '¿Qué reto estratégico u organizacional se atendió?',
        en: 'Strategic or organizational challenge addressed'
      },
      solutionCaseQuestion2: {
        es: '¿Qué estrategia y resultados se alcanzaron?',
        en: 'Strategy and tangible outcomes achieved'
      },
      solutionCtaQuestion: {
        es: '¿Compartes un reto de liderazgo o área similar?',
        en: 'Share a similar leadership or operational challenge?'
      },
      solutionCtaDefault: {
        es: 'Conversar sobre colaboración directiva',
        en: 'Discuss executive collaboration'
      },
      networkingSectionTitle: {
        es: 'Temas de vinculación profesional y alianzas',
        en: 'Professional liaison topics & strategic networking'
      },
      primaryActionLabel: {
        es: 'Conectar en Red Profesional',
        en: 'Connect Professionally'
      },
      whatsappActionLabel: {
        es: 'Mensaje Directo al Titular',
        en: 'Direct Message to Executive'
      },
      leadCaptureMessageLabel: {
        es: 'Tema de vinculación o reunión profesional (Opcional)',
        en: 'Professional liaison or meeting topic (Optional)'
      },
      leadCaptureMessagePlaceholder: {
        es: 'Indica el tema institucional o proyecto sobre el que te gustaría conversar.',
        en: 'Indicate the professional project or topic you would like to discuss.'
      }
    },
    optionalFields: [
      {
        key: 'department',
        label: {
          es: 'Área o Función Directiva',
          en: 'Department / Leadership Function'
        },
        placeholder: {
          es: 'Ej. Dirección de Transformación Digital & TI',
          en: 'e.g. Digital Transformation & IT Leadership'
        },
        helpText: {
          es: 'Área de la organización bajo tu coordinación.',
          en: 'Functional business unit under your leadership.'
        }
      },
      {
        key: 'leadershipScope',
        label: {
          es: 'Ámbito de Responsabilidad',
          en: 'Leadership Scope'
        },
        placeholder: {
          es: 'Ej. Coordinación de 4 unidades de negocio en México y Colombia',
          en: 'e.g. Overseeing 4 regional business units in Mexico and Colombia'
        },
        helpText: {
          es: 'Alcance territorial, de equipo o presupuestal de la función.',
          en: 'Team size, territorial remit, or budget governance scope.'
        }
      },
      {
        key: 'liaisonTopics',
        label: {
          es: 'Temas de Vinculación Estratégica',
          en: 'Strategic Liaison Agenda'
        },
        placeholder: {
          es: 'Ej. Alianzas de innovación, adopción de IA corporativa, gobernanza ESG',
          en: 'e.g. Open innovation, enterprise AI adoption, ESG governance'
        },
        helpText: {
          es: 'Áreas temáticas donde te interesa vincularte con pares y aliados.',
          en: 'Priority focus areas for executive networking and peer exchange.'
        }
      }
    ],
    sampleHelpers: {
      role: 'Directora de Transformación Digital & Operaciones',
      company: 'Grupo Innovación Corporativa',
      valueProp: 'Lidero la modernización de sistemas críticos y la adopción de analítica de datos para elevar la agilidad operativa de la organización.',
      sampleCase: {
        title: 'Modernización del Stack de Operaciones',
        problem: 'Sistemas legados descentralizados que ralentizaban la toma de decisiones directivas.',
        solution: 'Migración a arquitectura unificada en la nube que redujo tiempos de reporte un 60%.',
        ctaText: 'Conversar sobre colaboración directiva'
      },
      networking: [
        'Directores generales y miembros de comités de innovación.',
        'Líderes de transformación y tecnología en corporativos afines.',
        'Comunidades ejecutivas de mejores prácticas y gobernanza.'
      ]
    }
  },

  salud: {
    id: 'salud',
    name: {
      es: 'Salud',
      en: 'Healthcare'
    },
    shortName: {
      es: 'Salud',
      en: 'Healthcare'
    },
    badgeLabel: {
      es: 'Profesional de Salud',
      en: 'Healthcare Professional'
    },
    targetAudience: {
      es: 'Médicos, odontólogos, psicólogos, nutriólogos, fisioterapeutas y profesionales de la salud.',
      en: 'Physicians, dentists, psychologists, nutritionists, physiotherapists, and licensed clinicians.'
    },
    objective: {
      es: 'Facilitar confianza informada, comprensión de su práctica y acceso a los canales de consulta adecuados.',
      en: 'Build informed patient trust, clarify clinical scope, and guide visitors to authorized consultation channels.'
    },
    highlightPoints: {
      es: ['Especialidad clínica', 'Servicios ofrecidos', 'Trayectoria', 'Cédula o registro oficial', 'Modalidad y ubicación'],
      en: ['Clinical specialty', 'Services offered', 'Medical background', 'License / Registration', 'Modalities and clinic location']
    },
    labels: {
      roleLabel: {
        es: 'Especialidad Clínica / Profesión',
        en: 'Clinical Specialty / Health Profession'
      },
      rolePlaceholder: {
        es: 'Ej. Odontopediatría & Ortodoncia Preventiva / Médico Cirujano',
        en: 'e.g. Pediatric Dentist & Preventive Orthodontics / Physician'
      },
      companyLabel: {
        es: 'Consultorio, Clínica u Hospital',
        en: 'Clinic, Practice or Medical Center'
      },
      companyPlaceholder: {
        es: 'Ej. Centro Dental Infantil / Hospital Médica Sur',
        en: 'e.g. Family Dental Practice / Angeles Medical Center'
      },
      valuePropLabel: {
        es: 'Enfoque de atención y práctica clínica:',
        en: 'Clinical focus & approach to patient care:'
      },
      valuePropPlaceholder: {
        es: 'Brindo atención especializada orientada a la prevención y el bienestar de...',
        en: 'I provide dedicated clinical care focused on prevention and the well-being of...'
      },
      solutionsSectionTitle: {
        es: 'Servicios Clínicos y Práctica Profesional',
        en: 'Clinical Services & Scope of Practice'
      },
      solutionsSectionSubtitle: {
        es: 'Explicación informada de servicios y protocolos de atención (sin prometer resultados clínicos)',
        en: 'Informed overview of clinical services and care protocols (non-guaranteeing)'
      },
      solutionCaseQuestion1: {
        es: '¿Qué condición o motivo de atención se aborda?',
        en: 'Condition or care objective addressed'
      },
      solutionCaseQuestion2: {
        es: '¿Qué enfoque o protocolo se implementa?',
        en: 'Approach or clinical protocol implemented'
      },
      solutionCtaQuestion: {
        es: '¿Tienes dudas sobre la atención o requieres cita?',
        en: 'Questions regarding this service or scheduling?'
      },
      solutionCtaDefault: {
        es: 'Solicitar información de citas',
        en: 'Request appointment info'
      },
      networkingSectionTitle: {
        es: 'Contacto interprofesional y comités de salud',
        en: 'Interprofessional contact & clinical referrals'
      },
      primaryActionLabel: {
        es: 'Guardar Contacto Médico',
        en: 'Save Medical Contact'
      },
      whatsappActionLabel: {
        es: 'Solicitar Información de Citas',
        en: 'Request Appointment Info'
      },
      leadCaptureMessageLabel: {
        es: 'Motivo general de contacto (No incluir información clínica confidencial)',
        en: 'General contact reason (Do not submit confidential medical records)'
      },
      leadCaptureMessagePlaceholder: {
        es: 'Indica si deseas información de horarios, ubicación o primera consulta.',
        en: 'Indicate whether you seek scheduling availability, location, or first visit info.'
      }
    },
    optionalFields: [
      {
        key: 'medicalProfession',
        label: {
          es: 'Profesión Sanitaria',
          en: 'Healthcare Profession'
        },
        placeholder: {
          es: 'Ej. Odontología, Medicina, Psicología Clínica, Nutrición',
          en: 'e.g. Dentistry, Medicine, Clinical Psychology, Nutrition'
        },
        helpText: {
          es: 'Disciplina o rama de la salud en la que ejerces.',
          en: 'Primary health discipline in which you practice.'
        }
      },
      {
        key: 'medicalSpecialty',
        label: {
          es: 'Especialidad o Alta Especialidad',
          en: 'Clinical Subspecialty'
        },
        placeholder: {
          es: 'Ej. Ortodoncia y Ortopedia Maxilofacial',
          en: 'e.g. Maxillofacial Orthodontics'
        },
        helpText: {
          es: 'Tu subespecialidad o enfoque clínico particular.',
          en: 'Your recognized clinical subspecialty.'
        }
      },
      {
        key: 'licenseId',
        label: {
          es: 'Cédula Profesional o Registro Sanitario (Proporcionado)',
          en: 'Professional License / Registration ID'
        },
        placeholder: {
          es: 'Ej. Céd. Prof. 8492019 / Esp. 1029482',
          en: 'e.g. License #8492019 / Cert. #1029482'
        },
        helpText: {
          es: 'Se mostrará como credencial informativa proporcionada por el titular.',
          en: 'Displays as verified practitioner credential provided by holder.'
        }
      },
      {
        key: 'institution',
        label: {
          es: 'Institución Formadora / Hospital Sede',
          en: 'Alma Mater / Affiliated Hospital'
        },
        placeholder: {
          es: 'Ej. Universidad Nacional Autónoma de México (UNAM) / Hospital Ángeles',
          en: 'e.g. UNAM School of Medicine / Regional Medical Center'
        },
        helpText: {
          es: 'Institución académica o médica que respalda tu formación o sede.',
          en: 'Hospital affiliation or university where you completed training.'
        }
      },
      {
        key: 'bookingUrl',
        label: {
          es: 'Enlace Directo a Agenda de Citas (Doctoralia, Calendly, etc.)',
          en: 'Direct Appointment Scheduling Link'
        },
        placeholder: {
          es: 'https://doctoralia.com.mx/... o https://calendly.com/...',
          en: 'https://doctoralia.com/... or https://calendly.com/...'
        },
        helpText: {
          es: 'Permite a tus pacientes agendar directamente desde su celular.',
          en: 'Allows prospective patients to access your scheduling portal directly.'
        }
      }
    ],
    sampleHelpers: {
      role: 'Odontopediatría & Ortodoncia Preventiva',
      company: 'Clínica Dental Sonrisas QRO',
      valueProp: 'Acompaño el desarrollo dental de niños y adolescentes con protocolos preventivos amigables y tecnología digital no invasiva.',
      sampleCase: {
        title: 'Manejo Preventivo de Apiñamiento Temprano',
        problem: 'Paciente infantil con falta de espacio para erupción de dentición permanente.',
        solution: 'Protocolo de ortopedia funcional que guió el crecimiento maxilar sin necesidad de extracciones.',
        ctaText: 'Solicitar información de citas'
      },
      networking: [
        'Pediatras y médicos familiares para interconsulta.',
        'Psicólogos infantiles y fonoaudiólogos aliados.',
        'Colegios y directores de instituciones educativas.'
      ]
    }
  },

  institucional_publico: {
    id: 'institucional_publico',
    name: {
      es: 'Funcionario / Representante Institucional',
      en: 'Public Official / Institutional Representative'
    },
    shortName: {
      es: 'Institucional',
      en: 'Institutional'
    },
    badgeLabel: {
      es: 'Representante Institucional',
      en: 'Institutional Representative'
    },
    targetAudience: {
      es: 'Personas con responsabilidades públicas, representación ciudadana, organismos autónomos y cámaras empresariales.',
      en: 'Public sector leaders, civil servants, institutional liaison officers, and chamber representatives.'
    },
    objective: {
      es: 'Comunicar su función pública y facilitar colaboración, atención ciudadana e interlocución pertinente.',
      en: 'Clarify institutional purview and facilitate appropriate civic, inter-agency, and public-private liaison.'
    },
    highlightPoints: {
      es: ['Institución', 'Responsabilidades de competencia', 'Proyectos activos', 'Canales institucionales autorizados'],
      en: ['Institution', 'Areas of public purview', 'Active initiatives', 'Authorized institutional channels']
    },
    labels: {
      roleLabel: {
        es: 'Cargo o Función Institucional',
        en: 'Official Title or Institutional Function'
      },
      rolePlaceholder: {
        es: 'Ej. Coordinador General de Vinculación y Proyectos Estratégicos',
        en: 'e.g. Director General for Strategic Partnerships & Civic Affairs'
      },
      companyLabel: {
        es: 'Institución, Organismo o Dependencia',
        en: 'Institution, Agency or Organization'
      },
      companyPlaceholder: {
        es: 'Ej. Secretaría de Desarrollo Sustentable / Municipio de Querétaro',
        en: 'e.g. Ministry of Sustainable Development / Municipal Government'
      },
      valuePropLabel: {
        es: 'Misión institucional y ámbito de competencia:',
        en: 'Institutional mission & scope of responsibility:'
      },
      valuePropPlaceholder: {
        es: 'Coordinamos políticas y proyectos orientados al desarrollo sustentable de...',
        en: 'We coordinate policies and strategic initiatives advancing...'
      },
      solutionsSectionTitle: {
        es: 'Proyectos y Temas de Competencia',
        en: 'Institutional Initiatives & Competency Areas'
      },
      solutionsSectionSubtitle: {
        es: 'Iniciativas activas, áreas de atención ciudadana y canales autorizados',
        en: 'Active programs, areas of public responsibility, and official channels'
      },
      solutionCaseQuestion1: {
        es: '¿Qué asunto o proyecto se atiende?',
        en: 'Issue or public project addressed'
      },
      solutionCaseQuestion2: {
        es: '¿Qué acciones institucionales se implementan?',
        en: 'Institutional actions implemented'
      },
      solutionCtaQuestion: {
        es: '¿Requieres vinculación sobre este tema?',
        en: 'Require liaison regarding this institutional topic?'
      },
      solutionCtaDefault: {
        es: 'Contactar al área responsable',
        en: 'Contact designated office'
      },
      networkingSectionTitle: {
        es: 'Temas de vinculación interinstitucional y ciudadana',
        en: 'Inter-institutional liaison & public agenda topics'
      },
      primaryActionLabel: {
        es: 'Guardar Contacto Institucional',
        en: 'Save Institutional Contact'
      },
      whatsappActionLabel: {
        es: 'Canal de Atención Institucional',
        en: 'Official Institutional Channel'
      },
      leadCaptureMessageLabel: {
        es: 'Asunto de vinculación institucional o gestión (Opcional)',
        en: 'Liaison topic or institutional request (Optional)'
      },
      leadCaptureMessagePlaceholder: {
        es: 'Indica el proyecto, trámite o tema de interlocución institucional.',
        en: 'Specify the initiative, public agenda topic, or liaison request.'
      }
    },
    optionalFields: [
      {
        key: 'institutionName',
        label: {
          es: 'Institución u Organismo Público',
          en: 'Public Institution / Organization'
        },
        placeholder: {
          es: 'Ej. Secretaría de Desarrollo Sustentable del Estado',
          en: 'e.g. State Ministry of Sustainable Development'
        },
        helpText: {
          es: 'Nombre oficial de la institución a la que representas.',
          en: 'Official name of the public agency or institution.'
        }
      },
      {
        key: 'institutionalDepartment',
        label: {
          es: 'Área o Dependencia de Adscripción',
          en: 'Office / Department'
        },
        placeholder: {
          es: 'Ej. Dirección de Fomento Industrial y Emprendimiento',
          en: 'e.g. Office of Industrial Development & Innovation'
        },
        helpText: {
          es: 'Unidad administrativa a tu cargo.',
          en: 'Administrative unit or office under your responsibility.'
        }
      },
      {
        key: 'territorialScope',
        label: {
          es: 'Alcance Territorial / Demarcación',
          en: 'Territorial Scope / Jurisdiction'
        },
        placeholder: {
          es: 'Ej. Estatal Querétaro / Zona Metropolitana de Querétaro',
          en: 'e.g. State of Queretaro / Metropolitan Zone'
        },
        helpText: {
          es: 'Ámbito geográfico de competencia de la función.',
          en: 'Geographic or legal jurisdiction of your office.'
        }
      },
      {
        key: 'publicLiaisonTopics',
        label: {
          es: 'Temas de Vinculación y Competencia',
          en: 'Areas of Purview & Public Engagement'
        },
        placeholder: {
          es: 'Ej. Fomento a pymes, alianzas con universidades, ventanilla única',
          en: 'e.g. SME support, university partnerships, public-private council'
        },
        helpText: {
          es: 'Materias en las que puedes orientar o colaborar.',
          en: 'Subject matters where your office provides collaboration or guidance.'
        }
      }
    ],
    sampleHelpers: {
      role: 'Coordinador General de Vinculación Estratégica',
      company: 'Secretaría de Desarrollo Sustentable',
      valueProp: 'Coordinamos alianzas interinstitucionales entre academia, sector productivo y gobierno para impulsar proyectos de innovación en el estado.',
      sampleCase: {
        title: 'Consejo de Alianzas Público-Privadas',
        problem: 'Falta de articulación ágil entre proyectos de investigación universitaria y empresas industriales.',
        solution: 'Instalación de la mesa de vinculación cuatripartita que concretó 8 proyectos de transferencia tecnológica.',
        ctaText: 'Contactar al área responsable'
      },
      networking: [
        'Cámaras empresariales y clusters industriales de la región.',
        'Rectores y directores de centros públicos de investigación.',
        'Organismos multilaterales y fondos de fomento regional.'
      ]
    }
  }
};

export const DEFAULT_PROFESSIONAL_PROFILE: ProfessionalProfileType = 'profesional_independiente';

export const ALL_PROFESSIONAL_PROFILE_IDS: ProfessionalProfileType[] = [
  'profesional_independiente',
  'comercial_asesor',
  'emprendedor_solopreneur',
  'empresario_dueno',
  'ejecutivo_directivo',
  'salud',
  'institucional_publico'
];

/**
 * Returns the resolved profile configuration for a given profile ID and language.
 * Falls back safely to 'profesional_independiente' for any undefined or unknown profile.
 */
export function getProfileConfig(
  profileType?: ProfessionalProfileType,
  lang: CardLanguage = 'es'
) {
  const resolvedId: ProfessionalProfileType =
    profileType && PROFESSIONAL_PROFILES[profileType]
      ? profileType
      : DEFAULT_PROFESSIONAL_PROFILE;

  const def = PROFESSIONAL_PROFILES[resolvedId];

  return {
    id: def.id,
    name: def.name[lang] || def.name.es,
    shortName: def.shortName[lang] || def.shortName.es,
    badgeLabel: def.badgeLabel[lang] || def.badgeLabel.es,
    targetAudience: def.targetAudience[lang] || def.targetAudience.es,
    objective: def.objective[lang] || def.objective.es,
    highlightPoints: def.highlightPoints[lang] || def.highlightPoints.es,
    labels: {
      roleLabel: def.labels.roleLabel[lang] || def.labels.roleLabel.es,
      rolePlaceholder: def.labels.rolePlaceholder[lang] || def.labels.rolePlaceholder.es,
      companyLabel: def.labels.companyLabel[lang] || def.labels.companyLabel.es,
      companyPlaceholder: def.labels.companyPlaceholder[lang] || def.labels.companyPlaceholder.es,
      valuePropLabel: def.labels.valuePropLabel[lang] || def.labels.valuePropLabel.es,
      valuePropPlaceholder: def.labels.valuePropPlaceholder[lang] || def.labels.valuePropPlaceholder.es,
      solutionsSectionTitle: def.labels.solutionsSectionTitle[lang] || def.labels.solutionsSectionTitle.es,
      solutionsSectionSubtitle: def.labels.solutionsSectionSubtitle[lang] || def.labels.solutionsSectionSubtitle.es,
      solutionCaseQuestion1: def.labels.solutionCaseQuestion1[lang] || def.labels.solutionCaseQuestion1.es,
      solutionCaseQuestion2: def.labels.solutionCaseQuestion2[lang] || def.labels.solutionCaseQuestion2.es,
      solutionCtaQuestion: def.labels.solutionCtaQuestion[lang] || def.labels.solutionCtaQuestion.es,
      solutionCtaDefault: def.labels.solutionCtaDefault[lang] || def.labels.solutionCtaDefault.es,
      networkingSectionTitle: def.labels.networkingSectionTitle[lang] || def.labels.networkingSectionTitle.es,
      primaryActionLabel: def.labels.primaryActionLabel[lang] || def.labels.primaryActionLabel.es,
      whatsappActionLabel: def.labels.whatsappActionLabel[lang] || def.labels.whatsappActionLabel.es,
      leadCaptureMessageLabel: def.labels.leadCaptureMessageLabel[lang] || def.labels.leadCaptureMessageLabel.es,
      leadCaptureMessagePlaceholder: def.labels.leadCaptureMessagePlaceholder[lang] || def.labels.leadCaptureMessagePlaceholder.es
    },
    optionalFields: def.optionalFields.map((f) => ({
      key: f.key,
      label: f.label[lang] || f.label.es,
      placeholder: f.placeholder[lang] || f.placeholder.es,
      helpText: f.helpText[lang] || f.helpText.es
    })),
    sampleHelpers: def.sampleHelpers
  };
}
