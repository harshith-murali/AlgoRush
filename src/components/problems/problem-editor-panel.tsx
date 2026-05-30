"use client";

import { useMemo, useState } from "react";
import { Language } from "@/generated/prisma";
import { LANGUAGE_LABELS } from "@/lib/problems/utils";
import type { ProblemRunResponse, PublicProblemDetail } from "@/types/problem";
import { CodeEditor } from "@/components/problems/code-editor";
import { ProblemTestcasePanel } from "@/components/problems/problem-testcase-panel";
import { RotateCcw, Send, Play } from "lucide-react";

type ResultTab = "testcase" | "result";

interface ProblemEditorPanelProps {
  problem: PublicProblemDetail;
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

export function ProblemEditorPanel({ problem }: ProblemEditorPanelProps) {
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
    <section className="flex min-h-[52rem] flex-col gap-3 lg:h-[calc(100vh-7rem)] lg:min-h-0">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="workspace-language">
            Language
          </label>
          <select
            id="workspace-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="h-9 rounded-md border border-zinc-200 bg-zinc-50 px-3 font-mono text-xs font-bold text-zinc-700 outline-none transition-colors focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {(availableLanguages.length > 0 ? availableLanguages : [Language.PYTHON]).map(
              (item) => (
                <option key={item} value={item}>
                  {LANGUAGE_LABELS[item] ?? item}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetCode}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 font-mono text-[10px] font-bold uppercase text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => execute("run")}
            disabled={busyAction !== null}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 font-mono text-[10px] font-bold uppercase text-zinc-600 transition-colors hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-amber-300"
          >
            <Play className="h-3.5 w-3.5" />
            {busyAction === "run" ? "Running" : "Run"}
          </button>
          <button
            type="button"
            onClick={() => execute("submit")}
            disabled={busyAction !== null}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-amber-500 px-3 font-mono text-[10px] font-black uppercase text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" />
            {busyAction === "submit" ? "Submitting" : "Submit"}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-[1.4] overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <CodeEditor language={language} value={code} onChange={updateCode} />
      </div>

      <ProblemTestcasePanel
        activeTab={resultTab}
        onTabChange={setResultTab}
        testCases={problem.sampleTestCases}
        selectedTestCaseId={selectedTestCaseId}
        onSelectTestCase={setSelectedTestCaseId}
        result={result}
        isBusy={busyAction !== null}
      />
    </section>
  );
}
