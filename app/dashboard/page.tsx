"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import {
  Loader2,
  Send,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGE_LABELS, type Language } from "@/lib/validation";

type UserShare = {
  id: string;
  title: string | null;
  language: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  isUsed: boolean;
  isExpired: boolean;
  isActive: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [shares, setShares] = useState<UserShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchShares = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/shares");
      if (res.status === 401) {
        router.push("/signin?redirect=/dashboard");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setShares(data.shares ?? []);
      } else {
        setError(data.error ?? "Failed to load shares.");
      }
    } catch {
      setError("Failed to load your shares. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/signin?redirect=/dashboard");
      } else {
        fetchShares();
      }
    }
  }, [authLoading, user, router, fetchShares]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this shared code? The OTP will no longer work.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/user/shares?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShares((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete share. Please try again.");
      }
    } catch {
      alert("Failed to delete share. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (authLoading || (loading && !shares.length)) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  const activeCount = shares.filter((s) => s.isActive).length;
  const usedCount = shares.filter((s) => s.isUsed).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              <Sparkles className="h-3 w-3" />
              Logged in
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {user?.email} · Manage your shared code snippets and OTPs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/send">
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Share New Code
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">Total Shares</span>
            <Code2 className="h-4 w-4 text-stone-400" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {shares.length}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">Active Codes</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">Redeemed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {usedCount}
          </p>
        </div>
      </div>

      {/* Shares List */}
      <div className="mt-10">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Your Code Snippets
          </h2>
          <span className="text-xs text-stone-400">
            {shares.length} {shares.length === 1 ? "item" : "items"}
          </span>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {shares.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white/60 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-stone-900">
              No shared codes yet
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Share a snippet to generate a secure, single-use OTP.
            </p>
            <div className="mt-6">
              <Link href="/send">
                <Button>Share Code Now</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            {shares.map((share) => {
              const langLabel =
                LANGUAGE_LABELS[share.language as Language] ?? share.language;
              const createdDate = new Date(share.createdAt).toLocaleString(
                undefined,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                }
              );

              return (
                <div
                  key={share.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">
                        {share.title || "Untitled Snippet"}
                      </span>
                      <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                        {langLabel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                      <span>Shared {createdDate}</span>
                      <span>•</span>
                      {share.isUsed ? (
                        <span className="flex items-center gap-1 font-medium text-blue-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Redeemed
                        </span>
                      ) : share.isExpired ? (
                        <span className="flex items-center gap-1 text-stone-400">
                          <AlertCircle className="h-3 w-3" />
                          Expired
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-medium text-emerald-600">
                          <Clock className="h-3 w-3" />
                          Active OTP
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(share.id)}
                      disabled={deletingId === share.id}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-stone-200 px-3 text-xs font-medium text-stone-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      title="Delete share"
                    >
                      {deletingId === share.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
