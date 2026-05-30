"use client";

import Editor from "@monaco-editor/react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { Language } from "@/generated/prisma";

const MONACO_LANGUAGE: Record<Language, string> = {
  [Language.CPP]: "cpp",
  [Language.PYTHON]: "python",
  [Language.JAVA]: "java",
  [Language.JAVASCRIPT]: "javascript",
};

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const theme = useMonacoTheme();

  return (
    <div className="min-h-0 flex-1 overflow-hidden bg-white dark:bg-zinc-950">
      <Editor
        height="100%"
        language={MONACO_LANGUAGE[language] ?? "plaintext"}
        theme={theme}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={{
          automaticLayout: true,
          cursorBlinking: "smooth",
          fontFamily:
            "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontLigatures: true,
          fontSize: 13,
          lineHeight: 22,
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "line",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          tabSize: 2,
          wordWrap: "on",
        }}
        loading={
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
