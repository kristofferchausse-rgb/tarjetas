import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CapturedLead } from '../types/analytics';

const COLLECTION_NAME = 'leads';

function getLocalLeads(publicId: string): CapturedLead[] {
  try {
    const raw = localStorage.getItem(`tarjetas_leads_${publicId.toLowerCase()}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLeads(publicId: string, leads: CapturedLead[]): void {
  try {
    localStorage.setItem(`tarjetas_leads_${publicId.toLowerCase()}`, JSON.stringify(leads));
  } catch {}
}

/**
 * High-value mock contacts specifically tailored for Sara Zea (SAZEDI Arquitectura)
 * to demonstrate the Mini-CRM in action across all pipeline stages.
 */
export const SARA_MOCK_LEADS: CapturedLead[] = [
  {
    id: 'lead_sara_01',
    publicId: 'sara-sazedi',
    name: 'Arq. Roberto Morales',
    phone: '+52 442 389 4512',
    email: 'roberto.morales@desarrollosbajio.mx',
    company: 'Desarrollos Residenciales del Bajío',
    role: 'Director de Proyectos',
    message: 'Hola Sara, me encantó tu enfoque de arquitectura bioclimática en la sesión de networking. Tenemos un desarrollo de 12 residencias premium en Zibatá y queremos integrar tu consultoría para optimización solar y acabados sustentables.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'nuevo',
    notes: 'Interesado en propuesta de diseño interior bioclimático y confort térmico para casas muestra.'
  },
  {
    id: 'lead_sara_02',
    publicId: 'sara-sazedi',
    name: 'Carlos Peña Treviño',
    phone: '+52 442 420 8901',
    email: 'cpena.inversiones@gmail.com',
    company: 'Inversiones Patrimoniales Campanario',
    role: 'Inversionista Residencial',
    message: 'Construiré mi residencia en El Campanario (850 m2) y busco un despacho especializado que domine diseño pasivo, iluminación cenital y materiales naturales.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'nuevo',
    notes: 'Prospecto de muy alto valor. Requiere presentación privada de portafolio residencial de lujo.'
  },
  {
    id: 'lead_sara_03',
    publicId: 'sara-sazedi',
    name: 'Ing. Marcela Vega Salgado',
    phone: '+52 442 516 7890',
    email: 'mvega@haciendasanjose.com.mx',
    company: 'Grupo Hotelero Hacienda San José',
    role: 'Gerente de Sustentabilidad & Compras',
    message: 'Vimos tu tarjeta digital en el evento de sustentabilidad de Canaco. Queremos remodelar las suites ejecutivas con iluminación natural y confort térmico.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'contactado',
    notes: 'Le envié por WhatsApp el enlace al video de estudio de caso. Muy receptiva, acordamos enviar propuesta el viernes.'
  },
  {
    id: 'lead_sara_04',
    publicId: 'sara-sazedi',
    name: 'Lic. Fernando Garza Ruiz',
    phone: '+52 442 198 2345',
    email: 'fgarza@nauticaqro.com',
    company: 'Corporativo Plaza Náutica Juriquilla',
    role: 'Socio Director',
    message: 'Buscamos rediseñar 450m2 de áreas comunes y terraza corporativa. Urge visita a sitio la próxima semana.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: 'reunion',
    notes: 'Reunión agendada para el próximo martes a las 11:00 AM para levantamiento arquitectónico en sitio.'
  },
  {
    id: 'lead_sara_05',
    publicId: 'sara-sazedi',
    name: 'Dra. Valeria Gómez Conde',
    phone: '+52 442 670 1122',
    email: 'valeria.gomez@clinicaalttus.mx',
    company: 'Clínica Dermatológica Alttus Juriquilla',
    role: 'Directora Médica & Propietaria',
    message: 'Queremos un diseño interior que transmita serenidad y use materiales locales libres de VOCs para nuestros nuevos consultorios.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    status: 'cerrado',
    notes: 'Contrato firmado de proyecto ejecutivo de interiorismo bioclimático. Anticipo del 50% recibido en cuenta bancaria.'
  }
];

/**
 * Seeds mock leads for a profile (saved locally and to Firestore)
 */
export async function seedMockLeads(publicId: string): Promise<CapturedLead[]> {
  const cleanId = publicId.trim().toLowerCase();
  const mockData = cleanId === 'sara-sazedi' ? SARA_MOCK_LEADS : [];
  
  if (mockData.length === 0) return [];

  // 1. Save locally
  saveLocalLeads(cleanId, mockData);

  // 2. Sync to Firestore in the background
  try {
    for (const lead of mockData) {
      const docRef = doc(db, COLLECTION_NAME, lead.id);
      await setDoc(docRef, lead);
    }
  } catch (err) {
    console.warn('[LeadService] Could not sync mock leads to Firestore:', err);
  }

  return mockData;
}

/**
 * Saves a new captured lead to Firestore and local storage backup
 */
export async function saveLead(
  leadData: Omit<CapturedLead, 'id' | 'timestamp' | 'status'>
): Promise<CapturedLead> {
  const cleanId = leadData.publicId.trim().toLowerCase();
  const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const newLead: CapturedLead = {
    ...leadData,
    id,
    publicId: cleanId,
    timestamp: new Date().toISOString(),
    status: 'nuevo'
  };

  // 1. Save locally first (instant response)
  const local = getLocalLeads(cleanId);
  const updated = [newLead, ...local];
  saveLocalLeads(cleanId, updated);

  // 2. Sync to Firestore in the background
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await setDoc(docRef, newLead);
  } catch (err) {
    console.warn('[LeadService] Could not save to Firestore, stored locally:', err);
  }

  return newLead;
}

/**
 * Fetches all captured leads for a given publicId
 */
export async function getLeadsForProfile(publicId: string): Promise<CapturedLead[]> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalLeads(cleanId);

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('publicId', '==', cleanId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const remoteLeads: CapturedLead[] = [];
      snap.forEach((d) => {
        remoteLeads.push(d.data() as CapturedLead);
      });
      // Sort newest first
      remoteLeads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Update local storage cache
      saveLocalLeads(cleanId, remoteLeads);
      return remoteLeads;
    }
  } catch (err) {
    console.warn('[LeadService] Firestore load failed, using local leads:', err);
  }

  // If local already has leads, return them
  if (local.length > 0) {
    return local;
  }

  // If no leads exist and this is Sara Zea's profile, auto-seed realistic mock leads!
  if (cleanId === 'sara-sazedi') {
    return await seedMockLeads(cleanId);
  }

  return [];
}

/**
 * Updates a lead status (e.g. 'nuevo' -> 'contactado' -> 'reunion' -> 'cerrado')
 */
export async function updateLeadStatus(
  publicId: string,
  leadId: string,
  status: CapturedLead['status'],
  notes?: string
): Promise<boolean> {
  const cleanId = publicId.trim().toLowerCase();
  
  // 1. Update local
  const local = getLocalLeads(cleanId);
  const updated = local.map((l) => (l.id === leadId ? { ...l, status, ...(notes !== undefined ? { notes } : {}) } : l));
  saveLocalLeads(cleanId, updated);

  // 2. Update remote
  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    await updateDoc(docRef, { status, ...(notes !== undefined ? { notes } : {}) });
    return true;
  } catch (err) {
    console.warn('[LeadService] Could not update Firestore status:', err);
    return false;
  }
}

/**
 * Deletes a lead
 */
export async function deleteLead(publicId: string, leadId: string): Promise<boolean> {
  const cleanId = publicId.trim().toLowerCase();
  
  // 1. Local delete
  const local = getLocalLeads(cleanId);
  saveLocalLeads(cleanId, local.filter((l) => l.id !== leadId));

  // 2. Remote delete
  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('[LeadService] Could not delete from Firestore:', err);
    return false;
  }
}
