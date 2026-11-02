import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import { getStablePublicUrl } from '../utils/qr';
import { AGENCY_NAME, AGENCY_URL } from '../utils/seo';
import { CardLanguage } from '../utils/i18n';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  Share2
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
  lang?: CardLanguage;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast,
  lang = 'es'
}) => {
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeUrl = getStablePublicUrl(profile.publicId, false, false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopied(true);
      onShowToast(
        lang === 'en'
          ? 'Public card link copied to clipboard!'
          : '¡Enlace público copiado al portapapeles!'
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast(
        lang === 'en'
          ? 'Link selected. Press Ctrl+C to copy.'
          : 'Enlace seleccionado. Presiona Ctrl+C para copiar.'
      );
    }
  };

  const handleWhatsAppShare = () => {
    const summary =
      profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}`;
    const shareText =
      lang === 'en'
        ? `📇 *${profile.name}* — ${profile.role} at ${profile.company}\n\n"${summary}"\n\n🔗 View my executive digital card and save my direct contact:\n${activeUrl}\n\n✨ _Designed by ${AGENCY_NAME}_ (${AGENCY_URL})`
        : `📇 *${profile.name}* — ${profile.role} en ${profile.company}\n\n"${summary}"\n\n🔗 Conoce mi tarjeta digital y guarda mi contacto directo en tu agenda:\n${activeUrl}\n\n✨ _Diseñada por ${AGENCY_NAME}_ (${AGENCY_URL})`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNativeShare = async () => {
    const summary =
      profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}`;
    const shareData = {
      title: `${profile.name} • ${profile.role}`,
      text:
        lang === 'en'
          ? `${summary} — Digital Card of ${profile.shortName}:`
          : `${summary} — Tarjeta Digital de ${profile.shortName} creada con ${AGENCY_NAME}:`,
      url: activeUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast(
          lang === 'en' ? 'Card shared successfully!' : 'Enlace compartido exitosamente.'
        );
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyUrl();
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl relative border border-stone-200 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          aria-label={lang === 'en' ? 'Close modal' : 'Cerrar modal'}
          title={lang === 'en' ? 'Close' : 'Cerrar'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pr-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00685f]/10 text-[#00685f] mb-1.5">
            <Sparkles className="w-3 h-3 text-[#00685f]" />
            <span>{lang === 'en' ? 'Share Digital Card' : 'Compartir Tarjeta Digital'}</span>
          </span>
          <h3 className="text-lg font-bold text-[#1a1c1c] leading-tight">
            {profile.name}
          </h3>
          <p className="text-xs text-[#6d7a77] mt-0.5">
            {profile.company} • <span className="font-mono text-teal-800">/c/{profile.publicId}</span>
          </p>
        </div>

        {/* Public Stable URL Box */}
        <div className="mt-4">
          <label className="block text-[10px] text-[#6d7a77] uppercase tracking-wider font-bold mb-1">
            {lang === 'en' ? 'Link to share with contacts' : 'Enlace para enviar a tus contactos'}
          </label>
          <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="text"
              readOnly
              value={activeUrl}
              className="bg-transparent text-[11px] text-[#1a1c1c] font-mono flex-1 border-none focus:outline-none p-0 select-all truncate"
            />
            <button
              onClick={handleCopyUrl}
              className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] text-[#00685f] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'en' ? 'Copied' : 'Copiado') : (lang === 'en' ? 'Copy' : 'Copiar')}</span>
            </button>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
              title={lang === 'en' ? 'Open card in new tab' : 'Abrir tarjeta en nueva pestaña'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Public Link Verification Badge */}
          <div className="mt-2.5 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200/90 flex items-start gap-2 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-tight">
              <strong>{lang === 'en' ? '100% Public & Direct:' : '100% Público y Sin Bloqueos:'}</strong>{' '}
              {lang === 'en'
                ? 'This link opens directly without requiring Google login or developer cookies.'
                : 'Este enlace abre sin pedir login de Google ni cookies de desarrollador.'}
            </span>
          </div>
        </div>

        {/* WhatsApp Quick Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="mt-3.5 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>{lang === 'en' ? 'Send via WhatsApp' : 'Enviar por WhatsApp'}</span>
        </button>

        {/* Native Mobile Share (AirDrop, iOS/Android share sheet) */}
        <button
          onClick={handleNativeShare}
          className="mt-2 w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 text-stone-600" />
          <span>{lang === 'en' ? 'More Share Options' : 'Más Opciones de Compartir'}</span>
        </button>
      </div>
    </div>
  );
};
