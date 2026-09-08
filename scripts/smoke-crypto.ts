import { encrypt, decrypt } from "../lib/encryption";
import { generateOtp, hashOtp, verifyOtpHash } from "../lib/otp";

process.env.ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  "4184652a9f08c344df9ab6aa5cf9055f7c70d8a25914667665117bdc56f54663";

const plaintext = 'const hello = "world";';
const encrypted = encrypt(plaintext);
const decrypted = decrypt(encrypted);

if (decrypted !== plaintext) {
  console.error("encryption FAIL");
  process.exit(1);
}

const otp = generateOtp();
if (!/^\d{6}$/.test(otp)) {
  console.error("otp format FAIL", otp);
  process.exit(1);
}

if (!verifyOtpHash(otp, hashOtp(otp))) {
  console.error("otp hash FAIL");
  process.exit(1);
}

console.log("ok — encryption + otp");
