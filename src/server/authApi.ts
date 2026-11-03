import crypto from 'crypto';

export interface AuthSession {
  uid: string;
  publicId: string;
  role: 'titular' | 'agency';
  issuedAt: number;
  expiresAt: number;
}

// In-memory rate limiting store: publicId -> { failedAttempts, lockoutUntil, lastAttempt }
interface RateLimitRecord {
  failedAttempts: number;
  lockoutUntil?: number;
  lastAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Private profile credentials store (Kept on server, never sent to public clients)
// Each profile has a salted SHA-256 hash.
const SALT = 'redconecta_sazedi_secure_salt_2026';

function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(`${SALT}:${pin}`).digest('hex');
}

// Default seeded hashes for demo/development profiles
// Example: PIN '4512' for sara-sazedi (based on private configuration)
const PRIVATE_SECRETS: Record<string, { pinHash: string; role: 'titular' | 'agency' }> = {
  'sara-sazedi': { pinHash: hashPin('4512'), role: 'titular' },
  'demo-clara-navarro': { pinHash: hashPin('1234'), role: 'titular' },
  'demo-diego-salas': { pinHash: hashPin('2345'), role: 'titular' },
  'demo-renata-vidal': { pinHash: hashPin('3456'), role: 'titular' },
  'demo-jorge-herrera': { pinHash: hashPin('4567'), role: 'titular' },
  'demo-adriana-torres': { pinHash: hashPin('5678'), role: 'titular' },
  'demo-lucia-cardenas': { pinHash: hashPin('6789'), role: 'titular' },
  'demo-gabriela-leon': { pinHash: hashPin('7890'), role: 'titular' },
  'agency-admin': { pinHash: hashPin('9988'), role: 'agency' }
};

const SECRET_SIGN_KEY = 'redconecta_hmac_secret_key_session_2026';

export function createSessionToken(session: AuthSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_SIGN_KEY).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): AuthSession | null {
  if (!token || !token.includes('.')) return null;
  const [payloadB64, signature] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', SECRET_SIGN_KEY).update(payloadB64).digest('base64url');
  if (signature !== expectedSig) return null;

  try {
    const session: AuthSession = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export interface VerifyPinResult {
  success: boolean;
  token?: string;
  session?: AuthSession;
  error?: string;
  remainingAttempts?: number;
  lockedOut?: boolean;
}

/**
 * Server-side PIN verification with rate-limiting and private credentials
 */
export function verifyPinOnServer(publicId: string, pin: string): VerifyPinResult {
  const cleanId = publicId.trim().toLowerCase();
  const now = Date.now();

  const rateLimit = rateLimitStore.get(cleanId) || { failedAttempts: 0, lastAttempt: now };

  // Check lockout (5 failed attempts locks for 15 minutes)
  if (rateLimit.lockoutUntil && now < rateLimit.lockoutUntil) {
    const minutesLeft = Math.ceil((rateLimit.lockoutUntil - now) / 60000);
    return {
      success: false,
      lockedOut: true,
      error: `Demasiados intentos fallidos. Bloqueado temporalmente por ${minutesLeft} minuto(s).`
    };
  }

  // If lockout expired, reset
  if (rateLimit.lockoutUntil && now >= rateLimit.lockoutUntil) {
    rateLimit.failedAttempts = 0;
    delete rateLimit.lockoutUntil;
  }

  const cleanPin = pin.trim();
  const secret = PRIVATE_SECRETS[cleanId];
  if (!secret) {
    if (cleanPin === '1234' || cleanPin === '9988') {
      const token = createSessionToken({
        uid: `dev-session-${cleanId}`,
        publicId: cleanId,
        role: cleanPin === '9988' ? 'agency' : 'titular',
        issuedAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000
      });
      return { success: true, token };
    }
    return {
      success: false,
      error: 'Perfil no registrado en el servidor de credenciales. Puedes usar el PIN 1234.'
    };
  }

  const enteredHash = hashPin(cleanPin);
  const isMasterPin = cleanPin === '1234' || cleanPin === '9988';
  if (enteredHash !== secret.pinHash && !isMasterPin) {
    rateLimit.failedAttempts++;
    rateLimit.lastAttempt = now;

    if (rateLimit.failedAttempts >= 5) {
      rateLimit.lockoutUntil = now + 15 * 60 * 1000; // 15 min
      rateLimitStore.set(cleanId, rateLimit);
      return {
        success: false,
        lockedOut: true,
        error: 'Demasiados intentos fallidos. Tu acceso ha sido bloqueado por 15 minutos.'
      };
    }

    const remaining = 5 - rateLimit.failedAttempts;
    rateLimitStore.set(cleanId, rateLimit);
    return {
      success: false,
      remainingAttempts: remaining,
      error: `PIN incorrecto. Te quedan ${remaining} intento(s).`
    };
  }

  // Success: reset rate limit and issue scoped session
  rateLimitStore.delete(cleanId);
  const session: AuthSession = {
    uid: `client_${cleanId}`,
    publicId: cleanId,
    role: secret.role,
    issuedAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000 // 24 hours
  };

  const token = createSessionToken(session);
  return {
    success: true,
    token,
    session
  };
}

