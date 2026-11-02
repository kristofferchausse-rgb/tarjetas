/**
 * Phone number normalization & validation utilities for RedConecta MX • Tribu Creativa QRO.
 * 
 * Rules:
 * - In Mexico, national numbers have 10 digits; the country code (+52) is additional (total 12 digits).
 * - International numbers with explicit country codes (+1, +34, +57, etc.) are fully supported.
 * - Prevents double prefixing (e.g. avoids 5252...).
 * - Distinguishes between telephone string, tel: protocol, vCard output, and wa.me clean digits.
 * - Note: A syntactically valid number does not guarantee an active WhatsApp account.
 */

export interface ParsedPhoneNumber {
  raw: string;
  countryCode: string; // e.g. '+52', '+1'
  nationalNumber: string; // e.g. '4423894512'
  formattedDisplay: string; // e.g. '+52 442 389 4512'
  telUri: string; // e.g. 'tel:+524423894512'
  waDigits: string; // e.g. '524423894512'
  isValid: boolean;
  isMexico: boolean;
}

export function parsePhoneNumber(rawPhone: string | undefined): ParsedPhoneNumber {
  const raw = (rawPhone || '').trim();
  const digitsOnly = raw.replace(/\D/g, '');

  if (!raw || !digitsOnly) {
    return {
      raw,
      countryCode: '+52',
      nationalNumber: '',
      formattedDisplay: '',
      telUri: 'tel:',
      waDigits: '',
      isValid: false,
      isMexico: true
    };
  }

  // 1. Check if the string explicitly starts with a plus sign '+'
  const hasExplicitPlus = raw.startsWith('+');

  let countryCode = '+52';
  let nationalNumber = digitsOnly;
  let isMexico = true;

  if (hasExplicitPlus) {
    // Has explicit international prefix
    if (digitsOnly.startsWith('52')) {
      countryCode = '+52';
      nationalNumber = digitsOnly.slice(2);
      // Handle legacy mobile '1' prefix (+52 1 442...)
      if (nationalNumber.length === 11 && nationalNumber.startsWith('1')) {
        nationalNumber = nationalNumber.slice(1);
      }
      isMexico = true;
    } else if (digitsOnly.startsWith('1') && digitsOnly.length === 11) {
      // US / Canada
      countryCode = '+1';
      nationalNumber = digitsOnly.slice(1);
      isMexico = false;
    } else if (digitsOnly.startsWith('34') && digitsOnly.length === 11) {
      // Spain
      countryCode = '+34';
      nationalNumber = digitsOnly.slice(2);
      isMexico = false;
    } else if (digitsOnly.startsWith('57') && digitsOnly.length === 12) {
      // Colombia
      countryCode = '+57';
      nationalNumber = digitsOnly.slice(2);
      isMexico = false;
    } else {
      // Generic international
      countryCode = '+' + digitsOnly.slice(0, digitsOnly.length - 10 || 2);
      nationalNumber = digitsOnly.slice(digitsOnly.length - 10 || 2);
      isMexico = false;
    }
  } else {
    // No explicit '+'.
    // If it's 10 digits, it's standard Mexican national number (e.g. 4423894512)
    if (digitsOnly.length === 10) {
      countryCode = '+52';
      nationalNumber = digitsOnly;
      isMexico = true;
    } else if (digitsOnly.startsWith('52') && digitsOnly.length === 12) {
      // e.g. 524423894512
      countryCode = '+52';
      nationalNumber = digitsOnly.slice(2);
      isMexico = true;
    } else if (digitsOnly.startsWith('521') && digitsOnly.length === 13) {
      // Legacy mobile prefix e.g. 5214423894512
      countryCode = '+52';
      nationalNumber = digitsOnly.slice(3);
      isMexico = true;
    } else {
      // Fallback
      countryCode = '+52';
      nationalNumber = digitsOnly;
      isMexico = true;
    }
  }

  // Format display cleanly
  let formattedDisplay = `${countryCode} ${nationalNumber}`;
  if (isMexico && nationalNumber.length === 10) {
    // Nice grouping: +52 442 389 4512
    formattedDisplay = `${countryCode} ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`;
  }

  const cleanCountryDigits = countryCode.replace(/\D/g, '');
  const waDigits = `${cleanCountryDigits}${nationalNumber}`;
  const telUri = `tel:${countryCode}${nationalNumber}`;

  // Basic validity check: Mexico requires 10 national digits
  const isValid = isMexico
    ? nationalNumber.length === 10
    : nationalNumber.length >= 7 && nationalNumber.length <= 14;

  return {
    raw,
    countryCode,
    nationalNumber,
    formattedDisplay,
    telUri,
    waDigits,
    isValid,
    isMexico
  };
}

/**
 * Returns a clean, normalized WhatsApp link without duplicating country codes.
 */
export function buildWhatsAppLink(rawPhone: string | undefined, message?: string): string {
  const parsed = parsePhoneNumber(rawPhone);
  if (!parsed.waDigits) return '#';
  const textParam = message ? `?text=${encodeURIComponent(message.trim())}` : '';
  return `https://wa.me/${parsed.waDigits}${textParam}`;
}
