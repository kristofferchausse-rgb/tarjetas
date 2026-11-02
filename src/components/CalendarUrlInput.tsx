import React, { useState } from 'react';
import {
  Calendar,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface CalendarUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  compact?: boolean;
  className?: string;
}

type ProviderKey = 'google' | 'outlook' | 'calendly' | 'doctoralia';

export const CalendarUrlInput: React.FC<CalendarUrlInputProps> = ({
  value,
  onChange,
  label = 'Enlace para Agendar Citas y Reuniones',
  placeholder = 'https://calendar.app.google/... o https://calendly.com/...',
  helpText,
  compact = false,
  className = ''
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const [activeProvider, setActiveProvider] = useState<ProviderKey>('google');

  // Normalize URL helper
  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.includes('@')) {
      onChange(`https://${trimmed}`);
    }
  };

  // Warnings detection
  const trimmed = value.trim();
  const isPrivateGoogleCalendar =
    trimmed.includes('calendar.google.com/calendar/u/') ||
    trimmed.includes('calendar.google.com/calendar/r') ||
    trimmed === 'https://calendar.google.com' ||
    trimmed === 'https://calendar.google.com/';

  const isPrivateOutlook =
    (trimmed.includes('outlook.live.com/calendar') ||
      trimmed.includes('outlook.office.com/calendar') ||
      trimmed.includes('outlook.office365.com/calendar')) &&
    !trimmed.includes('/book/');

  const isRawEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

  // Formatted URL for the "Test Link" action
  const testUrl = trimmed
    ? trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`
    : '';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header and Label */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] sm:text-xs font-bold text-stone-700 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#00685f]" />
          <span>{label}</span>
          <span className="text-[10px] font-normal text-stone-400">(Opcional)</span>
        </label>
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="text-[11px] font-semibold text-[#00685f] hover:text-[#00524a] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showGuide ? 'Ocultar guía' : '¿Cómo obtener mi enlace?'}</span>
          {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Input Field */}
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-stone-400">
          <Calendar className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full pl-9 pr-20 py-2 bg-stone-50 border rounded-xl text-xs text-stone-800 focus:outline-none transition-colors ${
            isPrivateGoogleCalendar || isPrivateOutlook || isRawEmail
              ? 'border-amber-400 bg-amber-50/30 focus:border-amber-500'
              : 'border-stone-200 focus:border-[#00685f]'
          }`}
        />
        <div className="absolute right-2 top-2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200/50 transition-colors"
              title="Borrar enlace"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {testUrl && !isRawEmail && (
            <a
              href={testUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 text-[10px] font-semibold text-[#00685f] hover:bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              title="Probar en una pestaña nueva"
            >
              <span>Probar</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Warnings & Validation Feedback */}
      {isPrivateGoogleCalendar && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">⚠️ Enlace privado de administración detectado</p>
            <p className="text-[10px] text-amber-800 mt-0.5">
              Pegaste la dirección de tu panel privado de Google Calendar. Tus clientes no podrán reservar citas ahí. En Google Calendar ve a <strong>"+ Crear" ➔ "Programación de citas"</strong> y copia el enlace público que empieza con <code>https://calendar.app.google/...</code>
            </p>
          </div>
        </div>
      )}

      {isPrivateOutlook && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">⚠️ Enlace privado de Outlook detectado</p>
            <p className="text-[10px] text-amber-800 mt-0.5">
              Para recibir reservas públicas en Outlook / Microsoft 365, crea tu página pública en <strong>Calendario ➔ "Crear página de reservas"</strong> (Bookings with me). El enlace empieza con <code>https://outlook.office365.com/book/...</code>
            </p>
          </div>
        </div>
      )}

      {isRawEmail && (
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2 animate-fadeIn">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">💡 Un correo no permite reservar horas automáticamente</p>
            <p className="text-[10px] text-blue-800 mt-0.5">
              Por privacidad, Google y Microsoft no permiten agendar citas solo con tu dirección de correo. Pega el enlace de tu página de reservas de <strong>Google Calendar</strong>, <strong>Outlook Bookings</strong> o <strong>Calendly</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Provider Quick Chips / Help */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[10px] font-semibold text-stone-500">Apps compatibles:</span>
        <button
          type="button"
          onClick={() => {
            setActiveProvider('google');
            setShowGuide(true);
          }}
          className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors border ${
            showGuide && activeProvider === 'google'
              ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
          }`}
        >
          Google Calendar
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveProvider('outlook');
            setShowGuide(true);
          }}
          className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors border ${
            showGuide && activeProvider === 'outlook'
              ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
          }`}
        >
          Outlook 365
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveProvider('calendly');
            setShowGuide(true);
          }}
          className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors border ${
            showGuide && activeProvider === 'calendly'
              ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
          }`}
        >
          Calendly / Cal.com
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveProvider('doctoralia');
            setShowGuide(true);
          }}
          className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors border ${
            showGuide && activeProvider === 'doctoralia'
              ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
          }`}
        >
          Doctoralia
        </button>
      </div>

      {/* Expandable Step-by-Step Guide */}
      {showGuide && (
        <div className="p-3.5 bg-stone-50 border border-teal-200 rounded-xl space-y-2.5 text-stone-700 text-xs mt-2 animate-fadeIn">
          {activeProvider === 'google' && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-teal-900 text-[11px] mb-1">
                <span>🗓️ Google Calendar (Páginas de citas gratuitas)</span>
              </div>
              <p className="text-[11px] text-stone-600 mb-1.5">
                Disponible gratis en cualquier cuenta personal <code>@gmail.com</code> o Google Workspace.
              </p>
              <ol className="text-[11px] space-y-1 list-decimal list-inside text-stone-700">
                <li>
                  Entra a <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="text-[#00685f] underline font-medium">calendar.google.com</a>.
                </li>
                <li>
                  Haz clic en el botón <strong>"+ Crear"</strong> (arriba a la izquierda) y elige <strong>"Programación de citas"</strong>.
                </li>
                <li>
                  Configura tus días y horarios de atención (ej. Lun-Vie 9:00 a 14:00 hrs) y guarda.
                </li>
                <li>
                  Haz clic en <strong>"Compartir"</strong> y copia el enlace público que empieza con <code>https://calendar.app.google/...</code>
                </li>
              </ol>
            </div>
          )}

          {activeProvider === 'outlook' && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-teal-900 text-[11px] mb-1">
                <span>💼 Microsoft Outlook / 365 (Bookings with me)</span>
              </div>
              <p className="text-[11px] text-stone-600 mb-1.5">
                Nativo para usuarios de Microsoft 365 y Outlook empresarial o personal.
              </p>
              <ol className="text-[11px] space-y-1 list-decimal list-inside text-stone-700">
                <li>
                  Entra a <a href="https://outlook.office.com" target="_blank" rel="noreferrer" className="text-[#00685f] underline font-medium">outlook.office.com</a> y dirígete al icono de <strong>Calendario</strong>.
                </li>
                <li>
                  Haz clic en <strong>"Crear página de reservas"</strong> o <strong>"Editar página de reservas"</strong> (*Bookings with me*).
                </li>
                <li>
                  Crea un tipo de reunión pública (ej. Asesoría de 30 min) y copia el enlace de reserva.
                </li>
                <li>
                  El enlace tiene el formato <code>https://outlook.office365.com/book/...</code>
                </li>
              </ol>
            </div>
          )}

          {activeProvider === 'calendly' && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-teal-900 text-[11px] mb-1">
                <span>⚡ Calendly o Cal.com (Universal)</span>
              </div>
              <p className="text-[11px] text-stone-600 mb-1.5">
                La opción más popular y sencilla si utilizas múltiples calendarios (Google, Outlook, iCloud).
              </p>
              <ol className="text-[11px] space-y-1 list-decimal list-inside text-stone-700">
                <li>
                  Crea tu cuenta gratuita en <a href="https://calendly.com" target="_blank" rel="noreferrer" className="text-[#00685f] underline font-medium">calendly.com</a> o <a href="https://cal.com" target="_blank" rel="noreferrer" className="text-[#00685f] underline font-medium">cal.com</a>.
                </li>
                <li>
                  Conecta tu calendario de Google o Outlook en 1 clic.
                </li>
                <li>
                  Copia tu enlace personal de evento (ej. <code>https://calendly.com/tu-nombre</code> o <code>https://cal.com/tu-nombre</code>).
                </li>
              </ol>
            </div>
          )}

          {activeProvider === 'doctoralia' && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-teal-900 text-[11px] mb-1">
                <span>🩺 Doctoralia / Software Médico</span>
              </div>
              <p className="text-[11px] text-stone-600 mb-1.5">
                Ideal para médicos, terapeutas y especialistas con agenda médica en línea.
              </p>
              <ol className="text-[11px] space-y-1 list-decimal list-inside text-stone-700">
                <li>
                  Abre tu perfil público en <a href="https://www.doctoralia.com.mx" target="_blank" rel="noreferrer" className="text-[#00685f] underline font-medium">Doctoralia</a> o tu software de agenda (AgendaPro, Nimbo, etc.).
                </li>
                <li>
                  Copia la URL directa de tu consultorio o botón de agendar.
                </li>
                <li>
                  Pégala aquí para que el botón de tu tarjeta digital diga automáticamente <strong>"Cita Médica"</strong>.
                </li>
              </ol>
            </div>
          )}
        </div>
      )}

      {helpText && !showGuide && (
        <p className="text-[10px] text-stone-400 mt-1">{helpText}</p>
      )}
    </div>
  );
};
