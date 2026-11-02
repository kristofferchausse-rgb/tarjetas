import React, { useState } from 'react';
import {
  X,
  Send,
  Copy,
  Check,
  MessageCircle,
  Mail,
  User,
  Phone,
  Building,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Smartphone
} from 'lucide-react';

interface InviteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onOpenWizardNow?: () => void;
}

export const InviteClientModal: React.FC<InviteClientModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onOpenWizardNow
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  // Compute onboarding URL
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#alta`
    : 'https://tribucreativaqro.web.app/#alta';

  // Format phone (keep digits)
  const cleanPhone = clientPhone.replace(/\D/g, '');
  const targetPhone = cleanPhone.startsWith('52') ? cleanPhone : cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone;

  // Personalized WhatsApp Message
  const greeting = clientName.trim() ? `¡Hola ${clientName.trim()}!` : '¡Hola!';
  const companyMention = clientCompany.trim() ? ` para ${clientCompany.trim()}` : '';
  
  const whatsappText = `${greeting} 👋
En Tribu Creativa QRO estamos listos para producir tu Tarjeta Digital Ejecutiva con tecnología NFC${companyMention}.

Para personalizar tu tarjeta, por favor completa tus datos de perfil, enlaces, servicios clave y datos de facturación (CFDI 4.0) en este enlace seguro:
👉 ${baseUrl}

🔒 El formulario toma aproximadamente 3 minutos. En cuanto lo envíes, nuestro equipo activará y verificará tu micrositio de inmediato. ¡Quedamos atentos a cualquier duda!`;

  // Email subject & body
  const emailSubject = `Alta de tu Tarjeta Digital Ejecutiva • Tribu Creativa QRO${clientCompany ? ` (${clientCompany})` : ''}`;
  const emailBody = `Estimado/a ${clientName || 'Cliente'},\n\n` +
    `Te damos la bienvenida a Tribu Creativa QRO. Estamos listos para comenzar la personalización de tu Tarjeta Digital Ejecutiva con tecnología NFC.\n\n` +
    `Por favor ingresa al siguiente enlace seguro para capturar tu información profesional, enlaces a redes, soluciones y datos fiscales (CFDI 4.0):\n\n` +
    `${baseUrl}\n\n` +
    `Una vez que recibamos tu información, nuestro equipo de diseño configurará tu tarjeta y coordinará la entrega de tu tarjeta física NFC.\n\n` +
    `Atentamente,\n` +
    `Equipo de Producción • Tribu Creativa QRO\n` +
    `Querétaro, Qro.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopiedLink(true);
    onShowToast('Enlace de alta copiado al portapapeles');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMsg = () => {
    navigator.clipboard.writeText(whatsappText);
    setCopiedMsg(true);
    onShowToast('Mensaje de WhatsApp copiado al portapapeles');
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Asunto: ${emailSubject}\n\n${emailBody}`);
    setCopiedEmail(true);
    onShowToast('Plantilla de correo copiada al portapapeles');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappText);
    const url = targetPhone
      ? `https://wa.me/${targetPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Enviar Formulario de Alta al Cliente</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                  Servicio Concierge
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Genera invitaciones personalizadas con el enlace seguro de autoservicio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Agency Positioning Notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 sm:px-6 py-2.5 flex items-center gap-2.5 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="leading-snug">
            <strong>Privacidad de Agencia:</strong> Este formulario no está expuesto en la página pública general. Solo los clientes con este enlace directo podrán completarlo.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scroll">
          
          {/* 1. Quick Client Personalization */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Personalizar Datos del Cliente (Opcional)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej. Lic. Roberto Garza"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">WhatsApp (10 dígitos)</label>
                <input
                  type="tel"
                  placeholder="442 123 4567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Empresa</label>
                <input
                  type="text"
                  placeholder="Ej. Garza & Asociados"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Direct Safe Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Enlace Directo de Onboarding</span>
              </label>
              <button
                onClick={handleCopyLink}
                className="text-xs font-bold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 bg-stone-100 p-2.5 rounded-xl border border-stone-200">
              <code className="text-xs font-mono text-stone-800 truncate flex-1 select-all">
                {baseUrl}
              </code>
              <a
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white hover:bg-stone-200 text-stone-700 transition-colors"
                title="Probar en nueva pestaña"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 3. WhatsApp Invitation */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mensaje Personalizado de WhatsApp</span>
              </label>
              <button
                onClick={handleCopyMsg}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMsg ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
              {whatsappText}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {targetPhone ? `Abrir WhatsApp para ${clientName || 'Cliente'}` : 'Abrir WhatsApp con Mensaje'}
                </span>
              </button>
              <button
                onClick={handleCopyMsg}
                className="py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Mensaje</span>
              </button>
            </div>
          </div>

          {/* 4. Email Alternative */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Plantilla de Correo Electrónico</span>
              </label>
              <button
                onClick={handleCopyEmail}
                className="text-xs font-bold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? '¡Copiado!' : 'Copiar Correo'}</span>
              </button>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
              <p><strong>Asunto:</strong> {emailSubject}</p>
              <p className="text-stone-500 text-[11px]">Listo para pegar en Gmail, Outlook o enviar por CRM.</p>
            </div>
          </div>

          {/* 5. Direct Admin Capture Option */}
          {onOpenWizardNow && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#00685f]">
                  ¿Prefieres capturar los datos tú mismo/a en llamada?
                </p>
                <p className="text-[11px] text-stone-600">
                  Puedes abrir el formulario en este momento y registrar al cliente en vivo.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenWizardNow();
                }}
                className="px-4 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Llenar Formulario Ahora</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-5 sm:px-6 py-3.5 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
