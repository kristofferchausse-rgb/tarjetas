import React from 'react';
import { CardLanguage } from '../utils/i18n';

/**
 * Crisp SVG Mexican Flag (🇲🇽) - Renders reliably across all platforms including Windows
 */
export const MexicoFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    viewBox="0 0 30 20"
    className={`inline-block rounded-[3px] shadow-2xs overflow-hidden shrink-0 border border-black/10 ${className}`}
    aria-label="Bandera de México"
    role="img"
  >
    {/* Green stripe */}
    <rect width="10" height="20" fill="#006847" />
    {/* White stripe */}
    <rect x="10" width="10" height="20" fill="#ffffff" />
    {/* Red stripe */}
    <rect x="20" width="10" height="20" fill="#ce1126" />
    {/* Eagle & Serpent Emblem detail */}
    <ellipse cx="15" cy="10" rx="2.4" ry="2.2" fill="#c49a45" />
    <path d="M 14.5 8.5 Q 15 7.5 15.5 8.5 Q 16 9.5 15 11 Q 14 10.5 14.5 8.5" fill="#5c3818" />
    <circle cx="15" cy="11.2" r="1.2" fill="#2d572c" />
  </svg>
);

/**
 * Crisp SVG United States Flag (🇺🇸) - Renders reliably across all platforms
 */
export const USFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    viewBox="0 0 30 20"
    className={`inline-block rounded-[3px] shadow-2xs overflow-hidden shrink-0 border border-black/10 ${className}`}
    aria-label="United States Flag"
    role="img"
  >
    {/* Red base */}
    <rect width="30" height="20" fill="#b22234" />
    {/* White stripes */}
    <rect y="1.54" width="30" height="1.54" fill="#ffffff" />
    <rect y="4.62" width="30" height="1.54" fill="#ffffff" />
    <rect y="7.70" width="30" height="1.54" fill="#ffffff" />
    <rect y="10.78" width="30" height="1.54" fill="#ffffff" />
    <rect y="13.86" width="30" height="1.54" fill="#ffffff" />
    <rect y="16.94" width="30" height="1.54" fill="#ffffff" />
    {/* Blue Canton */}
    <rect width="13" height="10.78" fill="#3c3b6e" />
    {/* White Star representations */}
    <circle cx="3" cy="2.5" r="0.75" fill="#ffffff" />
    <circle cx="6.5" cy="2.5" r="0.75" fill="#ffffff" />
    <circle cx="10" cy="2.5" r="0.75" fill="#ffffff" />
    <circle cx="4.75" cy="5.4" r="0.75" fill="#ffffff" />
    <circle cx="8.25" cy="5.4" r="0.75" fill="#ffffff" />
    <circle cx="3" cy="8.3" r="0.75" fill="#ffffff" />
    <circle cx="6.5" cy="8.3" r="0.75" fill="#ffffff" />
    <circle cx="10" cy="8.3" r="0.75" fill="#ffffff" />
  </svg>
);

interface LanguageSelectorProps {
  currentLang: CardLanguage;
  onLanguageChange: (lang: CardLanguage) => void;
  className?: string;
  variant?: 'banner' | 'floating' | 'inline';
}

/**
 * Premium bilingual segmented language switcher with Mexican and US flag icons
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
  className = '',
  variant = 'banner'
}) => {
  return (
    <div
      role="group"
      aria-label="Seleccionar idioma / Select language"
      className={`inline-flex items-center p-1 rounded-full bg-slate-950/65 hover:bg-slate-950/80 backdrop-blur-md border border-white/25 shadow-lg transition-all ${className}`}
    >
      {/* Spanish MX Option */}
      <button
        type="button"
        onClick={() => onLanguageChange('es')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-tight transition-all cursor-pointer ${
          currentLang === 'es'
            ? 'bg-white text-stone-900 shadow-sm scale-[1.02]'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
        title="Español (México)"
        aria-pressed={currentLang === 'es'}
      >
        <MexicoFlag />
        <span>ES</span>
        <span className="hidden sm:inline text-[9px] font-semibold text-stone-500 uppercase tracking-wider">MX</span>
      </button>

      {/* English US Option */}
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-tight transition-all cursor-pointer ${
          currentLang === 'en'
            ? 'bg-white text-stone-900 shadow-sm scale-[1.02]'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
        title="English (United States)"
        aria-pressed={currentLang === 'en'}
      >
        <USFlag />
        <span>EN</span>
        <span className="hidden sm:inline text-[9px] font-semibold text-stone-500 uppercase tracking-wider">US</span>
      </button>
    </div>
  );
};
