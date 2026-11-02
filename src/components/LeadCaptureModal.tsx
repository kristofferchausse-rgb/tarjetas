import React, { useState } from 'react';
import { ParticipantProfile } from '../types/card';
import { recordActivity } from '../utils/analytics';
import { CardLanguage, CARD_TRANSLATIONS } from '../utils/i18n';
import { saveLead, SaveLeadResult } from '../services/leadService';
import { parsePhoneNumber } from '../utils/phone';
import {
  X,
  UserCheck,
  MessageCircle,
  Building2,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { getProfileConfig } from '../data/professionalProfiles';
import { LegalNoticeModal } from './LegalNoticeModal';

export interface LeadCaptureContext {
  source: 'general' | 'solution';
  solutionId?: string;
  solutionTitle?: string;
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
  lang?: CardLanguage;
  context?: LeadCaptureContext | null;
  onClearContext?: () => void;
}

function generateStableLeadId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast,
  lang = 'es',
  context,
  onClearContext
}) => {
  // Stable ID and timestamp preserved strictly across retries of the same attempt
  const [activeAttempt, setActiveAttempt] = useState<{ id: string; timestamp: string } | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SaveLeadResult | null>(null);

  const t = CARD_TRANSLATIONS[lang] || CARD_TRANSLATIONS.es;
  const profileCfg = getProfileConfig(profile.professionalProfile, lang);

  if (!isOpen) return null;

  const resetAllFields = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCompany('');
    setMessage('');
    setPrivacyAccepted(false);
    setSubmissionResult(null);
    setActiveAttempt(null);
    if (onClearContext) onClearContext();
  };

  const handleClose = () => {
    if (submissionResult?.status === 'confirmed') {
      resetAllFields();
    }
    onClose();
  };

  const executeSave = async () => {
    const parsedUserPhone = parsePhoneNumber(phone.trim());
    if (!name.trim() || !phone.trim()) {
      onShowToast(lang === 'en' ? 'Please enter at least your name and phone number.' : 'Por favor escribe al menos tu nombre y teléfono.');
      return;
    }
    if (!parsedUserPhone.isValid) {
      onShowToast(lang === 'en' ? 'Please enter a valid phone number (10 digits or international format).' : 'Por favor introduce un teléfono válido (10 dígitos o con clave internacional +).');
      return;
    }
    if (!privacyAccepted) {
      onShowToast(lang === 'en' ? 'Please accept the Privacy Notice to continue.' : 'Por favor acepta el Aviso de Privacidad para continuar.');
      return;
    }

    // Preserve exact stable ID and timestamp across retries of this logical attempt
    let attempt = activeAttempt;
    if (!attempt) {
      attempt = {
        id: generateStableLeadId(),
        timestamp: new Date().toISOString()
      };
      setActiveAttempt(attempt);
    }

    setIsSubmitting(true);
    try {
      const res = await saveLead({
        id: attempt.id,
        timestamp: attempt.timestamp,
        publicId: profile.publicId,
        name: name.trim(),
        phone: parsedUserPhone.formattedDisplay || phone.trim(),
        email: email.trim() || undefined,
        company: company.trim() || undefined,
        message: message.trim() || undefined,
        source: context?.source || 'general',
        solutionId: context?.solutionId,
        solutionTitle: context?.solutionTitle
      });

      setSubmissionResult(res);

      if (res.status === 'confirmed') {
        // Record analytics event once upon confirmation
        recordActivity(
          profile.publicId,
          profile.shortName,
          'lead_capture',
          `Contacto confirmado de ${name.trim()} (${phone.trim()})`
        );
      }
    } catch (err: any) {
      setSubmissionResult({
        status: 'failed',
        lead: {
          id: attempt.id,
          publicId: profile.publicId,
          name: name.trim(),
          phone: phone.trim(),
          timestamp: attempt.timestamp,
          status: 'nuevo',
          source: context?.source || 'general',
          solutionId: context?.solutionId,
          solutionTitle: context?.solutionTitle
        },
        error: err?.message || 'Error inesperado'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    await executeSave();
  };

  const handleRetry = async () => {
    if (isSubmitting) return;
    await executeSave();
  };

  // WhatsApp message generation with selected contextual solution if present
  const recipientPhone = parsePhoneNumber(profile.phone);
  const solutionContextText = context?.solutionTitle
    ? (lang === 'en' ? `\n• Solution of interest: ${context.solutionTitle}` : `\n• Interés en: ${context.solutionTitle}`)
    : '';

  const waText = lang === 'en'
    ? `Hello ${profile.name}! 👋\n\nI was viewing your digital card and would like to connect with you:${solutionContextText}\n• Name: ${name.trim()}\n• Phone: ${phone.trim()}${email.trim() ? `\n• Email: ${email.trim()}` : ''}${company.trim() ? `\n• Company / Role: ${company.trim()}` : ''}${message.trim() ? `\n• Message: ${message.trim()}` : ''}\n\nLooking forward to speaking with you.`
    : `¡Hola ${profile.name}! 👋\n\nEstuve revisando tu tarjeta digital y me gustaría conectar contigo:${solutionContextText}\n• Nombre: ${name.trim()}\n• Teléfono: ${phone.trim()}${email.trim() ? `\n• Email: ${email.trim()}` : ''}${company.trim() ? `\n• Empresa / Cargo: ${company.trim()}` : ''}${message.trim() ? `\n• Mensaje: ${message.trim()}` : ''}\n\nQuedo a tu disposición para conversar.`;

  const waUrl = recipientPhone.isValid && recipientPhone.waDigits
    ? `https://wa.me/${recipientPhone.waDigits}?text=${encodeURIComponent(waText)}`
    : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer z-10"
          aria-label={lang === 'en' ? 'Close dialog' : 'Cerrar diálogo'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* CASO A: Confirmado Remotamente */}
        {/* ------------------------------------------------------------- */}
        {submissionResult?.status === 'confirmed' && (
          <div className="flex flex-col items-center text-center py-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-base font-extrabold text-[#1a1c1c]">
              {lang === 'en' ? 'Information Received!' : '¡Datos registrados con éxito!'}
            </h3>
            <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">
              {lang === 'en'
                ? `Your contact information was successfully registered so ${profile.shortName} can follow up with your inquiry.`
                : `Tus datos quedaron registrados para que ${profile.shortName} pueda retomar tu consulta.`}
            </p>

            {context?.solutionTitle && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#00685f]" />
                <span className="truncate max-w-[240px]">Interés: {context.solutionTitle}</span>
              </div>
            )}

            <div className="w-full mt-6 space-y-2.5">
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Open WhatsApp conversation' : 'Abrir WhatsApp'}</span>
                </a>
              ) : null}

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Done' : 'Listo'}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASO B: Pendiente en navegador local */}
        {/* ------------------------------------------------------------- */}
        {submissionResult?.status === 'pending' && (
          <div className="flex flex-col items-center text-center py-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-3 shadow-xs">
              <Clock className="w-8 h-8" />
            </div>

            <h3 className="text-base font-extrabold text-[#1a1c1c]">
              {lang === 'en' ? 'Saved in this browser' : 'Registro guardado en este navegador'}
            </h3>
            <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">
              {lang === 'en'
                ? `Your contact info is preserved in this browser. Remote confirmation to ${profile.shortName} is pending (likely due to network interruption). You can retry now or connect directly via WhatsApp.`
                : `Tus datos quedaron pendientes en este navegador. Aún no se confirmó su envío a ${profile.shortName} (posiblemente por intermitencia de red). Puedes reintentar o continuar por WhatsApp.`}
            </p>

            <p className="text-[11px] text-stone-400 mt-1 max-w-xs leading-tight">
              {lang === 'en'
                ? 'We will automatically retry sending when your connection is restored.'
                : 'Reintentaremos el envío de forma controlada cuando vuelva tu conexión.'}
            </p>

            <div className="w-full mt-6 space-y-2">
              <button
                type="button"
                onClick={handleRetry}
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <RotateCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? (lang === 'en' ? 'Retrying...' : 'Reintentando...') : (lang === 'en' ? 'Retry confirmation' : 'Reintentar ahora')}</span>
              </button>

              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Continue via WhatsApp' : 'Continuar por WhatsApp'}</span>
                </a>
              ) : null}

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Close and keep pending' : 'Cerrar y conservar pendiente'}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASO C: Fallido (no local ni remoto) */}
        {/* ------------------------------------------------------------- */}
        {submissionResult?.status === 'failed' && (
          <div className="flex flex-col items-center text-center py-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-3 shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-base font-extrabold text-[#1a1c1c]">
              {lang === 'en' ? 'Could not save information' : 'No se pudo registrar la información'}
            </h3>
            <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">
              {lang === 'en'
                ? 'We could not record your information remotely or locally. We preserved everything you typed so you can retry.'
                : 'No pudimos registrar tus datos ni conservarlos en el navegador. Conservamos lo que escribiste para que puedas reintentar.'}
            </p>

            <div className="w-full mt-6 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSubmissionResult(null);
                  setActiveAttempt(null);
                }}
                className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>{lang === 'en' ? 'Review form & retry' : 'Revisar datos y reintentar'}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Cerrar'}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FORMULARIO ACTIVO (inicial o al corregir fallos) */}
        {/* ------------------------------------------------------------- */}
        {!submissionResult && (
          <div className="flex flex-col items-center text-center overflow-y-auto pr-0.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center mb-2.5 shadow-xs shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-[#1a1c1c]">
              {lang === 'en' ? `Connect with ${profile.shortName}` : `Conectar con ${profile.shortName}`}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 max-w-xs leading-relaxed">
              {t.leadSubtitle}
            </p>

            {/* Contexto seleccionado explícito (UX 03) */}
            {context?.solutionTitle && (
              <div className="w-full mt-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-teal-50/90 border border-teal-200 text-[11.5px] text-[#00685f] font-semibold text-left">
                <span className="truncate">Interés: {context.solutionTitle}</span>
                {onClearContext && (
                  <button
                    type="button"
                    onClick={onClearContext}
                    className="text-teal-700 hover:text-teal-950 ml-1.5 p-0.5 rounded cursor-pointer"
                    title={lang === 'en' ? 'Clear solution selection' : 'Quitar selección de solución'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Disclaimers contextuales por arquetipo (Salud e Institucional) */}
            {profile.professionalProfile === 'salud' && (
              <p className="w-full text-[10.5px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/80 mt-2 text-left leading-tight">
                {lang === 'en'
                  ? 'Notice: This channel is for administrative liaison and appointment coordination. Please do not submit confidential symptoms or medical records.'
                  : 'Aviso: Este canal es para enlace administrativo y coordinación de citas. No comparta síntomas, diagnósticos ni historial clínico sensible.'}
              </p>
            )}
            {profile.professionalProfile === 'institucional_publico' && (
              <p className="w-full text-[10.5px] text-slate-800 bg-slate-100 p-2 rounded-xl border border-slate-200 mt-2 text-left leading-tight">
                {lang === 'en'
                  ? 'Notice: This channel is for professional liaison and public relations. It does not constitute an official administrative procedure reception.'
                  : 'Aviso: Este canal es para vinculación y enlace profesional. No constituye una recepción oficial de trámites ante dependencias públicas.'}
              </p>
            )}

            <form onSubmit={handleSubmit} className="w-full mt-3 space-y-2 text-left">
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  {t.leadNameLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={t.leadNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] focus:ring-1 focus:ring-teal-100 placeholder:text-stone-400"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  {t.leadPhoneLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder={t.leadPhonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] focus:ring-1 focus:ring-teal-100 placeholder:text-stone-400"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  {lang === 'en' ? 'Email (Optional)' : 'Correo Electrónico (Opcional)'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] focus:ring-1 focus:ring-teal-100 placeholder:text-stone-400"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  {t.leadCompanyLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t.leadCompanyPlaceholder}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] focus:ring-1 focus:ring-teal-100 placeholder:text-stone-400"
                  />
                  <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  {profileCfg.labels.leadCaptureMessageLabel || t.leadMsgLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={profileCfg.labels.leadCaptureMessagePlaceholder || t.leadMsgPlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] focus:ring-1 focus:ring-teal-100 placeholder:text-stone-400 resize-none"
                />
              </div>

              {/* LFPDPPP Consent Checkbox & Simplified Privacy Notice */}
              <div className="pt-1 space-y-1">
                <label className="flex items-start gap-2 text-[10.5px] text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-stone-300 text-[#00685f] focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="leading-tight">
                    He leído y acepto el{' '}
                    <button
                      type="button"
                      onClick={() => setShowLegalModal(true)}
                      className="text-[#00685f] font-bold underline hover:text-[#008378] cursor-pointer"
                    >
                      Aviso de Privacidad (LFPDPPP)
                    </button>
                    . Mis datos serán tratados exclusivamente para fines de vinculación profesional.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name || !phone || !privacyAccepted}
                className="w-full mt-2 py-3 bg-[#00685f] hover:bg-[#008378] disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00685f]"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'en' ? 'Registering...' : 'Registrando datos...'}</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Share my details' : 'Compartir mis datos'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Embedded Legal Notice Modal */}
      <LegalNoticeModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab="privacy"
        profileName={profile.shortName}
        onShowToast={onShowToast}
      />
    </div>
  );
};
