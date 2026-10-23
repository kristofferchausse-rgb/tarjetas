import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MeetingRecording, MeetingActionItem } from '../types/meeting';

const COLLECTION_NAME = 'meetings';

export const SARA_MOCK_MEETINGS: MeetingRecording[] = [
  {
    id: 'meet_sara_01',
    publicId: 'sara-sazedi',
    leadId: 'lead_sara_01',
    leadName: 'Arq. Roberto Morales',
    leadCompany: 'Desarrollos Residenciales del Bajío',
    title: 'Acuerdos Bioclimáticos Zibatá (12 Residencias Premium)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    durationSeconds: 860, // 14m 20s
    dealTemperature: 'caliente',
    category: 'reunion_presencial',
    budgetMentioned: '$350,000 MXN',
    summary: [
      'Roberto presentó el plano maestro para 12 residencias premium en Zibatá.',
      'Su principal dolor son quejas de compradores por sobrecalentamiento en fachadas poniente.',
      'Requieren consultoría de diseño pasivo, ventilación cruzada e interiorismo bioclimático con cantera local.',
      'Presupuesto preliminar aprobado para la etapa de proyecto ejecutivo: $350,000 MXN.'
    ],
    painPoints: [
      'Sobrecalentamiento excesivo en recámaras secundarias durante verano.',
      'Descontento con el despacho de arquitectura anterior por falta de conocimiento bioclimático.',
      'Urgencia para tener casas muestra listas para preventa en primer trimestre.'
    ],
    actionItems: [
      {
        id: 'act_1',
        task: 'Enviar propuesta técnica y alcance bioclimático detallado',
        assignee: 'Sara Zea',
        dueDate: 'Viernes 4:00 PM',
        completed: false
      },
      {
        id: 'act_2',
        task: 'Compartir archivos CAD/DWG de fachadas y cortes estructurales',
        assignee: 'Arq. Roberto Morales',
        dueDate: 'Miércoles mediodía',
        completed: false
      },
      {
        id: 'act_3',
        task: 'Coordinar visita de medición solar en sitio con equipo técnico',
        assignee: 'Sara Zea',
        dueDate: 'Próximo lunes 10:00 AM',
        completed: false
      }
    ],
    transcript:
      'Roberto Morales: Hola Sara, qué gusto saludarte. Como te comenté en el evento de networking, traemos 12 residencias premium en Zibatá y queremos que tu despacho tome la consultoría bioclimática.\n\nSara Zea: Me parece extraordinario Roberto. Platícame, ¿cuál es el principal reto de confort que detectaron?\n\nRoberto Morales: En el desarrollo anterior tuvimos quejas severas de sobrecalentamiento en fachadas poniente. Los clientes no quieren vivir con aire acondicionado encendido las 24 horas. Buscan ventilación cruzada e iluminación natural.\n\nSara Zea: Totalmente alineado a nuestra filosofía. Con celosías de diseño y orientación solar estratégica reducimos hasta 6 grados la temperatura interior sin consumo eléctrico.\n\nRoberto Morales: Excelente. Traemos un presupuesto estimado de 350 mil pesos para el proyecto ejecutivo y especificación de interiores. ¿Cuándo podrías tenernos la propuesta formal?\n\nSara Zea: Te la hago llegar este viernes antes de las 4:00 PM. ¿Te parece si me compartes los DWG para afinar costos?\n\nRoberto Morales: Claro, te los mando el miércoles al mediodía.'
  },
  {
    id: 'meet_sara_02',
    publicId: 'sara-sazedi',
    leadId: 'lead_sara_03',
    leadName: 'Ing. Marcela Vega Salgado',
    leadCompany: 'Grupo Hotelero Hacienda San José',
    title: 'Remodelación Suites Ejecutivas Sustentables',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    durationSeconds: 525, // 8m 45s
    dealTemperature: 'caliente',
    category: 'llamada_telefonica',
    budgetMentioned: '$600,000 MXN (Fase 1)',
    summary: [
      'Marcela busca certificar en sustentabilidad las 8 suites ejecutivas del hotel boutique.',
      'Buscan sustituir materiales sintéticos por maderas certificadas y pinturas minerales libres de VOCs.',
      'Aprobación final del consejo administrativo programada para fin de mes.'
    ],
    painPoints: [
      'Olores a pintura y solventes que molestaban a huéspedes frecuentes.',
      'Gasto excesivo de electricidad en minisplits en temporada de calor.'
    ],
    actionItems: [
      {
        id: 'act_4',
        task: 'Enviar catálogo de acabados naturales y ficha técnica de COVs',
        assignee: 'Sara Zea',
        dueDate: 'Jueves',
        completed: true
      },
      {
        id: 'act_5',
        task: 'Presentación ejecutiva ante dirección de operaciones del hotel',
        assignee: 'Sara Zea y Marcela Vega',
        dueDate: 'Lunes 11:00 AM',
        completed: false
      }
    ],
    transcript:
      'Marcela Vega: Hola Sara, revisé tu tarjeta digital y el video de caso de éxito. Queremos remodelar nuestras 8 suites ejecutivas con materiales libres de químicos y confort térmico pasivo.\n\nSara Zea: Es un proyecto perfecto para SAZEDI. Podemos integrar cantera regional, recubrimientos de cal artesanal y ventilación estratificada.\n\nMarcela Vega: Justo lo que buscamos. Tenemos sesión con el consejo para autorizar la Fase 1 estimada en 600 mil pesos.'
  },
  {
    id: 'meet_sara_03',
    publicId: 'sara-sazedi',
    leadId: 'lead_sara_04',
    leadName: 'Lic. Fernando Garza Ruiz',
    leadCompany: 'Corporativo Plaza Náutica Juriquilla',
    title: 'Audio-Nota: Pérgolas Solares Terraza Corporativa',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(), // 3 days ago
    durationSeconds: 72, // 1m 12s
    dealTemperature: 'tibio',
    category: 'audio_nota',
    budgetMentioned: 'Por definir en levantamiento',
    summary: [
      'Nota de voz grabada al salir de reunión de pasillo con Fernando Garza en Plaza Náutica.',
      'Tienen 450 m² de terraza corporativa desaprovechada por falta de sombra.',
      'Interés en pérgolas bioclimáticas con captación solar para iluminación nocturna.'
    ],
    painPoints: [
      'Área de terraza vacía entre las 11:00 y las 17:00 por radiación solar directa.'
    ],
    actionItems: [
      {
        id: 'act_6',
        task: 'Levantamiento arquitectónico y estudio de asoleamiento en sitio',
        assignee: 'Sara Zea',
        dueDate: 'Martes 11:00 AM',
        completed: true
      }
    ],
    transcript:
      'Sara Zea (Nota de voz post-reunión): Acabo de platicar brevemente con Fernando Garza de Corporativo Plaza Náutica. Tienen 450 metros cuadrados de terraza corporativa totalmente desaprovechados porque les pega el sol de lleno todo el día. Le encantó la idea de instalar pérgolas bioclimáticas con sombraje inteligente. Quedamos de hacer el levantamiento físico y medición de sombras el próximo martes a las 11:00 AM en sitio.'
  }
];

function getLocalMeetings(publicId: string): MeetingRecording[] {
  try {
    const raw = localStorage.getItem(`tarjetas_meetings_${publicId.toLowerCase()}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMeetings(publicId: string, meetings: MeetingRecording[]): void {
  try {
    localStorage.setItem(`tarjetas_meetings_${publicId.toLowerCase()}`, JSON.stringify(meetings));
  } catch {}
}

/**
 * Seeds mock meetings locally and to Firestore
 */
export async function seedMockMeetings(publicId: string): Promise<MeetingRecording[]> {
  const cleanId = publicId.trim().toLowerCase();
  const mockData = cleanId === 'sara-sazedi' ? SARA_MOCK_MEETINGS : [];

  if (mockData.length === 0) return [];

  // 1. Save locally
  saveLocalMeetings(cleanId, mockData);

  // 2. Sync to Firestore in background
  try {
    for (const item of mockData) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await setDoc(docRef, item);
    }
  } catch (err) {
    console.warn('[MeetingService] Could not sync mock meetings to Firestore:', err);
  }

  return mockData;
}

/**
 * Fetches all meetings for a profile, sorted newest first
 */
export async function getMeetingsForProfile(publicId: string): Promise<MeetingRecording[]> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalMeetings(cleanId);

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('publicId', '==', cleanId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const remote: MeetingRecording[] = [];
      snap.forEach((d) => {
        remote.push(d.data() as MeetingRecording);
      });
      // Sort newest first
      remote.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      saveLocalMeetings(cleanId, remote);
      return remote;
    }
  } catch (err) {
    console.warn('[MeetingService] Firestore load failed, using local meetings:', err);
  }

  if (local.length > 0) {
    return local;
  }

  // Auto-seed for Sara Zea if empty
  if (cleanId === 'sara-sazedi') {
    return await seedMockMeetings(cleanId);
  }

  return [];
}

/**
 * Saves a new meeting recording
 */
export async function saveMeeting(
  meetingData: Omit<MeetingRecording, 'id' | 'timestamp'>
): Promise<MeetingRecording> {
  const cleanId = meetingData.publicId.trim().toLowerCase();
  const id = `meet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newMeeting: MeetingRecording = {
    ...meetingData,
    id,
    publicId: cleanId,
    timestamp: new Date().toISOString()
  };

  // 1. Save locally
  const local = getLocalMeetings(cleanId);
  const updated = [newMeeting, ...local];
  saveLocalMeetings(cleanId, updated);

  // 2. Sync to Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await setDoc(docRef, newMeeting);
  } catch (err) {
    console.warn('[MeetingService] Could not save to Firestore, saved locally:', err);
  }

  return newMeeting;
}

/**
 * Toggles an action item completed state
 */
export async function toggleMeetingActionItem(
  publicId: string,
  meetingId: string,
  actionItemId: string,
  completed: boolean
): Promise<boolean> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalMeetings(cleanId);

  const updated = local.map((m) => {
    if (m.id !== meetingId) return m;
    const updatedItems = m.actionItems.map((item) =>
      item.id === actionItemId ? { ...item, completed } : item
    );
    return { ...m, actionItems: updatedItems };
  });

  saveLocalMeetings(cleanId, updated);

  try {
    const docRef = doc(db, COLLECTION_NAME, meetingId);
    const targetMeeting = updated.find((m) => m.id === meetingId);
    if (targetMeeting) {
      await updateDoc(docRef, { actionItems: targetMeeting.actionItems });
    }
    return true;
  } catch (err) {
    console.warn('[MeetingService] Could not update action item in Firestore:', err);
    return false;
  }
}

/**
 * Deletes a meeting
 */
export async function deleteMeeting(publicId: string, meetingId: string): Promise<boolean> {
  const cleanId = publicId.trim().toLowerCase();
  const local = getLocalMeetings(cleanId);

  saveLocalMeetings(cleanId, local.filter((m) => m.id !== meetingId));

  try {
    const docRef = doc(db, COLLECTION_NAME, meetingId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('[MeetingService] Could not delete from Firestore:', err);
    return false;
  }
}
