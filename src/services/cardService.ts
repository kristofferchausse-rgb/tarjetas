import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ParticipantProfile } from '../types/card';
import { INITIAL_PROFILES } from '../data/profiles';

const COLLECTION_NAME = 'profiles';

// Sanitize object so Firestore does not reject undefined fields
function sanitizeForFirestore<T>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!obj || typeof obj !== 'object') return result;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item
        );
      } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Fetch a single participant profile by publicId or slug from Firestore
 */
export async function getCloudProfile(publicId: string): Promise<ParticipantProfile | null> {
  try {
    const cleanId = publicId.trim().toLowerCase();
    const docRef = doc(db, COLLECTION_NAME, cleanId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as ParticipantProfile;
    }
    return null;
  } catch (error) {
    console.warn('[CloudService] Failed to load profile from Firestore:', error);
    return null;
  }
}

/**
 * Fetch all participant profiles from Firestore
 */
export async function getAllCloudProfiles(): Promise<ParticipantProfile[] | null> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      return null;
    }

    const profiles: ParticipantProfile[] = [];
    snap.forEach((d) => {
      profiles.push(d.data() as ParticipantProfile);
    });

    return profiles;
  } catch (error) {
    console.warn('[CloudService] Failed to load profiles from Firestore:', error);
    return null;
  }
}

/**
 * Save or update a participant profile in Firestore
 */
export async function saveCloudProfile(profile: ParticipantProfile): Promise<boolean> {
  try {
    const cleanId = profile.publicId.trim().toLowerCase();
    const docRef = doc(db, COLLECTION_NAME, cleanId);
    const sanitized = sanitizeForFirestore(profile);
    await setDoc(docRef, sanitized, { merge: true });
    return true;
  } catch (error) {
    console.warn('[CloudService] Failed to save profile to Firestore:', error);
    return false;
  }
}

/**
 * Delete a profile from Firestore
 */
export async function deleteCloudProfile(publicId: string): Promise<boolean> {
  try {
    const cleanId = publicId.trim().toLowerCase();
    const docRef = doc(db, COLLECTION_NAME, cleanId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn('[CloudService] Failed to delete profile from Firestore:', error);
    return false;
  }
}

/**
 * Seed initial profiles into Firestore if collection is empty
 */
export async function seedInitialProfilesIfEmpty(): Promise<void> {
  try {
    const existing = await getAllCloudProfiles();
    if (!existing || existing.length === 0) {
      for (const p of INITIAL_PROFILES) {
        await saveCloudProfile(p);
      }
    }
  } catch (err) {
    console.warn('[CloudService] Seeding skipped or error:', err);
  }
}
