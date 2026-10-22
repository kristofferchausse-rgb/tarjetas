import React, { useState } from 'react';
import { ParticipantProfile, CardTheme } from '../types/card';
import {
  BadgeCheck,
  Download,
  QrCode,
  Code2,
  Cloud,
  ChevronRight,
  Plus,
  Edit3,
  UserCheck,
  Trash2,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  Send
} from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface SimulatorSidebarProps {
  profiles: ParticipantProfile[];
  currentIndex: number;
  onSelectProfile: (index: number) => void;
  activeTheme: CardTheme;
  onChangeTheme: (theme: CardTheme) => void;
  onDownloadVCard: () => void;
  onOpenQR: () => void;
  onOpenSpec: (tab?: 'json' | 'vcard' | 'gcp' | 'qa') => void;
  onOpenEditProfile: () => void;
  onOpenCreateProfile: () => void;
  onDeleteProfile: (publicId: string) => void;
  onOpenDashboard: () => void;
  onLogoutAdmin?: () => void;
  onOpenDelivery?: () => void;
}

export const SimulatorSidebar: React.FC<SimulatorSidebarProps> = ({
  profiles,
  currentIndex,
  onSelectProfile,
  activeTheme,
  onChangeTheme,
  onDownloadVCard,
  onOpenQR,
  onOpenSpec,
  onOpenEditProfile,
  onOpenCreateProfile,
  onDeleteProfile,
  onOpenDashboard,
  onLogoutAdmin,
  onOpenDelivery
}) => {
  const [profileToDelete, setProfileToDelete] = useState<ParticipantProfile | null>(null);

  return (
    <aside className="w-full lg:w-80 lg:shrink-0 bg-[#f3f4f3] border-r border-stone-200 p-4 md:p-5 flex flex-col justify-between overflow-y-auto custom-scroll">
      <div className="space-y-6">
        {/* Header Panel */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-[17px] font-bold text-[#1a1c1c]">Tribu Creativa QRO</h2>
            <p className="text-[12px] text-[#6d7a77]">Gestor de Tarjetas de Clientes</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-[#00685f] flex items-center justify-center">
            <BadgeCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Profiles Selector & Unlimited Creator Button */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77]">
              Tarjetas Creadas ({profiles.length})
            </label>
            <button
              onClick={onOpenCreateProfile}
              className="px-2 py-1 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
              title="Crear nueva tarjeta digital"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nueva</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scroll pr-1">
            {profiles.map((p, idx) => {
              const isSelected = idx === currentIndex;
              const initials = p.name
                .replace(/^(Mtra\.|Mtro\.|Ing\.|Lic\.|Dr\.|Dra\.)\s+/, '')
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('');

              const getBadgeColor = (themeKey: CardTheme) => {
                switch (themeKey) {
                  case 'ejecutivo':
                    return 'bg-slate-100 text-slate-700';
                  case 'negocio':
                    return 'bg-emerald-100 text-emerald-800';
                  case 'personal':
                    return 'bg-orange-100 text-[#ac3400]';
                }
              };

              const getAvatarBg = (idx: number) => {
                const colors = [
                  'bg-slate-800 text-white',
                  'bg-emerald-800 text-white',
                  'bg-amber-800 text-white',
                  'bg-purple-800 text-white',
                  'bg-blue-800 text-white',
                  'bg-rose-800 text-white'
                ];
                return colors[idx % colors.length];
              };

              return (
                <div
                  key={`${p.publicId}-${idx}`}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-start gap-2.5 relative group ${
                    isSelected
                      ? 'border-2 border-[#00685f] bg-white shadow-sm'
                      : 'border border-transparent bg-white/70 hover:bg-white hover:border-stone-200'
                  }`}
                >
                  <button
                    onClick={() => onSelectProfile(idx)}
                    className="flex-1 flex items-start gap-2.5 min-w-0 text-left cursor-pointer"
                  >
                    <div
                      className={`w-9 h-9 rounded-full font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs ${getAvatarBg(
                        idx
                      )}`}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-bold text-[#1a1c1c] truncate">{p.shortName}</p>
                        {p.verified && (
                          <UserCheck className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                        )}
                        {!p.published && (
                          <span className="text-[9px] bg-stone-200 text-stone-600 px-1 py-0.2 rounded font-bold">Pausada</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6d7a77] truncate">{p.company}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-semibold ${getBadgeColor(
                          p.themeKey
                        )}`}
                      >
                        {p.themeKey === 'ejecutivo'
                          ? 'Tema Ejecutivo'
                          : p.themeKey === 'negocio'
                          ? 'Tema Negocio Visual'
                          : 'Tema Marca Personal'}
                      </span>
                    </div>
                  </button>

                  {/* Delete button (when more than 1 card exists) */}
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileToDelete(p);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer rounded-lg shrink-0"
                      title={`Eliminar tarjeta de ${p.shortName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Theme Switcher Override */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6d7a77] mb-2">
            Tema Visual de Tarjeta
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            {(['ejecutivo', 'negocio', 'personal'] as CardTheme[]).map((t) => {
              const isActive = activeTheme === t;
              return (
                <button
                  key={t}
                  onClick={() => onChangeTheme(t)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer capitalize ${
                    isActive
                      ? 'bg-white text-[#1a1c1c] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Testing Quick Actions & Dashboard Access */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6d7a77] mb-2">
            Herramientas de Control
          </label>
          <div className="space-y-1.5">
            {/* Dashboard Trigger */}
            <button
              onClick={onOpenDashboard}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100/80 text-[13px] font-bold text-[#00685f] text-left transition-colors cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#00685f]" />
                <span>Dashboard de Control</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-200/80 text-teal-900 font-bold">Métricas</span>
            </button>

            <button
              onClick={onDownloadVCard}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-[13px] font-medium text-[#1a1c1c] text-left transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#00685f]" />
              <span>Descargar .vcf real activo</span>
            </button>

            <button
              onClick={onOpenQR}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-[13px] font-medium text-[#1a1c1c] text-left transition-colors cursor-pointer shadow-2xs"
            >
              <QrCode className="w-4 h-4 text-[#ac3400]" />
              <span>Simular Escaneo QR</span>
            </button>

            <button
              onClick={() => onOpenSpec('json')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-[13px] font-medium text-[#1a1c1c] text-left transition-colors cursor-pointer shadow-2xs"
            >
              <Code2 className="w-4 h-4 text-slate-700" />
              <span>Ver JSON estructurado</span>
            </button>

            <button
              onClick={onOpenEditProfile}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-[13px] font-semibold text-stone-800 text-left transition-colors cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-4 h-4 text-stone-600" />
              <span>Editar Datos de Tarjeta</span>
            </button>

            {onOpenDelivery && (
              <button
                onClick={onOpenDelivery}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Entregar Tarjeta al Cliente</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-6 border-t border-stone-200 mt-6">
        <button
          onClick={() => onOpenSpec('gcp')}
          className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-stone-200/60 text-[12px] font-medium text-stone-700 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-[#00685f]" />
            <span>Despliegue GCP & CDN Spec</span>
          </span>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
        <p className="text-[10px] text-[#6d7a77] mt-2 text-center">
          Cumple con estándar vCard 3.0 UTF-8 & WCAG 2.1 AA
        </p>

        {onLogoutAdmin && (
          <button
            onClick={onLogoutAdmin}
            className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión de Administrador</span>
          </button>
        )}
      </div>

      {/* Confirm Delete Card Modal */}
      <ConfirmDeleteModal
        isOpen={!!profileToDelete}
        onClose={() => setProfileToDelete(null)}
        onConfirm={() => {
          if (profileToDelete) {
            onDeleteProfile(profileToDelete.publicId);
            setProfileToDelete(null);
          }
        }}
        profile={profileToDelete}
        canDelete={profiles.length > 1}
      />
    </aside>
  );
};
