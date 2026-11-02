import React, { useState, useEffect, useMemo } from 'react';
import { ParticipantProfile } from '../types/card';
import { getStoredStats } from '../utils/analytics';
import { CapturedLead } from '../types/analytics';
import {
  getLeadsForProfile,
  updateLeadStatus,
  updateLeadFollowUp,
  deleteLead,
  seedMockLeads,
  UpdateLeadFollowUpPayload
} from '../services/leadService';
import {
  getArchetypeTerminology,
  getLocalTodayDateString,
  getLeadActionTiming,
  generateWhatsAppFollowUpUrl
} from '../utils/crmTerminology';
import { WallpaperModal } from './WallpaperModal';
import { EmailSignatureModal } from './EmailSignatureModal';
import { LeadDetailModal } from './LeadDetailModal';
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
  FileCheck,
  Lock,
  Mic,
  Search,
  AlertTriangle,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  calculateCardActivitySummary,
  calculateTitularOutcomesSummary,
  formatOutcomeDisplayLabel
} from '../utils/metricsCalculations';
import { getOutcomeTerminology } from '../utils/crmTerminology';
import { MeetingIntelligenceView } from './MeetingIntelligenceView';

interface ClientStatsViewProps {
  profile: ParticipantProfile;
  onBackToCard: () => void;
  onBackHome?: () => void;
  onLockSession?: () => void;
}

export const ClientStatsView: React.FC<ClientStatsViewProps> = ({
  profile,
  onBackToCard,
  onBackHome,
  onLockSession
}) => {
  const [leads, setLeads] = useState<CapturedLead[]>([]);
  const [quickFilter, setQuickFilter] = useState<'todos' | 'hoy' | 'vencidos' | 'sin_proximo_paso'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'nuevo' | 'contactado' | 'reunion' | 'cerrado' | 'descartado'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<CapturedLead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const terminology = getArchetypeTerminology(profile);
  const todayStr = getLocalTodayDateString();

  const [activeModuleTab, setActiveModuleTab] = useState<'crm' | 'meetings'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tab') === 'meetings' || window.location.hash.includes('meetings')) {
        return 'meetings';
      }
      if (urlParams.get('tab') === 'crm' || window.location.hash.includes('crm')) {
        return 'crm';
      }
    } catch {}
    return 'crm';
  });

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

  const isDemoProfile = profile.publicId.startsWith('demo-');

  const handleSeedMockLeads = async () => {
    if (!isDemoProfile) {
      showToast('Acción disponible exclusivamente en perfiles de demostración.');
      return;
    }
    if (
      !window.confirm(
        '¿Deseas restaurar los contactos de ejemplo en este perfil de prueba? Se restablecerán los datos de demostración.'
      )
    ) {
      return;
    }
    setIsLoadingLeads(true);
    try {
      const res = await seedMockLeads(profile.publicId);
      if (res.success) {
        setLeads(res.leads);
        showToast('¡Contactos de ejemplo restaurados con éxito!');
      } else {
        showToast(res.error || 'Error al restaurar contactos de ejemplo.');
      }
    } catch {
      showToast('Error al cargar contactos de ejemplo.');
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [profile.publicId]);

  const stats = getStoredStats();
  const rawProfileStats = stats[profile.publicId];

  // Activity summary computed via shared selector
  const activitySummary = useMemo(
    () => calculateCardActivitySummary(rawProfileStats, profile.publicId),
    [rawProfileStats, profile.publicId]
  );

  // Titular registered outcomes computed via shared selector (excludes isDemo leads for real customer profiles)
  const outcomeStats = useMemo(
    () => calculateTitularOutcomesSummary(leads, isDemoProfile),
    [leads, isDemoProfile]
  );

  const handleUpdateLead = async (
    leadId: string,
    updates: UpdateLeadFollowUpPayload
  ): Promise<boolean> => {
    const res = await updateLeadFollowUp(profile.publicId, leadId, updates);
    if (res.success && res.lead) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? res.lead! : l)));
      if (selectedLeadForDetail?.id === leadId) {
        setSelectedLeadForDetail(res.lead);
      }
      return true;
    }
    return false;
  };

  const handleStatusChange = async (leadId: string, newStatus: CapturedLead['status']) => {
    const ok = await handleUpdateLead(leadId, { status: newStatus });
    if (ok) {
      showToast(`Estado comercial actualizado a "${newStatus}"`);
    } else {
      showToast('No se pudo actualizar el estado.');
    }
  };

  const handleOpenDetail = (lead: CapturedLead) => {
    setSelectedLeadForDetail(lead);
    setIsDetailModalOpen(true);
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (window.confirm(`¿Deseas eliminar el registro de ${leadName}?`)) {
      const ok = await deleteLead(profile.publicId, leadId);
      if (ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (selectedLeadForDetail?.id === leadId) {
          setIsDetailModalOpen(false);
          setSelectedLeadForDetail(null);
        }
        showToast(`Contacto de ${leadName} eliminado.`);
      } else {
        showToast(`Error al eliminar: el contacto de ${leadName} se conserva.`);
      }
    }
  };

  const counts = useMemo(() => {
    return {
      todos: leads.length,
      hoy: leads.filter((l) => getLeadActionTiming(l, todayStr) === 'hoy').length,
      vencidos: leads.filter((l) => getLeadActionTiming(l, todayStr) === 'vencido').length,
      sin_proximo_paso: leads.filter(
        (l) => !l.nextAction || !l.nextAction.trim() || l.nextActionCompleted
      ).length
    };
  }, [leads, todayStr]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // 1. Search term filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = (l.name || '').toLowerCase().includes(q);
        const matchCompany = (l.company || '').toLowerCase().includes(q);
        const matchRole = (l.role || '').toLowerCase().includes(q);
        const matchSolution = (l.solutionTitle || '').toLowerCase().includes(q);
        const matchMessage = (l.message || '').toLowerCase().includes(q);
        const matchAction = (l.nextAction || '').toLowerCase().includes(q);
        const matchNotes = (l.notes || '').toLowerCase().includes(q);
        if (
          !matchName &&
          !matchCompany &&
          !matchRole &&
          !matchSolution &&
          !matchMessage &&
          !matchAction &&
          !matchNotes
        ) {
          return false;
        }
      }

      // 2. Quick view filter
      if (quickFilter === 'hoy') {
        if (getLeadActionTiming(l, todayStr) !== 'hoy') return false;
      } else if (quickFilter === 'vencidos') {
        if (getLeadActionTiming(l, todayStr) !== 'vencido') return false;
      } else if (quickFilter === 'sin_proximo_paso') {
        const hasActiveAction = Boolean(l.nextAction && l.nextAction.trim() && !l.nextActionCompleted);
        if (hasActiveAction) return false;
      }

      // 3. Commercial status filter
      if (statusFilter !== 'todos') {
        if (l.status !== statusFilter) return false;
      }

      return true;
    });
  }, [leads, quickFilter, statusFilter, searchTerm, todayStr]);

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
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#00685f]">
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Ejecutivo Privado</span>
            </div>
            {onLockSession && (
              <button
                onClick={onLockSession}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
                title="Cerrar sesión y bloquear panel"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear</span>
              </button>
            )}
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
              {profile.features?.hasMeetingIntelligence && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                  AI Copilot
                </span>
              )}
            </div>
            <p className="text-xs text-[#00685f] font-semibold truncate">{profile.role}</p>
            <p className="text-[11px] text-stone-500 truncate">{profile.company}</p>
          </div>
        </div>

        {/* Module Switcher Tabs: Only shown when Meeting Intelligence or multiple modules are active */}
        {profile.features?.hasMeetingIntelligence && profile.features?.hasMiniCrm !== false && (
          <div className="bg-stone-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setActiveModuleTab('crm')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeModuleTab === 'crm'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Prospectos & CRM ({leads.length})</span>
            </button>
            <button
              onClick={() => setActiveModuleTab('meetings')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeModuleTab === 'meetings'
                  ? 'bg-gradient-to-r from-purple-700 to-teal-700 text-white shadow-xs'
                  : 'text-purple-800 hover:text-purple-900 font-extrabold'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Meeting Intelligence</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                PRO
              </span>
            </button>
          </div>
        )}

        {/* Conditionally Render Meeting Intelligence View OR Mini-CRM */}
        {activeModuleTab === 'meetings' && profile.features?.hasMeetingIntelligence ? (
          <MeetingIntelligenceView profile={profile} leads={leads} onShowToast={showToast} />
        ) : (
          <>
            {/* 1. Quick Follow-up Summary Bar */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setQuickFilter('vencidos')}
                className={`p-2.5 rounded-2xl border transition-all text-center cursor-pointer ${
                  quickFilter === 'vencidos'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : counts.vencidos > 0
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200'
                    : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 ${
                      quickFilter === 'vencidos'
                        ? 'text-white'
                        : counts.vencidos > 0
                        ? 'text-rose-600'
                        : 'text-stone-400'
                    }`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Vencidos</span>
                </div>
                <p className="text-lg font-black leading-none">{counts.vencidos}</p>
              </button>

              <button
                type="button"
                onClick={() => setQuickFilter('hoy')}
                className={`p-2.5 rounded-2xl border transition-all text-center cursor-pointer ${
                  quickFilter === 'hoy'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : counts.hoy > 0
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                    : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Clock
                    className={`w-3.5 h-3.5 ${
                      quickFilter === 'hoy'
                        ? 'text-white'
                        : counts.hoy > 0
                        ? 'text-amber-600'
                        : 'text-stone-400'
                    }`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Hoy</span>
                </div>
                <p className="text-lg font-black leading-none">{counts.hoy}</p>
              </button>

              <button
                type="button"
                onClick={() => setQuickFilter('sin_proximo_paso')}
                className={`p-2 sm:p-2.5 px-1 sm:px-2.5 rounded-2xl border transition-all text-center cursor-pointer ${
                  quickFilter === 'sin_proximo_paso'
                    ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                    : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-tight sm:tracking-wider whitespace-nowrap">
                    Sin paso
                  </span>
                </div>
                <p className="text-lg font-black leading-none">{counts.sin_proximo_paso}</p>
              </button>

              <button
                type="button"
                onClick={() => setQuickFilter('todos')}
                className={`p-2 sm:p-2.5 px-1 sm:px-2.5 rounded-2xl border transition-all text-center cursor-pointer ${
                  quickFilter === 'todos'
                    ? 'bg-[#00685f] text-white border-[#00685f] shadow-xs'
                    : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Users className="w-3.5 h-3.5 text-[#00685f]" />
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-tight sm:tracking-wider whitespace-nowrap">Todos</span>
                </div>
                <p className="text-lg font-black leading-none">{counts.todos}</p>
              </button>
            </div>

            {/* 2. SECTION: Mini-CRM Leads Inbox */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
              {/* Header & Demo action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-teal-100 text-[#00685f] flex items-center justify-center font-bold text-xs">
                    {leads.length}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Buzón de Prospectos & Próximos Pasos
                      </h2>
                      {isDemoProfile && (
                        <button
                          onClick={handleSeedMockLeads}
                          className="text-[10px] text-[#00685f] hover:text-[#00524b] font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200/60 transition-colors cursor-pointer"
                          title="Restaurar contactos de prueba (solo perfil demo)"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Restaurar Ejemplos</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400">{terminology.categoryLabel}</p>
                  </div>
                </div>
              </div>

              {/* Archetype Disclaimer (e.g. Salud / Institucional) */}
              {terminology.disclaimer && (
                <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-[11px] font-medium">
                    {terminology.disclaimer}
                  </span>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, empresa, notas o próximo paso..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:bg-white focus:border-[#00685f] outline-none transition-all placeholder-stone-400"
                />
              </div>

              {/* Quick Action Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setQuickFilter('todos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    quickFilter === 'todos'
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>Todos</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      quickFilter === 'todos'
                        ? 'bg-stone-800 text-stone-200'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {counts.todos}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickFilter('hoy')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    quickFilter === 'hoy'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hoy</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      quickFilter === 'hoy' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {counts.hoy}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickFilter('vencidos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    quickFilter === 'vencidos'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Vencidos</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      quickFilter === 'vencidos'
                        ? 'bg-rose-700 text-white'
                        : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {counts.vencidos}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickFilter('sin_proximo_paso')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    quickFilter === 'sin_proximo_paso'
                      ? 'bg-stone-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>Sin próximo paso</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      quickFilter === 'sin_proximo_paso'
                        ? 'bg-stone-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {counts.sin_proximo_paso}
                  </span>
                </button>
              </div>

              {/* Secondary Pipeline Status Filter Bar */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>Etapa:</span>
                </span>
                {(
                  [
                    { id: 'todos', label: 'Cualquiera' },
                    { id: 'nuevo', label: 'Nuevo' },
                    { id: 'contactado', label: 'Contactado' },
                    { id: 'reunion', label: terminology.reunionStageLabel },
                    { id: 'cerrado', label: terminology.cerradoStageLabel },
                    { id: 'descartado', label: 'Archivado' }
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === st.id
                        ? 'bg-[#00685f] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Demo Mode Notice */}
              {leads.some((l) => l.isDemo) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-left flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">
                      Modo Demostración Local Activo
                    </p>
                    <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
                      Los prospectos se gestionan y guardan exclusivamente en el almacenamiento de
                      este dispositivo. No se alteran estadísticas cloud ni se envían datos a
                      producción.
                    </p>
                  </div>
                </div>
              )}

              {/* Leads list */}
              {isLoadingLeads ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  Cargando prospectos...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50 space-y-2">
                  <Users className="w-8 h-8 text-stone-300 mx-auto mb-1" />
                  <p className="text-xs font-bold text-stone-800">
                    {quickFilter === 'hoy'
                      ? 'No tienes tareas programadas para hoy'
                      : quickFilter === 'vencidos'
                      ? '¡Seguimiento al día! No tienes acciones vencidas'
                      : quickFilter === 'sin_proximo_paso'
                      ? 'Todos tus prospectos tienen un próximo paso o están concluidos'
                      : searchTerm.trim()
                      ? `No hay prospectos que coincidan con "${searchTerm}"`
                      : 'Aún no tienes prospectos registrados'}
                  </p>
                  <p className="text-[11px] text-stone-500 max-w-sm mx-auto leading-relaxed">
                    {quickFilter === 'hoy'
                      ? 'Revisa tus acciones en "Vencidos" o programa un siguiente paso para los contactos recientes.'
                      : quickFilter === 'vencidos'
                      ? 'Excelente organización. Puedes definir nuevos hitos en la pestaña "Todos".'
                      : quickFilter === 'sin_proximo_paso'
                      ? 'Buen control de pipeline. Cuando recibas nuevos contactos, acuerda el siguiente paso.'
                      : 'Comparte tu tarjeta digital para captar datos con contexto y dar seguimiento 1 a 1.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => {
                    const statusColors: Record<string, string> = {
                      nuevo: 'bg-blue-50 text-blue-700 border-blue-200',
                      contactado: 'bg-amber-50 text-amber-700 border-amber-200',
                      reunion: 'bg-purple-50 text-purple-700 border-purple-200',
                      cerrado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      descartado: 'bg-stone-100 text-stone-500 border-stone-200'
                    };

                    const timing = getLeadActionTiming(lead, todayStr);

                    return (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-teal-300 hover:shadow-xs transition-all space-y-2.5 text-left"
                      >
                        {/* Header Row: Name, Status & Timing */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(lead)}
                                className="text-xs font-extrabold text-stone-900 hover:text-[#00685f] transition-colors cursor-pointer truncate text-left"
                              >
                                {lead.name}
                              </button>
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                                  statusColors[lead.status] || 'bg-stone-100 text-stone-600'
                                }`}
                              >
                                {lead.status}
                              </span>
                              {lead.syncStatus === 'pending' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full border bg-amber-50 text-amber-800 border-amber-300">
                                  Pendiente local
                                </span>
                              )}
                            </div>

                            {(lead.company || lead.role) && (
                              <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                                <Briefcase className="w-3 h-3 text-stone-400 shrink-0" />
                                <span className="truncate">
                                  {lead.role ? `${lead.role}` : ''}
                                  {lead.role && lead.company ? ' • ' : ''}
                                  {lead.company || ''}
                                </span>
                              </p>
                            )}
                          </div>

                          {/* Registration Date */}
                          <span className="text-[10px] text-stone-400 font-mono shrink-0">
                            {new Date(lead.timestamp).toLocaleDateString('es-MX', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>

                        {/* Outcomes & Needs / Solution Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {lead.outcome && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{formatOutcomeDisplayLabel(lead.outcome, profile.professionalProfile)}</span>
                              {lead.outcome.registeredAt && (
                                <span className="text-[9px] text-emerald-600 font-normal">
                                  • {lead.outcome.registeredAt}
                                </span>
                              )}
                            </div>
                          )}

                          {lead.solutionTitle && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-teal-50 border border-teal-200/80 text-[10px] text-[#00685f] font-semibold">
                              <Sparkles className="w-3 h-3 shrink-0" />
                              <span className="truncate">Interés: {lead.solutionTitle}</span>
                            </div>
                          )}
                        </div>

                        {lead.message && (
                          <div className="text-[11px] text-stone-600 line-clamp-1 italic bg-stone-50 p-1.5 rounded-lg border border-stone-200/60">
                            "{lead.message}"
                          </div>
                        )}

                        {/* Next Action Priority Banner */}
                        <div
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
                            lead.nextActionCompleted
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                              : timing === 'vencido'
                              ? 'bg-rose-50 border-rose-200 text-rose-900'
                              : timing === 'hoy'
                              ? 'bg-amber-50 border-amber-200 text-amber-900'
                              : lead.nextAction
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : 'bg-stone-50 border-stone-200 text-stone-500'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {lead.nextActionCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : timing === 'vencido' ? (
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            ) : timing === 'hoy' ? (
                              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : lead.nextAction ? (
                              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : (
                              <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                  {lead.nextActionCompleted
                                    ? 'Realizada'
                                    : timing === 'vencido'
                                    ? `Vencida (${lead.nextActionDate})`
                                    : timing === 'hoy'
                                    ? 'Hoy'
                                    : lead.nextActionDate
                                    ? lead.nextActionDate
                                    : 'Sin fecha'}
                                </span>
                                {lead.nextActionTime && !lead.nextActionCompleted && (
                                  <span className="text-[10px] font-mono text-stone-500">
                                    • {lead.nextActionTime}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-semibold truncate">
                                {lead.nextAction || 'Sin próximo paso definido'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(lead)}
                            className="text-[10px] font-bold text-[#00685f] hover:underline shrink-0 cursor-pointer"
                          >
                            {lead.nextAction ? 'Editar' : '+ Definir'}
                          </button>
                        </div>

                        {/* Titular Notes Excerpt (if present) */}
                        {lead.notes && (
                          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700 flex items-start gap-1.5">
                            <Lock className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1 italic">"{lead.notes}"</span>
                          </div>
                        )}

                        {/* Card Actions Bottom Row */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100 gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(lead)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              <span>Ficha & Notas</span>
                              <ChevronRight className="w-3 h-3 text-stone-400" />
                            </button>

                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as CapturedLead['status'])
                              }
                              className="bg-white border border-stone-200 text-stone-700 text-[10px] font-semibold rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">Contactado</option>
                              <option value="reunion">{terminology.reunionStageLabel}</option>
                              <option value="cerrado">{terminology.cerradoStageLabel}</option>
                              <option value="descartado">Archivado</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* WhatsApp Follow-up Button */}
                            <a
                              href={generateWhatsAppFollowUpUrl(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95"
                              title="Contactar por WhatsApp sin alterar estado automáticamente"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id, lead.name)}
                              className="p-1 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Eliminar contacto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. SECTION: Resultados Registrados */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {outcomeStats.total}
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      {isDemoProfile
                        ? 'Resultados Registrados (Ejemplos Demo)'
                        : 'Resultados Registrados por Ti'}
                    </h2>
                    <p className="text-[10px] text-stone-400">
                      {isDemoProfile
                        ? 'Ejemplos de acuerdos y logros comerciales para demostración'
                        : 'Acuerdos y logros comerciales confirmados directamente'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {outcomeStats.total} / {outcomeStats.leadsCount} contactos
                </span>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                {isDemoProfile
                  ? 'Cifras de ejemplo documentadas en los contactos de demostración. Son independientes de las etapas del embudo comercial.'
                  : 'Cifras declaradas explícitamente por ti en la ficha de cada contacto. Son independientes de la etapa del embudo comercial y no corresponden a conversiones automáticas calculadas.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block truncate" title={getOutcomeTerminology('venta_confirmada', profile.professionalProfile).label}>
                    {getOutcomeTerminology('venta_confirmada', profile.professionalProfile).label}
                  </span>
                  <p className="text-xl font-black text-emerald-950 mt-0.5">
                    {outcomeStats.byType.venta_confirmada}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block truncate" title={getOutcomeTerminology('cita_confirmada', profile.professionalProfile).label}>
                    {getOutcomeTerminology('cita_confirmada', profile.professionalProfile).label}
                  </span>
                  <p className="text-xl font-black text-teal-950 mt-0.5">
                    {outcomeStats.byType.cita_confirmada}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block truncate" title={getOutcomeTerminology('colaboracion_acordada', profile.professionalProfile).label}>
                    {getOutcomeTerminology('colaboracion_acordada', profile.professionalProfile).label}
                  </span>
                  <p className="text-xl font-black text-blue-950 mt-0.5">
                    {outcomeStats.byType.colaboracion_acordada}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200/80 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block truncate" title={getOutcomeTerminology('solicitud_atendida', profile.professionalProfile).label}>
                    {getOutcomeTerminology('solicitud_atendida', profile.professionalProfile).label}
                  </span>
                  <p className="text-xl font-black text-purple-950 mt-0.5">
                    {outcomeStats.byType.solicitud_atendida}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-100/70 border border-stone-200 text-left col-span-2 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block truncate" title={getOutcomeTerminology('otro', profile.professionalProfile).label}>
                    {getOutcomeTerminology('otro', profile.professionalProfile).label}
                  </span>
                  <p className="text-xl font-black text-stone-900 mt-0.5">
                    {outcomeStats.byType.otro}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. SECTION: Actividad Registrada de la Tarjeta */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Actividad Registrada de la Tarjeta
                  </h2>
                  <p className="text-[10px] text-stone-400">
                    Métricas acumuladas registradas en el navegador
                  </p>
                </div>
                <div>
                  {activitySummary.source === 'synthetic' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Demostración Sintética</span>
                    </span>
                  ) : activitySummary.source === 'local' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Registrado en este dispositivo</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                      <span>Sin datos registrados</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                Registro histórico acumulado local. No constituye analítica de servidor centralizada ni
                identifica personas únicas.
              </p>

              {/* 4 Honest Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: Vistas */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Aperturas de Tarjeta
                    </span>
                    <Eye className="w-4 h-4 text-[#00685f]" />
                  </div>
                  <p className="text-2xl font-black text-stone-900">{activitySummary.views}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    {activitySummary.qrScans} con origen QR
                  </p>
                  <p className="text-[9px] text-stone-400 mt-1 leading-tight">
                    Aperturas registradas en navegador. No garantiza personas únicas ni lectura
                    completa.
                  </p>
                </div>

                {/* Card 2: vCards Guardadas */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Descargas de Contacto
                    </span>
                    <Download className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-stone-900">{activitySummary.vcardDownloads}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Archivos .vcf generados</p>
                  <p className="text-[9px] text-stone-400 mt-1 leading-tight">
                    Descarga del archivo vCard. No demuestra que se haya guardado en la agenda
                    telefónica.
                  </p>
                </div>

                {/* Card 3: Clics a WhatsApp */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Intentos a WhatsApp
                    </span>
                    <MessageCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-2xl font-black text-stone-900">{activitySummary.whatsappClicks}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Clics al enlace de chat</p>
                  <p className="text-[9px] text-stone-400 mt-1 leading-tight">
                    Clics dirigidos a WhatsApp. No demuestra mensajes enviados ni respuestas recibidas.
                  </p>
                </div>

                {/* Card 4: Acciones por cada 100 vistas */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Acciones / 100 Vistas
                    </span>
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-black text-stone-900">{activitySummary.actionsPer100Views}</p>
                  <p className="text-[10px] text-amber-800 font-semibold mt-1">
                    {activitySummary.directActionsCount} acciones directas
                  </p>
                  <p className="text-[9px] text-stone-400 mt-1 leading-tight">
                    Relación de clics directos entre aperturas. Puede superar 100 si una persona hace
                    varias acciones.
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="pt-2 border-t border-stone-100">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Otras Interacciones Registradas
                </h3>
                <div className="divide-y divide-stone-100 text-xs">
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-stone-600">Compartidas por enlace / WhatsApp</span>
                    <span className="font-bold text-stone-900">{activitySummary.shares}</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-stone-600">Clics a enlaces de recursos</span>
                    <span className="font-bold text-stone-900">{activitySummary.linkClicks}</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-stone-600">Última actividad registrada</span>
                    <span className="font-mono text-[11px] text-stone-500">
                      {activitySummary.lastActive
                        ? new Date(activitySummary.lastActive).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Sin actividad registrada'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Herramientas de Cierre & Difusión (Secundario al fondo) */}
            <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-4 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-200">
                  Herramientas de Cierre & Difusión
                </h2>
              </div>
              <p className="text-[11px] text-stone-300 mb-3 leading-relaxed">
                Genera recursos ejecutivos de alta calidad para compartir tu contacto sin fricción en
                eventos o en cada correo que envíes.
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
          </>
        )}

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

      {/* Modals for Wallpaper, Signature & Lead Detail */}
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
      <LeadDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lead={selectedLeadForDetail}
        profile={profile}
        onUpdateLead={handleUpdateLead}
        onDeleteLead={handleDeleteLead}
        onShowToast={showToast}
      />
    </div>
  );
};
