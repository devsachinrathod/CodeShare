"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

export function OtpInput({
  value,
  onChange,
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: OtpInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(digits);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
  }

  const display =
    value.length <= 3
      ? value
      : `${value.slice(0, 3)} ${value.slice(3)}`;

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9 ]*"
      maxLength={7}
      value={display}
      onChange={handleChange}
      onPaste={handlePaste}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      aria-label="One-time password"
      placeholder="000 000"
      className={cn(
        "h-16 w-full rounded-xl border border-stone-300 bg-white px-4 text-center font-mono text-3xl font-semibold tracking-[0.35em] text-stone-900 placeholder:text-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        ariaInvalid && "border-red-400 focus-visible:ring-red-300",
        className
      )}
    />
  );
}
