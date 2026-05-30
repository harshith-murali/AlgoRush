"use client";

import { cn } from "@/lib/utils";
import type { ProblemRunResponse, PublicSampleTestCase } from "@/types/problem";
import { CheckCircle2, CircleAlert, Play, SquareTerminal } from "lucide-react";

type BottomTab = "testcase" | "result";

interface ProblemTestcasePanelProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  testCases: PublicSampleTestCase[];
  selectedTestCaseId: number | null;
  onSelectTestCase: (id: number) => void;
  result: ProblemRunResponse | null;
  isBusy: boolean;
  isSubmit?: boolean;
}

export function ProblemTestcasePanel({
  activeTab,
  onTabChange,
  testCases,
  selectedTestCaseId,
  onSelectTestCase,
  result,
  isBusy,
  isSubmit = false,
}: ProblemTestcasePanelProps) {
  const selected =
    testCases.find((testCase) => testCase.id === selectedTestCaseId) ?? testCases[0];

  return (
    <section className="flex min-h-[18rem] flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:min-h-0 lg:flex-1">
      <div className="flex min-h-11 items-center gap-1 border-b border-zinc-200 px-2 dark:border-zinc-800">
        {[
          { value: "testcase" as const, label: "Testcase", icon: SquareTerminal },
          { value: "result" as const, label: "Result", icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-md px-3 font-mono text-[10px] font-bold uppercase transition-colors",
                active
                  ? "bg-amber-500 text-zinc-950"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === "testcase" && (
          <div className="space-y-4">
            {testCases.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {testCases.map((testCase, index) => (
                    <button
                      key={testCase.id}
                      type="button"
                      onClick={() => onSelectTestCase(testCase.id)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors",
                        selected?.id === testCase.id
                          ? "border-amber-500 bg-amber-500 text-zinc-950"
                          : "border-zinc-200 text-zinc-500 hover:border-amber-500/50 dark:border-zinc-800"
                      )}
                    >
                      Case {index + 1}
                    </button>
                  ))}
                </div>

                {selected && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                      <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Input
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200">
                        {selected.input}
                      </pre>
                    </div>
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                      <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Expected Output
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200">
                        {selected.expectedOutput}
                      </pre>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 text-center dark:border-zinc-800">
                <CircleAlert className="h-7 w-7 text-zinc-400" />
                <p className="mt-3 font-mono text-[10px] font-bold uppercase text-zinc-500">
                  No public samples available
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "result" && (
          <div className="space-y-3">
            {isBusy && (
              <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/20">
                <Play className="h-7 w-7 animate-pulse text-amber-500" />
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {isSubmit ? "Judging all test cases…" : "Preparing execution…"}
                </p>
              </div>
            )}

            {!isBusy && !result && (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 text-center dark:border-zinc-800">
                <SquareTerminal className="h-7 w-7 text-zinc-400" />
                <p className="mt-3 font-mono text-[10px] font-bold uppercase text-zinc-500">
                  Run code to see sample results
                </p>
              </div>
            )}

            {!isBusy && result && (() => {
              const passed = result.results.filter((r) => r.status === "ACCEPTED").length;
              const total = result.results.length;
              const allPassed = total > 0 && passed === total;
              const hasResults = total > 0;
              const bannerClass = result.status === "UNAVAILABLE"
                ? "border-zinc-400/30 bg-zinc-500/10"
                : allPassed
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-red-500/30 bg-red-500/10";
              const textClass = result.status === "UNAVAILABLE"
                ? "text-zinc-600 dark:text-zinc-400"
                : allPassed
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-red-700 dark:text-red-400";

              return (
              <>
                <div className={cn("rounded-lg border p-4", bannerClass)}>
                  <div className="flex items-center justify-between gap-3">
                    <p className={cn("font-mono text-[10px] font-bold uppercase tracking-widest", textClass)}>
                      {result.status === "UNAVAILABLE" ? "Unavailable" : allPassed ? "Accepted ✓" : "Failed ✗"}
                    </p>
                    {hasResults && (
                      <span className={cn("rounded px-2 py-0.5 font-mono text-[10px] font-bold", textClass)}>
                        {passed}/{total} passed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {result.message}
                  </p>
                </div>
                {result.results.map((item) => (
                  <div
                    key={item.testCaseId}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-900/10"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-3">
                      <p className="font-mono text-[10px] font-bold uppercase text-zinc-500">
                        {item.label}
                      </p>
                      <span className={cn(
                        "rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase border",
                        item.status === "ACCEPTED"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                      )}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mb-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                      Status: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{item.message}</span>
                    </p>

                    <div className="grid gap-3 md:grid-cols-3 mt-2 text-[11px]">
                      <div className="rounded border border-zinc-200 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <p className="mb-1 font-mono text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                          Input
                        </p>
                        <pre className="whitespace-pre-wrap font-mono text-zinc-800 dark:text-zinc-200 break-all max-h-32 overflow-y-auto leading-relaxed">
                          {item.input}
                        </pre>
                      </div>
                      <div className="rounded border border-zinc-200 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <p className="mb-1 font-mono text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                          Expected Output
                        </p>
                        <pre className="whitespace-pre-wrap font-mono text-zinc-800 dark:text-zinc-200 break-all max-h-32 overflow-y-auto leading-relaxed">
                          {item.expectedOutput}
                        </pre>
                      </div>
                      <div className="rounded border border-zinc-200 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <p className="mb-1 font-mono text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                          Your Output
                        </p>
                        <pre className={cn(
                          "whitespace-pre-wrap font-mono break-all max-h-32 overflow-y-auto leading-relaxed",
                          item.status === "ACCEPTED"
                            ? "text-zinc-800 dark:text-zinc-200"
                            : "text-red-600 dark:text-red-400"
                        )}>
                          {item.actualOutput !== null ? item.actualOutput : "No Output / Error"}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
}
