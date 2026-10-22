import React, { useState, useEffect } from 'react';
import { ParticipantProfile, CardTheme, CardIntroVideo, CardSocialLinks, CardLink, CardTestimonial } from '../types/card';
import {
  X,
  Save,
  Plus,
  Trash2,
  Palette,
  Image as ImageIcon,
  Video,
  FileText,
  Sparkles,
  Link2,
  Share2,
  Globe,
  Search,
  CheckCircle2,
  Layers,
  Calendar,
  Briefcase,
  ExternalLink,
  Instagram,
  Play,
  ArrowRight,
  Award,
  Star,
  Quote
} from 'lucide-react';
import { formatVideoEmbedUrl, getVideoThumbnail, getYouTubeId } from '../utils/video';

import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onSave: (updatedProfile: ParticipantProfile) => void;
  onShowToast: (msg: string) => void;
  onDelete?: (publicId: string) => void;
  canDelete?: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onShowToast,
  onDelete,
  canDelete = true
}) => {
  const [formData, setFormData] = useState<ParticipantProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'general' | 'multimedia' | 'video' | 'servicios' | 'enlaces' | 'testimonios' | 'redes'>('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Synchronize form data whenever profile changes or modal opens
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({ ...profile });
      setActiveTab('general');
    }
  }, [profile, isOpen]);

  const handleSocialChange = (network: keyof CardSocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || {}),
        [network]: value
      }
    }));
  };

  if (!isOpen) return null;

  const handleChange = (field: keyof ParticipantProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoChange = (key: keyof CardIntroVideo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      introVideo: {
        title: prev.introVideo?.title || 'Video de Presentación',
        url: prev.introVideo?.url || '',
        duration: prev.introVideo?.duration || '1:00 min',
        thumbnailUrl: prev.introVideo?.thumbnailUrl || '',
        [key]: value
      }
    }));
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => {
      const copy = { ...prev };
      delete copy.introVideo;
      return copy;
    });
  };

  const handleSolutionChange = (index: number, key: 'title' | 'desc', val: string) => {
    const nextSolutions = [...formData.solutions];
    nextSolutions[index] = { ...nextSolutions[index], [key]: val };
    setFormData((prev) => ({ ...prev, solutions: nextSolutions }));
  };

  const handleAddSolution = () => {
    if (formData.solutions.length < 3) {
      setFormData((prev) => ({
        ...prev,
        solutions: [...prev.solutions, { title: 'Nuevo Servicio', desc: 'Descripción concreta del servicio' }]
      }));
    }
  };

  const handleRemoveSolution = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (index: number, field: keyof CardLink, value: string) => {
    setFormData((prev) => {
      const nextLinks = [...(prev.links || [])];
      nextLinks[index] = { ...nextLinks[index], [field]: value };
      return { ...prev, links: nextLinks };
    });
  };

  const handleAddLink = () => {
    if ((formData.links || []).length < 6) {
      setFormData((prev) => ({
        ...prev,
        links: [
          ...(prev.links || []),
          {
            label: 'Nuevo Enlace o Catálogo',
            url: 'https://',
            icon: 'layers',
            category: 'Catálogo'
          }
        ]
      }));
    }
  };

  const handleRemoveLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index)
    }));
  };

  const handleTestimonialChange = (index: number, field: keyof CardTestimonial, value: any) => {
    setFormData((prev) => {
      const nextTestis = [...(prev.testimonials || [])];
      nextTestis[index] = { ...nextTestis[index], [field]: value };
      return { ...prev, testimonials: nextTestis };
    });
  };

  const handleAddTestimonial = () => {
    if ((formData.testimonials || []).length < 3) {
      setFormData((prev) => ({
        ...prev,
        testimonials: [
          ...(prev.testimonials || []),
          {
            name: 'Cliente o Aliado',
            role: 'Director General',
            company: 'Empresa',
            comment: 'Excelente profesional y servicio de primer nivel con resultados tangibles.',
            stars: 5
          }
        ]
      }));
    }
  };

  const handleRemoveTestimonial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onShowToast(`Tarjeta de "${formData.shortName}" actualizada.`);
    onClose();
  };

  const colorPresets = [
    { label: 'Jade Esmeralda', hex: '#00685f' },
    { label: 'Slate Ejecutivo', hex: '#0f172a' },
    { label: 'Terracota Cálido', hex: '#ac3400' },
    { label: 'Azul Corporativo', hex: '#1d4ed8' },
    { label: 'Púrpura Editorial', hex: '#7e22ce' },
    { label: 'Ámbar Artesanal', hex: '#b45309' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div>
            <h3 id="edit-profile-title" className="text-[17px] font-bold text-[#1a1c1c]">
              Personalizar Tarjeta: {formData.shortName}
            </h3>
            <p className="text-[12px] text-[#6d7a77]">
              Modifica colores, imágenes, logo de empresa, video pitch y servicios
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 px-5 text-xs font-bold shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Datos Generales</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('multimedia')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'multimedia'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colores, Logo & Portada</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'video'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Intro Video Pitch</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('servicios')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'servicios'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Servicios & Alianzas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('enlaces')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'enlaces'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Enlaces Destacados ({(formData.links || []).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testimonios')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'testimonios'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Testimonios ({(formData.testimonials || []).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('redes')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'redes'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Redes & SEO AEO</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto custom-scroll space-y-4 text-[13px]">
          {/* TAB 1: General */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nombre Corto</label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => handleChange('shortName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Especialidad o Cargo</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Empresa o Negocio</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
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
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Teléfono (E.164 +52...)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Propuesta de Valor ("A quién ayudo y con qué")
                </label>
                <textarea
                  rows={2}
                  value={formData.valueProp}
                  onChange={(e) => handleChange('valueProp', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Estado de Disponibilidad (Píldora)</label>
                <input
                  type="text"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Colores, Logo & Portada */}
          {activeTab === 'multimedia' && (
            <div className="space-y-4">
              {/* Color Customizer */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="block font-bold text-stone-800 mb-2">Color Primario de Marca / Botones</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colorPresets.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => handleChange('customPrimaryColor', c.hex)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        formData.customPrimaryColor === c.hex
                          ? 'border-stone-900 bg-white shadow-2xs font-bold text-stone-900'
                          : 'border-stone-200 bg-white/70 text-stone-600 hover:bg-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-500">O elige código HEX:</span>
                  <input
                    type="color"
                    value={formData.customPrimaryColor || '#00685f'}
                    onChange={(e) => handleChange('customPrimaryColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-stone-300"
                  />
                  <input
                    type="text"
                    value={formData.customPrimaryColor || '#00685f'}
                    onChange={(e) => handleChange('customPrimaryColor', e.target.value)}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg border border-stone-300 w-28 uppercase"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Logo de la Empresa (URL de Imagen)
                </label>
                <div className="flex items-center gap-3">
                  {formData.logoUrl && (
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-300 shrink-0 bg-white"
                    />
                  )}
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={formData.logoUrl || ''}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#00685f] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Se muestra junto al nombre de la empresa.</p>
              </div>

              {/* Profile Photo Avatar */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Foto de Perfil / Avatar (URL)</label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar preview"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-stone-300 shrink-0 bg-stone-100"
                  />
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => handleChange('avatarUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#00685f] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Cover Banner Image */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Imagen de Portada / Banner (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (Dejar vacío para degradado limpio)"
                  value={formData.bannerImageUrl || ''}
                  onChange={(e) => handleChange('bannerImageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#00685f] focus:outline-none"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Se coloca en la cabecera superior de la tarjeta con textura traslúcida elegante.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Intro Video Pitch */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200">
                <div className="flex items-center gap-2 text-teal-900 font-bold mb-1">
                  <Video className="w-4 h-4 text-[#00685f]" />
                  <span>Video Pitch de Introducción (1 a 2 min)</span>
                </div>
                <p className="text-xs text-teal-800 leading-relaxed">
                  Permite que quien escanee tu tarjeta te conozca y escuche tu voz. Soporta enlaces directos de <strong>YouTube</strong> (watch, shorts, youtu.be), <strong>Vimeo</strong> o <strong>Loom</strong>. El sistema los optimiza automáticamente para reproducirse sin restricciones en cualquier celular.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Título del Video</label>
                <input
                  type="text"
                  placeholder="Ej. Mensaje de Bienvenida: Blindaje Fiscal 2026"
                  value={formData.introVideo?.title || ''}
                  onChange={(e) => handleVideoChange('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  URL del Video (Pega aquí cualquier enlace de YouTube, Vimeo o Loom)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  value={formData.introVideo?.url || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleVideoChange('url', val);
                    const ytId = getYouTubeId(val);
                    if (ytId && !formData.introVideo?.thumbnailUrl) {
                      handleVideoChange('thumbnailUrl', `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:border-[#00685f] focus:outline-none"
                />
                {formData.introVideo?.url && getYouTubeId(formData.introVideo.url) && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>✓ Enlace de YouTube detectado — Convertido a embed compatible y portada sincronizada.</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duración Estimada</label>
                  <input
                    type="text"
                    placeholder="Ej. 1:15 min"
                    value={formData.introVideo?.duration || ''}
                    onChange={(e) => handleVideoChange('duration', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-stone-700">Miniatura / Portada (URL)</label>
                    {formData.introVideo?.url && getYouTubeId(formData.introVideo.url) && (
                      <button
                        type="button"
                        onClick={() => {
                          const id = getYouTubeId(formData.introVideo?.url || '');
                          if (id) handleVideoChange('thumbnailUrl', `https://img.youtube.com/vi/${id}/hqdefault.jpg`);
                        }}
                        className="text-[11px] text-[#00685f] hover:underline font-semibold cursor-pointer"
                      >
                        Auto-cargar YouTube
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://img.youtube.com/vi/.../hqdefault.jpg"
                    value={formData.introVideo?.thumbnailUrl || ''}
                    onChange={(e) => handleVideoChange('thumbnailUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#00685f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Video Player Preview inside Modal */}
              {formData.introVideo?.url && (
                <div className="mt-2 p-3.5 bg-stone-100 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Play className="w-3 h-3 text-[#00685f]" />
                      <span>Vista Previa del Reproductor</span>
                    </span>
                    <span className="text-[10px] text-stone-500">Prueba cómo se verá al compartir tu tarjeta</span>
                  </div>
                  <div className="relative pt-[56.25%] w-full bg-black rounded-xl overflow-hidden shadow-inner">
                    <iframe
                      src={formatVideoEmbedUrl(formData.introVideo.url, false)}
                      title="Vista Previa de Video"
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {formData.introVideo?.url && (
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xs text-emerald-700 font-bold">✓ Video pitch activo en tu tarjeta</span>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Eliminar video de la tarjeta
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Servicios */}
          {activeTab === 'servicios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800">Qué puedo ayudarte a resolver (Hasta 3)</label>
                {formData.solutions.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddSolution}
                    className="text-xs text-[#00685f] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Servicio</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {formData.solutions.map((sol, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-500">Servicio #{idx + 1}</span>
                      {formData.solutions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSolution(idx)}
                          className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Eliminar servicio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={sol.title}
                      onChange={(e) => handleSolutionChange(idx, 'title', e.target.value)}
                      placeholder="Título del servicio"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mb-1.5 bg-white"
                    />
                    <textarea
                      rows={2}
                      value={sol.desc}
                      onChange={(e) => handleSolutionChange(idx, 'desc', e.target.value)}
                      placeholder="Descripción concreta"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Enlaces Destacados */}
          {activeTab === 'enlaces' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Link2 className="w-4 h-4 text-teal-700" />
                    <span>Enlaces y Accesos Directos Destacados (Hasta 6)</span>
                  </div>
                  {(formData.links || []).length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="text-xs text-[#00685f] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Enlace</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-teal-800/90 mt-1 leading-relaxed">
                  Personaliza los botones de llamada a la acción en la sección inferior de tu tarjeta (Catálogos PDF, Portafolios de proyectos, Agendar Visita al Taller, Tienda online o Enlaces sociales).
                </p>
              </div>

              {(!formData.links || formData.links.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-2xl">
                  <Link2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-stone-500 text-xs mb-3">No tienes enlaces destacados configurados.</p>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-3.5 py-1.5 bg-[#00685f] text-white rounded-xl text-xs font-semibold hover:bg-[#00514a] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Primer Enlace</span>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {(formData.links || []).map((link, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 relative space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-stone-800">
                          {link.label || 'Enlace sin título'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                        title="Eliminar este enlace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1 text-xs">
                          Texto del Botón (Título)
                        </label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                          placeholder="Ej. Catálogo Colección 2025 (PDF)"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:border-[#00685f] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1 text-xs">
                          Categoría / Subtítulo
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={link.category || ''}
                            onChange={(e) => handleLinkChange(idx, 'category', e.target.value)}
                            placeholder="Ej. Catálogo, Galería, Visita"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:border-[#00685f] focus:outline-none"
                          />
                          <select
                            value={['Catálogo', 'Galería', 'Portafolio', 'Visita', 'Agenda', 'Web', 'Social', 'Documento'].includes(link.category || '') ? link.category : ''}
                            onChange={(e) => {
                              if (e.target.value) handleLinkChange(idx, 'category', e.target.value);
                            }}
                            className="px-2 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-600 cursor-pointer"
                            title="Sugerencias de categoría"
                          >
                            <option value="">Sugerir...</option>
                            <option value="Catálogo">Catálogo</option>
                            <option value="Galería">Galería</option>
                            <option value="Portafolio">Portafolio</option>
                            <option value="Visita">Visita</option>
                            <option value="Agenda">Agenda</option>
                            <option value="Web">Web</option>
                            <option value="Social">Social</option>
                            <option value="Documento">Documento</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1 text-xs">
                        URL de Destino (Enlace)
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                        placeholder="https://ejemplo.com/catalogo o https://instagram.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs bg-white focus:border-[#00685f] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1 text-xs">
                        Ícono del Botón
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'layers', label: 'Catálogo / Capas' },
                          { id: 'file', label: 'Documento / PDF' },
                          { id: 'calendar', label: 'Agenda / Citas' },
                          { id: 'store', label: 'Taller / Visita' },
                          { id: 'globe', label: 'Sitio Web' },
                          { id: 'camera', label: 'Instagram' },
                          { id: 'external', label: 'Enlace Externo' }
                        ].map((ic) => {
                          const isSelected =
                            link.icon === ic.id ||
                            (ic.id === 'layers' && (link.icon === 'auto_stories' || link.icon === 'photo_library')) ||
                            (ic.id === 'file' && (link.icon === 'menu_book' || link.icon === 'description')) ||
                            (ic.id === 'calendar' && link.icon === 'calendar_month') ||
                            (ic.id === 'store' && (link.icon === 'domain' || link.icon === 'briefcase')) ||
                            (ic.id === 'globe' && link.icon === 'language') ||
                            (ic.id === 'camera' && link.icon === 'camera_alt') ||
                            (ic.id === 'external' && link.icon === 'open_in_new');

                          return (
                            <button
                              key={ic.id}
                              type="button"
                              onClick={() => handleLinkChange(idx, 'icon', ic.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                                isSelected
                                  ? 'bg-[#00685f] text-white border-[#00685f]'
                                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {ic.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Testimonios & Casos de Éxito */}
          {activeTab === 'testimonios' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold block text-amber-900">Prueba Social & Testimonios Clave</span>
                  Los testimonios reales aumentan la tasa de contacto y guardado de agenda hasta un 270%. Agrega hasta 3 recomendaciones breves con estrellas, cargo y empresa.
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">
                  Testimonios destacados ({(formData.testimonials || []).length}/3)
                </span>
                {(formData.testimonials || []).length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddTestimonial}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#00685f] hover:text-[#00524b] px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Testimonio</span>
                  </button>
                )}
              </div>

              {(!formData.testimonials || formData.testimonials.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                  <Star className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-600">Aún no has agregado testimonios</p>
                  <p className="text-[11px] text-stone-400 mt-0.5 mb-3">Muestra la confianza de tus clientes en tu tarjeta digital</p>
                  <button
                    type="button"
                    onClick={handleAddTestimonial}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#00685f] hover:bg-[#00524b] px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Primer Testimonio</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(formData.testimonials || []).map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-stone-800">
                            {t.name || `Testimonio #${idx + 1}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTestimonial(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar testimonio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Nombre del Cliente / Recomendador
                          </label>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)}
                            placeholder="Ej. Ing. Carlos Mendoza"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f] bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Cargo / Puesto
                          </label>
                          <input
                            type="text"
                            value={t.role || ''}
                            onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                            placeholder="Ej. CEO / Directora General"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f] bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Empresa o Marca
                          </label>
                          <input
                            type="text"
                            value={t.company || ''}
                            onChange={(e) => handleTestimonialChange(idx, 'company', e.target.value)}
                            placeholder="Ej. InnovaTech México"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f] bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Calificación (Estrellas)
                          </label>
                          <div className="flex items-center gap-1.5 h-[34px]">
                            {[1, 2, 3, 4, 5].map((starCount) => (
                              <button
                                key={starCount}
                                type="button"
                                onClick={() => handleTestimonialChange(idx, 'stars', starCount)}
                                className="p-1 transition-transform hover:scale-110 cursor-pointer"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    (t.stars ?? 5) >= starCount
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-stone-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-stone-600 ml-1">
                              {t.stars ?? 5}/5
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Comentario / Recomendación
                        </label>
                        <textarea
                          rows={2}
                          value={t.comment}
                          onChange={(e) => handleTestimonialChange(idx, 'comment', e.target.value)}
                          placeholder="Qué resultado obtuvieron, qué destacaron de tu trabajo..."
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f] bg-white resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          URL Foto / Logo Cliente (Opcional)
                        </label>
                        <input
                          type="url"
                          value={t.avatarUrl || ''}
                          onChange={(e) => handleTestimonialChange(idx, 'avatarUrl', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f] bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Redes & SEO AEO */}
          {activeTab === 'redes' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>Optimización SEO, AEO & Redes Sociales</span>
                </div>
                <p className="text-[11px] text-teal-800/90 mt-1 leading-relaxed">
                  Las redes sociales se muestran directamente en tu tarjeta y se incluyen en el marcado estructurado Schema.org JSON-LD para motores de búsqueda y motores de respuesta con Inteligencia Artificial (AEO: Gemini, Perplexity, ChatGPT).
                </p>
              </div>

              {/* Social Channels */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">Perfiles de Redes Sociales</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/usuario"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">Instagram</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.instagram || ''}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/usuario"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">Facebook</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.facebook || ''}
                      onChange={(e) => handleSocialChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/pagina"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">X (Twitter)</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.twitter || ''}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder="https://x.com/usuario"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">YouTube</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.youtube || ''}
                      onChange={(e) => handleSocialChange('youtube', e.target.value)}
                      placeholder="https://youtube.com/@canal"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">GitHub / Portafolio</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.github || ''}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      placeholder="https://github.com/usuario"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1 text-xs">Sitio Web Oficial</label>
                  <input
                    type="url"
                    value={formData.websiteUrl || ''}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    placeholder="https://miempresa.com"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* SEO & AEO Settings */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-teal-700" />
                  <span>Configuración SEO & AEO (Resumen y Palabras Clave)</span>
                </h4>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1 text-xs">
                    Resumen Meta para Buscadores y WhatsApp (Preview Description)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription || ''}
                    onChange={(e) => handleChange('seoDescription', e.target.value)}
                    placeholder={formData.valueProp || 'Resumen conciso de tus servicios y especialidad...'}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Este texto aparece debajo del título al compartir el enlace en WhatsApp, LinkedIn y en los resultados de Google.
                  </p>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1 text-xs">
                    Palabras Clave Semánticas (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={(formData.seoKeywords || []).join(', ')}
                    onChange={(e) =>
                      handleChange(
                        'seoKeywords',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    placeholder="Consultoría, Negocios, Alianzas, Querétaro, Estrategia"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-2">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Tarjeta</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
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
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (onDelete) {
            onDelete(profile.publicId);
            setShowDeleteConfirm(false);
            onClose();
          }
        }}
        profile={profile}
        canDelete={canDelete}
      />
    </div>
  );
};
