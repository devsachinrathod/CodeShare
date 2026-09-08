"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = "Paste or write your code here",
  className,
  id,
  "aria-label": ariaLabel,
}: CodeEditorProps) {
  return (
    <textarea
      id={id}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      aria-label={ariaLabel ?? "Code"}
      className={cn(
        "min-h-[280px] w-full resize-y rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 font-mono text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        readOnly && "bg-stone-50 cursor-default",
        className
      )}
    />
  );
}
