import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ParticipantProfile } from '../types/card';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profile: ParticipantProfile | null;
  canDelete: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  profile,
  canDelete
}) => {
  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with red accent */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Eliminar Tarjeta Digital
              </h3>
              <p className="text-xs text-rose-700 font-medium">
                Acción permanente del directorio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Card preview thumbnail info */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-white shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-stone-900 text-sm truncate">{profile.name}</p>
              <p className="text-xs text-stone-600 truncate">{profile.company} • {profile.city}</p>
              <p className="font-mono text-[11px] text-teal-800 font-semibold mt-0.5">
                /c/{profile.publicId}
              </p>
            </div>
          </div>

          {!canDelete ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">No se puede eliminar esta tarjeta</p>
                <p className="mt-0.5 text-amber-700">
                  El directorio debe tener al menos una tarjeta activa. Crea o importa otra tarjeta antes de eliminar esta.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-stone-600">
              <p>
                ¿Estás seguro de que deseas eliminar permanentemente la tarjeta de <span className="font-bold text-stone-900">{profile.name}</span>?
              </p>
              <p className="text-stone-500">
                Esta acción borrará la tarjeta del simulador, del panel de control y desactivará su enlace público. Los códigos QR previamente impresos o compartidos mostrarán un mensaje de tarjeta no encontrada.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sí, Eliminar Tarjeta</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
