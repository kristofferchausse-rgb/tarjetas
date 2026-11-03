import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import { CapturedLead, LeadOutcome } from '../types/analytics';
import { AddManualLeadPayload } from '../services/leadService';
import { getArchetypeTerminology, getLocalTodayDateString } from '../utils/crmTerminology';
import {
  X,
  UserPlus,
  Calendar,
  Clock,
  Briefcase,
  Phone,
  Mail,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Users,
  Video,
  MapPin,
  MessageSquare
} from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  initialMode?: 'lead' | 'appointment';
  preselectedLead?: CapturedLead | null;
  existingLeads: CapturedLead[];
  onAddLead: (payload: AddManualLeadPayload) => Promise<boolean>;
  onScheduleAppointment: (
    leadId: string,
    appointmentData: { title: string; date: string; time?: string; notes?: string }
  ) => Promise<boolean>;
  onShowToast: (msg: string) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialMode = 'lead',
  preselectedLead = null,
  existingLeads,
  onAddLead,
  onScheduleAppointment,
  onShowToast
}) => {
  const [mode, setMode] = useState<'lead' | 'appointment'>(initialMode);

  // Form State: Lead details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [initialStatus, setInitialStatus] = useState<CapturedLead['status']>('nuevo');
  const [notes, setNotes] = useState('');

  // Form State: Appointment / Next Action details
  const [includeAppointment, setIncludeAppointment] = useState(false);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentLocationType, setAppointmentLocationType] = useState<'presencial' | 'videollamada' | 'llamada'>('presencial');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Form State: Existing Lead Selection (for appointment mode)
  const [appointmentTarget, setAppointmentTarget] = useState<'existing' | 'new'>(
    preselectedLead ? 'existing' : existingLeads.length > 0 ? 'existing' : 'new'
  );
  const [selectedLeadId, setSelectedLeadId] = useState<string>(preselectedLead?.id || '');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const terminology = getArchetypeTerminology(profile);
  const todayStr = getLocalTodayDateString();

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
      setIsSubmitting(false);

      if (preselectedLead) {
        setAppointmentTarget('existing');
        setSelectedLeadId(preselectedLead.id);
        setName(preselectedLead.name);
        setPhone(preselectedLead.phone);
        setCompany(preselectedLead.company || '');
        setRole(preselectedLead.role || '');
      } else {
        setAppointmentTarget(existingLeads.length > 0 && initialMode === 'appointment' ? 'existing' : 'new');
        setSelectedLeadId(existingLeads[0]?.id || '');
        setName('');
        setPhone('');
        setEmail('');
        setCompany('');
        setRole('');
        setInitialStatus('nuevo');
        setNotes('');
      }

      setIncludeAppointment(initialMode === 'appointment');
      setAppointmentTitle(
        initialMode === 'appointment'
          ? terminology.archetypeId === 'salud'
            ? 'Cita de valoración en consultorio'
            : 'Reunión de presentación'
          : ''
      );
      setAppointmentDate(todayStr);
      setAppointmentTime('10:00');
      setAppointmentLocationType('presencial');
      setAppointmentNotes('');
    }
  }, [isOpen, initialMode, preselectedLead, existingLeads.length]);

  if (!isOpen) return null;

  const handleQuickPresetDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setAppointmentDate(getLocalTodayDateString(d));
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setErrorMsg('Por favor ingresa el nombre del contacto.');
      return;
    }
    if (!cleanPhone) {
      setErrorMsg('Por favor ingresa un teléfono o número de WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalStatus = initialStatus;
      let nextAction: string | undefined = undefined;
      let nextActionDate: string | undefined = undefined;
      let nextActionTime: string | undefined = undefined;
      let outcome: LeadOutcome | undefined = undefined;

      if (includeAppointment && appointmentTitle.trim()) {
        finalStatus = 'reunion';
        nextAction = `${appointmentLocationType === 'videollamada' ? '📹 ' : appointmentLocationType === 'llamada' ? '📞 ' : '📍 '}${appointmentTitle.trim()}`;
        nextActionDate = appointmentDate || todayStr;
        nextActionTime = appointmentTime || undefined;

        outcome = {
          type: 'cita_confirmada',
          registeredAt: appointmentDate || todayStr,
          label: appointmentTitle.trim(),
          note: appointmentNotes.trim() || undefined
        };
      }

      const payload: AddManualLeadPayload = {
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        status: finalStatus,
        notes: notes.trim() || undefined,
        nextAction,
        nextActionDate,
        nextActionTime,
        outcome
      };

      const success = await onAddLead(payload);
      if (success) {
        onShowToast(`✓ ${cleanName} agregado al CRM correctamente`);
        onClose();
      } else {
        setErrorMsg('No se pudo guardar el prospecto en el dispositivo. Intenta nuevamente.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error inesperado al agregar el contacto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanTitle = appointmentTitle.trim();
    if (!cleanTitle) {
      setErrorMsg('Por favor ingresa el asunto o motivo de la cita.');
      return;
    }
    if (!appointmentDate) {
      setErrorMsg('Por favor selecciona la fecha de la cita.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Case A: Appointment for existing lead
      if (appointmentTarget === 'existing' && selectedLeadId) {
        const targetLead = existingLeads.find((l) => l.id === selectedLeadId);
        const formattedTitle = `${appointmentLocationType === 'videollamada' ? '📹 ' : appointmentLocationType === 'llamada' ? '📞 ' : '📍 '}${cleanTitle}`;

        const success = await onScheduleAppointment(selectedLeadId, {
          title: formattedTitle,
          date: appointmentDate,
          time: appointmentTime || undefined,
          notes: appointmentNotes.trim() || undefined
        });

        if (success) {
          onShowToast(`✓ Cita agendada con ${targetLead?.name || 'el contacto'} para el ${appointmentDate}`);
          onClose();
        } else {
          setErrorMsg('No se pudo registrar la cita. Verifica el almacenamiento.');
        }
      }
      // Case B: Appointment for a new lead
      else {
        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        if (!cleanName) {
          setErrorMsg('Por favor ingresa el nombre del contacto con quien es la cita.');
          setIsSubmitting(false);
          return;
        }
        if (!cleanPhone) {
          setErrorMsg('Por favor ingresa el teléfono o WhatsApp del contacto.');
          setIsSubmitting(false);
          return;
        }

        const formattedTitle = `${appointmentLocationType === 'videollamada' ? '📹 ' : appointmentLocationType === 'llamada' ? '📞 ' : '📍 '}${cleanTitle}`;

        const payload: AddManualLeadPayload = {
          name: cleanName,
          phone: cleanPhone,
          company: company.trim() || undefined,
          role: role.trim() || undefined,
          status: 'reunion',
          notes: notes.trim() || undefined,
          nextAction: formattedTitle,
          nextActionDate: appointmentDate,
          nextActionTime: appointmentTime || undefined,
          outcome: {
            type: 'cita_confirmada',
            registeredAt: appointmentDate,
            label: cleanTitle,
            note: appointmentNotes.trim() || undefined
          }
        };

        const success = await onAddLead(payload);
        if (success) {
          onShowToast(`✓ Cita agendada con ${cleanName} para el ${appointmentDate}`);
          onClose();
        } else {
          setErrorMsg('Error al guardar la cita y el nuevo contacto.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error inesperado al agendar la cita.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-100 text-[#00685f] flex items-center justify-center">
              {mode === 'lead' ? <UserPlus className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
                {mode === 'lead' ? 'Nuevo Prospecto Manual' : 'Agendar Cita / Reunión'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {mode === 'lead'
                  ? 'Registra un contacto captado en persona, llamada o evento'
                  : 'Fija fecha, hora y compromiso en el calendario'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-4 sm:px-5 pt-3 pb-1 border-b border-stone-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('lead');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'lead'
                ? 'bg-[#00685f] text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo Prospecto</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('appointment');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'appointment'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar Cita</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-4 sm:mx-5 mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {mode === 'lead' ? (
            /* ============================================================== */
            /* MODE 1: AGREGAR PROSPECTO MANUAL                               */
            /* ============================================================== */
            <form id="add-lead-form" onSubmit={handleSubmitLead} className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600">
                  <UserPlus className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Datos del Contacto</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Nombre Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Arq. Miguel Morales"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>Teléfono / WhatsApp <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+52 442 123 4567"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-900 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-stone-400" />
                      <span>Correo Electrónico</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contacto@ejemplo.com"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-stone-400" />
                      <span>Empresa / Organización</span>
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ej. Desarrollos del Bajío"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-stone-400" />
                      <span>Cargo / Especialidad</span>
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ej. Director de Proyectos"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Etapa Comercial Inicial
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'nuevo', label: 'Nuevo' },
                      { id: 'contactado', label: 'Contactado' },
                      { id: 'reunion', label: 'Cita / Reunión' },
                      { id: 'cerrado', label: 'Cerrado' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setInitialStatus(st.id as CapturedLead['status'])}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          initialStatus === st.id
                            ? 'bg-teal-50 border-[#00685f] text-[#00685f] shadow-2xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-stone-400" />
                    <span>Notas o Contexto de la Conversación</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nos conocimos en el evento de networking; busca una solución para..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] text-xs text-stone-900 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Optional Appointment Section */}
              <div className="pt-3 border-t border-stone-200">
                <div
                  onClick={() => setIncludeAppointment(!includeAppointment)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-200 text-purple-800 flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-purple-950">
                        ¿Agendar Cita o Próximo Paso de una vez?
                      </span>
                      <p className="text-[10px] text-purple-700">
                        Fija fecha en calendario para que aparezca en tus tareas de seguimiento
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeAppointment}
                    onChange={(e) => setIncludeAppointment(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                {includeAppointment && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-white border border-purple-200 space-y-3 shadow-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Asunto o Motivo de la Cita / Próximo Paso
                      </label>
                      <input
                        type="text"
                        value={appointmentTitle}
                        onChange={(e) => setAppointmentTitle(e.target.value)}
                        placeholder="Ej. Reunión de presentación y diagnóstico..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 outline-none focus:border-purple-600"
                      />

                      {/* Quick Suggestions Chips */}
                      {terminology.actionSuggestions && terminology.actionSuggestions.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mt-1.5">
                          {terminology.actionSuggestions.slice(0, 3).map((sugg, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setAppointmentTitle(sugg)}
                              className="px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[10px] font-semibold border border-purple-200 transition-colors cursor-pointer"
                            >
                              + {sugg}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                          <span>Fecha</span>
                          <span className="text-[9px] text-stone-400">Calendario local</span>
                        </label>
                        <input
                          type="date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none"
                        />
                        <div className="flex items-center gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleQuickPresetDate(0)}
                            className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700 cursor-pointer"
                          >
                            Hoy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickPresetDate(1)}
                            className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700 cursor-pointer"
                          >
                            Mañana
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickPresetDate(3)}
                            className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700 cursor-pointer"
                          >
                            +3 días
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Hora estimada
                        </label>
                        <input
                          type="time"
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none"
                        />
                        <div className="flex items-center gap-1 pt-1">
                          {['10:00', '12:00', '16:00', '18:00'].map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setAppointmentTime(h)}
                              className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700 cursor-pointer"
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Modalidad
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'presencial', label: 'Presencial', icon: MapPin },
                          { id: 'videollamada', label: 'Videollamada', icon: Video },
                          { id: 'llamada', label: 'Llamada', icon: Phone }
                        ].map((m) => {
                          const IconComp = m.icon;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setAppointmentLocationType(m.id as any)}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                appointmentLocationType === m.id
                                  ? 'bg-purple-100 border-purple-500 text-purple-900 shadow-2xs'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                              }`}
                            >
                              <IconComp className="w-3 h-3" />
                              <span>{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* ============================================================== */
            /* MODE 2: AGENDAR CITA DIRECTAMENTE                              */
            /* ============================================================== */
            <form id="add-appointment-form" onSubmit={handleSubmitAppointment} className="space-y-4">
              {/* Target Selector: Existing vs New Contact */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  ¿Con quién es la cita?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAppointmentTarget('existing')}
                    disabled={existingLeads.length === 0}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      appointmentTarget === 'existing'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Contacto existente ({existingLeads.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentTarget('new')}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      appointmentTarget === 'new'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Nuevo contacto</span>
                  </button>
                </div>
              </div>

              {/* Existing Contact Selector */}
              {appointmentTarget === 'existing' ? (
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Seleccionar Contacto del CRM
                  </label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-purple-600 text-xs text-stone-900 bg-white outline-none cursor-pointer"
                  >
                    {existingLeads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} {l.company ? `(${l.company})` : ''} • {l.phone}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Quick New Contact Fields */
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                    <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                    <span>Datos del Nuevo Contacto</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-0.5">
                      Nombre completo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Lic. Fernando Treviño"
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 mb-0.5">
                        Teléfono / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+52 442 555 1234"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 mb-0.5">
                        Empresa (opcional)
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ej. Constructora QRO"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment Details */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                  <Calendar className="w-3.5 h-3.5 text-purple-700" />
                  <span>Detalles de la Cita / Reunión</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Asunto o Motivo de la Cita <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={appointmentTitle}
                    onChange={(e) => setAppointmentTitle(e.target.value)}
                    placeholder="Ej. Revisión de propuesta comercial y alcances..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 outline-none focus:border-purple-600"
                  />

                  {/* Archetype suggestions */}
                  {terminology.actionSuggestions && terminology.actionSuggestions.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1.5">
                      {terminology.actionSuggestions.slice(0, 3).map((sugg, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAppointmentTitle(sugg)}
                          className="px-2 py-0.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 text-[10px] font-semibold border border-purple-200 transition-colors cursor-pointer"
                        >
                          + {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>Fecha</span>
                      <span className="text-[9px] text-stone-400">Sin desvío UTC</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none"
                    />
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(0)}
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-200 text-[10px] font-bold text-stone-700 border border-stone-200 cursor-pointer"
                      >
                        Hoy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(1)}
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-200 text-[10px] font-bold text-stone-700 border border-stone-200 cursor-pointer"
                      >
                        Mañana
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(3)}
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-200 text-[10px] font-bold text-stone-700 border border-stone-200 cursor-pointer"
                      >
                        En 3 días
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPresetDate(7)}
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-200 text-[10px] font-bold text-stone-700 border border-stone-200 cursor-pointer"
                      >
                        En 1 sem
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none"
                    />
                    <div className="flex items-center gap-1 pt-1">
                      {['10:00', '11:30', '16:00', '17:30'].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setAppointmentTime(h)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-200 text-[10px] font-bold text-stone-700 border border-stone-200 cursor-pointer"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Modalidad
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'presencial', label: 'Presencial', icon: MapPin },
                      { id: 'videollamada', label: 'Videollamada', icon: Video },
                      { id: 'llamada', label: 'Llamada', icon: Phone }
                    ].map((m) => {
                      const IconComp = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setAppointmentLocationType(m.id as any)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            appointmentLocationType === m.id
                              ? 'bg-purple-100 border-purple-500 text-purple-900 shadow-2xs'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <IconComp className="w-3 h-3" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Notas o Preparación de la Cita (opcional)
                  </label>
                  <input
                    type="text"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Ej. Llevar muestras de producto y cotización impresa..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 outline-none"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Cancelar
          </button>

          {mode === 'lead' ? (
            <button
              type="submit"
              form="add-lead-form"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Prospecto'}</span>
            </button>
          ) : (
            <button
              type="submit"
              form="add-appointment-form"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Agendando...' : 'Confirmar y Agendar Cita'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
