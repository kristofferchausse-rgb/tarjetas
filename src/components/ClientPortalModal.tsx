import React, { useState } from 'react';
import { ParticipantProfile } from '../types/card';
import {
  TrendingUp,
  X,
  Search,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: ParticipantProfile[];
  onSelectClientStats: (publicId: string) => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSelectClientStats
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter profiles based on search
  const filteredProfiles = profiles.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.publicId.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!query.trim()) {
      setError('Por favor escribe el identificador de tu tarjeta o selecciona una de la lista.');
      return;
    }

    // Try to extract ID from URL or slug
    let cleanId = query.trim().toLowerCase();
    const urlMatch = cleanId.match(/\/c\/([a-zA-Z0-9_-]+)/);
    if (urlMatch && urlMatch[1]) {
      cleanId = urlMatch[1];
    } else {
      cleanId = cleanId.replace(/^https?:\/\/[^/]+\/?/, '').replace(/^c\//, '').replace(/\/stats$/, '');
    }

    const matched = profiles.find(
      (p) => p.publicId.toLowerCase() === cleanId || p.shortName.toLowerCase() === cleanId
    );

    if (matched) {
      onSelectClientStats(matched.publicId);
      onClose();
    } else {
      setError(`No encontramos ninguna tarjeta con el identificador "${cleanId}". Si tienes dudas, consulta con Tribu Creativa QRO.`);
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
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center font-bold shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-extrabold text-[#1a1c1c]">Portal de Clientes</h3>
              <span className="px-2 py-0.2 bg-teal-100 text-[#00685f] text-[10px] font-bold rounded-full">
                Métricas Privadas
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Consulta las estadísticas en tiempo real de tu tarjeta
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Identificador o Enlace de tu Tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="ej: laura-gomez o pega tu enlace"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-teal-100 text-stone-900 text-xs font-medium transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>

            {error && (
              <div className="flex items-start gap-1.5 text-rose-600 text-[11px] mt-2 font-medium animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <span>Ver mis Analíticas en Vivo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick select directory list */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            O selecciona tu tarjeta directamente:
          </p>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scroll pr-1">
            {filteredProfiles.map((p) => (
              <button
                key={p.publicId}
                onClick={() => {
                  onSelectClientStats(p.publicId);
                  onClose();
                }}
                className="w-full p-2 rounded-xl border border-stone-100 hover:border-teal-200 hover:bg-teal-50/50 flex items-center gap-2.5 text-left transition-all cursor-pointer group"
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-stone-900 truncate group-hover:text-[#00685f]">
                      {p.shortName}
                    </p>
                    {p.verified && <UserCheck className="w-3 h-3 text-[#00685f] shrink-0" />}
                  </div>
                  <p className="text-[10px] text-stone-500 truncate">{p.company}</p>
                </div>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full shrink-0">
                  Ver Métricas →
                </span>
              </button>
            ))}

            {filteredProfiles.length === 0 && (
              <p className="text-xs text-stone-400 text-center py-4">
                No se encontraron tarjetas que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Métricas seguras y en tiempo real</span>
          </span>
          <span className="text-stone-400 font-mono text-[10px]">Tribu Creativa QRO</span>
        </div>
      </div>
    </div>
  );
};
