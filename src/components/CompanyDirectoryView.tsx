import React, { useState, useMemo } from 'react';
import { CompanyAccount } from '../types/company';
import { ParticipantProfile } from '../types/card';
import { getCompanyMembers, resolveMemberBrand } from '../services/companyService';
import {
  Building2,
  Users,
  Search,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Globe,
  ArrowLeft
} from 'lucide-react';

interface CompanyDirectoryViewProps {
  company: CompanyAccount;
  profiles: ParticipantProfile[];
  onOpenCard: (publicId: string) => void;
  onBackHome?: () => void;
}

export const CompanyDirectoryView: React.FC<CompanyDirectoryViewProps> = ({
  company,
  profiles,
  onOpenCard,
  onBackHome
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Strictly filter for active, directory-authorized members with published cards
  const publicMembers = useMemo(() => {
    return getCompanyMembers(company.id, profiles, {
      onlyActivePublic: true,
      department: selectedArea,
      search: searchTerm
    });
  }, [company.id, profiles, selectedArea, searchTerm]);

  // Count total published public members in the company
  const totalPublicCount = useMemo(() => {
    return getCompanyMembers(company.id, profiles, { onlyActivePublic: true }).length;
  }, [company.id, profiles]);

  const primaryColor = company.brand.primaryColor || '#00685f';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased pb-20 selection:bg-[#00685f]/20">
      {/* Top Corporate Header */}
      <header className="relative bg-white border-b border-stone-200 overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            {onBackHome && (
              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-stone-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Inicio RedConecta</span>
              </button>
            )}
            <div className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200/80">
              <ShieldCheck className="w-3 h-3 text-[#00685f]" />
              <span>Directorio Corporativo Verificado</span>
            </div>
          </div>

          {/* Company Brand Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {company.brand.logoUrl ? (
              <img
                src={company.brand.logoUrl}
                alt={`Logo de ${company.name}`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shadow-sm shrink-0 bg-white"
              />
            ) : (
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {company.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
                  {company.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                  {company.industry}
                </span>
              </div>
              {company.tagline && (
                <p className="text-xs sm:text-sm font-semibold text-stone-600">
                  {company.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/90 text-xs sm:text-sm text-stone-800 leading-relaxed">
            <p className="font-medium">{company.valueProp}</p>
          </div>

          {/* Corporate Channels */}
          <div className="mt-4 flex items-center gap-2 sm:gap-3 flex-wrap text-xs text-stone-600">
            {company.channels.website && (
              <a
                href={company.channels.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-800 font-semibold transition-colors shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Sitio Web Oficial</span>
                <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
              </a>
            )}

            {company.channels.phone && (
              <a
                href={`tel:${company.channels.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-800 font-semibold transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{company.channels.phone}</span>
              </a>
            )}

            {company.channels.email && (
              <a
                href={`mailto:${company.channels.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-800 font-semibold transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>{company.channels.email}</span>
              </a>
            )}

            {company.channels.address && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-500 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{company.channels.address}</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Section Title & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00685f]" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Equipo de Especialistas ({totalPublicCount})
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Encuentra al integrante indicado para atender tu necesidad concreta
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, área o rol..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#00685f] focus:ring-1 focus:ring-[#00685f] transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Area / Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedArea('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              selectedArea === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Todas las áreas</span>
          </button>

          {company.areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                selectedArea === area
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{area}</span>
            </button>
          ))}
        </div>

        {/* Public Members Grid */}
        {publicMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publicMembers.map((member) => {
              const brand = resolveMemberBrand(member, company);
              return (
                <div
                  key={member.publicId}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    {/* Header: Photo + Name + Dept */}
                    <div className="flex items-start gap-3.5">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.avatarAlt || `Foto de ${member.name}`}
                          className="w-13 h-13 rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
                        />
                      ) : (
                        <div
                          className="w-13 h-13 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-2xs"
                          style={{ backgroundColor: brand.customPrimaryColor || primaryColor }}
                        >
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-stone-950 truncate">
                            {member.name}
                          </h3>
                        </div>
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: brand.customPrimaryColor || primaryColor }}
                        >
                          {member.role}
                        </p>
                        {member.companyDepartment && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200/80 mt-0.5">
                            {member.companyDepartment}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Concrete Statement: What does this member handle? */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700 leading-relaxed">
                      <p className="font-medium">
                        {member.companyRoleStatement ||
                          member.valueProp ||
                          `Atención y coordinación especializada en ${member.companyDepartment || 'su área'}.`}
                      </p>
                    </div>
                  </div>

                  {/* Action: Open Individual Digital Card */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-medium">
                      Tarjeta Inteligente Verificada
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenCard(member.publicId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs bg-stone-900 hover:bg-[#00685f] text-white transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Ver tarjeta</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-stone-800 text-sm sm:text-base">
              No se encontraron integrantes disponibles
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              {searchTerm || selectedArea !== 'all'
                ? 'No hay integrantes en esta área o que coincidan con el término de búsqueda.'
                : 'Actualmente no hay integrantes públicos autorizados en el directorio de esta empresa.'}
            </p>
            {(searchTerm || selectedArea !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedArea('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                <span>Mostrar todos los integrantes</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* Discretionary Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 text-center text-stone-400 text-[11px] leading-relaxed">
        <p>
          Directorio Corporativo de Tarjetas Digitales Inteligentes • RedConecta MX &copy; {new Date().getFullYear()}
        </p>
        <p className="mt-0.5">
          Tribu Creativa QRO — Privacidad y datos personales protegidos conforme a normativa aplicable.
        </p>
      </footer>
    </div>
  );
};

