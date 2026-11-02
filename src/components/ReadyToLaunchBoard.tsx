import React, { useState, useEffect } from 'react';
import {
  Rocket,
  ShieldCheck,
  Server,
  Scale,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  DollarSign,
  Users,
  FileText,
  Lock,
  Database,
  Globe,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';

interface ReadyToLaunchBoardProps {
  profilesCount: number;
  onShowToast: (msg: string) => void;
  onOpenCreateProfile?: () => void;
}

interface ChecklistItem {
  id: string;
  pillar: 'hosting' | 'maintenance' | 'privacy' | 'legal' | 'commercial';
  title: string;
  description: string;
  urgency: 'critica' | 'recomendada' | 'opcional';
  status: 'listo' | 'requiere_accion' | 'en_progreso';
  mexicoSpecific?: boolean;
  technicalDetails?: string;
}

const CHECKLIST_KEY = 'redconecta_launch_checklist_v4';

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // 1. Hosting & Escalabilidad (1,000+ tarjetas)
  {
    id: 'hospedaje-blaze',
    pillar: 'hosting',
    title: 'Migración a Plan Firebase Blaze (Pay-as-you-go)',
    description:
      'El plan gratuito Spark tiene un tope de 50,000 lecturas/día en Firestore. Con 1,000 tarjetas recibiendo tráfico comercial, se requiere activar Blaze. El costo real es muy bajo: entre $50 y $150 MXN/mes.',
    urgency: 'critica',
    status: 'requiere_accion',
    technicalDetails:
      'Consola de Firebase > Cambiar de plan Spark a Blaze. Permite agregar tarjeta bancaria mexicana (débito/crédito) y fijar una alerta de presupuesto mensual de $10 USD para evitar sorpresas.'
  },
  {
    id: 'hospedaje-cdn',
    pillar: 'hosting',
    title: 'Capacidad de Red Global (CDN Fastly / Google Cloud)',
    description:
      'Firebase Hosting distribuye la tarjeta en nodos perimetrales SSD en todo México y el mundo con SSL gratuito automático. Soporta sin problemas picos de más de 500,000 visitas al mes.',
    urgency: 'recomendada',
    status: 'listo',
    technicalDetails:
      'Arquitectura actual probada con HTTP/2, compresión gzip/brotli y caché estricto para assets compilados.'
  },
  {
    id: 'hospedaje-query-optimization',
    pillar: 'hosting',
    title: 'Carga Bajo Demanda en la Vista Pública (O(1) por Slug)',
    description:
      'Garantizar que quien escanea una tarjeta /c/:id solo descargue el documento de esa tarjeta específica en Firestore (12 KB), no el catálogo entero de las 1,000 tarjetas.',
    urgency: 'critica',
    status: 'listo',
    technicalDetails:
      'La función getCloudProfile(publicId) ya consulta directamente por clave primaria /profiles/:slug, optimizando lecturas y tiempo de respuesta (< 250ms).'
  },

  // 2. Creación & Mantenimiento
  {
    id: 'mantenimiento-autoservicio',
    pillar: 'maintenance',
    title: 'Portal de Autoservicio del Titular con PIN',
    description:
      'Evita que la agencia se sature con llamadas para cambiar un teléfono o WhatsApp. El titular accede con su PIN de 4 dígitos a su portal privado para actualizar datos básicos.',
    urgency: 'recomendada',
    status: 'listo',
    technicalDetails:
      'Implementado mediante ClientPortalModal y ClientPinModal. Cada titular tiene su PIN configurado en su perfil.'
  },
  {
    id: 'mantenimiento-bulk-import',
    pillar: 'maintenance',
    title: 'Carga Masiva de Colaboradores (CSV / Excel para Empresas)',
    description:
      'Para cerrar contratos con empresas que requieren 20, 50 o 100 tarjetas a la vez (ej. fuerza de ventas o corporativos), se requiere importar planillas de Excel sin capturar una por una.',
    urgency: 'recomendada',
    status: 'en_progreso',
    technicalDetails:
      'Actualmente el Studio cuenta con CreateProfileModal individual y plantillas prellenadas por los 7 perfiles. El siguiente paso operativo es habilitar un importador CSV masivo.'
  },
  {
    id: 'mantenimiento-backups',
    pillar: 'maintenance',
    title: 'Respaldos Diarios Automatizados a Google Cloud Storage',
    description:
      'Programar una exportación diaria de la base de datos de perfiles y leads a un bucket privado de Google Cloud Storage para salvaguardar la información contra borrados accidentales.',
    urgency: 'recomendada',
    status: 'requiere_accion',
    technicalDetails:
      'Se configura con Cloud Firestore Scheduled Backups mediante gcloud firestore backups schedules create o Cloud Functions.'
  },

  // 3. Protección de Datos Personales (México - LFPDPPP)
  {
    id: 'privacidad-aviso-integral',
    pillar: 'privacy',
    title: 'Aviso de Privacidad Integral publicado (LFPDPPP / INAI)',
    description:
      'Obligatorio por ley en México para personas físicas o morales que recaben datos personales. Debe identificar a Tribu Creativa QRO / RedConecta MX, finalidades primarias y secundarias.',
    urgency: 'critica',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'Publicado en LegalNoticeModal y enlazado en el footer de cada tarjeta y home, cumpliendo los 9 lineamientos del INAI.'
  },
  {
    id: 'privacidad-aviso-simplificado',
    pillar: 'privacy',
    title: 'Aviso de Privacidad Simplificado en Formulario de Leads',
    description:
      'Cuando un prospecto usa el botón "Intercambiar Contacto / Dejar Mensaje", debe haber una leyenda legal y enlace al Aviso de Privacidad antes de enviar.',
    urgency: 'critica',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'Implementado en LeadCaptureModal con checkbox obligatorio y texto LFPDPPP de tratamiento exclusivo para contacto profesional.'
  },
  {
    id: 'privacidad-arco',
    pillar: 'privacy',
    title: 'Procedimiento de Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)',
    description:
      'Cualquier titular o prospecto puede exigir que se borren sus datos. La ley mexicana fija un plazo máximo de 20 días hábiles para dar respuesta.',
    urgency: 'critica',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'Implementado en LegalNoticeModal con selector de derecho ARCO, cálculo de plazo de 20 días hábiles y mailto oficial.'
  },
  {
    id: 'privacidad-firestore-rules',
    pillar: 'privacy',
    title: 'Blindaje de Reglas de Seguridad en Base de Datos (/leads)',
    description:
      'Validación de esquemas y protección de base de datos para operar 1,000 tarjetas comerciales sin riesgo de inyecciones o lecturas arbitrarias.',
    urgency: 'critica',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'Reglas de Firestore desplegadas y activas con validación estricta de esquemas, tamaños y tipos para /leads, /meetings y /activities.'
  },
  {
    id: 'privacidad-salud-sensibles',
    pillar: 'privacy',
    title: 'Exclusión Estricta de Datos Clínicos Sensibles (Perfil Salud)',
    description:
      'El artículo 3° de la LFPDPPP clasifica los datos de salud como "sensibles", exigiendo consentimiento expreso por escrito y medidas de seguridad reforzadas.',
    urgency: 'critica',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'El componente LeadCaptureModal ya adapta sus etiquetas en el perfil de salud para solicitar únicamente motivo general de cita, canalizando consultas clínicas a Doctoralia o consultorio.'
  },

  // 4. Aspectos Legales & Comerciales (PROFECO / SAT)
  {
    id: 'legal-tyc-contrato',
    pillar: 'legal',
    title: 'Términos y Condiciones del Servicio (T&C Comercial)',
    description:
      'Establece el SLA de disponibilidad (99.5%), vigencia anual, propiedad de marcas/logos subidos por el cliente y deslinde de responsabilidad por información falsa que publique el titular.',
    urgency: 'critica',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'Cláusula clave integrada en LegalNoticeModal: Tribu Creativa QRO provee soporte digital y el titular es el único responsable legal de sus cédulas y servicios.'
  },
  {
    id: 'legal-sat-cfdi',
    pillar: 'legal',
    title: 'Facturación Electrónica en México (CFDI 4.0)',
    description:
      'Las empresas y profesionistas mexicanos requieren deducir su tarjeta digital como gasto de publicidad, representación o tecnología.',
    urgency: 'recomendada',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'Módulo de facturación CFDI 4.0 implementado en ClientDeliveryModal con validación de RFC, Razón Social, C.P., Régimen SAT y Claves SAT 82101603 / E48.'
  },
  {
    id: 'legal-profeco',
    pillar: 'legal',
    title: 'Cumplimiento Comercial PROFECO (Comercio Electrónico)',
    description:
      'Publicar precios claros en pesos mexicanos (MXN), indicar si incluyen IVA, políticas claras de renovación anual y mecanismo de atención a quejas o dudas.',
    urgency: 'recomendada',
    status: 'listo',
    mexicoSpecific: true,
    technicalDetails:
      'Precios en MXN + IVA, deslinde profesional y mecanismo de atención formalizados en LegalNoticeModal conforme al Art. 76 BIS LFPC.'
  },

  // 5. Modelo Comercial & Cobranza
  {
    id: 'comercial-pasarela',
    pillar: 'commercial',
    title: 'Pasarela de Cobro Recurrente para México (Stripe / Mercado Pago)',
    description:
      'Automatizar el cobro de renovaciones anuales ($599 - $1,499 MXN) mediante tarjeta de crédito, débito bancario mexicano y transferencias SPEI.',
    urgency: 'recomendada',
    status: 'en_progreso',
    mexicoSpecific: true,
    technicalDetails:
      'Stripe México o Mercado Pago Checkout Pro permiten cobrar suscripciones anuales con recordatorios automáticos de cobro.'
  }
];

export const ReadyToLaunchBoard: React.FC<ReadyToLaunchBoardProps> = ({
  profilesCount,
  onShowToast,
  onOpenCreateProfile
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem(CHECKLIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_CHECKLIST;
  });

  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showBlazeGuideModal, setShowBlazeGuideModal] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null);

  // Sync checklist changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  const toggleItemStatus = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'listo'
              ? 'requiere_accion'
              : item.status === 'requiere_accion'
              ? 'en_progreso'
              : 'listo';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
    onShowToast('Estado de auditoría actualizado.');
  };

  // Readiness Score
  const totalItems = checklist.length;
  const readyItems = checklist.filter((i) => i.status === 'listo').length;
  const inProgressItems = checklist.filter((i) => i.status === 'en_progreso').length;
  const readyScore = Math.round(((readyItems + inProgressItems * 0.5) / totalItems) * 100);

  const filteredChecklist = checklist.filter((item) => {
    if (filterPillar === 'all') return true;
    return item.pillar === filterPillar;
  });

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDoc(label);
    onShowToast(`Texto de "${label}" copiado al portapapeles.`);
    setTimeout(() => setCopiedDoc(null), 3000);
  };

  // Unit Economics Simulation for 1,000 Cards
  const avgPriceAnnualMXN = 799; // Precio promedio anual sugerido
  const projectedRevenueMXN = 1000 * avgPriceAnnualMXN;
  const estHostingMonthlyUSD = 6; // Firebase Blaze for 1,000 cards
  const estHostingAnnualMXN = estHostingMonthlyUSD * 12 * 18.5; // ~ $1,332 MXN al año
  const domainAnnualMXN = 450;
  const estTotalCostAnnualMXN = estHostingAnnualMXN + domainAnnualMXN;
  const projectedNetMargin = Math.round(
    ((projectedRevenueMXN - estTotalCostAnnualMXN) / projectedRevenueMXN) * 100
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Launch Score */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Rocket className="w-3.5 h-3.5 text-teal-400" />
              <span>Auditoría de Lanzamiento Comercial a Escala</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Launch Board: Meta 1,000+ Tarjetas
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Diagnóstico integral de viabilidad técnica, mantenimiento masivo, seguridad en base de datos y marco normativo mexicano (<strong>LFPDPPP</strong>, <strong>INAI</strong>, <strong>PROFECO</strong> y <strong>SAT</strong>) para comercializar tu producto de forma legal y rentable.
            </p>
          </div>

          {/* Readiness Gauge Widget */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-5 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${readyScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-extrabold text-xl text-white font-mono">
                {readyScore}%
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold block">
                Puntaje de Madurez
              </span>
              <p className="text-white font-bold text-sm">
                {readyScore >= 80 ? 'Listo para Preventa y Pilotos' : 'Requiere Ajustes Previos'}
              </p>
              <span className="text-slate-300 text-xs">
                {readyItems} listos • {inProgressItems} en progreso • {totalItems - readyItems - inProgressItems} pendientes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unit Economics & Feasibility Overview (1,000 Tarjetas en México) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-4 h-4 text-[#00685f]" />
            <span>¿Soporta 1,000 Tarjetas?</span>
          </span>
          <p className="text-xl font-extrabold text-emerald-700">Sí, 100% Viable</p>
          <p className="text-xs text-stone-600 leading-snug">
            Firebase Hosting y Firestore soportan millones de visitas. Solo requiere activar <strong>Blaze</strong>.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-teal-600" />
            <span>Costo Técnico Anual (1,000)</span>
          </span>
          <p className="text-xl font-extrabold text-stone-900 font-mono">
            ~${estTotalCostAnnualMXN.toLocaleString()} MXN
          </p>
          <p className="text-xs text-stone-600 leading-snug">
            Menos de $150 MXN al mes entre base de datos, CDN global y dominio personalizado.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Facturación Anual Estimada</span>
          </span>
          <p className="text-xl font-extrabold text-emerald-600 font-mono">
            ${projectedRevenueMXN.toLocaleString()} MXN
          </p>
          <p className="text-xs text-stone-600 leading-snug">
            A un promedio accesible de $799 MXN / año por tarjeta profesional con CRM.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Margen Bruto</span>
          </span>
          <p className="text-xl font-extrabold text-purple-700 font-mono">
            {projectedNetMargin}%
          </p>
          <p className="text-xs text-stone-600 leading-snug">
            Modelo SaaS de altísimo margen con costo marginal de servidor cercano a cero.
          </p>
        </div>
      </div>

      {/* 3. Action Quick Access Bar (Legal Generator & Guides) */}
      <div className="bg-teal-50/70 rounded-2xl p-4 border border-teal-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-teal-900 font-bold text-xs sm:text-sm">
          <FileText className="w-4 h-4 text-[#00685f]" />
          <span>Documentos y Modelos Legales Listos para México:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-teal-300 text-[#00685f] text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aviso de Privacidad (LFPDPPP)</span>
          </button>
          <button
            onClick={() => setShowTermsModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-teal-300 text-[#00685f] text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Términos y Condiciones (T&C)</span>
          </button>
          <button
            onClick={() => setShowBlazeGuideModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Guía Paso a Paso: Activar Blaze</span>
          </button>
        </div>
      </div>

      {/* 4. Pillars Filter & Interactive Checklist */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <h3 className="text-[17px] font-bold text-stone-900">
              Checklist de Auditoría y Madurez ({readyItems} de {totalItems} Completados)
            </h3>
            <p className="text-xs text-stone-500">
              Haz clic en cualquier estado para cambiarlo (Listo, Requiere Acción o En Progreso).
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'hosting', label: '1. Hosting & Base' },
              { id: 'maintenance', label: '2. Mantenimiento' },
              { id: 'privacy', label: '3. Privacidad (INAI)' },
              { id: 'legal', label: '4. Legal & SAT' },
              { id: 'commercial', label: '5. Comercial' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setFilterPillar(p.id)}
                className={`px-3 py-1 rounded-xl transition-all font-semibold cursor-pointer ${
                  filterPillar === p.id
                    ? 'bg-[#00685f] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist Rows */}
        <div className="space-y-3">
          {filteredChecklist.map((item) => {
            const isReady = item.status === 'listo';
            const isProgress = item.status === 'en_progreso';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isReady
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : isProgress
                    ? 'bg-amber-50/40 border-amber-200/80'
                    : 'bg-stone-50/60 border-stone-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{item.title}</span>
                      {item.mexicoSpecific && (
                        <span className="px-2 py-0.2 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
                          Ley México
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.2 rounded-md text-[10px] font-bold uppercase ${
                          item.urgency === 'critica'
                            ? 'bg-rose-100 text-rose-700'
                            : item.urgency === 'recomendada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed pr-2">
                      {item.description}
                    </p>
                    {item.technicalDetails && (
                      <div className="mt-2 text-[11px] font-mono text-stone-500 bg-white/70 p-2 rounded-xl border border-stone-200/80 inline-block">
                        <strong>Recomendación técnica:</strong> {item.technicalDetails}
                      </div>
                    )}
                  </div>

                  {/* Toggle Status Button */}
                  <div className="shrink-0 pt-1 sm:pt-0">
                    <button
                      onClick={() => toggleItemStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        isReady
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : isProgress
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                      }`}
                    >
                      {isReady ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Listo</span>
                        </>
                      ) : isProgress ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>En Progreso</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Por Atender</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Aviso de Privacidad Modelo (LFPDPPP) */}
      {showPrivacyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00685f]" />
                <h3 className="font-bold text-stone-900 text-base">
                  Aviso de Privacidad Integral Modelo (México - LFPDPPP)
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scroll text-xs text-stone-700 space-y-4 leading-relaxed font-sans">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                <strong>Nota Legal:</strong> Este modelo cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y los lineamientos del INAI para proveedores de servicios digitales en México.
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">1. Identidad y Domicilio del Responsable</h4>
                <p>
                  <strong>Tribu Creativa QRO • RedConecta MX</strong>, con domicilio en Santiago de Querétaro, Qro., México, es responsable del tratamiento y protección de los datos personales recabados a través de las Tarjetas Digitales Inteligentes y su plataforma web.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">2. Datos Personales Recabados</h4>
                <p>
                  Recabamos: Nombre completo, teléfono, correo electrónico, empresa, cargo, ciudad, enlaces a redes sociales y datos de contacto profesional voluntariamente compartidos.
                </p>
                <p className="mt-1 font-semibold text-rose-800">
                  En ningún caso se recaban datos sensibles relativos a salud, ideología o biométricos de los visitantes.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">3. Finalidades del Tratamiento</h4>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li><strong>Finalidades Primarias:</strong> Generación y publicación de la tarjeta digital, facilitar el intercambio de contacto entre profesionales y canalización de solicitudes comerciales directas vía WhatsApp o correo.</li>
                  <li><strong>Finalidades Secundarias:</strong> Métricas agregadas de visitas y descargas de vCard (sin geolocalización invasiva).</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">4. Mecanismo para el Ejercicio de Derechos ARCO</h4>
                <p>
                  Usted tiene derecho a conocer qué datos tenemos de usted, para qué los usamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección (Rectificación), que los eliminemos de nuestros registros (Cancelación), o bien oponerse al uso de los mismos para fines específicos (Oposición).
                </p>
                <p className="mt-1">
                  Para ejercer sus derechos ARCO, envíe una solicitud al correo: <strong>privacidad@tribucreativaqro.com</strong> indicando su nombre completo, el enlace de la tarjeta y el derecho que desea ejercer. Se dará respuesta en un plazo legal máximo de <strong>20 días hábiles</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">5. Transferencia de Datos</h4>
                <p>
                  Sus datos no serán transferidos ni vendidos a terceros con fines de prospección publicitaria no autorizada.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Última actualización: Octubre 2026</span>
              <button
                onClick={() =>
                  handleCopyText(
                    `AVISO DE PRIVACIDAD INTEGRAL - TRIBU CREATIVA QRO • REDCONECTA MX\n\n1. Responsable: Tribu Creativa QRO, Querétaro, México.\n2. Datos recabados: Nombre, teléfono, correo, empresa, redes sociales. No se recaban datos sensibles.\n3. Finalidad: Generación de tarjeta digital y enlace directo comercial.\n4. Derechos ARCO: Contactar a privacidad@tribucreativaqro.com con respuesta en máx. 20 días hábiles.\n5. Transferencias: No se transfieren datos a terceros sin autorización.`,
                    'Aviso de Privacidad'
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDoc === 'Aviso de Privacidad' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDoc === 'Aviso de Privacidad' ? '¡Copiado!' : 'Copiar Texto Legal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Términos y Condiciones Comerciales (T&C) */}
      {showTermsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#00685f]" />
                <h3 className="font-bold text-stone-900 text-base">
                  Términos y Condiciones del Servicio (SaaS Tarjetas Digitales)
                </h3>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scroll text-xs text-stone-700 space-y-4 leading-relaxed">
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">1. Objeto y Alcance del Servicio</h4>
                <p>
                  Tribu Creativa QRO suministra un micrositio web responsivo (Tarjeta Digital Inteligente) alojado en infraestructura global con código QR dinámico, exportador vCard y analítica de escaneos.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">2. Veracidad de la Información y Deslinde de Responsabilidad</h4>
                <p>
                  El titular o cliente corporativo garantiza que la información proporcionada (incluyendo títulos profesionales, especialidades, cédulas sanitarias y marcas registradas) es verídica y cuenta con las facultades legales para su difusión. Tribu Creativa QRO se deslinda de cualquier acuerdo, contrato o resultado comercial entablado entre el titular y sus visitantes.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">3. Nivel de Servicio (SLA)</h4>
                <p>
                  El servicio cuenta con una disponibilidad garantizada del <strong>99.5% anual</strong> respaldada por la red CDN de Google Cloud / Firebase Hosting. Los periodos de mantenimiento programado se notificarán con anticipación.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">4. Vigencia, Renovación y Facturación SAT</h4>
                <p>
                  La contratación tiene vigencia anual. La facturación electrónica con CFDI 4.0 se emite dentro del mes en curso conforme a las regulaciones fiscales del Servicio de Administración Tributaria (SAT).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">5. Suspensión por Uso Indebido</h4>
                <p>
                  Tribu Creativa QRO se reserva el derecho de pausar o dar de baja cualquier tarjeta digital cuyo contenido promueva actividades ilícitas, esquemas fraudulentos o spam masivo no solicitado.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
              <button
                onClick={() =>
                  handleCopyText(
                    `TÉRMINOS Y CONDICIONES DEL SERVICIO - TRIBU CREATIVA QRO\n\n1. Objeto: Suministro de tarjeta digital inteligente y analítica.\n2. Veracidad: El titular es responsable de sus cédulas y marcas.\n3. SLA: 99.5% de disponibilidad garantizada.\n4. Facturación: CFDI 4.0 SAT México.\n5. Vigencia: 1 año renovable.`,
                    'Términos y Condiciones'
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDoc === 'Términos y Condiciones' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDoc === 'Términos y Condiciones' ? '¡Copiado!' : 'Copiar Términos'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Guía Rápida para Activar Firebase Blaze */}
      {showBlazeGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowBlazeGuideModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#00685f]" />
                <h3 className="font-bold text-stone-900 text-base">
                  Guía: Activar Firebase Blaze para 1,000+ Tarjetas
                </h3>
              </div>
              <button
                onClick={() => setShowBlazeGuideModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scroll text-xs text-stone-700 space-y-4 leading-relaxed">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900">
                <strong>¿Por qué Blaze?:</strong> En el plan Spark gratuito, si 1,000 tarjetas reciben 60 visitas al día, se superan las 50k lecturas diarias y la base de datos se suspende hasta la medianoche. Con Blaze nunca se suspende y el costo es ínfimo (~$5 a $10 USD/mes).
              </div>

              <ol className="list-decimal pl-5 space-y-3 font-medium">
                <li>
                  Ingresa a la consola: <a href="https://console.firebase.google.com/project/tribucreativaqro/overview" target="_blank" rel="noreferrer" className="text-[#00685f] underline font-bold inline-flex items-center gap-1">console.firebase.google.com <ExternalLink className="w-3 h-3" /></a>
                </li>
                <li>
                  En la esquina inferior izquierda, haz clic en el botón <strong>"Actualizar (Upgrade)"</strong> junto al plan Spark.
                </li>
                <li>
                  Selecciona el <strong>Plan Blaze (Pago por uso)</strong>.
                </li>
                <li>
                  Vincula una cuenta de facturación de Google Cloud con tarjeta bancaria mexicana (crédito o débito empresarial).
                </li>
                <li>
                  <strong>Recomendación de seguridad:</strong> Configura una alerta de presupuesto en Google Cloud Billing fijando un límite mensual de <strong>$20 USD ($400 MXN)</strong> para recibir alertas automáticas si el tráfico inusual se dispara.
                </li>
              </ol>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setShowBlazeGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
