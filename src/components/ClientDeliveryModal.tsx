import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import { generateQRCodeAssets } from '../utils/qr';
import {
  X,
  Send,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Sparkles
} from 'lucide-react';

interface ClientDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
}

export const ClientDeliveryModal: React.FC<ClientDeliveryModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const cardUrl = `${window.location.origin}/c/${profile.publicId}`;

  const deliveryMessage = `¡Hola ${profile.name}! 🚀\n\nTe compartimos el enlace oficial de tu nueva Tarjeta Digital Ejecutiva diseñada por Tribu Creativa QRO:\n👉 ${cardUrl}\n\nIncluye tu kit ejecutivo completo:\n• Tarjeta digital interactiva y guardado de vCard directo en agenda\n• Intercambio de contactos (Mini-CRM privado con tus prospectos)\n• Generador de fondo de pantalla para celular con tu código QR\n• Firma de correo electrónico HTML con tu foto y enlace\n• Panel de estadísticas privadas (/c/${profile.publicId}?stats=true)\n\n¡Mucho éxito en tus conexiones empresariales! ✨\n— Tribu Creativa QRO`;

  useEffect(() => {
    if (isOpen) {
      generateQRCodeAssets(cardUrl).then((res) => {
        setQrDataUrl(res.pngDataUrl);
      });
    }
  }, [isOpen, cardUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopiedLink(true);
      onShowToast('Enlace de la tarjeta copiado al portapapeles.');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      onShowToast('No se pudo copiar el enlace.');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(deliveryMessage);
      setCopiedMessage(true);
      onShowToast('Mensaje de entrega copiado con éxito.');
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      onShowToast('No se pudo copiar el mensaje.');
    }
  };

  const handleSendToClientWhatsApp = () => {
    const cleanPhone = profile.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(deliveryMessage);
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onShowToast(`Abriendo WhatsApp para enviar tarjeta a ${profile.shortName}...`);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-TribuCreativa-${profile.publicId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Código QR de ${profile.shortName} descargado en PNG.`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-[#00685f] to-emerald-600" />

        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-[#1a1c1c]">Entregar Tarjeta al Cliente</h3>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 text-[#00685f]">
                  Tribu Creativa
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Cliente: <strong>{profile.name}</strong> ({profile.company})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4">
          {/* Card Link Preview Bar */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-2">
            <div className="truncate text-xs font-mono text-stone-700">
              <span className="text-stone-400 select-none">URL: </span>
              <span className="font-semibold text-[#00685f]">{cardUrl}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
              </button>
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors"
                title="Abrir tarjeta en pestaña nueva"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* WhatsApp Rich Link Preview Simulation */}
          <div className="bg-[#f0fdf4] rounded-2xl p-3.5 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-950">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vista Previa en WhatsApp al Compartir</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Personalizado 100%
              </span>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-2xs flex">
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-stone-100 overflow-hidden relative border-r border-stone-100">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5 flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="text-xs font-bold text-stone-900 truncate">
                  {profile.name} • {profile.role}
                </h4>
                <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5 leading-snug">
                  {profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}.`}
                </p>
                <span className="text-[10px] font-mono text-stone-400 mt-1">
                  tribucreativaqro.web.app
                </span>
              </div>
            </div>
            <p className="text-[10px] text-emerald-800 mt-2 leading-relaxed">
              ✨ <strong>Confirmado:</strong> WhatsApp muestra directamente la foto personal de {profile.shortName || profile.name} y su propuesta de valor.
            </p>
          </div>

          {/* Quick QR & Info Row */}
          <div className="flex items-center gap-4 p-3 bg-teal-50/50 rounded-2xl border border-teal-100">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR ${profile.shortName}`}
                className="w-20 h-20 rounded-xl border border-teal-200 bg-white p-1 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white border border-teal-200 flex items-center justify-center shrink-0">
                <span className="text-[10px] text-stone-400">QR</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-stone-800">Código QR Oficial de Alta Resolución</h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                Listo para imprimir en papelería, folletos o para que el cliente lo guarde en la galería de su teléfono.
              </p>
              <button
                onClick={handleDownloadQR}
                className="mt-2 px-3 py-1 bg-white hover:bg-stone-50 text-[#00685f] border border-teal-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Descargar PNG</span>
              </button>
            </div>
          </div>

          {/* Pre-formatted WhatsApp Message Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Mensaje de Entrega para WhatsApp
              </label>
              <button
                onClick={handleCopyMessage}
                className="text-xs font-bold text-[#00685f] hover:text-[#008378] flex items-center gap-1 cursor-pointer"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? 'Copiado' : 'Copiar texto'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={deliveryMessage}
              className="w-full text-xs font-sans p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSendToClientWhatsApp}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar por WhatsApp al Cliente ({profile.shortName})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
