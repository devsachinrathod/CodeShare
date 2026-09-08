import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { generateOtp, hashOtp, OTP_EXPIRY_MINUTES } from "@/lib/otp";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createShareSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`create:${ip}`, 20, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 400 }
      );
    }

    const parsed = createShareSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.errors[0]?.message ??
        "Something went wrong. Please try again.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const user = await getCurrentUser();
    const { code, language, title } = parsed.data;
    const encryptedCode = encrypt(code);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Retry on rare OTP hash collisions
    let otp = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      otp = generateOtp();
      const otpHash = hashOtp(otp);
      try {
        await prisma.codeShare.create({
          data: {
            otpHash,
            encryptedCode,
            language,
            title,
            expiresAt,
            userId: user?.id ?? null,
          },
        });
        break;
      } catch (err: unknown) {
        const isUniqueViolation =
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code: string }).code === "P2002";
        if (!isUniqueViolation || attempt === 4) {
          throw err;
        }
      }
    }

    return NextResponse.json({
      otp,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
