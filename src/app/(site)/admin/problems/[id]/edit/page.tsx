import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EditProblemForm } from "@/components/admin/edit-problem-form";
import { Language } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = await prisma.program.findUnique({
    where: { id: Number(id) },
    select: { title: true },
  });
  return {
    title: problem ? `Edit: ${problem.title} — Algo-Rush` : "Edit Problem — Algo-Rush",
  };
}

export default async function EditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) notFound();

  const problem = await prisma.program.findUnique({
    where: { id: numId },
    include: {
      testCases: { orderBy: { order: "asc" } },
      codeSnippets: true,
      solutions: true,
    },
  });

  if (!problem) notFound();

  // Serialize to plain objects (Dates → strings cause issues with client components)
  const serialized = {
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    tags: problem.tags,
    description: problem.description,
    input: problem.input,
    output: problem.output,
    explanation: problem.explanation,
    constraints: problem.constraints,
    hints: problem.hints,
    editorial: problem.editorial,
    testCases: problem.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isSample: tc.isSample,
      isHidden: tc.isHidden,
      explanation: tc.explanation,
      order: tc.order,
    })),
    codeSnippets: problem.codeSnippets.map((cs) => ({
      language: cs.language as Language,
      code: cs.code,
    })),
    solutions: problem.solutions.map((s) => ({
      language: s.language as Language,
      code: s.code,
    })),
  };

  return (
    <div className="w-full">
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <h2 className="text-base font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="text-amber-500">&gt;</span> EDIT_PROBLEM_SEQUENCE
          <span className="text-zinc-500 text-xs font-normal ml-1">
            #{String(problem.id).padStart(3, "0")} · {problem.title}
          </span>
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-tight ml-5">
          Modify starter templates, test cases, and reference solutions. Changes are saved directly without sandbox re-validation.
        </p>
      </div>
      <EditProblemForm problem={serialized} />
    </div>
  );
}
