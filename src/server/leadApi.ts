import { CapturedLead } from '../types/analytics';

export interface LeadCapturePayload {
  id: string;
  publicId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  role?: string;
  message?: string;
  timestamp: string;
  source?: 'general' | 'solution';
  solutionId?: string;
  solutionTitle?: string;
  // Disallowed client fields that server must ignore/strip
  status?: string;
  notes?: string;
}

export interface ServerCaptureResult {
  status: 'confirmed' | 'failed' | 'conflict';
  lead?: CapturedLead;
  isRetry?: boolean;
  error?: string;
}

// In-memory persistent database for server-managed leads during dev/test/local execution
// In production with Firebase Admin SDK, this points to Firestore transactions
const serverLeadsStore = new Map<string, CapturedLead>();

export function getServerLeadsForProfile(publicId: string): CapturedLead[] {
  const cleanId = publicId.trim().toLowerCase();
  const leads: CapturedLead[] = [];
  for (const lead of serverLeadsStore.values()) {
    if (lead.publicId === cleanId) {
      leads.push({ ...lead });
    }
  }
  return leads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function updateServerLeadStatus(
  publicId: string,
  leadId: string,
  status: CapturedLead['status'],
  notes?: string
): boolean {
  const cleanId = publicId.trim().toLowerCase();
  const existing = serverLeadsStore.get(leadId);
  if (!existing || existing.publicId !== cleanId) return false;

  existing.status = status;
  if (notes !== undefined) {
    existing.notes = notes;
  }
  return true;
}

export function clearServerLeadsStore(): void {
  serverLeadsStore.clear();
}

/**
 * Server-side idempotent lead capture operation
 */
export async function captureLeadOnServer(payload: LeadCapturePayload): Promise<ServerCaptureResult> {
  // 1. Validation of payload
  if (!payload.id || typeof payload.id !== 'string' || !payload.id.startsWith('lead_')) {
    return { status: 'failed', error: 'Formato de ID de intento inválido.' };
  }
  if (!payload.publicId || typeof payload.publicId !== 'string' || payload.publicId.length > 100) {
    return { status: 'failed', error: 'Destinatario publicId inválido.' };
  }
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length === 0 || payload.name.length > 120) {
    return { status: 'failed', error: 'Nombre requerido (máximo 120 caracteres).' };
  }
  if (!payload.phone || typeof payload.phone !== 'string' || payload.phone.trim().length === 0 || payload.phone.length > 30) {
    return { status: 'failed', error: 'Teléfono requerido (máximo 30 caracteres).' };
  }
  if (!payload.timestamp || isNaN(new Date(payload.timestamp).getTime())) {
    return { status: 'failed', error: 'Timestamp ISO de captura inválido.' };
  }
  if (payload.email && payload.email.length > 120) {
    return { status: 'failed', error: 'Correo excede 120 caracteres.' };
  }
  if (payload.company && payload.company.length > 120) {
    return { status: 'failed', error: 'Empresa excede 120 caracteres.' };
  }
  if (payload.message && payload.message.length > 1000) {
    return { status: 'failed', error: 'Mensaje excede 1000 caracteres.' };
  }

  const cleanPublicId = payload.publicId.trim().toLowerCase();
  const leadId = payload.id.trim();

  // 2. Atomic check for existing record with the same ID
  const existing = serverLeadsStore.get(leadId);

  if (existing) {
    // Attempt verification: Check if it's the exact same attempt for the same profile
    if (existing.publicId !== cleanPublicId) {
      return {
        status: 'conflict',
        error: 'Conflicto de identidad: El ID del intento ya está asignado a otro perfil.'
      };
    }

    // IDEMPOTENCY: Lead already captured. Return confirmation WITHOUT touching status or notes!
    // Never expose private notes back to the public visitor
    const publicLeadAck: CapturedLead = {
      id: existing.id,
      publicId: existing.publicId,
      name: existing.name,
      phone: existing.phone,
      email: existing.email,
      company: existing.company,
      role: existing.role,
      message: existing.message,
      timestamp: existing.timestamp,
      status: 'nuevo', // Visitor always sees acknowledgment as nuevo
      source: existing.source,
      solutionId: existing.solutionId,
      solutionTitle: existing.solutionTitle,
      syncStatus: 'confirmed'
    };

    return {
      status: 'confirmed',
      isRetry: true,
      lead: publicLeadAck
    };
  }

  // 3. First-time creation: enforce server defaults
  const newLead: CapturedLead = {
    id: leadId,
    publicId: cleanPublicId,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || undefined,
    company: payload.company?.trim() || undefined,
    role: payload.role?.trim() || undefined,
    message: payload.message?.trim() || undefined,
    timestamp: payload.timestamp,
    status: 'nuevo',
    notes: '', // Titular notes always initialize empty on server
    source: payload.source || 'general',
    solutionId: payload.solutionId,
    solutionTitle: payload.solutionTitle,
    syncStatus: 'confirmed'
  };

  serverLeadsStore.set(leadId, newLead);

  // Return public version without notes
  const visitorResult: CapturedLead = {
    ...newLead,
    notes: undefined
  };

  return {
    status: 'confirmed',
    isRetry: false,
    lead: visitorResult
  };
}

