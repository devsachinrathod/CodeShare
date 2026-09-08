import { createHash, randomInt, timingSafeEqual } from "crypto";
import { normalizeOtp, OTP_EXPIRY_MINUTES } from "@/lib/otp-format";

export { normalizeOtp, formatOtpDisplay, OTP_EXPIRY_MINUTES } from "@/lib/otp-format";

const OTP_LENGTH = 6;
const OTP_PEPPER = process.env.ENCRYPTION_KEY ?? "codeshare-otp-pepper";

/**
 * Generates a cryptographically random 6-digit OTP (000000–999999).
 */
export function generateOtp(): string {
  const max = 10 ** OTP_LENGTH;
  const value = randomInt(0, max);
  return value.toString().padStart(OTP_LENGTH, "0");
}

/**
 * Creates a SHA-256 hash of the OTP. Never store plaintext OTPs.
 */
export function hashOtp(otp: string): string {
  return createHash("sha256")
    .update(`${OTP_PEPPER}:${normalizeOtp(otp)}`)
    .digest("hex");
}

/**
 * Constant-time comparison of two OTP hashes.
 */
export function verifyOtpHash(otp: string, storedHash: string): boolean {
  const computed = Buffer.from(hashOtp(otp), "hex");
  const stored = Buffer.from(storedHash, "hex");
  if (computed.length !== stored.length) {
    return false;
  }
  return timingSafeEqual(computed, stored);
}
