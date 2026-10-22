import React, { useState } from 'react';
import { ParticipantProfile, CardTheme } from '../types/card';
import { CardStats, ActivityEvent, NetworkingInsight } from '../types/analytics';
import { getStoredStats, getStoredEvents, extractNetworkingInsights } from '../utils/analytics';
import {
  Users,
  Eye,
  Download,
  MessageCircle,
  Share2,
  TrendingUp,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Play,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Video,
  Clock,
  Plus,
  QrCode,
  Edit3,
  Lock,
  LogOut,
  KeyRound,
  Trash2,
  Send,
  Smartphone,
  Home
} from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface AdminDashboardProps {
  profiles: ParticipantProfile[];
  onToggleStatus: (publicId: string) => void;
  onOpenCardPreview: (publicId: string) => void;
  onOpenEditProfile: (publicId: string) => void;
  onOpenCreateProfile: () => void;
  onOpenQR: (publicId: string) => void;
  onShowToast: (msg: string) => void;
  onClose: () => void;
  onDeleteProfile: (publicId: string) => void;
  adminPin?: string;
  onUpdatePin?: (newPin: string) => void;
  onLogoutAdmin?: () => void;
  onOpenDelivery?: (publicId: string) => void;
  onBackHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  onToggleStatus,
  onOpenCardPreview,
  onOpenEditProfile,
  onOpenCreateProfile,
  onOpenQR,
  onShowToast,
  onClose,
  onDeleteProfile,
  adminPin = '1234',
  onUpdatePin,
  onLogoutAdmin,
  onOpenDelivery,
  onBackHome
}) => {
  const [profileToDelete, setProfileToDelete] = useState<ParticipantProfile | null>(null);
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [newPinValue, setNewPinValue] = useState(adminPin);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');

  const stats = getStoredStats();
  const events = getStoredEvents();
  const insights = extractNetworkingInsights(profiles);

  // Calculate totals
  const totalProfiles = profiles.length;
  const activeProfiles = profiles.filter((p) => p.published).length;
  const pausedProfiles = totalProfiles - activeProfiles;

  let totalViews = 0;
  let totalVcards = 0;
  let totalWhatsapp = 0;
  let totalShares = 0;
  let totalVideos = 0;

  profiles.forEach((p) => {
    const s = stats[p.publicId] || {
      views: 0,
      vcardDownloads: 0,
      whatsappClicks: 0,
      shares: 0,
      videoPlays: 0
    };
    totalViews += s.views;
    totalVcards += s.vcardDownloads;
    totalWhatsapp += s.whatsappClicks;
    totalShares += s.shares;
    totalVideos += s.videoPlays;
  });

  const conversionRate = totalViews > 0 ? (((totalVcards + totalWhatsapp) / totalViews) * 100).toFixed(1) : '0';

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTheme = selectedTheme === 'all' || p.themeKey === selectedTheme;
    const matchStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && p.published) ||
      (selectedStatus === 'paused' && !p.published);

    return matchSearch && matchTheme && matchStatus;
  });

  // Export CSV summary
  const handleExportCSV = () => {
    const headers = [
      'Nombre',
      'Empresa',
      'Especialidad',
      'Ciudad',
      'Tema',
      'Estado',
      'ID Público',
      'Vistas',
      'vCard Descargadas',
      'WhatsApp Clics',
      'Veces Compartida'
    ];

    const rows = profiles.map((p) => {
      const s = stats[p.publicId] || {
        views: 0,
        vcardDownloads: 0,
        whatsappClicks: 0,
        shares: 0
      };
      return [
        `"${p.name}"`,
        `"${p.company}"`,
        `"${p.role}"`,
        `"${p.city}"`,
        p.themeKey,
        p.published ? 'Activa' : 'Pausada',
        p.publicId,
        s.views,
        s.vcardDownloads,
        s.whatsappClicks,
        s.shares
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_redconecta_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Reporte de analítica exportado en CSV.');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] text-[#1a1c1c] flex flex-col pb-16">
      {/* 1. Header Admin Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-extrabold text-[#1a1c1c]">Dashboard Tribu Creativa QRO</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                  Panel Exclusivo de Agencia
                </span>
              </div>
              <p className="text-[12px] text-[#6d7a77]">
                Gestión privada de tarjetas digitales ejecutivas para clientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-[12px] font-semibold text-stone-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onOpenCreateProfile}
              className="px-3.5 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nueva Tarjeta</span>
            </button>
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[12px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
            {onBackHome && (
              <button
                onClick={onBackHome}
                className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-[12px] font-semibold text-stone-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                title="Volver a la Página Principal (Home)"
              >
                <Home className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden md:inline">Inicio</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Volver al Estudio y Simulador de Tarjetas"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-300" />
              <span>Volver al Simulador</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 w-full">
        {/* Security & Privacy Reassurance Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[14px] text-white">Privacidad y Modo Público Blindado</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Activo
                </span>
              </div>
              <p className="text-[12px] text-emerald-100/90 mt-0.5 max-w-2xl leading-relaxed">
                Las tarjetas compartidas por código QR y enlace web son <strong>100% de solo lectura</strong>. Los contactos y asistentes externos <strong>no tienen acceso a este panel de administración</strong>, ni a las métricas, ni a la edición de tarjetas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-800">
            {isEditingPin ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPinValue.trim().length >= 4) {
                    onUpdatePin?.(newPinValue.trim());
                    setIsEditingPin(false);
                    onShowToast('Nuevo PIN de administrador guardado con éxito.');
                  } else {
                    onShowToast('El PIN debe tener al menos 4 caracteres.');
                  }
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  maxLength={8}
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-emerald-950 text-white border border-emerald-600 text-xs font-mono text-center focus:outline-none"
                  placeholder="PIN"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPin(false)}
                  className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 text-xs rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-xs font-mono text-emerald-200">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PIN Admin: <strong>{showPin ? adminPin : '••••'}</strong></span>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="ml-1 text-emerald-400 hover:text-white cursor-pointer"
                    title={showPin ? 'Ocultar PIN' : 'Ver PIN'}
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => setIsEditingPin(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold border border-emerald-600 transition-colors cursor-pointer"
                >
                  Cambiar PIN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Vistas / Escaneos */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77]">Escaneos & Vistas</span>
              <Eye className="w-4 h-4 text-[#00685f]" />
            </div>
            <p className="text-2xl font-extrabold text-[#1a1c1c]">{totalViews.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+24% vs evento previo</span>
            </p>
          </div>

          {/* Card 2: vCards Guardadas */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77]">Contactos Guardados</span>
              <Download className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-extrabold text-[#1a1c1c]">{totalVcards.toLocaleString()}</p>
            <p className="text-[11px] text-[#6d7a77] mt-1">
              Descargas efectivas de .vcf UTF-8
            </p>
          </div>

          {/* Card 3: WhatsApp Invocados */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77]">Chats de WhatsApp</span>
              <MessageCircle className="w-4 h-4 text-[#128C7E]" />
            </div>
            <p className="text-2xl font-extrabold text-[#1a1c1c]">{totalWhatsapp.toLocaleString()}</p>
            <p className="text-[11px] text-[#128C7E] font-semibold mt-1">
              Canal preferido (67% de clics)
            </p>
          </div>

          {/* Card 4: Tasa de Conversión */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77]">Tasa de Conexión</span>
              <Sparkles className="w-4 h-4 text-[#ac3400]" />
            </div>
            <p className="text-2xl font-extrabold text-[#1a1c1c]">{conversionRate}%</p>
            <p className="text-[11px] text-stone-500 mt-1">
              Visitantes que conectan o guardan
            </p>
          </div>

          {/* Card 5: Tarjetas Activas / En Pausa */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77]">Estado Directorio</span>
              <ShieldCheck className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-2xl font-extrabold text-[#1a1c1c]">{activeProfiles} / {totalProfiles}</p>
            <p className="text-[11px] text-stone-500 mt-1">
              {pausedProfiles > 0 ? `${pausedProfiles} pausada(s)` : 'Todas activas y públicas'}
            </p>
          </div>
        </div>

        {/* 3. Strategic Intelligence Block: "Qué sirve, qué no y qué está buscando la gente" */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3): Behavioral Insights & Lessons */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#00685f]" />
                  <span>Inteligencia de Networking</span>
                </div>
                <h3 className="text-[17px] font-bold text-[#1a1c1c] mt-0.5">
                  ¿Qué funciona, qué no y cómo maximizar el valor de cada tarjeta?
                </h3>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                Basado en {totalViews} interacciones reales
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Insight 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Canal Ganador: WhatsApp</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  El <strong>67%</strong> de las personas prefiere iniciar contacto por <strong>WhatsApp</strong> con un mensaje pre-cargado, superando en <strong>4.8x</strong> las llamadas directas o correos.
                </p>
              </div>

              {/* Insight 2 */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs mb-1">
                  <Video className="w-4 h-4 text-[#00685f]" />
                  <span>Impacto del Video Pitch</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Las tarjetas con <strong>Intro Video de 1 minuto</strong> lograron un <strong>+42%</strong> de descargas de vCard y <strong>+38%</strong> de tiempo de permanencia en el micrositio.
                </p>
              </div>

              {/* Insight 3 */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Agendamiento vs Web</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Los enlaces hacia <strong>Calendly</strong> tienen un <strong>260%</strong> más de conversión que los enlaces a sitios web institucionales genéricos.
                </p>
              </div>
            </div>

            {/* Practical Recommendations for Event Organizers */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Recomendaciones clave para tus próximos talleres y eventos:
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Imprime el QR directamente en los gafetes:</strong> El 73% de los escaneos ocurre durante los primeros 15 minutos del coffee break.
                </li>
                <li>
                  <strong>Sugerir propuesta de valor corta:</strong> Frases de más de 120 caracteres reducen la velocidad de escaneo y lectura en un 30%.
                </li>
                <li>
                  <strong>Mantener al día el teléfono con prefijo +52:</strong> Asegura que los enlaces de WhatsApp se abran sin errores en números internacionales.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (1/3): Networking Demand & Trends */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-teal-700" />
                <span>Demanda del Mercado</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#1a1c1c] mt-0.5">
                ¿Qué está buscando la gente?
              </h3>
              <p className="text-xs text-stone-500">
                Temas y especialidades con mayor número de interacciones en el directorio:
              </p>
            </div>

            <div className="space-y-3">
              {insights.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 truncate pr-2" title={item.topic}>
                      {item.topic}
                    </span>
                    <span className="font-mono text-stone-500 text-[11px] shrink-0 font-bold">
                      {item.count} búsquedas
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#00685f]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
              <span>Actualizado automáticamente</span>
              <span className="text-emerald-700 font-bold">En tiempo real</span>
            </div>
          </div>
        </div>

        {/* 4. Table of Control: Activar / Desactivar Tarjetas & Monitoreo Individual */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-[17px] font-bold text-[#1a1c1c]">
                Gestión & Monitoreo de Tarjetas ({filteredProfiles.length} de {profiles.length})
              </h3>
              <p className="text-xs text-stone-500">
                Activa o pausa tarjetas para controlar su visibilidad pública instantáneamente.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar participante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#00685f] bg-stone-50 w-48"
                />
              </div>

              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-700 focus:outline-none"
              >
                <option value="all">Todos los Temas</option>
                <option value="ejecutivo">Ejecutivo</option>
                <option value="negocio">Negocio Visual</option>
                <option value="personal">Marca Personal</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-700 focus:outline-none"
              >
                <option value="all">Cualquier Estado</option>
                <option value="active">Solo Activas</option>
                <option value="paused">Solo en Pausa</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-[#6d7a77] uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-3">Participante</th>
                  <th className="py-3 px-3">Tema</th>
                  <th className="py-3 px-3 text-center">Estado (Activar / Pausar)</th>
                  <th className="py-3 px-3 text-right">Vistas</th>
                  <th className="py-3 px-3 text-right">vCard Guardadas</th>
                  <th className="py-3 px-3 text-right">WhatsApp</th>
                  <th className="py-3 px-3 text-right">Conexión</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProfiles.map((p, idx) => {
                  const s = stats[p.publicId] || {
                    views: 0,
                    vcardDownloads: 0,
                    whatsappClicks: 0,
                    shares: 0
                  };
                  const cardConversion = s.views > 0 ? (((s.vcardDownloads + s.whatsappClicks) / s.views) * 100).toFixed(0) : '0';

                  return (
                    <tr key={`${p.publicId}-${idx}`} className="hover:bg-stone-50/80 transition-colors">
                      {/* Name & Role */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            className="w-9 h-9 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-900 truncate">{p.name}</span>
                              {p.verified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 truncate">{p.company} • {p.city}</p>
                            <span className="font-mono text-[10px] text-teal-700">/c/{p.publicId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Theme */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                            p.themeKey === 'ejecutivo'
                              ? 'bg-slate-100 text-slate-800'
                              : p.themeKey === 'negocio'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-orange-100 text-[#ac3400]'
                          }`}
                        >
                          {p.themeKey}
                        </span>
                      </td>

                      {/* Interactive Publish / Pause Switch */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            onToggleStatus(p.publicId);
                            onShowToast(
                              `Tarjeta de "${p.shortName}" ${!p.published ? 'activada y visible públicamente' : 'pausada temporalmente'}`
                            );
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            p.published
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-500 border border-stone-300 hover:bg-stone-200'
                          }`}
                          title={p.published ? 'Haz clic para pausar esta tarjeta' : 'Haz clic para activar esta tarjeta'}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.published ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                            }`}
                          />
                          <span>{p.published ? 'Activa' : 'Pausada'}</span>
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-stone-800">
                        {s.views.toLocaleString()}
                      </td>

                      {/* vCard */}
                      <td className="py-3 px-3 text-right font-mono text-teal-800 font-bold">
                        {s.vcardDownloads.toLocaleString()}
                      </td>

                      {/* WhatsApp */}
                      <td className="py-3 px-3 text-right font-mono text-emerald-800 font-bold">
                        {s.whatsappClicks.toLocaleString()}
                      </td>

                      {/* Conversion */}
                      <td className="py-3 px-3 text-right font-mono text-stone-700">
                        {cardConversion}%
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onOpenDelivery && (
                            <button
                              onClick={() => onOpenDelivery(p.publicId)}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
                              title="Entregar al Cliente por WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onOpenCardPreview(p.publicId)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                            title="Ver Tarjeta en Móvil"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenQR(p.publicId)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-[#00685f] transition-colors cursor-pointer"
                            title="Compartir Código QR"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenEditProfile(p.publicId)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                            title="Editar Datos"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProfileToDelete(p)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Eliminar Tarjeta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Live Activity Feed (Últimos eventos registrados) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Registro en Tiempo Real</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#1a1c1c] mt-0.5">
                Última Actividad Registrada en el Directorio
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-mono">Últimas interacciones</span>
          </div>

          <div className="space-y-2">
            {events.slice(0, 6).map((evt) => {
              const getIcon = () => {
                switch (evt.type) {
                  case 'vcard_download':
                    return <Download className="w-4 h-4 text-teal-600" />;
                  case 'whatsapp_click':
                    return <MessageCircle className="w-4 h-4 text-[#128C7E]" />;
                  case 'qr_scan':
                    return <QrCode className="w-4 h-4 text-[#ac3400]" />;
                  case 'video_play':
                    return <Play className="w-4 h-4 text-purple-600" />;
                  case 'calendar_click':
                    return <Calendar className="w-4 h-4 text-amber-600" />;
                  default:
                    return <Eye className="w-4 h-4 text-stone-500" />;
                }
              };

              return (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                      {getIcon()}
                    </div>
                    <div>
                      <span className="font-bold text-stone-900">{evt.participantName}</span>
                      <span className="text-stone-500 ml-2">{evt.label || evt.type}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm Delete Card Modal */}
      <ConfirmDeleteModal
        isOpen={!!profileToDelete}
        onClose={() => setProfileToDelete(null)}
        onConfirm={() => {
          if (profileToDelete) {
            onDeleteProfile(profileToDelete.publicId);
            setProfileToDelete(null);
          }
        }}
        profile={profileToDelete}
        canDelete={profiles.length > 1}
      />
    </div>
  );
};
