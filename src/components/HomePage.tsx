import React, { useState } from 'react';
import { ParticipantProfile } from '../types/card';
import { LegalNoticeModal, LegalTab } from './LegalNoticeModal';
import {
  Share2,
  Smartphone,
  LayoutDashboard,
  TrendingUp,
  Lock,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  QrCode,
  Users,
  Eye,
  Download,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface HomePageProps {
  profiles: ParticipantProfile[];
  onOpenStudio: () => void;
  onOpenDashboard: () => void;
  onOpenClientPortal: () => void;
  onPreviewCard: (publicId: string) => void;
  onOpenOnboarding?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenStudio,
  onOpenDashboard,
  onOpenClientPortal
}) => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] text-[#1a1c1c] antialiased flex flex-col selection:bg-[#00685f] selection:text-white">
      {/* 1. Top Navbar */}
      <header className="border-b border-stone-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00685f] to-[#004e47] flex items-center justify-center text-white shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-[#00685f] tracking-tight">
                  Tribu Creativa QRO
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-teal-100 text-[#00685f]">
                  NFC & Digital Cards
                </span>
              </div>
              <p className="text-[10px] text-stone-500 hidden md:block">
                Tecnología de Networking Inteligente para Profesionales
              </p>
            </div>
          </div>

          {/* Quick Gateways */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://wa.me/524424799017?text=Hola%20Tribu%20Creativa%20QRO,%20me%20gustar%C3%ADa%20cotizar%20tarjetas%20digitales%20NFC%20ejecutivas."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Solicitar cotización personalizada para tu empresa o profesión"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Cotizar Tarjetas</span>
            </a>

            {/* Client Portal Button */}
            <button
              onClick={onOpenClientPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100/80 text-[#00685f] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Consultar analíticas y rendimiento de tu tarjeta"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#00685f]" />
              <span className="hidden sm:inline">Portal Clientes</span>
              <span className="text-[10px] bg-teal-200/80 px-1.5 py-0.2 rounded-full font-bold">Métricas</span>
            </button>

            {/* Admin / Studio Access */}
            <button
              onClick={onOpenStudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Acceso restringido para el equipo de Tribu Creativa QRO"
            >
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Acceso Agencia</span>
            </button>
          </div>
        </div>
      </header>

      {/* Core Gateways: Ecosistema Integral */}
      <section className="flex-1 flex items-center py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00685f]">
              Ecosistema Integral
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              Accesos al Centro de Control y Analíticas
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Plataformas dedicadas tanto para el equipo creativo de la agencia como para nuestros clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gateway 1: Panel de Creación / Studio */}
            <div className="bg-[#f9f9f8] rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#00685f] flex items-center justify-center shadow-xs">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">Panel de Creación</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-slate-900 text-teal-300">
                      Studio
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Diseña, edita y genera nuevas tarjetas digitales interactivas para clientes con temas ejecutivo, negocio o marca personal.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Requiere PIN de Administrador</span>
                </div>
              </div>

              <button
                onClick={onOpenStudio}
                className="mt-6 w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Abrir Panel de Creación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gateway 2: Dashboard Admin Global */}
            <div className="bg-[#f9f9f8] rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-teal-300 flex items-center justify-center shadow-xs">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">Dashboard Admin</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-teal-100 text-[#00685f]">
                      Agencia
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Supervisión consolidada de todas las tarjetas activas, reportes de analítica global, leads recibidos y exportación en Excel/CSV.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Requiere PIN de Administrador</span>
                </div>
              </div>

              <button
                onClick={onOpenDashboard}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Abrir Dashboard Global</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </button>
            </div>

            {/* Gateway 3: Portal del Cliente (Analíticas) */}
            <div className="bg-[#f0f9f8] rounded-3xl p-6 border border-teal-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#00685f]">Portal de Clientes</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-emerald-100 text-emerald-800">
                      Métricas
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Ingresa con el identificador de tu tarjeta para consultar tus vistas en vivo, escaneos QR, descargas vCard y mensajes directos.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Acceso directo para clientes</span>
                </div>
              </div>

              <button
                onClick={onOpenClientPortal}
                className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Ver mis Analíticas en Vivo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto bg-slate-950 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00685f] flex items-center justify-center text-white">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-white">Tribu Creativa QRO</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Estudio especializado en Querétaro de tarjetas de presentación digitales con tecnología NFC, 
                código QR dinámico y micro-sitios ejecutivos de alto impacto para negocios y profesionales.
              </p>
              <p className="text-xs text-teal-400 font-semibold">
                WhatsApp Directo: +52 (442) 479-9017
              </p>
            </div>

            {/* Col 2: Accesos Directos */}
            {/* Col 2: Accesos */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Accesos de Plataforma
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <a
                    href="https://wa.me/524424799017?text=Hola%20Tribu%20Creativa%20QRO,%20quiero%20informaci%C3%B3n%20sobre%20las%20tarjetas%20digitales%20NFC."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-teal-300 text-teal-400 font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Cotizar con un Asesor</span>
                  </a>
                </li>
                <li>
                  <button onClick={onOpenClientPortal} className="hover:text-white transition-colors cursor-pointer">
                    Portal de Clientes (Métricas)
                  </button>
                </li>
                <li>
                  <button onClick={onOpenStudio} className="hover:text-white transition-colors cursor-pointer">
                    Panel de Creación (Studio)
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDashboard} className="hover:text-white transition-colors cursor-pointer">
                    Dashboard Admin
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Soluciones */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Soluciones
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Tarjetas NFC Ejecutivas</li>
                <li>Micro-sitios Corporativos</li>
                <li>QR Dinámico para Eventos</li>
                <li>vCard 3.0 Compatible iOS / Android</li>
              </ul>
            </div>

            {/* Col 4: Marco Legal México */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Legal & Privacidad (México)
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => handleOpenLegal('privacy')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Aviso de Privacidad (LFPDPPP)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenLegal('terms')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Términos y Condiciones
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenLegal('arco')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Ejercicio Derechos ARCO
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Tribu Creativa QRO • RedConecta MX. Todos los derechos reservados.</p>
            <div className="flex items-center gap-3 text-slate-400">
              <span>Santiago de Querétaro, México</span>
              <span>•</span>
              <button
                onClick={() => handleOpenLegal('privacy')}
                className="hover:text-white transition-colors cursor-pointer underline"
              >
                LFPDPPP & INAI
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & Privacy Compliance Modal */}
      <LegalNoticeModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
};
