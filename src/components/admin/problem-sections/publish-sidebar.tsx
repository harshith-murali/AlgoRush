"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { Check, AlertTriangle, Play, HelpCircle, FileText, Code2, CheckSquare } from "lucide-react";

interface SidebarProps {
  isPending: boolean;
  validationErrors: any;
  success: boolean;
}

export function PublishSidebar({ isPending, validationErrors, success }: SidebarProps) {
  const { watch, formState: { errors } } = useFormContext<CreateProblemFormValues>();

  const title = watch("title");
  const tags = watch("tags") || [];
  const description = watch("description");
  const input = watch("input");
  const output = watch("output");
  const explanation = watch("explanation");
  const constraints = watch("constraints");
  const testCases = watch("testCases") || [];
  const codeSnippets = watch("codeSnippets") || [];
  const solutions = watch("solutions") || [];

  // Real-time completions status checklist
  const isBasicInfoDone = !!title && tags.length > 0;
  const isStatementDone = !!description && !!input && !!output && !!explanation && !!constraints;
  const isTestCasesDone = testCases.length > 0 && testCases.every(tc => !!tc.input && !!tc.expectedOutput);
  const isSnippetsDone = codeSnippets.length > 0 && codeSnippets.every(cs => !!cs.code);
  const isSolutionsDone = solutions.length > 0 && solutions.every(sol => !!sol.code);

  const isFormValid = isBasicInfoDone && isStatementDone && isTestCasesDone && isSnippetsDone && isSolutionsDone;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Main Action Console Box */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-150 dark:border-zinc-900 pb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
          <span>CONSOLE_ACTIONS</span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Counters Grid */}
          <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px] tracking-tight">
            <div className="p-2 border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/30 rounded flex flex-col gap-0.5">
              <span className="font-bold text-zinc-550 dark:text-zinc-400">TEST CASES</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">{testCases.length}</span>
            </div>
            <div className="p-2 border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/30 rounded flex flex-col gap-0.5">
              <span className="font-bold text-zinc-550 dark:text-zinc-400">SNIPPETS</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">{codeSnippets.length}</span>
            </div>
            <div className="p-2 border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/30 rounded flex flex-col gap-0.5">
              <span className="font-bold text-zinc-550 dark:text-zinc-400">SOLUTIONS</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">{solutions.length}</span>
            </div>
            <div className="p-2 border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/30 rounded flex flex-col gap-0.5">
              <span className="font-bold text-zinc-550 dark:text-zinc-400">TAGS</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">{tags.length}</span>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="border border-zinc-150 dark:border-zinc-900 rounded-md p-3 flex flex-col gap-2 font-mono text-[10px]">
            <span className="font-bold uppercase text-zinc-400 mb-1">REGISTRY VERIFICATIONS:</span>
            
            {/* Basic Info Check */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-650 dark:text-zinc-450">01 // BASIC_INFO</span>
              {isBasicInfoDone ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 font-bold" />
              ) : (
                <span className="text-red-500 font-bold">[PENDING]</span>
              )}
            </div>

            {/* Statement Check */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-650 dark:text-zinc-450">02 // PROBLEM_SPECS</span>
              {isStatementDone ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 font-bold" />
              ) : (
                <span className="text-red-500 font-bold">[PENDING]</span>
              )}
            </div>

            {/* Test Cases Check */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-650 dark:text-zinc-450">03 // TEST_SUITES</span>
              {isTestCasesDone ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 font-bold" />
              ) : (
                <span className="text-red-500 font-bold">[PENDING]</span>
              )}
            </div>

            {/* Snippets Check */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-650 dark:text-zinc-450">04 // STARTER_CODE</span>
              {isSnippetsDone ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 font-bold" />
              ) : (
                <span className="text-red-500 font-bold">[PENDING]</span>
              )}
            </div>

            {/* Solutions Check */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-650 dark:text-zinc-450">05 // SOLUTIONS_KEYS</span>
              {isSolutionsDone ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 font-bold" />
              ) : (
                <span className="text-red-500 font-bold">[PENDING]</span>
              )}
            </div>
          </div>

          {/* Submit Trigger Button */}
          <button
            type="submit"
            disabled={isPending || success}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-black uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>RUN VALIDATION & REGISTER</span>
          </button>
        </div>
      </div>

      {/* 2. Structured API/Judge0 Failures Panel */}
      {validationErrors && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-550 dark:text-red-400 rounded-lg p-4 font-mono text-[10px] uppercase tracking-tight flex flex-col gap-3">
          <div className="flex items-center gap-2 font-bold text-xs border-b border-red-500/20 pb-1.5 text-red-600 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <span>[CRITICAL] RUNTIME_ERROR</span>
          </div>

          {validationErrors.error && (
            <p className="font-bold tracking-tight text-[11px] text-red-600 dark:text-red-300">
              Error: {validationErrors.error}
            </p>
          )}

          {/* Render individual Zod details if available */}
          {validationErrors.details && (
            <div className="flex flex-col gap-1 text-[9px] lowercase font-sans select-text">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-650 dark:text-zinc-300">Zod parsing anomalies:</span>
              <pre className="p-2 bg-black/10 dark:bg-black/40 rounded overflow-x-auto select-all max-h-[150px]">
                {JSON.stringify(validationErrors.details, null, 2)}
              </pre>
            </div>
          )}

          {/* Render detailed Judge0 assertion failures */}
          {validationErrors.failures && validationErrors.failures.length > 0 && (
            <div className="flex flex-col gap-3 select-text max-h-[400px] overflow-y-auto pr-1">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">SANDBOX TEST SUITE ANOMALIES:</span>
              
              {validationErrors.failures.map((fail: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 bg-red-500/5 border border-red-500/20 rounded flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-[9px] border-b border-red-500/10 pb-1 text-red-600 dark:text-red-300">
                    <span>{fail.language} // CASE_INDEX #0{fail.testCaseIndex + 1}</span>
                    <span className="px-1 bg-red-500/10 border border-red-500/20 rounded text-[7px]">{fail.status}</span>
                  </div>
                  
                  {fail.testCaseInput && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-500 dark:text-zinc-500 text-[8px] font-bold">STDIN INPUT:</span>
                      <code className="p-1 bg-black/10 dark:bg-black/35 rounded block whitespace-pre-wrap select-all font-mono text-[9px]">{fail.testCaseInput}</code>
                    </div>
                  )}

                  {fail.stderr && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-500 dark:text-zinc-500 text-[8px] font-bold">RUNTIME STDERR:</span>
                      <code className="p-1 bg-black/10 dark:bg-black/35 rounded block whitespace-pre-wrap select-all font-mono text-[9px] text-red-500">{fail.stderr}</code>
                    </div>
                  )}

                  {fail.compile_output && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-500 dark:text-zinc-500 text-[8px] font-bold">COMPILE ERR:</span>
                      <code className="p-1 bg-black/10 dark:bg-black/35 rounded block whitespace-pre-wrap select-all font-mono text-[9px] text-red-500">{fail.compile_output}</code>
                    </div>
                  )}

                  {fail.stdout && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-500 dark:text-zinc-500 text-[8px] font-bold">STDOUT RECEIVED:</span>
                      <code className="p-1 bg-black/10 dark:bg-black/35 rounded block whitespace-pre-wrap select-all font-mono text-[9px]">{fail.stdout}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
