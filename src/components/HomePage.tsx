import React from 'react';
import { ParticipantProfile } from '../types/card';
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
}

export const HomePage: React.FC<HomePageProps> = ({
  profiles,
  onOpenStudio,
  onOpenDashboard,
  onOpenClientPortal,
  onPreviewCard
}) => {
  const featuredProfile = profiles[0] || null;

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

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-white to-[#f5f6f5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-emerald-700" />
                <span>La Nueva Era del Networking Profesional en Querétaro</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1c1c] tracking-tight leading-tight">
                La tarjeta digital que <span className="text-[#00685f]">abre puertas</span> y multiplica tus negocios.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Diseñadas a la medida por <strong>Tribu Creativa QRO</strong> con tecnología de contacto <strong>NFC</strong>, 
                código <strong>QR de alta velocidad</strong> y guardado directo en la agenda telefónica sin que tus clientes 
                tengan que descargar ninguna app.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="https://wa.me/524424799017?text=Hola%20Tribu%20Creativa%20QRO,%20me%20interesa%20solicitar%20mi%20tarjeta%20digital%20NFC%20inteligente."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Solicitar mi Tarjeta por WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    if (featuredProfile) onPreviewCard(featuredProfile.publicId);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm border border-stone-200 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#00685f]" />
                  <span>Ver Tarjeta Demo en Vivo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-stone-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f]" />
                  <span>Compatible iOS & Android</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f]" />
                  <span>Sin descargar apps</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f]" />
                  <span>Métricas privadas en vivo</span>
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Card Preview Teaser */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-3xl blur-xl opacity-30 animate-pulse" />

                {/* Card Showcase Chassis */}
                <div className="relative bg-white rounded-3xl border border-stone-200 p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 text-teal-300 text-[10px] font-extrabold tracking-wider uppercase">
                      NFC Contactless Ready
                    </span>
                    <span className="text-[11px] text-[#00685f] font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tribu Creativa QRO</span>
                    </span>
                  </div>

                  {/* Profile preview snippet */}
                  {featuredProfile && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={featuredProfile.avatarUrl}
                          alt={featuredProfile.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00685f]/30 shadow-xs"
                        />
                        <div>
                          <h3 className="font-extrabold text-base text-stone-900">
                            {featuredProfile.name}
                          </h3>
                          <p className="text-xs text-[#00685f] font-bold">
                            {featuredProfile.role}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {featuredProfile.company}
                          </p>
                        </div>
                      </div>

                      {/* Mocked action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-center font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                          <Download className="w-3.5 h-3.5 text-[#00685f]" />
                          <span>Guardar Contacto</span>
                        </div>
                      </div>

                      {/* Quick click to test */}
                      <button
                        onClick={() => onPreviewCard(featuredProfile.publicId)}
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <span>Abrir Demo Interactivo Completo</span>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                      </button>
                    </div>
                  )}

                  {/* Micro stats banner */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>Vistas rastreadas</span>
                    </span>
                    <span className="font-bold text-emerald-600">98% conversión de contacto</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Core Gateways (The 3 Access Portals Requested) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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

      {/* 4. How it works (3 Simple Steps) */}
      <section className="py-16 md:py-20 bg-[#f4f5f4] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00685f]">
              Experiencia Sin Fricción
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              ¿Cómo funciona en tu día a día?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Conecta de inmediato sin perder tiempo dictando números ni perdiendo tarjetas impresas en cajones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00685f] font-black text-sm flex items-center justify-center mx-auto md:mx-0">
                01
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Acerca tu tarjeta NFC</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Toca la parte trasera del teléfono de tu cliente o muéstrale tu código QR. Funciona con iPhone y Android al instante.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00685f] font-black text-sm flex items-center justify-center mx-auto md:mx-0">
                02
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Se abre tu perfil digital</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tu prospecto ve tu fotografía, puesto, WhatsApp directo, enlaces a redes sociales y servicios sin instalar nada.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00685f] font-black text-sm flex items-center justify-center mx-auto md:mx-0">
                03
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Guarda en su agenda en 1 clic</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Con un solo toque, tus datos completos se integran en los contactos de su teléfono con formato vCard 3.0 estándar.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Directory Showcase of Client Cards */}
      <section className="py-16 md:py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#00685f]">
                Portafolio de Clientes
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                Tarjetas Activas en la Red
              </h2>
            </div>
            <button
              onClick={onOpenClientPortal}
              className="text-xs font-bold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Consultar mis analíticas en el Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.slice(0, 6).map((p) => (
              <div
                key={p.publicId}
                className="bg-[#f9f9f8] p-5 rounded-3xl border border-stone-200 hover:border-teal-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-stone-900 truncate group-hover:text-[#00685f] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#00685f] font-semibold truncate">{p.role}</p>
                    <p className="text-[11px] text-stone-500 truncate">{p.company}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between">
                  <button
                    onClick={() => onPreviewCard(p.publicId)}
                    className="text-xs font-bold text-stone-700 hover:text-[#00685f] flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Tarjeta</span>
                  </button>

                  <button
                    onClick={() => onPreviewCard(p.publicId)}
                    className="text-[10px] font-bold text-teal-800 bg-teal-100/70 hover:bg-teal-200/70 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                  >
                    Visitar micrositio →
                  </button>
                </div>
              </div>
            ))}
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
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Accesos de Plataforma
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400">
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
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Tribu Creativa QRO. Todos los derechos reservados.</p>
            <p className="text-slate-400">Querétaro, Qro. México · Cumple con RFC 2426 & WCAG 2.1</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
