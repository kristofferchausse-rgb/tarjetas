import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import { CapturedLead, LeadOutcome, LeadOutcomeType } from '../types/analytics';
import { UpdateLeadFollowUpPayload } from '../services/leadService';
import {
  getArchetypeTerminology,
  getOutcomeTerminology,
  generateWhatsAppFollowUpMessage,
  generateWhatsAppFollowUpUrl,
  getLocalTodayDateString,
  getLeadActionTiming,
  normalizeActionDate
} from '../utils/crmTerminology';
import {
  X,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Phone,
  Mail,
  Briefcase,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  ChevronRight,
  User,
  FileText,
  Award,
  Trash2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { generateGoogleCalendarUrl } from '../utils/calendarExport';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: CapturedLead | null;
  profile: ParticipantProfile;
  onUpdateLead: (leadId: string, updates: UpdateLeadFollowUpPayload) => Promise<boolean>;
  onDeleteLead?: (leadId: string, leadName: string) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  isOpen,
  onClose,
  lead,
  profile,
  onUpdateLead,
  onShowToast
}) => {
  // Track active lead ID to isolate resets
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  // Notes state
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [isNotesDirty, setIsNotesDirty] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Next Action state
  const [isEditingAction, setIsEditingAction] = useState(false);
  const [isNewActionSession, setIsNewActionSession] = useState(false);
  const [actionTitleDraft, setActionTitleDraft] = useState<string>('');
  const [actionDateDraft, setActionDateDraft] = useState<string>('');
  const [actionTimeDraft, setActionTimeDraft] = useState<string>('');
  const [isActionDirty, setIsActionDirty] = useState(false);
  const [isSavingAction, setIsSavingAction] = useState(false);

  // Status state
  const [currentStatus, setCurrentStatus] = useState<CapturedLead['status']>('nuevo');

  // Outcome state
  const [outcomeTypeDraft, setOutcomeTypeDraft] = useState<LeadOutcomeType | null>(lead?.outcome?.type ?? null);
  const [outcomeLabelDraft, setOutcomeLabelDraft] = useState<string>(lead?.outcome?.label ?? '');
  const [outcomeDateDraft, setOutcomeDateDraft] = useState<string>(lead?.outcome?.registeredAt ?? '');
  const [outcomeNoteDraft, setOutcomeNoteDraft] = useState<string>(lead?.outcome?.note ?? '');
  const [isEditingOutcome, setIsEditingOutcome] = useState(false);
  const [isOutcomeDirty, setIsOutcomeDirty] = useState(false);
  const [isSavingOutcome, setIsSavingOutcome] = useState(false);

  // Storage error state
  const [storageError, setStorageError] = useState<string | null>(null);

  // Reset drafts ONLY when a different lead is selected or on modal open with a different lead
  useEffect(() => {
    if (isOpen && lead) {
      if (lead.id !== activeLeadId) {
        setActiveLeadId(lead.id);
        setNotesDraft(lead.notes ?? '');
        setIsNotesDirty(false);
        setActionTitleDraft(lead.nextAction ?? '');
        setActionDateDraft(normalizeActionDate(lead.nextActionDate) ?? '');
        setActionTimeDraft(lead.nextActionTime ?? '');
        setIsActionDirty(false);
        setIsEditingAction(!lead.nextAction);
        setIsNewActionSession(false);
        setCurrentStatus(lead.status);
        setOutcomeTypeDraft(lead.outcome?.type ?? null);
        setOutcomeLabelDraft(lead.outcome?.label ?? '');
        setOutcomeDateDraft(lead.outcome?.registeredAt ?? '');
        setOutcomeNoteDraft(lead.outcome?.note ?? '');
        setIsEditingOutcome(false);
        setIsOutcomeDirty(false);
        setStorageError(null);
      }
    } else if (!isOpen) {
      setActiveLeadId(null);
      setIsNotesDirty(false);
      setIsActionDirty(false);
      setIsOutcomeDirty(false);
      setStorageError(null);
    }
  }, [isOpen, lead?.id, activeLeadId]);

  if (!isOpen || !lead) return null;

  const terminology = getArchetypeTerminology(profile);
  const todayStr = getLocalTodayDateString();
  const timing = getLeadActionTiming(lead, todayStr);

  const handleNotesChange = (val: string) => {
    setNotesDraft(val);
    setIsNotesDirty(val !== (lead.notes || ''));
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setStorageError(null);
    try {
      const ok = await onUpdateLead(lead.id, { notes: notesDraft });
      if (ok) {
        setIsNotesDirty(false);
        onShowToast('Mis notas guardadas en este dispositivo');
      } else {
        setStorageError('No se pudo escribir en el almacenamiento del navegador. Conservamos tu borrador en pantalla.');
      }
    } catch {
      setStorageError('Error al guardar notas en el dispositivo.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setNotesDraft(lead.notes || '');
    setIsNotesDirty(false);
    setStorageError(null);
  };

  const handleSaveAction = async () => {
    if (!actionTitleDraft.trim()) {
      onShowToast('Escribe o selecciona una acción para el próximo paso.');
      return;
    }
    setIsSavingAction(true);
    setStorageError(null);
    try {
      const ok = await onUpdateLead(lead.id, {
        nextAction: actionTitleDraft.trim(),
        nextActionDate: actionDateDraft ? actionDateDraft.trim() : null,
        nextActionTime: actionTimeDraft ? actionTimeDraft.trim() : null,
        nextActionCompleted: false,
        isNewActionSession
      });
      if (ok) {
        setIsEditingAction(false);
        setIsActionDirty(false);
        setIsNewActionSession(false);
        onShowToast('Próximo paso programado con éxito');
      } else {
        setStorageError('Error de guardado: la acción se mantiene en pantalla.');
      }
    } catch {
      setStorageError('Error al guardar el próximo paso.');
    } finally {
      setIsSavingAction(false);
    }
  };

  const handleStartNewAction = () => {
    setActionTitleDraft('');
    setActionDateDraft('');
    setActionTimeDraft('');
    setIsActionDirty(true);
    setIsNewActionSession(true);
    setIsEditingAction(true);
  };

  const handleToggleActionCompleted = async () => {
    const nextCompleted = !lead.nextActionCompleted;
    setStorageError(null);
    const ok = await onUpdateLead(lead.id, {
      nextActionCompleted: nextCompleted
    });
    if (ok) {
      onShowToast(
        nextCompleted
          ? '✓ Acción marcada como realizada'
          : 'Acción reabierta como pendiente'
      );
    } else {
      setStorageError('No se pudo actualizar la tarea en el almacenamiento.');
    }
  };

  const handleStatusChange = async (newStatus: CapturedLead['status']) => {
    const prevStatus = currentStatus;
    setCurrentStatus(newStatus);
    setStorageError(null);
    const ok = await onUpdateLead(lead.id, { status: newStatus });
    if (ok) {
      onShowToast(`Estado comercial actualizado a "${newStatus}"`);
    } else {
      setCurrentStatus(prevStatus);
      setStorageError('No se pudo actualizar la etapa comercial en el dispositivo.');
    }
  };

  const handleQuickPresetDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setActionDateDraft(getLocalTodayDateString(d));
    setIsActionDirty(true);
  };

  const handleSaveOutcome = async () => {
    if (!lead || !outcomeTypeDraft) {
      onShowToast('Selecciona el tipo de resultado alcanzado.');
      return;
    }
    setIsSavingOutcome(true);
    setStorageError(null);
    try {
      const newOutcome: LeadOutcome = {
        type: outcomeTypeDraft,
        label: outcomeLabelDraft.trim() || undefined,
        registeredAt: outcomeDateDraft || getLocalTodayDateString(),
        note: outcomeNoteDraft.trim() || undefined
      };
      const ok = await onUpdateLead(lead.id, { outcome: newOutcome });
      if (ok) {
        setIsEditingOutcome(false);
        setIsOutcomeDirty(false);
        onShowToast('Resultado registrado en este dispositivo');
      } else {
        setStorageError('Error al guardar el resultado en el almacenamiento local.');
      }
    } catch {
      setStorageError('Error al guardar el resultado.');
    } finally {
      setIsSavingOutcome(false);
    }
  };

  const handleRemoveOutcome = async () => {
    if (!lead) return;
    if (window.confirm('¿Deseas retirar el resultado registrado para este contacto?')) {
      setIsSavingOutcome(true);
      setStorageError(null);
      try {
        const ok = await onUpdateLead(lead.id, { outcome: null });
        if (ok) {
          setOutcomeTypeDraft(null);
          setOutcomeLabelDraft('');
          setOutcomeDateDraft('');
          setOutcomeNoteDraft('');
          setIsEditingOutcome(false);
          setIsOutcomeDirty(false);
          onShowToast('Resultado retirado del contacto.');
        } else {
          setStorageError('Error al retirar el resultado en el almacenamiento local.');
        }
      } catch {
        setStorageError('Error al retirar el resultado.');
      } finally {
        setIsSavingOutcome(false);
      }
    }
  };

  const handleClose = () => {
    if (isNotesDirty || isActionDirty || isOutcomeDirty) {
      if (
        window.confirm(
          'Tienes cambios sin guardar en el borrador. ¿Deseas salir y descartarlos?'
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const formattedTimestamp = new Date(lead.timestamp).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const whatsappMessage = generateWhatsAppFollowUpMessage(lead);
  const whatsappUrl = generateWhatsAppFollowUpUrl(lead);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col text-[#1a1c1c] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-start justify-between gap-3 bg-stone-50/80 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                Ficha de Prospecto
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                Registrado {formattedTimestamp}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 mt-1 truncate">
              {lead.name}
            </h2>
            {(lead.company || lead.role) && (
              <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5 truncate">
                <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>
                  {lead.role ? `${lead.role}` : ''}
                  {lead.role && lead.company ? ' • ' : ''}
                  {lead.company || ''}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
            title="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left divide-y divide-stone-100">
          {/* Storage Alert Error */}
          {storageError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{storageError}</span>
            </div>
          )}

          {/* Section 1: Contact Channels & Commercial Stage */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                <span className="font-mono text-stone-800">{lead.phone}</span>
              </div>
              {lead.email ? (
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                  <span className="text-stone-800 truncate">{lead.email}</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-stone-50 border border-dashed border-stone-200 text-stone-400 italic">
                  Sin correo proporcionado
                </div>
              )}
            </div>

            {/* Commercial Pipeline Selector */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Etapa Comercial Vigente
                </label>
                <span className="text-[10px] text-stone-400">
                  {terminology.categoryLabel}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {(
                  [
                    { id: 'nuevo', label: 'Nuevo' },
                    { id: 'contactado', label: 'Contactado' },
                    { id: 'reunion', label: terminology.reunionStageLabel },
                    { id: 'cerrado', label: terminology.cerradoStageLabel },
                    { id: 'descartado', label: 'Archivado' }
                  ] as const
                ).map((stage) => {
                  const isSelected = currentStatus === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleStatusChange(stage.id)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-[#00685f] text-white shadow-2xs'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                      title={stage.label}
                    >
                      {stage.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section A: Mensaje Recibido (Visitante) */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <User className="w-3.5 h-3.5 text-[#00685f]" />
              <h3 className="uppercase tracking-wider text-[11px]">
                A. Mensaje Recibido (Visitante)
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/60 space-y-2">
              {lead.solutionTitle && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-teal-100/70 text-[#00685f] text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Interés: {lead.solutionTitle}</span>
                </div>
              )}
              <p className="text-xs text-stone-800 leading-relaxed italic">
                {lead.message ? `"${lead.message}"` : 'Sin mensaje adicional por parte del visitante.'}
              </p>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-teal-100">
                <span>{terminology.leadNeedLabel}: </span>
                <span className="font-semibold text-stone-700">
                  {lead.solutionTitle || 'Contacto directo desde tarjeta'}
                </span>
              </div>
            </div>
          </div>

          {/* Section B: Mis Notas (Titular) */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <FileText className="w-3.5 h-3.5 text-[#00685f]" />
                <h3 className="uppercase tracking-wider text-[11px]">
                  B. Mis Notas Privadas (Titular)
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Privado en este dispositivo</span>
              </div>
            </div>

            <p className="text-[10px] text-stone-500 leading-tight">
              Observaciones, acuerdos internos o antecedentes. Nunca se incluyen en WhatsApp, vCard ni exportación pública.
            </p>

            <textarea
              rows={3}
              value={notesDraft}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Ej. Interesado en cotización de 30 días, prefiere contacto por la tarde..."
              className="w-full p-3 rounded-2xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-800 bg-white placeholder-stone-400 transition-all outline-none resize-none"
            />

            {/* Note Actions: Save / Cancel / Status */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="text-[10px] text-stone-400">
                {isNotesDirty ? (
                  <span className="text-amber-600 font-semibold">
                    ● Cambios sin guardar en borrador
                  </span>
                ) : lead.localSavedAt ? (
                  <span>
                    Guardado en este dispositivo
                  </span>
                ) : (
                  <span>Sin cambios pendientes</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isNotesDirty && (
                  <button
                    type="button"
                    onClick={handleCancelNotes}
                    className="px-2.5 py-1 text-xs font-semibold text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Descartar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={!isNotesDirty || isSavingNotes}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isNotesDirty && !isSavingNotes
                      ? 'bg-[#00685f] hover:bg-[#00524b] text-white shadow-2xs active:scale-95'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingNotes ? 'Guardando...' : 'Guardar Mis Notas'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section C: Próximo Paso (Titular) */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-[#00685f]" />
                <h3 className="uppercase tracking-wider text-[11px]">
                  C. Próximo Paso de Seguimiento
                </h3>
              </div>
              {lead.nextAction && (
                <button
                  type="button"
                  onClick={() => setIsEditingAction(!isEditingAction)}
                  className="text-[10px] font-bold text-[#00685f] hover:underline cursor-pointer"
                >
                  {isEditingAction ? 'Cancelar edición' : 'Reprogramar / Editar'}
                </button>
              )}
            </div>

            {/* Active Action Display (when not editing) */}
            {!isEditingAction && lead.nextAction && (
              <div
                className={`p-3.5 rounded-2xl border space-y-2.5 transition-all ${
                  lead.nextActionCompleted
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : timing === 'vencido'
                    ? 'bg-rose-50/70 border-rose-200'
                    : timing === 'hoy'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {lead.nextActionCompleted ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          ✓ Realizada
                        </span>
                      ) : timing === 'vencido' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Vencida</span>
                        </span>
                      ) : timing === 'hoy' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Programada para Hoy</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">
                          Programada
                        </span>
                      )}

                      {lead.nextActionDate && (
                        <span className="text-xs font-mono font-bold text-stone-700">
                          {lead.nextActionDate} {lead.nextActionTime ? `• ${lead.nextActionTime}` : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-stone-900 pt-0.5">
                      {lead.nextAction}
                    </p>

                    {lead.nextActionDate && !lead.nextActionCompleted && (
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={generateGoogleCalendarUrl({
                            title: `${lead.nextAction} - ${lead.name}`,
                            date: lead.nextActionDate,
                            time: lead.nextActionTime,
                            description: `Cita con ${lead.name} (${lead.phone})\nEmpresa: ${lead.company || 'N/A'}\nNotas: ${lead.notes || 'Sin notas adicionales'}`
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-[10px] font-bold border border-stone-200 transition-colors cursor-pointer shadow-2xs"
                          title="Sincronizar y agendar en tu Google Calendar personal"
                        >
                          <ExternalLink className="w-3 h-3 text-[#00685f]" />
                          <span>Añadir a Google Calendar</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleActionCompleted}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      lead.nextActionCompleted
                        ? 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs active:scale-95'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {lead.nextActionCompleted ? 'Reabrir tarea' : 'Marcar realizada'}
                    </span>
                  </button>
                </div>

                {lead.nextActionCompleted && (
                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-800">
                      Acción completada. ¿Deseas acordar el siguiente paso?
                    </span>
                    <button
                      type="button"
                      onClick={handleStartNewAction}
                      className="text-xs font-bold text-emerald-900 underline cursor-pointer"
                    >
                      + Programar nuevo paso
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Edit Form */}
            {isEditingAction && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Sugerencias rápidas para tu actividad:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActionTitleDraft(`Cita: ${terminology.actionSuggestions[0] || 'Reunión de presentación'}`);
                        setActionDateDraft(todayStr);
                        setActionTimeDraft('10:00');
                        setIsActionDirty(true);
                      }}
                      className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-[10px] font-bold transition-all text-left cursor-pointer flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3 text-purple-600" />
                      <span>📅 Agendar Cita</span>
                    </button>
                    {terminology.actionSuggestions.map((sugg, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActionTitleDraft(sugg);
                          setIsActionDirty(true);
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-teal-50 border border-stone-200 hover:border-teal-300 text-stone-700 text-[10px] font-semibold transition-all text-left cursor-pointer"
                      >
                        + {sugg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Descripción de la próxima acción
                  </label>
                  <input
                    type="text"
                    value={actionTitleDraft}
                    onChange={(e) => {
                      setActionTitleDraft(e.target.value);
                      setIsActionDirty(true);
                    }}
                    placeholder="Ej. Enviar cotización técnica y coordinar llamada..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-800 bg-white placeholder-stone-400 outline-none"
                  />
                </div>

                {/* Date & Time Selection with Presets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>Fecha del calendario local</span>
                        {actionDateDraft && (
                          <button
                            type="button"
                            onClick={() => {
                              setActionDateDraft('');
                              setIsActionDirty(true);
                            }}
                            className="text-[9px] text-rose-600 font-bold hover:underline cursor-pointer"
                          >
                            (Limpiar)
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] text-stone-400 font-normal">Sin desvío UTC</span>
                    </label>
                    <input
                      type="date"
                      value={actionDateDraft}
                      onChange={(e) => {
                        setActionDateDraft(e.target.value);
                        setIsActionDirty(true);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none"
                    />
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(0)}
                        className="px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-[10px] font-bold text-stone-700 cursor-pointer"
                      >
                        Hoy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(1)}
                        className="px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-[10px] font-bold text-stone-700 cursor-pointer"
                      >
                        Mañana
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(3)}
                        className="px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-[10px] font-bold text-stone-700 cursor-pointer"
                      >
                        En 3 días
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(7)}
                        className="px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-[10px] font-bold text-stone-700 cursor-pointer"
                      >
                        En 1 sem
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Hora opcional
                    </label>
                    <input
                      type="time"
                      value={actionTimeDraft}
                      onChange={(e) => {
                        setActionTimeDraft(e.target.value);
                        setIsActionDirty(true);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Save Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                  {lead.nextAction && (
                    <button
                      type="button"
                      onClick={() => {
                        setActionTitleDraft(lead.nextAction || '');
                        setActionDateDraft(normalizeActionDate(lead.nextActionDate) || '');
                        setActionTimeDraft(lead.nextActionTime || '');
                        setIsActionDirty(false);
                        setIsNewActionSession(false);
                        setIsEditingAction(false);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveAction}
                    disabled={isSavingAction}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSavingAction ? 'Guardando...' : 'Guardar Próximo Paso'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section D: Resultado Registrado por Ti (Opcional) */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <h3 className="uppercase tracking-wider text-[11px]">
                  D. Resultado Registrado por Ti
                </h3>
              </div>
              <span className="text-[10px] text-stone-400">
                Registro manual veraz
              </span>
            </div>

            <p className="text-[10px] text-stone-500 leading-tight">
              Documenta si este contacto derivó en un hito concreto (venta, cita, colaboración o solicitud resuelta). No se calcula automáticamente.
            </p>

            {/* Display registered outcome */}
            {!isEditingOutcome && lead.outcome && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-200 text-amber-900 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{getOutcomeTerminology(lead.outcome.type, profile.professionalProfile).label}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-600">
                        {lead.outcome.registeredAt}
                      </span>
                    </div>
                    {lead.outcome.label ? (
                      <p className="text-xs font-bold text-stone-900">
                        {lead.outcome.label}
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-stone-600 italic">
                        {getOutcomeTerminology(lead.outcome.type, profile.professionalProfile).label}
                      </p>
                    )}
                    {lead.outcome.note && (
                      <p className="text-[11px] text-stone-600 italic">
                        "{lead.outcome.note}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOutcomeTypeDraft(lead.outcome?.type ?? null);
                        setOutcomeLabelDraft(lead.outcome?.label ?? '');
                        setOutcomeDateDraft(lead.outcome?.registeredAt ?? '');
                        setOutcomeNoteDraft(lead.outcome?.note ?? '');
                        setIsEditingOutcome(true);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveOutcome}
                      disabled={isSavingOutcome}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Retirar resultado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state when no outcome and not editing */}
            {!isEditingOutcome && !lead.outcome && (
              <div className="p-3 rounded-2xl bg-stone-50 border border-dashed border-stone-200 flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-stone-500 italic">
                  Sin resultado registrado todavía.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOutcomeTypeDraft('venta_confirmada');
                    setOutcomeDateDraft(getLocalTodayDateString());
                    setOutcomeLabelDraft('');
                    setOutcomeNoteDraft('');
                    setIsEditingOutcome(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Hito</span>
                </button>
              </div>
            )}

            {/* Outcome Edit Form */}
            {isEditingOutcome && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Tipo de resultado alcanzado
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: 'venta_confirmada', key: 'venta_confirmada' },
                        { id: 'cita_confirmada', key: 'cita_confirmada' },
                        { id: 'colaboracion_acordada', key: 'colaboracion_acordada' },
                        { id: 'solicitud_atendida', key: 'solicitud_atendida' },
                        { id: 'otro', key: 'otro' }
                      ] as const
                    ).map((t) => {
                      const isSelected = outcomeTypeDraft === t.id;
                      const term = getOutcomeTerminology(t.id, profile.professionalProfile);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setOutcomeTypeDraft(t.id);
                            setIsOutcomeDirty(true);
                          }}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold shadow-2xs'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate">{term.label}</div>
                          <div className="text-[9px] text-stone-500 leading-tight line-clamp-1">{term.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Fecha del hito
                    </label>
                    <input
                      type="date"
                      value={outcomeDateDraft}
                      onChange={(e) => {
                        setOutcomeDateDraft(e.target.value);
                        setIsOutcomeDirty(true);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Título o concepto (opcional)
                    </label>
                    <input
                      type="text"
                      value={outcomeLabelDraft}
                      onChange={(e) => {
                        setOutcomeLabelDraft(e.target.value);
                        setIsOutcomeDirty(true);
                      }}
                      placeholder="Ej. Contrato de 6 meses..."
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white placeholder-stone-400 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Nota o detalle adicional (opcional)
                  </label>
                  <input
                    type="text"
                    value={outcomeNoteDraft}
                    onChange={(e) => {
                      setOutcomeNoteDraft(e.target.value);
                      setIsOutcomeDirty(true);
                    }}
                    placeholder="Ej. Anticipo cubierto, inicio programado..."
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white placeholder-stone-400 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setOutcomeTypeDraft(lead.outcome?.type ?? null);
                      setOutcomeLabelDraft(lead.outcome?.label ?? '');
                      setOutcomeDateDraft(lead.outcome?.registeredAt ?? '');
                      setOutcomeNoteDraft(lead.outcome?.note ?? '');
                      setIsEditingOutcome(false);
                      setIsOutcomeDirty(false);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveOutcome}
                    disabled={isSavingOutcome || !outcomeTypeDraft}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSavingOutcome ? 'Guardando...' : 'Guardar Resultado'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section E: WhatsApp con Contexto y Control */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
                <h3 className="uppercase tracking-wider text-[11px]">
                  E. Continuar por WhatsApp con Contexto
                </h3>
              </div>
              <span className="text-[10px] text-stone-400">
                Control editorial del titular
              </span>
            </div>

            <p className="text-[10px] text-stone-500 leading-tight">
              Prepara un mensaje directo con la necesidad conocida. Abrir WhatsApp no envía el mensaje de forma automática ni altera el estado comercial de tu contacto.
            </p>

            <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-700 font-mono leading-relaxed">
              "{whatsappMessage}"
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              <div className="text-[10px] text-stone-500">
                {lead.status === 'nuevo' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('contactado')}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#00685f] border border-teal-200 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Marcar como Contactado
                  </button>
                )}
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp con este mensaje</span>
              </a>
            </div>
          </div>

          {/* Regulatory / Archetype Disclaimer */}
          {terminology.disclaimer && (
            <div className="pt-3">
              <p className="text-[10px] text-stone-400 italic leading-relaxed">
                * {terminology.disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-[10px] text-stone-400">
            Mini-CRM • RedConecta MX
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};

