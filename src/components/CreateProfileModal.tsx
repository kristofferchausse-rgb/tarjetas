import React, { useState, useEffect } from 'react';
import { ParticipantProfile, CardTheme } from '../types/card';
import { X, Plus, Sparkles, UserCheck, Layers } from 'lucide-react';

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
  const [template, setTemplate] = useState<'consultor' | 'comercio' | 'tech'>('consultor');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [publicId, setPublicId] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Ciudad de México');
  const [phone, setPhone] = useState('+5255');
  const [email, setEmail] = useState('');
  const [themeKey, setThemeKey] = useState<CardTheme>('ejecutivo');
  const [valueProp, setValueProp] = useState('');
  const [service1, setService1] = useState('');
  const [service1Desc, setService1Desc] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Reset form completely whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setShortName('');
      setPublicId('');
      setRole('');
      setCompany('');
      setCity('Ciudad de México');
      setPhone('+5255');
      setEmail('');
      setThemeKey('ejecutivo');
      setValueProp('');
      setService1('');
      setService1Desc('');
      setLinkedinUrl('');
      setInstagramUrl('');
      setWebsiteUrl('');
      setAvatarUrl('');
      setTemplate('consultor');
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

  const applyTemplate = (type: 'consultor' | 'comercio' | 'tech') => {
    setTemplate(type);
    if (type === 'consultor') {
      setName('Lic. Mariana Rivas');
      setShortName('Mariana Rivas');
      setPublicId('mariana-rivas');
      setRole('Consultora en Recursos Humanos & Talento');
      setCompany('Rivas People & Culture');
      setCity('Guadalajara, Jal.');
      setPhone('+523312345678');
      setEmail('mariana@rivas-talento.mx');
      setThemeKey('ejecutivo');
      setAvatarUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80');
      setValueProp('Construyo equipos de alto rendimiento y alineación cultural para scale-ups y pymes en expansión.');
      setService1('Atracción de Talento Clave');
      setService1Desc('Headhunting especializado para mandos medios y directivos.');
    } else if (type === 'comercio') {
      setName('Rodrigo Salgado');
      setShortName('Rodrigo Salgado');
      setPublicId('rodrigo-salgado');
      setRole('Fundador & Maestro Cafeticultor');
      setCompany('Café de Origen Huatusco');
      setCity('Veracruz / CDMX');
      setPhone('+522281234567');
      setEmail('rodrigo@cafehuatusco.mx');
      setThemeKey('negocio');
      setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80');
      setValueProp('Llevamos café de especialidad mexicano de estricta altura directamente a cafeterías y empresas.');
      setService1('Suministro de Café de Especialidad');
      setService1Desc('Lotes selectos con tostado personalizado para barras y hoteles.');
    } else {
      setName('Ing. Valeria Treviño');
      setShortName('Valeria Treviño');
      setPublicId('valeria-trevino');
      setRole('Arquitecta de Soluciones Cloud & Ciberseguridad');
      setCompany('NubeSegura MX');
      setCity('Monterrey, N.L.');
      setPhone('+528112345678');
      setEmail('valeria@nubesegura.mx');
      setThemeKey('personal');
      setAvatarUrl('https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80');
      setValueProp('Blindamos la infraestructura digital y bases de datos de empresas medianas ante ransomware y ataques.');
      setService1('Auditoría de Vulnerabilidades');
      setService1Desc('Pentesting preventivo y certificación ISO/IEC 27001.');
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
      name: name || 'Nuevo Participante',
      shortName: shortName || name.split(' ')[0] || 'Participante',
      role: role || 'Profesionista Independiente',
      company: company || 'Empresa Independiente',
      city: city || 'México',
      showLocation: template !== 'consultor',
      locationMode: template === 'consultor' ? 'remoto' : 'presencial',
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
      verified: true,
      themeKey,
      bannerTheme:
        themeKey === 'negocio'
          ? 'from-emerald-950 via-teal-900 to-emerald-900'
          : themeKey === 'personal'
          ? 'from-stone-900 via-amber-950 to-orange-950'
          : 'from-slate-900 via-slate-800 to-slate-950',
      phone: phone || '+525541234567',
      whatsappCustomMessage: `Hola ${shortName || name}, vi tu tarjeta digital en Tribu Creativa QRO y me gustaría conectar.`,
      email: email || `${cleanId}@tribucreativa.mx`,
      calendarUrl: 'https://calendly.com',
      websiteUrl: websiteUrl || 'https://tribucreativaqro.web.app',
      valueProp: valueProp || 'Ayudo a profesionales y organizaciones a optimizar sus resultados con soluciones a la medida.',
      socialLinks: {
        linkedin: linkedinUrl || undefined,
        instagram: instagramUrl || undefined,
        website: websiteUrl || undefined
      },
      seoDescription: valueProp || `${role} en ${company}. Tarjeta Digital ejecutiva en ${city}.`,
      seoKeywords: [name, shortName, role, company, city, 'Networking', 'Tribu Creativa QRO'],
      solutions: [
        {
          title: service1 || 'Asesoría Inicial & Diagnóstico',
          desc: service1Desc || 'Evaluación de necesidades y plan de acción de alto impacto.',
          problem: 'Reto o necesidad principal que enfrentan los clientes en el sector.',
          solution: service1Desc || 'Estrategia y acompañamiento para resolver el reto con resultados medibles.',
          ctaText: '¿Tienes una necesidad similar?',
          ctaMessage: `Hola ${shortName || name}, vi tu tarjeta digital y me interesa platicar sobre una necesidad similar.`
        }
      ],
      networkingTargets: [
        'Directores generales y tomadores de decisión.',
        'Aliados estratégicos y colaboradores del sector.'
      ],
      links: [
        {
          label: 'Agendar Reunión 1 a 1',
          icon: 'calendar_month',
          url: 'https://calendly.com',
          category: 'Agenda'
        },
        ...(linkedinUrl ? [{
          label: 'Conectar en LinkedIn',
          icon: 'open_in_new',
          url: linkedinUrl,
          category: 'Redes'
        }] : [])
      ],
      pin: '1234',
      features: {
        hasMiniCrm: true,
        hasMeetingIntelligence: false,
        aiMinutesQuota: 120,
        aiMinutesUsed: 0
      }
    };

    onCreate(newCard);
    onShowToast(`¡Tarjeta de "${newCard.shortName}" creada con éxito! URL: /c/${newCard.publicId}`);
    setName('');
    setShortName('');
    setPublicId('');
    setRole('');
    setCompany('');
    setValueProp('');
    setAvatarUrl('');
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
                Crear Nueva Tarjeta Digital (Ilimitadas)
              </h3>
              <p className="text-[12px] text-[#6d7a77]">
                Se generará una URL pública estable, código QR dinámico y archivo vCard 3.0
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
          {/* Quick Preset Buttons */}
          <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00685f] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rellenar con plantilla de ejemplo rápida:</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('consultor')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  template === 'consultor'
                    ? 'bg-white text-[#00685f] border-teal-400 shadow-2xs font-bold'
                    : 'bg-white/60 text-stone-700 border-stone-200 hover:bg-white'
                }`}
              >
                💼 Consultor / RH
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('comercio')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  template === 'comercio'
                    ? 'bg-white text-[#00685f] border-teal-400 shadow-2xs font-bold'
                    : 'bg-white/60 text-stone-700 border-stone-200 hover:bg-white'
                }`}
              >
                ☕ Café / Comercio
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('tech')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  template === 'tech'
                    ? 'bg-white text-[#00685f] border-teal-400 shadow-2xs font-bold'
                    : 'bg-white/60 text-stone-700 border-stone-200 hover:bg-white'
                }`}
              >
                🔒 Cloud / Tech
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Nombre Completo</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Especialidad / Rol</label>
              <input
                type="text"
                placeholder="Ej. Consultora en Recursos Humanos"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Empresa / Negocio</label>
              <input
                type="text"
                placeholder="Ej. Rivas People & Culture"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">WhatsApp / Teléfono (+52...)</label>
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
              <label className="block font-semibold text-stone-700 mb-1">Tema Visual</label>
              <select
                value={themeKey}
                onChange={(e) => setThemeKey(e.target.value as CardTheme)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none bg-white"
              >
                <option value="ejecutivo">Ejecutivo (Slate & Jade / Servicios)</option>
                <option value="negocio">Negocio Visual (Emerald / Productos)</option>
                <option value="personal">Marca Personal (Terracota / Cercano)</option>
              </select>
            </div>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Foto de Perfil / Avatar (URL de Imagen)</label>
              <div className="flex items-center gap-2">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                )}
                <input
                  type="url"
                  placeholder="https://... o usa una plantilla"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Sitio Web / Enlace Principal (Opcional)</label>
              <input
                type="url"
                placeholder="https://suempresa.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">LinkedIn (Opcional)</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/usuario"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Instagram (Opcional)</label>
              <input
                type="url"
                placeholder="https://instagram.com/usuario"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Propuesta de Valor ("A quién ayudo y con qué")
            </label>
            <textarea
              rows={2}
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              placeholder="Ej. Construyo equipos de alto rendimiento para scale-ups y pymes mexicanas."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
              required
            />
          </div>

          {/* Quick 1st Service */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block font-semibold text-stone-700 mb-1">Primer Servicio / Solución Destacada</label>
            <input
              type="text"
              placeholder="Título del servicio"
              value={service1}
              onChange={(e) => setService1(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mb-1.5 bg-white"
            />
            <textarea
              rows={1}
              placeholder="Breve descripción del resultado"
              value={service1Desc}
              onChange={(e) => setService1Desc(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
            />
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
