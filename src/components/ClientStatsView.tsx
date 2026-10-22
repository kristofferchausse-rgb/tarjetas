import React from 'react';
import { ParticipantProfile } from '../types/card';
import { getStoredStats, getStoredEvents } from '../utils/analytics';
import {
  Eye,
  Download,
  MessageCircle,
  Share2,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  Home
} from 'lucide-react';

interface ClientStatsViewProps {
  profile: ParticipantProfile;
  onBackToCard: () => void;
  onBackHome?: () => void;
}

export const ClientStatsView: React.FC<ClientStatsViewProps> = ({
  profile,
  onBackToCard,
  onBackHome
}) => {
  const stats = getStoredStats();
  const cardStats = stats[profile.publicId] || {
    publicId: profile.publicId,
    views: 1,
    qrScans: 1,
    shares: 0,
    vcardDownloads: 0,
    whatsappClicks: 0,
    callClicks: 0,
    emailClicks: 0,
    calendarClicks: 0,
    linkClicks: 0,
    videoPlays: 0,
    lastActive: new Date().toISOString()
  };

  const totalInteractions =
    cardStats.vcardDownloads +
    cardStats.whatsappClicks +
    cardStats.shares +
    cardStats.linkClicks;

  const conversionRate =
    cardStats.views > 0
      ? (((cardStats.vcardDownloads + cardStats.whatsappClicks) / cardStats.views) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen bg-[#f0f2f1] flex flex-col items-center p-4 sm:p-6 text-[#1a1c1c] antialiased">
      <div className="w-full max-w-lg space-y-4">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver mi Tarjeta</span>
            </button>
            {onBackHome && (
              <button
                onClick={onBackHome}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-600 text-xs font-semibold border border-stone-200 shadow-2xs transition-all cursor-pointer"
                title="Volver a la página principal"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inicio</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00685f]">
            <ShieldCheck className="w-4 h-4" />
            <span>Métricas Privadas</span>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-extrabold text-[#1a1c1c] truncate">{profile.name}</h1>
            <p className="text-xs text-[#00685f] font-semibold truncate">{profile.role}</p>
            <p className="text-[11px] text-stone-500 truncate">{profile.company}</p>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Vistas */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Vistas / Escaneos
              </span>
              <Eye className="w-4 h-4 text-[#00685f]" />
            </div>
            <p className="text-2xl font-black text-stone-900">{cardStats.views}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">
              {cardStats.qrScans} por código QR
            </p>
          </div>

          {/* Card 2: vCards Descargadas */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                vCards Guardadas
              </span>
              <Download className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{cardStats.vcardDownloads}</p>
            <p className="text-[10px] text-stone-500 mt-1">Guardadas en agenda</p>
          </div>

          {/* Card 3: Clics a WhatsApp */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Contactos WhatsApp
              </span>
              <MessageCircle className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{cardStats.whatsappClicks}</p>
            <p className="text-[10px] text-stone-500 mt-1">Conversaciones abiertas</p>
          </div>

          {/* Card 4: Conversión */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Conversión Total
              </span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{conversionRate}%</p>
            <p className="text-[10px] text-stone-500 mt-1">De vistas a contacto</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Detalle de Interacciones
          </h2>
          <div className="divide-y divide-stone-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-600">Compartidas por WhatsApp</span>
              <span className="font-bold text-stone-900">{cardStats.shares}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-600">Clics a Enlaces seleccionados</span>
              <span className="font-bold text-stone-900">{cardStats.linkClicks}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-600">Última actividad registrada</span>
              <span className="font-mono text-[11px] text-stone-500">
                {cardStats.lastActive ? new Date(cardStats.lastActive).toLocaleDateString() : 'Hoy'}
              </span>
            </div>
          </div>
        </div>

        {/* Support & Updates Banner */}
        <div className="p-4 rounded-2xl bg-stone-900 text-white text-center space-y-2">
          <p className="text-xs font-bold text-teal-300">
            ¿Necesitas actualizar tus datos, teléfono o foto?
          </p>
          <p className="text-[11px] text-stone-300">
            Solicita cambios a tu ejecutivo de <strong>Tribu Creativa QRO</strong> directamente por WhatsApp.
          </p>
          <div className="pt-1">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hola Tribu Creativa QRO, soy ${profile.name} y me gustaría actualizar los datos de mi tarjeta digital ejecutiva (/c/${profile.publicId}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contactar a Tribu Creativa</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 text-[10px] text-stone-400">
          Tribu Creativa QRO • Panel de Estadísticas para Clientes
        </div>
      </div>
    </div>
  );
};
