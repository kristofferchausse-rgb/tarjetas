/**
 * Utilities for exporting scheduled CRM appointments to external calendars:
 * - Google Calendar Web URL (direct 1-click add)
 * - Apple / Outlook .ics iCalendar file download
 */

export interface CalendarEventPayload {
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  durationMinutes?: number;
  description?: string;
  location?: string;
}

/**
 * Generates a direct Google Calendar web event creation URL.
 */
export function generateGoogleCalendarUrl(event: CalendarEventPayload): string {
  const [year, month, day] = event.date.split('-');
  const time = event.time || '10:00';
  const [hour, minute] = time.split(':');

  const duration = event.durationMinutes || 60;
  const start = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10)
  );

  const end = new Date(start.getTime() + duration * 60 * 1000);

  const formatGCalDate = (d: Date): string => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: datesParam,
    details: event.description || 'Cita agendada desde el Mini-CRM de Tarjetas Digitales RedConecta MX',
    location: event.location || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates and downloads a universal .ics file for Apple Calendar, Outlook, and mobile native apps.
 */
export function downloadIcsFile(event: CalendarEventPayload, fileName?: string): void {
  const [year, month, day] = event.date.split('-');
  const time = event.time || '10:00';
  const [hour, minute] = time.split(':');

  const duration = event.durationMinutes || 60;
  const start = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10)
  );
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const formatIcsDate = (d: Date): string => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RedConecta MX//Tarjetas Digitales Inteligentes//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:crm_event_${Date.now()}@redconecta.mx`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${event.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    `LOCATION:${(event.location || '').replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(fileName || 'cita_crm').toLowerCase().replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
