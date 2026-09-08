import { z } from "zod";

export const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "html",
  "css",
  "json",
  "sql",
  "bash",
  "other",
] as const;

export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  sql: "SQL",
  bash: "Bash",
  other: "Other",
};

const MAX_CODE_LENGTH = 100_000;
const MAX_TITLE_LENGTH = 100;

export const createShareSchema = z.object({
  code: z
    .string()
    .min(1, "Please paste or write some code.")
    .max(MAX_CODE_LENGTH, "Code is too long. Keep it under 100,000 characters."),
  language: z.enum(LANGUAGES, {
    errorMap: () => ({ message: "Please select a valid language." }),
  }),
  title: z
    .string()
    .max(MAX_TITLE_LENGTH, "Title is too long.")
    .optional()
    .nullable()
    .transform((v) => {
      if (!v) return null;
      const trimmed = v.trim();
      return trimmed.length === 0 ? null : trimmed;
    }),
});

export const redeemShareSchema = z.object({
  otp: z
    .string()
    .min(1, "Please enter the OTP you received.")
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 6, {
      message: "That OTP doesn't look right. Please check the code and try again.",
    }),
});

export type CreateShareInput = z.infer<typeof createShareSchema>;
export type RedeemShareInput = z.infer<typeof redeemShareSchema>;
