"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type React from "react";
import { DIFFICULTY_STYLES, LANGUAGE_LABELS } from "@/lib/problems/utils";
import type { PublicProblemDetail } from "@/types/problem";
import { ProblemTabs, type ProblemInfoTab } from "@/components/problems/problem-tabs";
import {
  ArrowLeft,
  Braces,
  FileCode2,
  Trophy,
  Loader2,
  Code,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

function TextBlock({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
      {value}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {title}
      </h3>
      {children}
    </section>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
      <Icon className="h-9 w-9 text-zinc-400" />
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">{body}</p>
    </div>
  );
}

/** Copy-to-clipboard button used in the Solutions tab */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[9px] font-bold uppercase text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

interface SolutionEntry {
  id: number;
  language: string;
  code: string;
  explanation: string | null;
}

interface ProblemDescriptionPanelProps {
  problem: PublicProblemDetail;
  isSolved?: boolean;
  onSolvedChange?: () => void;
}

export function ProblemDescriptionPanel({
  problem,
  isSolved = false,
  onSolvedChange,
}: ProblemDescriptionPanelProps) {
  const [activeTab, setActiveTab] = useState<ProblemInfoTab>("description");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [expandedSubmissions, setExpandedSubmissions] = useState<Record<number, boolean>>({});

  // Solutions state
  const [solutions, setSolutions] = useState<SolutionEntry[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  const [activeSolutionLanguage, setActiveSolutionLanguage] = useState<string | null>(null);

  const toggleSubmission = (id: number) => {
    setExpandedSubmissions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const response = await fetch(`/api/problems/${problem.id}/submissions`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const fetchSolutions = async () => {
    setLoadingSolutions(true);
    try {
      const response = await fetch(`/api/problems/${problem.id}/solutions`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const list: SolutionEntry[] = data.solutions || [];
        setSolutions(list);
        if (list.length > 0 && !activeSolutionLanguage) {
          setActiveSolutionLanguage(list[0].language);
        }
      }
    } catch (error) {
      console.error("Failed to fetch solutions:", error);
    } finally {
      setLoadingSolutions(false);
    }
  };

  useEffect(() => {
    if (activeTab === "submissions") {
      fetchSubmissions();
    }
    if (activeTab === "solutions") {
      fetchSolutions();
    }
  }, [activeTab, problem.id]);

  useEffect(() => {
    const handleSubmissionComplete = () => {
      fetchSubmissions();
      if (onSolvedChange) onSolvedChange();
    };
    window.addEventListener("submission-complete", handleSubmissionComplete);
    return () => {
      window.removeEventListener("submission-complete", handleSubmissionComplete);
    };
  }, [problem.id]);

  const activeSolution = solutions.find((s) => s.language === activeSolutionLanguage);

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:h-[calc(100vh-7rem)]">
      <header className="flex min-h-14 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
        <Link
          href="/problems"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-amber-600 dark:hover:bg-zinc-900 dark:hover:text-amber-400"
          aria-label="Back to problems"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            Problem #{String(problem.id).padStart(3, "0")}
          </p>
          <h1 className="flex items-center gap-2 truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
            <span className="truncate">{problem.title}</span>
            {/* Solved indicator — sharp checkmark badge */}
            {isSolved && (
              <span
                title="You solved this problem!"
                className="inline-flex shrink-0 items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400"
              >
                <CheckCheck className="h-2.5 w-2.5" />
                Solved
              </span>
            )}
          </h1>
        </div>
      </header>

      <ProblemTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {/* ── Description tab ── */}
        {activeTab === "description" && (
          <div className="space-y-8">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${DIFFICULTY_STYLES[problem.difficulty]}`}
                >
                  {problem.difficulty}
                </span>
                {problem.acceptanceRate !== null && (
                  <span className="font-mono text-[10px] text-zinc-500">
                    {problem.acceptanceRate}% accepted
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {problem.title}
              </h2>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[9px] font-bold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Section title="Prompt">
              <TextBlock value={problem.description} />
            </Section>

            <div className="grid gap-5 sm:grid-cols-2">
              <Section title="Input Format">
                <TextBlock value={problem.input} />
              </Section>
              <Section title="Output Format">
                <TextBlock value={problem.output} />
              </Section>
            </div>

            {problem.sampleTestCases.length > 0 && (
              <Section title="Public Test Cases">
                <div className="space-y-4">
                  {problem.sampleTestCases.map((testCase, index) => (
                    <div
                      key={testCase.id}
                      className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 font-mono text-[10px] font-bold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                        Example {index + 1}
                      </div>
                      <div className="grid divide-y divide-zinc-200 dark:divide-zinc-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                        <div className="p-4">
                          <p className="mb-2 font-mono text-[9px] font-bold uppercase text-zinc-400">
                            Input
                          </p>
                          <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200">
                            {testCase.input}
                          </pre>
                        </div>
                        <div className="p-4">
                          <p className="mb-2 font-mono text-[9px] font-bold uppercase text-zinc-400">
                            Expected Output
                          </p>
                          <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                      {testCase.explanation && (
                        <div className="border-t border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
                          <p className="mb-2 font-mono text-[9px] font-bold uppercase text-zinc-400">
                            Explanation
                          </p>
                          <TextBlock value={testCase.explanation} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Explanation">
              <TextBlock value={problem.explanation} />
            </Section>

            <Section title="Constraints">
              <TextBlock value={problem.constraints} />
            </Section>
          </div>
        )}

        {/* ── Editorial tab ── */}
        {activeTab === "editorial" &&
          (problem.editorial ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Editorial</h2>
              <TextBlock value={problem.editorial} />
            </div>
          ) : (
            <EmptyState
              icon={FileCode2}
              title="Editorial not published"
              body="This problem does not have an editorial yet. The workspace is ready when one is added from admin."
            />
          ))}

        {/* ── Solutions tab ── */}
        {activeTab === "solutions" && (
          <div className="space-y-4">
            {loadingSolutions ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  Loading solutions…
                </p>
              </div>
            ) : solutions.length === 0 ? (
              <EmptyState
                icon={Braces}
                title="No solutions yet"
                body="Reference solutions haven't been added for this problem yet. Check back after attempting it!"
              />
            ) : (
              <>
                {/* Language tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {solutions.map((sol) => (
                    <button
                      key={sol.language}
                      type="button"
                      onClick={() => setActiveSolutionLanguage(sol.language)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors",
                        activeSolutionLanguage === sol.language
                          ? "border-amber-500 bg-amber-500 text-zinc-950"
                          : "border-zinc-200 text-zinc-500 hover:border-amber-500/50 dark:border-zinc-800"
                      )}
                    >
                      {LANGUAGE_LABELS[sol.language] ?? sol.language}
                    </button>
                  ))}
                </div>

                {/* Active solution */}
                {activeSolution && (
                  <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <div className="flex items-center gap-2">
                        <Code className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">
                          {LANGUAGE_LABELS[activeSolution.language] ?? activeSolution.language} — Reference Solution
                        </span>
                      </div>
                      <CopyButton text={activeSolution.code} />
                    </div>
                    <pre className="max-h-[32rem] overflow-auto p-4 font-mono text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {activeSolution.code}
                    </pre>
                    {activeSolution.explanation && (
                      <div className="border-t border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
                        <p className="mb-2 font-mono text-[9px] font-bold uppercase text-zinc-400">
                          Explanation
                        </p>
                        <TextBlock value={activeSolution.explanation} />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Submissions tab ── */}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                Submission History
              </h2>
              {submissions.length > 0 && (
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {submissions.length} attempts
                </span>
              )}
            </div>

            {loadingSubmissions ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  Loading attempts…
                </p>
              </div>
            ) : submissions.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No submissions yet"
                body="You haven't submitted any solutions for this problem yet. Write some code and hit Submit!"
              />
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  const isPass = sub.status === "PASS";
                  const dateStr = new Date(sub.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isExpanded = expandedSubmissions[sub.id];

                  const statusLabel =
                    sub.status === "PASS"
                      ? "Accepted"
                      : sub.status === "FAIL"
                      ? "Wrong Answer"
                      : sub.status === "COMPILE_ERROR"
                      ? "Compile Error"
                      : sub.status === "TIME_LIMIT_EXCEEDED"
                      ? "Time Limit Exceeded"
                      : sub.status === "RUNTIME_ERROR"
                      ? "Runtime Error"
                      : sub.status;

                  const statusClass = isPass
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : sub.status === "COMPILE_ERROR"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400";

                  return (
                    <div
                      key={sub.id}
                      className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50/20 dark:border-zinc-800 dark:bg-zinc-950/20"
                    >
                      <div
                        onClick={() => toggleSubmission(sub.id)}
                        className="flex cursor-pointer flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase ${statusClass}`}
                          >
                            {statusLabel}
                          </span>
                          <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            {LANGUAGE_LABELS[sub.language] || sub.language}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-zinc-400 dark:text-zinc-500">
                          {sub.runtimeMs !== null && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {sub.runtimeMs} ms
                            </span>
                          )}
                          <span className="font-mono">
                            {sub.passedTestCases}/{sub.totalTestCases} cases
                          </span>
                          <span className="hidden items-center gap-1 font-mono text-[10px] sm:inline-flex">
                            <Calendar className="h-3 w-3" />
                            {dateStr}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/10">
                          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Code className="h-3.5 w-3.5" />
                              Submitted Code
                            </span>
                            <div className="flex items-center gap-3">
                              <CopyButton text={sub.code} />
                              <span className="font-mono text-[9px] font-normal lowercase sm:hidden">
                                {dateStr}
                              </span>
                            </div>
                          </div>
                          <pre className="max-h-80 overflow-auto overflow-x-auto rounded border border-zinc-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                            {sub.code}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
