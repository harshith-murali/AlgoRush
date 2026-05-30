"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Language } from "@prisma/client";
import {
  DIFFICULTY_STYLES,
  LANGUAGE_LABELS,
  parseProblemId,
} from "@/lib/problems/utils";
import type { ApiErrorResponse, ProblemDetailResponse, PublicProblemDetail } from "@/types/problem";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Code2,
  FileInput,
  FileOutput,
  Lightbulb,
  Loader2,
  Shield,
  Terminal,
} from "lucide-react";

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30">
        <Icon className="h-4 w-4 text-amber-500" />
        <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ProseBlock({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
      {content}
    </div>
  );
}

function CodeTabs({ snippets }: { snippets: PublicProblemDetail["codeSnippets"] }) {
  const [active, setActive] = useState(snippets[0]?.language ?? Language.PYTHON);
  const current = snippets.find((s) => s.language === active) ?? snippets[0];

  if (!current) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
        {snippets.map((s) => (
          <button
            key={s.language}
            type="button"
            onClick={() => setActive(s.language)}
            className={`font-mono text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-colors ${
              active === s.language
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-amber-500"
            }`}
          >
            {LANGUAGE_LABELS[s.language] ?? s.language}
          </button>
        ))}
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-900/60">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}

export function ProblemDetailPage() {
  const params = useParams();
  const [problem, setProblem] = useState<PublicProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const problemId = parseProblemId(params?.id as string | string[] | undefined);

  useEffect(() => {
    if (!problemId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const res = await fetch(`/api/problems/${problemId}`, { cache: "no-store" });
        const data = (await res.json()) as ProblemDetailResponse & ApiErrorResponse;

        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        if (!res.ok) throw new Error(data.error || "Failed to load problem");

        if (!cancelled) setProblem(data.problem);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load problem");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [problemId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
          Loading problem #{problemId ?? "..."}...
        </p>
      </div>
    );
  }

  if (!problemId || notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Terminal className="h-10 w-10 text-zinc-400" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Problem not found</h1>
          <p className="font-mono text-xs text-zinc-500 mt-2">
            Invalid or missing problem id in route.
          </p>
        </div>
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to problems
        </Link>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="font-mono text-sm text-red-600 dark:text-red-400">{error ?? "Unknown error"}</p>
        <Link href="/problems" className="font-mono text-[10px] text-amber-500 hover:underline">
          ← Back to problems
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <Link
        href="/problems"
        className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-zinc-500 hover:text-amber-500 transition-colors w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All problems
      </Link>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-zinc-400">
                #{String(problem.id).padStart(3, "0")}
              </span>
              <span
                className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[problem.difficulty]}`}
              >
                {problem.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {problem.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[8px] font-bold uppercase px-2 py-0.5 rounded border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[10px] text-zinc-500">
            <div>
              <span className="block text-zinc-400 uppercase tracking-wider">Acceptance</span>
              <span className="text-lg font-black text-zinc-800 dark:text-zinc-200">
                {problem.acceptanceRate !== null ? `${problem.acceptanceRate}%` : "—"}
              </span>
            </div>
            <div>
              <span className="block text-zinc-400 uppercase tracking-wider">Submissions</span>
              <span className="text-lg font-black text-zinc-800 dark:text-zinc-200">
                {problem.totalSubmissions.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block text-zinc-400 uppercase tracking-wider">Likes</span>
              <span className="text-lg font-black text-zinc-800 dark:text-zinc-200">
                {problem.likes}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
        <div className="flex flex-col gap-6">
          <Section title="Problem Statement" icon={BookOpen}>
            <ProseBlock content={problem.description} />
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Input Format" icon={FileInput}>
              <ProseBlock content={problem.input} />
            </Section>
            <Section title="Output Format" icon={FileOutput}>
              <ProseBlock content={problem.output} />
            </Section>
          </div>

          <Section title="Constraints" icon={Shield}>
            <ProseBlock content={problem.constraints} />
          </Section>

          <Section title="Explanation" icon={Lightbulb}>
            <ProseBlock content={problem.explanation} />
          </Section>

          {problem.sampleTestCases.length > 0 && (
            <Section title="Sample Test Cases" icon={Terminal}>
              <div className="flex flex-col gap-4">
                {problem.sampleTestCases.map((tc, i) => (
                  <div
                    key={tc.id}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 font-mono text-[10px] font-bold uppercase text-zinc-500">
                      Example {i + 1}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
                      <div className="p-4">
                        <p className="font-mono text-[9px] uppercase text-zinc-400 mb-2">Input</p>
                        <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{tc.input}</pre>
                      </div>
                      <div className="p-4">
                        <p className="font-mono text-[9px] uppercase text-zinc-400 mb-2">Output</p>
                        <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{tc.expectedOutput}</pre>
                      </div>
                    </div>
                    {tc.explanation && (
                      <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                        <p className="font-mono text-[9px] uppercase text-zinc-400 mb-1">Explanation</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{tc.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          {problem.codeSnippets.length > 0 && (
            <Section title="Starter Code" icon={Code2}>
              <CodeTabs snippets={problem.codeSnippets} />
            </Section>
          )}

          {problem.hints && (
            <Section title="Hint" icon={Lightbulb}>
              <ProseBlock content={problem.hints} />
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}
