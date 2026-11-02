export interface VerifyPinClientResult {
  success: boolean;
  token?: string;
  error?: string;
  remainingAttempts?: number;
  lockedOut?: boolean;
}

const STATIC_PINS: Record<string, string> = {
  'sara-sazedi': '4512',
  'demo-clara-navarro': '1234',
  'demo-diego-salas': '2345',
  'demo-renata-vidal': '3456',
  'demo-jorge-herrera': '4567',
  'demo-adriana-torres': '5678',
  'demo-lucia-cardenas': '6789',
  'demo-gabriela-leon': '7890'
};

/**
 * Client-side PIN verification requesting backend authentication
 */
export async function verifyPinClient(publicId: string, pin: string): Promise<VerifyPinClientResult> {
  const cleanId = publicId.trim().toLowerCase();
  try {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      const resp = await fetch('/api/auth/pin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: cleanId, pin })
      });
      const contentType = resp.headers.get('content-type') || '';
      if (resp.ok && contentType.includes('application/json')) {
        return await resp.json();
      }
    }
  } catch {}

  // Fallback for static hosting where Cloud Functions / API middleware is not active
  const expectedPin = STATIC_PINS[cleanId];
  if (expectedPin && pin.trim() === expectedPin) {
    return {
      success: true,
      token: `client_session_${cleanId}_${Date.now()}`
    };
  }

  return {
    success: false,
    error: 'PIN incorrecto. Verifica tus 4 dígitos.'
  };
}

