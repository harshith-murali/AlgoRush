"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Difficulty, Language } from "@/generated/prisma";

import {
  BasicInfoSection,
  ProblemStatementSection,
  TestCasesSection,
  CodeSnippetsSection,
  SolutionsSection,
  PublishSidebar,
} from "./problem-sections";

import {
  Terminal,
  CheckCircle2,
  Loader2,
  Circle,
  ArrowLeft,
  Save,
  Cpu,
} from "lucide-react";

// ─── Schema (same shape as create) ───────────────────────────────────────────
const editProblemFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  difficulty: z.nativeEnum(Difficulty),
  tags: z.array(z.string()).min(1, "At least one tag is required."),
  description: z.string().min(10, "Description must be descriptive."),
  input: z.string().min(5, "Input specification is required."),
  output: z.string().min(5, "Output specification is required."),
  explanation: z.string().min(5, "Explanation is required."),
  constraints: z.string().min(5, "Constraints are required."),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required."),
        expectedOutput: z.string().min(1, "Expected output is required."),
        isSample: z.boolean(),
        isHidden: z.boolean(),
        explanation: z.string().optional(),
        order: z.number().int(),
      })
    )
    .min(1, "At least one test case is required."),
  codeSnippets: z
    .array(
      z.object({
        language: z.nativeEnum(Language),
        code: z.string().min(5, "Code template is required."),
      })
    )
    .min(1, "At least one code snippet is required."),
  solutions: z
    .array(
      z.object({
        language: z.nativeEnum(Language),
        code: z.string().min(5, "Solution code is required."),
      })
    )
    .min(1, "At least one solution is required."),
});

export type EditProblemFormValues = z.infer<typeof editProblemFormSchema>;

// Re-export so problem-sections can use it (they import CreateProblemFormValues)
export type { EditProblemFormValues as CreateProblemFormValues };

// ─── Step types ───────────────────────────────────────────────────────────────
type StepStatus = "pending" | "active" | "done";
interface LoadingStep {
  id: string;
  label: string;
  status: StepStatus;
}

const INITIAL_STEPS: LoadingStep[] = [
  { id: "save", label: "Saving problem changes", status: "pending" },
  { id: "persist", label: "Updating database record", status: "pending" },
];

// ─── Loading overlay ──────────────────────────────────────────────────────────
function SavingLoadingScreen({ steps }: { steps: LoadingStep[] }) {
  const done = steps.filter((s) => s.status === "done").length;
  const progress = Math.round((done / steps.length) * 90);

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950/98 backdrop-blur-md flex items-center justify-center">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.05] blur-[100px] pointer-events-none" />
      <div className="relative flex flex-col items-center gap-7 max-w-xs w-full px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
          <div className="relative w-14 h-14 rounded-xl bg-zinc-900 border border-amber-500/30 shadow-[0_0_24px_rgba(245,158,11,0.18)] flex items-center justify-center">
            <Save className="h-7 w-7 text-amber-400 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-sm font-black uppercase tracking-[0.18em] text-white">
            Saving Changes
          </h2>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Updating problem record
          </p>
        </div>
        <div className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full flex flex-col gap-2.5">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                {step.status === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {step.status === "active" && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                {step.status === "pending" && <Circle className="w-4 h-4 text-zinc-700" />}
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                step.status === "done" ? "text-emerald-400" : step.status === "active" ? "text-amber-400" : "text-zinc-600"
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Problem data shape passed from server ────────────────────────────────────
export interface EditableProblem {
  id: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  input: string;
  output: string;
  explanation: string;
  constraints: string;
  hints: string | null;
  editorial: string | null;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isSample: boolean;
    isHidden: boolean;
    explanation: string | null;
    order: number;
  }>;
  codeSnippets: Array<{ language: Language; code: string }>;
  solutions: Array<{ language: Language; code: string }>;
}

// ─── Edit form component ──────────────────────────────────────────────────────
export function EditProblemForm({ problem }: { problem: EditableProblem }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(INITIAL_STEPS);
  const [validationErrors, setValidationErrors] = useState<any>(null);

  const defaultValues: EditProblemFormValues = {
    title: problem.title,
    difficulty: problem.difficulty,
    tags: problem.tags,
    description: problem.description,
    input: problem.input,
    output: problem.output,
    explanation: problem.explanation,
    constraints: problem.constraints,
    hints: problem.hints ?? "",
    editorial: problem.editorial ?? "",
    testCases: problem.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isSample: tc.isSample,
      isHidden: tc.isHidden,
      explanation: tc.explanation ?? "",
      order: tc.order,
    })),
    codeSnippets: problem.codeSnippets.map((cs) => ({
      language: cs.language,
      code: cs.code,
    })),
    solutions: problem.solutions.map((s) => ({
      language: s.language,
      code: s.code,
    })),
  };

  const methods = useForm<EditProblemFormValues>({
    resolver: zodResolver(editProblemFormSchema),
    defaultValues,
  });

  const setStep = (id: string, status: StepStatus) =>
    setLoadingSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  const onSubmit = async (values: EditProblemFormValues) => {
    setIsPending(true);
    setValidationErrors(null);
    setLoadingSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" as StepStatus })));

    try {
      setStep("save", "active");

      const solutionsRecord: Record<string, string> = {};
      values.solutions.forEach((sol) => { solutionsRecord[sol.language] = sol.code; });

      const payload = { ...values, solutions: solutionsRecord };

      const response = await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setValidationErrors(data);
        toast.error("Failed to save changes.");
        setStep("save", "pending");
        return;
      }

      setStep("save", "done");
      setStep("persist", "active");
      await new Promise((r) => setTimeout(r, 350));
      setStep("persist", "done");

      toast.success(`Problem #${problem.id} updated successfully!`);
      router.push("/admin/problems");
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("An error occurred while saving.");
      setValidationErrors({ error: "Failed to connect to server." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <FormProvider {...methods}>
      {isPending && <SavingLoadingScreen steps={loadingSteps} />}

      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row gap-6 relative min-h-[1000px]"
      >
        {/* Ambient glows */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-amber-500/[0.03] dark:bg-amber-500/[0.02] blur-[100px] pointer-events-none select-none" />
        <div className="absolute bottom-40 right-10 w-[500px] h-[500px] rounded-full bg-orange-600/[0.03] dark:bg-orange-600/[0.015] blur-[140px] pointer-events-none select-none" />

        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6 lg:max-w-[72%] relative z-10">
          {/* Header bar */}
          <div className="bg-[#fcfcfd]/80 dark:bg-[#0c0c0e]/95 border border-zinc-200/80 dark:border-zinc-900 border-l-4 border-l-amber-500 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-amber-500" />
                // EDIT_PROBLEM_SEQUENCE &nbsp;·&nbsp; #{String(problem.id).padStart(3, "0")}
              </span>
              <span className="font-mono text-[8.5px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Modify existing problem data — changes are saved directly to the database
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/problems")}
              className="flex items-center gap-1.5 font-mono text-[9.5px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Registry
            </button>
          </div>

          {/* Form sections */}
          <BasicInfoSection disabled={isPending} />
          <ProblemStatementSection disabled={isPending} />
          <TestCasesSection disabled={isPending} />
          <CodeSnippetsSection disabled={isPending} />
          <SolutionsSection disabled={isPending} />
        </div>

        {/* Right column — sidebar */}
        <div className="w-full lg:w-[28%] flex flex-col gap-6 relative z-10">
          <div className="sticky top-20">
            <PublishSidebar
              isPending={isPending}
              validationErrors={validationErrors}
              success={false}
              mode="edit"
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
