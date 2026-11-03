import React, { useState, useEffect } from 'react';
import { ParticipantProfile, CardTheme, CardSolution, CardProcessStep } from '../types/card';
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
  Share2,
  Star,
  Smartphone,
  Award,
  HelpCircle,
  Mic,
  ShieldCheck,
  Building2,
  Users,
  ZoomIn,
  Image as ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Compass,
  Clock
} from 'lucide-react';
import { getViralSharePayload, AGENCY_NAME, AGENCY_URL } from '../utils/seo';
import { LeadCaptureModal, LeadCaptureContext } from './LeadCaptureModal';
import { processPendingLeads } from '../services/leadService';
import { WallpaperModal } from './WallpaperModal';
import { EmailSignatureModal } from './EmailSignatureModal';
import { QRModal } from './QRModal';
import { ShareModal } from './ShareModal';
import { LegalNoticeModal, LegalTab } from './LegalNoticeModal';
import { LanguageSelector } from './FlagIcons';
import { CardLanguage, CARD_TRANSLATIONS, SAMPLE_PROFILE_TRANSLATIONS } from '../utils/i18n';
import { getProfileConfig } from '../data/professionalProfiles';
import { formatVideoEmbedUrl, getVideoThumbnail, getVideoPlatform } from '../utils/video';
import { recordActivity } from '../utils/analytics';
import { normalizeNetworkingTarget, resolvePrimaryAction, getEffectiveCalendarUrl, shouldShowPhysicalLocation, getDeduplicatedLinks } from '../utils/cardHelpers';
import { parsePhoneNumber } from '../utils/phone';

interface DigitalCardProps {
  profile: ParticipantProfile;
  activeTheme?: CardTheme;
  onOpenQR: () => void;
  onDownloadVCard: () => void;
  isStandalone?: boolean;
  onShowToast?: (msg: string) => void;
  onOpenAdminAccess?: () => void;
  onOpenCompanyDirectory?: (companySlug: string) => void;
}

export const DigitalCard: React.FC<DigitalCardProps> = ({
  profile,
  activeTheme,
  onOpenQR,
  onDownloadVCard,
  isStandalone = false,
  onShowToast,
  onOpenAdminAccess,
  onOpenCompanyDirectory
}) => {
  const currentTheme = activeTheme || profile.themeKey;
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLeadContext, setSelectedLeadContext] = useState<LeadCaptureContext | null>(null);

  // Reintentar de forma controlada registros pendientes cuando el entorno monte o recupere conexión
  useEffect(() => {
    const attemptSync = () => {
      processPendingLeads(profile.publicId).catch(() => {});
    };
    attemptSync();
    window.addEventListener('online', attemptSync);
    return () => {
      window.removeEventListener('online', attemptSync);
    };
  }, [profile.publicId]);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isLocalQROpen, setIsLocalQROpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');
  const [evidenceModal, setEvidenceModal] = useState<{
    imageUrl: string;
    authorName: string;
    sourceUrl?: string;
    sourceType?: string;
    sourceLabel?: string;
  } | null>(null);

  // Progressive disclosure & interactive organization states (initialize to first available tab)
  const defaultTab: 'solutions' | 'networking' | 'testimonials' =
    (profile.solutions && profile.solutions.length > 0)
      ? 'solutions'
      : (profile.networkingTargets && profile.networkingTargets.length > 0)
      ? 'networking'
      : 'testimonials';
  const [activeContentTab, setActiveContentTab] = useState<'solutions' | 'networking' | 'testimonials'>(defaultTab);
  const [expandedSolutionIdx, setExpandedSolutionIdx] = useState<number | null>(0);
  const [expandedTargetIdx, setExpandedTargetIdx] = useState<number | null>(0);
  const [testimonialIdx, setTestimonialIdx] = useState<number>(0);
  const [isToolkitExpanded, setIsToolkitExpanded] = useState<boolean>(false);

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Safe normalized calendar URL & parsed phone
  const calendarLink = getEffectiveCalendarUrl(profile);
  const parsedPhone = parsePhoneNumber(profile.phone);

  // Discreet gesture detector for owner admin/CRM access (Triple-tap on avatar or double-tap on footer)
  const avatarTapTimesRef = React.useRef<number[]>([]);
  const footerTapTimesRef = React.useRef<number[]>([]);

  const handleAvatarTap = () => {
    const now = Date.now();
    const recent = avatarTapTimesRef.current.filter((t) => now - t < 1200);
    recent.push(now);
    avatarTapTimesRef.current = recent;

    if (recent.length >= 3) {
      avatarTapTimesRef.current = [];
      if (onOpenAdminAccess) {
        onOpenAdminAccess();
      }
    }
  };

  const handleFooterTap = () => {
    const now = Date.now();
    const recent = footerTapTimesRef.current.filter((t) => now - t < 900);
    recent.push(now);
    footerTapTimesRef.current = recent;

    if (recent.length >= 2) {
      footerTapTimesRef.current = [];
      if (onOpenAdminAccess) {
        onOpenAdminAccess();
      }
    }
  };
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
  const sampleTrans = lang === 'en' ? SAMPLE_PROFILE_TRANSLATIONS[profile.publicId] : undefined;
  const primaryResolved = resolvePrimaryAction(profile, t, lang, sampleTrans);
  const profileCfg = getProfileConfig(profile.professionalProfile, lang);

  // Initial action group ref and scroll tracking for bottom dock coordination
  const initialActionsRef = React.useRef<HTMLDivElement>(null);
  const [isPastInitialActions, setIsPastInitialActions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!initialActionsRef.current) return;
      const rect = initialActionsRef.current.getBoundingClientRect();
      // Block has scrolled past when its bottom is above the viewport top
      setIsPastInitialActions(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [profile.publicId]);

  const isAnyModalOpen =
    isLeadModalOpen ||
    isWallpaperModalOpen ||
    isSignatureModalOpen ||
    isLocalQROpen ||
    isShareModalOpen ||
    isLegalModalOpen ||
    evidenceModal !== null;

  const renderPrimaryIcon = (iconName: string, className = 'w-5 h-5 shrink-0') => {
    switch (iconName) {
      case 'calendar':
        return <Calendar className={className} />;
      case 'phone':
        return <Phone className={className} />;
      case 'mail':
        return <Mail className={className} />;
      case 'link':
        return <ExternalLink className={className} />;
      case 'share':
        return <Share2 className={className} />;
      case 'whatsapp':
      default:
        return <MessageCircle className={className} />;
    }
  };
  const displayRole = (lang === 'en' && sampleTrans?.role) || profile.role;
  const displayCompany = (lang === 'en' && sampleTrans?.company) || profile.company;
  const displayCity = (lang === 'en' && sampleTrans?.city) || profile.city;
  const displayValueProp = (lang === 'en' && sampleTrans?.valueProp) || profile.valueProp;
  const displayStatus = (lang === 'en' && (sampleTrans?.status || t.statusMap[profile.status])) || profile.status;
  const displaySolutions = (lang === 'en' && sampleTrans?.solutions) || profile.solutions;
  const displayNetworkingTargets = (lang === 'en' && sampleTrans?.networkingTargets) || profile.networkingTargets;
  const displayLinks = (lang === 'en' && sampleTrans?.links) || profile.links;
  const displayTestimonials = (lang === 'en' && sampleTrans?.testimonials) || profile.testimonials;
  const displayCustomFields = (lang === 'en' && sampleTrans?.customFields)
    ? { ...profile.customFields, ...sampleTrans.customFields }
    : profile.customFields;
  const displayIntroVideoTitle = (lang === 'en' && sampleTrans?.introVideoTitle) || profile.introVideo?.title;

  // Deduplicate secondary links so they do not repeat primary CTA, calendar, maps, or website
  const filteredLinks = getDeduplicatedLinks(displayLinks, primaryResolved, profile);

  const hasSolutions = Boolean(displaySolutions && displaySolutions.length > 0);
  const hasNetworking = Boolean(displayNetworkingTargets && displayNetworkingTargets.length > 0);
  const hasTestimonials = Boolean(displayTestimonials && displayTestimonials.length > 0);
  const hasLinks = Boolean(filteredLinks && filteredLinks.length > 0);

  // Collaboration-oriented profile detection (alters vertical narrative flow appropriately)
  const isCollaborationOriented =
    profile.primaryAction?.actionType === 'collaboration' ||
    profile.professionalProfile === 'institucional_publico' ||
    profile.professionalProfile === 'ejecutivo_directivo';

  // Reset interactive disclosure states when switching profile
  useEffect(() => {
    setIsPlayingVideo(false);
    setExpandedSolutionIdx(0);
    setExpandedTargetIdx(0);
    setTestimonialIdx(0);
    if (profile.solutions && profile.solutions.length > 0) {
      setActiveContentTab('solutions');
    } else if (profile.networkingTargets && profile.networkingTargets.length > 0) {
      setActiveContentTab('networking');
    } else if (profile.testimonials && profile.testimonials.length > 0) {
      setActiveContentTab('testimonials');
    } else {
      setActiveContentTab('solutions');
    }
  }, [profile.publicId]);

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

  // WhatsApp link preparation with profile-aware default & normalized country code
  const cleanPhone = parsedPhone.waDigits || profile.phone.replace(/[^0-9]/g, '');

  const getDefaultMainWhatsAppMessage = () => {
    if (lang === 'en' && sampleTrans?.whatsappCustomMessage) return sampleTrans.whatsappCustomMessage;
    if (profile.whatsappCustomMessage && lang !== 'en') return profile.whatsappCustomMessage;
    const name = profile.shortName || profile.name;
    if (lang === 'en') {
      switch (profile.professionalProfile) {
        case 'comercial_asesor':
          return `Hello ${name}, I saw your digital card on Tribu Creativa QRO and would like to request advisory or a quote.`;
        case 'salud':
          return `Hello ${name}, I viewed your digital card and would like to request general appointment information.`;
        case 'institucional_publico':
          return `Dear ${name}, I am contacting you through your institutional digital card regarding a liaison matter.`;
        case 'empresario_dueno':
          return `Hello ${name}, I saw your company profile on your digital card and would like to explore a commercial partnership.`;
        case 'ejecutivo_directivo':
          return `Hello ${name}, I saw your executive card and would like to connect professionally with you.`;
        default:
          return `Hello ${name}, I saw your digital card on Tribu Creativa QRO and would like to connect with you.`;
      }
    }
    switch (profile.professionalProfile) {
      case 'comercial_asesor':
        return `Hola ${name}, vi tu tarjeta digital en Tribu Creativa QRO y me gustaría solicitar asesoría o una cotización.`;
      case 'salud':
        return `Hola ${name}, vi su tarjeta digital y me gustaría solicitar información general para agendar una cita.`;
      case 'institucional_publico':
        return `Estimado/a ${name}, le contacto a través de su tarjeta digital institucional para dar seguimiento a un tema de vinculación.`;
      case 'empresario_dueno':
        return `Hola ${name}, vi las capacidades de su empresa en su tarjeta y nos gustaría explorar una relación comercial.`;
      case 'ejecutivo_directivo':
        return `Hola ${name}, revisé su tarjeta directiva y me gustaría conectar profesionalmente con usted.`;
      default:
        return `Hola ${name}, vi tu tarjeta digital en Tribu Creativa QRO y me gustaría conectar contigo.`;
    }
  };

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(getDefaultMainWhatsAppMessage())}`;

  // WhatsApp message for individual solution cases, strictly conserving origin case context
  const getSolutionWhatsAppUrl = (item: CardSolution) => {
    if (item.ctaMessage) {
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(item.ctaMessage)}`;
    }
    const name = profile.shortName || profile.name;
    let msg = '';
    if (lang === 'en') {
      switch (profile.professionalProfile) {
        case 'comercial_asesor':
          msg = `Hello ${name}, I saw your case on "${item.title}" on your digital card and would like to request an advisory quote for a similar need.`;
          break;
        case 'salud':
          msg = `Hello ${name}, I reviewed your service on "${item.title}" on your digital card and would like to request appointment information.`;
          break;
        case 'institucional_publico':
          msg = `Dear ${name}, I am contacting you regarding your project "${item.title}" consulted on your institutional digital card.`;
          break;
        case 'empresario_dueno':
          msg = `Hello ${name}, I saw your corporate case on "${item.title}" on your digital card and would like to explore a business proposal.`;
          break;
        case 'ejecutivo_directivo':
          msg = `Hello ${name}, I saw your strategic initiative on "${item.title}" and would like to discuss executive collaboration.`;
          break;
        default:
          msg = `Hello ${name}, I saw your case on "${item.title}" on your digital card and have a similar need.`;
          break;
      }
    } else {
      switch (profile.professionalProfile) {
        case 'comercial_asesor':
          msg = `Hola ${name}, vi el caso de "${item.title}" en tu tarjeta digital y me gustaría solicitar asesoría o una cotización para un caso similar.`;
          break;
        case 'salud':
          msg = `Hola ${name}, leí la información sobre "${item.title}" en su tarjeta digital y quisiera consultar disponibilidad para una cita.`;
          break;
        case 'institucional_publico':
          msg = `Estimado/a ${name}, le contacto respecto al proyecto "${item.title}" consultado en su tarjeta digital institucional.`;
          break;
        case 'empresario_dueno':
          msg = `Hola ${name}, vi el caso de capacidades en "${item.title}" en su tarjeta y nos gustaría evaluar una propuesta similar para nuestra empresa.`;
          break;
        case 'ejecutivo_directivo':
          msg = `Hola ${name}, vi su iniciativa sobre "${item.title}" en su tarjeta ejecutiva y me interesaría conversar sobre colaboración directiva.`;
          break;
        default:
          msg = `Hola ${name}, vi el caso de "${item.title}" en tu tarjeta digital y me gustaría resolver una necesidad similar.`;
          break;
      }
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleTriggerQR = () => {
    setIsLocalQROpen(true);
  };

  const handleQuickShare = () => {
    setIsShareModalOpen(true);
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
      <div className="px-5 -mt-12 relative z-10 pb-36 sm:pb-40">
        {/* Avatar, Company Logo & Availability Badge */}
        <div className="flex items-end justify-between">
          <div
            className="relative cursor-pointer select-none active:scale-95 transition-transform"
            onClick={handleAvatarTap}
            title={profile.name}
          >
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
          {profile.publicId.startsWith('demo-') && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10.5px] font-bold border border-amber-300/80 mb-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>
                {lang === 'en'
                  ? 'Demo Profile • Fictional Demonstration RedConecta MX'
                  : 'Perfil de Demostración • Ejemplo Ficticio RedConecta MX'}
              </span>
            </div>
          )}
          <h1 className="text-[22px] sm:text-[24px] font-extrabold tracking-tight leading-tight text-[#1a1c1c]">
            {profile.name}
          </h1>
          <p
            className={`text-[13px] sm:text-[14px] font-bold mt-0.5 ${theme.roleColor}`}
            style={profile.customPrimaryColor ? { color: profile.customPrimaryColor } : undefined}
          >
            {displayRole}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[#3d4947] text-[12px] sm:text-[13px] flex-wrap">
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt={`Logo de ${displayCompany}`}
                className="w-4 h-4 rounded-full object-cover border border-stone-300 shadow-2xs"
              />
            )}
            <span className="font-medium">{displayCompany}</span>
            {/* Ubicación condicional: en remoto se oculta la dirección física */}
            {shouldShowPhysicalLocation(profile) && profile.city && (
              <>
                <span>•</span>
                {profile.googleMapsUrl ? (
                  <a
                    href={profile.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[#6d7a77] hover:text-[#00685f] transition-colors group cursor-pointer"
                    title={t.getDirections}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#00685f] group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-dotted underline-offset-2">{displayCity}</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[#6d7a77]">
                    <MapPin className="w-3.5 h-3.5 text-[#6d7a77]" />
                    <span>{displayCity}</span>
                  </span>
                )}
              </>
            )}
            {/* Si es modalidad remota o tiene showLocation apagado */}
            {!shouldShowPhysicalLocation(profile) && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-[#00685f] font-semibold text-[11px] sm:text-[12px] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                  <Globe className="w-3 h-3 text-[#00685f]" />
                  <span>{profile.locationMode === 'remoto' ? t.locationRemote : (displayCity || 'En línea')}</span>
                </span>
              </>
            )}

            {/* Plan Empresarial (UX08): Acceso discreto a Conoce al equipo corporativo */}
            {profile.companySlug && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenCompanyDirectory) {
                      onOpenCompanyDirectory(profile.companySlug!);
                    } else {
                      window.location.href = `/e/${profile.companySlug}`;
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-full border border-stone-200 transition-colors cursor-pointer group shadow-2xs"
                  title={`Conoce al equipo corporativo de ${displayCompany}`}
                >
                  <Users className="w-3 h-3 text-[#00685f]" />
                  <span>Conoce al equipo</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-stone-400 group-hover:text-stone-700 transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* B. Propuesta de Valor (valueProp antes del grupo de acciones, directo y legible) */}
          {displayValueProp && (
            <div className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
              <p className="text-[13px] sm:text-[14px] text-[#1a1c1c] font-medium leading-relaxed">
                {displayValueProp}
              </p>
            </div>
          )}

          {/* C. Contexto relevante por arquetipo (campos públicos con menor peso visual) */}
          {displayCustomFields && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {/* Salud: Cédula oficial, especialidad, institución */}
              {profile.professionalProfile === 'salud' && displayCustomFields.licenseId && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50/90 text-teal-900 text-[11px] font-semibold border border-teal-200 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#00685f]" />
                  <span>{lang === 'en' ? 'Fed. Lic.' : 'Céd. Fed.'} {displayCustomFields.licenseId}</span>
                </span>
              )}
              {profile.professionalProfile === 'salud' && displayCustomFields.specialtyLicenseId && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50/90 text-teal-900 text-[11px] font-semibold border border-teal-200 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#00685f]" />
                  <span>{lang === 'en' ? 'Spec. Lic.' : 'Céd. Esp.'} {displayCustomFields.specialtyLicenseId}</span>
                </span>
              )}
              {profile.professionalProfile === 'salud' && displayCustomFields.institution && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Building2 className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.institution}</span>
                </span>
              )}

              {/* Comercial / Asesor: Sector, Territorio y Líneas de solución */}
              {profile.professionalProfile === 'comercial_asesor' && displayCustomFields.sector && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
                  <Briefcase className="w-3 h-3 text-[#00685f]" />
                  <span>Sector: {displayCustomFields.sector}</span>
                </span>
              )}
              {profile.professionalProfile === 'comercial_asesor' && displayCustomFields.territory && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.territory}</span>
                </span>
              )}
              {profile.professionalProfile === 'comercial_asesor' && displayCustomFields.solutionLines && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Layers className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.solutionLines}</span>
                </span>
              )}

              {/* Profesional Independiente: Especialidad, Tipo de cliente y Alcance */}
              {profile.professionalProfile === 'profesional_independiente' && displayCustomFields.specialty && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50/80 text-teal-900 text-[11px] font-semibold border border-teal-200/80">
                  <Sparkles className="w-3 h-3 text-[#00685f]" />
                  <span>{displayCustomFields.specialty}</span>
                </span>
              )}
              {profile.professionalProfile === 'profesional_independiente' && displayCustomFields.clientType && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Users className="w-3 h-3 text-stone-500" />
                  <span>{lang === 'en' ? 'For:' : 'Para:'} {displayCustomFields.clientType}</span>
                </span>
              )}
              {profile.professionalProfile === 'profesional_independiente' && displayCustomFields.serviceScope && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Briefcase className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.serviceScope}</span>
                </span>
              )}

              {/* Emprendedor / Solopreneur: Categoría, Modalidad y Zona */}
              {profile.professionalProfile === 'emprendedor_solopreneur' && displayCustomFields.category && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
                  <Layers className="w-3 h-3 text-[#00685f]" />
                  <span>{displayCustomFields.category}</span>
                </span>
              )}
              {profile.professionalProfile === 'emprendedor_solopreneur' && displayCustomFields.modality && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Briefcase className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.modality}</span>
                </span>
              )}
              {profile.professionalProfile === 'emprendedor_solopreneur' && displayCustomFields.serviceZone && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.serviceZone}</span>
                </span>
              )}

              {/* Empresario / Dueño: Sectores, Cobertura y Capacidades instaladas */}
              {profile.professionalProfile === 'empresario_dueno' && displayCustomFields.sectorsServed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
                  <Building2 className="w-3 h-3 text-[#00685f]" />
                  <span>{lang === 'en' ? 'Sectors:' : 'Sectores:'} {displayCustomFields.sectorsServed}</span>
                </span>
              )}
              {profile.professionalProfile === 'empresario_dueno' && displayCustomFields.coverage && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Globe className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.coverage}</span>
                </span>
              )}
              {profile.professionalProfile === 'empresario_dueno' && displayCustomFields.coreCapabilities && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Layers className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.coreCapabilities}</span>
                </span>
              )}

              {/* Ejecutivo / Directivo: Área, Alcance y Temas de vinculación */}
              {profile.professionalProfile === 'ejecutivo_directivo' && displayCustomFields.department && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                  <Briefcase className="w-3 h-3 text-[#00685f]" />
                  <span>{displayCustomFields.department}</span>
                </span>
              )}
              {profile.professionalProfile === 'ejecutivo_directivo' && displayCustomFields.leadershipScope && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Users className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.leadershipScope}</span>
                </span>
              )}
              {profile.professionalProfile === 'ejecutivo_directivo' && displayCustomFields.liaisonTopics && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Sparkles className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.liaisonTopics}</span>
                </span>
              )}

              {/* Funcionario / Institucional: Dependencia, Ámbito territorial y Temas de competencia */}
              {profile.professionalProfile === 'institucional_publico' && displayCustomFields.institutionalDepartment && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                  <Building2 className="w-3 h-3 text-[#00685f]" />
                  <span>{displayCustomFields.institutionalDepartment}</span>
                </span>
              )}
              {profile.professionalProfile === 'institucional_publico' && displayCustomFields.territorialScope && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  <span>{lang === 'en' ? 'Scope:' : 'Ámbito:'} {displayCustomFields.territorialScope}</span>
                </span>
              )}
              {profile.professionalProfile === 'institucional_publico' && displayCustomFields.publicLiaisonTopics && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                  <Sparkles className="w-3 h-3 text-stone-500" />
                  <span>{displayCustomFields.publicLiaisonTopics}</span>
                </span>
              )}
            </div>
          )}

          {/* D. Acción Principal y Guardar Contacto */}
          <div ref={initialActionsRef} className="mt-4 space-y-2">
            {primaryResolved.enabled && primaryResolved.isValid && (
              <a
                href={primaryResolved.href}
                target={primaryResolved.isExternal ? '_blank' : undefined}
                rel={primaryResolved.isExternal ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  if (primaryResolved.actionType === 'calendar') {
                    recordActivity(profile.publicId, profile.shortName, 'calendar_click', 'Clic en Agendar Cita');
                  } else if (primaryResolved.actionType === 'whatsapp') {
                    recordActivity(profile.publicId, profile.shortName, 'whatsapp_click', 'Clic en WhatsApp');
                  } else if (primaryResolved.actionType === 'phone') {
                    recordActivity(profile.publicId, profile.shortName, 'call_click', 'Clic en Llamar');
                  } else if (primaryResolved.actionType === 'email') {
                    recordActivity(profile.publicId, profile.shortName, 'email_click', 'Clic en Correo');
                  } else {
                    recordActivity(profile.publicId, profile.shortName, 'link_click', `Clic en ${primaryResolved.label}`);
                  }
                }}
                style={customButtonStyle}
                className={`w-full min-h-[48px] ${
                  primaryResolved.actionType === 'whatsapp'
                    ? 'bg-[#128C7E] hover:bg-[#075E54] text-white'
                    : profile.customPrimaryColor
                    ? 'text-white'
                    : theme.primaryBtn
                } rounded-xl text-[14px] sm:text-[15px] font-bold flex flex-col items-center justify-center shadow-sm transition-all active:scale-[0.98] cursor-pointer px-4 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00685f]`}
              >
                <div className="flex items-center justify-center gap-2">
                  {renderPrimaryIcon(primaryResolved.iconName, 'w-5 h-5 shrink-0')}
                  <span className="whitespace-normal text-center leading-snug">{primaryResolved.label}</span>
                </div>
                {primaryResolved.sublabel && (
                  <span className="text-[11px] font-normal opacity-90 mt-0.5 text-center leading-tight">
                    {primaryResolved.sublabel}
                  </span>
                )}
              </a>
            )}

            {/* Guardar contacto como acción secundaria visible (o primaria si no hay acción destacada) */}
            <button
              type="button"
              onClick={onDownloadVCard}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl ${
                primaryResolved.enabled && primaryResolved.isValid
                  ? 'bg-white hover:bg-stone-50 text-[#1a1c1c] border border-stone-300'
                  : 'bg-[#00685f] hover:bg-[#008378] text-white'
              } text-[13px] font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00685f]`}
            >
              <UserPlus className="w-4 h-4 shrink-0 text-current" />
              <span>{profileCfg.labels.primaryActionLabel || t.saveContact}</span>
            </button>
          </div>

          {/* E. Alternativas y Logística: Canales complementarios y ubicación física */}
          {(() => {
            // Render alternative channels avoiding duplication of primary action destination
            const showAltPhone = parsedPhone.isValid && primaryResolved.actionType !== 'phone';
            const showAltEmail = Boolean(profile.email && profile.email.includes('@')) && primaryResolved.actionType !== 'email';
            const showAltCalendar = Boolean(calendarLink) && primaryResolved.actionType !== 'calendar';
            const showAltWhatsapp = Boolean(parsedPhone.isValid) && primaryResolved.actionType !== 'whatsapp';

            const hasAnyAlt = showAltPhone || showAltEmail || showAltCalendar || showAltWhatsapp;

            return (
              <div className="mt-2.5 space-y-2">
                {hasAnyAlt && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {showAltCalendar && (
                      <a
                        href={calendarLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          recordActivity(profile.publicId, profile.shortName, 'calendar_click', 'Clic en Agendar Cita');
                        }}
                        className="flex-1 min-w-[120px] min-h-[38px] px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-[#1a1c1c] text-[12px] font-semibold active:scale-95 transition-all shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span>{t.schedule}</span>
                      </a>
                    )}

                    {showAltWhatsapp && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] min-h-[38px] px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-[#1a1c1c] text-[12px] font-semibold active:scale-95 transition-all shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#128C7E] shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {showAltPhone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="min-h-[38px] px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-[#1a1c1c] text-[12px] font-semibold active:scale-95 transition-all shadow-2xs"
                        title={t.call}
                      >
                        <Phone className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                        <span className="hidden sm:inline">{t.call}</span>
                      </a>
                    )}

                    {showAltEmail && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="min-h-[38px] px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-[#1a1c1c] text-[12px] font-semibold active:scale-95 transition-all shadow-2xs"
                        title={t.email}
                      >
                        <Mail className="w-3.5 h-3.5 text-[#ac3400] shrink-0" />
                        <span className="hidden sm:inline">{t.email}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Ubicación física y cómo llegar (solo cuando aplique local o despacho presencial/híbrido) */}
                {shouldShowPhysicalLocation(profile) && profile.address && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2.5 shadow-2xs">
                    <div className="flex items-start gap-2 text-stone-700 min-w-0">
                      <MapPin className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                          {t.locationPhysical}
                        </span>
                        <p className="text-[12px] text-stone-800 font-medium leading-snug whitespace-normal">
                          {profile.address}
                        </p>
                      </div>
                    </div>
                    {profile.googleMapsUrl && (
                      <a
                        href={profile.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[#00685f] text-[11px] font-bold hover:bg-teal-50 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>{t.getDirections}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Intro Video Pitch Player */}
        {profile.introVideo && profile.introVideo.url && (
          (() => {
            const isDirectVideo =
              getVideoPlatform(profile.introVideo.url) === 'direct' ||
              /\.(mp4|webm|ogg|mov)($|\?)/i.test(profile.introVideo.url);
            const videoThumbnail =
              getVideoThumbnail(profile.introVideo.url, profile.introVideo.thumbnailUrl) ||
              profile.bannerImageUrl ||
              profile.avatarUrl;
            const embedUrl = formatVideoEmbedUrl(profile.introVideo.url, true);

            return (
              <div className="mt-4 rounded-2xl bg-stone-900 overflow-hidden border border-stone-300/80 shadow-xs">
                {isPlayingVideo ? (
                  <div className="relative pt-[56.25%] w-full bg-black">
                    {isDirectVideo ? (
                      <video
                        src={profile.introVideo.url}
                        controls
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                      >
                        <source src={profile.introVideo.url} type="video/mp4" />
                        Tu navegador no soporta reproducción de video.
                      </video>
                    ) : (
                      <iframe
                        src={embedUrl}
                        title={profile.introVideo.title || t.introPitch}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    )}
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
                        {displayIntroVideoTitle}
                      </p>
                      <p className="text-white/80 text-[11px] drop-shadow">{t.tapToPlay}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}

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

        {/* Vertical Narrative Flow (Solutions • Testimonials • Resources • Networking) */}
        {(() => {
          // 1. Soluciones y Casos Documentados
          const solutionsBlock = hasSolutions && displaySolutions && displaySolutions.length > 0 ? (
            <div className="mt-5 animate-in fade-in duration-150" id="section-solutions">
              <div className="flex items-baseline justify-between mb-2.5">
                <h2 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold">
                  {profileCfg.labels.solutionsSectionTitle || t.solutionsLabel}
                </h2>
                <span className="text-[10px] text-stone-400 font-medium">
                  {lang === 'en' ? 'Tap an entry to expand full details' : 'Toca cada entrada para ver el detalle'}
                </span>
              </div>

              <div className="space-y-2.5">
                {displaySolutions.map((item, idx) => {
                  const hasCaseFramework = Boolean(item.problem || item.solution || item.intervention || item.scope);
                  const solutionWhatsAppUrl = getSolutionWhatsAppUrl(item);
                  const isExpanded = expandedSolutionIdx === idx;
                  const summaryPreview = item.desc || item.problem || item.solution || '';
                  const isCase = item.type === 'caso';
                  const isSolution = item.type === 'solucion';

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl bg-white border transition-all shadow-2xs overflow-hidden ${
                        isExpanded
                          ? 'border-teal-500/50 ring-1 ring-teal-500/15'
                          : 'border-stone-200/90 hover:border-stone-300'
                      }`}
                    >
                      {/* Clickable Accordion Header */}
                      <button
                        type="button"
                        id={`solution-header-${idx}`}
                        aria-expanded={isExpanded}
                        aria-controls={`solution-panel-${idx}`}
                        onClick={() => setExpandedSolutionIdx(isExpanded ? null : idx)}
                        className="w-full p-3.5 text-left flex items-start justify-between gap-2.5 cursor-pointer hover:bg-stone-50/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-teal-50 text-[#00685f] border border-teal-200/70 shrink-0 mt-0.5"
                            style={
                              profile.customPrimaryColor
                                ? {
                                    backgroundColor: `${profile.customPrimaryColor}15`,
                                    color: profile.customPrimaryColor,
                                    borderColor: `${profile.customPrimaryColor}30`
                                  }
                                : undefined
                            }
                          >
                            0{idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1c1c] leading-snug">
                                {item.title}
                              </h3>
                              {isCase && (
                                <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border bg-sky-50 text-sky-800 border-sky-200 shrink-0">
                                  {lang === 'en' ? 'Documented Case' : 'Caso Documentado'}
                                </span>
                              )}
                              {isSolution && (
                                <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200 shrink-0">
                                  {lang === 'en' ? 'Current Offering' : 'Solución Ofrecida'}
                                </span>
                              )}
                            </div>
                            {summaryPreview && (
                              <p className="text-[11.5px] text-stone-600 mt-1 font-normal leading-relaxed whitespace-normal">
                                {summaryPreview}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Case / Solution Body */}
                      {isExpanded && (
                        <div
                          id={`solution-panel-${idx}`}
                          role="region"
                          aria-labelledby={`solution-header-${idx}`}
                          className="px-3.5 pb-3.5 pt-2 border-t border-stone-100 animate-in fade-in duration-150 space-y-2.5"
                        >
                          {hasCaseFramework ? (
                            <div className="space-y-2">
                              {item.problem && (
                                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-800">
                                      {isCase
                                        ? (lang === 'en' ? 'Initial Situation • Context' : 'Situación inicial • Contexto')
                                        : (profileCfg.labels.solutionCaseQuestion1 || (lang === 'en' ? 'Challenge Addressed' : 'Situación que atiende • Reto'))}
                                    </span>
                                  </div>
                                  <p className="text-[12px] sm:text-[12.5px] text-stone-700 leading-relaxed pl-5 whitespace-normal">
                                    {item.problem}
                                  </p>
                                </div>
                              )}

                              {item.intervention && (
                                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-800">
                                      {isCase
                                        ? (lang === 'en' ? 'Action Taken • Intervention' : 'Qué se hizo • Intervención aplicada')
                                        : (lang === 'en' ? 'Intervention & Concrete Process' : 'Intervención concreta • Proceso')}
                                    </span>
                                  </div>
                                  <p className="text-[12px] sm:text-[12.5px] text-stone-700 leading-relaxed pl-5 whitespace-normal">
                                    {item.intervention}
                                  </p>
                                </div>
                              )}

                              {item.scope && (
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Layers className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700">
                                      {lang === 'en' ? 'Scope & Deliverables' : 'Alcance • Entregables y qué incluye'}
                                    </span>
                                  </div>
                                  <p className="text-[12px] sm:text-[12.5px] text-stone-700 leading-relaxed pl-5 whitespace-normal">
                                    {item.scope}
                                  </p>
                                </div>
                              )}

                              {item.solution && (
                                <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/60">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-800">
                                      {isCase
                                        ? (lang === 'en' ? 'Documented Outcome • Change Observed' : 'Resultado documentado • Qué cambió')
                                        : (profileCfg.labels.solutionCaseQuestion2 || (lang === 'en' ? 'Facilitated Outcome' : 'Resultado que facilita • Avance esperado'))}
                                    </span>
                                  </div>
                                  <p className="text-[12px] sm:text-[12.5px] text-stone-700 leading-relaxed pl-5 whitespace-normal">
                                    {item.solution}
                                  </p>
                                </div>
                              )}

                              {item.evidenceUrl && (
                                <div className="pt-0.5 pl-1">
                                  <a
                                    href={item.evidenceUrl.startsWith('http') ? item.evidenceUrl : `https://${item.evidenceUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-700 hover:text-sky-900 transition-colors p-1.5 rounded-lg hover:bg-sky-50/80"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span className="underline underline-offset-2">
                                      {item.evidenceLabel ||
                                        (isCase
                                          ? (lang === 'en' ? 'View documented case evidence or portfolio' : 'Consultar evidencia documentada del caso')
                                          : (lang === 'en' ? 'View sample deliverable or resource' : 'Consultar muestra o recurso de apoyo'))}
                                    </span>
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[12px] sm:text-[13px] text-[#3d4947] mt-1 pl-2 leading-relaxed whitespace-normal">
                              {item.desc}
                            </p>
                          )}

                          {/* Contextual CTA */}
                          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
                              {isCase
                                ? (lang === 'en' ? 'Need to address a similar situation?' : '¿Tienes un reto o situación similar?')
                                : (profileCfg.labels.solutionCtaQuestion || t.similarNeedQuestion)}
                            </span>
                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                              {profile.features?.hasMiniCrm !== false && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLeadContext({
                                      source: 'solution',
                                      solutionId: `sol-${idx}`,
                                      solutionTitle: item.title
                                    });
                                    setIsLeadModalOpen(true);
                                  }}
                                  className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition-colors cursor-pointer"
                                  title={lang === 'en' ? 'Share your contact details for this entry' : 'Compartir mis datos para esta entrada'}
                                >
                                  <UserCheck className="w-3.5 h-3.5 text-[#00685f]" />
                                  <span>{lang === 'en' ? 'Inquire' : 'Dejar datos'}</span>
                                </button>
                              )}
                              <a
                                href={solutionWhatsAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-lg bg-[#00685f]/10 hover:bg-[#00685f] text-[#00685f] hover:text-white transition-all text-[11px] font-bold cursor-pointer group/cta"
                                style={
                                  profile.customPrimaryColor
                                    ? { color: profile.customPrimaryColor }
                                    : undefined
                                }
                              >
                                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  {item.ctaText ||
                                    (isCase
                                      ? (lang === 'en' ? 'Consult similar case' : 'Consultar caso similar')
                                      : (profileCfg.labels.solutionCtaDefault || t.similarNeedBtn))}
                                </span>
                                <ArrowRight className="w-3 h-3 group-hover/cta:translate-x-0.5 transition-transform" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Process Steps */}
              {profile.processSteps && profile.processSteps.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-stone-200/80 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#00685f]" />
                      <h3 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold">
                        {lang === 'en' ? 'How We Get Started • Process' : 'Cómo se empieza • Proceso de trabajo'}
                      </h3>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {profile.processSteps.length} {lang === 'en' ? 'steps' : 'pasos'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {profile.processSteps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-stone-50/90 border border-stone-200/80 flex items-start gap-2.5"
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold bg-[#00685f]/10 text-[#00685f] shrink-0 mt-0.5"
                          style={
                            profile.customPrimaryColor
                              ? {
                                  backgroundColor: `${profile.customPrimaryColor}15`,
                                  color: profile.customPrimaryColor
                                }
                              : undefined
                          }
                        >
                          0{step.step || sIdx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[12.5px] font-bold text-[#1a1c1c] leading-snug">
                            {step.title}
                          </h4>
                          <p className="text-[11.5px] text-stone-600 mt-0.5 leading-relaxed whitespace-normal">
                            {step.desc}
                          </p>
                          {step.expectation && (
                            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-200/60 text-stone-700 text-[10px] font-semibold">
                              <Clock className="w-3 h-3 text-stone-500 shrink-0" />
                              <span>{step.expectation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null;

          // 2. Alianzas y Vinculación Estratégica
          const networkingBlock = hasNetworking && displayNetworkingTargets && displayNetworkingTargets.length > 0 ? (
            <div className="mt-5 animate-in fade-in duration-150" id="section-networking">
              <div className="flex items-baseline justify-between mb-2.5">
                <h2 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold">
                  {profileCfg.labels.networkingSectionTitle || t.networkingLabel}
                </h2>
                <span className="text-[10px] text-stone-400 font-medium">
                  {lang === 'en' ? 'Strategic profiles' : 'Perfiles de conexión'}
                </span>
              </div>

              <div className="space-y-2">
                {displayNetworkingTargets.map((rawTarget, idx) => {
                  const item = normalizeNetworkingTarget(rawTarget);
                  const hasDetails = Boolean(item.purpose || item.contribution);
                  const isExpanded = expandedTargetIdx === idx;

                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-white border border-stone-200/80 shadow-2xs overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => hasDetails && setExpandedTargetIdx(isExpanded ? null : idx)}
                        className={`w-full p-3 text-left flex items-start justify-between gap-2.5 ${
                          hasDetails ? 'cursor-pointer hover:bg-stone-50/70' : 'cursor-default'
                        }`}
                        aria-expanded={hasDetails ? isExpanded : undefined}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <CheckCircle2
                            className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5"
                            style={profile.customPrimaryColor ? { color: profile.customPrimaryColor } : undefined}
                          />
                          <p className="text-[12px] sm:text-[13px] font-bold text-[#1a1c1c] leading-snug whitespace-normal break-words">
                            {item.target}
                          </p>
                        </div>
                        {hasDetails && (
                          <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center shrink-0">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </span>
                        )}
                      </button>

                      {hasDetails && isExpanded && (
                        <div className="px-3 pb-3 pl-9 space-y-1.5 pt-1 border-t border-stone-100 text-[11.5px] text-stone-600 leading-snug animate-in fade-in duration-150">
                          {item.purpose && (
                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-[#00685f] shrink-0">
                                {lang === 'en' ? 'Purpose:' : 'Para qué:'}
                              </span>
                              <span className="whitespace-normal">{item.purpose}</span>
                            </div>
                          )}
                          {item.contribution && (
                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-[#ac3400] shrink-0">
                                {lang === 'en' ? 'Contribution:' : 'Aportación:'}
                              </span>
                              <span className="whitespace-normal">{item.contribution}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null;

          // 3. Testimonios y Recomendaciones
          const testimonialsBlock = hasTestimonials && displayTestimonials && displayTestimonials.length > 0 ? (
            <div className="mt-5 animate-in fade-in duration-150" id="section-testimonials">
              {(() => {
                const totalReviews = displayTestimonials.length;
                const ratedReviews = displayTestimonials.filter((t) => typeof t.stars === 'number' && t.stars > 0);
                const avgRating = ratedReviews.length > 0
                  ? (ratedReviews.reduce((sum, r) => sum + (r.stars || 0), 0) / ratedReviews.length).toFixed(1)
                  : null;

                const safeIdx = testimonialIdx >= totalReviews ? 0 : testimonialIdx;
                const testi = displayTestimonials[safeIdx];
                if (!testi) return null;

                return (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#00685f]" />
                        <span>{lang === 'en' ? 'Client Recommendations' : 'Testimonios & Recomendaciones'}</span>
                      </h2>
                      <span className="text-[10px] text-stone-500 font-semibold flex items-center gap-1">
                        {avgRating ? (
                          <span className="text-amber-700 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{avgRating}</span>
                            <span className="text-stone-400 font-normal">({ratedReviews.length})</span>
                          </span>
                        ) : (
                          <span>{lang === 'en' ? 'Client feedback' : 'Referencias de clientes'}</span>
                        )}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs relative space-y-2.5 hover:border-teal-400/50 transition-all">
                      <Quote className="w-5 h-5 text-stone-200 absolute top-3 right-3" />

                      {/* Origin Badge */}
                      {(testi.sourceType || testi.date) && (
                        <div className="flex items-center justify-between gap-2 pr-6">
                          {testi.sourceType === 'facebook' &&
                            (testi.sourceUrl ? (
                              <a
                                href={testi.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 transition-all shadow-2xs group/fb cursor-pointer"
                                title={lang === 'en' ? 'Open recommendation on Facebook' : 'Abrir recomendación en Facebook'}
                              >
                                <Facebook className="w-3 h-3 fill-current" />
                                <span>{lang === 'en' ? 'Facebook Recommendation' : 'Recomendación en Facebook'}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/fb:opacity-100 group-hover/fb:translate-x-0.5 transition-transform" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/30 shadow-2xs">
                                <Facebook className="w-3 h-3 fill-[#1877F2]" />
                                <span>{lang === 'en' ? 'Facebook Recommendation' : 'Recomendación en Facebook'}</span>
                              </span>
                            ))}
                          {testi.sourceType === 'google' &&
                            (testi.sourceUrl ? (
                              <a
                                href={testi.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-800 hover:text-white border border-amber-500/30 transition-all shadow-2xs group/goog cursor-pointer"
                                title={lang === 'en' ? 'View on Google Reviews' : 'Ver en Google Reviews'}
                              >
                                <Star className="w-3 h-3 fill-current" />
                                <span>Google Reviews</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/goog:opacity-100" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/30 shadow-2xs">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>Google Reviews</span>
                              </span>
                            ))}
                          {testi.sourceType === 'linkedin' &&
                            (testi.sourceUrl ? (
                              <a
                                href={testi.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white border border-[#0A66C2]/30 transition-all shadow-2xs group/li cursor-pointer"
                                title={lang === 'en' ? 'View on LinkedIn' : 'Ver en LinkedIn'}
                              >
                                <Linkedin className="w-3 h-3 fill-current" />
                                <span>{lang === 'en' ? 'LinkedIn Recommendation' : 'Recomendación en LinkedIn'}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/li:opacity-100" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/30 shadow-2xs">
                                <Linkedin className="w-3 h-3 fill-[#0A66C2]" />
                                <span>{lang === 'en' ? 'LinkedIn Recommendation' : 'Recomendación en LinkedIn'}</span>
                              </span>
                            ))}
                          {testi.sourceType === 'doctoralia' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-teal-600/10 text-teal-800 border border-teal-600/30 shadow-2xs">
                              <ShieldCheck className="w-3 h-3 text-teal-600" />
                              <span>{lang === 'en' ? 'Verified Doctoralia' : 'Doctoralia Verificada'}</span>
                            </span>
                          )}
                          {testi.sourceType === 'whatsapp' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 shadow-2xs">
                              <MessageCircle className="w-3 h-3 text-[#128C7E]" />
                              <span>{lang === 'en' ? 'WhatsApp Message' : 'Mensaje de WhatsApp'}</span>
                            </span>
                          )}
                          {testi.sourceType === 'email' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-stone-100 text-stone-700 border border-stone-300 shadow-2xs">
                              <Mail className="w-3 h-3 text-stone-600" />
                              <span>{lang === 'en' ? 'Email Recommendation' : 'Recomendación por Correo'}</span>
                            </span>
                          )}
                          {testi.date && (
                            <span className="text-[10.5px] text-stone-400 font-medium ml-auto">
                              {testi.date}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Stars */}
                      {testi.stars && testi.stars > 0 ? (
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: Math.min(5, Math.max(1, Math.round(testi.stars))) }).map((_, sIdx) => (
                              <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-amber-800">{testi.stars}.0</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                          <span>{lang === 'en' ? 'Direct Recommendation' : 'Recomendación directa'}</span>
                        </div>
                      )}

                      <p className="text-[12px] sm:text-[13px] text-[#1a1c1c] font-medium leading-snug pr-4 italic">
                        "{testi.comment}"
                      </p>

                      {/* Verified Link Banner */}
                      {testi.sourceUrl && (
                        <a
                          href={testi.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all group/fblink shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.99] ${
                            testi.sourceType === 'linkedin'
                              ? 'bg-gradient-to-r from-sky-50 to-blue-50/70 hover:from-sky-100/90 hover:to-blue-100/80 border-sky-200/90 text-sky-950'
                              : 'bg-gradient-to-r from-blue-50 to-indigo-50/70 hover:from-blue-100/90 hover:to-indigo-100/80 border-blue-200/90 text-blue-950'
                          }`}
                          title={lang === 'en' ? 'Click to verify recommendation' : 'Haz clic para comprobar la recomendación'}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs group-hover/fblink:scale-105 transition-transform ${
                                testi.sourceType === 'linkedin' ? 'bg-[#0A66C2]' : 'bg-[#1877F2]'
                              }`}
                            >
                              {testi.sourceType === 'linkedin' ? (
                                <Linkedin className="w-4 h-4 fill-white" />
                              ) : (
                                <Facebook className="w-4 h-4 fill-white" />
                              )}
                            </div>
                            <div className="text-left min-w-0">
                              <div className="text-[12px] font-extrabold text-[#0d233a] flex items-center gap-1.5 leading-tight">
                                <span>
                                  {testi.sourceType === 'linkedin'
                                    ? (lang === 'en' ? 'Original LinkedIn Recommendation' : 'Recomendación original en LinkedIn')
                                    : (lang === 'en' ? 'Original Facebook Post' : 'Publicación original en Facebook')}
                                </span>
                                <ExternalLink
                                  className={`w-3 h-3 group-hover/fblink:translate-x-0.5 transition-transform shrink-0 ${
                                    testi.sourceType === 'linkedin' ? 'text-[#0A66C2]' : 'text-[#1877F2]'
                                  }`}
                                />
                              </div>
                              <div
                                className={`text-[10.5px] font-medium truncate flex items-center gap-1 mt-0.5 ${
                                  testi.sourceType === 'linkedin' ? 'text-[#0A66C2]' : 'text-blue-700'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                <span className="truncate">
                                  {testi.sourceUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 ml-2 text-[11px] font-extrabold px-3 py-1.5 rounded-xl text-white shadow-xs group-hover/fblink:shadow-sm transition-all flex items-center gap-1 ${
                              testi.sourceType === 'linkedin'
                                ? 'bg-[#0A66C2] hover:bg-[#084e96]'
                                : 'bg-[#1877F2] hover:bg-[#166fe5]'
                            }`}
                          >
                            <span>{lang === 'en' ? 'View' : 'Ver'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </a>
                      )}

                      {/* Evidence Screenshot */}
                      {testi.evidenceImageUrl && (
                        <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-2xs group/prev relative select-none">
                          <img
                            src={testi.evidenceImageUrl}
                            alt={lang === 'en' ? `Screenshot of review by ${testi.name}` : `Captura de reseña de ${testi.name}`}
                            className="w-full h-20 sm:h-24 object-cover object-top opacity-95 group-hover/prev:opacity-100 transition-opacity cursor-pointer"
                            onClick={() =>
                              setEvidenceModal({
                                imageUrl: testi.evidenceImageUrl!,
                                authorName: testi.name,
                                sourceUrl: testi.sourceUrl,
                                sourceType: testi.sourceType,
                                sourceLabel: testi.evidenceLabel
                              })
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-between p-2 pointer-events-none">
                            <span className="text-[10px] text-white font-bold flex items-center gap-1 drop-shadow">
                              <ImageIcon className="w-3 h-3 text-teal-300" />
                              <span>{lang === 'en' ? 'Verified original capture' : 'Captura original verificada'}</span>
                            </span>
                            <div className="flex items-center gap-1.5 pointer-events-auto">
                              <button
                                type="button"
                                onClick={() =>
                                  setEvidenceModal({
                                    imageUrl: testi.evidenceImageUrl!,
                                    authorName: testi.name,
                                    sourceUrl: testi.sourceUrl,
                                    sourceType: testi.sourceType,
                                    sourceLabel: testi.evidenceLabel
                                  })
                                }
                                className="text-[10px] bg-white/95 hover:bg-white text-stone-900 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-transform"
                              >
                                <ZoomIn className="w-3 h-3 text-[#00685f]" />
                                <span>{lang === 'en' ? 'Enlarge' : 'Ampliar'}</span>
                              </button>
                              {testi.sourceUrl && (
                                <a
                                  href={testi.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-[10px] text-white font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs active:scale-95 transition-transform ${
                                    testi.sourceType === 'linkedin'
                                      ? 'bg-[#0A66C2] hover:bg-[#084e96]'
                                      : 'bg-[#1877F2] hover:bg-[#166fe5]'
                                  }`}
                                >
                                  {testi.sourceType === 'linkedin' ? (
                                    <Linkedin className="w-2.5 h-2.5 fill-white" />
                                  ) : (
                                    <Facebook className="w-2.5 h-2.5 fill-white" />
                                  )}
                                  <span>{lang === 'en' ? 'Open post' : 'Abrir post'}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Author */}
                      <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                        <div className="flex items-center gap-2">
                          {testi.avatarUrl ? (
                            <img
                              src={testi.avatarUrl}
                              alt={testi.name}
                              className="w-7 h-7 rounded-full object-cover border border-stone-200"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                              {testi.name.charAt(0)}
                            </div>
                          )}
                          <div className="text-[11px]">
                            {testi.sourceUrl ? (
                              <a
                                href={testi.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-bold text-[#1a1c1c] transition-colors leading-tight inline-flex items-center gap-1 group/author cursor-pointer ${
                                  testi.sourceType === 'linkedin'
                                    ? 'hover:text-[#0A66C2]'
                                    : 'hover:text-[#1877F2]'
                                }`}
                              >
                                <span>{testi.name}</span>
                                <ExternalLink
                                  className={`w-2.5 h-2.5 opacity-70 group-hover/author:opacity-100 group-hover/author:translate-x-0.5 transition-all ${
                                    testi.sourceType === 'linkedin' ? 'text-[#0A66C2]' : 'text-[#1877F2]'
                                  }`}
                                />
                              </a>
                            ) : (
                              <span className="font-bold text-[#1a1c1c] block leading-tight">
                                {testi.name}
                              </span>
                            )}
                            <span className="text-[10px] text-[#6d7a77] block">
                              {testi.role}
                              {testi.company ? ` • ${testi.company}` : ''}
                            </span>
                          </div>
                        </div>

                        {testi.sourceUrl && (
                          <a
                            href={testi.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-[11px] font-extrabold inline-flex items-center gap-1 group/lnk ml-auto ${
                              testi.sourceType === 'linkedin'
                                ? 'text-[#0A66C2] hover:text-[#084e96]'
                                : 'text-[#1877F2] hover:text-[#166fe5]'
                            }`}
                          >
                            <span>{lang === 'en' ? 'Open link' : 'Abrir enlace'}</span>
                            <ExternalLink className="w-3 h-3 group-hover/lnk:translate-x-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    {totalReviews > 1 && (
                      <div className="flex items-center justify-between px-1 pt-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setTestimonialIdx((prev) => (prev - 1 + totalReviews) % totalReviews)
                          }
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Previous' : 'Anterior'}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {displayTestimonials.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => setTestimonialIdx(dotIdx)}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                dotIdx === safeIdx ? 'w-5 bg-[#00685f]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                              }`}
                              aria-label={`Testimonio ${dotIdx + 1}`}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setTestimonialIdx((prev) => (prev + 1) % totalReviews)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                        >
                          <span>{lang === 'en' ? 'Next' : 'Siguiente'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : null;

          // 4. Recursos Útiles para Decidir (Deduplicados y con texto completo)
          const resourcesBlock = hasLinks && filteredLinks && filteredLinks.length > 0 ? (
            <div className="mt-5 animate-in fade-in duration-150" id="section-resources">
              <h2 className="text-[11px] uppercase tracking-wider text-[#6d7a77] font-bold mb-2.5">
                {isCollaborationOriented
                  ? (lang === 'en' ? 'Resources & Supporting Documents' : 'Recursos y Documentos de Apoyo')
                  : (lang === 'en' ? 'Useful Resources to Decide' : 'Recursos Útiles para Decidir')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredLinks.map((link, idx) => {
                  const isPdf = /\.pdf($|\?)/i.test(link.url);
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[50px] p-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2.5 group transition-all active:scale-[0.99] shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[#00685f] group-hover:bg-[#00685f] group-hover:text-white transition-colors shrink-0"
                          style={
                            profile.customPrimaryColor ? { color: profile.customPrimaryColor } : undefined
                          }
                        >
                          {renderLinkIcon(link.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[12.5px] font-semibold text-[#1a1c1c] group-hover:text-[#00685f] transition-colors block whitespace-normal leading-snug break-words">
                            {link.label}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            {link.category && (
                              <span className="text-[9.5px] text-[#6d7a77] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-stone-100 border border-stone-200/60">
                                {t.categories[link.category] || link.category}
                              </span>
                            )}
                            {isPdf && (
                              <span className="text-[9.5px] text-rose-700 uppercase font-extrabold px-1.5 py-0.2 rounded-md bg-rose-50 border border-rose-200/60">
                                PDF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 group-hover:text-[#00685f] transition-all shrink-0 ml-1" />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null;

          // Orden secuencial estructurado según perfil
          if (isCollaborationOriented) {
            return (
              <>
                {solutionsBlock}
                {networkingBlock}
                {testimonialsBlock}
                {resourcesBlock}
              </>
            );
          }

          return (
            <>
              {solutionsBlock}
              {testimonialsBlock}
              {resourcesBlock}
              {networkingBlock}
            </>
          );
        })()}

        {/* Section 6: Visitor Action Hub & Footer */}
        {/* 1. Primary Visitor Action: Connect & Share My Details */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              setSelectedLeadContext({ source: 'general' });
              setIsLeadModalOpen(true);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-teal-50 hover:bg-teal-100/90 text-[#00685f] border border-teal-200/90 text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f]"
          >
            <UserCheck className="w-4 h-4 text-[#00685f] shrink-0" />
            <span>{t.connectLeadBtn} {profile.shortName}</span>
          </button>
        </div>

        {/* 2. Secondary Visitor Actions: Compartir tarjeta & Ver código QR */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleQuickShare}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            title={lang === 'en' ? 'Share digital card' : 'Compartir tarjeta digital'}
            aria-label={lang === 'en' ? 'Share digital card' : 'Compartir tarjeta digital'}
          >
            <Share2 className="w-4 h-4 text-[#00685f] shrink-0" />
            <span>{lang === 'en' ? 'Share card' : 'Compartir tarjeta'}</span>
          </button>
          <button
            type="button"
            onClick={handleTriggerQR}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            title={lang === 'en' ? 'View QR code' : 'Ver código QR'}
            aria-label={lang === 'en' ? 'View QR code' : 'Ver código QR'}
          >
            <QrCode className="w-4 h-4 text-[#00685f] shrink-0" />
            <span>{lang === 'en' ? 'View QR code' : 'Ver código QR'}</span>
          </button>
        </div>

        {/* 3. Collapsible Executive Quick Toolkit Bar (Owner Utilities) */}
        <div className="mt-4 rounded-2xl bg-stone-100/90 border border-stone-200/90 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsToolkitExpanded((prev) => !prev)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-[11px] font-bold text-stone-600 hover:text-stone-900 cursor-pointer transition-colors"
            aria-expanded={isToolkitExpanded}
          >
            <span className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#00685f]" />
              <span>
                {lang === 'en'
                  ? 'Cardholder Utilities (QR Wallpaper • Email Signature • PIN)'
                  : 'Herramientas del Titular (Fondo QR • Firma Email • PIN)'}
              </span>
            </span>
            {isToolkitExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            )}
          </button>

          {isToolkitExpanded && (
            <div className="px-2.5 pb-2.5 pt-1 grid grid-cols-3 gap-1.5 text-center border-t border-stone-200/60 animate-in fade-in duration-150">
              <button
                type="button"
                onClick={() => setIsWallpaperModalOpen(true)}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-[11px] font-bold shadow-2xs border border-stone-200/80 flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                title={lang === 'en' ? 'Generate QR wallpaper for your smartphone' : 'Generar fondo de pantalla con QR para tu celular'}
              >
                <Smartphone className="w-3.5 h-3.5 text-[#00685f]" />
                <span>{lang === 'en' ? 'Wallpaper' : 'Fondo QR'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSignatureModalOpen(true)}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-[11px] font-bold shadow-2xs border border-stone-200/80 flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                title={lang === 'en' ? 'Create email signature for Gmail / Outlook' : 'Crear firma de correo para Gmail / Outlook'}
              >
                <Mail className="w-3.5 h-3.5 text-[#00685f]" />
                <span>{lang === 'en' ? 'Signature' : 'Firma Email'}</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAdminAccess && onOpenAdminAccess()}
                className="py-1.5 px-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#00685f] text-[11px] font-bold shadow-2xs border border-teal-200/80 flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                title={lang === 'en' ? 'Open Mini-CRM & prospects' : 'Abrir Buzón de Prospectos, Citas y Mini-CRM'}
              >
                <Users className="w-3.5 h-3.5 text-[#00685f]" />
                <span>{lang === 'en' ? 'CRM & Leads' : 'Buzón CRM'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Discrete Tribu Creativa QRO Platform Attribution */}
        <div className="mt-4 text-center">
          <a
            href="https://redconecta.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#6d7a77] hover:text-[#00685f] transition-colors font-medium group"
          >
            <span>Tecnología de Tarjetas Digitales por <strong className="font-bold text-stone-700 group-hover:text-[#00685f]">Tribu Creativa QRO • RedConecta MX</strong></span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 5. Verified Profile Identifier Footer */}
        <div className="mt-3 text-center pt-2.5 border-t border-stone-200/80">
          <p className="text-[11px] text-[#6d7a77] font-semibold">
            {t.verifiedCardText}
          </p>
          <div
            onClick={handleFooterTap}
            className="flex items-center justify-center gap-1.5 mt-0.5 text-[10px] text-[#6d7a77]/80 cursor-pointer select-none active:text-[#00685f] transition-colors"
            title={lang === 'en' ? 'Verified ID' : 'ID Verificado'}
          >
            <span>
              {t.verifiedCardId} <span className="font-mono">{profile.uid}</span>
            </span>
          </div>
        </div>

        {/* 6. Legal Compliance Footer (LFPDPPP • Términos • Derechos ARCO) */}
        <div className="mt-3 pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px] text-stone-400">
          <button
            onClick={() => handleOpenLegal('privacy')}
            className="hover:text-stone-700 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Privacy Notice (LFPDPPP)' : 'Aviso de Privacidad (LFPDPPP)'}
          </button>
          <span>•</span>
          <button
            onClick={() => handleOpenLegal('terms')}
            className="hover:text-stone-700 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Terms of Service' : 'Términos del Servicio'}
          </button>
          <span>•</span>
          <button
            onClick={() => handleOpenLegal('arco')}
            className="hover:text-stone-700 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'ARCO Privacy Rights' : 'Derechos ARCO'}
          </button>
        </div>
        <p className="mt-1 pb-1 text-[9px] text-stone-400/80 text-center">
          {lang === 'en'
            ? `Digital card technology platform © ${new Date().getFullYear()} RedConecta MX • Tribu Creativa QRO`
            : `Plataforma tecnológica de tarjetas digitales © ${new Date().getFullYear()} RedConecta MX • Tribu Creativa QRO`}
        </p>
      </div>

      {/* Floating Bottom Action Dock inside card - Appears when visitor scrolls past initial actions */}
      {isPastInitialActions && !isAnyModalOpen && (
        <div
          className={`${
            isStandalone ? 'fixed bottom-0 inset-x-0 max-w-[480px] mx-auto' : 'sticky bottom-0 inset-x-0'
          } p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center gap-2 z-40 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150`}
        >
          {primaryResolved.enabled && primaryResolved.isValid ? (
            <a
              href={primaryResolved.href}
              target={primaryResolved.isExternal ? '_blank' : undefined}
              rel={primaryResolved.isExternal ? 'noopener noreferrer' : undefined}
              onClick={() => {
                if (primaryResolved.actionType === 'calendar') {
                  recordActivity(profile.publicId, profile.shortName, 'calendar_click', 'Clic en Agendar Cita');
                } else if (primaryResolved.actionType === 'whatsapp') {
                  recordActivity(profile.publicId, profile.shortName, 'whatsapp_click', 'Clic en WhatsApp');
                } else if (primaryResolved.actionType === 'phone') {
                  recordActivity(profile.publicId, profile.shortName, 'call_click', 'Clic en Llamar');
                } else if (primaryResolved.actionType === 'email') {
                  recordActivity(profile.publicId, profile.shortName, 'email_click', 'Clic en Correo');
                } else {
                  recordActivity(profile.publicId, profile.shortName, 'link_click', `Clic en ${primaryResolved.label}`);
                }
              }}
              style={customButtonStyle}
              className={`flex-1 min-h-[46px] py-2 px-3 ${
                primaryResolved.actionType === 'whatsapp'
                  ? 'bg-[#128C7E] hover:bg-[#075E54] text-white'
                  : profile.customPrimaryColor
                  ? 'text-white'
                  : theme.primaryBtn
              } rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00685f]`}
            >
              {renderPrimaryIcon(primaryResolved.iconName, 'w-4 h-4 shrink-0')}
              <span className="whitespace-normal text-center leading-snug">{primaryResolved.label}</span>
            </a>
          ) : null}

          {/* Secondary Action: Save Contact (vCard) */}
          <button
            type="button"
            onClick={onDownloadVCard}
            className={`${
              primaryResolved.enabled && primaryResolved.isValid
                ? 'px-3 h-[46px] bg-stone-100 hover:bg-stone-200 text-[#1a1c1c] border border-stone-300 text-[12px]'
                : 'flex-1 min-h-[46px] px-4 bg-[#00685f] hover:bg-[#008378] text-white text-[13px] shadow-xs'
            } rounded-xl flex items-center justify-center gap-1.5 font-bold active:scale-95 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00685f]`}
            title={lang === 'en' ? 'Save contact to device' : 'Guardar contacto en el dispositivo'}
            aria-label={lang === 'en' ? 'Save contact to device' : 'Guardar contacto en el dispositivo'}
          >
            <UserPlus className="w-4 h-4 text-current shrink-0" />
            <span>
              {primaryResolved.enabled && primaryResolved.isValid
                ? (lang === 'en' ? 'Save' : 'Guardar')
                : (lang === 'en' ? 'Save contact' : 'Guardar contacto')}
            </span>
          </button>

          {/* Visitor Action: Share Card */}
          <button
            type="button"
            onClick={handleQuickShare}
            className="w-11 h-[46px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center border border-emerald-200 active:scale-95 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
            title={lang === 'en' ? 'Share digital card' : 'Compartir tarjeta digital'}
            aria-label={lang === 'en' ? 'Share digital card' : 'Compartir tarjeta digital'}
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Visitor Action: View QR Code */}
          <button
            type="button"
            onClick={handleTriggerQR}
            className="w-11 h-[46px] bg-stone-100 hover:bg-stone-200 text-[#1a1c1c] rounded-xl flex items-center justify-center border border-stone-300 active:scale-95 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00685f]"
            title={lang === 'en' ? 'View QR code' : 'Ver código QR'}
            aria-label={lang === 'en' ? 'View QR code' : 'Ver código QR'}
          >
            <QrCode className="w-4 h-4 text-stone-700" />
          </button>
        </div>
      )}

            {/* Direct Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setSelectedLeadContext(null);
        }}
        profile={profile}
        onShowToast={onShowToast || (() => {})}
        lang={lang}
        context={selectedLeadContext}
        onClearContext={() => setSelectedLeadContext(null)}
      />

      {/* Lockscreen Wallpaper Generator Modal */}
      <WallpaperModal
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        profile={profile}
        onShowToast={onShowToast || (() => {})}
      />

      {/* Email Signature Generator Modal */}
      <EmailSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        profile={profile}
        onShowToast={onShowToast || (() => {})}
      />

      {/* QR Code Modal (Exclusively QR code + Download SVG / PNG) */}
      <QRModal
        isOpen={isLocalQROpen}
        onClose={() => setIsLocalQROpen(false)}
        profile={profile}
        onShowToast={onShowToast || (() => {})}
        lang={lang}
      />

      {/* Share Modal (Exclusively Public Link + Copy + WhatsApp share) */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        onShowToast={onShowToast || (() => {})}
        lang={lang}
      />

      {/* Legal & Privacy Compliance Modal (LFPDPPP / Términos / ARCO) */}
      <LegalNoticeModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
        profileName={profile.shortName}
        onShowToast={onShowToast}
      />

      {/* Testimonial Evidence Lightbox Modal (Comprobante / Captura) */}
      {evidenceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setEvidenceModal(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-stone-200 relative flex flex-col max-h-[92vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#00685f] flex items-center justify-center border border-teal-200 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 leading-tight">
                    {lang === 'en' ? 'Verified Recommendation Proof' : 'Comprobante de Reseña Verificada'}
                  </h4>
                  <p className="text-[10.5px] text-stone-500 truncate max-w-[240px] sm:max-w-xs">
                    {lang === 'en' ? `Recommendation from ${evidenceModal.authorName}` : `Recomendación de ${evidenceModal.authorName}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvidenceModal(null)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
                title={lang === 'en' ? 'Close viewer' : 'Cerrar visor'}
                aria-label={lang === 'en' ? 'Close viewer' : 'Cerrar visor'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image viewport */}
            <div className="p-3 sm:p-4 overflow-auto flex items-center justify-center bg-stone-100/70 max-h-[70vh]">
              <img
                src={evidenceModal.imageUrl}
                alt={lang === 'en' ? `Recommendation proof from ${evidenceModal.authorName}` : `Evidencia de recomendación de ${evidenceModal.authorName}`}
                className="max-w-full max-h-[66vh] rounded-xl object-contain shadow-md border border-stone-300 bg-white"
              />
            </div>

            {/* Footer with External Link if available */}
            <div className="p-3.5 border-t border-stone-200 bg-white flex items-center justify-between gap-3">
              {evidenceModal.sourceUrl ? (
                <a
                  href={evidenceModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 ${
                    evidenceModal.sourceType === 'linkedin'
                      ? 'bg-[#0A66C2] hover:bg-[#084e96] text-white'
                      : evidenceModal.sourceType === 'facebook'
                      ? 'bg-[#1877F2] hover:bg-[#166fe5] text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {evidenceModal.sourceType === 'linkedin' && (
                    <Linkedin className="w-3.5 h-3.5 fill-white shrink-0" />
                  )}
                  {evidenceModal.sourceType === 'facebook' && (
                    <Facebook className="w-3.5 h-3.5 fill-white shrink-0" />
                  )}
                  <span>
                    {evidenceModal.sourceLabel ||
                      (evidenceModal.sourceType === 'linkedin'
                        ? (lang === 'en' ? 'View recommendation on LinkedIn' : 'Ver recomendación en LinkedIn')
                        : evidenceModal.sourceType === 'facebook'
                        ? (lang === 'en' ? 'View post on Facebook' : 'Ver publicación en Facebook')
                        : (lang === 'en' ? 'View original publication' : 'Ver publicación original'))}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-0.5 opacity-80" />
                </a>
              ) : (
                <span className="text-[11px] text-stone-500 font-medium">
                  {lang === 'en' ? 'Verified original capture' : 'Captura original verificada'}
                </span>
              )}

              <button
                type="button"
                onClick={() => setEvidenceModal(null)}
                className="py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                {lang === 'en' ? 'Close' : 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
