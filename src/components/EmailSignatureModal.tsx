import React, { useState } from 'react';
import { ParticipantProfile } from '../types/card';
import { generateHtmlSignature, copySignatureToClipboard } from '../utils/signature';
import { recordActivity } from '../utils/analytics';
import {
  X,
  Mail,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileCode,
  Layout
} from 'lucide-react';

interface EmailSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
}

export const EmailSignatureModal: React.FC<EmailSignatureModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast
}) => {
  const [layout, setLayout] = useState<'modern' | 'compact'>('modern');
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!isOpen) return null;

  const htmlSignature = generateHtmlSignature(profile, { layout });
  const plainTextSignature = `${profile.name}\n${profile.role} • ${profile.company}\nTel: ${profile.phone}\nEmail: ${profile.email}\nTarjeta Digital: https://tribucreativaqro.web.app/c/${profile.publicId}`;

  const handleCopy = async () => {
    const success = await copySignatureToClipboard(htmlSignature, plainTextSignature);
    if (success) {
      setCopied(true);
      recordActivity(
        profile.publicId,
        profile.shortName,
        'signature_copy',
        'Copia de firma de correo para Gmail/Outlook'
      );
      onShowToast('¡Firma copiada! Ahora pégala (Ctrl+V) en tu Gmail o Outlook.');
      setTimeout(() => setCopied(false), 2500);
    } else {
      onShowToast('Copia manual: selecciona el contenido y presiona Ctrl+C.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] overflow-y-auto custom-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center shadow-2xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 leading-tight">
              Firma de Correo Electrónico
            </h3>
            <p className="text-xs text-stone-500">
              Convierte cada correo que envíes en un canal de tráfico hacia tu tarjeta digital
            </p>
          </div>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-stone-700">Diseño de Firma:</span>
          <div className="flex p-0.5 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setLayout('modern')}
              className={`py-1 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                layout === 'modern'
                  ? 'bg-white text-[#00685f] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ejecutivo Moderno
            </button>
            <button
              type="button"
              onClick={() => setLayout('compact')}
              className={`py-1 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                layout === 'compact'
                  ? 'bg-white text-[#00685f] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Minimalista Compacto
            </button>
          </div>
        </div>

        {/* Live Visual Preview Container */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 mb-4 overflow-x-auto">
          <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2 flex items-center justify-between">
            <span>Vista Previa en Bandeja de Entrada</span>
            <span className="text-emerald-700 font-semibold lowercase">formato html estándar</span>
          </div>

          <div
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs select-all"
            dangerouslySetInnerHTML={{ __html: htmlSignature }}
          />
        </div>

        {/* Action Button: Copy */}
        <button
          onClick={handleCopy}
          className="w-full py-3 px-4 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '¡Copiado con Éxito!' : 'Copiar Firma para Gmail / Outlook'}</span>
        </button>

        {/* HTML Code Toggle */}
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer inline-flex items-center gap-1"
          >
            <FileCode className="w-3 h-3" />
            <span>{showCode ? 'Ocultar código HTML' : 'Ver código HTML directo'}</span>
          </button>
        </div>

        {showCode && (
          <div className="mt-2 p-3 bg-stone-900 rounded-xl text-stone-200 font-mono text-[10px] overflow-x-auto max-h-36">
            <pre className="whitespace-pre-wrap">{htmlSignature}</pre>
          </div>
        )}

        {/* Quick Setup Instructions */}
        <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] text-stone-600 space-y-1.5">
          <p className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">Cómo instalar en Gmail / Outlook:</p>
          <div className="space-y-1">
            <p>1. Haz clic en el botón superior <strong>"Copiar Firma"</strong>.</p>
            <p>2. En tu correo (Gmail o Outlook), ve a <strong>Configuración ➔ Firmas</strong>.</p>
            <p>3. Pega con <strong>Ctrl + V</strong> (o Cmd + V en Mac) y guarda cambios.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
