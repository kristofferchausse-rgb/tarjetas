import React, { useState } from 'react';
import {
  ParticipantProfile,
  CardTheme,
  ProfessionalProfileType,
  ProfileCustomFields,
  CardSolution,
  FiscalDataCFDI
} from '../types/card';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Sparkles,
  ShieldCheck,
  ReceiptText,
  User,
  Briefcase,
  Building2,
  Phone,
  Mail,
  Globe,
  Calendar,
  Linkedin,
  Instagram,
  Eye,
  Send,
  Copy,
  ExternalLink,
  Lock,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  TrendingUp,
  Award,
  Layers,
  MapPin,
  Check
} from 'lucide-react';
import { LegalNoticeModal, LegalTab } from './LegalNoticeModal';
import { saveCloudProfile } from '../services/cardService';
import { CalendarUrlInput } from './CalendarUrlInput';

interface ClientOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProfile: ParticipantProfile) => void;
  onShowToast: (msg: string) => void;
  existingIds?: string[];
}

const REGIMENES_SAT = [
  { code: '601', label: '601 - General de Ley Personas Morales' },
  { code: '612', label: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
  { code: '626', label: '626 - Régimen Simplificado de Confianza (RESICO)' },
  { code: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados' },
  { code: '606', label: '606 - Arrendamiento' },
  { code: '625', label: '625 - Actividades Empresariales con Plataformas Tecnológicas' },
  { code: '616', label: '616 - Sin obligaciones fiscales' }
];

const USOS_CFDI = [
  { code: 'G03', label: 'G03 - Gastos en general (Recomendado para SaaS/Publicidad)' },
  { code: 'CP01', label: 'CP01 - Pagos' },
  { code: 'S01', label: 'S01 - Sin efectos fiscales' },
  { code: 'G01', label: 'G01 - Adquisición de mercancías' }
];

const FORMAS_PAGO = [
  { code: '03', label: '03 - Transferencia electrónica de fondos (SPEI)' },
  { code: '04', label: '04 - Tarjeta de crédito' },
  { code: '28', label: '28 - Tarjeta de débito' },
  { code: '01', label: '01 - Efectivo' }
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80'
];

export const ClientOnboardingWizard: React.FC<ClientOnboardingWizardProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast,
  existingIds = []
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProfile, setSubmittedProfile] = useState<ParticipantProfile | null>(null);

  // Legal Modal State
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  // STEP 1: Identidad y Contacto
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(SAMPLE_AVATARS[0]);
  const [logoUrl, setLogoUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Santiago de Querétaro, Qro.');
  const [locationMode, setLocationMode] = useState<'presencial' | 'remoto' | 'hibrido'>('hibrido');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');

  // STEP 2: Perfil Profesional y Propuesta de Valor
  const [professionalProfile, setProfessionalProfile] =
    useState<ProfessionalProfileType>('profesional_independiente');
  const [themeKey, setThemeKey] = useState<CardTheme>('ejecutivo');
  const [valueProp, setValueProp] = useState('');

  // Custom fields
  const [medicalProfession, setMedicalProfession] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [medicalInstitution, setMedicalInstitution] = useState('');
  const [commercialSector, setCommercialSector] = useState('');
  const [commercialTerritory, setCommercialTerritory] = useState('');
  const [businessCapabilities, setBusinessCapabilities] = useState('');
  const [solopreneurModality, setSolopreneurModality] = useState('');

  // STEP 3: Soluciones Concretas y Redes
  const [sol1Title, setSol1Title] = useState('');
  const [sol1Problem, setSol1Problem] = useState('');
  const [sol1Result, setSol1Result] = useState('');
  const [sol1Cta, setSol1Cta] = useState('');

  const [sol2Title, setSol2Title] = useState('');
  const [sol2Problem, setSol2Problem] = useState('');
  const [sol2Result, setSol2Result] = useState('');

  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState('');

  // STEP 4: Facturación CFDI 4.0 y Legal
  const [requiresInvoice, setRequiresInvoice] = useState(false);
  const [rfc, setRfc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('612');
  const [usoCFDI, setUsoCFDI] = useState('G03');
  const [emailFacturacion, setEmailFacturacion] = useState('');
  const [formaPago, setFormaPago] = useState('03');
  const [clientPin, setClientPin] = useState('1234');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  // Validation Helpers
  const cleanRfc = rfc.trim().toUpperCase();
  const isRfcValid =
    !requiresInvoice ||
    cleanRfc.length === 0 ||
    /^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i.test(
      cleanRfc
    );
  const isCpValid =
    !requiresInvoice || codigoPostal.trim().length === 0 || /^[0-9]{5}$/.test(codigoPostal.trim());

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!name.trim()) return onShowToast('Por favor escribe tu nombre completo.');
      if (!role.trim()) return onShowToast('Por favor escribe tu cargo o especialidad.');
      if (!phone.trim()) return onShowToast('Por favor escribe tu número de teléfono / WhatsApp.');
      if (!email.trim()) return onShowToast('Por favor escribe tu correo electrónico.');
      if (!shortName.trim()) {
        const first = name.trim().split(' ')[0] || 'Profesional';
        setShortName(first);
      }
    }
    if (currentStep === 2) {
      if (!valueProp.trim()) {
        return onShowToast('Por favor escribe una breve propuesta de valor (a quién ayudas y qué resuelves).');
      }
    }
    if (currentStep === 3) {
      if (!sol1Title.trim()) {
        return onShowToast('Por favor describe al menos tu solución o servicio principal.');
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const generateSlug = (raw: string): string => {
    let slug = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!slug) slug = `tarjeta-${Date.now().toString().slice(-4)}`;

    let candidate = slug;
    let counter = 2;
    while (existingIds.includes(candidate)) {
      candidate = `${slug}-${counter}`;
      counter++;
    }
    return candidate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      onShowToast('Debes aceptar el Aviso de Privacidad y Términos para continuar.');
      return;
    }

    if (requiresInvoice) {
      if (!cleanRfc || !isRfcValid) {
        onShowToast('Por favor ingresa un RFC válido para tu factura.');
        return;
      }
      if (!codigoPostal || !isCpValid) {
        onShowToast('Por favor ingresa un Código Postal fiscal de 5 dígitos.');
        return;
      }
      if (!razonSocial.trim()) {
        onShowToast('Por favor escribe tu Razón Social fiscal.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const publicId = generateSlug(name);
      const uid = `tc-${Date.now().toString().slice(-6)}`;

      // Format custom fields
      const customFields: ProfileCustomFields = {};
      if (professionalProfile === 'salud') {
        customFields.medicalProfession = medicalProfession || undefined;
        customFields.licenseId = medicalLicense || undefined;
        customFields.institution = medicalInstitution || undefined;
        customFields.bookingUrl = calendarUrl.trim() || undefined;
      } else if (professionalProfile === 'comercial_asesor') {
        customFields.sector = commercialSector || undefined;
        customFields.territory = commercialTerritory || undefined;
      } else if (professionalProfile === 'empresario_dueno') {
        customFields.coreCapabilities = businessCapabilities || undefined;
      } else if (professionalProfile === 'emprendedor_solopreneur') {
        customFields.modality = solopreneurModality || undefined;
      }

      // Format solutions
      const solutions: CardSolution[] = [
        {
          title: sol1Title.trim(),
          desc: sol1Result.trim() || sol1Problem.trim() || 'Solución profesional integral.',
          problem: sol1Problem.trim() || undefined,
          solution: sol1Result.trim() || undefined,
          ctaText: sol1Cta.trim() || 'Consultar este servicio',
          ctaMessage: `Hola ${shortName || name}, me interesa cotizar tu servicio: ${sol1Title.trim()}`
        }
      ];

      if (sol2Title.trim()) {
        solutions.push({
          title: sol2Title.trim(),
          desc: sol2Result.trim() || sol2Problem.trim() || 'Servicio especializado.',
          problem: sol2Problem.trim() || undefined,
          solution: sol2Result.trim() || undefined,
          ctaText: 'Solicitar informe',
          ctaMessage: `Hola ${shortName || name}, me interesa conocer más sobre: ${sol2Title.trim()}`
        });
      }

      // Format fiscal data
      const fiscalData: FiscalDataCFDI = {
        requiresInvoice,
        rfc: cleanRfc || undefined,
        razonSocial: razonSocial.trim().toUpperCase() || undefined,
        codigoPostal: codigoPostal.trim() || undefined,
        regimenFiscal: requiresInvoice ? regimenFiscal : undefined,
        usoCFDI: requiresInvoice ? usoCFDI : undefined,
        emailFacturacion: (emailFacturacion.trim() || email.trim()) || undefined,
        formaPago: requiresInvoice ? formaPago : undefined,
        claveSatProducto: '82101603',
        claveSatUnidad: 'E48',
        updatedAt: new Date().toISOString()
      };

      const newProfile: ParticipantProfile = {
        publicId,
        uid,
        published: true,
        name: name.trim(),
        shortName: shortName.trim() || name.trim().split(' ')[0],
        role: role.trim(),
        company: company.trim() || 'Profesional Independiente',
        logoUrl: logoUrl.trim() || undefined,
        city: city.trim() || 'Santiago de Querétaro, Qro.',
        showLocation: locationMode !== 'remoto',
        locationMode,
        address: address.trim() || undefined,
        googleMapsUrl: googleMapsUrl.trim() || undefined,
        status: 'Activo',
        statusActive: true,
        avatarUrl: avatarUrl.trim() || SAMPLE_AVATARS[0],
        avatarAlt: `Foto de ${name.trim()}`,
        verified: true,
        themeKey,
        bannerTheme: 'modern',
        phone: phone.trim().startsWith('+') ? phone.trim() : `+52${phone.trim().replace(/[^0-9]/g, '')}`,
        email: email.trim(),
        calendarUrl: calendarUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        valueProp: valueProp.trim(),
        solutions,
        networkingTargets: [
          'Empresas y directores en el Bajío',
          'Clientes que requieran soluciones profesionales directas',
          'Alianzas estratégicas y vinculación comercial'
        ],
        links: [
          ...(websiteUrl.trim()
            ? [{ label: 'Sitio Web Oficial', url: websiteUrl.trim(), icon: 'Globe' }]
            : []),
          ...(calendarUrl.trim()
            ? [{ label: 'Agendar Cita Directa', url: calendarUrl.trim(), icon: 'Calendar' }]
            : [])
        ],
        socialLinks: {
          linkedin: linkedin.trim() || undefined,
          instagram: instagram.trim() || undefined,
          website: websiteUrl.trim() || undefined
        },
        introVideo: introVideoUrl.trim()
          ? {
              title: `Presentación de ${name.trim()}`,
              url: introVideoUrl.trim()
            }
          : undefined,
        pin: clientPin.trim() || String(Math.floor(1000 + Math.random() * 9000)),
        professionalProfile,
        customFields,
        fiscalData,
        features: {
          hasMiniCrm: true,
          hasMeetingIntelligence: false,
          aiMinutesQuota: 0,
          aiMinutesUsed: 0
        }
      };

      // Save to Firestore
      await saveCloudProfile(newProfile);

      setSubmittedProfile(newProfile);
      onSuccess(newProfile);
      onShowToast(`¡Felicidades ${newProfile.shortName}! Tu tarjeta digital está activa.`);
    } catch (err) {
      console.error('[Onboarding] Error creating card:', err);
      onShowToast('Hubo un inconveniente al guardar. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLegalModalWithTab = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setShowLegalModal(true);
  };

  // SUCCESS SCREEN
  if (submittedProfile) {
    const cardUrl = `${window.location.origin}/c/${submittedProfile.publicId}`;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 uppercase tracking-wider">
              Tarjeta Digital Activa en Vivo
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1a1c1c]">
              ¡Bienvenido a RedConecta MX!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
              Tu tarjeta ejecutiva para <strong>{submittedProfile.name}</strong> ha sido creada y configurada con éxito.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-1.5 font-mono text-xs text-stone-700">
            <div className="flex items-center justify-between text-stone-500 font-sans text-[11px]">
              <span>Enlace Oficial de tu Tarjeta:</span>
              <span className="text-emerald-700 font-bold">100% Online</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-stone-200 text-[#00685f] font-bold truncate">
              {cardUrl}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <a
              href={cardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver mi Tarjeta en Vivo</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(cardUrl);
                onShowToast('Enlace copiado al portapapeles.');
              }}
              className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Enlace</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-700 underline pt-1 cursor-pointer"
          >
            Cerrar y volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-[#00685f] to-emerald-600" />

        {/* Modal Top Header */}
        <div className="p-5 pb-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center shadow-xs shrink-0 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#1a1c1c]">
                  Alta de Tarjeta Digital Ejecutiva
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wide">
                  Autoservicio
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Tribu Creativa QRO • RedConecta MX | Paso {currentStep} de 4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Cerrar asistente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="bg-white px-5 pt-3 pb-2 border-b border-stone-200">
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold mb-2">
            <div className={currentStep >= 1 ? 'text-[#00685f]' : 'text-stone-400'}>
              1. Identidad
            </div>
            <div className={currentStep >= 2 ? 'text-[#00685f]' : 'text-stone-400'}>
              2. Perfil
            </div>
            <div className={currentStep >= 3 ? 'text-[#00685f]' : 'text-stone-400'}>
              3. Soluciones
            </div>
            <div className={currentStep >= 4 ? 'text-[#00685f]' : 'text-stone-400'}>
              4. Factura & Legal
            </div>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-[#00685f] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* STEP 1: IDENTIDAD Y CONTACTO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 flex items-start gap-3">
                <User className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Paso 1: Tu Identidad Profesional</h4>
                  <p className="text-[11px] text-teal-800/90 mt-0.5">
                    Estos datos aparecerán en el encabezado de tu tarjeta y en la ficha de contacto que tus clientes guardarán en su teléfono.
                  </p>
                </div>
              </div>

              {/* Foto de Perfil Selection */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Fotografía Profesional (URL o Selecciona una de muestra) *
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl border-2 border-[#00685f] overflow-hidden bg-stone-100 shrink-0 shadow-xs">
                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="https://enlace-a-tu-foto.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-stone-400">Fotos de muestra:</span>
                      {SAMPLE_AVATARS.map((url, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setAvatarUrl(url)}
                          className="w-6 h-6 rounded-full overflow-hidden border border-stone-300 hover:border-[#00685f] transition-all cursor-pointer"
                        >
                          <img src={url} alt={`Muestra ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nombre y Nombre de Pila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Nombre Completo (con título si aplica) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mtra. Sofía Valenzuela Cárdenas"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Nombre Corto / De Pila (para botones y saludos) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
              </div>

              {/* Cargo y Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Cargo o Especialidad Principal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Consultora en Liderazgo y Retención"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Empresa, Consultorio o Marca Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Valenzuela & Asociados"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
              </div>

              {/* WhatsApp y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Teléfono Celular con WhatsApp (10 dígitos) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 442 389 4512"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Correo Electrónico Profesional *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="sofia@valenzuela.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Ciudad y Modalidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Ciudad / Estado
                  </label>
                  <input
                    type="text"
                    placeholder="Santiago de Querétaro, Qro."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Modalidad de Atención
                  </label>
                  <select
                    value={locationMode}
                    onChange={(e) => setLocationMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  >
                    <option value="hibrido">Híbrida (Presencial y Remoto)</option>
                    <option value="presencial">Presencial (Consultorio / Oficina)</option>
                    <option value="remoto">100% Remoto / En línea</option>
                  </select>
                </div>
              </div>

              {locationMode !== 'remoto' && (
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Dirección Física / Consultorio (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Av. Constituyentes 120 Pte., Col. El Carrizal, Querétaro, Qro."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
              )}

              {/* Enlace para Agendar Citas y Reuniones */}
              <div className="pt-2 border-t border-stone-200/80">
                <CalendarUrlInput
                  value={calendarUrl}
                  onChange={setCalendarUrl}
                  label="Enlace para Agendar Citas o Reuniones"
                  helpText="Si colocas tu enlace de Google Calendar, Outlook o Calendly, se habilitará el botón 'Agendar' en tu tarjeta digital."
                />
              </div>
            </div>
          )}

          {/* STEP 2: PERFIL PROFESIONAL Y PROPUESTA */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Paso 2: Tu Perfil y Propuesta de Valor</h4>
                  <p className="text-[11px] text-teal-800/90 mt-0.5">
                    Selecciona el perfil que mejor describe tu actividad para adaptar los campos específicos de tu profesión.
                  </p>
                </div>
              </div>

              {/* Selector de Perfil */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  Selecciona tu Perfil Profesional *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'profesional_independiente', label: 'Independiente / Consultor' },
                    { id: 'comercial_asesor', label: 'Comercial / Ventas' },
                    { id: 'empresario_dueno', label: 'Empresario / Dueño' },
                    { id: 'emprendedor_solopreneur', label: 'Emprendedor / Solopreneur' },
                    { id: 'salud', label: 'Sector Salud' },
                    { id: 'ejecutivo_directivo', label: 'Directivo / Ejecutivo' }
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setProfessionalProfile(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        professionalProfile === p.id
                          ? 'border-[#00685f] bg-teal-50/70 text-[#00685f] shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-[11px]">{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos dinámicos de Salud */}
              {professionalProfile === 'salud' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-950">
                    <Stethoscope className="w-4 h-4 text-emerald-700" />
                    <span>Campos Especiales para Profesionales de la Salud</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Profesión Sanitaria / Especialidad
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Cardiología Pediátrica"
                        value={medicalProfession}
                        onChange={(e) => setMedicalProfession(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Cédula Profesional Federal
                      </label>
                      <input
                        type="text"
                        placeholder="Céd. Prof. 8492014 / Céd. Esp. 1293810"
                        value={medicalLicense}
                        onChange={(e) => setMedicalLicense(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Propuesta de Valor */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  ¿A quién ayudas y qué problema o reto resuelves? (Propuesta de Valor) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej. Ayudo a directores y empresas en el Bajío a reducir la rotación operativa y profesionalizar mandos medios con programas de cultura y liderazgo con métricas claras."
                  value={valueProp}
                  onChange={(e) => setValueProp(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] resize-none"
                />
              </div>

              {/* Estilo Visual / Tema */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  Estilo Visual de tu Tarjeta
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ejecutivo', label: 'Ejecutivo (Esmeralda / Teal)' },
                    { id: 'negocio', label: 'Negocio (Oscuro / Corporativo)' },
                    { id: 'personal', label: 'Cálido (Tierra / Terracota)' }
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setThemeKey(t.id as any)}
                      className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                        themeKey === t.id
                          ? 'border-[#00685f] bg-teal-50 text-[#00685f]'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SOLUCIONES Y REDES */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Paso 3: Tus Soluciones y Redes</h4>
                  <p className="text-[11px] text-teal-800/90 mt-0.5">
                    Muestra evidencia concreta de cómo resuelves las necesidades de tus clientes para generar credibilidad inmediata.
                  </p>
                </div>
              </div>

              {/* Solución 1 */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <span className="font-extrabold text-xs text-stone-900 block">
                  Solución o Servicio Principal *
                </span>
                <div>
                  <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                    Título de la Solución o Servicio
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Diagnóstico de Clima y Retención de Talento"
                    value={sol1Title}
                    onChange={(e) => setSol1Title(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                      ¿Qué reto o dolor atiende?
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Rotación de personal superior al 15%"
                      value={sol1Problem}
                      onChange={(e) => setSol1Problem(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                      ¿Qué resultado o cambio facilita?
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Reducción a 4% en 90 días con evaluación 360°"
                      value={sol1Result}
                      onChange={(e) => setSol1Result(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    />
                  </div>
                </div>
              </div>

              {/* Redes Sociales y Enlaces */}
              <div className="space-y-2.5">
                <span className="font-extrabold text-xs text-stone-900 block">
                  Redes Sociales y Enlaces Clave
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-1">
                      Perfil de LinkedIn (Recomendado)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/tu-perfil"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                      />
                      <Linkedin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-1">
                      Sitio Web Oficial o Catálogo
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://tuempresa.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                      />
                      <Globe className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FACTURACIÓN CFDI 4.0 Y LEGAL */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 flex items-start gap-3">
                <ReceiptText className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Paso 4: Facturación CFDI 4.0 y Validación Legal</h4>
                  <p className="text-[11px] text-teal-800/90 mt-0.5">
                    Tu suscripción es 100% deducible de impuestos. Si requieres factura fiscal en México, completa tus datos oficiales del SAT.
                  </p>
                </div>
              </div>

              {/* Switch Facturación */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">
                    ¿Requieres Factura Fiscal Electrónica (CFDI 4.0)?
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Clave SAT 82101603 (Publicidad en internet / Deducible)
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requiresInvoice}
                    onChange={(e) => setRequiresInvoice(e.target.checked)}
                    className="w-4 h-4 text-[#00685f] rounded border-stone-300 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#00685f]">
                    {requiresInvoice ? 'Sí, facturar' : 'No'}
                  </span>
                </label>
              </div>

              {requiresInvoice && (
                <div className="p-4 rounded-2xl bg-white border border-stone-300 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        RFC (12 o 13 caracteres) *
                      </label>
                      <input
                        type="text"
                        maxLength={13}
                        placeholder="Ej. VACS850412HN2"
                        value={rfc}
                        onChange={(e) => setRfc(e.target.value.toUpperCase())}
                        className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs font-mono uppercase focus:outline-none ${
                          !isRfcValid ? 'border-rose-400 bg-rose-50' : 'border-stone-200'
                        }`}
                      />
                      {!isRfcValid && (
                        <span className="text-[10px] text-rose-600 block mt-0.5">
                          Formato de RFC inválido ante el SAT
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Código Postal Fiscal (5 dígitos) *
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="Ej. 76000"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value.replace(/[^0-9]/g, ''))}
                        className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs font-mono focus:outline-none ${
                          !isCpValid ? 'border-rose-400 bg-rose-50' : 'border-stone-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Nombre o Razón Social (Sin S.A. de C.V. conforme a CFDI 4.0) *
                    </label>
                    <input
                      type="text"
                      placeholder="Tal cual aparece en tu Constancia de Situación Fiscal"
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Régimen Fiscal *
                      </label>
                      <select
                        value={regimenFiscal}
                        onChange={(e) => setRegimenFiscal(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                      >
                        {REGIMENES_SAT.map((r) => (
                          <option key={r.code} value={r.code}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Uso de CFDI *
                      </label>
                      <select
                        value={usoCFDI}
                        onChange={(e) => setUsoCFDI(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                      >
                        {USOS_CFDI.map((u) => (
                          <option key={u.code} value={u.code}>
                            {u.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PIN de Acceso Privado */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-stone-700" />
                  <span className="font-bold text-xs text-stone-900">
                    PIN de Seguridad para tu Portal Privado (4 dígitos)
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Con este PIN podrás consultar las métricas de visitas, contactos y prospectos de tu tarjeta.
                </p>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={clientPin}
                  onChange={(e) => setClientPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-28 px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-center tracking-widest focus:outline-none focus:border-[#00685f]"
                />
              </div>

              {/* Consentimiento LFPDPPP & Términos */}
              <div className="pt-2 border-t border-stone-200">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#00685f] rounded border-stone-300 focus:ring-teal-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-stone-600 leading-snug">
                    He leído y acepto el{' '}
                    <button
                      type="button"
                      onClick={() => openLegalModalWithTab('privacy')}
                      className="text-[#00685f] font-bold underline hover:text-[#008378]"
                    >
                      Aviso de Privacidad (LFPDPPP)
                    </button>{' '}
                    y los{' '}
                    <button
                      type="button"
                      onClick={() => openLegalModalWithTab('terms')}
                      className="text-[#00685f] font-bold underline hover:text-[#008378]"
                    >
                      Términos y Condiciones del Servicio
                    </button>
                    . Declaro bajo protesta de decir verdad que los datos y cédulas manifestadas son verídicos.
                  </div>
                </label>
              </div>
            </div>
          )}
        </form>

        {/* Modal Navigation Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !acceptedTerms}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Creando tu tarjeta...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🚀 Activar y Publicar mi Tarjeta</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Embedded Legal Notice Modal */}
      <LegalNoticeModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalModalTab}
        onShowToast={onShowToast}
      />
    </div>
  );
};
