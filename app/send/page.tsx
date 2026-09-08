"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { CodeEditor } from "@/components/code-editor";
import { OtpDisplay } from "@/components/otp-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANGUAGES, LANGUAGE_LABELS, type Language } from "@/lib/validation";
import { OTP_EXPIRY_MINUTES } from "@/lib/otp-format";

type Result = {
  otp: string;
  expiresInMinutes: number;
};

export default function SendPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError("Please paste or write some code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          title: title.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult({
        otp: data.otp,
        expiresInMinutes: data.expiresInMinutes ?? OTP_EXPIRY_MINUTES,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleShareAnother() {
    setResult(null);
    setCode("");
    setTitle("");
    setError(null);
  }

  if (result) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 animate-fade-up text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Your code is ready
        </h1>
        <p className="mt-2 text-stone-500">Your OTP</p>

        <div className="mt-8">
          <OtpDisplay otp={result.otp} />
        </div>

        <p className="mt-8 text-sm leading-relaxed text-stone-600">
          Send this OTP to the person receiving your code.
        </p>
        <p className="mt-2 text-sm text-stone-500">
          The OTP expires in {result.expiresInMinutes} minutes.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <Button type="button" variant="secondary" onClick={handleShareAnother}>
            Share Another Code
          </Button>
          <Link
            href="/receive"
            className="text-sm text-stone-500 underline-offset-4 hover:text-stone-800 hover:underline"
          >
            Go to Receive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 animate-fade-up">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        Share Code
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Paste your code, generate a secure OTP, and send it to someone you trust.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            disabled={loading}
            className="flex h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_LABELS[lang]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="font-normal text-stone-400">(optional)</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Auth helper"
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <CodeEditor
            id="code"
            value={code}
            onChange={setCode}
            placeholder="Paste or write your code here"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Generating…
            </>
          ) : (
            "Generate Secure Code"
          )}
        </Button>
      </form>
    </div>
  );
}
