export const COVER_LETTER_COOKIE = "portfolio_cover_letter";

const SESSION_PREFIX = "portfolio-cover-letter:";

export function getCoverLetterAccessKey(): string {
  return process.env.COVER_LETTER_ACCESS_KEY?.trim() ?? "";
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isValidCoverLetterAccessKey(candidate: string): boolean {
  const expected = getCoverLetterAccessKey();
  if (!expected || !candidate) return false;
  return timingSafeEqualString(candidate, expected);
}

function bufferToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Valor de cookie derivado de la clave; no revela la clave en texto plano. */
export async function coverLetterSessionValue(): Promise<string> {
  const key = getCoverLetterAccessKey();
  if (!key) return "";
  const data = new TextEncoder().encode(`${SESSION_PREFIX}${key}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(new Uint8Array(hash));
}

export async function hasCoverLetterSession(cookieValue: string | undefined): Promise<boolean> {
  const expected = await coverLetterSessionValue();
  if (!expected || !cookieValue) return false;
  return timingSafeEqualString(cookieValue, expected);
}
