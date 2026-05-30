"use client";

import Link from "next/link";
import { useState } from "react";
import type React from "react";
import { DIFFICULTY_STYLES } from "@/lib/problems/utils";
import type { PublicProblemDetail } from "@/types/problem";
import { ProblemTabs, type ProblemInfoTab } from "@/components/problems/problem-tabs";
import { ArrowLeft, Braces, FileCode2, Trophy } from "lucide-react";

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

interface ProblemDescriptionPanelProps {
  problem: PublicProblemDetail;
}

export function ProblemDescriptionPanel({ problem }: ProblemDescriptionPanelProps) {
  const [activeTab, setActiveTab] = useState<ProblemInfoTab>("description");

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:h-[calc(100vh-7rem)]">
      <header className="flex min-h-14 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
        <Link
          href="/problems"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-amber-600 dark:hover:bg-zinc-900 dark:hover:text-amber-400"
          aria-label="Back to problems"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            Problem #{String(problem.id).padStart(3, "0")}
          </p>
          <h1 className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {problem.title}
          </h1>
        </div>
      </header>

      <ProblemTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
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

        {activeTab === "editorial" &&
          (problem.editorial ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                Editorial
              </h2>
              <TextBlock value={problem.editorial} />
            </div>
          ) : (
            <EmptyState
              icon={FileCode2}
              title="Editorial not published"
              body="This problem does not have an editorial yet. The workspace is ready when one is added from admin."
            />
          ))}

        {activeTab === "solutions" && (
          <EmptyState
            icon={Braces}
            title="Solutions viewer coming soon"
            body="Reference solutions are kept server-side for judging. A reviewed solutions explorer can plug into this panel later."
          />
        )}

        {activeTab === "submissions" && (
          <EmptyState
            icon={Trophy}
            title="No submissions in this view"
            body="Your accepted attempts and runtime history will appear here once submission history is connected."
          />
        )}
      </div>
    </section>
  );
}
