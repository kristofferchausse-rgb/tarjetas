import { ParticipantProfile } from '../types/card';
import { CapturedLead, LeadOutcomeType, LeadOutcome } from '../types/analytics';
import { parsePhoneNumber } from './phone';

/**
 * Returns today's date formatted as YYYY-MM-DD in the device's local calendar time,
 * completely immune to UTC timezone conversions.
 */
export function getLocalTodayDateString(referenceDate?: Date): string {
  const d = referenceDate || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes an arbitrary date string (ISO or YYYY-MM-DD) into YYYY-MM-DD.
 */
export function normalizeActionDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) return '';
  const trimmed = dateStr.trim();
  if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.substring(0, 10);
  }
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return getLocalTodayDateString(d);
    }
  } catch {}
  return trimmed;
}

export type ActionTimingCategory = 'vencido' | 'hoy' | 'futuro' | 'completada' | 'sin_fecha';

/**
 * Computes the timing category of a lead's next action.
 * Strict rules:
 * - If action is completed, it is NEVER considered overdue.
 * - If there is no nextAction or no date, it is classified as 'sin_fecha'.
 * - Today and Overdue only apply to non-completed actions with explicit dates.
 */
export function getLeadActionTiming(
  lead: Pick<CapturedLead, 'nextAction' | 'nextActionDate' | 'nextActionCompleted'>,
  referenceTodayStr?: string
): ActionTimingCategory {
  if (lead.nextActionCompleted) {
    return 'completada';
  }

  const action = lead.nextAction?.trim();
  const dateStr = normalizeActionDate(lead.nextActionDate);

  if (!action || !dateStr) {
    return 'sin_fecha';
  }

  const todayStr = referenceTodayStr || getLocalTodayDateString();

  if (dateStr < todayStr) {
    return 'vencido';
  }
  if (dateStr === todayStr) {
    return 'hoy';
  }
  return 'futuro';
}

export interface ArchetypeTerminology {
  archetypeId: string;
  categoryLabel: string;
  leadNeedLabel: string;
  reunionStageLabel: string;
  cerradoStageLabel: string;
  actionSuggestions: string[];
  disclaimer?: string;
}

/**
 * Provides tailored CRM vocabulary and next-action suggestions based on professionalProfile archetype,
 * independent of whether publicId starts with demo-*.
 */
export function getArchetypeTerminology(profileOrId: ParticipantProfile | string): ArchetypeTerminology {
  let professionalProfile: string | undefined;
  let publicId = '';

  if (typeof profileOrId === 'string') {
    const clean = profileOrId.trim().toLowerCase();
    if (
      clean === 'profesional_independiente' ||
      clean === 'comercial_asesor' ||
      clean === 'emprendedor_solopreneur' ||
      clean === 'empresario_dueno' ||
      clean === 'ejecutivo_directivo' ||
      clean === 'salud' ||
      clean === 'institucional_publico'
    ) {
      professionalProfile = clean;
    } else {
      publicId = clean;
    }
  } else if (profileOrId && typeof profileOrId === 'object') {
    professionalProfile = profileOrId.professionalProfile;
    publicId = (profileOrId.publicId || '').trim().toLowerCase();
  }

  // Fallback heuristic if professionalProfile was not explicitly provided
  if (!professionalProfile && publicId) {
    if (publicId === 'demo-clara-navarro') professionalProfile = 'profesional_independiente';
    else if (publicId === 'demo-diego-salas') professionalProfile = 'comercial_asesor';
    else if (publicId === 'demo-renata-vidal') professionalProfile = 'emprendedor_solopreneur';
    else if (publicId === 'demo-jorge-herrera') professionalProfile = 'empresario_dueno';
    else if (publicId === 'demo-adriana-torres') professionalProfile = 'ejecutivo_directivo';
    else if (publicId === 'demo-lucia-cardenas') professionalProfile = 'salud';
    else if (publicId === 'demo-gabriela-leon') professionalProfile = 'institucional_publico';
  }

  switch (professionalProfile) {
    case 'salud':
      return {
        archetypeId: 'salud',
        categoryLabel: 'Atención Médica & Servicios de Salud',
        leadNeedLabel: 'Solicitud de atención / Cita en consultorio',
        reunionStageLabel: 'Cita en consultorio programada',
        cerradoStageLabel: 'Atención realizada / Cita concluida',
        actionSuggestions: [
          'Confirmar horario disponible para cita en consultorio',
          'Enviar ubicación y vías de acceso al consultorio',
          'Confirmar asistencia o reprogramar horario de cita',
          'Compartir canal oficial de recepción y agenda',
          'Verificar registro de cita en calendario del consultorio'
        ],
        disclaimer:
          'Canal de seguimiento administrativo para citas y logística de atención. No almacena información clínica sensible ni sustituye la consulta médica formal.'
      };

    case 'institucional_publico':
      return {
        archetypeId: 'institucional_publico',
        categoryLabel: 'Vinculación Institucional & Formación Continua',
        leadNeedLabel: 'Iniciativa de colaboración / Contacto formal',
        reunionStageLabel: 'Mesa de trabajo interinstitucional',
        cerradoStageLabel: 'Convenio marco formalizado',
        actionSuggestions: [
          'Enviar formato orientador de vinculación',
          'Coordinar mesa de trabajo de enlace interinstitucional',
          'Revisar lineamientos y ámbito de competencia',
          'Canalizar solicitud con el área institucional correspondiente',
          'Confirmar fecha de sesión informativa'
        ],
        disclaimer:
          'Canal de orientación y enlace institucional. No constituye inicio de trámite oficial ni genera expediente administrativo vinculante.'
      };

    case 'profesional_independiente':
      return {
        archetypeId: 'consultoria',
        categoryLabel: 'Consultoría & Asesoría Estratégica',
        leadNeedLabel: 'Necesidad planteada',
        reunionStageLabel: 'Conversación diagnóstica',
        cerradoStageLabel: 'Acompañamiento acordado',
        actionSuggestions: [
          'Enviar propuesta metodológica',
          'Agendar llamada diagnóstica de 20 min',
          'Enviar muestra de mapa de responsabilidades',
          'Confirmar fecha de sesión con líderes',
          'Enviar alcance y cotización formal'
        ]
      };

    case 'comercial_asesor':
      return {
        archetypeId: 'inmobiliario',
        categoryLabel: 'Bienes Raíces & Emprendimiento',
        leadNeedLabel: 'Requerimiento de inmueble / inversión',
        reunionStageLabel: 'Recorrido / Visita técnica',
        cerradoStageLabel: 'Contrato / Operación acordada',
        actionSuggestions: [
          'Filtrar y enviar 3 fichas técnicas verificadas',
          'Coordinar recorrido en sitio',
          'Verificar estatus jurídico y precalificación',
          'Confirmar cita con propietario',
          'Revisar contraoferta comercial'
        ]
      };

    case 'emprendedor_solopreneur':
      return {
        archetypeId: 'eventos_catering',
        categoryLabel: 'Catering & Experiencias Gastronómicas',
        leadNeedLabel: 'Ocasión / Solicitud de servicio',
        reunionStageLabel: 'Degustación / Visita de locación',
        cerradoStageLabel: 'Servicio / Fecha reservada',
        actionSuggestions: [
          'Enviar propuesta con 2 opciones de menú',
          'Confirmar número final de comensales y restricciones',
          'Coordinar visita de montaje y medidas',
          'Verificar disponibilidad de fecha en agenda',
          'Enviar cotización formal con anticipo'
        ]
      };

    case 'empresario_dueno':
      return {
        archetypeId: 'industrial',
        categoryLabel: 'Mantenimiento & Soluciones Industriales',
        leadNeedLabel: 'Requerimiento técnico / Falla en planta',
        reunionStageLabel: 'Levantamiento en sitio',
        cerradoStageLabel: 'Orden de trabajo liberada',
        actionSuggestions: [
          'Costear materiales y horas de maquinado CNC',
          'Coordinar visita de levantamiento con seguridad',
          'Enviar documentación DC-3 y REPSE',
          'Confirmar ventana de paro programado',
          'Enviar presupuesto preliminar de cuadrilla'
        ]
      };

    case 'ejecutivo_directivo':
      return {
        archetypeId: 'directivo_manufactura',
        categoryLabel: 'Dirección Operativa & Clúster Automotriz',
        leadNeedLabel: 'Iniciativa / Contacto institucional',
        reunionStageLabel: 'Reunión de vinculación técnica',
        cerradoStageLabel: 'Alianza / Convenio formalizado',
        actionSuggestions: [
          'Confirmar disponibilidad de agenda ejecutiva',
          'Coordinar recorrido técnico recíproco de planta',
          'Enviar perfil de competencias para programa',
          'Revisar borrador de convenio de colaboración',
          'Alinear objetivos con comité del clúster'
        ]
      };

    case 'sara-sazedi':
    default:
      return {
        archetypeId: 'empresarial_general',
        categoryLabel: 'Servicios Profesionales & Estrategia B2B',
        leadNeedLabel: 'Motivo de contacto / Interés',
        reunionStageLabel: 'Sesión de diagnóstico',
        cerradoStageLabel: 'Acuerdo comercial concluido',
        actionSuggestions: [
          'Enviar información solicitada',
          'Preparar propuesta comercial',
          'Confirmar disponibilidad de agenda',
          'Coordinar reunión de seguimiento',
          'Revisar puntos clave de colaboración'
        ]
      };
  }
}

/**
 * Extracts a friendly first name, ignoring common professional titles or prefixes (Lic., Ing., Dr., etc.).
 */
export function extractContactFirstName(rawName?: string): string {
  if (!rawName || !rawName.trim()) return '';
  const parts = rawName.trim().split(/\s+/);
  const titles = new Set([
    'lic.', 'lic', 'ing.', 'ing', 'dr.', 'dr', 'dra.', 'dra',
    'arq.', 'arq', 'mtro.', 'mtro', 'mtra.', 'mtra', 'c.p.', 'cp',
    'prof.', 'prof', 'sra.', 'sra', 'sr.', 'sr', 'don', 'doña'
  ]);

  if (parts.length > 1 && titles.has(parts[0].toLowerCase())) {
    return parts[1];
  }
  return parts[0];
}

/**
 * Builds a natural, contextual WhatsApp follow-up message strictly without exposing internal notes,
 * budgets, or private CRM observations.
 */
export function generateWhatsAppFollowUpMessage(
  lead: Pick<CapturedLead, 'name' | 'solutionTitle' | 'company' | 'message'>
): string {
  const rawName = (lead.name || '').trim();
  const firstName = extractContactFirstName(rawName) || rawName || 'hola';
  const topic = lead.solutionTitle?.trim();

  if (topic) {
    return `Hola ${firstName}, gusto en saludarte. Retomo tu interés en "${topic}". ¿Te parece si revisamos el siguiente paso?`;
  }

  return `Hola ${firstName}, gusto en saludarte. Recibí tus datos a través de mi tarjeta digital. ¿Te parece si revisamos el siguiente paso?`;
}

/**
 * Formats WhatsApp link preserving full international digits without automatic state changes.
 */
export function generateWhatsAppFollowUpUrl(lead: CapturedLead): string {
  const parsed = parsePhoneNumber(lead.phone);
  const cleanPhone = parsed.isValid && parsed.waDigits ? parsed.waDigits : lead.phone.replace(/[^0-9]/g, '');
  const text = generateWhatsAppFollowUpMessage(lead);
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export interface OutcomeTerminology {
  label: string;
  description: string;
}

/**
 * Provides tailored labels and descriptions for outcomes based on archetype.
 * Adapts to the 7 real values of ProfessionalProfileType.
 * Always treats 'cita_confirmada' as an agreed/scheduled appointment in calendar, never completed/realized.
 * Maintains general terminology without assuming specific industries like real estate, catering, or CNC.
 */
export function getOutcomeTerminology(
  type: LeadOutcomeType,
  professionalProfile?: string
): OutcomeTerminology {
  switch (type) {
    case 'venta_confirmada':
      if (professionalProfile === 'salud') {
        return {
          label: 'Servicio / Consulta confirmada',
          description: 'Servicio de atención médica o consulta formalizada en recepción.'
        };
      }
      if (professionalProfile === 'institucional_publico') {
        return {
          label: 'Acuerdo / Compromiso formalizado',
          description: 'Compromiso o acuerdo formalizado dentro del marco legal institucional.'
        };
      }
      if (professionalProfile === 'profesional_independiente') {
        return {
          label: 'Contratación confirmada',
          description: 'Servicio profesional o proyecto acordado y contratado.'
        };
      }
      if (professionalProfile === 'comercial_asesor') {
        return {
          label: 'Venta cerrada',
          description: 'Venta comercial, orden o contrato cerrado con el cliente.'
        };
      }
      if (professionalProfile === 'emprendedor_solopreneur') {
        return {
          label: 'Venta / Pedido confirmado',
          description: 'Venta, pedido o servicio confirmado por el cliente.'
        };
      }
      if (professionalProfile === 'empresario_dueno') {
        return {
          label: 'Contrato / Operación cerrada',
          description: 'Contrato comercial, suministro u operación cerrada satisfactoriamente.'
        };
      }
      if (professionalProfile === 'ejecutivo_directivo') {
        return {
          label: 'Acuerdo comercial cerrado',
          description: 'Acuerdo operativo, provisión o contrato formalizado.'
        };
      }
      return {
        label: 'Venta confirmada',
        description: 'Venta, servicio o contrato cerrado satisfactoriamente.'
      };

    case 'cita_confirmada':
      if (professionalProfile === 'salud') {
        return {
          label: 'Cita en consultorio agendada',
          description: 'Cita acordada y aceptada en agenda de consultorio (ámbito administrativo de agenda, sin datos clínicos sensibles).'
        };
      }
      if (professionalProfile === 'institucional_publico') {
        return {
          label: 'Reunión / Audiencia agendada',
          description: 'Reunión de vinculación o audiencia acordada y aceptada en agenda institucional.'
        };
      }
      if (professionalProfile === 'profesional_independiente') {
        return {
          label: 'Sesión / Cita agendada',
          description: 'Sesión de asesoría o cita profesional acordada y aceptada en agenda.'
        };
      }
      if (professionalProfile === 'comercial_asesor') {
        return {
          label: 'Cita comercial agendada',
          description: 'Cita o demostración acordada y aceptada en agenda con el prospecto.'
        };
      }
      if (professionalProfile === 'emprendedor_solopreneur') {
        return {
          label: 'Cita / Demostración agendada',
          description: 'Cita de atención o demostración acordada y aceptada en agenda.'
        };
      }
      if (professionalProfile === 'empresario_dueno') {
        return {
          label: 'Reunión ejecutiva agendada',
          description: 'Reunión de negocios o visita directiva acordada y aceptada en agenda.'
        };
      }
      if (professionalProfile === 'ejecutivo_directivo') {
        return {
          label: 'Reunión directiva agendada',
          description: 'Reunión de trabajo o sesión directiva acordada y aceptada en agenda.'
        };
      }
      return {
        label: 'Cita agendada',
        description: 'Cita o reunión acordada y aceptada en agenda.'
      };

    case 'colaboracion_acordada':
      if (professionalProfile === 'salud') {
        return {
          label: 'Canalización / Colaboración profesional',
          description: 'Acuerdo de interconsulta, derivación o colaboración profesional mutua.'
        };
      }
      if (professionalProfile === 'institucional_publico') {
        return {
          label: 'Convenio / Alianza interinstitucional',
          description: 'Convenio o colaboración estratégica acordada dentro del ámbito público.'
        };
      }
      if (professionalProfile === 'profesional_independiente') {
        return {
          label: 'Alianza / Colaboración acordada',
          description: 'Acuerdo de sinergia profesional, proyecto conjunto o referidos mutuos.'
        };
      }
      if (professionalProfile === 'comercial_asesor') {
        return {
          label: 'Alianza comercial acordada',
          description: 'Acuerdo de canalización comercial, alianza o referidos mutuos.'
        };
      }
      if (professionalProfile === 'emprendedor_solopreneur') {
        return {
          label: 'Colaboración / Sinergia acordada',
          description: 'Colaboración conjunta, evento o sinergia comercial acordada.'
        };
      }
      if (professionalProfile === 'empresario_dueno') {
        return {
          label: 'Alianza estratégica acordada',
          description: 'Alianza comercial, integración de cadena o consorcio acordado.'
        };
      }
      if (professionalProfile === 'ejecutivo_directivo') {
        return {
          label: 'Alianza corporativa acordada',
          description: 'Alianza institucional, sinergia directiva o convenio marco formalizado.'
        };
      }
      return {
        label: 'Colaboración acordada',
        description: 'Acuerdo de colaboración, sinergia o alianza estratégica.'
      };

    case 'solicitud_atendida':
      if (professionalProfile === 'salud') {
        return {
          label: 'Solicitud de informes atendida',
          description: 'Informes de horarios, ubicación o servicios de consultorio atendidos.'
        };
      }
      if (professionalProfile === 'institucional_publico') {
        return {
          label: 'Gestión / Orientación canalizada',
          description: 'Orientación ciudadana o solicitud de gestión canalizada institucionalmente.'
        };
      }
      if (professionalProfile === 'profesional_independiente') {
        return {
          label: 'Consulta / Cotización atendida',
          description: 'Requerimiento de información, propuesta o cotización resuelta.'
        };
      }
      if (professionalProfile === 'comercial_asesor') {
        return {
          label: 'Información comercial enviada',
          description: 'Ficha técnica, catálogo o cotización comercial enviada y atendida.'
        };
      }
      if (professionalProfile === 'emprendedor_solopreneur') {
        return {
          label: 'Cotización / Duda atendida',
          description: 'Atención a requerimiento de producto, servicio o cotización.'
        };
      }
      if (professionalProfile === 'empresario_dueno') {
        return {
          label: 'Requerimiento corporativo atendido',
          description: 'Solicitud de especificaciones, cotización o propuesta atendida.'
        };
      }
      if (professionalProfile === 'ejecutivo_directivo') {
        return {
          label: 'Petición / Informe atendido',
          description: 'Requerimiento directivo, informe formal o gestión resuelta.'
        };
      }
      return {
        label: 'Solicitud atendida',
        description: 'Requerimiento de información o solicitud resuelta.'
      };

    case 'otro':
    default:
      return {
        label: 'Otro resultado',
        description: 'Hito o acuerdo relevante documentado por el titular.'
      };
  }
}

