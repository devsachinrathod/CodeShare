import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE_NAME = "codeshare_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: { id: session.id },
    }).catch(() => {});
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return {
    user: session.user,
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
    },
  };
}

export async function getCurrentUser() {
  const sessionData = await getSession();
  return sessionData?.user ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { sessionToken: token },
    }).catch(() => {});
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}
