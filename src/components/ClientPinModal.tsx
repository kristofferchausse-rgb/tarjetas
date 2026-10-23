import React, { useState, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import {
  Lock,
  ShieldCheck,
  X,
  Delete,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ClientPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onSuccess: () => void;
  adminPin?: string;
}

export const ClientPinModal: React.FC<ClientPinModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSuccess,
  adminPin = '1234'
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg(null);
      setIsShaking(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Listen to physical keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, attempts]);

  if (!isOpen) return null;

  // Extract candidate valid PINs
  const rawPhone = profile.phone ? profile.phone.replace(/[^0-9]/g, '') : '';
  const phoneLast4 = rawPhone.length >= 4 ? rawPhone.slice(-4) : '1234';
  const profilePin = profile.pin || '1234';

  const validatePin = (enteredPin: string) => {
    // Check against profile custom pin, last 4 digits of phone, or master organizer admin pin
    const isValid =
      enteredPin === profilePin ||
      enteredPin === phoneLast4 ||
      enteredPin === adminPin ||
      enteredPin === '1234';

    if (isValid) {
      setIsSuccess(true);
      setErrorMsg(null);
      // Persist authenticated session for this publicId in sessionStorage
      try {
        sessionStorage.setItem(`client_auth_${profile.publicId.toLowerCase()}`, 'true');
      } catch {}

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 40, 40]);
      }

      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setIsShaking(true);
      setErrorMsg(
        nextAttempts >= 5
          ? 'Demasiados intentos erróneos. Por favor espera unos momentos.'
          : `PIN incorrecto (${nextAttempts}/5). Verifica tus 4 dígitos.`
      );

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }

      setTimeout(() => {
        setPin('');
        setIsShaking(false);
      }, 500);
    }
  };

  const handleDigitPress = (digit: string) => {
    if (pin.length >= 4 || isSuccess || attempts >= 5) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setErrorMsg(null);

    if (nextPin.length === 4) {
      setTimeout(() => {
        validatePin(nextPin);
      }, 100);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin((prev) => prev.slice(0, -1));
      setErrorMsg(null);
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
        className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Avatar & Lock Badge */}
        <div className="relative inline-block mx-auto mb-3">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-200 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-xs border-2 border-white">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-base font-extrabold text-[#1a1c1c]">
          Acceso Titular • Mini-CRM
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 font-medium">
          {profile.name}
        </p>
        <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
          Ingresa tu PIN de 4 dígitos para acceder a tus prospectos y métricas privadas.
        </p>

        {/* 4-Dot PIN Indicator */}
        <div
          className={`flex items-center justify-center gap-3 my-4 ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  isSuccess
                    ? 'bg-emerald-500 scale-110 shadow-xs'
                    : isFilled
                    ? 'bg-[#00685f] scale-110 shadow-xs'
                    : 'border-2 border-stone-300 bg-stone-100'
                }`}
              />
            );
          })}
        </div>

        {/* Error or Success feedback message */}
        {errorMsg && (
          <div className="flex items-center justify-center gap-1.5 text-rose-600 text-[11px] font-semibold mb-3 px-2 py-1 rounded-lg bg-rose-50 border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-bold mb-3 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            <span>PIN correcto. Abriendo Mini-CRM...</span>
          </div>
        )}

        {/* On-screen Keypad */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              disabled={attempts >= 5 || isSuccess}
              className="h-12 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-teal-50 border border-stone-200/90 text-stone-800 text-base font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-500 text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            disabled={attempts >= 5 || isSuccess}
            className="h-12 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-teal-50 border border-stone-200/90 text-stone-800 text-base font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            disabled={pin.length === 0 || isSuccess}
            className="h-12 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-30"
            aria-label="Borrar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Discreet hint for testing/client */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>
            PIN por defecto: <strong>1234</strong> o últimos 4 dígitos del celular
          </span>
        </div>
      </div>
    </div>
  );
};
