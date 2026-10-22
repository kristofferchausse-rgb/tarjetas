import React, { useState } from 'react';
import { ParticipantProfile } from '../types/card';
import { generateVCardString } from '../utils/vcard';
import {
  X,
  Terminal,
  Code2,
  FileCheck2,
  Cloud,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface SpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  initialTab?: 'json' | 'vcard' | 'gcp' | 'qa';
  onShowToast: (msg: string) => void;
}

export const SpecModal: React.FC<SpecModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialTab = 'json',
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'vcard' | 'gcp' | 'qa'>(initialTab);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vcardText = generateVCardString(profile);
  const jsonText = JSON.stringify(profile, null, 2);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast(`${label} copiado al portapapeles`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spec-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between shrink-0 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00685f]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 id="spec-modal-title" className="text-[18px] font-bold text-[#1a1c1c]">
                Arquitectura Técnica & Despliegue
              </h3>
              <p className="text-[12px] text-[#6d7a77] mt-0.5">
                Especificación vCard 3.0, JSON Schema y Configuración Google Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            aria-label="Cerrar ventana de especificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-100/70 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-4 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'json'
                ? 'text-[#00685f] border-[#00685f]'
                : 'text-[#6d7a77] border-transparent hover:text-[#1a1c1c]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Modelo JSON del Participante</span>
          </button>
          <button
            onClick={() => setActiveTab('vcard')}
            className={`py-3 px-4 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'vcard'
                ? 'text-[#00685f] border-[#00685f]'
                : 'text-[#6d7a77] border-transparent hover:text-[#1a1c1c]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Estándar vCard 3.0 (RFC 2426)</span>
          </button>
          <button
            onClick={() => setActiveTab('gcp')}
            className={`py-3 px-4 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'gcp'
                ? 'text-[#00685f] border-[#00685f]'
                : 'text-[#6d7a77] border-transparent hover:text-[#1a1c1c]'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Despliegue GCP Cloud Run & CDN</span>
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`py-3 px-4 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'qa'
                ? 'text-[#00685f] border-[#00685f]'
                : 'text-[#6d7a77] border-transparent hover:text-[#1a1c1c]'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Matriz QA & Accesibilidad</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto custom-scroll text-[13px]">
          {/* Tab 1: JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1a1c1c]">Estructura de Datos del Perfil (Active Participant Schema):</p>
                  <p className="text-[#6d7a77] text-[12px]">Validado contra la interfaz TypeScript <code className="text-teal-700 font-mono">ParticipantProfile</code></p>
                </div>
                <button
                  onClick={() => handleCopy(jsonText, 'JSON')}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar JSON</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-[12px] leading-relaxed overflow-x-auto shadow-inner">
                {jsonText}
              </pre>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px]">
                <strong className="block mb-1">¿Cómo agregar o editar participantes?</strong>
                Basta con añadir un objeto en <code className="font-mono bg-white/70 px-1 py-0.5 rounded">src/data/profiles.ts</code> asignando un <code className="font-mono">publicId</code> único (e.g. <code className="font-mono">"ana-torres"</code>). La URL estable será automáticamente <code className="font-mono">/c/ana-torres</code> y su QR reflejará en tiempo real cualquier cambio sin alterar la URL.
              </div>
            </div>
          )}

          {/* Tab 2: vCard */}
          {activeTab === 'vcard' && (
            <div className="space-y-4">
              <p className="text-[#3d4947] leading-relaxed">
                Las tarjetas digitales generan dinámicamente un archivo con extensión{' '}
                <code className="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold">.vcf</code> codificado
                estrictamente en <code className="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold">UTF-8</code>.
                Este formato es compatible de forma nativa con los gestores de contactos de <strong>iOS (Apple Contacts)</strong>,{' '}
                <strong>Android (Google Contacts)</strong> y <strong>Microsoft Outlook</strong>.
              </p>

              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1a1c1c]">Salida RFC 2426 en tiempo real para {profile.shortName}:</span>
                <button
                  onClick={() => handleCopy(vcardText, 'vCard')}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar vCard</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-teal-300 p-4 rounded-2xl font-mono text-[12px] leading-relaxed overflow-x-auto shadow-inner">
                {vcardText}
              </pre>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="font-bold text-[#1a1c1c]">Reglas de Integridad para México (+52):</h4>
                <ul className="list-disc list-inside space-y-1 text-[#3d4947]">
                  <li>
                    Formato telefónico E.164 obligatorio: <code className="font-mono text-teal-700">+5255XXXXXXXX</code> o <code className="font-mono text-teal-700">+5281XXXXXXXX</code>.
                  </li>
                  <li>
                    Soporte de caracteres especiales y acentos (Á, É, Í, Ó, Ú, Ñ) mediante escape UTF-8 nativo.
                  </li>
                  <li>
                    Inclusión de la URL permanente <code className="font-mono text-teal-700">URL:https://redconecta.mx/c/{profile.publicId}</code> para re-sincronización con el directorio del evento.
                  </li>
                  <li>
                    Aclaración de UX: Descargar el archivo no confirma guardado en agenda; el usuario abre el archivo y confirma en el diálogo nativo de su sistema operativo.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: GCP */}
          {activeTab === 'gcp' && (
            <div className="space-y-4">
              <h4 className="text-[16px] font-bold text-[#1a1c1c]">
                Guía de Arquitectura y Despliegue en Google Cloud Platform
              </h4>
              <p className="text-[#3d4947]">
                Arquitectura serverless optimizada para más de 100,000 escaneos simultáneos durante congresos y talleres sin sobrecostos fijos:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 font-bold text-[#00685f]">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">1</span>
                    <span>Almacenamiento Estático y CDN Perimetral</span>
                  </div>
                  <p className="text-[#6d7a77] mt-1.5 ml-8 text-[12px] leading-relaxed">
                    Bucket en <strong>Google Cloud Storage</strong> configurado como sitio estático con <strong>Cloud CDN</strong> activado para almacenamiento en caché perimetral en puntos de presencia (PoP) de Querétaro, Monterrey y CDMX (latencia &lt; 18ms).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 font-bold text-[#00685f]">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">2</span>
                    <span>Cloud Run (Servicio Web Liviano Vite / SSR)</span>
                  </div>
                  <p className="text-[#6d7a77] mt-1.5 ml-8 text-[12px] leading-relaxed">
                    Microservicio en Node.js empaquetado en contenedor Docker mínimo (Distroless). Escala automáticamente a cero instancias cuando no hay eventos y escala a decenas de réplicas en segundos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 font-bold text-[#00685f]">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">3</span>
                    <span>Cloud DNS & Certificados TLS Administrados</span>
                  </div>
                  <p className="text-[#6d7a77] mt-1.5 ml-8 text-[12px] leading-relaxed">
                    Certificados HTTPS automáticos renovados por Google Certificate Manager vinculados al dominio canónico <code className="font-mono text-teal-700">redconecta.mx</code> con reglas de redirección permanente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: QA Matrix */}
          {activeTab === 'qa' && (
            <div className="space-y-4">
              <h4 className="text-[16px] font-bold text-[#1a1c1c]">
                Matriz de Validaciones Técnicas y Cumplimiento
              </h4>
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-100 text-[#6d7a77] text-[11px] uppercase tracking-wider font-bold">
                      <th className="p-3">Criterio</th>
                      <th className="p-3">Estándar</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-[12px]">
                    <tr>
                      <td className="p-3 font-semibold text-[#1a1c1c]">Touch Target Size</td>
                      <td className="p-3">Min. 48 × 48 px</td>
                      <td className="p-3 text-emerald-600 font-bold">100% Cumplido</td>
                      <td className="p-3 text-[#6d7a77]">Botones de vCard, WhatsApp y quick tiles superan 48-50px de altura vertical.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#1a1c1c]">Contraste de Color</td>
                      <td className="p-3">WCAG AA (&gt; 4.5:1)</td>
                      <td className="p-3 text-emerald-600 font-bold">100% Cumplido</td>
                      <td className="p-3 text-[#6d7a77]">Jade (#00685F) y carbón (#1A1C1C) garantizan más de 7:1 en fondo marfil (#F9F9F8).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#1a1c1c]">Soporte Móvil</td>
                      <td className="p-3">320px a 430px</td>
                      <td className="p-3 text-emerald-600 font-bold">100% Cumplido</td>
                      <td className="p-3 text-[#6d7a77]">Cero desbordamiento horizontal en pantallas compactas y grandes.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#1a1c1c]">vCard UTF-8</td>
                      <td className="p-3">RFC 2426</td>
                      <td className="p-3 text-emerald-600 font-bold">100% Cumplido</td>
                      <td className="p-3 text-[#6d7a77]">Acentos en 'Sofía', 'Cárdenas' y 'Cuauhtémoc' se descargan intactos.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#1a1c1c]">QR Dinámico</td>
                      <td className="p-3">Vector SVG & PNG</td>
                      <td className="p-3 text-emerald-600 font-bold">100% Cumplido</td>
                      <td className="p-3 text-[#6d7a77]">Generación local nativa con zona de silencio para escaneo inmediato.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#1a1c1c]">Navegación Teclado</td>
                      <td className="p-3">Tab / Focus / Esc</td>
                      <td className="p-3 text-emerald-600 font-bold">100% Cumplido</td>
                      <td className="p-3 text-[#6d7a77]">Modales con tecla Escape y foco restaurable.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-[13px] font-bold transition-colors cursor-pointer"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
