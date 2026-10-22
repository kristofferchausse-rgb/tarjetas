import React, { useEffect, useState } from 'react';
import { ParticipantProfile } from '../types/card';
import {
  generateQRCodeAssets,
  downloadQRCodeSvg,
  downloadQRCodePng,
  getStablePublicUrl,
  SHARED_APP_BASE_URL
} from '../utils/qr';
import { generateVCardString, downloadVCardFile } from '../utils/vcard';
import { downloadStandaloneCard } from '../utils/exportHtml';
import { AGENCY_NAME, AGENCY_URL } from '../utils/seo';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  FileCode,
  QrCode,
  Sparkles,
  ExternalLink,
  Globe,
  Contact,
  Link as LinkIcon,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Info,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast
}) => {
  const [qrType, setQrType] = useState<'url' | 'vcard'>('url');
  const [svgContent, setSvgContent] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Always use the official stable Public Cloud URL
  const activeUrl = getStablePublicUrl(profile.publicId, false, false);
  const vcardText = generateVCardString(profile, activeUrl);
  const targetPayload = qrType === 'url' ? activeUrl : vcardText;

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    generateQRCodeAssets(targetPayload).then((result) => {
      if (isMounted) {
        setSvgContent(result.svgString);
        setPngDataUrl(result.pngDataUrl);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetPayload]);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopied(true);
      onShowToast('¡Enlace público copiado al portapapeles!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Enlace seleccionado. Presiona Ctrl+C para copiar.');
    }
  };

  const handleWhatsAppShare = () => {
    const summary = profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}`;
    const shareText = `📇 *${profile.name}* — ${profile.role} en ${profile.company}\n\n"${summary}"\n\n🔗 Conoce mi tarjeta digital y guarda mi contacto directo en tu agenda:\n${activeUrl}\n\n✨ _Diseñada por ${AGENCY_NAME}_ (${AGENCY_URL})`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNativeShare = async () => {
    const summary = profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}`;
    const shareData = {
      title: `${profile.name} • ${profile.role}`,
      text: `${summary} — Tarjeta Digital de ${profile.shortName} creada con ${AGENCY_NAME}:`,
      url: activeUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast('Enlace compartido exitosamente.');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyUrl();
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleDownloadSvg = () => {
    if (svgContent) {
      downloadQRCodeSvg(svgContent, `qr-${profile.publicId}.svg`);
      onShowToast('Vector SVG descargado con resolución infinita para imprenta.');
    }
  };

  const handleDownloadPng = () => {
    if (pngDataUrl) {
      downloadQRCodePng(pngDataUrl, `qr-${profile.publicId}.png`);
      onShowToast('Imagen PNG de alta resolución (640x640 px) descargada.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl relative border border-stone-200 overflow-y-auto max-h-[92vh] custom-scroll"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pr-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00685f]/10 text-[#00685f] mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Compartir Tarjeta Digital</span>
          </span>
          <h3 className="text-lg font-bold text-[#1a1c1c] leading-tight">
            {profile.name}
          </h3>
          <p className="text-xs text-[#6d7a77]">
            {profile.company} • <span className="font-mono text-teal-800">/c/{profile.publicId}</span>
          </p>
        </div>

        {/* Format Selector: Enlace Web vs vCard Directa */}
        <div className="mt-3.5 grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setQrType('url')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              qrType === 'url'
                ? 'bg-white text-[#00685f] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Abre el micrositio interactivo completo en el navegador móvil"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Enlace Web</span>
          </button>
          <button
            type="button"
            onClick={() => setQrType('vcard')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              qrType === 'vcard'
                ? 'bg-white text-[#ac3400] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Abre directamente el menú de Añadir a Contactos en iOS/Android sin internet"
          >
            <Contact className="w-3.5 h-3.5" />
            <span>vCard Directa</span>
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="mt-3 p-4 bg-white rounded-2xl border-2 border-stone-100 shadow-inner flex flex-col items-center justify-center relative">
          {svgContent ? (
            <div
              className="w-44 h-44 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center text-stone-400">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {qrType === 'url'
                ? 'Apunta tu cámara: abre la tarjeta en tu celular'
                : 'Apunta tu cámara: guarda en Contactos sin internet'}
            </span>
          </div>
        </div>

        {/* Destino del Enlace: Solo Público (Cloud) */}
        {qrType === 'url' && (
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-bold uppercase tracking-wider">
              <span>Destino del Enlace:</span>
            </div>

            <div className="p-1 bg-stone-100 rounded-xl">
              <div
                className="py-1 px-3 bg-white text-teal-800 rounded-lg text-center text-[11px] font-extrabold shadow-2xs flex items-center justify-center gap-1.5"
                title="Enlace público en la nube (Cloud) para tus clientes"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Público (Cloud)</span>
              </div>
            </div>
          </div>
        )}

        {/* Public Stable URL Box */}
        <div className="mt-3">
          <label className="block text-[10px] text-[#6d7a77] uppercase tracking-wider font-bold mb-1">
            Enlace para enviar a tus contactos
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
              className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] text-[#00685f] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-stone-500 hover:text-stone-900 rounded"
              title="Abrir tarjeta en nueva pestaña"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Public Link Verification Badge */}
          <div className="mt-2 px-2.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200/90 flex items-start gap-2 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-tight">
              <strong>100% Público y Sin Bloqueos:</strong> Este enlace abre sin pedir login de Google ni cookies de desarrollador.
            </span>
          </div>
        </div>

        {/* WhatsApp Quick Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="mt-3 w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Enviar por WhatsApp</span>
        </button>

        {/* Download QR buttons */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadSvg}
            className="py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-[11px] font-semibold text-[#1a1c1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-stone-600" />
            <span>Descargar SVG</span>
          </button>
          <button
            onClick={handleDownloadPng}
            className="py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-[11px] font-semibold text-[#1a1c1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Descargar PNG</span>
          </button>
        </div>

        {/* Native Mobile Share */}
        <button
          onClick={handleNativeShare}
          className="mt-2 w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Más Opciones de Compartir</span>
        </button>
      </div>
    </div>
  );
};
