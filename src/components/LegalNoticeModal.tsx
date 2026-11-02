import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  UserCheck,
  Scale,
  Mail,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Send,
  Search,
  ArrowUp,
  ChevronRight,
  Bookmark,
  Check,
  ExternalLink
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'arco';

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  profileName?: string;
  onShowToast?: (msg: string) => void;
}

interface SectionItem {
  id: string;
  title: string;
  badge?: string;
}

const PRIVACY_SECTIONS: SectionItem[] = [
  { id: 'sec-priv-1', title: '1. Identidad y Domicilio' },
  { id: 'sec-priv-2', title: '2. Datos Personales Recabados' },
  { id: 'sec-priv-sensibles', title: 'Exclusión de Datos Sensibles', badge: 'Estricto' },
  { id: 'sec-priv-3', title: '3. Finalidades del Tratamiento' },
  { id: 'sec-priv-4', title: '4. Transferencia de Datos' },
  { id: 'sec-priv-5', title: '5. Ejercicio Derechos ARCO', badge: '20 días' }
];

const TERMS_SECTIONS: SectionItem[] = [
  { id: 'sec-terms-1', title: '1. Objeto del Servicio' },
  { id: 'sec-terms-2', title: '2. Deslinde de Responsabilidad', badge: 'Clave' },
  { id: 'sec-terms-3', title: '3. Disponibilidad (SLA 99.5%)' },
  { id: 'sec-terms-4', title: '4. Propiedad Intelectual' },
  { id: 'sec-terms-5', title: '5. Precios y PROFECO' },
  { id: 'sec-terms-6', title: '6. Jurisdicción Querétaro' }
];

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
  profileName,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ARCO Form state
  const [arcoName, setArcoName] = useState('');
  const [arcoEmail, setArcoEmail] = useState('');
  const [arcoCard, setArcoCard] = useState(profileName || '');
  const [arcoRight, setArcoRight] = useState<'Acceso' | 'Rectificación' | 'Cancelación' | 'Oposición'>('Acceso');
  const [arcoDetails, setArcoDetails] = useState('');
  const [arcoSubmitted, setArcoSubmitted] = useState(false);

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setArcoSubmitted(false);
      setSearchQuery('');
      if (profileName) setArcoCard(profileName);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, initialTab, profileName]);

  // Handle scroll events to show/hide "Scroll to Top" button
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 200);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isOpen) return null;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    onShowToast?.(`Correo copiado: ${email}`);
  };

  const handleCopyFullDocument = () => {
    let fullText = '';
    if (activeTab === 'privacy') {
      fullText = `AVISO DE PRIVACIDAD INTEGRAL — Tribu Creativa QRO • RedConecta MX\n` +
        `Cumplimiento formal con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).\n\n` +
        `1. Identidad y Domicilio: Tribu Creativa QRO, Santiago de Querétaro, Qro., México.\n` +
        `2. Datos Recabados: Identificación profesional, contacto, enlaces públicos. Exclusión estricta de datos sensibles.\n` +
        `3. Finalidades: Hospedaje de tarjeta digital, generación de vCard, canalización de prospectos.\n` +
        `4. Transferencia: Servidores seguros en Google Cloud. No venta ni cesión a terceros.\n` +
        `5. Derechos ARCO: Correo oficial privacidad@tribucreativaqro.com. Plazo legal de respuesta: 20 días hábiles.`;
    } else if (activeTab === 'terms') {
      fullText = `TÉRMINOS Y CONDICIONES DE SERVICIO — Tribu Creativa QRO • RedConecta MX\n\n` +
        `1. Objeto: Servicio de alojamiento y difusión de identidades profesionales y códigos QR inteligentes.\n` +
        `2. Deslinde Profesional: La plataforma provee soporte técnico. El titular es el único responsable legal y deontológico de sus ofertas, certificaciones y cédulas.\n` +
        `3. Disponibilidad SLA: 99.5% anual en infraestructura CDN.\n` +
        `4. Precios y PROFECO: Moneda Nacional (MXN) + IVA 16%, con facturación CFDI 4.0.\n` +
        `5. Jurisdicción: Tribunales competentes de Santiago de Querétaro, Qro.`;
    } else {
      fullText = `MECANISMO OFICIAL DERECHOS ARCO\n` +
        `Envío de solicitudes a privacidad@tribucreativaqro.com con plazo de respuesta de 20 días hábiles.`;
    }

    navigator.clipboard.writeText(fullText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2200);
    onShowToast?.('Resumen del documento copiado al portapapeles');
  };

  const handleArcoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arcoName.trim() || !arcoEmail.trim() || !arcoDetails.trim()) {
      onShowToast?.('Por favor completa todos los campos requeridos para la solicitud ARCO.');
      return;
    }

    const subject = `[Solicitud Derechos ARCO - ${arcoRight}] - ${arcoName.trim()}`;
    const body = `SOLICITUD FORMAL DE EJERCICIO DE DERECHOS ARCO (LFPDPPP MÉXICO)\n\n` +
      `• Nombre del Solicitante: ${arcoName.trim()}\n` +
      `• Correo de Contacto: ${arcoEmail.trim()}\n` +
      `• Tarjeta o Registro Asociado: ${arcoCard.trim() || 'General'}\n` +
      `• Derecho Solicitado: ${arcoRight}\n` +
      `• Motivo / Detalle de la Solicitud:\n${arcoDetails.trim()}\n\n` +
      `Fecha de Envío: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}\n` +
      `Fundamento Legal: Artículos 28 al 35 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.\n` +
      `Plazo Legal de Respuesta: 20 días hábiles.`;

    const mailtoUrl = `mailto:privacidad@tribucreativaqro.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');

    setArcoSubmitted(true);
    onShowToast?.('Solicitud preparada en tu cliente de correo. Plazo legal de respuesta: 20 días hábiles.');
  };

  const currentSections = activeTab === 'privacy' ? PRIVACY_SECTIONS : activeTab === 'terms' ? TERMS_SECTIONS : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full h-[92dvh] sm:h-[88vh] flex flex-col shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between gap-3 bg-gradient-to-r from-stone-50 via-white to-stone-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Scale className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-[#1a1c1c] truncate">
                  Marco Legal y Privacidad en México
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  LFPDPPP • INAI • PROFECO
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                Tribu Creativa QRO • RedConecta MX | Santiago de Querétaro, México
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyFullDocument}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Copiar texto resumen del documento"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copiar resumen</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              aria-label="Cerrar modal legal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Segmented Modern Control */}
        <div className="p-2 sm:px-5 sm:py-2.5 border-b border-stone-200 bg-stone-50/70 shrink-0">
          <div className="grid grid-cols-3 gap-1 sm:gap-2 max-w-xl mx-auto bg-stone-200/70 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('privacy');
                if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
              }}
              className={`py-2 px-2 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-white text-[#00685f] shadow-xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Aviso de Privacidad</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('terms');
                if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
              }}
              className={`py-2 px-2 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-white text-[#00685f] shadow-xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Términos de Uso</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('arco');
                if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
              }}
              className={`py-2 px-2 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'arco'
                  ? 'bg-white text-[#00685f] shadow-xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Derechos ARCO</span>
            </button>
          </div>

          {/* Quick Search & Mobile Table of Contents Bar */}
          {activeTab !== 'arco' && (
            <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar en el documento (ej. datos sensibles, COFEPRIS, IVA, cancelación)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-stone-200 rounded-xl text-[11px] text-stone-800 focus:outline-none focus:border-[#00685f] shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Mobile quick jump chips (hidden on desktop where left sidebar exists) */}
              <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-0.5">
                  <Bookmark className="w-3 h-3 text-[#00685f]" />
                  <span>Índice:</span>
                </span>
                {currentSections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-white hover:bg-teal-50 text-stone-700 hover:text-[#00685f] border border-stone-200 transition-all shadow-2xs active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Main Body (Two columns on desktop for instant navigation) */}
        <div className="flex-1 overflow-hidden flex min-h-0 relative">
          {/* Desktop Sticky Index Sidebar */}
          {activeTab !== 'arco' && (
            <aside className="hidden md:flex w-60 shrink-0 border-r border-stone-200 bg-stone-50/50 p-4 flex-col justify-between overflow-y-auto">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold mb-2 px-2 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Índice del documento</span>
                </div>
                {currentSections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group cursor-pointer ${
                      activeSectionId === sec.id
                        ? 'bg-teal-50 text-[#00685f] border border-teal-200/80 shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <span className="truncate">{sec.title}</span>
                    {sec.badge ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold shrink-0">
                        {sec.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Legal help callout in sidebar */}
              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs mt-4">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Atención Legal</span>
                <span className="text-[11px] font-bold text-stone-800 block mt-0.5">Mesa de Privacidad</span>
                <p className="text-[10px] text-stone-500 mt-0.5">Respuestas oficiales fundadas en la LFPDPPP.</p>
                <button
                  type="button"
                  onClick={() => handleCopyEmail('privacidad@tribucreativaqro.com')}
                  className="mt-2 text-[10.5px] font-extrabold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar correo oficial</span>
                </button>
              </div>
            </aside>
          )}

          {/* Scrollable Document Content */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs text-stone-600 leading-relaxed scroll-smooth relative"
          >
            {/* TAB 1: AVISO DE PRIVACIDAD INTEGRAL */}
            {activeTab === 'privacy' && (
              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 flex items-start gap-3 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-xs text-teal-950">Cumplimiento Integral con la Legislación Mexicana</p>
                    <p className="text-[11.5px] text-teal-800/90 mt-0.5 leading-normal">
                      Este aviso da cumplimiento formal a los Artículos 15, 16, 17 y demás relativos de la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> y los lineamientos del <strong>INAI</strong>.
                    </p>
                  </div>
                </div>

                {/* Section 1 */}
                <div id="sec-priv-1" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">1</span>
                    <span>Identidad y Domicilio del Responsable</span>
                  </h4>
                  <p>
                    <strong>Tribu Creativa QRO</strong> (en conjunto con la iniciativa tecnológica <strong>RedConecta MX</strong>), con domicilio de operaciones en la Ciudad de Santiago de Querétaro, Estado de Querétaro, México, es el responsable del tratamiento y resguardo de los datos personales que nos proporcione voluntariamente al utilizar nuestras tarjetas digitales ejecutivas o servicios de networking.
                  </p>
                </div>

                {/* Section 2 */}
                <div id="sec-priv-2" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">2</span>
                    <span>Datos Personales Recabados</span>
                  </h4>
                  <p>
                    Para la prestación del servicio de tarjetas ejecutivas y su directorio interactivo, recabamos las siguientes categorías de datos:
                  </p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1">
                    <li><strong>Datos de Identificación:</strong> Nombre, apellidos, cargo, profesión o especialidad.</li>
                    <li><strong>Datos de Contacto:</strong> Número de teléfono celular (WhatsApp), correo electrónico, perfiles de redes sociales y enlaces a páginas web.</li>
                    <li><strong>Datos Laborales:</strong> Nombre de la empresa o consultorio, dirección física comercial, enlaces de agendamiento y descripción de soluciones profesionales.</li>
                  </ul>
                </div>

                {/* Sensibles Exclusion */}
                <div id="sec-priv-sensibles" className="scroll-mt-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Exclusión Estricta de Datos Personales Sensibles</span>
                  </div>
                  <p className="text-[11.5px] text-amber-900/90 leading-relaxed">
                    En ningún caso recabamos ni almacenamos datos personales catalogados como sensibles por la ley (origen racial, estado de salud, diagnósticos clínicos, creencias religiosas o políticas, datos biométricos o financieros directos). Los formularios de contacto están estrictamente destinados a la vinculación comercial o profesional inicial.
                  </p>
                </div>

                {/* Section 3 */}
                <div id="sec-priv-3" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">3</span>
                    <span>Finalidades del Tratamiento</span>
                  </h4>
                  <p><strong>Finalidades Primarias (necesarias para el servicio):</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Crear, hospedar y difundir públicamente el micrositio y tarjeta digital ejecutiva del titular.</li>
                    <li>Facilitar la descarga de la ficha de contacto en formato electrónico estándar (vCard).</li>
                    <li>Canalizar mensajes de contacto directo y prospectos hacia el titular vía WhatsApp o correo electrónico.</li>
                    <li>Proporcionar soporte técnico y mantenimiento de la plataforma.</li>
                  </ul>
                  <p className="mt-2 pt-2 border-t border-stone-100"><strong>Finalidades Secundarias:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Generación de métricas estadísticas agregadas y anónimas (número de visualizaciones, escaneos de QR y clics a botones).</li>
                  </ul>
                </div>

                {/* Section 4 */}
                <div id="sec-priv-4" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">4</span>
                    <span>Transferencia de Datos</span>
                  </h4>
                  <p>
                    Los datos incorporados en la tarjeta digital pública son visibles en internet por instrucción expresa de su titular. <strong>Tribu Creativa QRO no vende, no arrienda ni transfiere bajo ninguna modalidad sus datos personales a terceras empresas o agencias publicitarias.</strong> Únicamente se utilizan proveedores de infraestructura de clase mundial con servidores seguros (Google Cloud Platform / Firebase).
                  </p>
                </div>

                {/* Section 5 */}
                <div id="sec-priv-5" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2.5">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">5</span>
                    <span>Medios para Ejercer los Derechos ARCO</span>
                  </h4>
                  <p>
                    Usted tiene en todo momento el derecho de <strong>Acceder</strong>, <strong>Rectificar</strong>, <strong>Cancelar</strong> u <strong>Oponerse</strong> al tratamiento de sus datos personales. Para ejercer este derecho puede usar directamente nuestra pestaña interactiva o enviar su solicitud por correo formal:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('arco')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#00685f] text-white font-extrabold text-[11px] shadow-xs hover:bg-[#008378] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Abrir Formulario ARCO aquí</span>
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 font-mono text-[11px] text-stone-800">
                      <Mail className="w-3.5 h-3.5 text-teal-600" />
                      <span>privacidad@tribucreativaqro.com</span>
                      <button
                        onClick={() => handleCopyEmail('privacidad@tribucreativaqro.com')}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                        title="Copiar correo"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    El plazo legal máximo para emitir respuesta fundada es de <strong>20 días hábiles</strong> a partir de la recepción de su solicitud.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: TÉRMINOS Y CONDICIONES */}
            {activeTab === 'terms' && (
              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-100 border border-stone-200 text-stone-800 flex items-start gap-3 shadow-2xs">
                  <FileText className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-xs text-stone-900">Contrato de Prestación de Servicios de Software como Servicio (SaaS)</p>
                    <p className="text-[11.5px] text-stone-600 mt-0.5 leading-normal">
                      Al utilizar o contratar una tarjeta digital con Tribu Creativa QRO / RedConecta MX, el titular y usuario aceptan los presentes términos de uso.
                    </p>
                  </div>
                </div>

                {/* Section 1 */}
                <div id="sec-terms-1" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">1</span>
                    <span>Objeto del Servicio</span>
                  </h4>
                  <p>
                    RedConecta MX provee una plataforma tecnológica que permite a profesionistas independientes, ejecutivos y empresas alojar, personalizar y compartir su identidad profesional y canales de contacto a través de un micrositio móvil y código QR inteligente.
                  </p>
                </div>

                {/* Section 2: Deslinde */}
                <div id="sec-terms-2" className="scroll-mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-xs text-rose-900">
                    <Scale className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>2. Deslinde y Limitación de Responsabilidad Profesional</span>
                  </div>
                  <p className="text-[11.5px] text-rose-950 leading-relaxed">
                    <strong>Tribu Creativa QRO y RedConecta MX proveen exclusivamente el soporte digital y la infraestructura tecnológica de alojamiento.</strong> Cada titular es el <strong>único y absoluto responsable civil, penal, laboral, administrativo y deontológico</strong> de la veracidad de la información publicada, cédulas profesionales, certificaciones, grados académicos, autorizaciones sanitarias (incluyendo avisos de publicidad ante COFEPRIS para servicios de salud) y de la calidad y cumplimiento de los productos o servicios que oferta.
                  </p>
                </div>

                {/* Section 3 */}
                <div id="sec-terms-3" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">3</span>
                    <span>Disponibilidad del Servicio (SLA 99.5%)</span>
                  </h4>
                  <p>
                    La plataforma opera sobre infraestructura CDN global de Google Cloud con un objetivo de disponibilidad anual del <strong>99.5%</strong>. No obstante, el servicio puede experimentar interrupciones programadas para mantenimiento o por causas de fuerza mayor fuera del control directo de la agencia.
                  </p>
                </div>

                {/* Section 4 */}
                <div id="sec-terms-4" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">4</span>
                    <span>Propiedad Intelectual</span>
                  </h4>
                  <p>
                    El código fuente, arquitectura, diseño de plantillas, marcas y logotipos de Tribu Creativa QRO y RedConecta MX son propiedad exclusiva de sus desarrolladores. Las fotografías, logotipos y contenidos provistos por el titular continúan siendo de su propiedad intelectual, otorgando a la plataforma únicamente la licencia de alojamiento y visualización necesaria para operar la tarjeta.
                  </p>
                </div>

                {/* Section 5 */}
                <div id="sec-terms-5" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">5</span>
                    <span>Precios, Facturación y Cancelaciones (PROFECO)</span>
                  </h4>
                  <p>
                    Los precios de las tarjetas digitales se cotizan en <strong>Moneda Nacional (MXN)</strong> con desglose formal de IVA (16%). El servicio incluye emisión de factura electrónica (CFDI 4.0). Las membresías se renuevan anualmente. En caso de solicitar la baja del servicio, el titular puede tramitarla en cualquier momento previo a su fecha de corte.
                  </p>
                </div>

                {/* Section 6 */}
                <div id="sec-terms-6" className="scroll-mt-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-[#00685f] text-xs font-black flex items-center justify-center">6</span>
                    <span>Jurisdicción Aplicable</span>
                  </h4>
                  <p>
                    Para la interpretación y cumplimiento de estos términos, las partes se someten expresamente a las leyes federales de los Estados Unidos Mexicanos y a la jurisdicción de los <strong>Tribunales Competentes de la Ciudad de Santiago de Querétaro, Estado de Querétaro</strong>, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: DERECHOS ARCO (FORMULARIO INTERACTIVO) */}
            {activeTab === 'arco' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 flex items-start gap-3 shadow-2xs">
                  <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-xs text-teal-950">Mecanismo Oficial de Ejercicio de Derechos ARCO</p>
                    <p className="text-[11.5px] text-teal-800/90 mt-0.5 leading-normal">
                      Conforme al Capítulo IV de la LFPDPPP, garantizamos su derecho a <strong>Acceder</strong>, <strong>Rectificar</strong>, <strong>Cancelar</strong> u <strong>Oponerse</strong> al uso de sus datos personales. Plazo legal de resolución: <strong>20 días hábiles</strong>.
                    </p>
                  </div>
                </div>

                {arcoSubmitted ? (
                  <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3 shadow-2xs">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-emerald-950 text-base">
                      Solicitud ARCO Preparada con Éxito
                    </h4>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                      Se ha abierto tu cliente de correo para enviar la solicitud formal al departamento de privacidad. Se emitirá acuse de recibo y resolución en un plazo legal máximo de <strong>20 días hábiles</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setArcoSubmitted(false)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Crear otra solicitud
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleArcoSubmit} className="space-y-3.5 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Nombre Completo del Titular *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Juan Pérez González"
                          value={arcoName}
                          onChange={(e) => setArcoName(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Correo Electrónico para Notificaciones *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="tu@correo.com"
                          value={arcoEmail}
                          onChange={(e) => setArcoEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Tarjeta o Registro Asociado
                        </label>
                        <input
                          type="text"
                          placeholder="Nombre de la tarjeta o ID"
                          value={arcoCard}
                          onChange={(e) => setArcoCard(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Derecho que Desea Ejercer *
                        </label>
                        <select
                          value={arcoRight}
                          onChange={(e) => setArcoRight(e.target.value as any)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                        >
                          <option value="Acceso">Acceso (Conocer mis datos registrados)</option>
                          <option value="Rectificación">Rectificación (Corregir datos erróneos)</option>
                          <option value="Cancelación">Cancelación (Eliminar mis datos/tarjeta)</option>
                          <option value="Oposición">Oposición (Oponerme a fines específicos)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Descripción Clara y Precisa de los Datos y Solicitud *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Explica qué datos requieres corregir, cancelar o sobre cuáles ejerces tu oposición..."
                        value={arcoDetails}
                        onChange={(e) => setArcoDetails(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f] resize-none"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-stone-100 text-[11px] text-stone-500">
                      <p>
                        <strong>Nota de Seguridad Legal:</strong> Conforme al Art. 31 de la LFPDPPP, para dar trámite a la rectificación o cancelación, se le podrá requerir copia digitalizada de identificación oficial (INE o Pasaporte) para acreditar su titularidad antes de aplicar modificaciones a la base de datos.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitud ARCO a Privacidad</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Floating "Scroll to top" button */}
            {showScrollTop && (
              <button
                type="button"
                onClick={scrollToTop}
                className="fixed bottom-16 right-6 sm:bottom-18 sm:right-10 w-9 h-9 rounded-full bg-[#00685f] hover:bg-[#008378] text-white shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 z-20"
                title="Volver al inicio"
                aria-label="Volver al inicio"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-[11px] text-stone-500 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate">
              Contacto legal: <strong className="text-stone-800">privacidad@tribucreativaqro.com</strong>
            </span>
            <button
              type="button"
              onClick={() => handleCopyEmail('privacidad@tribucreativaqro.com')}
              className="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-800 transition-colors cursor-pointer shrink-0"
              title="Copiar correo de privacidad"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-extrabold transition-colors cursor-pointer shrink-0"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
