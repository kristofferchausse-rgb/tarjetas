import React, { useState, useEffect } from 'react';
import { ParticipantProfile, FiscalDataCFDI } from '../types/card';
import { generateQRCodeAssets } from '../utils/qr';
import {
  X,
  Send,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Sparkles,
  ReceiptText,
  Building2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Save,
  HelpCircle
} from 'lucide-react';

interface ClientDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onShowToast: (msg: string) => void;
  onUpdateProfile?: (updated: ParticipantProfile) => void;
}

const REGIMENES_SAT = [
  { code: '601', label: '601 - General de Ley Personas Morales' },
  { code: '612', label: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
  { code: '626', label: '626 - Régimen Simplificado de Confianza (RESICO)' },
  { code: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { code: '606', label: '606 - Arrendamiento' },
  { code: '625', label: '625 - Actividades Empresariales con Plataformas Tecnológicas' },
  { code: '603', label: '603 - Personas Morales con Fines no Lucrativos' },
  { code: '616', label: '616 - Sin obligaciones fiscales' }
];

const USOS_CFDI = [
  { code: 'G03', label: 'G03 - Gastos en general (Recomendado)' },
  { code: 'CP01', label: 'CP01 - Pagos' },
  { code: 'S01', label: 'S01 - Sin efectos fiscales' },
  { code: 'G01', label: 'G01 - Adquisición de mercancías' }
];

const FORMAS_PAGO = [
  { code: '03', label: '03 - Transferencia electrónica de fondos (SPEI)' },
  { code: '04', label: '04 - Tarjeta de crédito' },
  { code: '28', label: '28 - Tarjeta de débito' },
  { code: '01', label: '01 - Efectivo' }
];

export const ClientDeliveryModal: React.FC<ClientDeliveryModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'kit' | 'cfdi'>('kit');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedFiscalFicha, setCopiedFiscalFicha] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // CFDI 4.0 Form State
  const [requiresInvoice, setRequiresInvoice] = useState<boolean>(
    profile.fiscalData?.requiresInvoice ?? false
  );
  const [rfc, setRfc] = useState<string>(profile.fiscalData?.rfc ?? '');
  const [razonSocial, setRazonSocial] = useState<string>(
    profile.fiscalData?.razonSocial ?? profile.company ?? ''
  );
  const [codigoPostal, setCodigoPostal] = useState<string>(
    profile.fiscalData?.codigoPostal ?? ''
  );
  const [regimenFiscal, setRegimenFiscal] = useState<string>(
    profile.fiscalData?.regimenFiscal ?? '612'
  );
  const [usoCFDI, setUsoCFDI] = useState<string>(
    profile.fiscalData?.usoCFDI ?? 'G03'
  );
  const [emailFacturacion, setEmailFacturacion] = useState<string>(
    profile.fiscalData?.emailFacturacion ?? profile.email ?? ''
  );
  const [formaPago, setFormaPago] = useState<string>(
    profile.fiscalData?.formaPago ?? '03'
  );

  const cardUrl = `${window.location.origin}/c/${profile.publicId}`;

  const deliveryMessage = `¡Hola ${profile.name}! 🚀\n\nTe compartimos el enlace oficial de tu nueva Tarjeta Digital Ejecutiva diseñada por Tribu Creativa QRO:\n👉 ${cardUrl}\n\nIncluye tu kit ejecutivo completo:\n• Tarjeta digital interactiva y guardado de vCard directo en agenda\n• Intercambio de contactos (Mini-CRM privado con tus prospectos)\n• Generador de fondo de pantalla para celular con tu código QR\n• Firma de correo electrónico HTML con tu foto y enlace\n• Panel de estadísticas privadas (/c/${profile.publicId}?stats=true)\n\n¡Mucho éxito en tus conexiones empresariales! ✨\n— Tribu Creativa QRO`;

  useEffect(() => {
    if (isOpen) {
      generateQRCodeAssets(cardUrl).then((res) => {
        setQrDataUrl(res.pngDataUrl);
      });
      // Sync fiscal data if profile changes
      setRequiresInvoice(profile.fiscalData?.requiresInvoice ?? false);
      setRfc(profile.fiscalData?.rfc ?? '');
      setRazonSocial(profile.fiscalData?.razonSocial ?? profile.company ?? '');
      setCodigoPostal(profile.fiscalData?.codigoPostal ?? '');
      setRegimenFiscal(profile.fiscalData?.regimenFiscal ?? '612');
      setUsoCFDI(profile.fiscalData?.usoCFDI ?? 'G03');
      setEmailFacturacion(profile.fiscalData?.emailFacturacion ?? profile.email ?? '');
      setFormaPago(profile.fiscalData?.formaPago ?? '03');
    }
  }, [isOpen, cardUrl, profile]);

  if (!isOpen) return null;

  // RFC Real-time Validation (Mexican SAT standard: 12 chars Moral, 13 chars Física)
  const cleanRfc = rfc.trim().toUpperCase();
  const isRfcValid =
    cleanRfc.length === 0 ||
    /^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i.test(
      cleanRfc
    );
  const isCpValid = codigoPostal.trim().length === 0 || /^[0-9]{5}$/.test(codigoPostal.trim());

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopiedLink(true);
      onShowToast('Enlace de la tarjeta copiado al portapapeles.');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      onShowToast('No se pudo copiar el enlace.');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(deliveryMessage);
      setCopiedMessage(true);
      onShowToast('Mensaje de entrega copiado con éxito.');
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      onShowToast('No se pudo copiar el mensaje.');
    }
  };

  const handleSendToClientWhatsApp = () => {
    const cleanPhone = profile.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(deliveryMessage);
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onShowToast(`Abriendo WhatsApp para enviar tarjeta a ${profile.shortName}...`);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-TribuCreativa-${profile.publicId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Código QR de ${profile.shortName} descargado en PNG.`);
  };

  const handleSaveFiscalData = () => {
    if (requiresInvoice && cleanRfc && !isRfcValid) {
      onShowToast('El formato del RFC no es válido conforme a la estructura del SAT.');
      return;
    }
    if (requiresInvoice && codigoPostal && !isCpValid) {
      onShowToast('El Código Postal fiscal debe contener exactamente 5 dígitos numéricos.');
      return;
    }

    const updatedFiscal: FiscalDataCFDI = {
      requiresInvoice,
      rfc: cleanRfc,
      razonSocial: razonSocial.trim().toUpperCase(),
      codigoPostal: codigoPostal.trim(),
      regimenFiscal,
      usoCFDI,
      emailFacturacion: emailFacturacion.trim(),
      formaPago,
      claveSatProducto: '82101603', // Publicidad en internet
      claveSatUnidad: 'E48', // Unidad de servicio
      updatedAt: new Date().toISOString()
    };

    const updatedProfile: ParticipantProfile = {
      ...profile,
      fiscalData: updatedFiscal
    };

    if (onUpdateProfile) {
      onUpdateProfile(updatedProfile);
    }

    onShowToast('Datos de facturación CFDI 4.0 guardados con éxito.');
  };

  const handleCopyFiscalFicha = async () => {
    const regimenLabel = REGIMENES_SAT.find((r) => r.code === regimenFiscal)?.label || regimenFiscal;
    const usoLabel = USOS_CFDI.find((u) => u.code === usoCFDI)?.label || usoCFDI;
    const formaLabel = FORMAS_PAGO.find((f) => f.code === formaPago)?.label || formaPago;

    const fichaText =
      `DATOS DE FACTURACIÓN CFDI 4.0 (SAT MÉXICO)\n\n` +
      `• Titular: ${profile.name}\n` +
      `• Razón Social: ${razonSocial.trim().toUpperCase() || 'Sin especificar'}\n` +
      `• RFC: ${cleanRfc || 'Sin especificar'}\n` +
      `• Código Postal Fiscal: ${codigoPostal.trim() || 'Sin especificar'}\n` +
      `• Régimen Fiscal: ${regimenLabel}\n` +
      `• Uso de CFDI: ${usoLabel}\n` +
      `• Correo para Envío de Factura: ${emailFacturacion.trim() || profile.email}\n` +
      `• Forma de Pago: ${formaLabel}\n\n` +
      `GUÍA TÉCNICA DE EMISIÓN:\n` +
      `• Clave SAT Producto: 82101603 (Servicios de publicidad en internet)\n` +
      `• Clave SAT Unidad: E48 (Unidad de servicio)\n` +
      `• Objeto de Impuesto: 02 (Sí objeto de impuesto - IVA 16%)\n` +
      `• Concepto: Alojamiento anual de Tarjeta Digital Ejecutiva Tribu Creativa QRO`;

    try {
      await navigator.clipboard.writeText(fichaText);
      setCopiedFiscalFicha(true);
      onShowToast('Ficha de facturación CFDI 4.0 copiada al portapapeles.');
      setTimeout(() => setCopiedFiscalFicha(false), 2500);
    } catch {
      onShowToast('No se pudo copiar la ficha.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-[#00685f] to-emerald-600" />

        {/* Modal Top Header */}
        <div className="p-5 pb-3 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00685f] border border-teal-200 flex items-center justify-center shadow-xs shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-[#1a1c1c]">Gestión de Entrega y Facturación</h3>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 text-[#00685f]">
                  Tribu Creativa
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Cliente: <strong>{profile.name}</strong> ({profile.company})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50/50 px-5 gap-2">
          <button
            onClick={() => setActiveTab('kit')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kit'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Kit de Entrega Cliente</span>
          </button>
          <button
            onClick={() => setActiveTab('cfdi')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cfdi'
                ? 'border-[#00685f] text-[#00685f]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Facturación CFDI 4.0 (SAT)</span>
            {requiresInvoice && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Requiere factura" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: KIT DE ENTREGA */}
          {activeTab === 'kit' && (
            <div className="space-y-4">
              {/* Card Link Preview Bar */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-2">
                <div className="truncate text-xs font-mono text-stone-700">
                  <span className="text-stone-400 select-none">URL: </span>
                  <span className="font-semibold text-[#00685f]">{cardUrl}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <a
                    href={cardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors"
                    title="Abrir tarjeta en pestaña nueva"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* WhatsApp Rich Link Preview Simulation */}
              <div className="bg-[#f0fdf4] rounded-2xl p-3.5 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-950">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vista Previa en WhatsApp al Compartir</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Personalizado 100%
                  </span>
                </div>

                <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-2xs flex">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-stone-100 overflow-hidden relative border-r border-stone-100">
                    <img
                      src={
                        profile.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
                      }
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5 flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {profile.name} • {profile.role}
                    </h4>
                    <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5 leading-snug">
                      {profile.seoDescription || profile.valueProp || `${profile.role} en ${profile.company}.`}
                    </p>
                    <span className="text-[10px] font-mono text-stone-400 mt-1">
                      tribucreativaqro.web.app
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-800 mt-2 leading-relaxed">
                  ✨ <strong>Confirmado:</strong> WhatsApp muestra directamente la foto personal de {profile.shortName || profile.name} y su propuesta de valor.
                </p>
              </div>

              {/* Quick QR & Info Row */}
              <div className="flex items-center gap-4 p-3 bg-teal-50/50 rounded-2xl border border-teal-100">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR ${profile.shortName}`}
                    className="w-20 h-20 rounded-xl border border-teal-200 bg-white p-1 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-white border border-teal-200 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-stone-400">QR</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-800">Código QR Oficial de Alta Resolución</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    Listo para imprimir en papelería, folletos o para que el cliente lo guarde en la galería de su teléfono.
                  </p>
                  <button
                    onClick={handleDownloadQR}
                    className="mt-2 px-3 py-1 bg-white hover:bg-stone-50 text-[#00685f] border border-teal-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Descargar PNG</span>
                  </button>
                </div>
              </div>

              {/* Pre-formatted WhatsApp Message Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Mensaje de Entrega para WhatsApp
                  </label>
                  <button
                    onClick={handleCopyMessage}
                    className="text-xs font-bold text-[#00685f] hover:text-[#008378] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMessage ? 'Copiado' : 'Copiar texto'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={deliveryMessage}
                  className="w-full text-xs font-sans p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleSendToClientWhatsApp}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar por WhatsApp al Cliente ({profile.shortName})</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DATOS FISCALES CFDI 4.0 */}
          {activeTab === 'cfdi' && (
            <div className="space-y-4">
              {/* Header Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-start justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-white">Facturación Fiscal en México (CFDI 4.0)</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Registra los datos fiscales de {profile.name} para emitir factura deducible como gasto de publicidad o tecnología.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none shrink-0 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={requiresInvoice}
                    onChange={(e) => setRequiresInvoice(e.target.checked)}
                    className="w-4 h-4 text-[#00685f] rounded border-slate-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-teal-300">Requiere Factura</span>
                </label>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      RFC (12 o 13 caracteres) *
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      placeholder="Ej. XAXX010101000"
                      value={rfc}
                      onChange={(e) => setRfc(e.target.value.toUpperCase())}
                      className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs font-mono uppercase focus:outline-none ${
                        !isRfcValid
                          ? 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-stone-200 text-stone-800 focus:border-[#00685f]'
                      }`}
                    />
                    {!isRfcValid && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Formato de RFC no válido ante el SAT</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Código Postal Fiscal (5 dígitos) *
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="Ej. 76000"
                      value={codigoPostal}
                      onChange={(e) => setCodigoPostal(e.target.value.replace(/[^0-9]/g, ''))}
                      className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs font-mono focus:outline-none ${
                        !isCpValid
                          ? 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-stone-200 text-stone-800 focus:border-[#00685f]'
                      }`}
                    />
                    {!isCpValid && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>El C.P. debe tener exactamente 5 números</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-stone-700">
                      Nombre o Razón Social (CFDI 4.0) *
                    </label>
                    <span className="text-[10px] text-stone-400">Sin régimen societario</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Tal como figura en la Constancia de Situación Fiscal"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase focus:outline-none focus:border-[#00685f]"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Importante SAT: En CFDI 4.0 no se debe incluir el sufijo de régimen (ej. omitir S.A. de C.V., S.C., etc.).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Régimen Fiscal (SAT) *
                    </label>
                    <select
                      value={regimenFiscal}
                      onChange={(e) => setRegimenFiscal(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    >
                      {REGIMENES_SAT.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Uso de CFDI *
                    </label>
                    <select
                      value={usoCFDI}
                      onChange={(e) => setUsoCFDI(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    >
                      {USOS_CFDI.map((u) => (
                        <option key={u.code} value={u.code}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Correo para Envío de Factura (.XML y .PDF)
                    </label>
                    <input
                      type="email"
                      placeholder="facturacion@empresa.com"
                      value={emailFacturacion}
                      onChange={(e) => setEmailFacturacion(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Forma de Pago Prevista
                    </label>
                    <select
                      value={formaPago}
                      onChange={(e) => setFormaPago(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
                    >
                      {FORMAS_PAGO.map((f) => (
                        <option key={f.code} value={f.code}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Guía Contable SAT Box */}
              <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 text-stone-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <CreditCard className="w-3.5 h-3.5 text-teal-700" />
                  <span>Guía para Emisión en Facturador / SAT</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-stone-600 font-mono mt-1">
                  <div className="p-1.5 bg-white rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-sans">Clave Producto SAT</span>
                    <strong>82101603</strong> (Publicidad)
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-sans">Clave Unidad SAT</span>
                    <strong>E48</strong> (Unidad Servicio)
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-stone-200 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-stone-400 block font-sans">Impuesto Trasladado</span>
                    <strong>IVA 16% (Objeto 02)</strong>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSaveFiscalData}
                  className="flex-1 py-2.5 px-4 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Datos Fiscales</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyFiscalFicha}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedFiscalFicha ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedFiscalFicha ? 'Ficha Copiada' : 'Copiar Ficha Contable'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
