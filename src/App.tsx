import React, { useState, useEffect } from 'react';
import { ParticipantProfile, CardTheme } from './types/card';
import { ProfileFeatures } from './types/meeting';
import { INITIAL_PROFILES } from './data/profiles';
import { DigitalCard } from './components/DigitalCard';
import { SimulatorHeader } from './components/SimulatorHeader';
import { SimulatorSidebar } from './components/SimulatorSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAccessModal } from './components/AdminAccessModal';
import { QRModal } from './components/QRModal';
import { SpecModal } from './components/SpecModal';
import { EditProfileModal } from './components/EditProfileModal';
import { CreateProfileModal } from './components/CreateProfileModal';
import { ClientDeliveryModal } from './components/ClientDeliveryModal';
import { ClientStatsView } from './components/ClientStatsView';
import { HomePage } from './components/HomePage';
import { ClientPortalModal } from './components/ClientPortalModal';
import { ClientPinModal } from './components/ClientPinModal';
import { Toast } from './components/Toast';
import { downloadVCardFile } from './utils/vcard';
import { recordActivity } from './utils/analytics';
import { decodeCardPayload } from './utils/qr';
import {
  getCloudProfile,
  getAllCloudProfiles,
  saveCloudProfile,
  deleteCloudProfile,
  seedInitialProfilesIfEmpty
} from './services/cardService';
import { updateCardHeadSEO } from './utils/seo';
import {
  Smartphone,
  Maximize2,
  AlertCircle,
  ArrowLeft,
  Plus,
  PauseCircle,
  CheckCircle,
  LayoutDashboard,
  ShieldCheck,
  Eye,
  Lock
} from 'lucide-react';

const STORAGE_KEY = 'redconecta_profiles_v5';
const ADMIN_PIN_KEY = 'redconecta_admin_pin_v1';
const ADMIN_SESSION_KEY = 'redconecta_admin_session_v1';
const DELETED_PROFILES_KEY = 'redconecta_deleted_ids_v1';

function getDeletedIdsSet(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.map((id) => String(id).trim().toLowerCase()));
      }
    }
  } catch {}
  return new Set();
}

function normalizeProfile(p: ParticipantProfile): ParticipantProfile {
  const isSara = p.publicId.trim().toLowerCase() === 'sara-sazedi';
  return {
    ...p,
    pin: p.pin || '1234',
    features: {
      hasMiniCrm: p.features?.hasMiniCrm !== undefined ? p.features.hasMiniCrm : true,
      hasMeetingIntelligence:
        p.features?.hasMeetingIntelligence !== undefined ? p.features.hasMeetingIntelligence : isSara,
      aiMinutesQuota: p.features?.aiMinutesQuota || 120,
      aiMinutesUsed: p.features?.aiMinutesUsed !== undefined ? p.features.aiMinutesUsed : (isSara ? 26 : 0)
    }
  };
}

function deduplicateProfiles(list: ParticipantProfile[]): ParticipantProfile[] {
  const seen = new Set<string>();
  const result: ParticipantProfile[] = [];
  for (const item of list) {
    if (!item || !item.publicId) continue;
    const key = item.publicId.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalizeProfile(item));
    }
  }
  return result;
}

export default function App() {
  const [profiles, setProfiles] = useState<ParticipantProfile[]>(() => {
    const deleted = getDeletedIdsSet();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ParticipantProfile[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 1. Deduplicate stored items and strictly exclude any deleted profiles
          const filtered = deduplicateProfiles(parsed).filter(
            (p) => !deleted.has(p.publicId.trim().toLowerCase())
          );
          if (filtered.length > 0) {
            return filtered;
          }
        }
      }
    } catch {
      // Fallback
    }

    // First time or empty: load initial profiles excluding any marked as deleted
    const initialNonDeleted = INITIAL_PROFILES.filter(
      (p) => !deleted.has(p.publicId.trim().toLowerCase())
    );
    return deduplicateProfiles(initialNonDeleted.length > 0 ? initialNonDeleted : INITIAL_PROFILES);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTheme, setActiveTheme] = useState<CardTheme>(profiles[0]?.themeKey || 'ejecutivo');
  const [deviceScale, setDeviceScale] = useState<'standard' | 'compact'>('standard');
  const [isStandaloneView, setIsStandaloneView] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [notFoundId, setNotFoundId] = useState<string | null>(null);

  // Home Page & Navigation State
  const [isHome, setIsHome] = useState<boolean>(() => {
    try {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      if (
        path.startsWith('/c/') ||
        path.endsWith('/stats') ||
        path === '/admin' ||
        path === '/admin/' ||
        path === '/studio' ||
        path === '/studio/' ||
        params.get('c') ||
        params.get('id') ||
        params.get('admin') ||
        params.get('studio') ||
        hash.includes('admin') ||
        hash.includes('studio') ||
        (hash.startsWith('#/c/') && hash.length > 4)
      ) {
        return false;
      }
    } catch {}
    return true;
  });

  const [isClientPortalOpen, setIsClientPortalOpen] = useState<boolean>(false);
  const [adminAuthTarget, setAdminAuthTarget] = useState<'studio' | 'dashboard'>('studio');

  // Admin Security & Privacy State
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(ADMIN_PIN_KEY) || '1234';
    } catch {
      return '1234';
    }
  });

  const [isAdminSession, setIsAdminSession] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminAccessModalOpen, setIsAdminAccessModalOpen] = useState<boolean>(false);
  const [hideAdminPreviewBar, setHideAdminPreviewBar] = useState<boolean>(false);

  // Modals state
  const [isQROpen, setIsQROpen] = useState<boolean>(false);
  const [isSpecOpen, setIsSpecOpen] = useState<boolean>(false);
  const [specTab, setSpecTab] = useState<'json' | 'vcard' | 'gcp' | 'qa'>('json');
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState<boolean>(false);
  const [isClientStatsOpen, setIsClientStatsOpen] = useState<boolean>(false);
  const [isClientPinModalOpen, setIsClientPinModalOpen] = useState<boolean>(false);
  const [targetPinProfile, setTargetPinProfile] = useState<ParticipantProfile | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Save to localStorage whenever profiles change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicateProfiles(profiles)));
    } catch {
      // Ignore
    }
  }, [profiles]);

  // Load cloud profiles from Firestore
  useEffect(() => {
    let isMounted = true;
    getAllCloudProfiles().then((cloudList) => {
      if (!isMounted) return;
      const deleted = getDeletedIdsSet();
      if (cloudList && cloudList.length > 0) {
        const nonDeletedCloud = cloudList.filter(
          (p) => !deleted.has(p.publicId.trim().toLowerCase())
        );
        if (nonDeletedCloud.length > 0) {
          setProfiles((prev) => {
            const nonDeletedPrev = prev.filter((p) => !deleted.has(p.publicId.trim().toLowerCase()));
            return deduplicateProfiles([...nonDeletedCloud, ...nonDeletedPrev]);
          });
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update dynamic SEO, Open Graph & Schema.org JSON-LD structured data
  useEffect(() => {
    if (profiles[currentIndex]) {
      updateCardHeadSEO(profiles[currentIndex]);
    }
  }, [profiles, currentIndex]);

  // Robust route parser for /c/:id, #/c/:id, ?c=:id, ?id=:id, ?d=:payload
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 0. Check for portable card payload (?d=...)
    const portableData = params.get('d');
    if (portableData) {
      const decodedCard = decodeCardPayload(portableData);
      if (decodedCard && decodedCard.publicId) {
        setProfiles((prev) => {
          const cleanId = decodedCard.publicId.trim().toLowerCase();
          const filtered = prev.filter((p) => p.publicId.trim().toLowerCase() !== cleanId);
          return [decodedCard, ...filtered];
        });
        setCurrentIndex(0);
        setActiveTheme(decodedCard.themeKey);
        setIsStandaloneView(true);
        recordActivity(decodedCard.publicId, decodedCard.shortName, 'view', 'Vista de Tarjeta (QR Portátil)');
        return;
      }
    }

    // Check for explicit admin route
    if (
      params.get('admin') === 'true' ||
      params.get('admin') === '1' ||
      window.location.pathname === '/admin' ||
      window.location.pathname === '/admin/' ||
      window.location.hash.includes('admin')
    ) {
      setIsHome(false);
      setAdminAuthTarget('dashboard');
      if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
        setIsAdminSession(true);
        setIsDashboardOpen(true);
      } else {
        setIsAdminSession(false);
        setIsDashboardOpen(false);
        setIsAdminAccessModalOpen(true);
      }
      return;
    }

    // Check for explicit studio route
    if (
      params.get('studio') === 'true' ||
      window.location.pathname === '/studio' ||
      window.location.pathname === '/studio/' ||
      window.location.hash.includes('studio')
    ) {
      setIsHome(false);
      setAdminAuthTarget('studio');
      if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
        setIsAdminSession(true);
        setIsDashboardOpen(false);
        setIsStandaloneView(false);
      } else {
        setIsAdminSession(false);
        setIsAdminAccessModalOpen(true);
      }
      return;
    }

    const parseTargetId = (): string | null => {
      const pathMatch = window.location.pathname.match(/\/c\/([a-zA-Z0-9_-]+)/);
      if (pathMatch && pathMatch[1]) return pathMatch[1];

      const hashMatch = window.location.hash.match(/#(?:\/c\/)?([a-zA-Z0-9_-]+)/);
      if (hashMatch && hashMatch[1] && hashMatch[1] !== 'root' && hashMatch[1] !== 'admin' && hashMatch[1] !== 'studio') {
        return hashMatch[1];
      }

      const queryId = params.get('c') || params.get('id');
      if (queryId) return queryId;

      return null;
    };

    const targetId = parseTargetId();
    const isStatsRoute =
      window.location.pathname.endsWith('/stats') ||
      window.location.hash.includes('stats') ||
      params.get('stats') === 'true';

    if (isStatsRoute) {
      setIsHome(false);
      const targetSlug = (targetId || '').toLowerCase();
      const hasAuth =
        sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ||
        (targetSlug && sessionStorage.getItem(`client_auth_${targetSlug}`) === 'true');

      if (hasAuth) {
        setIsClientStatsOpen(true);
      } else {
        const matched = profiles.find((p) => p.publicId.toLowerCase() === targetSlug);
        setTargetPinProfile(matched || null);
        setIsClientPinModalOpen(true);
        setIsClientStatsOpen(false);
      }
    }

    if (targetId) {
      setIsHome(false);
      const lower = targetId.toLowerCase();
      const foundIdx = profiles.findIndex(
        (p) => p.publicId.toLowerCase() === lower || p.uid.toLowerCase() === lower
      );
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
        setActiveTheme(profiles[foundIdx].themeKey);
        setIsStandaloneView(true);
        setNotFoundId(null);
        // Record view event
        recordActivity(profiles[foundIdx].publicId, profiles[foundIdx].shortName, 'view', 'Vista de Tarjeta');
      } else {
        // Query Firestore for this card
        getCloudProfile(targetId).then((cloudCard) => {
          if (cloudCard) {
            setProfiles((prev) => deduplicateProfiles([cloudCard, ...prev]));
            setCurrentIndex(0);
            setActiveTheme(cloudCard.themeKey);
            setIsStandaloneView(true);
            setNotFoundId(null);
            recordActivity(cloudCard.publicId, cloudCard.shortName, 'view', 'Vista de Tarjeta (Cloud)');
          } else {
            setNotFoundId(targetId);
          }
        });
      }
    }
  }, [profiles]);

  // Keyboard navigation & modal dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQROpen(false);
        setIsSpecOpen(false);
        setIsEditOpen(false);
        setIsCreateOpen(false);
        setIsDeliveryOpen(false);
        setIsAdminAccessModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentProfile = profiles[currentIndex] || profiles[0];

  const handleSelectProfile = (idx: number) => {
    setCurrentIndex(idx);
    setActiveTheme(profiles[idx].themeKey);
    setNotFoundId(null);
    showToast(`Perfil activo: ${profiles[idx].shortName}`);
    recordActivity(profiles[idx].publicId, profiles[idx].shortName, 'view', 'Cambio de Perfil');
  };

  const handleThemeChange = (newTheme: CardTheme) => {
    setActiveTheme(newTheme);
    showToast(`Tema visual cambiado a: ${newTheme.toUpperCase()}`);
  };

  const handleDownloadVCard = () => {
    const success = downloadVCardFile(currentProfile);
    if (success) {
      recordActivity(currentProfile.publicId, currentProfile.shortName, 'vcard_download', 'Descarga vCard 3.0');
      showToast(
        `Archivo de contacto (.vcf) de ${currentProfile.shortName} descargado. Ábrelo en tu teléfono para confirmar su incorporación a tu agenda.`
      );
    } else {
      showToast('Ocurrió un error al generar la vCard.');
    }
  };

  const handleOpenQRModal = (publicId?: string) => {
    if (publicId) {
      const targetIdx = profiles.findIndex((p) => p.publicId === publicId);
      if (targetIdx !== -1) {
        setCurrentIndex(targetIdx);
        setActiveTheme(profiles[targetIdx].themeKey);
      }
    }
    recordActivity(currentProfile.publicId, currentProfile.shortName, 'qr_scan', 'Simulación Escaneo QR');
    setIsQROpen(true);
  };

  const handleOpenSpec = (tab: 'json' | 'vcard' | 'gcp' | 'qa' = 'json') => {
    setSpecTab(tab);
    setIsSpecOpen(true);
  };

  const handleSaveProfile = (updated: ParticipantProfile) => {
    const targetId = updated.publicId.trim().toLowerCase();
    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.publicId.trim().toLowerCase() === targetId);
      let updatedProfiles: ParticipantProfile[];
      if (idx !== -1) {
        updatedProfiles = [...prev];
        updatedProfiles[idx] = updated;
      } else {
        const copy = [...prev];
        if (copy[currentIndex]) {
          copy[currentIndex] = updated;
          updatedProfiles = copy;
        } else {
          updatedProfiles = [updated, ...prev];
        }
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
      } catch {}
      return updatedProfiles;
    });
    setActiveTheme(updated.themeKey);
    saveCloudProfile(updated).then((ok) => {
      if (ok) showToast('Tarjeta sincronizada en la nube.');
    });
  };

  const handleCreateProfile = (newCard: ParticipantProfile) => {
    const cleanId = newCard.publicId.trim().toLowerCase();

    // If ID was in tombstone, remove it
    const currentDeleted = getDeletedIdsSet();
    if (currentDeleted.has(cleanId)) {
      currentDeleted.delete(cleanId);
      try {
        localStorage.setItem(DELETED_PROFILES_KEY, JSON.stringify(Array.from(currentDeleted)));
      } catch {}
    }

    setProfiles((prev) => {
      const filtered = prev.filter((p) => p.publicId.trim().toLowerCase() !== cleanId);
      const updated = [newCard, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setCurrentIndex(0);
    setActiveTheme(newCard.themeKey);
    recordActivity(newCard.publicId, newCard.shortName, 'view', 'Publicación Inicial');
    saveCloudProfile(newCard).then((ok) => {
      if (ok) {
        showToast(`Tarjeta de "${newCard.shortName}" guardada en la nube.`);
      }
    });
  };

  const handleDeleteProfile = (target: string | number) => {
    if (profiles.length <= 1) {
      showToast('Se requiere mantener al menos una tarjeta en el directorio.');
      return;
    }
    let targetProfile: ParticipantProfile | undefined;
    if (typeof target === 'number') {
      targetProfile = profiles[target];
    } else {
      const cleanTarget = target.trim().toLowerCase();
      targetProfile = profiles.find((p) => p.publicId.trim().toLowerCase() === cleanTarget);
    }
    if (!targetProfile) return;

    const deletedName = targetProfile.shortName;
    const targetPublicId = targetProfile.publicId.trim().toLowerCase();

    // 1. Persist to tombstone deleted set
    const currentDeleted = getDeletedIdsSet();
    currentDeleted.add(targetPublicId);
    try {
      localStorage.setItem(DELETED_PROFILES_KEY, JSON.stringify(Array.from(currentDeleted)));
    } catch {}

    // 2. Remove from state and update localStorage immediately
    const remaining = profiles.filter((p) => p.publicId.trim().toLowerCase() !== targetPublicId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    } catch {}
    setProfiles(remaining);

    // 3. Delete from Firestore
    deleteCloudProfile(targetPublicId);

    // 4. Update current index & active theme
    setCurrentIndex(0);
    if (remaining[0]) {
      setActiveTheme(remaining[0].themeKey);
    }
    showToast(`Tarjeta de "${deletedName}" eliminada permanentemente.`);
  };

  // Toggle Publish / Paused status
  const handleToggleStatus = (publicId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.publicId === publicId) {
          const nextState = !p.published;
          const updated = { ...p, published: nextState };
          saveCloudProfile(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const handleUpdateProfileFeatures = (publicId: string, features: Partial<ProfileFeatures>) => {
    const targetId = publicId.trim().toLowerCase();
    let updatedProfile: ParticipantProfile | null = null;
    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.publicId.trim().toLowerCase() === targetId);
      if (idx === -1) return prev;
      const current = prev[idx];
      const mergedFeatures: ProfileFeatures = {
        hasMiniCrm: features.hasMiniCrm !== undefined ? features.hasMiniCrm : (current.features?.hasMiniCrm ?? true),
        hasMeetingIntelligence: features.hasMeetingIntelligence !== undefined ? features.hasMeetingIntelligence : (current.features?.hasMeetingIntelligence ?? false),
        aiMinutesQuota: features.aiMinutesQuota !== undefined ? features.aiMinutesQuota : (current.features?.aiMinutesQuota ?? 120),
        aiMinutesUsed: features.aiMinutesUsed !== undefined ? features.aiMinutesUsed : (current.features?.aiMinutesUsed ?? 0),
      };
      const updated: ParticipantProfile = {
        ...current,
        features: mergedFeatures,
      };
      updatedProfile = updated;
      const copy = [...prev];
      copy[idx] = updated;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
      } catch {}
      return copy;
    });

    if (updatedProfile) {
      saveCloudProfile(updatedProfile).then((ok) => {
        if (ok) showToast('Módulos de la tarjeta actualizados en la nube.');
      });
    }
  };

  // Admin PIN & Session Handlers
  const handleUpdatePin = (newPin: string) => {
    try {
      localStorage.setItem(ADMIN_PIN_KEY, newPin);
    } catch {}
    setAdminPin(newPin);
    showToast('PIN de administrador actualizado exitosamente.');
  };

  const handleLogoutAdmin = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
    setIsAdminSession(false);
    setIsDashboardOpen(false);
    setIsStandaloneView(false);
    setIsClientStatsOpen(false);
    setIsHome(true);
    window.history.pushState({}, '', '/');
    showToast('Sesión de administración cerrada. Modo público activo.');
  };

  const handleAdminAuthSuccess = () => {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch {}
    setIsAdminSession(true);
    setIsAdminAccessModalOpen(false);
    setIsHome(false);

    if (adminAuthTarget === 'dashboard') {
      setIsDashboardOpen(true);
      window.history.pushState({}, '', '/admin');
      showToast('Sesión de administración iniciada. Acceso concedido al Dashboard.');
    } else {
      setIsDashboardOpen(false);
      setIsStandaloneView(false);
      window.history.pushState({}, '', '/studio');
      showToast('Sesión iniciada. Bienvenido al Panel de Creación Studio.');
    }
  };

  const handleCloseAdminAccessModal = () => {
    setIsAdminAccessModalOpen(false);
    if (
      !isAdminSession &&
      (window.location.pathname.startsWith('/admin') ||
        window.location.pathname.startsWith('/studio') ||
        window.location.hash.includes('admin') ||
        window.location.hash.includes('studio'))
    ) {
      setIsHome(true);
      window.history.pushState({}, '', '/');
    }
  };

  // Client Mini-CRM Authentication Trigger (Protected by PIN)
  const handleRequestClientAuth = (targetProf: ParticipantProfile) => {
    const cleanSlug = targetProf.publicId.toLowerCase();
    const hasAuth =
      isAdminSession ||
      sessionStorage.getItem(`client_auth_${cleanSlug}`) === 'true';

    const idx = profiles.findIndex((p) => p.publicId.toLowerCase() === cleanSlug);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setActiveTheme(profiles[idx].themeKey);
    }

    if (hasAuth) {
      setIsHome(false);
      setIsDashboardOpen(false);
      setIsClientStatsOpen(true);
      window.history.pushState({}, '', `/c/${targetProf.publicId}/stats`);
    } else {
      setTargetPinProfile(targetProf);
      setIsClientPinModalOpen(true);
    }
  };

  // If a non-existent /c/:id was entered in the URL
  if (notFoundId) {
    // If external public visitor, render a clean and polite error without exposing directory
    if (!isAdminSession) {
      return (
        <div className="min-h-screen bg-[#f9f9f8] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-xs">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1c1c]">Tarjeta Digital No Encontrada</h1>
          <p className="text-stone-600 mt-2 max-w-md text-sm leading-relaxed">
            El enlace que estás intentando abrir no corresponde a una tarjeta activa en este momento. Por favor verifica el enlace o solicita una tarjeta actualizada.
          </p>
          <div className="mt-8 text-center text-xs text-stone-400">
            Tribu Creativa QRO • Tarjetas Digitales Profesionales
          </div>
        </div>
      );
    }

    // Admin 404 view with directory links & back to workbench
    return (
      <div className="min-h-screen bg-[#f9f9f8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a1c1c]">Tarjeta Digital No Encontrada</h1>
        <p className="text-stone-600 mt-2 max-w-md text-sm">
          El identificador <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono text-stone-800">/c/{notFoundId}</code> no corresponde a una tarjeta activa en este dispositivo.
        </p>

        {/* Quick Suggestions & Active profiles list */}
        <div className="mt-6 p-4 bg-white rounded-2xl border border-stone-200 max-w-md w-full text-left space-y-2 shadow-2xs">
          <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Tarjetas activas en el directorio:
          </p>
          <div className="space-y-1.5">
            {profiles.slice(0, 4).map((p, idx) => (
              <button
                key={`${p.publicId}-${idx}`}
                onClick={() => {
                  setNotFoundId(null);
                  setCurrentIndex(idx);
                  setActiveTheme(p.themeKey);
                  setIsStandaloneView(true);
                  window.history.pushState({}, '', `/c/${p.publicId}`);
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 border border-stone-200 text-xs text-stone-800 font-semibold cursor-pointer"
              >
                <span>{p.name} ({p.company})</span>
                <span className="text-[#00685f] font-mono text-[11px]">/c/{p.publicId} →</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              setNotFoundId(null);
              setCurrentIndex(0);
              window.history.pushState({}, '', '/');
            }}
            className="px-5 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Directorio Completo</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard Mode
  if (isDashboardOpen) {
    return (
      <div>
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <AdminDashboard
          profiles={profiles}
          onToggleStatus={handleToggleStatus}
          onOpenCardPreview={(pubId) => {
            const idx = profiles.findIndex((p) => p.publicId === pubId);
            if (idx !== -1) {
              setCurrentIndex(idx);
              setActiveTheme(profiles[idx].themeKey);
            }
            setIsDashboardOpen(false);
            setIsStandaloneView(true);
          }}
          onOpenEditProfile={(pubId) => {
            const idx = profiles.findIndex((p) => p.publicId === pubId);
            if (idx !== -1) {
              setCurrentIndex(idx);
              setActiveTheme(profiles[idx].themeKey);
            }
            setIsEditOpen(true);
          }}
          onOpenCreateProfile={() => setIsCreateOpen(true)}
          onOpenQR={handleOpenQRModal}
          onShowToast={showToast}
          onClose={() => setIsDashboardOpen(false)}
          adminPin={adminPin}
          onUpdatePin={handleUpdatePin}
          onLogoutAdmin={handleLogoutAdmin}
          onDeleteProfile={handleDeleteProfile}
          onOpenDelivery={(pubId) => {
            const idx = profiles.findIndex((p) => p.publicId === pubId);
            if (idx !== -1) {
              setCurrentIndex(idx);
              setActiveTheme(profiles[idx].themeKey);
            }
            setIsDeliveryOpen(true);
          }}
          onBackHome={() => {
            setIsDashboardOpen(false);
            setIsHome(true);
            window.history.pushState({}, '', '/');
          }}
          onUpdateProfileFeatures={handleUpdateProfileFeatures}
        />
        {/* Modals for when editing from dashboard */}
        <EditProfileModal
          key={`edit-dash-${currentProfile.publicId}`}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={currentProfile}
          onSave={handleSaveProfile}
          onShowToast={showToast}
          onDelete={handleDeleteProfile}
          canDelete={profiles.length > 1}
        />
        <CreateProfileModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateProfile}
          onShowToast={showToast}
          existingCount={profiles.length}
          existingIds={profiles.map((p) => p.publicId.toLowerCase())}
        />
        <ClientDeliveryModal
          key={`delivery-dash-${currentProfile.publicId}`}
          isOpen={isDeliveryOpen}
          onClose={() => setIsDeliveryOpen(false)}
          profile={currentProfile}
          onShowToast={showToast}
        />
        <QRModal
          key={`qr-dash-${currentProfile.publicId}`}
          isOpen={isQROpen}
          onClose={() => setIsQROpen(false)}
          profile={currentProfile}
          onShowToast={showToast}
        />
      </div>
    );
  }

  // Private Client Analytics View
  if (isClientStatsOpen) {
    return (
      <ClientStatsView
        profile={currentProfile}
        onBackToCard={() => {
          setIsClientStatsOpen(false);
          setIsStandaloneView(true);
          window.history.pushState({}, '', `/c/${currentProfile.publicId}`);
        }}
        onBackHome={() => {
          setIsClientStatsOpen(false);
          setIsHome(true);
          window.history.pushState({}, '', '/');
        }}
        onLockSession={() => {
          try {
            sessionStorage.removeItem(`client_auth_${currentProfile.publicId.toLowerCase()}`);
          } catch {}
          setIsClientStatsOpen(false);
          setIsStandaloneView(true);
          window.history.pushState({}, '', `/c/${currentProfile.publicId}`);
          showToast('Sesión cerrada. Panel Mini-CRM bloqueado con éxito.');
        }}
      />
    );
  }

  // Standalone Digital Card Mode (Clean mobile view without simulator frame)
  if (isStandaloneView) {
    return (
      <div className="min-h-screen bg-[#f0f2f1] flex flex-col items-center">
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        
        {/* Top Floating Bar: ONLY visible to logged-in organizers in preview mode */}
        {isAdminSession && !hideAdminPreviewBar ? (
          <div className="w-full bg-slate-900 text-white py-2 px-3 sticky top-0 z-30 flex items-center justify-between max-w-md mx-auto shadow-md rounded-b-xl text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-stone-200 text-[11px]">
                Previsualización (Admin)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsDashboardOpen(true)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-3 h-3 text-teal-400" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setIsStandaloneView(false)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-stone-300 font-medium text-[11px] cursor-pointer transition-colors"
              >
                Simulador
              </button>
              <button
                onClick={() => setHideAdminPreviewBar(true)}
                className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Ocultar barra de administración para ver exactamente la experiencia pública"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Ver como Público</span>
              </button>
            </div>
          </div>
        ) : isAdminSession && hideAdminPreviewBar ? (
          /* Subtle floating indicator allowing the admin to restore the preview toolbar */
          <button
            onClick={() => setHideAdminPreviewBar(false)}
            className="fixed top-2 right-2 z-40 bg-slate-900/80 backdrop-blur-md text-teal-300 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer shadow-sm transition-all opacity-40 hover:opacity-100"
            title="Restaurar barra de organizador"
          >
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            <span>Admin</span>
          </button>
        ) : null}

        {/* Digital Card or Paused Notice */}
        <main className="w-full max-w-[480px] flex-1">
          {!currentProfile.published ? (
            <div className="m-4 p-8 bg-white rounded-3xl border border-stone-200 text-center shadow-md space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <PauseCircle className="w-9 h-9" />
              </div>
              <h2 className="text-xl font-bold text-[#1a1c1c]">Tarjeta Temporalmente en Pausa</h2>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                La tarjeta digital de <strong>{currentProfile.name}</strong> ha sido pausada temporalmente por el organizador o el titular y no está disponible públicamente en este momento.
              </p>
              {isAdminSession && (
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleToggleStatus(currentProfile.publicId);
                      showToast(`Tarjeta de "${currentProfile.shortName}" reactivada con éxito.`);
                    }}
                    className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Reactivar Tarjeta Ahora (Admin)
                  </button>
                  <button
                    onClick={() => setIsStandaloneView(false)}
                    className="w-full py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Volver al Simulador
                  </button>
                </div>
              )}
            </div>
          ) : (
            <DigitalCard
              profile={currentProfile}
              activeTheme={activeTheme}
              onOpenQR={() => handleOpenQRModal()}
              onDownloadVCard={handleDownloadVCard}
              isStandalone={true}
              onOpenAdminAccess={() => handleRequestClientAuth(currentProfile)}
            />
          )}
        </main>

        {/* Modals */}
        <QRModal
          isOpen={isQROpen}
          onClose={() => setIsQROpen(false)}
          profile={currentProfile}
          onShowToast={showToast}
        />
        <AdminAccessModal
          isOpen={isAdminAccessModalOpen}
          onClose={handleCloseAdminAccessModal}
          onSuccess={handleAdminAuthSuccess}
          storedPin={adminPin}
        />
        <ClientPinModal
          isOpen={isClientPinModalOpen}
          onClose={() => {
            setIsClientPinModalOpen(false);
            if (window.location.pathname.endsWith('/stats')) {
              const active = targetPinProfile || currentProfile;
              window.history.pushState({}, '', `/c/${active.publicId}`);
            }
          }}
          profile={targetPinProfile || currentProfile}
          adminPin={adminPin}
          onSuccess={() => {
            const active = targetPinProfile || currentProfile;
            const targetIdx = profiles.findIndex(
              (p) => p.publicId.toLowerCase() === active.publicId.toLowerCase()
            );
            if (targetIdx !== -1) {
              setCurrentIndex(targetIdx);
              setActiveTheme(profiles[targetIdx].themeKey);
            }
            setIsClientPinModalOpen(false);
            setIsHome(false);
            setIsDashboardOpen(false);
            setIsClientStatsOpen(true);
            window.history.pushState({}, '', `/c/${active.publicId}/stats`);
            showToast(`¡Bienvenida/o ${active.shortName}! Acceso concedido al panel.`);
          }}
        />
      </div>
    );
  }

  // Home Page Mode (Marketing Landing + Controlled Gateways)
  if (isHome) {
    return (
      <div>
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <HomePage
          profiles={profiles}
          onOpenStudio={() => {
            if (isAdminSession) {
              setIsHome(false);
              setIsDashboardOpen(false);
              setIsStandaloneView(false);
              window.history.pushState({}, '', '/studio');
            } else {
              setAdminAuthTarget('studio');
              setIsAdminAccessModalOpen(true);
            }
          }}
          onOpenDashboard={() => {
            if (isAdminSession) {
              setIsHome(false);
              setIsDashboardOpen(true);
              window.history.pushState({}, '', '/admin');
            } else {
              setAdminAuthTarget('dashboard');
              setIsAdminAccessModalOpen(true);
            }
          }}
          onOpenClientPortal={() => setIsClientPortalOpen(true)}
          onPreviewCard={(pubId) => {
            const idx = profiles.findIndex((p) => p.publicId === pubId);
            if (idx !== -1) {
              setCurrentIndex(idx);
              setActiveTheme(profiles[idx].themeKey);
            }
            setIsHome(false);
            setIsStandaloneView(true);
            window.history.pushState({}, '', `/c/${pubId}`);
          }}
        />

        <AdminAccessModal
          isOpen={isAdminAccessModalOpen}
          onClose={handleCloseAdminAccessModal}
          onSuccess={handleAdminAuthSuccess}
          storedPin={adminPin}
        />

        <ClientPortalModal
          isOpen={isClientPortalOpen}
          onClose={() => setIsClientPortalOpen(false)}
          profiles={profiles}
          onSelectClientStats={(pubId) => {
            const matched = profiles.find((p) => p.publicId === pubId);
            setIsClientPortalOpen(false);
            if (matched) {
              handleRequestClientAuth(matched);
            }
          }}
        />

        <ClientPinModal
          isOpen={isClientPinModalOpen}
          onClose={() => {
            setIsClientPinModalOpen(false);
            if (window.location.pathname.endsWith('/stats')) {
              const active = targetPinProfile || currentProfile;
              window.history.pushState({}, '', `/c/${active.publicId}`);
            }
          }}
          profile={targetPinProfile || currentProfile}
          adminPin={adminPin}
          onSuccess={() => {
            const active = targetPinProfile || currentProfile;
            const targetIdx = profiles.findIndex(
              (p) => p.publicId.toLowerCase() === active.publicId.toLowerCase()
            );
            if (targetIdx !== -1) {
              setCurrentIndex(targetIdx);
              setActiveTheme(profiles[targetIdx].themeKey);
            }
            setIsClientPinModalOpen(false);
            setIsHome(false);
            setIsDashboardOpen(false);
            setIsClientStatsOpen(true);
            window.history.pushState({}, '', `/c/${active.publicId}/stats`);
            showToast(`¡Bienvenida/o ${active.shortName}! Acceso concedido al panel.`);
          }}
        />
      </div>
    );
  }

  // Simulator Workbench Mode (Desktop / Multi-pane Experience)
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f8] text-[#1a1c1c] antialiased selection:bg-[#00685f] selection:text-white">
      {/* Toast Banner */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Header */}
      <SimulatorHeader
        activeNav="Simulador"
        onNavClick={(nav) => {
          if (nav === 'Simulador') {
            setIsDashboardOpen(false);
          } else if (nav === 'Perfiles') {
            handleSelectProfile((currentIndex + 1) % profiles.length);
          }
        }}
        onOpenQR={() => handleOpenQRModal()}
        onDownloadVCard={handleDownloadVCard}
        onOpenSpec={handleOpenSpec}
        isStandaloneView={isStandaloneView}
        onToggleStandalone={() => setIsStandaloneView(!isStandaloneView)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        isDashboardActive={isDashboardOpen}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenDelivery={() => setIsDeliveryOpen(true)}
        onBackHome={() => {
          setIsHome(true);
          window.history.pushState({}, '', '/');
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <SimulatorSidebar
          profiles={profiles}
          currentIndex={currentIndex}
          onSelectProfile={handleSelectProfile}
          activeTheme={activeTheme}
          onChangeTheme={handleThemeChange}
          onDownloadVCard={handleDownloadVCard}
          onOpenQR={() => handleOpenQRModal()}
          onOpenSpec={handleOpenSpec}
          onOpenEditProfile={() => setIsEditOpen(true)}
          onOpenCreateProfile={() => setIsCreateOpen(true)}
          onDeleteProfile={handleDeleteProfile}
          onOpenDashboard={() => setIsDashboardOpen(true)}
          onLogoutAdmin={handleLogoutAdmin}
          onOpenDelivery={() => setIsDeliveryOpen(true)}
        />

        {/* Central Workspace: Interactive Smartphone Simulator */}
        <main className="flex-1 bg-white p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-start overflow-y-auto">
          {/* Device Controls Bar */}
          <div className="w-full max-w-md flex items-center justify-between mb-4 bg-[#f3f4f3] px-4 py-2 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentProfile.published ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-[12px] font-semibold text-[#1a1c1c]">
                {deviceScale === 'compact'
                  ? 'Simulador Móvil Compacto (360 × 740 px)'
                  : 'Simulador iPhone 15 Pro (390 × 844 px)'}
                {!currentProfile.published && ' [En Pausa]'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDeviceScale(deviceScale === 'standard' ? 'compact' : 'standard')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  deviceScale === 'compact'
                    ? 'bg-stone-300 text-stone-900 font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Alternar entre 390px y 360px compacto"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsStandaloneView(true)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                title="Ver Tarjeta en Pantalla Completa"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smartphone Frame Container */}
          <div
            className={`w-full ${
              deviceScale === 'compact' ? 'max-w-[360px] h-[750px]' : 'max-w-[400px] h-[830px]'
            } rounded-[44px] bg-slate-900 p-3 smartphone-chassis transition-all duration-300 relative flex flex-col`}
          >
            {/* Dynamic Island / Speaker */}
            <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-2 z-30 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 border border-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-blue-950/50"></div>
            </div>

            {/* Phone Screen Canvas (Interactive Web View) */}
            <div className="w-full flex-1 rounded-[32px] overflow-hidden bg-[#f9f9f8] relative flex flex-col border border-slate-700/50">
              {/* Screen Scrollable Viewport */}
              <div className="flex-1 overflow-y-auto custom-scroll">
                {!currentProfile.published ? (
                  <div className="p-6 m-4 bg-white rounded-2xl border border-stone-200 text-center space-y-3 mt-12">
                    <PauseCircle className="w-10 h-10 text-amber-500 mx-auto" />
                    <h3 className="font-bold text-stone-900 text-sm">Tarjeta en Pausa</h3>
                    <p className="text-xs text-stone-600">
                      Esta tarjeta está desactivada temporalmente. No es visible públicamente en el evento.
                    </p>
                    <button
                      onClick={() => handleToggleStatus(currentProfile.publicId)}
                      className="px-3 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Activar Tarjeta
                    </button>
                  </div>
                ) : (
                  <DigitalCard
                    profile={currentProfile}
                    activeTheme={activeTheme}
                    onOpenQR={() => handleOpenQRModal()}
                    onDownloadVCard={handleDownloadVCard}
                    isStandalone={false}
                    onOpenAdminAccess={() => handleRequestClientAuth(currentProfile)}
                  />
                )}
              </div>
            </div>

            {/* Phone Home Bar Indicator */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-2 shrink-0"></div>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <QRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        profile={currentProfile}
        onShowToast={showToast}
      />

      <AdminAccessModal
        isOpen={isAdminAccessModalOpen}
        onClose={handleCloseAdminAccessModal}
        onSuccess={handleAdminAuthSuccess}
        storedPin={adminPin}
      />

      <ClientPinModal
        isOpen={isClientPinModalOpen}
        onClose={() => {
          setIsClientPinModalOpen(false);
          if (window.location.pathname.endsWith('/stats')) {
            const active = targetPinProfile || currentProfile;
            window.history.pushState({}, '', `/c/${active.publicId}`);
          }
        }}
        profile={targetPinProfile || currentProfile}
        adminPin={adminPin}
        onSuccess={() => {
          const active = targetPinProfile || currentProfile;
          setIsClientPinModalOpen(false);
          setIsHome(false);
          setIsDashboardOpen(false);
          setIsClientStatsOpen(true);
          window.history.pushState({}, '', `/c/${active.publicId}/stats`);
          showToast(`¡Bienvenida/o ${active.shortName}! Acceso concedido al Mini-CRM.`);
        }}
      />

      <SpecModal
        isOpen={isSpecOpen}
        onClose={() => setIsSpecOpen(false)}
        profile={currentProfile}
        initialTab={specTab}
        onShowToast={showToast}
      />

      <EditProfileModal
        key={`edit-studio-${currentProfile.publicId}`}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={currentProfile}
        onSave={handleSaveProfile}
        onShowToast={showToast}
        onDelete={handleDeleteProfile}
        canDelete={profiles.length > 1}
      />

      <CreateProfileModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateProfile}
        onShowToast={showToast}
        existingCount={profiles.length}
        existingIds={profiles.map((p) => p.publicId.toLowerCase())}
      />

      <ClientDeliveryModal
        key={`delivery-studio-${currentProfile.publicId}`}
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        profile={currentProfile}
        onShowToast={showToast}
      />
    </div>
  );
}
