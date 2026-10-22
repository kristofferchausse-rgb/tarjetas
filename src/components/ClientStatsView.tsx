import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import { getStoredStats } from '../utils/analytics';
import { CapturedLead } from '../types/analytics';
import { getLeadsForProfile, updateLeadStatus, deleteLead } from '../services/leadService';
import { WallpaperModal } from './WallpaperModal';
import { EmailSignatureModal } from './EmailSignatureModal';
import {
  Eye,
  Download,
  MessageCircle,
  TrendingUp,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Mail,
  Home,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles,
  Phone,
  Briefcase,
  Users,
  Send,
  FileCheck
} from 'lucide-react';

interface ClientStatsViewProps {
  profile: ParticipantProfile;
  onBackToCard: () => void;
  onBackHome?: () => void;
}

export const ClientStatsView: React.FC<ClientStatsViewProps> = ({
  profile,
  onBackToCard,
  onBackHome
}) => {
  const [leads, setLeads] = useState<CapturedLead[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<'todos' | 'nuevo' | 'contactado' | 'cerrado'>('todos');
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const data = await getLeadsForProfile(profile.publicId);
      setLeads(data);
    } catch (err) {
      console.warn('Error loading leads:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [profile.publicId]);

  const stats = getStoredStats();
  const cardStats = stats[profile.publicId] || {
    publicId: profile.publicId,
    views: 1,
    qrScans: 1,
    shares: 0,
    vcardDownloads: 0,
    whatsappClicks: 0,
    callClicks: 0,
    emailClicks: 0,
    calendarClicks: 0,
    linkClicks: 0,
    videoPlays: 0,
    leadsCaptured: leads.length,
    lastActive: new Date().toISOString()
  };

  const totalInteractions =
    cardStats.vcardDownloads +
    cardStats.whatsappClicks +
    leads.length +
    cardStats.shares +
    cardStats.linkClicks;

  const conversionRate =
    cardStats.views > 0
      ? (((cardStats.vcardDownloads + cardStats.whatsappClicks + leads.length) / cardStats.views) * 100).toFixed(1)
      : '0.0';

  const filteredLeads = leads.filter((l) => {
    if (leadsFilter === 'todos') return true;
    return l.status === leadsFilter;
  });

  const handleStatusChange = async (leadId: string, newStatus: CapturedLead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    await updateLeadStatus(profile.publicId, leadId, newStatus);
    showToast(`Estado de prospecto actualizado a "${newStatus}"`);
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (window.confirm(`¿Deseas eliminar el registro de ${leadName}?`)) {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      await deleteLead(profile.publicId, leadId);
      showToast(`Contacto de ${leadName} eliminado.`);
    }
  };

  const generateWhatsAppFollowUpUrl = (lead: CapturedLead) => {
    const rawPhone = lead.phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('52') ? rawPhone : `52${rawPhone}`;
    const text = `Hola ${lead.name}, gusto en saludarte. Recibí tus datos a través de mi tarjeta digital ejecutiva. ¿Cuándo tendrías 15 minutos para platicar sobre cómo podemos colaborar?`;
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#f0f2f1] flex flex-col items-center p-4 sm:p-6 text-[#1a1c1c] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 px-4 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-semibold shadow-xl border border-stone-700 animate-in fade-in slide-in-from-top-3 duration-200">
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-lg space-y-4">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver mi Tarjeta</span>
            </button>
            {onBackHome && (
              <button
                onClick={onBackHome}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-600 text-xs font-semibold border border-stone-200 shadow-2xs transition-all cursor-pointer"
                title="Volver a la página principal"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inicio</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00685f]">
            <ShieldCheck className="w-4 h-4" />
            <span>Panel Ejecutivo Privado</span>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-[#1a1c1c] truncate">{profile.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Activa
              </span>
            </div>
            <p className="text-xs text-[#00685f] font-semibold truncate">{profile.role}</p>
            <p className="text-[11px] text-stone-500 truncate">{profile.company}</p>
          </div>
        </div>

        {/* High-Value Toolkit Bar */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-4 text-white shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Herramientas de Cierre & Difusión
            </h2>
          </div>
          <p className="text-[11px] text-stone-300 mb-3 leading-relaxed">
            Genera recursos ejecutivos de alta calidad para compartir tu contacto sin fricción en eventos o en cada correo que envíes.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsWallpaperOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-teal-300" />
              <span>Fondo con QR</span>
            </button>
            <button
              onClick={() => setIsSignatureOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-teal-300" />
              <span>Firma de Correo</span>
            </button>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Vistas */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Vistas / Escaneos
              </span>
              <Eye className="w-4 h-4 text-[#00685f]" />
            </div>
            <p className="text-2xl font-black text-stone-900">{cardStats.views}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">
              {cardStats.qrScans} por código QR
            </p>
          </div>

          {/* Card 2: vCards Guardadas */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Guardados en Agenda
              </span>
              <Download className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{cardStats.vcardDownloads}</p>
            <p className="text-[10px] text-stone-500 mt-1">vCard descargada al cel</p>
          </div>

          {/* Card 3: Clics a WhatsApp */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Contactos WhatsApp
              </span>
              <MessageCircle className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{cardStats.whatsappClicks}</p>
            <p className="text-[10px] text-stone-500 mt-1">Conversaciones iniciadas</p>
          </div>

          {/* Card 4: Leads Capturados */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Prospectos Recibidos
              </span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{leads.length}</p>
            <p className="text-[10px] text-amber-700 font-semibold mt-1">
              {conversionRate}% conversión
            </p>
          </div>
        </div>

        {/* SECTION: Mini-CRM Leads Inbox */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-teal-100 text-[#00685f] flex items-center justify-center font-bold text-xs">
                {leads.length}
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Buzón de Prospectos (Mini-CRM)
                </h2>
                <p className="text-[10px] text-stone-400">
                  Contactos intercambiados desde tu tarjeta
                </p>
              </div>
            </div>
            {/* Filter Selector */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-[10px] font-bold">
              {(['todos', 'nuevo', 'contactado', 'cerrado'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setLeadsFilter(filterKey)}
                  className={`px-2 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    leadsFilter === filterKey
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>

          {/* Leads list */}
          {isLoadingLeads ? (
            <div className="py-8 text-center text-xs text-stone-400">
              Cargando prospectos...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
              <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-700">
                {leadsFilter === 'todos'
                  ? 'Aún no has recibido prospectos'
                  : `No hay prospectos en estado "${leadsFilter}"`}
              </p>
              <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Cuando alguien pulse "Intercambiar Contacto" en tu tarjeta, sus datos llegarán directamente aquí y podrás escribirles por WhatsApp con 1 clic.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLeads.map((lead) => {
                const statusColors = {
                  nuevo: 'bg-blue-50 text-blue-700 border-blue-200',
                  contactado: 'bg-amber-50 text-amber-700 border-amber-200',
                  cerrado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  descartado: 'bg-stone-100 text-stone-500 border-stone-200'
                };

                return (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{lead.name}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                              statusColors[lead.status]
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>
                        {(lead.company || lead.role) && (
                          <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <Briefcase className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>
                              {lead.role ? `${lead.role}` : ''}
                              {lead.role && lead.company ? ` • ` : ''}
                              {lead.company || ''}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* WhatsApp 1-Click Follow up Button */}
                      <a
                        href={generateWhatsAppFollowUpUrl(lead)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95 shrink-0"
                        title="Responder por WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Contactar</span>
                      </a>
                    </div>

                    {lead.notes && (
                      <div className="p-2 rounded-xl bg-white border border-stone-200 text-[11px] text-stone-700 italic">
                        "{lead.notes}"
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200/60">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono text-stone-600">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1 text-stone-600 truncate max-w-[130px]">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        )}
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value as CapturedLead['status'])
                          }
                          className="bg-white border border-stone-200 text-stone-700 text-[10px] font-semibold rounded-lg px-2 py-0.5 cursor-pointer focus:outline-none"
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="contactado">Contactado</option>
                          <option value="cerrado">Cerrado</option>
                          <option value="descartado">Descartado</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                          className="p-1 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Eliminar lead"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Detalle de Interacciones
          </h2>
          <div className="divide-y divide-stone-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-600">Compartidas por WhatsApp</span>
              <span className="font-bold text-stone-900">{cardStats.shares}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-600">Clics a Enlaces seleccionados</span>
              <span className="font-bold text-stone-900">{cardStats.linkClicks}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-600">Última actividad registrada</span>
              <span className="font-mono text-[11px] text-stone-500">
                {cardStats.lastActive ? new Date(cardStats.lastActive).toLocaleDateString() : 'Hoy'}
              </span>
            </div>
          </div>
        </div>

        {/* Support & Updates Banner */}
        <div className="p-4 rounded-2xl bg-stone-900 text-white text-center space-y-2">
          <p className="text-xs font-bold text-teal-300">
            ¿Necesitas actualizar tus datos, teléfono o foto?
          </p>
          <p className="text-[11px] text-stone-300">
            Solicita cambios a tu ejecutivo de <strong>Tribu Creativa QRO</strong> directamente por WhatsApp.
          </p>
          <div className="pt-1">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hola Tribu Creativa QRO, soy ${profile.name} y me gustaría actualizar los datos de mi tarjeta digital ejecutiva (/c/${profile.publicId}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contactar a Tribu Creativa</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 text-[10px] text-stone-400">
          Tribu Creativa QRO • Panel de Estadísticas para Clientes
        </div>
      </div>

      {/* Modals for Wallpaper & Signature */}
      <WallpaperModal
        isOpen={isWallpaperOpen}
        onClose={() => setIsWallpaperOpen(false)}
        profile={profile}
        onShowToast={showToast}
      />
      <EmailSignatureModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        profile={profile}
        onShowToast={showToast}
      />
    </div>
  );
};
