/**
 * Client-safe OTP helpers (no Node crypto).
 */

/**
 * Strips spaces and non-digits from user input.
 */
export function normalizeOtp(otp: string): string {
  return otp.replace(/\D/g, "");
}

/**
 * Formats OTP for display: "839274" → "839 274"
 */
export function formatOtpDisplay(otp: string): string {
  const digits = normalizeOtp(otp);
  if (digits.length !== 6) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export const OTP_EXPIRY_MINUTES = 10;
