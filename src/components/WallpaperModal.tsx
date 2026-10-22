import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import { generateLockscreenWallpaper, downloadWallpaperFile } from '../utils/wallpaper';
import { recordActivity } from '../utils/analytics';
import {
  X,
  Smartphone,
  Download,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast
}) => {
  const [wallpaperDataUrl, setWallpaperDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsGenerating(true);

    generateLockscreenWallpaper(profile, {
      themeColor: profile.customPrimaryColor || '#00685f',
      includeAvatar: true
    }).then((dataUrl) => {
      if (isMounted) {
        setWallpaperDataUrl(dataUrl);
        setIsGenerating(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!wallpaperDataUrl) return;
    const filename = `fondo-pantalla-qr-${profile.publicId}.png`;
    downloadWallpaperFile(wallpaperDataUrl, filename);
    recordActivity(
      profile.publicId,
      profile.shortName,
      'wallpaper_download',
      'Descarga de fondo de pantalla con QR'
    );
    onShowToast('¡Fondo de pantalla descargado con éxito!');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] overflow-y-auto custom-scroll"
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
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 leading-tight">
              Fondo de Bloqueo con QR
            </h3>
            <p className="text-xs text-stone-500">
              Comparte tu tarjeta en segundos en cualquier café o evento presencial
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 mb-4 text-xs text-stone-700 space-y-1.5">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Cero fricción:</strong> No necesitas abrir tu navegador ni buscar links mientras hablas con un prospecto.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Sin desbloquear:</strong> Solo enciende la pantalla de tu celular y el cliente escanea el QR al instante.</span>
          </div>
        </div>

        {/* Phone Mockup Preview */}
        <div className="relative mx-auto my-2 flex items-center justify-center">
          <div className="w-48 sm:w-56 h-[380px] sm:h-[440px] rounded-[36px] bg-slate-900 border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-3">
            {/* Phone notch */}
            <div className="w-20 h-4 bg-slate-950 rounded-full mb-1 z-20" />

            {/* Background image preview */}
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-2 text-xs">
                <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                <span>Generando fondo HD...</span>
              </div>
            ) : (
              <img
                src={wallpaperDataUrl}
                alt="Vista previa de fondo de pantalla"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Mock iPhone lockscreen elements overlay */}
            <div className="relative z-10 text-center text-white/90 drop-shadow-md mt-2">
              <div className="text-[10px] font-medium tracking-wide">MIÉRCOLES, 22 DE OCTUBRE</div>
              <div className="text-4xl font-extralight tracking-tighter">09:41</div>
            </div>

            <div className="relative z-10 w-full text-center pb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-semibold border border-white/20">
                <Lock className="w-2.5 h-2.5 text-teal-300" />
                <span>Desliza para desbloquear</span>
              </span>
            </div>
          </div>
        </div>

        {/* Download Action Button */}
        <button
          onClick={handleDownload}
          disabled={isGenerating || !wallpaperDataUrl}
          className="mt-4 w-full py-3 px-4 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Fondo HD para Celular</span>
        </button>

        {/* Simple instructions */}
        <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
          <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Cómo instalarlo en 1 minuto:</p>
          <p>1. Descarga la imagen y ábrela en la galería de tu celular.</p>
          <p>2. Toca en Compartir o Ajustes ➔ <strong>"Usar como fondo de pantalla"</strong>.</p>
          <p>3. Asígnalo a tu <strong>Pantalla de Bloqueo</strong>.</p>
        </div>
      </div>
    </div>
  );
};
