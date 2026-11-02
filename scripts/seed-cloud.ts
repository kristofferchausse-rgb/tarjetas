import { DEMO_ARCHETYPE_PROFILES } from '../src/data/demoArchetypeProfiles';
import { saveCloudProfile } from '../src/services/cardService';
import { seedMockLeads } from '../src/services/leadService';
import { seedMockMeetings } from '../src/services/meetingService';

async function seed() {
  console.log('🌱 [Seeder] Guardando los 7 perfiles demo oficiales, 5 contactos CRM y 4 sets de Meeting Intelligence en Firestore...');
  for (const profile of DEMO_ARCHETYPE_PROFILES) {
    console.log(`  -> Guardando ${profile.publicId} (${profile.name}) con ${profile.testimonials?.length || 0} testimonios...`);
    const success = await saveCloudProfile(profile);
    if (success) {
      console.log(`    ✅ Perfil guardado: ${profile.publicId}`);
    } else {
      console.warn(`    ⚠️ Falló guardado de perfil: ${profile.publicId}`);
    }

    const leads = await seedMockLeads(profile.publicId);
    console.log(`    📇 Leads en CRM para ${profile.publicId}: ${leads.leads?.length || 0} contactos sincronizados`);

    const meetings = await seedMockMeetings(profile.publicId);
    console.log(`    🎙️ Reuniones IA para ${profile.publicId}: ${meetings.length} registros sincronizados`);
  }
  console.log('🎉 [Seeder] Proceso finalizado.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seeder:', err);
  process.exit(1);
});
