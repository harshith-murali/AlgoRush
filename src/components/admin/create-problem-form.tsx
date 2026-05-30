"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Difficulty, Language } from "@/generated/prisma";
import { SAMPLE_PROBLEMS, emptyDefaultValues } from "@/lib/problem-sample-data";

import {
  BasicInfoSection,
  ProblemStatementSection,
  TestCasesSection,
  CodeSnippetsSection,
  SolutionsSection,
  PublishSidebar,
} from "./problem-sections";

import { Terminal, Cpu, Trash2, Sparkles, ChevronDown, CheckCircle2, Loader2, Circle } from "lucide-react";

// ─── Form validation schema ──────────────────────────────────────────────────
const createProblemFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  difficulty: z.nativeEnum(Difficulty),
  tags: z.array(z.string()).min(1, "At least one index tag is required."),
  description: z.string().min(10, "Problem description must be descriptive."),
  input: z.string().min(5, "Input specifications are required."),
  output: z.string().min(5, "Output specifications are required."),
  explanation: z.string().min(5, "A sample validation explanation is required."),
  constraints: z.string().min(5, "Constraints are required."),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input stdin is required."),
        expectedOutput: z.string().min(1, "Expected stdout is required."),
        isSample: z.boolean(),
        isHidden: z.boolean(),
        explanation: z.string().optional(),
        order: z.number().int(),
      })
    )
    .min(1, "At least one testcase assertion is required."),
  codeSnippets: z
    .array(
      z.object({
        language: z.nativeEnum(Language),
        code: z.string().min(5, "Code boilerplate template is required."),
      })
    )
    .min(1, "At least one starter boilerplate code snippet is required."),
  solutions: z
    .array(
      z.object({
        language: z.nativeEnum(Language),
        code: z.string().min(5, "Reference solution code is required."),
      })
    )
    .min(1, "At least one reference solution is required."),
});

export type CreateProblemFormValues = z.infer<typeof createProblemFormSchema>;

// ─── Step definitions for the loading screen ─────────────────────────────────
type StepStatus = "pending" | "active" | "done";
interface LoadingStep {
  id: string;
  label: string;
  status: StepStatus;
}

const INITIAL_STEPS: LoadingStep[] = [
  { id: "connect", label: "Connecting to execution engine", status: "pending" },
  { id: "validate", label: "Running Judge0 batch validation", status: "pending" },
  { id: "persist", label: "Persisting to database", status: "pending" },
];

// ─── Full-screen loading overlay component ───────────────────────────────────
function SandboxLoadingScreen({ steps }: { steps: LoadingStep[] }) {
  const [progress, setProgress] = useState(0);

  // Animate the progress bar based on completed steps
  useEffect(() => {
    const done = steps.filter((s) => s.status === "done").length;
    const active = steps.some((s) => s.status === "active") ? 0.5 : 0;
    const total = steps.length;
    const target = Math.round(((done + active) / total) * 90); // cap at 90% until fully done
    setProgress(target);
  }, [steps]);

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950/98 backdrop-blur-md flex items-center justify-center">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-orange-600/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8 max-w-sm w-full px-6 text-center">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center">
            <Cpu className="h-8 w-8 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <h2 className="font-mono text-sm font-black uppercase tracking-[0.2em] text-white">
            Deploying to Sandbox
          </h2>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Running Judge0 validation suite
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="w-full flex flex-col gap-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                {step.status === "done" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {step.status === "active" && (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                )}
                {step.status === "pending" && (
                  <Circle className="w-4 h-4 text-zinc-700" />
                )}
              </div>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                  step.status === "done"
                    ? "text-emerald-400"
                    : step.status === "active"
                    ? "text-amber-400"
                    : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
          This may take up to 15 seconds
        </p>
      </div>
    </div>
  );
}

// ─── Outer wrapper (manages key for form reset) ───────────────────────────────
export function CreateProblemForm() {
  const [activeKey, setActiveKey] = useState("binary-search");

  return (
    <CreateProblemFormContent
      key={activeKey}
      activeKey={activeKey}
      setActiveKey={setActiveKey}
    />
  );
}

// ─── Main form component ──────────────────────────────────────────────────────
function CreateProblemFormContent({
  activeKey,
  setActiveKey,
}: {
  activeKey: string;
  setActiveKey: (key: string) => void;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(INITIAL_STEPS);
  const [validationErrors, setValidationErrors] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine initial dataset based on parent activeKey
  let initialValues = SAMPLE_PROBLEMS["binary-search"];
  if (SAMPLE_PROBLEMS[activeKey]) {
    initialValues = SAMPLE_PROBLEMS[activeKey];
  } else if (activeKey.startsWith("empty")) {
    initialValues = emptyDefaultValues;
  }

  const methods = useForm<CreateProblemFormValues>({
    resolver: zodResolver(createProblemFormSchema),
    defaultValues: initialValues,
  });

  const setStep = (id: string, status: StepStatus) => {
    setLoadingSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const resetSteps = () => setLoadingSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" as StepStatus })));

  const clearForm = () => {
    setActiveKey("empty-" + Date.now());
    toast.success("Form Cleared!");
  };

  const onSubmit = async (values: CreateProblemFormValues) => {
    setIsPending(true);
    setValidationErrors(null);
    resetSteps();

    try {
      // Step 1 — connect
      setStep("connect", "active");
      const solutionsRecord: Record<string, string> = {};
      values.solutions.forEach((sol) => {
        solutionsRecord[sol.language] = sol.code;
      });
      const payload = { ...values, solutions: solutionsRecord };
      setStep("connect", "done");

      // Step 2 — validate via Judge0
      setStep("validate", "active");
      const response = await fetch("/api/create-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setStep("validate", "pending");
        setValidationErrors(data);
        toast.error("Sandbox validation rejected — check the errors below.");
        return;
      }

      setStep("validate", "done");

      // Step 3 — persist (already done by the API, animate for UX)
      setStep("persist", "active");
      await new Promise((r) => setTimeout(r, 400));
      setStep("persist", "done");

      toast.success(`Problem #${data.programId} created successfully!`);

      // Immediate redirect — no delay
      router.push("/admin/problems");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("An internal error occurred during submission.");
      setValidationErrors({ error: "Failed to connect to API server." });
      resetSteps();
    } finally {
      setIsPending(false);
    }
  };

  const activeSampleName = SAMPLE_PROBLEMS[activeKey]?.title;

  return (
    <FormProvider {...methods}>
      {/* ── Full-screen sandbox loading overlay ── */}
      {isPending && <SandboxLoadingScreen steps={loadingSteps} />}

      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row gap-6 relative min-h-[1000px]"
      >
        {/* Glowing cyber ambient background */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-amber-500/[0.03] dark:bg-amber-500/[0.02] blur-[100px] pointer-events-none select-none" />
        <div className="absolute bottom-40 right-10 w-[500px] h-[500px] rounded-full bg-orange-600/[0.03] dark:bg-orange-600/[0.015] blur-[140px] pointer-events-none select-none" />

        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6 lg:max-w-[72%] relative z-10">
          {/* SYSTEM PRELOAD ACTIONS ROW */}
          <div className="bg-[#fcfcfd]/80 dark:bg-[#0c0c0e]/95 border border-zinc-200/80 dark:border-zinc-900 border-l-4 border-l-amber-500 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none backdrop-blur-md rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-amber-500" />
                // SYSTEM_PRELOAD_ACTIONS
              </span>
              <span className="font-mono text-[8.5px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Load fully-formed practice problems to verify sandbox validation pipelines
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto relative">
              {/* Load Sample Dropdown */}
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 font-mono text-[9.5px] font-black uppercase tracking-tight bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-lg cursor-pointer select-none transition-all duration-200 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>{activeSampleName ? `Sample: ${activeSampleName}` : "Load Sample Problem"}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-2xl py-2 z-50 flex flex-col font-mono text-[9px] text-zinc-500 dark:text-zinc-400 select-none animate-in fade-in-50 slide-in-from-top-1 duration-150">
                      <span className="px-3.5 py-1.5 font-bold uppercase text-[7.5px] tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 mb-1 select-none">
                        Select Practice Challenge
                      </span>
                      {Object.entries(SAMPLE_PROBLEMS).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setActiveKey(key);
                            setDropdownOpen(false);
                            toast.success(`${value.title} sample preloaded!`);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                            activeKey === key ? "text-amber-500 font-bold bg-amber-500/[0.03]" : ""
                          }`}
                        >
                          <span>{value.title}</span>
                          <span className={`text-[7px] px-1.5 py-0.5 border rounded-md uppercase font-bold tracking-tighter ${
                            value.difficulty === Difficulty.EASY
                              ? "text-emerald-500 border-emerald-500/25 bg-emerald-500/5"
                              : "text-amber-500 border-amber-500/25 bg-amber-500/5"
                          }`}>
                            {value.difficulty}
                          </span>
                        </button>
                      ))}

                      <div className="border-t border-zinc-100 dark:border-zinc-900 my-1" />
                      <button
                        type="button"
                        onClick={() => { clearForm(); setDropdownOpen(false); }}
                        className="w-full text-left px-3.5 py-2 text-red-500 hover:bg-red-500/5 hover:text-red-600 transition-colors duration-150 flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Clear Form</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form sections */}
          <BasicInfoSection disabled={isPending} />
          <ProblemStatementSection disabled={isPending} />
          <TestCasesSection disabled={isPending} />
          <CodeSnippetsSection disabled={isPending} />
          <SolutionsSection disabled={isPending} />
        </div>

        {/* Right column — sticky sidebar */}
        <div className="w-full lg:w-[28%] flex flex-col gap-6 relative z-10">
          <div className="sticky top-20">
            <PublishSidebar
              isPending={isPending}
              validationErrors={validationErrors}
              success={false}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
