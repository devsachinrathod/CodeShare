import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shares = await prisma.codeShare.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        language: true,
        createdAt: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    const now = new Date();
    const formattedShares = shares.map((s) => ({
      ...s,
      isUsed: Boolean(s.usedAt),
      isExpired: s.expiresAt < now,
      isActive: !s.usedAt && s.expiresAt >= now,
    }));

    return NextResponse.json({ shares: formattedShares });
  } catch (err) {
    console.error("Fetch user shares error:", err);
    return NextResponse.json(
      { error: "Failed to fetch shared codes." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Share ID is required" }, { status: 400 });
    }

    // Ensure the share belongs to the current user
    const share = await prisma.codeShare.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!share) {
      return NextResponse.json(
        { error: "Share not found or permission denied" },
        { status: 404 }
      );
    }

    await prisma.codeShare.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete user share error:", err);
    return NextResponse.json(
      { error: "Failed to delete share." },
      { status: 500 }
    );
  }
}
