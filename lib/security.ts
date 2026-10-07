import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const derived = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(hex, "hex");
  return storedBuffer.length === derived.length && timingSafeEqual(storedBuffer, derived);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function safeEqualText(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
