import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { hashOtp } from "@/lib/otp";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { redeemShareSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`redeem:${ip}`, 10, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a moment and try again." },
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

    const parsed = redeemShareSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.errors[0]?.message ??
        "That OTP doesn't look right. Please check the code and try again.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { otp } = parsed.data;
    const otpHash = hashOtp(otp);

    const share = await prisma.codeShare.findUnique({
      where: { otpHash },
    });

    // Generic invalid response — do not reveal whether OTP exists
    if (!share) {
      return NextResponse.json(
        {
          error:
            "That OTP doesn't look right. Please check the code and try again.",
        },
        { status: 400 }
      );
    }

    if (share.usedAt) {
      return NextResponse.json(
        { error: "This code has already been used." },
        { status: 410 }
      );
    }

    if (share.expiresAt.getTime() <= Date.now()) {
      return NextResponse.json(
        {
          error:
            "This code has expired. Ask the sender to generate a new one.",
        },
        { status: 410 }
      );
    }

    // Mark as used first to prevent race conditions / double redeem
    const updated = await prisma.codeShare.updateMany({
      where: {
        id: share.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });

    if (updated.count === 0) {
      // Re-check to give a precise message
      const current = await prisma.codeShare.findUnique({
        where: { id: share.id },
      });
      if (current?.usedAt) {
        return NextResponse.json(
          { error: "This code has already been used." },
          { status: 410 }
        );
      }
      return NextResponse.json(
        {
          error:
            "This code has expired. Ask the sender to generate a new one.",
        },
        { status: 410 }
      );
    }

    let code: string;
    try {
      code = decrypt(share.encryptedCode);
    } catch {
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      code,
      language: share.language,
      title: share.title,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
