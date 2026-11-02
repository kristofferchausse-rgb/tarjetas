import React, { useEffect, useState } from 'react';
import { ParticipantProfile } from '../types/card';
import {
  generateQRCodeAssets,
  downloadQRCodeSvg,
  downloadQRCodePng,
  getStablePublicUrl
} from '../utils/qr';
import { CardLanguage } from '../utils/i18n';
import {
  X,
  QrCode,
  Download,
  FileCode,
  CheckCircle2
} from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
  lang?: CardLanguage;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast,
  lang = 'es'
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');

  // Always use the official stable Public Cloud URL
  const activeUrl = getStablePublicUrl(profile.publicId, false, false);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    generateQRCodeAssets(activeUrl).then((result) => {
      if (isMounted) {
        setSvgContent(result.svgString);
        setPngDataUrl(result.pngDataUrl);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleDownloadSvg = () => {
    if (svgContent) {
      downloadQRCodeSvg(svgContent, `qr-${profile.publicId}.svg`);
      onShowToast(
        lang === 'en'
          ? 'Vector SVG downloaded for professional printing.'
          : 'Vector SVG descargado con resolución infinita para imprenta.'
      );
    }
  };

  const handleDownloadPng = () => {
    if (pngDataUrl) {
      downloadQRCodePng(pngDataUrl, `qr-${profile.publicId}.png`);
      onShowToast(
        lang === 'en'
          ? 'High-resolution PNG image (640x640 px) downloaded.'
          : 'Imagen PNG de alta resolución (640x640 px) descargada.'
      );
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
            <QrCode className="w-3.5 h-3.5 text-[#00685f]" />
            <span>{lang === 'en' ? 'QR Code' : 'Código QR'}</span>
          </span>
          <h3 className="text-lg font-bold text-[#1a1c1c] leading-tight">
            {profile.name}
          </h3>
          <p className="text-xs text-[#6d7a77] mt-0.5">
            {profile.company} • <span className="font-mono text-teal-800">/c/{profile.publicId}</span>
          </p>
        </div>

        {/* QR Code Canvas */}
        <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-stone-100 shadow-inner flex flex-col items-center justify-center relative">
          {svgContent ? (
            <div
              className="w-48 h-48 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-stone-400">
              <QrCode className="w-14 h-14 animate-pulse" />
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/90">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {lang === 'en'
                ? 'Point your camera: opens card instantly'
                : 'Apunta tu cámara: abre la tarjeta en tu celular'}
            </span>
          </div>
        </div>

        {/* Download QR buttons at the bottom ("solo dejar las de abajo") */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadSvg}
            className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-[11px] font-bold text-[#1a1c1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <FileCode className="w-3.5 h-3.5 text-stone-600" />
            <span>{lang === 'en' ? 'Download SVG' : 'Descargar SVG'}</span>
          </button>
          <button
            onClick={handleDownloadPng}
            className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-[11px] font-bold text-[#1a1c1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>{lang === 'en' ? 'Download PNG' : 'Descargar PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
