"use client";

import { useCallback, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { AlignLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/validation";

const MONACO_LANGUAGE: Record<Language, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  rust: "rust",
  php: "php",
  html: "html",
  css: "css",
  json: "json",
  sql: "sql",
  bash: "shell",
  other: "plaintext",
};

type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

function toMonacoLanguage(language?: string): string {
  if (!language) return "plaintext";
  return MONACO_LANGUAGE[language as Language] ?? "plaintext";
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  placeholder = "Paste or write your code here",
  className,
  id,
  "aria-label": ariaLabel,
}: CodeEditorProps) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoLang = toMonacoLanguage(language);
  const showPlaceholder = !value && !readOnly;

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Enable JS/TS syntax diagnostics (squiggles)
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        allowJs: true,
      });
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
      });

      // Format document: Shift+Alt+F (also Cmd+Shift+I on some layouts)
      editor.addAction({
        id: "codeshare.format",
        label: "Format Document",
        keybindings: [
          monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
        ],
        run: (ed) => {
          void ed.getAction("editor.action.formatDocument")?.run();
        },
      });

      if (!readOnly) {
        editor.focus();
      }
    },
    [readOnly]
  );

  function handleFormat() {
    const editor = editorRef.current;
    if (!editor) return;
    void editor.getAction("editor.action.formatDocument")?.run();
  }

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel ?? "Code editor"}
      className={cn(
        "overflow-hidden rounded-lg border border-stone-300 bg-[#fafafa]",
        className
      )}
    >
      {!readOnly && (
        <div className="flex items-center justify-between gap-2 border-b border-stone-200 bg-stone-100/80 px-2 py-1.5">
          <span className="px-1 text-xs text-stone-500">
            Line numbers · syntax highlighting · Shift+Alt+F to format
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-stone-600"
            onClick={handleFormat}
          >
            <AlignLeft className="h-3.5 w-3.5" aria-hidden />
            Format
          </Button>
        </div>
      )}

      <div className="relative min-h-[280px]">
        {showPlaceholder && (
          <div
            className="pointer-events-none absolute left-[68px] top-3 z-10 font-mono text-sm text-stone-400"
            aria-hidden
          >
            {placeholder}
          </div>
        )}
        <Editor
          height="280px"
          language={monacoLang}
          value={value}
          theme="vs-light"
          onChange={(next) => onChange?.(next ?? "")}
          onMount={handleMount}
          loading={
            <div className="flex h-[280px] items-center justify-center gap-2 text-sm text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading editor…
            </div>
          }
          options={{
            readOnly,
            minimap: { enabled: false },
            lineNumbers: "on",
            fontSize: 14,
            fontFamily:
              "var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: readOnly ? "none" : "line",
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            folding: true,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: "languageDefined",
            autoClosingQuotes: "languageDefined",
            matchBrackets: "always",
            quickSuggestions: !readOnly,
            suggestOnTriggerCharacters: !readOnly,
            ariaLabel: ariaLabel ?? "Code",
            domReadOnly: readOnly,
          }}
        />
      </div>
    </div>
  );
}
