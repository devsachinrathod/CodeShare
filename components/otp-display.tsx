"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatOtpDisplay } from "@/lib/otp-format";
import { cn } from "@/lib/utils";

type OtpDisplayProps = {
  otp: string;
  className?: string;
};

export function OtpDisplay({ otp, className }: OtpDisplayProps) {
  const [copied, setCopied] = useState(false);
  const display = formatOtpDisplay(otp);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = otp;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        className="select-all rounded-xl bg-stone-900 px-8 py-6 text-center"
        aria-label={`OTP: ${display}`}
      >
        <span className="font-mono text-4xl font-semibold tracking-[0.35em] text-stone-50 sm:text-5xl">
          {display}
        </span>
      </div>
      <Button type="button" onClick={handleCopy} variant="secondary" size="lg">
        {copied ? (
          <>
            <Check className="h-4 w-4" aria-hidden />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" aria-hidden />
            Copy OTP
          </>
        )}
      </Button>
    </div>
  );
}
