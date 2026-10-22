import React, { useState } from 'react';
import { ParticipantProfile } from '../types/card';
import { recordActivity } from '../utils/analytics';
import { CardLanguage, CARD_TRANSLATIONS } from '../utils/i18n';
import { saveLead } from '../services/leadService';
import {
  X,
  UserCheck,
  Send,
  MessageCircle,
  Building2,
  Phone,
  Mail,
  User,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
  lang?: CardLanguage;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast,
  lang = 'es'
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const t = CARD_TRANSLATIONS[lang] || CARD_TRANSLATIONS.es;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      onShowToast(lang === 'en' ? 'Please enter at least your name and phone number.' : 'Por favor escribe al menos tu nombre y teléfono.');
      return;
    }

    // Persist lead to mini-CRM (Firestore + LocalStorage)
    await saveLead({
      publicId: profile.publicId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      company: company.trim() || undefined,
      message: message.trim() || undefined
    });

    // Record analytics event
    recordActivity(
      profile.publicId,
      profile.shortName,
      'lead_capture',
      `Contacto recibido de ${name.trim()} (${phone.trim()})`
    );

    const waText = lang === 'en'
      ? `Hello ${profile.name}! 👋\n\nI was viewing your Executive Digital Card and would like to connect with you:\n\n• Name: ${name.trim()}\n• Phone: ${phone.trim()}${email.trim() ? `\n• Email: ${email.trim()}` : ''}${company.trim() ? `\n• Company / Role: ${company.trim()}` : ''}${message.trim() ? `\n• Message: ${message.trim()}` : ''}\n\nLooking forward to speaking with you.`
      : `¡Hola ${profile.name}! 👋\n\nEstuve revisando tu Tarjeta Digital Ejecutiva y me gustaría conectar contigo:\n\n• Nombre: ${name.trim()}\n• Teléfono: ${phone.trim()}${email.trim() ? `\n• Email: ${email.trim()}` : ''}${company.trim() ? `\n• Empresa / Cargo: ${company.trim()}` : ''}${message.trim() ? `\n• Mensaje: ${message.trim()}` : ''}\n\nQuedo a tu disposición para conversar.`;

    const cleanRecipientPhone = profile.phone.replace(/[^0-9]/g, '');
    const waUrl = cleanRecipientPhone
      ? `https://api.whatsapp.com/send?phone=${cleanRecipientPhone}&text=${encodeURIComponent(waText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;

    setIsSuccess(true);
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      onShowToast('¡Datos guardados! Abriendo WhatsApp para conectar...');
      onClose();
      setIsSuccess(false);
      setName('');
      setPhone('');
      setEmail('');
      setCompany('');
      setMessage('');
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center mb-3 shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>

          <h3 className="text-base font-extrabold text-[#1a1c1c]">
            {lang === 'en' ? `Connect with ${profile.shortName}` : `Conectar con ${profile.shortName}`}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
            {t.leadSubtitle}
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-4 space-y-2.5 text-left">
            <div>
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                {t.leadNameLabel}
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
                {t.leadPhoneLabel}
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
                Correo Electrónico (Opcional)
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
                {t.leadMsgLabel}
              </label>
              <textarea
                rows={2}
                placeholder={t.leadMsgPlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] focus:ring-1 focus:ring-teal-100 placeholder:text-stone-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSuccess || !name || !phone}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Opening WhatsApp...' : 'Enviando a WhatsApp...'}</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.leadSubmitBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
