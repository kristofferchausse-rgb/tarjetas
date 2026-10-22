import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  storedPin: string;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  storedPin
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.trim() === storedPin.trim()) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setPin('');
        setIsSuccess(false);
      }, 400);
    } else {
      setError('PIN incorrecto. Acceso restringido exclusivamente a administradores.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200"
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
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-[#1a1c1c]">Panel de Administración</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
            Acceso restringido exclusivamente al equipo de <strong>Tribu Creativa QRO</strong>. Ingresa tu PIN de seguridad para administrar las tarjetas de clientes.
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-5 space-y-3">
            <div>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  autoFocus
                  placeholder="PIN de seguridad"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(null);
                  }}
                  className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-teal-100 text-stone-900 transition-all placeholder:text-stone-400 placeholder:text-sm placeholder:tracking-normal"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-rose-600 text-[11px] mt-2 justify-center font-medium animate-in fade-in">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}

              {isSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] mt-2 justify-center font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acceso verificado. Abriendo panel...</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSuccess || !pin}
              className="w-full py-2.5 px-4 bg-[#00685f] hover:bg-[#008378] disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Acceder al Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
