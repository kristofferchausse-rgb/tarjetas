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

  return local;
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
