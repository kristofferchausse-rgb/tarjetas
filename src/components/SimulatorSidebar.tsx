import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ParticipantProfile, CardTheme, ProfessionalProfileType } from '../types/card';
import {
  BadgeCheck,
  Download,
  QrCode,
  Code2,
  Cloud,
  ChevronRight,
  Plus,
  Edit3,
  UserCheck,
  Trash2,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  Send,
  Search,
  SlidersHorizontal,
  X,
  Copy,
  ExternalLink,
  Check,
  ArrowUpDown,
  Filter,
  Layers,
  Sparkles,
  List,
  LayoutGrid,
  ChevronDown
} from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  PROFESSIONAL_PROFILES,
  ALL_PROFESSIONAL_PROFILE_IDS,
  DEFAULT_PROFESSIONAL_PROFILE
} from '../data/professionalProfiles';

interface SimulatorSidebarProps {
  profiles: ParticipantProfile[];
  currentIndex: number;
  onSelectProfile: (index: number) => void;
  activeTheme: CardTheme;
  onChangeTheme: (theme: CardTheme) => void;
  onDownloadVCard: () => void;
  onOpenQR: (publicId?: string) => void;
  onOpenSpec: (tab?: 'json' | 'vcard' | 'gcp' | 'qa') => void;
  onOpenEditProfile: () => void;
  onOpenCreateProfile: () => void;
  onDeleteProfile: (publicId: string) => void;
  onOpenDashboard: () => void;
  onLogoutAdmin?: () => void;
  onOpenDelivery?: () => void;
  onOpenInviteClient?: () => void;
  onShowToast?: (msg: string) => void;
  onOpenEditSpecificProfile?: (publicId: string) => void;
}

type DensityMode = 'compact' | 'detailed';
type SortOption = 'recent' | 'name-asc' | 'name-desc' | 'company-asc';
type StatusFilter = 'all' | 'active' | 'paused';

export const SimulatorSidebar: React.FC<SimulatorSidebarProps> = ({
  profiles,
  currentIndex,
  onSelectProfile,
  activeTheme,
  onChangeTheme,
  onDownloadVCard,
  onOpenQR,
  onOpenSpec,
  onOpenEditProfile,
  onOpenCreateProfile,
  onDeleteProfile,
  onOpenDashboard,
  onLogoutAdmin,
  onOpenDelivery,
  onOpenInviteClient,
  onShowToast,
  onOpenEditSpecificProfile
}) => {
  const [profileToDelete, setProfileToDelete] = useState<ParticipantProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [archetypeFilter, setArchetypeFilter] = useState<string>('all');
  const [densityMode, setDensityMode] = useState<DensityMode>('detailed');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToolsAccordion, setShowToolsAccordion] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter & Sort Profiles
  const filteredAndSortedProfiles = useMemo(() => {
    // 1. Filter
    const filtered = profiles.filter((p) => {
      // Search matches
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.shortName.toLowerCase().includes(query) ||
        p.company.toLowerCase().includes(query) ||
        p.role.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.publicId.toLowerCase().includes(query);

      // Status matches
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.published) ||
        (statusFilter === 'paused' && !p.published);

      // Archetype matches
      const matchArchetype =
        archetypeFilter === 'all' ||
        (p.professionalProfile || DEFAULT_PROFESSIONAL_PROFILE) === archetypeFilter;

      return matchSearch && matchStatus && matchArchetype;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'company-asc') {
        return (a.company || '').localeCompare(b.company || '');
      }
      // 'recent' preserves default array order
      return 0;
    });
  }, [profiles, searchTerm, statusFilter, archetypeFilter, sortBy]);

  // Counts
  const totalCount = profiles.length;
  const activeCount = profiles.filter((p) => p.published).length;
  const pausedCount = totalCount - activeCount;

  // Selected Card
  const currentProfile = profiles[currentIndex] || profiles[0];

  const handleCopyLink = (p: ParticipantProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/c/${p.publicId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(p.publicId);
      setTimeout(() => setCopiedId(null), 2000);
      onShowToast?.(`Enlace de ${p.shortName} copiado: /c/${p.publicId}`);
    });
  };

  const getBadgeColor = (themeKey: CardTheme) => {
    switch (themeKey) {
      case 'ejecutivo':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'negocio':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'personal':
        return 'bg-orange-100 text-[#ac3400] border-orange-200';
    }
  };

  const getAvatarBg = (idx: number) => {
    const colors = [
      'bg-slate-800 text-white',
      'bg-teal-800 text-white',
      'bg-amber-800 text-white',
      'bg-purple-800 text-white',
      'bg-blue-800 text-white',
      'bg-rose-800 text-white'
    ];
    return colors[idx % colors.length];
  };

  return (
    <aside className="w-full lg:w-[360px] lg:shrink-0 bg-[#f4f5f4] border-r border-stone-200 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto custom-scroll text-[#1a1c1c]">
      <div className="space-y-4">
        {/* Header Panel */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/90">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-[15px] font-extrabold text-[#1a1c1c] tracking-tight">
                Tribu Creativa QRO
              </h2>
            </div>
            <p className="text-[11px] text-[#6d7a77]">Gestor de Tarjetas • Studio</p>
          </div>
          <button
            onClick={onOpenCreateProfile}
            className="px-2.5 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
            title="Crear nueva tarjeta digital para un cliente"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Tarjeta</span>
          </button>
        </div>

        {/* High Volume UX: Live Search & Discovery Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, empresa, rol... (/)"
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/10 shadow-2xs transition-all"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 hidden sm:inline-block">
                /
              </kbd>
            )}
          </div>

          {/* Status Segmented Control & Density Switcher */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-lg text-[11px] font-bold text-stone-600">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'hover:text-stone-900'
                }`}
              >
                Todas ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'active'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'hover:text-stone-900'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Activas ({activeCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('paused')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'paused'
                    ? 'bg-white text-amber-800 shadow-2xs'
                    : 'hover:text-stone-900'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Pausadas ({pausedCount})</span>
              </button>
            </div>

            {/* Density Toggle (Compact vs Detailed) */}
            <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg">
              <button
                onClick={() => setDensityMode('compact')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  densityMode === 'compact'
                    ? 'bg-white text-[#00685f] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Vista Compacta (Alta densidad para muchas tarjetas)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDensityMode('detailed')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  densityMode === 'detailed'
                    ? 'bg-white text-[#00685f] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Vista Detallada (Con badges de perfil y tema)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Archetype Filter & Sort Controls */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <select
              value={archetypeFilter}
              onChange={(e) => setArchetypeFilter(e.target.value)}
              className="w-full px-2 py-1 rounded-lg border border-stone-300 bg-white text-[11px] font-medium text-stone-700 focus:outline-none focus:border-[#00685f]"
            >
              <option value="all">Todos los Arquetipos</option>
              {ALL_PROFESSIONAL_PROFILE_IDS.map((pid) => (
                <option key={pid} value={pid}>
                  {PROFESSIONAL_PROFILES[pid].name.es}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-2 py-1 rounded-lg border border-stone-300 bg-white text-[11px] font-medium text-stone-700 focus:outline-none focus:border-[#00685f]"
            >
              <option value="recent">Orden: Recientes</option>
              <option value="name-asc">Nombre (A → Z)</option>
              <option value="name-desc">Nombre (Z → A)</option>
              <option value="company-asc">Empresa (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Scrollable Profiles List (Dynamic Height & Scalable) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Mostrando {filteredAndSortedProfiles.length} de {profiles.length} tarjetas
            </span>
            {(searchTerm || statusFilter !== 'all' || archetypeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setArchetypeFilter('all');
                }}
                className="text-[10px] text-[#00685f] hover:underline font-bold cursor-pointer"
              >
                Restablecer
              </button>
            )}
          </div>

          {/* The Cards Container */}
          <div className="space-y-1.5 max-h-[340px] overflow-y-auto custom-scroll pr-1">
            {filteredAndSortedProfiles.map((p) => {
              const originalIndex = profiles.findIndex((orig) => orig.publicId === p.publicId);
              const isSelected = originalIndex === currentIndex;
              const initials = p.name
                .replace(/^(Mtra\.|Mtro\.|Ing\.|Lic\.|Dr\.|Dra\.)\s+/, '')
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('');

              // 1. Compact View (High Density: ~42px)
              if (densityMode === 'compact') {
                return (
                  <div
                    key={`${p.publicId}-${originalIndex}`}
                    onClick={() => onSelectProfile(originalIndex)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all duration-150 flex items-center justify-between gap-2 relative group cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#00685f] bg-white shadow-xs'
                        : 'border border-transparent bg-white/70 hover:bg-white hover:border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {p.avatarUrl ? (
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-7 h-7 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-100"
                        />
                      ) : (
                        <div
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center shrink-0 text-[10px] shadow-2xs ${getAvatarBg(
                            originalIndex
                          )}`}
                        >
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 truncate">
                            {p.shortName || p.name}
                          </span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              p.published ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                            title={p.published ? 'Tarjeta Activa' : 'Tarjeta Pausada'}
                          />
                        </div>
                        <p className="text-[10px] text-stone-500 truncate">
                          {p.company || p.role}
                        </p>
                      </div>
                    </div>

                    {/* Quick Inline Actions */}
                    <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={(e) => handleCopyLink(p, e)}
                        className="p-1 text-stone-400 hover:text-[#00685f] hover:bg-teal-50 rounded-md cursor-pointer transition-colors"
                        title="Copiar enlace /c/..."
                      >
                        {copiedId === p.publicId ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenEditSpecificProfile) {
                            onOpenEditSpecificProfile(p.publicId);
                          } else {
                            onSelectProfile(originalIndex);
                            onOpenEditProfile();
                          }
                        }}
                        className="p-1 text-stone-400 hover:text-[#00685f] hover:bg-teal-50 rounded-md cursor-pointer transition-colors"
                        title="Editar esta tarjeta"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }

              // 2. Detailed View (Rich Card: ~80px)
              return (
                <div
                  key={`${p.publicId}-${originalIndex}`}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-start gap-2.5 relative group ${
                    isSelected
                      ? 'border-2 border-[#00685f] bg-white shadow-xs ring-2 ring-[#00685f]/10'
                      : 'border border-transparent bg-white/70 hover:bg-white hover:border-stone-200'
                  }`}
                >
                  <button
                    onClick={() => onSelectProfile(originalIndex)}
                    className="flex-1 flex items-start gap-2.5 min-w-0 text-left cursor-pointer"
                  >
                    {p.avatarUrl ? (
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-9 h-9 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100 shadow-2xs"
                      />
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs ${getAvatarBg(
                          originalIndex
                        )}`}
                      >
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-bold text-[#1a1c1c] truncate">{p.shortName}</p>
                        {p.verified && (
                          <UserCheck className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                        )}
                        {!p.published ? (
                          <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1 py-0.2 rounded font-bold">
                            Pausa
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 py-0.2 rounded font-bold">
                            Activa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6d7a77] truncate">{p.company}</p>

                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className="inline-block text-[9px] px-1.5 py-0.5 rounded font-bold bg-teal-50 text-teal-800 border border-teal-200/80">
                          {PROFESSIONAL_PROFILES[p.professionalProfile || DEFAULT_PROFESSIONAL_PROFILE]?.badgeLabel.es || 'Independiente'}
                        </span>
                        <span
                          className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-semibold border ${getBadgeColor(
                            p.themeKey
                          )}`}
                        >
                          {p.themeKey === 'ejecutivo'
                            ? 'Ejecutivo'
                            : p.themeKey === 'negocio'
                            ? 'Negocio'
                            : 'Personal'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Actions column on hover or selected */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={(e) => handleCopyLink(p, e)}
                      className="p-1 text-stone-400 hover:text-[#00685f] hover:bg-teal-50 rounded-lg cursor-pointer transition-colors"
                      title="Copiar enlace /c/..."
                    >
                      {copiedId === p.publicId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenEditSpecificProfile) {
                          onOpenEditSpecificProfile(p.publicId);
                        } else {
                          onSelectProfile(originalIndex);
                          onOpenEditProfile();
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-[#00685f] hover:bg-teal-50 rounded-lg cursor-pointer transition-colors"
                      title="Editar datos de esta tarjeta"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileToDelete(p);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title={`Eliminar tarjeta de ${p.shortName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredAndSortedProfiles.length === 0 && (
              <div className="p-6 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-white/60 space-y-2">
                <Search className="w-6 h-6 text-stone-300 mx-auto" />
                <p className="text-xs font-semibold text-stone-700">No se encontraron tarjetas</p>
                <p className="text-[11px] text-stone-400">
                  Ningún titular coincide con "{searchTerm}"
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setArchetypeFilter('all');
                  }}
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Ver todas las tarjetas
                </button>
              </div>
            )}
          </div>

          {onOpenInviteClient && (
            <button
              onClick={onOpenInviteClient}
              className="w-full mt-2 py-2 px-3 rounded-xl border border-amber-300/80 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Generar y enviar enlace de onboarding a un cliente"
            >
              <Send className="w-3.5 h-3.5 text-amber-700" />
              <span>Enviar Alta de Tarjeta a Cliente</span>
            </button>
          )}
        </div>

        {/* Selected Card Focus Cardlet */}
        {currentProfile && (
          <div className="p-3 bg-white rounded-2xl border border-teal-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00685f]">
                Tarjeta Activa en Simulador
              </span>
              <span className="text-[10px] font-mono text-stone-500 font-bold">
                /c/{currentProfile.publicId}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-stone-900 block truncate">
                  {currentProfile.name}
                </span>
                <span className="text-[11px] text-stone-500 truncate block">
                  {currentProfile.company}
                </span>
              </div>
              <button
                onClick={onOpenEditProfile}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#00685f] text-xs font-bold border border-teal-200 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                title="Editar tarjeta activa"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-stone-100">
              <button
                onClick={() => onOpenQR(currentProfile.publicId)}
                className="py-1 px-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-[11px] font-semibold text-stone-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3 h-3 text-stone-600" />
                <span>Ver QR</span>
              </button>
              {onOpenDelivery && (
                <button
                  onClick={onOpenDelivery}
                  className="py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Entregar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live Theme Switcher Override */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6d7a77] mb-1.5">
            Tema Visual del Simulador
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            {(['ejecutivo', 'negocio', 'personal'] as CardTheme[]).map((t) => {
              const isActive = activeTheme === t;
              return (
                <button
                  key={t}
                  onClick={() => onChangeTheme(t)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer capitalize ${
                    isActive
                      ? 'bg-white text-[#1a1c1c] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Testing Quick Actions & Dashboard Access */}
        <div>
          <button
            onClick={() => setShowToolsAccordion(!showToolsAccordion)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#6d7a77] mb-2 cursor-pointer hover:text-stone-900"
          >
            <span>Herramientas y Analítica</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showToolsAccordion ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div className="space-y-1.5">
            {/* Dashboard Trigger */}
            <button
              onClick={onOpenDashboard}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-[12px] font-bold text-[#00685f] text-left transition-colors cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#00685f]" />
                <span>Dashboard de Control & Métricas</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-200 text-teal-900 font-extrabold">
                Admin
              </span>
            </button>

            {/* Accordion tools */}
            {showToolsAccordion && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                <button
                  onClick={onDownloadVCard}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-[#1a1c1c] text-left transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Descargar .vcf real activo</span>
                </button>

                <button
                  onClick={() => onOpenSpec('json')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-[#1a1c1c] text-left transition-colors cursor-pointer shadow-2xs"
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-700" />
                  <span>Ver JSON estructurado</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-stone-200 mt-4">
        <button
          onClick={() => onOpenSpec('gcp')}
          className="w-full flex items-center justify-between text-left p-1.5 rounded-lg hover:bg-stone-200/60 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-[#00685f]" />
            <span>Despliegue GCP & CDN Spec</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </button>

        {onLogoutAdmin && (
          <button
            onClick={onLogoutAdmin}
            className="w-full mt-2.5 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión de Administrador</span>
          </button>
        )}
      </div>

      {/* Confirm Delete Card Modal */}
      <ConfirmDeleteModal
        isOpen={!!profileToDelete}
        onClose={() => setProfileToDelete(null)}
        onConfirm={() => {
          if (profileToDelete) {
            onDeleteProfile(profileToDelete.publicId);
            setProfileToDelete(null);
          }
        }}
        profile={profileToDelete}
        canDelete={profiles.length > 1}
      />
    </aside>
  );
};
