"use client";

import Editor from "@monaco-editor/react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { Language } from "@prisma/client";
import { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import type * as MonacoNS from "monaco-editor";

const MONACO_LANGUAGE: Record<Language, string> = {
  [Language.CPP]: "cpp",
  [Language.PYTHON]: "python",
  [Language.JAVA]: "java",
  [Language.JAVASCRIPT]: "javascript",
};

export interface CodeEditorHandle {
  formatCode: () => void;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
}

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  settings?: EditorSettings;
}

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor({ language, value, onChange, settings }, ref) {
    const theme = useMonacoTheme();
    const editorRef = useRef<MonacoNS.editor.IStandaloneCodeEditor | null>(null);

    useImperativeHandle(ref, () => ({
      formatCode() {
        editorRef.current?.getAction("editor.action.formatDocument")?.run();
      },
    }));

    // Update editor options live when settings change
    useEffect(() => {
      if (!editorRef.current || !settings) return;
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
        wordWrap: settings.wordWrap ? "on" : "off",
        minimap: { enabled: settings.minimap },
        lineNumbers: settings.lineNumbers ? "on" : "off",
      });
    }, [settings]);

    return (
      <div className="min-h-0 flex-1 overflow-hidden bg-white dark:bg-zinc-950">
        <Editor
          height="100%"
          language={MONACO_LANGUAGE[language] ?? "plaintext"}
          theme={theme}
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            automaticLayout: true,
            cursorBlinking: "smooth",
            fontFamily:
              "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontLigatures: true,
            fontSize: settings?.fontSize ?? 13,
            lineHeight: 22,
            minimap: { enabled: settings?.minimap ?? false },
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "line",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            tabSize: settings?.tabSize ?? 2,
            wordWrap: settings?.wordWrap ? "on" : "off",
            lineNumbers: settings?.lineNumbers !== false ? "on" : "off",
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
);
