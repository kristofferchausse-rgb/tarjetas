import React, { useState, useRef, useEffect } from 'react';
import { ParticipantProfile } from '../types/card';
import {
  Share2,
  Smartphone,
  LayoutDashboard,
  Send,
  QrCode,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Code2,
  FileText,
  Cloud,
  LogOut,
  Home,
  Search,
  Check,
  Edit3,
  UserCheck,
  Users
} from 'lucide-react';

interface SimulatorHeaderProps {
  activeNav: string;
  onNavClick: (navKey: string) => void;
  onOpenQR: () => void;
  onDownloadVCard: () => void;
  onOpenSpec: (tab?: 'json' | 'vcard' | 'gcp' | 'qa') => void;
  isStandaloneView: boolean;
  onToggleStandalone: () => void;
  onOpenDashboard: () => void;
  isDashboardActive: boolean;
  onLogoutAdmin?: () => void;
  onOpenDelivery?: () => void;
  onBackHome?: () => void;
  onOpenInviteClient?: () => void;
  profiles?: ParticipantProfile[];
  currentIndex?: number;
  onSelectProfile?: (index: number) => void;
  onOpenEditProfile?: () => void;
  onOpenClientStats?: () => void;
}

export const SimulatorHeader: React.FC<SimulatorHeaderProps> = ({
  activeNav,
  onNavClick,
  onOpenQR,
  onDownloadVCard,
  onOpenSpec,
  isStandaloneView,
  onToggleStandalone,
  onOpenDashboard,
  isDashboardActive,
  onLogoutAdmin,
  onOpenDelivery,
  onBackHome,
  onOpenInviteClient,
  profiles,
  currentIndex = 0,
  onSelectProfile,
  onOpenEditProfile,
  onOpenClientStats
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [switcherSearch, setSwitcherSearch] = useState('');

  const toolsRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolsRef.current && !toolsRef.current.contains(target)) {
        setIsToolsOpen(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(target)) {
        setIsSwitcherOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsToolsOpen(false);
        setIsSwitcherOpen(false);
      }
    };

    if (isToolsOpen || isSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isToolsOpen, isSwitcherOpen]);

  const currentProfile =
    profiles && profiles.length > 0 && currentIndex !== undefined
      ? profiles[currentIndex]
      : null;

  const filteredSwitcherProfiles = (profiles || []).filter((p) => {
    if (!switcherSearch.trim()) return true;
    const q = switcherSearch.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.publicId.toLowerCase().includes(q)
    );
  });

  return (
    <header className="border-b border-stone-200/90 bg-[#f9f9f8]/95 backdrop-blur-md sticky top-0 z-40 shrink-0 shadow-2xs">
      <div className="flex justify-between items-center w-full px-3 sm:px-6 max-w-7xl mx-auto h-16 gap-2">
        {/* Zone 1: Brand & Studio Tag (Left) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onBackHome}
            className="flex items-center gap-2 sm:gap-2.5 text-left hover:opacity-85 transition-opacity cursor-pointer group"
            title="Volver a la Página Principal (Home)"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#00685f] to-[#004e47] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-[14px] sm:text-[16px] font-extrabold text-[#00685f] tracking-tight">
                Tribu Creativa QRO
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider bg-slate-900 text-teal-300 font-extrabold">
                Studio
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Workspace View Switcher & Fast Card Selector */}
        <div className="flex items-center gap-2">
          {/* Segmented Control */}
          <div className="hidden md:flex items-center bg-stone-200/70 p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => {
                if (isDashboardActive) {
                  onNavClick('Simulador');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isDashboardActive
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Abrir Simulador y Editor de Tarjetas"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Simulador</span>
            </button>

            <button
              onClick={onOpenDashboard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isDashboardActive
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Abrir Dashboard de Control, Métricas y Gestión"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
              <span>Dashboard</span>
              <span className="px-1.5 py-0.2 rounded-full bg-teal-100 text-[#00685f] text-[9px] font-extrabold">
                Admin
              </span>
            </button>

            {onOpenClientStats && (
              <button
                onClick={onOpenClientStats}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-stone-600 hover:text-stone-900"
                title="Abrir Buzón de Prospectos, Citas y Seguimiento (Mini-CRM)"
              >
                <Users className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Mini-CRM</span>
              </button>
            )}
          </div>

          {/* High Volume UX: Fast Card Switcher in Header (when in simulator mode) */}
          {!isDashboardActive && currentProfile && onSelectProfile && profiles && (
            <div className="relative" ref={switcherRef}>
              <button
                type="button"
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-800 transition-all cursor-pointer shadow-2xs max-w-[190px] sm:max-w-[240px]"
                title="Cambiar tarjeta activa rápidamente"
              >
                {currentProfile.avatarUrl ? (
                  <img
                    src={currentProfile.avatarUrl}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover border border-stone-200 shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-teal-800 text-white text-[9px] flex items-center justify-center font-bold shrink-0">
                    {currentProfile.shortName?.[0] || 'T'}
                  </div>
                )}
                <span className="truncate text-stone-900 text-left">
                  {currentProfile.shortName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {/* Searchable Dropdown Popover */}
              {isSwitcherOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                      Seleccionar Tarjeta ({profiles.length})
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold">Cambio Instantáneo</span>
                  </div>

                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Filtrar por titular o empresa..."
                      value={switcherSearch}
                      onChange={(e) => setSwitcherSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    />
                  </div>

                  <div className="space-y-1 max-h-56 overflow-y-auto custom-scroll pr-1">
                    {filteredSwitcherProfiles.map((p) => {
                      const origIndex = profiles.findIndex((orig) => orig.publicId === p.publicId);
                      const isSelected = origIndex === currentIndex;
                      return (
                        <button
                          key={p.publicId}
                          type="button"
                          onClick={() => {
                            onSelectProfile(origIndex);
                            setIsSwitcherOpen(false);
                            setSwitcherSearch('');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer text-xs ${
                            isSelected
                              ? 'bg-teal-50 border border-teal-200 text-[#00685f] font-bold'
                              : 'hover:bg-stone-50 text-stone-800 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {p.avatarUrl ? (
                              <img
                                src={p.avatarUrl}
                                alt=""
                                className="w-6 h-6 rounded-lg object-cover shrink-0 border border-stone-200"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-lg bg-stone-800 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                {p.shortName?.[0] || 'T'}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{p.name}</p>
                              <p className="text-[10px] text-stone-400 truncate">{p.company}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00685f] shrink-0" />}
                        </button>
                      );
                    })}
                    {filteredSwitcherProfiles.length === 0 && (
                      <p className="text-center text-xs text-stone-400 py-4 italic">
                        No se encontraron titulares.
                      </p>
                    )}
                  </div>

                  {onOpenEditProfile && (
                    <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSwitcherOpen(false);
                          onOpenEditProfile();
                        }}
                        className="text-xs text-[#00685f] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar tarjeta activa</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 3: High-Value Actions & Consolidated Menu (Right) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Preview Toggle (Chassis vs Clean Direct View) */}
          <button
            onClick={onToggleStandalone}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isStandaloneView
                ? 'bg-teal-50 border-teal-300 text-[#00685f]'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            title={isStandaloneView ? 'Volver al chasis del simulador' : 'Ver experiencia web completa sin chasis'}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#00685f]" />
            <span className="hidden sm:inline">{isStandaloneView ? 'Simulador' : 'Vista Móvil'}</span>
          </button>

          {/* Quick QR Trigger */}
          <button
            onClick={onOpenQR}
            className="p-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Ver y compartir Código QR de la tarjeta activa"
            aria-label="Código QR"
          >
            <QrCode className="w-4 h-4 text-stone-700" />
          </button>

          {/* Direct Mini-CRM & Prospects Trigger */}
          {onOpenClientStats && (
            <button
              onClick={onOpenClientStats}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#00685f] text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Abrir Buzón de Prospectos, Citas y Seguimiento del Titular"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Prospectos CRM</span>
            </button>
          )}

          {/* Primary Business CTA: Entregar al Cliente */}
          {onOpenDelivery && (
            <button
              onClick={onOpenDelivery}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Entregar tarjeta al cliente por WhatsApp con mensaje preformateado y QR PNG"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Entregar</span>
            </button>
          )}

          {/* Consolidated Tools & Options Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Herramientas y especificaciones técnicas"
              aria-expanded={isToolsOpen}
              aria-haspopup="true"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Opciones</span>
              <ChevronDown
                className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${
                  isToolsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isToolsOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                role="menu"
              >
                <div className="px-3.5 py-1.5 border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Herramientas del Estudio
                </div>

                {onOpenEditProfile && (
                  <button
                    onClick={() => {
                      setIsToolsOpen(false);
                      onOpenEditProfile();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-stone-800 hover:bg-teal-50 hover:text-[#00685f] transition-colors cursor-pointer text-left"
                    role="menuitem"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>Personalizar Tarjeta (Studio)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onDownloadVCard();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer text-left"
                  role="menuitem"
                >
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>Descargar .vcf activo</span>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenSpec('json');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer text-left"
                  role="menuitem"
                >
                  <Code2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Ver JSON Estructurado</span>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenSpec('gcp');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer text-left"
                  role="menuitem"
                >
                  <Cloud className="w-3.5 h-3.5 text-stone-500" />
                  <span>Especificación Cloud & CDN</span>
                </button>

                {onOpenInviteClient && (
                  <div className="pt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenInviteClient();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-50 transition-colors cursor-pointer text-left"
                      role="menuitem"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-600" />
                      <span>Enviar Alta a Cliente</span>
                    </button>
                  </div>
                )}

                {onLogoutAdmin && (
                  <div className="pt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onLogoutAdmin();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                      role="menuitem"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
