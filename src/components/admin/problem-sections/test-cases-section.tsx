"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { ListFilter, Plus, Trash, ShieldCheck } from "lucide-react";

interface SectionProps {
  disabled?: boolean;
}

export function TestCasesSection({ disabled }: SectionProps) {
  const {
    control,
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
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-150 dark:border-zinc-900 pb-2">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-amber-500" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            03 // Assertions Test Cases Suite
          </h3>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={addTestCase}
          className="font-mono text-[10px] font-bold uppercase tracking-tight bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-3 w-3" /> Add Testcase
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {fields.length === 0 && (
          <div className="text-center p-6 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg font-mono text-[10px] text-zinc-400">
            NO ACTIVE TEST CASES REGISTERED. MINIMUM 1 REQUIRED.
          </div>
        )}

        {fields.map((field, idx) => {
          const tcErrors = errors.testCases?.[idx];

          return (
            <div
              key={field.id}
              className="border border-zinc-200 dark:border-zinc-900 rounded-lg p-4 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col gap-3 relative"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900/50 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-zinc-500 flex items-center gap-1">
                  <span>[#0{idx + 1}]</span>
                  <span>Test Case Entry</span>
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(idx)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove testcase"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Input & Output Monospace Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Input Stdin
                  </label>
                  <textarea
                    disabled={disabled}
                    rows={2}
                    placeholder="e.g. [2,7,11,15]\n9"
                    {...register(`testCases.${idx}.input` as const)}
                    className="w-full font-mono text-xs p-2.5 bg-zinc-150/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {tcErrors?.input && (
                    <span className="font-mono text-[9px] text-red-500 uppercase">{tcErrors.input.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                    Expected Stdout Output
                  </label>
                  <textarea
                    disabled={disabled}
                    rows={2}
                    placeholder="e.g. [0,1]"
                    {...register(`testCases.${idx}.expectedOutput` as const)}
                    className="w-full font-mono text-xs p-2.5 bg-zinc-150/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {tcErrors?.expectedOutput && (
                    <span className="font-mono text-[9px] text-red-500 uppercase">{tcErrors.expectedOutput.message}</span>
                  )}
                </div>
              </div>

              {/* Toggles & Options */}
              <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900/20 p-2.5 rounded-md">
                {/* Sample Test Case */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    {...register(`testCases.${idx}.isSample` as const)}
                    className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                  />
                  <span className="font-bold uppercase tracking-tight">Sample Testcase</span>
                </label>

                {/* Hidden Test Case */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    {...register(`testCases.${idx}.isHidden` as const)}
                    className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                  />
                  <span className="font-bold uppercase tracking-tight">Hidden Suite Case</span>
                </label>

                {/* TestCase Order */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span>Order Index:</span>
                  <input
                    type="number"
                    disabled={disabled}
                    defaultValue={idx}
                    {...register(`testCases.${idx}.order` as const, { valueAsNumber: true })}
                    className="w-12 text-center p-0.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded font-bold"
                  />
                </div>
              </div>

              {/* Explanation */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                  Case Execution Explanation (e.g. why this output occurs)
                </label>
                <input
                  type="text"
                  disabled={disabled}
                  placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                  {...register(`testCases.${idx}.explanation` as const)}
                  className="w-full font-sans text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
