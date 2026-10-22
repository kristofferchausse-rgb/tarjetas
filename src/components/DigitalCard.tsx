import React, { useState } from 'react';
import { ParticipantProfile, CardTheme } from '../types/card';
import {
  UserCheck,
  UserPlus,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  MapPin,
  Quote,
  CheckCircle2,
  Bookmark,
  QrCode,
  Globe,
  FileText,
  Briefcase,
  Layers,
  ArrowRight,
  Play,
  Video,
  Pause,
  Lock,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Github,
  Sparkles,
  ArrowUpRight,
  Share2
} from 'lucide-react';
import { getViralSharePayload, AGENCY_NAME, AGENCY_URL } from '../utils/seo';
import { LeadCaptureModal } from './LeadCaptureModal';
import { LanguageSelector } from './FlagIcons';
import { CardLanguage, CARD_TRANSLATIONS, SAMPLE_PROFILE_TRANSLATIONS } from '../utils/i18n';
import { formatVideoEmbedUrl, getVideoThumbnail } from '../utils/video';

interface DigitalCardProps {
  profile: ParticipantProfile;
  activeTheme?: CardTheme;
  onOpenQR: () => void;
  onDownloadVCard: () => void;
  isStandalone?: boolean;
  onShowToast?: (msg: string) => void;
}

export const DigitalCard: React.FC<DigitalCardProps> = ({
  profile,
  activeTheme,
  onOpenQR,
  onDownloadVCard,
  isStandalone = false,
  onShowToast
}) => {
  const currentTheme = activeTheme || profile.themeKey;
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [lang, setLang] = useState<CardLanguage>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const l = urlParams.get('lang');
      if (l === 'en' || l === 'es') return l;
      try {
        const saved = localStorage.getItem('card_lang');
        if (saved === 'en' || saved === 'es') return saved;
      } catch {}
    }
    return 'es';
  });

  const handleLanguageChange = (newLang: CardLanguage) => {
    setLang(newLang);
    try {
      localStorage.setItem('card_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {}
  };

  const t = CARD_TRANSLATIONS[lang] || CARD_TRANSLATIONS.es;

  // Localized fields for known profiles or custom profile translations
  const sampleTrans = lang === 'en' ? SAMPLE_PROFILE_TRANSLATIONS[profile.publicId] : undefined;
  const displayRole = (lang === 'en' && sampleTrans?.role) || profile.role;
  const displayCity = (lang === 'en' && sampleTrans?.city) || profile.city;
  const displayValueProp = (lang === 'en' && sampleTrans?.valueProp) || profile.valueProp;
  const displayStatus = (lang === 'en' && t.statusMap[profile.status]) || profile.status;
  const displaySolutions = (lang === 'en' && sampleTrans?.solutions) || profile.solutions;
  const displayNetworkingTargets = (lang === 'en' && sampleTrans?.networkingTargets) || profile.networkingTargets;

  // Theme-specific styling tokens
  const getThemeStyles = () => {
    switch (currentTheme) {
      case 'ejecutivo':
        return {
          bannerGradient: 'from-slate-900 via-slate-800 to-slate-950',
          roleColor: 'text-slate-900',
          primaryBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
          accentBadge: 'bg-slate-100 text-slate-800 border-slate-200',
          dotColor: 'bg-teal-600',
          indicatorColor: 'text-[#00685f]'
        };
      case 'negocio':
        return {
          bannerGradient: 'from-emerald-950 via-teal-900 to-emerald-900',
          roleColor: 'text-[#00685f]',
          primaryBtn: 'bg-[#00685f] hover:bg-[#008378] text-white',
          accentBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotColor: 'bg-emerald-500',
          indicatorColor: 'text-emerald-700'
        };
      case 'personal':
        return {
          bannerGradient: 'from-stone-900 via-amber-950 to-orange-950',
          roleColor: 'text-[#ac3400]',
          primaryBtn: 'bg-[#ac3400] hover:bg-[#c2410c] text-white',
          accentBadge: 'bg-orange-50 text-orange-800 border-orange-200',
          dotColor: 'bg-orange-500',
          indicatorColor: 'text-[#ac3400]'
        };
      default:
        return {
          bannerGradient: 'from-slate-900 via-slate-800 to-slate-950',
          roleColor: 'text-slate-900',
          primaryBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
          accentBadge: 'bg-slate-100 text-slate-800 border-slate-200',
          dotColor: 'bg-teal-600',
          indicatorColor: 'text-[#00685f]'
        };
    }
  };

  const theme = getThemeStyles();

  // Custom primary color override if provided
  const customButtonStyle = profile.customPrimaryColor
    ? { backgroundColor: profile.customPrimaryColor }
    : undefined;

  // WhatsApp link preparation
  const cleanPhone = profile.phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(
    profile.whatsappCustomMessage ||
      `Hola ${profile.shortName}, vi tu tarjeta digital en RedConecta MX y me gustaría conectar.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const handleQuickShare = async () => {
    const payload = getViralSharePayload(profile);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(payload.nativeShareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(payload.whatsappText)}`, '_blank');
        }
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(payload.whatsappText)}`, '_blank');
    }
  };

  // Helper icon selector for curated links
  const renderLinkIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar_month':
      case 'calendar':
      case 'agenda':
        return <Calendar className="w-5 h-5" />;
      case 'menu_book':
      case 'description':
      case 'file':
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'photo_library':
      case 'auto_stories':
      case 'layers':
      case 'catalogo':
      case 'galeria':
        return <Layers className="w-5 h-5" />;
      case 'language':
      case 'globe':
      case 'web':
        return <Globe className="w-5 h-5" />;
      case 'store':
      case 'domain':
      case 'briefcase':
      case 'visita':
      case 'taller':
        return <Briefcase className="w-5 h-5" />;
      case 'camera_alt':
      case 'camera':
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'video':
      case 'play':
      case 'youtube':
        return <Video className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`w-full max-w-[480px] mx-auto bg-[#f9f9f8] text-[#1a1c1c] ${
        isStandalone
          ? 'min-h-screen shadow-xl border border-stone-200/80 rounded-none sm:rounded-3xl my-0 sm:my-6 overflow-hidden'
          : ''
      } flex flex-col relative`}
    >
      {/* 1. Header Banner / Cover Image */}
      <div className={`h-32 w-full bg-gradient-to-r ${theme.bannerGradient} relative shrink-0 overflow-hidden`}>
        {profile.bannerImageUrl ? (
          <img
            src={profile.bannerImageUrl}
            alt="Portada personalizada"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-65"
          />
        ) : (
          <div className="absolute inset-0 bg-white/5 opacity-40"></div>
        )}

        {/* Agency Tag on Left */}
        <div className="absolute top-2.5 left-3 sm:left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white/90 text-[11px] font-semibold border border-white/15 shadow-sm">
          <Bookmark className="w-3.5 h-3.5 text-teal-300" />
          <span>Tribu Creativa</span>
        </div>

        {/* Bilingual Language Selector on Right */}
        <div className="absolute top-2 right-3 sm:right-4 z-20">
          <LanguageSelector currentLang={lang} onLanguageChange={handleLanguageChange} />
        </div>
      </div>

      {/* 2. Main Identity Body */}
      <div className="px-5 -mt-12 relative z-10 pb-28">
        {/* Avatar, Company Logo & Availability Badge */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.avatarAlt}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-[#f9f9f8] shadow-md bg-stone-200"
              loading="eager"
            />
            {profile.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-[#00685f] text-white rounded-full p-1 border-2 border-[#f9f9f8] flex items-center justify-center shadow-xs"
                title={lang === 'en' ? 'Verified Card by Tribu Creativa QRO' : 'Tarjeta Verificada por Tribu Creativa QRO'}
              >
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Availability Badge */}
          {displayStatus && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border shadow-xs ${theme.accentBadge}`}
            >
              <span className={`w-2 h-2 rounded-full ${theme.dotColor} animate-pulse`} />
              <span>{displayStatus}</span>
            </span>
          )}
        </div>

        {/* Name, Titles & Company with Logo */}
        <div className="mt-3.5">
          <h1 className="text-[22px] sm:text-[24px] font-extrabold tracking-tight leading-tight text-[#1a1c1c]">
            {profile.name}
          </h1>
          <p
            className={`text-[13px] sm:text-[14px] font-bold mt-0.5 ${theme.roleColor}`}
            style={profile.customPrimaryColor ? { color: profile.customPrimaryColor } : undefined}
          >
            {displayRole}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[#3d4947] text-[12px] sm:text-[13px]">
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt={`Logo de ${profile.company}`}
                className="w-4 h-4 rounded-full object-cover border border-stone-300 shadow-2xs"
              />
            )}
            <span className="font-medium">{profile.company}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-0.5 text-[#6d7a77]">
              <MapPin className="w-3.5 h-3.5 text-[#6d7a77]" />
              <span>{displayCity}</span>
            </span>
          </div>
        </div>

        {/* Value Proposition Card */}
        {displayValueProp && (
          <div className="mt-4 p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs relative">
            <Quote className="w-5 h-5 text-stone-300 absolute top-2 right-2.5" />
            <p className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold mb-1">
              {t.valuePropLabel}
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#1a1c1c] font-medium leading-snug pr-4">
              "{displayValueProp}"
            </p>
          </div>
        )}

        {/* Intro Video Pitch Player */}
        {profile.introVideo && profile.introVideo.url && (
          (() => {
            const videoThumbnail = getVideoThumbnail(profile.introVideo.url, profile.introVideo.thumbnailUrl);
            const embedUrl = formatVideoEmbedUrl(profile.introVideo.url, true);

            return (
              <div className="mt-4 rounded-2xl bg-stone-900 overflow-hidden border border-stone-300/80 shadow-xs">
                {isPlayingVideo ? (
                  <div className="relative pt-[56.25%] w-full bg-black">
                    <iframe
                      src={embedUrl}
                      title={profile.introVideo.title || t.introPitch}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => setIsPlayingVideo(true)}
                    className="relative h-44 w-full bg-stone-900 group cursor-pointer overflow-hidden flex flex-col justify-between p-4"
                  >
                    {videoThumbnail ? (
                      <img
                        src={videoThumbnail}
                        alt={profile.introVideo.title || 'Video cover'}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-teal-950" />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

                    {/* Top Duration Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                        <Video className="w-3 h-3 text-teal-400" />
                        <span>{t.introPitch}</span>
                      </span>
                      {profile.introVideo.duration && (
                        <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                          {profile.introVideo.duration}
                        </span>
                      )}
                    </div>

                    {/* Center Play Button */}
                    <div className="relative z-10 mx-auto w-12 h-12 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-all">
                      <Play className="w-5 h-5 ml-0.5 text-[#00685f] fill-[#00685f]" />
                    </div>

                    {/* Bottom Title */}
                    <div className="relative z-10">
                      <p className="text-white text-[13px] font-bold drop-shadow leading-snug">
                        {profile.introVideo.title}
                      </p>
                      <p className="text-white/80 text-[11px] drop-shadow">{t.tapToPlay}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}

        {/* Primary Action Touch Targets */}
        <div className="mt-4 space-y-2.5">
          {/* Primary CTA: Save Contact */}
          <button
            onClick={onDownloadVCard}
            style={customButtonStyle}
            className={`w-full min-h-[50px] ${
              profile.customPrimaryColor ? 'text-white' : theme.primaryBtn
            } rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer`}
          >
            <UserPlus className="w-5 h-5" />
            <span>{t.saveContact}</span>
          </button>

          {/* Secondary CTA: WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.chatWhatsapp}</span>
          </a>
        </div>

        {/* Quick Action Tiles (Llamar, Correo, Agendar) */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="min-h-[48px] py-2 flex flex-col items-center justify-center rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 text-[#1a1c1c] active:scale-95 transition-all shadow-2xs"
            >
              <Phone className="w-4 h-4 text-[#00685f]" />
              <span className="text-[11px] font-semibold mt-0.5">{t.call}</span>
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="min-h-[48px] py-2 flex flex-col items-center justify-center rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 text-[#1a1c1c] active:scale-95 transition-all shadow-2xs"
            >
              <Mail className="w-4 h-4 text-[#ac3400]" />
              <span className="text-[11px] font-semibold mt-0.5">{t.email}</span>
            </a>
          )}
          {profile.calendarUrl && (
            <a
              href={profile.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] py-2 flex flex-col items-center justify-center rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 text-[#1a1c1c] active:scale-95 transition-all shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-slate-700" />
              <span className="text-[11px] font-semibold mt-0.5">{t.schedule}</span>
            </a>
          )}
        </div>

        {/* Social Media Channels Strip */}
        {((profile.socialLinks && Object.values(profile.socialLinks).some(Boolean)) || profile.websiteUrl) && (
          <div className="mt-4 pt-3.5 border-t border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold">
                {t.socialChannels}
              </span>
              <span className="text-[10px] text-stone-500 font-semibold">{t.verifiedProfiles}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-sky-50 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-sky-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-[#e4405f] hover:text-white border border-pink-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-[#1877f2] text-[#1877f2] hover:text-white border border-blue-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="X (Twitter)"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.youtube && (
                <a
                  href={profile.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-red-50 hover:bg-[#ff0000] text-[#ff0000] hover:text-white border border-red-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-800 text-stone-800 hover:text-white border border-stone-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-teal-50 hover:bg-teal-700 text-teal-700 hover:text-white border border-teal-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="Sitio Web Oficial"
                  aria-label="Sitio Web Oficial"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Section C: Solutions */}
        {displaySolutions && displaySolutions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold mb-2.5">
              {t.solutionsLabel}
            </h2>
            <div className="space-y-2">
              {displaySolutions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-stone-200/80 hover:border-teal-500/40 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full bg-[#00685f] shrink-0"
                      style={
                        profile.customPrimaryColor ? { backgroundColor: profile.customPrimaryColor } : undefined
                      }
                    />
                    <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1c1c]">{item.title}</h3>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-[#3d4947] mt-1 pl-4 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section D: Networking Targets */}
        {displayNetworkingTargets && displayNetworkingTargets.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold mb-2.5">
              {t.networkingLabel}
            </h2>
            <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 space-y-2.5 shadow-2xs">
              {displayNetworkingTargets.map((target, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5"
                    style={profile.customPrimaryColor ? { color: profile.customPrimaryColor } : undefined}
                  />
                  <p className="text-[12px] sm:text-[13px] text-[#1a1c1c] leading-snug">{target}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section E: Featured Links */}
        {profile.links && profile.links.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold mb-2.5">
              {t.featuredLinksLabel}
            </h2>
            <div className="space-y-2">
              {profile.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[52px] p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 group transition-all active:scale-[0.99] shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-[#00685f] group-hover:bg-[#00685f] group-hover:text-white transition-colors"
                      style={
                        profile.customPrimaryColor ? { color: profile.customPrimaryColor } : undefined
                      }
                    >
                      {renderLinkIcon(link.icon)}
                    </div>
                    <div>
                      <span className="text-[13px] sm:text-[14px] font-semibold text-[#1a1c1c] group-hover:text-[#00685f] transition-colors block">
                        {link.label}
                      </span>
                      {link.category && (
                        <span className="text-[10px] text-[#6d7a77] uppercase font-bold tracking-wider">
                          {t.categories[link.category] || link.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-[#00685f] transition-all" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Connect & Share My Details Direct to Card Owner */}
        <div className="mt-6">
          <button
            onClick={() => setIsLeadModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-[#00685f] border border-teal-200/80 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.connectLeadBtn} {profile.shortName}</span>
          </button>
        </div>

        {/* Tribu Creativa QRO Viral Authority & WhatsApp Contact Badge */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-stone-900 to-slate-900 text-white text-center shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>{t.designedBy} {AGENCY_NAME}</span>
          </div>
          <p className="text-[12px] text-stone-300 font-medium leading-relaxed px-1">
            {t.promoQuestion}
          </p>
          <div className="mt-3 flex items-center justify-center">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                lang === 'en'
                  ? `Hello Tribu Creativa QRO, I saw the digital card of ${profile.name} and would like to quote an executive digital card for my brand or company.`
                  : `Hola Tribu Creativa QRO, vi la tarjeta digital de ${profile.name} y me gustaría cotizar una tarjeta digital ejecutiva para mi marca o empresa.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[12px] inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t.promoBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Verified Profile Identifier Footer */}
        <div className="mt-4 text-center pt-3 border-t border-stone-200/80">
          <p className="text-[11px] text-[#6d7a77] font-semibold">
            {t.verifiedCardText}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[10px] text-[#6d7a77]/80">
            <span>
              {t.verifiedCardId} <span className="font-mono">{profile.uid}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Dock inside card */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center gap-2 z-20">
        <button
          onClick={onDownloadVCard}
          style={customButtonStyle}
          className="flex-1 min-h-[46px] bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.saveVCard}</span>
        </button>
        <button
          onClick={handleQuickShare}
          className="w-12 h-[46px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center border border-emerald-200 active:scale-95 transition-all cursor-pointer"
          title={t.shareCardTitle}
          aria-label={t.shareCardTitle}
        >
          <Share2 className="w-5 h-5 text-emerald-700" />
        </button>
        <button
          onClick={onOpenQR}
          className="w-12 h-[46px] bg-stone-100 hover:bg-stone-200 text-[#1a1c1c] rounded-xl flex items-center justify-center border border-stone-300 active:scale-95 transition-all cursor-pointer"
          title={t.shareQrTitle}
          aria-label={t.shareQrTitle}
        >
          <QrCode className="w-5 h-5 text-stone-700" />
        </button>
      </div>

      {/* Direct Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        profile={profile}
        onShowToast={onShowToast || (() => {})}
        lang={lang}
      />
    </div>
  );
};
