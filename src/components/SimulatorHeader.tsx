import React, { useState, useRef, useEffect } from 'react';
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
  Home
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
  onBackHome
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close tools dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsToolsOpen(false);
      }
    };

    if (isToolsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isToolsOpen]);

  return (
    <header className="border-b border-stone-200/90 bg-[#f9f9f8]/95 backdrop-blur-md sticky top-0 z-40 shrink-0 shadow-2xs">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-7xl mx-auto h-16">
        
        {/* Zone 1: Brand & Studio Tag (Left) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackHome}
            className="flex items-center gap-3 text-left hover:opacity-85 transition-opacity cursor-pointer group"
            title="Volver a la Página Principal (Home)"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00685f] to-[#004e47] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[16px] font-extrabold text-[#00685f] tracking-tight">
                Tribu Creativa QRO
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider bg-slate-900 text-teal-300 font-extrabold">
                Studio
              </span>
              <span className="hidden xl:inline text-[11px] text-stone-500 font-medium">
                · Tarjetas Digitales
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Workspace View Switcher (Center Segmented Control) */}
        <div className="hidden md:flex items-center bg-stone-200/70 p-1 rounded-xl shadow-2xs">
          <button
            onClick={() => {
              if (isDashboardActive) {
                onNavClick('Simulador');
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
        </div>

        {/* Zone 3: High-Value Actions & Consolidated Menu (Right) */}
        <div className="flex items-center gap-2">
          
          {/* Quick Preview Toggle (Chassis vs Clean Direct View) */}
          <button
            onClick={onToggleStandalone}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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

          {/* Primary Business CTA: Entregar al Cliente */}
          {onOpenDelivery && (
            <button
              onClick={onOpenDelivery}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Entregar tarjeta al cliente por WhatsApp con mensaje preformateado y QR PNG"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Entregar al Cliente</span>
            </button>
          )}

          {/* Consolidated Tools & Options Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isToolsOpen
                  ? 'bg-stone-200/90 border-stone-300 text-stone-900 shadow-inner'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shadow-2xs'
              }`}
              title="Más herramientas y especificaciones técnicas"
              aria-label="Menú de herramientas"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Active Card Group */}
                <div className="px-3.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Tarjeta Activa
                </div>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenQR();
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-800">Código QR</p>
                    <p className="text-[10px] text-stone-400">Escaneo en vivo y descarga PNG</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onDownloadVCard();
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#00685f] flex items-center justify-center shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-800">Descargar vCard (.vcf)</p>
                    <p className="text-[10px] text-stone-400">Archivo de contacto para móviles</p>
                  </div>
                </button>

                {/* Developer Specs Group */}
                <div className="my-1.5 border-t border-stone-100" />
                <div className="px-3.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Especificaciones & Specs
                </div>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenSpec('json');
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-800">Esquema JSON & Metadatos</p>
                    <p className="text-[10px] text-stone-400">Estructura para desarrolladores</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenSpec('vcard');
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-800">Estándar vCard 3.0</p>
                    <p className="text-[10px] text-stone-400">Compatibilidad RFC 2426</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenSpec('gcp');
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Cloud className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-800">Guía de Despliegue & CDN</p>
                    <p className="text-[10px] text-stone-400">Hosting y arquitectura cloud</p>
                  </div>
                </button>

                {/* Navigation to Home */}
                {onBackHome && (
                  <>
                    <div className="my-1.5 border-t border-stone-100" />
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onBackHome();
                      }}
                      className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                        <Home className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-stone-800">Página de Inicio</p>
                        <p className="text-[10px] text-stone-400">Ir a la web principal (Home)</p>
                      </div>
                    </button>
                  </>
                )}

                {/* Session Logout Group */}
                {onLogoutAdmin && (
                  <>
                    <div className="my-1.5 border-t border-stone-100" />
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onLogoutAdmin();
                      }}
                      className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-rose-50 text-rose-700 cursor-pointer transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                        <LogOut className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-rose-700">Cerrar Sesión Admin</p>
                        <p className="text-[10px] text-rose-400">Bloquear panel con PIN</p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
