"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Copy, Loader2 } from "lucide-react";
import { CodeEditor } from "@/components/code-editor";
import { OtpInput } from "@/components/otp-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LANGUAGE_LABELS, type Language } from "@/lib/validation";

type Redeemed = {
  code: string;
  language: string;
  title: string | null;
};

export default function ReceivePage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Redeemed | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (otp.replace(/\D/g, "").length !== 6) {
      setError(
        "That OTP doesn't look right. Please check the code and try again."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/shares/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult({
        code: data.code,
        language: data.language,
        title: data.title ?? null,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = result.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleReceiveAnother() {
    setResult(null);
    setOtp("");
    setError(null);
    setCopied(false);
  }

  if (result) {
    const langLabel =
      LANGUAGE_LABELS[result.language as Language] ?? result.language;

    return (
      <div className="mx-auto w-full animate-fade-up py-2">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Code Ready
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
          <span>{langLabel}</span>
          {result.title && (
            <>
              <span aria-hidden className="text-stone-300">
                ·
              </span>
              <span>{result.title}</span>
            </>
          )}
        </div>

        <div className="mt-6">
          <CodeEditor value={result.code} readOnly aria-label="Shared code" />
        </div>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden />
                Code copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden />
                Copy Code
              </>
            )}
          </Button>

          {copied && (
            <p
              role="status"
              className="animate-fade-up text-center text-sm font-medium text-emerald-700"
            >
              Code copied!
            </p>
          )}

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleReceiveAnother}
          >
            Receive Another Code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md animate-fade-up py-4">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        Receive Code
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Enter the OTP you received.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp" className="sr-only">
            OTP
          </Label>
          <OtpInput
            id="otp"
            value={otp}
            onChange={setOtp}
            disabled={loading}
            aria-invalid={!!error}
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

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading || otp.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Retrieving…
            </>
          ) : (
            "Get Code"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-400">
        Need to share instead?{" "}
        <Link
          href="/send"
          className="text-stone-600 underline-offset-4 hover:underline"
        >
          Send Code
        </Link>
      </p>
    </div>
  );
}
