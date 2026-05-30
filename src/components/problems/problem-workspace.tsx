"use client";

import { useEffect, useState } from "react";
import type React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { parseProblemId } from "@/lib/problems/utils";
import type { ApiErrorResponse, ProblemDetailResponse, PublicProblemDetail } from "@/types/problem";
import { ProblemDescriptionPanel } from "@/components/problems/problem-description-panel";
import { ProblemEditorPanel } from "@/components/problems/problem-editor-panel";
import { AlertCircle, ArrowLeft, Loader2, Terminal } from "lucide-react";

function WorkspaceState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Icon className={title === "Loading workspace" ? "h-10 w-10 animate-spin text-amber-500" : "h-10 w-10 text-zinc-400"} />
      <div>
        <h1 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{title}</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">{body}</p>
      </div>
      {action}
    </div>
  );
}

export function ProblemWorkspace() {
  const params = useParams<{ id: string }>();
  const problemId = parseProblemId(params?.id);
  const [problem, setProblem] = useState<PublicProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;

    let cancelled = false;

    async function loadProblem() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await fetch(`/api/problems/${problemId}`, { cache: "no-store" });
        const payload = (await response.json()) as ProblemDetailResponse & ApiErrorResponse;

        if (response.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load problem");
        }

        if (!cancelled) setProblem(payload.problem);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load problem");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProblem();
    return () => {
      cancelled = true;
    };
  }, [problemId]);

  if (!problemId || notFound) {
    return (
      <WorkspaceState
        icon={Terminal}
        title="Problem not found"
        body="This problem id is invalid or no longer exists."
        action={
          <Link
            href="/problems"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-amber-500 px-4 font-mono text-[10px] font-black uppercase text-zinc-950 transition-colors hover:bg-amber-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to problems
          </Link>
        }
      />
    );
  }

  if (loading) {
    return (
      <WorkspaceState
        icon={Loader2}
        title="Loading workspace"
        body={`Preparing problem #${problemId} and starter code.`}
      />
    );
  }

  if (error || !problem) {
    return (
      <WorkspaceState
        icon={AlertCircle}
        title="Workspace failed to load"
        body={error ?? "An unexpected problem prevented the workspace from loading."}
        action={
          <Link
            href="/problems"
            className="font-mono text-[10px] font-bold uppercase text-amber-600 hover:underline dark:text-amber-400"
          >
            Back to problems
          </Link>
        }
      />
    );
  }

  return (
    <main className="relative left-1/2 -my-6 w-screen -translate-x-1/2 bg-zinc-100 p-3 dark:bg-zinc-950/60 lg:-my-8">
      <div className="grid gap-3 lg:grid-cols-[minmax(22rem,0.88fr)_minmax(34rem,1.45fr)]">
        <ProblemDescriptionPanel problem={problem} />
        <ProblemEditorPanel key={problem.id} problem={problem} />
      </div>
    </main>
  );
}
