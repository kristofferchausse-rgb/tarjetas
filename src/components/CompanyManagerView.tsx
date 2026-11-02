import React, { useState, useMemo } from 'react';
import { CompanyAccount } from '../types/company';
import { ParticipantProfile } from '../types/card';
import {
  getCompanies,
  saveCompany,
  deleteCompany,
  linkMemberToCompany,
  unlinkMemberFromCompany,
  duplicateMemberCard,
  createMemberFromCorporateTemplate,
  resolveMemberBrand
} from '../services/companyService';
import {
  Building2,
  Users,
  Plus,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Link,
  Unlink,
  Palette,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Briefcase
} from 'lucide-react';

interface CompanyManagerViewProps {
  profiles: ParticipantProfile[];
  onUpdateProfiles: (updater: (prev: ParticipantProfile[]) => ParticipantProfile[]) => void;
  onOpenCardPreview: (publicId: string) => void;
  onOpenCompanyDirectory: (slug: string) => void;
  onShowToast: (msg: string) => void;
}

export const CompanyManagerView: React.FC<CompanyManagerViewProps> = ({
  profiles,
  onUpdateProfiles,
  onOpenCardPreview,
  onOpenCompanyDirectory,
  onShowToast
}) => {
  const [companies, setCompanies] = useState<CompanyAccount[]>(() => getCompanies());
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    const list = getCompanies();
    return list[0]?.id || '';
  });

  // Filters for members within selected company
  const [searchMember, setSearchMember] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');

  // Modals / forms state
  const [isEditingCompany, setIsEditingCompany] = useState<boolean>(false);
  const [companyFormData, setCompanyFormData] = useState<Partial<CompanyAccount>>({});
  const [isCreatingNewCompany, setIsCreatingNewCompany] = useState<boolean>(false);

  // Link existing member modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
  const [linkTargetPublicId, setLinkTargetPublicId] = useState<string>('');
  const [linkDepartment, setLinkDepartment] = useState<string>('');
  const [linkRoleStatement, setLinkRoleStatement] = useState<string>('');

  // Edit member link modal
  const [editingMember, setEditingMember] = useState<ParticipantProfile | null>(null);

  const activeCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedCompanyId) || companies[0];
  }, [companies, selectedCompanyId]);

  // Members of current company
  const companyMembers = useMemo(() => {
    if (!activeCompany) return [];
    return profiles.filter((p) => p.companyId === activeCompany.id);
  }, [profiles, activeCompany]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return companyMembers.filter((m) => {
      if (areaFilter !== 'all' && (m.companyDepartment || '') !== areaFilter) return false;
      if (statusFilter === 'active' && m.isCompanyActive === false) return false;
      if (statusFilter === 'inactive' && m.isCompanyActive !== false) return false;
      if (statusFilter === 'draft' && m.published) return false;

      if (searchMember.trim()) {
        const q = searchMember.toLowerCase();
        const matchName = (m.name || '').toLowerCase().includes(q);
        const matchRole = (m.role || '').toLowerCase().includes(q);
        const matchDept = (m.companyDepartment || '').toLowerCase().includes(q);
        const matchStmt = (m.companyRoleStatement || '').toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchDept && !matchStmt) return false;
      }
      return true;
    });
  }, [companyMembers, areaFilter, statusFilter, searchMember]);

  // Verifiable Administrative Summary Figures (Strictly non-fictitious)
  const adminSummary = useMemo(() => {
    const totalLinkedMembers = profiles.filter((p) => Boolean(p.companyId)).length;
    const totalPublicMembers = profiles.filter(
      (p) => Boolean(p.companyId) && p.isCompanyActive !== false && p.showInDirectory !== false && p.published
    ).length;
    const totalDraftCards = profiles.filter((p) => Boolean(p.companyId) && !p.published).length;
    return {
      totalCompanies: companies.length,
      totalLinkedMembers,
      totalPublicMembers,
      totalDraftCards
    };
  }, [companies, profiles]);

  // Unlinked profiles available to be linked
  const availableToLink = useMemo(() => {
    return profiles.filter((p) => p.companyId !== activeCompany?.id);
  }, [profiles, activeCompany]);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyFormData.name?.trim()) {
      onShowToast('El nombre de la empresa es obligatorio.');
      return;
    }
    const slug = (companyFormData.slug || companyFormData.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const companyToSave: CompanyAccount = {
      id: companyFormData.id || `company-${slug}-${Date.now().toString(36).slice(-4)}`,
      slug,
      name: companyFormData.name.trim(),
      tagline: companyFormData.tagline?.trim() || '',
      valueProp: companyFormData.valueProp?.trim() || '',
      industry: companyFormData.industry?.trim() || 'Servicios Profesionales',
      brand: {
        primaryColor: companyFormData.brand?.primaryColor || '#00685f',
        accentColor: companyFormData.brand?.accentColor || '#10b981',
        themeKey: companyFormData.brand?.themeKey || 'negocio',
        logoUrl: companyFormData.brand?.logoUrl || '',
        bannerImageUrl: companyFormData.brand?.bannerImageUrl || ''
      },
      channels: {
        website: companyFormData.channels?.website || '',
        linkedin: companyFormData.channels?.linkedin || '',
        phone: companyFormData.channels?.phone || '',
        email: companyFormData.channels?.email || '',
        address: companyFormData.channels?.address || ''
      },
      areas:
        companyFormData.areas && companyFormData.areas.length > 0
          ? companyFormData.areas
          : ['Dirección', 'Operaciones', 'Comercial'],
      links: companyFormData.links || []
    };

    const res = saveCompany(companyToSave);
    if (res.success) {
      const updated = getCompanies();
      setCompanies(updated);
      setSelectedCompanyId(companyToSave.id);
      setIsEditingCompany(false);
      setIsCreatingNewCompany(false);

      // If company brand changed, update profiles that inherit from this company
      onUpdateProfiles((prev) =>
        prev.map((p) => {
          if (p.companyId === companyToSave.id) {
            return {
              ...p,
              company: companyToSave.name,
              companySlug: companyToSave.slug,
              // If member does not have explicit brand override, refresh logo & color
              logoUrl: p.brandOverrides?.overrideBrand ? p.logoUrl : companyToSave.brand.logoUrl,
              customPrimaryColor: p.brandOverrides?.overrideBrand
                ? p.customPrimaryColor
                : companyToSave.brand.primaryColor
            };
          }
          return p;
        })
      );

      onShowToast(`Empresa "${companyToSave.name}" guardada con éxito.`);
    } else {
      onShowToast(res.error || 'Error al guardar empresa.');
    }
  };

  const handleConfirmLink = () => {
    if (!linkTargetPublicId || !activeCompany) return;
    const target = profiles.find((p) => p.publicId === linkTargetPublicId);
    if (!target) return;

    const linked = linkMemberToCompany(target, activeCompany, {
      department: linkDepartment || activeCompany.areas[0],
      roleStatement: linkRoleStatement.trim(),
      showInDirectory: true
    });

    onUpdateProfiles((prev) => prev.map((p) => (p.publicId === target.publicId ? linked : p)));
    setIsLinkModalOpen(false);
    setLinkTargetPublicId('');
    setLinkDepartment('');
    setLinkRoleStatement('');
    onShowToast(`Tarjeta de "${target.name || target.publicId}" vinculada a ${activeCompany.name}.`);
  };

  const handleUnlink = (member: ParticipantProfile) => {
    if (
      !window.confirm(
        `¿Desvincular a "${member.name || member.publicId}" de ${activeCompany?.name}? Su tarjeta individual y sus prospectos se conservarán intactos.`
      )
    ) {
      return;
    }

    const unlinked = unlinkMemberFromCompany(member);
    onUpdateProfiles((prev) => prev.map((p) => (p.publicId === member.publicId ? unlinked : p)));
    onShowToast(`Tarjeta desvinculada de la empresa. Datos personales y CRM conservados.`);
  };

  const handleDuplicate = (member: ParticipantProfile) => {
    const duplicated = duplicateMemberCard(member, { existingProfiles: profiles });
    onUpdateProfiles((prev) => [duplicated, ...prev]);
    onShowToast(
      `Tarjeta duplicada como "${duplicated.publicId}". Datos personales y credenciales vaciados; CRM no duplicado.`
    );
  };

  const handleToggleMemberActive = (member: ParticipantProfile) => {
    const nextActive = member.isCompanyActive === false ? true : false;
    onUpdateProfiles((prev) =>
      prev.map((p) => (p.publicId === member.publicId ? { ...p, isCompanyActive: nextActive } : p))
    );
    onShowToast(`Membresía de ${member.name} marcada como ${nextActive ? 'Activa' : 'Inactiva'}.`);
  };

  const handleToggleDirectoryVisibility = (member: ParticipantProfile) => {
    const nextVis = member.showInDirectory === false ? true : false;
    onUpdateProfiles((prev) =>
      prev.map((p) => (p.publicId === member.publicId ? { ...p, showInDirectory: nextVis } : p))
    );
    onShowToast(
      `Visibilidad de ${member.name} en directorio: ${nextVis ? 'Visible públicamente' : 'Oculto'}.`
    );
  };

  const handleCreateFromTemplate = () => {
    if (!activeCompany) return;
    const tempName = `Nuevo Integrante ${companyMembers.length + 1}`;
    const cleanId = `${activeCompany.slug}-miembro-${companyMembers.length + 1}`;
    const newMember = createMemberFromCorporateTemplate(
      activeCompany,
      {
        publicId: cleanId,
        name: tempName,
        role: 'Especialista de Área',
        department: activeCompany.areas[0] || 'Operaciones',
        roleStatement: `Atención y soporte especializado para clientes de ${activeCompany.name}.`
      },
      { existingProfiles: profiles }
    );

    onUpdateProfiles((prev) => [newMember, ...prev]);
    onShowToast(`Tarjeta corporativa preparada desde plantilla: ${newMember.publicId}`);
  };

  const handleSaveMemberLinkEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    onUpdateProfiles((prev) =>
      prev.map((p) => (p.publicId === editingMember.publicId ? editingMember : p))
    );
    setEditingMember(null);
    onShowToast('Vínculo del integrante actualizado con éxito.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Administrative Verifiable Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Cuentas Corporativas
            </span>
            <Building2 className="w-4 h-4 text-[#00685f]" />
          </div>
          <p className="text-2xl font-black text-stone-900">{adminSummary.totalCompanies}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Empresas gestionadas</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Integrantes Vinculados
            </span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-stone-900">{adminSummary.totalLinkedMembers}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Tarjetas asociadas a equipo</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Visibles en Directorio
            </span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900">{adminSummary.totalPublicMembers}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Activas & publicadas</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Tarjetas en Borrador
            </span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-stone-900">{adminSummary.totalDraftCards}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Pendientes de publicación</p>
        </div>
      </div>

      {/* 2. Company Selector Bar & Header */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00685f]" />
              <span>Gestión de Marcas Corporativas & Equipos</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Administra empresas, plantilla de marca y membresía de integrantes
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setCompanyFormData({
                  name: '',
                  slug: '',
                  tagline: '',
                  industry: 'Servicios Industriales',
                  valueProp: '',
                  brand: { primaryColor: '#00685f', themeKey: 'negocio' },
                  channels: {},
                  areas: ['Dirección', 'Operaciones', 'Comercial']
                });
                setIsCreatingNewCompany(true);
                setIsEditingCompany(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00685f] hover:bg-[#00524b] text-white transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Empresa</span>
            </button>
          </div>
        </div>

        {/* Company Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {companies.map((comp) => {
            const count = profiles.filter((p) => p.companyId === comp.id).length;
            const isSelected = comp.id === selectedCompanyId;
            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedCompanyId(comp.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {comp.brand.logoUrl ? (
                  <img
                    src={comp.brand.logoUrl}
                    alt={comp.name}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <Building2 className="w-4 h-4 shrink-0 text-[#00685f]" />
                )}
                <span>{comp.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Company Detail & Team Operations */}
      {activeCompany && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          {/* Header of Selected Company */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div className="flex items-start gap-4">
              {activeCompany.brand.logoUrl ? (
                <img
                  src={activeCompany.brand.logoUrl}
                  alt={activeCompany.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0"
                  style={{ backgroundColor: activeCompany.brand.primaryColor || '#00685f' }}
                >
                  {activeCompany.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-extrabold text-stone-950">{activeCompany.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    /{activeCompany.slug}
                  </span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shrink-0"
                    style={{ backgroundColor: activeCompany.brand.primaryColor || '#00685f' }}
                    title={`Color corporativo primario: ${activeCompany.brand.primaryColor}`}
                  />
                </div>
                <p className="text-xs text-stone-500 font-medium">{activeCompany.valueProp}</p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-stone-400">
                  <span className="font-semibold text-stone-600">Áreas:</span>
                  {activeCompany.areas.map((a) => (
                    <span key={a} className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onOpenCompanyDirectory(activeCompany.slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer border border-stone-200 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Ver Directorio Móvil</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCompanyFormData({ ...activeCompany });
                  setIsCreatingNewCompany(false);
                  setIsEditingCompany(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer border border-stone-300 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                <span>Editar Marca</span>
              </button>
            </div>
          </div>

          {/* Team Members Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Integrantes del Equipo ({companyMembers.length})</span>
              </h4>
              <p className="text-[11px] text-stone-400">
                Tarjetas asociadas a esta plantilla corporativa
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCreateFromTemplate}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Preparar desde Plantilla</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLinkDepartment(activeCompany.areas[0] || '');
                  setIsLinkModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-[#00685f] text-white transition-all cursor-pointer shadow-2xs"
              >
                <Link className="w-3.5 h-3.5" />
                <span>Vincular Tarjeta</span>
              </button>
            </div>
          </div>

          {/* Member Search and Area Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Buscar por nombre, área o rol..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#00685f]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 focus:bg-white focus:outline-none"
              >
                <option value="all">Todas las áreas</option>
                {activeCompany.areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 focus:bg-white focus:outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos en empresa</option>
                <option value="inactive">Inactivos</option>
                <option value="draft">Borradores</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          {filteredMembers.length > 0 ? (
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
              {filteredMembers.map((member) => {
                const brand = resolveMemberBrand(member, activeCompany);
                const isPublished = member.published;
                const isCompanyActive = member.isCompanyActive !== false;
                const isVisibleInDir = member.showInDirectory !== false;

                return (
                  <div
                    key={member.publicId}
                    className="p-4 hover:bg-stone-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    {/* Left: Info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0"
                          style={{ backgroundColor: brand.customPrimaryColor || '#00685f' }}
                        >
                          {member.name ? member.name.slice(0, 2).toUpperCase() : 'SN'}
                        </div>
                      )}

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-950 text-sm">
                            {member.name || '(Sin nombre asignado)'}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400">
                            /c/{member.publicId}
                          </span>
                        </div>
                        <p className="text-stone-600 font-medium truncate">{member.role}</p>
                        <p className="text-[11px] text-stone-500 italic mt-0.5">
                          "{member.companyRoleStatement || 'Sin frase de atención definida'}"
                        </p>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                            {member.companyDepartment || 'General'}
                          </span>

                          {brand.hasBrandOverride ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                              <Palette className="w-2.5 h-2.5" />
                              <span>Excepción de marca</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Marca heredada
                            </span>
                          )}

                          {isCompanyActive ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                              Activo
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Inactivo
                            </span>
                          )}

                          {isPublished ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                              Publicada
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Borrador
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => onOpenCardPreview(member.publicId)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer transition-colors"
                        title="Ver tarjeta digital individual"
                      >
                        Ver Tarjeta
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingMember(member)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer transition-colors"
                        title="Editar área, frase de atención o excepciones"
                      >
                        Editar Vínculo
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(member)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer transition-colors flex items-center gap-1"
                        title="Duplicar tarjeta para un nuevo integrante (sin datos personales ni CRM)"
                      >
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>Duplicar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUnlink(member)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors flex items-center gap-1 border border-rose-200/80"
                        title="Desvincular integrante (conserva su tarjeta y contactos)"
                      >
                        <Unlink className="w-3 h-3 text-rose-500" />
                        <span>Desvincular</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 space-y-2">
              <Users className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-bold text-xs text-stone-700">
                No hay integrantes vinculados con los filtros seleccionados
              </p>
              <p className="text-[11px] text-stone-400">
                Puedes vincular una tarjeta existente o preparar una nueva desde la plantilla.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Create or Edit Company */}
      {isEditingCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00685f]" />
                <span>{isCreatingNewCompany ? 'Crear Nueva Empresa' : 'Editar Marca Corporativa'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingCompany(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  required
                  value={companyFormData.name || ''}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                  placeholder="ej. Nexo Operativo"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={companyFormData.slug || ''}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, slug: e.target.value })}
                    placeholder="ej. nexo-operativo"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Industria / Giro</label>
                  <input
                    type="text"
                    value={companyFormData.industry || ''}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, industry: e.target.value })}
                    placeholder="ej. Manufactura Industrial"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Propuesta de Valor de la Empresa</label>
                <textarea
                  rows={2}
                  value={companyFormData.valueProp || ''}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, valueProp: e.target.value })}
                  placeholder="Qué resuelve la empresa para sus clientes..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f]"
                />
              </div>

              {/* Brand Settings */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <h4 className="font-bold text-stone-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Identidad de Marca Heredable</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-600 mb-1">Color Primario Hex</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={companyFormData.brand?.primaryColor || '#00685f'}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            brand: { ...companyFormData.brand, primaryColor: e.target.value }
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={companyFormData.brand?.primaryColor || '#00685f'}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            brand: { ...companyFormData.brand, primaryColor: e.target.value }
                          })
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-600 mb-1">Tema Visual</label>
                    <select
                      value={companyFormData.brand?.themeKey || 'negocio'}
                      onChange={(e) =>
                        setCompanyFormData({
                          ...companyFormData,
                          brand: { ...companyFormData.brand, themeKey: e.target.value as any }
                        })
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                    >
                      <option value="negocio">Negocio</option>
                      <option value="ejecutivo">Ejecutivo</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-600 mb-1">URL del Logo Corporativo</label>
                  <input
                    type="text"
                    value={companyFormData.brand?.logoUrl || ''}
                    onChange={(e) =>
                      setCompanyFormData({
                        ...companyFormData,
                        brand: { ...companyFormData.brand, logoUrl: e.target.value }
                      })
                    }
                    placeholder="https://... o data:image/svg+xml..."
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Areas Definition */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Áreas / Departamentos (separadas por coma)
                </label>
                <input
                  type="text"
                  value={(companyFormData.areas || []).join(', ')}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const split = raw
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setCompanyFormData({ ...companyFormData, areas: split });
                  }}
                  placeholder="Dirección General, Operaciones, Comercial"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f]"
                />
              </div>

              {/* Channels */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-600 mb-1">Sitio Web</label>
                  <input
                    type="text"
                    value={companyFormData.channels?.website || ''}
                    onChange={(e) =>
                      setCompanyFormData({
                        ...companyFormData,
                        channels: { ...companyFormData.channels, website: e.target.value }
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-600 mb-1">Teléfono General</label>
                  <input
                    type="text"
                    value={companyFormData.channels?.phone || ''}
                    onChange={(e) =>
                      setCompanyFormData({
                        ...companyFormData,
                        channels: { ...companyFormData.channels, phone: e.target.value }
                      })
                    }
                    placeholder="+52442..."
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingCompany(false)}
                  className="px-3.5 py-1.5 rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-bold bg-[#00685f] hover:bg-[#00524b] text-white cursor-pointer shadow-xs"
                >
                  Guardar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Link Member Modal */}
      {isLinkModalOpen && activeCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
                <Link className="w-4 h-4 text-[#00685f]" />
                <span>Vincular Tarjeta a {activeCompany.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Seleccionar Tarjeta Existente</label>
                <select
                  value={linkTargetPublicId}
                  onChange={(e) => setLinkTargetPublicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#00685f]"
                >
                  <option value="">Selecciona un perfil...</option>
                  {availableToLink.map((p) => (
                    <option key={p.publicId} value={p.publicId}>
                      {p.name || p.shortName} ({p.role}) - /c/{p.publicId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Área / Departamento Asignado</label>
                <select
                  value={linkDepartment}
                  onChange={(e) => setLinkDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#00685f]"
                >
                  {activeCompany.areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Frase de Atención ("¿Qué atiende en la empresa?")
                </label>
                <input
                  type="text"
                  value={linkRoleStatement}
                  onChange={(e) => setLinkRoleStatement(e.target.value)}
                  placeholder="ej. Te ayuda a elegir la solución técnica para tu planta"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f]"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  Esta frase se mostrará en el directorio corporativo para guiar al visitante.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!linkTargetPublicId}
                  onClick={handleConfirmLink}
                  className="px-4 py-1.5 rounded-xl font-bold bg-[#00685f] hover:bg-[#00524b] disabled:opacity-50 text-white cursor-pointer shadow-xs"
                >
                  Confirmar Vínculo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Member Link & Overrides */}
      {editingMember && activeCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#00685f]" />
                <span>Editar Vínculo: {editingMember.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMemberLinkEdits} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Área / Departamento</label>
                <select
                  value={editingMember.companyDepartment || activeCompany.areas[0]}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, companyDepartment: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#00685f]"
                >
                  {activeCompany.areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Frase de Atención ("¿Qué atiende?")
                </label>
                <textarea
                  rows={2}
                  value={editingMember.companyRoleStatement || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, companyRoleStatement: e.target.value })
                  }
                  placeholder="ej. Te orienta en la viabilidad técnica y cotizaciones..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#00685f]"
                />
              </div>

              {/* Brand Override Exception Toggle */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingMember.brandOverrides?.overrideBrand)}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        brandOverrides: {
                          ...editingMember.brandOverrides,
                          overrideBrand: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-0"
                  />
                  <span className="font-bold text-stone-800">
                    Excepción explícita de marca personal
                  </span>
                </label>
                <p className="text-[10px] text-stone-400">
                  Si se activa, esta tarjeta no heredará el logo ni colores de la empresa al actualizar la marca corporativa.
                </p>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={editingMember.isCompanyActive !== false}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, isCompanyActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#00685f]"
                  />
                  <span className="font-semibold text-stone-700">Membresía Activa</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={editingMember.showInDirectory !== false}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, showInDirectory: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#00685f]"
                  />
                  <span className="font-semibold text-stone-700">Ver en Directorio</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-3.5 py-1.5 rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-bold bg-[#00685f] hover:bg-[#00524b] text-white cursor-pointer shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

