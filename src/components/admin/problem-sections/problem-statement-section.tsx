"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { AlignLeft } from "lucide-react";

interface SectionProps {
  disabled?: boolean;
}

export function ProblemStatementSection({ disabled }: SectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProblemFormValues>();

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-150 dark:border-zinc-900 pb-2">
        <AlignLeft className="h-4 w-4 text-amber-500" />
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
          02 // Problem Statement & Specifications
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {/* Main Problem Description */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
            Problem Description (Markdown Supported)
          </label>
          <textarea
            disabled={disabled}
            rows={6}
            placeholder="Describe the challenge clearly. Include problem description, logic flows, etc."
            {...register("description")}
            className="w-full font-sans text-xs p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors resize-y"
          />
          {errors.description && (
            <span className="font-mono text-[9px] text-red-500 uppercase">{errors.description.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Format */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
              Input Specification
            </label>
            <textarea
              disabled={disabled}
              rows={3}
              placeholder="e.g. An integer array nums and a target sum."
              {...register("input")}
              className="w-full font-sans text-xs p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
            {errors.input && (
              <span className="font-mono text-[9px] text-red-500 uppercase">{errors.input.message}</span>
            )}
          </div>

          {/* Output Format */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
              Output Specification
            </label>
            <textarea
              disabled={disabled}
              rows={3}
              placeholder="e.g. Indices of the two values that sum to the target."
              {...register("output")}
              className="w-full font-sans text-xs p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
            {errors.output && (
              <span className="font-mono text-[9px] text-red-500 uppercase">{errors.output.message}</span>
            )}
          </div>

          {/* Output Explanation */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
              General Output Explanation
            </label>
            <textarea
              disabled={disabled}
              rows={2}
              placeholder="Provide a general high-level explanation of output mappings."
              {...register("explanation")}
              className="w-full font-sans text-xs p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
            {errors.explanation && (
              <span className="font-mono text-[9px] text-red-500 uppercase">{errors.explanation.message}</span>
            )}
          </div>

          {/* Constraints */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
              Constraints (one per line recommended)
            </label>
            <textarea
              disabled={disabled}
              rows={3}
              placeholder="e.g. 2 <= nums.length <= 10^4&#10;-10^9 <= nums[i] <= 10^9"
              {...register("constraints")}
              className="w-full font-mono text-xs p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
            {errors.constraints && (
              <span className="font-mono text-[9px] text-red-500 uppercase">{errors.constraints.message}</span>
            )}
          </div>

          {/* Optional Hints */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
              Admin Hints <span className="text-[8px] text-zinc-400 font-normal">(Optional)</span>
            </label>
            <textarea
              disabled={disabled}
              rows={3}
              placeholder="e.g. Try a hash table to find the complement in O(1) time."
              {...register("hints")}
              className="w-full font-sans text-xs p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
          </div>

          {/* Optional Editorial */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
              Editorial Solution Analysis <span className="text-[8px] text-zinc-400 font-normal">(Optional)</span>
            </label>
            <textarea
              disabled={disabled}
              rows={3}
              placeholder="Detailed algorithmic solution description."
              {...register("editorial")}
              className="w-full font-sans text-xs p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
