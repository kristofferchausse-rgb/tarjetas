import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import { CapturedLead } from '../types/analytics';
import { MeetingRecording, DealTemperature } from '../types/meeting';
import {
  getMeetingsForProfile,
  toggleMeetingActionItem,
  deleteMeeting,
  seedMockMeetings
} from '../services/meetingService';
import { MeetingRecorderModal } from './MeetingRecorderModal';
import {
  Mic,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  User,
  Building2,
  Calendar,
  MessageCircle,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  AlertCircle,
  Radio,
  Share2
} from 'lucide-react';

interface MeetingIntelligenceViewProps {
  profile: ParticipantProfile;
  leads: CapturedLead[];
  onShowToast: (msg: string) => void;
}

export const MeetingIntelligenceView: React.FC<MeetingIntelligenceViewProps> = ({
  profile,
  leads,
  onShowToast
}) => {
  const [meetings, setMeetings] = useState<MeetingRecording[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRecorderOpen, setIsRecorderOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [temperatureFilter, setTemperatureFilter] = useState<'all' | DealTemperature>('all');
  const [expandedTranscripts, setExpandedTranscripts] = useState<Record<string, boolean>>({});

  const quotaTotal = profile.features?.aiMinutesQuota || 120;
  const quotaUsed = profile.features?.aiMinutesUsed || 26;
  const quotaRemaining = Math.max(0, quotaTotal - quotaUsed);

  const loadMeetings = async () => {
    setIsLoading(true);
    try {
      const data = await getMeetingsForProfile(profile.publicId);
      setMeetings(data);
    } catch (err) {
      console.warn('Error loading meetings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [profile.publicId]);

  const handleToggleAction = async (meetingId: string, actionId: string, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: m.actionItems.map((a) => (a.id === actionId ? { ...a, completed: nextCompleted } : a))
        };
      })
    );

    await toggleMeetingActionItem(profile.publicId, meetingId, actionId, nextCompleted);
    onShowToast(nextCompleted ? 'Compromiso marcado como completado.' : 'Compromiso reactivado.');
  };

  const handleDeleteMeeting = async (meetingId: string, title: string) => {
    if (window.confirm(`¿Deseas eliminar la grabación y minuta de "${title}"?`)) {
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
      await deleteMeeting(profile.publicId, meetingId);
      onShowToast('Grabación eliminada de la bitácora.');
    }
  };

  const handleSeedDemo = async () => {
    setIsLoading(true);
    try {
      const demo = await seedMockMeetings(profile.publicId);
      setMeetings(demo);
      onShowToast('¡Reuniones de demostración cargadas con éxito!');
    } catch {
      onShowToast('Error al recargar reuniones de prueba.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTranscript = (id: string) => {
    setExpandedTranscripts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateWhatsAppRecapUrl = (meeting: MeetingRecording) => {
    // Look up lead phone if associated
    const matchedLead = leads.find((l) => l.id === meeting.leadId || l.name === meeting.leadName);
    const rawPhone = matchedLead ? matchedLead.phone.replace(/[^0-9]/g, '') : '';
    const cleanPhone = rawPhone.startsWith('52') ? rawPhone : rawPhone ? `52${rawPhone}` : '';

    const summaryText = meeting.summary.map((s) => `• ${s}`).join('\n');
    const actionsText = meeting.actionItems
      .map((a) => `• [${a.completed ? 'Hecho' : 'Pendiente'}] ${a.assignee}: ${a.task}${a.dueDate ? ` (${a.dueDate})` : ''}`)
      .join('\n');

    const msg = `¡Hola ${meeting.leadName || 'Estimado cliente'}! 👋\n\nUn gusto platicar contigo. Te comparto la minuta y acuerdos clave de nuestra plática:\n\n📌 *${meeting.title}*\n\n📋 *Resumen:*\n${summaryText}\n\n🤝 *Acuerdos & Próximos Pasos:*\n${actionsText}\n\nQuedo a tu disposición para avanzar con todo.\n\n— *${profile.name}* (${profile.company})`;

    return cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };

  const handleCopyRecap = (meeting: MeetingRecording) => {
    const summaryText = meeting.summary.map((s) => `• ${s}`).join('\n');
    const actionsText = meeting.actionItems
      .map((a) => `• [${a.completed ? 'Hecho' : 'Pendiente'}] ${a.assignee}: ${a.task}${a.dueDate ? ` (${a.dueDate})` : ''}`)
      .join('\n');

    const fullText = `MINUTA EJECUTIVA: ${meeting.title}\nFecha: ${new Date(meeting.timestamp).toLocaleDateString()}\nContacto: ${meeting.leadName || 'Prospecto'}\n\nRESUMEN:\n${summaryText}\n\nACUERDOS:\n${actionsText}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      onShowToast('¡Minuta copiada al portapapeles!');
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    if (temperatureFilter !== 'all' && m.dealTemperature !== temperatureFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.leadName && m.leadName.toLowerCase().includes(q)) ||
      (m.leadCompany && m.leadCompany.toLowerCase().includes(q)) ||
      m.transcript.toLowerCase().includes(q) ||
      m.summary.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* 1. Feature Quota & Executive Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-teal-950 rounded-3xl p-5 text-white shadow-md border border-purple-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Módulo Premium Asignado
              </span>
              <span className="text-[11px] text-teal-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Meeting Intelligence</span>
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white">
              Bitácora de Reuniones & Minutas con IA
            </h2>
            <p className="text-xs text-stone-300 mt-0.5 max-w-md leading-relaxed">
              Graba pláticas en vivo o sube notas de voz de WhatsApp tras tus citas. La IA transcribe, extrae compromisos y redacta la minuta en 5 segundos.
            </p>
          </div>

          <button
            onClick={() => setIsRecorderOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>Grabar o Subir Audio</span>
          </button>
        </div>

        {/* Quota Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[11px] text-stone-300">
            <Clock className="w-3.5 h-3.5 text-purple-300" />
            <span>
              Consumo del mes: <strong>{quotaUsed} min</strong> de {quotaTotal} min ({quotaRemaining} min restantes)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (quotaUsed / quotaTotal) * 100)}%` }}
                className="bg-gradient-to-r from-teal-400 to-purple-400 h-full rounded-full"
              />
            </div>
            <button
              onClick={handleSeedDemo}
              className="text-[10px] text-purple-300 hover:text-white underline cursor-pointer"
              title="Restaurar grabaciones de prueba"
            >
              Demo
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en pláticas, compromisos o transcripciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
            />
          </div>

          {/* Temperature Filters */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-[10px] font-bold">
            {(['all', 'caliente', 'tibio', 'informativo'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setTemperatureFilter(filterKey)}
                className={`px-2 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  temperatureFilter === filterKey
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {filterKey === 'all'
                  ? 'Todas'
                  : filterKey === 'caliente'
                  ? '🔥 Calientes'
                  : filterKey === 'tibio'
                  ? 'Tibios'
                  : 'Info'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Chronological Meetings List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-stone-400 bg-white rounded-3xl border border-stone-200">
          Cargando grabaciones y minutas...
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-3xl bg-white space-y-2">
          <Mic className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="text-xs font-bold text-stone-800">
            {searchTerm || temperatureFilter !== 'all'
              ? 'No se encontraron pláticas con esos filtros'
              : 'Aún no hay reuniones grabadas en tu bitácora'}
          </h3>
          <p className="text-[11px] text-stone-500 max-w-sm mx-auto leading-relaxed">
            Graba una audio-nota de 30 segundos tras platicar con un prospecto y la IA extraerá automáticamente acuerdos y presupuestos.
          </p>
          <button
            onClick={() => setIsRecorderOpen(true)}
            className="mt-2 px-4 py-2 bg-[#00685f] hover:bg-[#00524b] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Grabar Primera Plática</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredMeetings.map((m) => {
            const isExpanded = !!expandedTranscripts[m.id];
            const dateStr = new Date(m.timestamp).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3 hover:border-stone-300 transition-all"
              >
                {/* Meeting Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2 border-b border-stone-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-[#1a1c1c]">{m.title}</h3>
                      {/* Temperature Badge */}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          m.dealTemperature === 'caliente'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : m.dealTemperature === 'tibio'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        <Flame className="w-3 h-3" />
                        <span className="capitalize">{m.dealTemperature}</span>
                      </span>
                      {/* Category Badge */}
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {m.category === 'audio_nota'
                          ? '🎙️ Audio-Nota'
                          : m.category === 'llamada_telefonica'
                          ? '📞 Llamada'
                          : '👥 Junta en Vivo'}
                      </span>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{Math.round(m.durationSeconds / 60)} min ({m.durationSeconds}s)</span>
                      </span>
                      {m.leadName && (
                        <span className="flex items-center gap-1 font-semibold text-[#00685f]">
                          <User className="w-3 h-3" />
                          <span>{m.leadName}</span>
                          {m.leadCompany && <span className="text-stone-400">({m.leadCompany})</span>}
                        </span>
                      )}
                      {m.budgetMentioned && (
                        <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <DollarSign className="w-3 h-3" />
                          <span>{m.budgetMentioned}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {/* 1-Click WhatsApp Recap Button */}
                    <a
                      href={generateWhatsAppRecapUrl(m)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                      title="Enviar minuta resumida por WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Minuta WhatsApp</span>
                    </a>
                    <button
                      onClick={() => handleCopyRecap(m)}
                      className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
                      title="Copiar minuta al portapapeles"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeeting(m.id, m.title)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Eliminar reunión"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Resumen Ejecutivo (IA)</span>
                  </div>
                  <ul className="space-y-1 text-xs text-stone-700 leading-relaxed pl-1">
                    {m.summary.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#00685f] font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {m.painPoints && m.painPoints.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-stone-200/60">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                        Puntos de Dolor & Retos Detectados:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.painPoints.map((pain, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px]"
                          >
                            ⚠️ {pain}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Action Items Checklist */}
                {m.actionItems && m.actionItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider">
                        Compromisos & Tareas Pendientes ({m.actionItems.filter((a) => a.completed).length}/{m.actionItems.length})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {m.actionItems.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => handleToggleAction(m.id, act.id, act.completed)}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                            act.completed
                              ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                              : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={act.completed}
                              onChange={() => {}} // handled by parent onClick
                              className="w-4 h-4 rounded text-[#00685f] focus:ring-0 cursor-pointer"
                            />
                            <span className="truncate">{act.task}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 text-[10px]">
                            <span className="font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                              {act.assignee}
                            </span>
                            {act.dueDate && (
                              <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                ⏰ {act.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcript Accordion */}
                <div className="pt-1">
                  <button
                    onClick={() => toggleTranscript(m.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-400" />
                    <span>{isExpanded ? 'Ocultar Transcripción' : 'Ver Transcripción Completa'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 bg-stone-900 text-stone-200 rounded-2xl text-[11px] font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-stone-800 animate-in fade-in duration-150">
                      {m.transcript}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recording Modal */}
      <MeetingRecorderModal
        isOpen={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        profile={profile}
        leads={leads}
        onMeetingSaved={(savedMeeting) => {
          setMeetings((prev) => [savedMeeting, ...prev]);
        }}
        onShowToast={onShowToast}
      />
    </div>
  );
};
