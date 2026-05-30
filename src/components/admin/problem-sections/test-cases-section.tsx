"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { ListFilter, Plus, Trash } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";

interface SectionProps {
  disabled?: boolean;
}

export function TestCasesSection({ disabled }: SectionProps) {
  const monacoTheme = useMonacoTheme();
  const {
    control,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<CreateProblemFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases",
  });

  const addTestCase = () => {
    append({
      input: "",
      expectedOutput: "",
      isSample: false,
      isHidden: true,
      explanation: "",
      order: fields.length,
    });
  };

  return (
    <div className="bg-[#fcfcfd]/70 dark:bg-[#0c0c0e]/95 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none">
      <div className="flex items-center justify-between mb-5 border-b border-zinc-150 dark:border-zinc-855 pb-3">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-amber-500" />
          <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
            03 // Assertions Test Cases Suite
          </h3>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={addTestCase}
          className="font-mono text-[9px] font-black uppercase tracking-tight bg-amber-500 hover:bg-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-550/20 text-zinc-950 dark:text-amber-500 border border-amber-550 dark:border-amber-500/25 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-md shadow-amber-500/5 dark:shadow-none"
        >
          <Plus className="h-3.5 w-3.5" /> Add Testcase
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-xl font-mono text-[10px] text-zinc-450 dark:text-zinc-550 uppercase tracking-widest">
            NO ACTIVE TEST CASES REGISTERED. MINIMUM 1 REQUIRED.
          </div>
        )}

        {fields.map((field, idx) => {
          const tcErrors = errors.testCases?.[idx];
          const tcInput = watch(`testCases.${idx}.input`) || "";
          const tcExpectedOutput = watch(`testCases.${idx}.expectedOutput`) || "";

          return (
            <div
              key={field.id}
              className="border border-zinc-200/80 dark:border-zinc-900/80 rounded-xl p-4 bg-[#fcfcfd]/40 dark:bg-[#08080a] flex flex-col gap-3 relative hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-200"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900/60 pb-2">
                <span className="font-mono text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <span className="text-amber-555">[#0{idx + 1}]</span>
                  <span>Test Case Entry</span>
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(idx)}
                  className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove testcase"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Input & Output Monospace Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[8.5px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                    Input Stdin
                  </label>
                  <div className="relative border border-zinc-250 dark:border-[#141418] rounded-lg overflow-hidden shadow-inner">
                    <Editor
                      height="90px"
                      language="plaintext"
                      theme={monacoTheme}
                      value={tcInput}
                      onChange={(val) => setValue(`testCases.${idx}.input`, val || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 12,
                        lineNumbers: "off",
                        tabSize: 2,
                        scrollBeyondLastLine: false,
                        readOnly: disabled,
                        padding: { top: 6, bottom: 6 },
                        cursorBlinking: "smooth",
                        fontFamily: "var(--font-geist-mono), monospace",
                      }}
                      className="w-full"
                    />
                  </div>
                  {tcErrors?.input && (
                    <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 font-bold">{tcErrors.input.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[8.5px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                    Expected Stdout Output
                  </label>
                  <div className="relative border border-zinc-250 dark:border-[#141418] rounded-lg overflow-hidden shadow-inner">
                    <Editor
                      height="90px"
                      language="plaintext"
                      theme={monacoTheme}
                      value={tcExpectedOutput}
                      onChange={(val) => setValue(`testCases.${idx}.expectedOutput`, val || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 12,
                        lineNumbers: "off",
                        tabSize: 2,
                        scrollBeyondLastLine: false,
                        readOnly: disabled,
                        padding: { top: 6, bottom: 6 },
                        cursorBlinking: "smooth",
                        fontFamily: "var(--font-geist-mono), monospace",
                      }}
                      className="w-full"
                    />
                  </div>
                  {tcErrors?.expectedOutput && (
                    <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 font-bold">{tcErrors.expectedOutput.message}</span>
                  )}
                </div>
              </div>

              {/* Toggles & Options */}
              <div className="flex flex-wrap items-center gap-6 font-mono text-[9px] text-zinc-550 dark:text-zinc-500 bg-zinc-100/50 dark:bg-[#050506] p-3 rounded-lg border border-zinc-200 dark:border-zinc-900/60">
                {/* Sample Test Case */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    {...register(`testCases.${idx}.isSample` as const)}
                    className="rounded border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-amber-500 focus:ring-amber-500 h-4 w-4"
                  />
                  <span className="font-bold uppercase tracking-wider">Sample Testcase</span>
                </label>

                {/* Hidden Test Case */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    {...register(`testCases.${idx}.isHidden` as const)}
                    className="rounded border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-amber-500 focus:ring-amber-500 h-4 w-4"
                  />
                  <span className="font-bold uppercase tracking-wider">Hidden Suite Case</span>
                </label>

                {/* TestCase Order */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span>Order Index:</span>
                  <input
                    type="number"
                    disabled={disabled}
                    defaultValue={idx}
                    {...register(`testCases.${idx}.order` as const, { valueAsNumber: true })}
                    className="w-12 text-center py-0.5 px-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 rounded font-bold text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Explanation */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[8.5px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                  Case Execution Explanation (e.g. why this output occurs)
                </label>
                <input
                  type="text"
                  disabled={disabled}
                  placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                  {...register(`testCases.${idx}.explanation` as const)}
                  className="w-full font-mono text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-zinc-855 dark:text-zinc-250 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 transition-all duration-200 shadow-inner"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
