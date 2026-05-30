"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Difficulty, Language } from "@/generated/prisma";
import { BasicInfoSection } from "./problem-sections/basic-info-section";
import { ProblemStatementSection } from "./problem-sections/problem-statement-section";
import { TestCasesSection } from "./problem-sections/test-cases-section";
import { CodeSnippetsSection } from "./problem-sections/code-snippets-section";
import { SolutionsSection } from "./problem-sections/solutions-section";
import { PublishSidebar } from "./problem-sections/publish-sidebar";
import { cppTwoSumSampleData, cppReverseStringSampleData, emptyDefaultValues } from "@/lib/problem-sample-data";
import { Cpu, FileSpreadsheet, Trash2, AlignCenter } from "lucide-react";

// Form validation schema strictly mapping to backend API requirements
export const createProblemFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.nativeEnum(Difficulty),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).min(1, "At least one tag is required"),
  input: z.string().min(1, "Input specification is required"),
  output: z.string().min(1, "Output specification is required"),
  explanation: z.string().min(1, "Explanation is required"),
  constraints: z.string().min(1, "Constraints specification is required"),
  hints: z.string().optional().nullable(),
  editorial: z.string().optional().nullable(),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isSample: z.boolean(),
        isHidden: z.boolean(),
        explanation: z.string().optional().nullable(),
        order: z.number(),
      })
    )
    .min(1, "At least one test case is required"),
  codeSnippets: z
    .array(
      z.object({
        language: z.nativeEnum(Language),
        code: z.string().min(1, "Snippet template code is required"),
      })
    )
    .min(1, "At least one starter code template is required"),
  solutions: z
    .array(
      z.object({
        language: z.nativeEnum(Language),
        code: z.string().min(1, "Solution code is required"),
      })
    )
    .min(1, "At least one reference solution is required"),
});

export type CreateProblemFormValues = z.infer<typeof createProblemFormSchema>;

// Export the outer wrapper which manages the component key state
export function CreateProblemForm() {
  const [activeKey, setActiveKey] = useState("twosum");

  return (
    <CreateProblemFormContent
      key={activeKey}
      activeKey={activeKey}
      setActiveKey={setActiveKey}
    />
  );
}

// Subcomponent containing all React Hook Form setups
function CreateProblemFormContent({
  activeKey,
  setActiveKey,
}: {
  activeKey: string;
  setActiveKey: (key: string) => void;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>(null);
  const [successData, setSuccessData] = useState<any>(null);

  // Determine initial dataset based on the parent activeKey
  let initialValues = cppTwoSumSampleData;
  if (activeKey === "reversestring") {
    initialValues = cppReverseStringSampleData;
  } else if (activeKey.startsWith("empty")) {
    initialValues = emptyDefaultValues;
  }

  const methods = useForm<CreateProblemFormValues>({
    resolver: zodResolver(createProblemFormSchema),
    defaultValues: initialValues,
  });

  const loadTwoSumData = () => {
    setActiveKey("twosum");
    toast.success("Two Sum (C++) Preloaded!");
  };

  const loadReverseStringData = () => {
    setActiveKey("reversestring");
    toast.success("Reverse String (C++) Preloaded!");
  };

  const clearForm = () => {
    setActiveKey("empty-" + Date.now());
    toast.success("Form Cleared!");
  };

  const onSubmit = async (values: CreateProblemFormValues) => {
    setIsPending(true);
    setValidationErrors(null);
    setSuccessData(null);
    setLoadingStep("Connecting to Edge Sandbox...");

    try {
      // 1. Transform Solutions array structure into Record format
      const solutionsRecord: Record<string, string> = {};
      values.solutions.forEach((sol) => {
        solutionsRecord[sol.language] = sol.code;
      });

      const payload = {
        ...values,
        solutions: solutionsRecord,
      };

      setLoadingStep("Running Judge0 batch verification checks...");

      const response = await fetch("/api/create-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setValidationErrors(data);
        toast.error("Sandbox Validation Rejected");
        return;
      }

      setSuccessData(data);
      toast.success("Problem Created Successfully!");

      // Reset to empty on success
      setActiveKey("empty-" + Date.now());

      // Delayed routing to Manage Problems list
      setTimeout(() => {
        router.push("/admin/problems");
      }, 3000);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("An internal error occurred during submission.");
      setValidationErrors({ error: "Failed to connect to API server." });
    } finally {
      setIsPending(false);
      setLoadingStep(null);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row gap-6 relative"
      >
        {/* Form Loading Mask Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/70 z-50 rounded-lg flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg shadow-xl max-w-sm text-center">
              <Cpu className="h-8 w-8 text-amber-500 animate-spin" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                EDGE EXECUTION ENGINE ACTIVE
              </h3>
              <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                {loadingStep || "Initializing security assertions..."}
              </p>
            </div>
          </div>
        )}

        {/* Left Column - Main form content */}
        <div className="flex-1 flex flex-col gap-6 lg:max-w-[72%]">
          {/* Success summary redirecting panel */}
          {successData && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-mono text-[11px] uppercase tracking-wide flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span>[SUCCESS]</span>
                <span>REGISTRY TRANSACTIONS COMPLETE</span>
              </div>
              <p>Problem registered successfully with program ID: {successData.programId}</p>
              <p className="text-[9px] text-emerald-500/70">REDIRECTING TO MANAGEMENT DASHBOARD IN 3 SECONDS...</p>
            </div>
          )}

          {/* SYSTEM PRELOAD ACTIONS ROW */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-550 animate-pulse" />
                // SYSTEM_PRELOAD_ACTIONS
              </span>
              <span className="font-mono text-[8px] text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Load fully-formed practice problems to verify sandbox validation pipelines
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={loadTwoSumData}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-tight px-3 py-1.5 rounded border cursor-pointer select-none transition-colors ${
                  activeKey === "twosum"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-150 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                }`}
                title="Populate complete C++ Two Sum problem"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Two Sum (CPP)</span>
              </button>
              <button
                type="button"
                onClick={loadReverseStringData}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-tight px-3 py-1.5 rounded border cursor-pointer select-none transition-colors ${
                  activeKey === "reversestring"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-150 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                }`}
                title="Populate complete C++ Reverse String problem"
              >
                <AlignCenter className="h-3.5 w-3.5" />
                <span>Reverse String (CPP)</span>
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-tight bg-red-50 dark:bg-red-950/15 hover:bg-red-100 dark:hover:bg-red-950/25 text-red-550 dark:text-red-400 border border-red-500/20 px-3 py-1.5 rounded cursor-pointer select-none transition-colors"
                title="Empty all input segments"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Form</span>
              </button>
            </div>
          </div>

          {/* Form Sections */}
          <BasicInfoSection disabled={isPending} />
          <ProblemStatementSection disabled={isPending} />
          <TestCasesSection disabled={isPending} />
          <CodeSnippetsSection disabled={isPending} />
          <SolutionsSection disabled={isPending} />
        </div>

        {/* Right Column - Sticky Sidebar operations controls */}
        <div className="w-full lg:w-[28%] flex flex-col gap-6">
          <div className="sticky top-6">
            <PublishSidebar
              isPending={isPending}
              validationErrors={validationErrors}
              success={!!successData}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
