"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { ConfettiBlast } from "@/components/ui/confetti-blast";
import { Language } from "@prisma/client";
import { LANGUAGE_LABELS } from "@/lib/problems/utils";
import type { ProblemRunResponse, PublicProblemDetail } from "@/types/problem";
import { CodeEditor, type CodeEditorHandle, type EditorSettings } from "@/components/problems/code-editor";
import { ProblemTestcasePanel } from "@/components/problems/problem-testcase-panel";
import {
  RotateCcw,
  Send,
  Play,
  Settings2,
  Wand2,
  ChevronDown,
  Type,
  AlignLeft,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ResultTab = "testcase" | "result";

interface ProblemEditorPanelProps {
  problem: PublicProblemDetail;
  onSolved?: () => void;
}

function fallbackSnippet(language: Language) {
  switch (language) {
    case Language.CPP:
      return "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  return 0;\n}\n";
    case Language.JAVA:
      return "class Main {\n  public static void main(String[] args) {\n  }\n}\n";
    case Language.JAVASCRIPT:
      return "function solve(input) {\n  return input.trim();\n}\n";
    case Language.PYTHON:
    default:
      return "def solve():\n    pass\n";
  }
}

const FONT_SIZES = [11, 12, 13, 14, 15, 16, 18, 20];
const TAB_SIZES = [2, 4, 8];

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 13,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  lineNumbers: true,
};

export function ProblemEditorPanel({ problem, onSolved }: ProblemEditorPanelProps) {
  const editorRef = useRef<CodeEditorHandle>(null);

  const availableLanguages = useMemo(
    () => problem.codeSnippets.map((snippet) => snippet.language),
    [problem.codeSnippets]
  );
  const initialLanguage = availableLanguages[0] ?? Language.PYTHON;
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>(() =>
    Object.fromEntries(problem.codeSnippets.map((snippet) => [snippet.language, snippet.code]))
  );
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<number | null>(
    problem.sampleTestCases[0]?.id ?? null
  );
  const [resultTab, setResultTab] = useState<ResultTab>("testcase");
  const [result, setResult] = useState<ProblemRunResponse | null>(null);
  const [busyAction, setBusyAction] = useState<"run" | "submit" | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Editor settings state
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const code = codeByLanguage[language] ?? fallbackSnippet(language);

  function updateCode(nextCode: string) {
    setCodeByLanguage((current) => ({ ...current, [language]: nextCode }));
  }

  function resetCode() {
    const starter =
      problem.codeSnippets.find((snippet) => snippet.language === language)?.code ??
      fallbackSnippet(language);
    setCodeByLanguage((current) => ({ ...current, [language]: starter }));
  }

  function formatCode() {
    editorRef.current?.formatCode();
  }

  function updateSetting<K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function execute(kind: "run" | "submit") {
    setBusyAction(kind);
    setResultTab("result");
    setResult(null);

    try {
      const endpoint = `/api/problems/${problem.id}/${kind}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          testCaseId: kind === "run" ? selectedTestCaseId : undefined,
        }),
      });
      const payload = (await response.json()) as ProblemRunResponse & { error?: string };

      if (!response.ok && !payload.results) {
        throw new Error(payload.error ?? `Failed to ${kind} code`);
      }

      setResult(payload);
      if (kind === "submit") {
        window.dispatchEvent(new Event("submission-complete"));
        // If all passed, fire solved callback
        const allPassed = payload.results?.length > 0 && payload.results.every((r) => r.status === "ACCEPTED");
        if (allPassed) {
          setShowConfetti(true);
          onSolved?.();
        }
      }
    } catch (error) {
      setResult({
        status: "UNAVAILABLE",
        message:
          error instanceof Error
            ? error.message
            : "Execution service is not available for this workspace yet.",
        results: [],
      });
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="relative flex min-h-[52rem] flex-col gap-3 lg:h-[calc(100vh-7rem)] lg:min-h-0">
      <ConfettiBlast active={showConfetti} onComplete={() => setShowConfetti(false)} />
      {/* ── Toolbar ── */}
      <div className="relative flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="workspace-language">
            Language
          </label>
          <div className="relative">
            <select
              id="workspace-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="h-9 appearance-none rounded-md border border-zinc-200 bg-zinc-50 pl-3 pr-8 font-mono text-xs font-bold text-zinc-700 outline-none transition-colors focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {(availableLanguages.length > 0 ? availableLanguages : [Language.PYTHON]).map(
                (item) => (
                  <option key={item} value={item}>
                    {LANGUAGE_LABELS[item] ?? item}
                  </option>
                )
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5">
          {/* Format */}
          <button
            type="button"
            onClick={formatCode}
            title="Format code"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 font-mono text-[10px] font-bold uppercase text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Settings toggle */}
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            title="Editor settings"
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-md border px-3 font-mono text-[10px] font-bold uppercase transition-colors",
              showSettings
                ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={resetCode}
            title="Reset to starter code"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 font-mono text-[10px] font-bold uppercase text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Run */}
          <button
            type="button"
            onClick={() => execute("run")}
            disabled={busyAction !== null}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 font-mono text-[10px] font-bold uppercase text-zinc-600 transition-colors hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-amber-300"
          >
            <Play className="h-3.5 w-3.5" />
            {busyAction === "run" ? "Running…" : "Run"}
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={() => execute("submit")}
            disabled={busyAction !== null}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-amber-500 px-3 font-mono text-[10px] font-black uppercase text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" />
            {busyAction === "submit" ? "Submitting…" : "Submit"}
          </button>
        </div>

        {/* Settings dropdown */}
        {showSettings && (
          <div className="absolute right-3 top-full z-20 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Editor Settings
              </span>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Font size */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Type className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Font Size
                  </span>
                </div>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting("fontSize", Number(e.target.value))}
                  className="h-7 rounded border border-zinc-200 bg-zinc-50 px-2 font-mono text-[11px] font-bold text-zinc-700 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {FONT_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}px
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab size */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Tab Size
                  </span>
                </div>
                <div className="flex gap-1">
                  {TAB_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateSetting("tabSize", s)}
                      className={cn(
                        "h-7 w-8 rounded border font-mono text-[11px] font-bold transition-colors",
                        settings.tabSize === s
                          ? "border-amber-500 bg-amber-500 text-zinc-950"
                          : "border-zinc-200 text-zinc-500 hover:border-amber-400 dark:border-zinc-700"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle: Word Wrap */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Word Wrap
                </span>
                <button
                  type="button"
                  onClick={() => updateSetting("wordWrap", !settings.wordWrap)}
                  className="text-zinc-400 transition-colors hover:text-amber-500"
                >
                  {settings.wordWrap ? (
                    <ToggleRight className="h-5 w-5 text-amber-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Toggle: Minimap */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Minimap
                </span>
                <button
                  type="button"
                  onClick={() => updateSetting("minimap", !settings.minimap)}
                  className="text-zinc-400 transition-colors hover:text-amber-500"
                >
                  {settings.minimap ? (
                    <ToggleRight className="h-5 w-5 text-amber-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Toggle: Line Numbers */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Line Numbers
                </span>
                <button
                  type="button"
                  onClick={() => updateSetting("lineNumbers", !settings.lineNumbers)}
                  className="text-zinc-400 transition-colors hover:text-amber-500"
                >
                  {settings.lineNumbers ? (
                    <ToggleRight className="h-5 w-5 text-amber-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Monaco Editor ── */}
      <div className="flex min-h-0 flex-[1.4] overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <CodeEditor
          ref={editorRef}
          language={language}
          value={code}
          onChange={updateCode}
          settings={settings}
        />
      </div>

      {/* ── Testcase / Result panel ── */}
      <ProblemTestcasePanel
        activeTab={resultTab}
        onTabChange={setResultTab}
        testCases={problem.sampleTestCases}
        selectedTestCaseId={selectedTestCaseId}
        onSelectTestCase={setSelectedTestCaseId}
        result={result}
        isBusy={busyAction !== null}
        isSubmit={busyAction === "submit"}
      />
    </section>
  );
}
