import React, { useState, useEffect } from 'react';
import {
  ParticipantProfile,
  CardTheme,
  ProfessionalProfileType,
  ProfileCustomFields
} from '../types/card';
import {
  PROFESSIONAL_PROFILES,
  ALL_PROFESSIONAL_PROFILE_IDS,
  getProfileConfig,
  DEFAULT_PROFESSIONAL_PROFILE
} from '../data/professionalProfiles';
import { X, Plus, Sparkles, CheckCircle2, Layers, Palette, Globe, Briefcase } from 'lucide-react';
import { CalendarUrlInput } from './CalendarUrlInput';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProfile: ParticipantProfile) => void;
  onShowToast: (msg: string) => void;
  existingCount: number;
  existingIds?: string[];
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onShowToast,
  existingCount,
  existingIds = []
}) => {
  const [professionalProfile, setProfessionalProfile] =
    useState<ProfessionalProfileType>(DEFAULT_PROFESSIONAL_PROFILE);
  const [themeKey, setThemeKey] = useState<CardTheme>('ejecutivo');
  const [locationMode, setLocationMode] = useState<'presencial' | 'remoto' | 'hibrido'>('presencial');
  const [customFields, setCustomFields] = useState<ProfileCustomFields>({});

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [publicId, setPublicId] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Ciudad de México');
  const [phone, setPhone] = useState('+5255');
  const [email, setEmail] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [service1, setService1] = useState('');
  const [service1Desc, setService1Desc] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');

  const activeCfg = getProfileConfig(professionalProfile, 'es');

  // Reset form completely whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setProfessionalProfile(DEFAULT_PROFESSIONAL_PROFILE);
      setThemeKey('ejecutivo');
      setLocationMode('presencial');
      setCustomFields({});
      setName('');
      setShortName('');
      setPublicId('');
      setRole('');
      setCompany('');
      setCity('Ciudad de México');
      setPhone('+5255');
      setEmail('');
      setValueProp('');
      setService1('');
      setService1Desc('');
      setLinkedinUrl('');
      setInstagramUrl('');
      setWebsiteUrl('');
      setCalendarUrl('');
      setAvatarUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto generate slug and shortName synchronously from name
  const handleNameChange = (val: string) => {
    setName(val);
    const cleaned = val.replace(/^(Mtra\.|Mtro\.|Ing\.|Lic\.|Dr\.|Dra\.)\s+/i, '').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    setShortName(parts.slice(0, 2).join(' '));

    const slug = cleaned
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setPublicId(slug || (val.trim() ? `tarjeta-${existingCount + 1}` : ''));
  };

  const handleCustomFieldChange = (key: keyof ProfileCustomFields, val: string) => {
    setCustomFields((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  // Preset data loader for each of the 7 professional profiles
  const applyPresetForProfile = (type: ProfessionalProfileType) => {
    setProfessionalProfile(type);
    const cfg = PROFESSIONAL_PROFILES[type];
    const helpers = cfg.sampleHelpers;

    switch (type) {
      case 'profesional_independiente':
        setName('Lic. Mariana Rivas');
        setShortName('Mariana Rivas');
        setPublicId('mariana-rivas');
        setRole(helpers.role);
        setCompany(helpers.company);
        setCity('Guadalajara, Jal.');
        setPhone('+523312345678');
        setEmail('mariana@rivas-talento.mx');
        setThemeKey('ejecutivo');
        setLocationMode('remoto');
        setAvatarUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80');
        setValueProp(helpers.valueProp);
        setService1(helpers.sampleCase.title);
        setService1Desc(helpers.sampleCase.solution);
        setCustomFields({
          specialty: 'Desarrollo Organizacional & Retención',
          clientType: 'Pymes y Startups en expansión',
          serviceScope: 'Nacional (México)'
        });
        break;

      case 'comercial_asesor':
        setName('Carlos Mendoza');
        setShortName('Carlos Mendoza');
        setPublicId('carlos-mendoza');
        setRole(helpers.role);
        setCompany(helpers.company);
        setCity('Ciudad de México');
        setPhone('+525541238901');
        setEmail('carlos.mendoza@seguros-mendoza.mx');
        setThemeKey('negocio');
        setLocationMode('hibrido');
        setAvatarUrl('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80');
        setValueProp(helpers.valueProp);
        setService1(helpers.sampleCase.title);
        setService1Desc(helpers.sampleCase.solution);
        setCustomFields({
          sector: 'Seguros Corporativos y Fianzas',
          territory: 'CDMX y Zona Metropolitana',
          solutionLines: 'Hombre Clave, GMM Colectivo, RC'
        });
        break;

      case 'emprendedor_solopreneur':
        setName('Rodrigo Salgado');
        setShortName('Rodrigo Salgado');
        setPublicId('rodrigo-salgado');
        setRole(helpers.role);
        setCompany(helpers.company);
        setCity('Veracruz / CDMX');
        setPhone('+522281234567');
        setEmail('rodrigo@cafehuatusco.mx');
        setThemeKey('personal');
        setLocationMode('hibrido');
        setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80');
        setValueProp(helpers.valueProp);
        setService1(helpers.sampleCase.title);
        setService1Desc(helpers.sampleCase.solution);
        setCustomFields({
          category: 'Alimentos y Bebidas de Especialidad',
          modality: 'B2B Suministro a barras y venta online',
          serviceZone: 'Envíos nacionales'
        });
        break;

      case 'empresario_dueno':
        setName('Ing. Roberto Garza');
        setShortName('Roberto Garza');
        setPublicId('roberto-garza');
        setRole(helpers.role);
        setCompany(helpers.company);
        setCity('Monterrey, N.L.');
        setPhone('+528181234567');
        setEmail('rgarza@estructurasgarza.mx');
        setThemeKey('negocio');
        setLocationMode('presencial');
        setAvatarUrl('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80');
        setValueProp(helpers.valueProp);
        setService1(helpers.sampleCase.title);
        setService1Desc(helpers.sampleCase.solution);
        setCustomFields({
          sectorsServed: 'Industrial, Automotriz, Logística',
          coverage: 'Zona Norte y Bajío',
          coreCapabilities: 'Fabricación CNC, Montaje Pesado, ISO 9001'
        });
        break;

      case 'ejecutivo_directivo':
        setName('Ing. Valeria Treviño');
        setShortName('Valeria Treviño');
        setPublicId('valeria-trevino');
        setRole(helpers.role);
        setCompany(helpers.company);
        setCity('Monterrey, N.L.');
        setPhone('+528189876543');
        setEmail('valeria.trevino@nubesegura.mx');
        setThemeKey('ejecutivo');
        setLocationMode('hibrido');
        setAvatarUrl('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80');
        setValueProp(helpers.valueProp);
        setService1(helpers.sampleCase.title);
        setService1Desc(helpers.sampleCase.solution);
        setCustomFields({
          department: 'Dirección de Tecnología & Transformación Digital',
          leadershipScope: 'Latinoamérica (México, Colombia, Chile)',
          liaisonTopics: 'Gobierno de TI, Ciberseguridad, Talento Tech'
        });
        break;

      case 'salud':
        setName('Dra. Mariana Álvarez');
        setShortName('Dra. Mariana Álvarez');
        setPublicId('dra-mariana-alvarez');
        setRole(helpers.role);
        setCompany(helpers.company);
        setCity('Santiago de Querétaro, Qro.');
        setPhone('+524423456789');
        setEmail('contacto@dramarianaalvarez.mx');
        setThemeKey('personal');
        setLocationMode('presencial');
        setAvatarUrl('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80');
        setValueProp(helpers.valueProp);
        setService1(helpers.sampleCase.title);
        setService1Desc(helpers.sampleCase.solution);
        setCustomFields({
          medicalProfession: 'Médica Cirujana',
          medicalSpecialty: 'Pediatría y Neonatología',
          licenseId: 'Céd. Prof. 9845210 / Esp. 4512980',
          institution: 'Facultad de Medicina UNAM / Hospital Infantil',
          bookingUrl: 'https://www.doctoralia.com.mx'
        });
        break;

      case 'institucional_publico':
        setName('Lic. Arturo Villarreal');
        setShortName('Lic. Arturo Villarreal');
        setPublicId('lic-arturo-villarreal');
        setRole(helpers.role);
        setCompany(helpers.company);
        setCity('Santiago de Querétaro, Qro.');
        setPhone('+524421234567');
        setEmail('arturo.villarreal@queretaro.gob.mx');
        setThemeKey('ejecutivo');
        setLocationMode('presencial');
        setAvatarUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80');
        setValueProp(helpers.valueProp);
        setService1(helpers.sampleCase.title);
        setService1Desc(helpers.sampleCase.solution);
        setCustomFields({
          institutionName: 'Secretaría de Desarrollo Sustentable',
          institutionalDepartment: 'Dirección de Vinculación y Competitividad',
          territorialScope: 'Estatal (Querétaro)',
          publicLiaisonTopics: 'Mesa de Atención a Cámaras y Clústeres'
        });
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let cleanId = (publicId || `tarjeta-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');

    if (existingIds.includes(cleanId)) {
      cleanId = `${cleanId}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCard: ParticipantProfile = {
      publicId: cleanId,
      uid: `MX-${city.substring(0, 3).toUpperCase()}-${randomNum}`,
      published: true,
      name: name || 'Nuevo Titular',
      shortName: shortName || name.split(' ')[0] || 'Titular',
      role: role || activeCfg.labels.rolePlaceholder,
      company: company || activeCfg.labels.companyPlaceholder,
      city: city || 'México',
      showLocation: locationMode !== 'remoto',
      locationMode,
      status: 'Disponible para conectar',
      statusActive: true,
      avatarUrl:
        avatarUrl.trim() ||
        (themeKey === 'negocio'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
          : themeKey === 'personal'
          ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80'),
      avatarAlt: `Foto de ${name}`,
      // In accordance with requirement 6: selecting a profession does NOT automatically grant verification
      verified: false,
      professionalProfile,
      customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
      themeKey,
      bannerTheme:
        themeKey === 'negocio'
          ? 'from-emerald-950 via-teal-900 to-emerald-900'
          : themeKey === 'personal'
          ? 'from-stone-900 via-amber-950 to-orange-950'
          : 'from-slate-900 via-slate-800 to-slate-950',
      phone: phone || '+525541234567',
      whatsappCustomMessage: `Hola ${shortName || name}, vi tu tarjeta digital en Tribu Creativa QRO • RedConecta MX y me gustaría conectar.`,
      email: email || `${cleanId}@tribucreativa.mx`,
      calendarUrl: calendarUrl.trim() || customFields.bookingUrl || undefined,
      websiteUrl: websiteUrl || 'https://tribucreativaqro.web.app',
      valueProp: valueProp || activeCfg.labels.valuePropPlaceholder,
      socialLinks: {
        linkedin: linkedinUrl || undefined,
        instagram: instagramUrl || undefined,
        website: websiteUrl || undefined
      },
      seoDescription: valueProp || `${role} en ${company}. Tarjeta Digital ejecutiva en ${city}.`,
      seoKeywords: [name, shortName, role, company, city, 'Networking', 'Tribu Creativa QRO'],
      solutions: [
        {
          title: service1 || activeCfg.sampleHelpers.sampleCase.title,
          desc: service1Desc || activeCfg.sampleHelpers.sampleCase.solution,
          problem: activeCfg.sampleHelpers.sampleCase.problem,
          solution: service1Desc || activeCfg.sampleHelpers.sampleCase.solution,
          ctaText: activeCfg.labels.solutionCtaDefault,
          ctaMessage: `Hola ${shortName || name}, vi tu tarjeta digital y me interesa platicar sobre una necesidad similar.`
        }
      ],
      networkingTargets: [
        'Directores generales y tomadores de decisión.',
        'Aliados estratégicos y colaboradores del sector.'
      ],
      links: [
        ...(calendarUrl.trim() || customFields.bookingUrl
          ? [
              {
                label: 'Agendar Reunión 1 a 1',
                icon: 'calendar_month',
                url: calendarUrl.trim() || customFields.bookingUrl || '',
                category: 'Agenda'
              }
            ]
          : []),
        ...(linkedinUrl
          ? [
              {
                label: 'Conectar en LinkedIn',
                icon: 'open_in_new',
                url: linkedinUrl,
                category: 'Redes' as const
              }
            ]
          : [])
      ],
      pin: String(Math.floor(1000 + Math.random() * 9000)),
      features: {
        hasMiniCrm: true,
        hasMeetingIntelligence: false,
        aiMinutesQuota: 120,
        aiMinutesUsed: 0
      }
    };

    onCreate(newCard);
    onShowToast(`¡Tarjeta de "${newCard.shortName}" creada con éxito! URL: /c/${newCard.publicId}`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#00685f] flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="create-profile-title" className="text-[17px] font-bold text-[#1a1c1c]">
                Crear Nueva Tarjeta Digital Inteligente
              </h3>
              <p className="text-[12px] text-[#6d7a77]">
                Configura los ejes de personalización profesional, visual y modalidad de atención
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto custom-scroll space-y-4 text-[13px]">
          {/* EJE A: Selector de Perfil Profesional (7 Perfiles) */}
          <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#00685f]" />
                <span className="font-bold text-stone-900 text-xs sm:text-sm">
                  Eje A: Perfil Profesional ({ALL_PROFESSIONAL_PROFILE_IDS.length} opciones)
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#00685f] bg-teal-100/80 px-2.5 py-0.5 rounded-full border border-teal-300/60">
                {activeCfg.name}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Elige el perfil profesional para adaptar automáticamente etiquetas, preguntas y campos especializados. Puedes hacer clic en un perfil para cargar datos de ejemplo o capturar tus datos reales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {ALL_PROFESSIONAL_PROFILE_IDS.map((pid) => {
                const cfg = PROFESSIONAL_PROFILES[pid];
                const isSelected = professionalProfile === pid;
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => applyPresetForProfile(pid)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00685f] bg-white ring-2 ring-[#00685f]/20 shadow-xs'
                        : 'border-stone-200/90 bg-white/70 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#00685f]' : 'text-stone-800'}`}>
                        {cfg.name.es}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#00685f]" />}
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-1 leading-tight">
                      {cfg.targetAudience.es}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ejes B y C: Estilo Visual & Modalidad de Atención */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <label className="flex items-center gap-1.5 font-bold text-stone-800 text-xs mb-1">
                <Palette className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Eje B: Estilo Visual</span>
              </label>
              <select
                value={themeKey}
                onChange={(e) => setThemeKey(e.target.value as CardTheme)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none bg-white text-xs font-medium"
              >
                <option value="ejecutivo">Ejecutivo (Dark Slate & Jade / Servicios)</option>
                <option value="negocio">Negocio (Limpio & Warm Stone / Productos)</option>
                <option value="personal">Personal (Cálido & Sunset / Cercano)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-bold text-stone-800 text-xs mb-1">
                <Globe className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Eje C: Modalidad de Atención</span>
              </label>
              <select
                value={locationMode}
                onChange={(e) => setLocationMode(e.target.value as 'presencial' | 'remoto' | 'hibrido')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none bg-white text-xs font-medium"
              >
                <option value="presencial">Presencial (Consultorio, local o despacho)</option>
                <option value="remoto">En línea / Servicio digital (Sin local físico)</option>
                <option value="hibrido">Híbrido (Atención digital y presencial)</option>
              </select>
            </div>
          </div>

          {/* Identity: Name & URL Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Nombre Completo del Titular</label>
              <input
                type="text"
                placeholder="Ej. Lic. Mariana Rivas"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Identificador de URL Pública (Slug)</label>
              <div className="flex items-center rounded-xl border border-stone-300 px-3 py-2 bg-stone-50">
                <span className="text-stone-400 text-xs font-mono">/c/</span>
                <input
                  type="text"
                  placeholder="mariana-rivas"
                  value={publicId}
                  onChange={(e) => setPublicId(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono text-stone-900 border-none focus:outline-none p-0 ml-0.5"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role & Company adapted dynamically by Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {activeCfg.labels.roleLabel}
              </label>
              <input
                type="text"
                placeholder={activeCfg.labels.rolePlaceholder}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {activeCfg.labels.companyLabel}
              </label>
              <input
                type="text"
                placeholder={activeCfg.labels.companyPlaceholder}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Specialized Optional Fields for Selected Profile */}
          {activeCfg.optionalFields.filter((f) => f.key !== 'bookingUrl').length > 0 && (
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00685f]" />
                <label className="font-bold text-stone-800 text-xs sm:text-sm">
                  Campos Opcionales Especializados ({activeCfg.name})
                </label>
              </div>
              <p className="text-[11px] text-stone-500">
                Completa solo los que apliquen a tu titular; se omiten automáticamente si quedan vacíos.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {activeCfg.optionalFields
                  .filter((field) => field.key !== 'bookingUrl')
                  .map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={customFields[field.key] || ''}
                        onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:border-[#00685f] focus:outline-none"
                      />
                      {field.helpText && (
                        <p className="text-[10px] text-stone-400 mt-1">{field.helpText}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Ciudad o Región</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">WhatsApp (+52...)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Nombre Corto</label>
              <input
                type="text"
                placeholder="Ej. Mariana"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Foto de Perfil / Avatar (URL)</label>
              <input
                type="url"
                placeholder="https://... o usa una plantilla"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Agenda y Citas */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <CalendarUrlInput
              value={calendarUrl}
              onChange={setCalendarUrl}
              label="Enlace para Agendar Citas y Reuniones"
              helpText="Permite a prospectos agendar directamente en Google Calendar, Outlook, Calendly o Doctoralia."
            />
          </div>

          {/* Value Prop */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              {activeCfg.labels.valuePropLabel}
            </label>
            <textarea
              rows={2}
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              placeholder={activeCfg.labels.valuePropPlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
              required
            />
          </div>

          {/* Quick 1st Service */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block font-semibold text-stone-700 mb-1">
              Primer Caso / Solución Destacada
            </label>
            <input
              type="text"
              placeholder="Título del servicio o reto atendido"
              value={service1}
              onChange={(e) => setService1(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mb-1.5 bg-white"
            />
            <textarea
              rows={1}
              placeholder="Estrategia aplicada y resultado o avance documentado"
              value={service1Desc}
              onChange={(e) => setService1Desc(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
            />
          </div>

          {/* Links & Socials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Sitio Web</label>
              <input
                type="url"
                placeholder="https://..."
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">LinkedIn</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Instagram</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Tarjeta Digital</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
