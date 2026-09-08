"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LogOut, LayoutDashboard, Send, Download } from "lucide-react";

export function CodeShareLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-stone-100"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-950 text-white shadow-sm transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 7-5 5 5 5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15 7 5 5-5 5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14 4-4 16"
          />
        </svg>
      </div>

      <span className="text-lg font-semibold tracking-tight text-stone-950">
        Code<span className="text-stone-400">Share</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const isHome = pathname === "/";
  const isSend = pathname === "/send";
  const isReceive = pathname === "/receive";
  const isDashboard = pathname === "/dashboard";

  // Compute initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-stone-200/80 bg-white/90 px-3 shadow-sm backdrop-blur-xl sm:px-4">
        {/* Logo */}
        <CodeShareLogo />

        {/* Center navigation */}
        <div className="hidden items-center gap-1 rounded-xl border border-stone-200 bg-stone-50/80 p-1 md:flex">
          <Link
            href="/"
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isHome
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-500 hover:bg-white/60 hover:text-stone-950"
            }`}
          >
            Home
          </Link>

          <Link
            href="/send"
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isSend
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-500 hover:bg-white/60 hover:text-stone-950"
            }`}
          >
            <Send className="h-3.5 w-3.5 text-stone-400" />
            Send
          </Link>

          <Link
            href="/receive"
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isReceive
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-500 hover:bg-white/60 hover:text-stone-950"
            }`}
          >
            <Download className="h-3.5 w-3.5 text-stone-400" />
            Receive
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isDashboard
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-500 hover:bg-white/60 hover:text-stone-950"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-stone-400" />
              My Codes
            </Link>
          )}
        </div>

        {/* Auth / Profile Actions */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-stone-200/70" />
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/80 px-2.5 py-1.5 transition-all hover:border-stone-300 hover:bg-white"
                title="Go to Dashboard"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-xs font-semibold text-white">
                  {initials}
                </div>
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-stone-800 sm:inline-block">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={() => logout()}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-stone-200 px-3 text-xs font-medium text-stone-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/signin"
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-stone-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-stone-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
