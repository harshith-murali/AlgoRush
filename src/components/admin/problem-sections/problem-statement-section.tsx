"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { AlignLeft } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";

interface SectionProps {
  disabled?: boolean;
}

export function ProblemStatementSection({ disabled }: SectionProps) {
  const monacoTheme = useMonacoTheme();
  const isLight = monacoTheme === "vs-light";
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProblemFormValues>();

  const descriptionValue = watch("description") || "";
  const inputValue = watch("input") || "";
  const outputValue = watch("output") || "";
  const explanationValue = watch("explanation") || "";
  const constraintsValue = watch("constraints") || "";
  const hintsValue = watch("hints") || "";
  const editorialValue = watch("editorial") || "";

  return (
    <div className="bg-[#fcfcfd]/70 dark:bg-[#0c0c0e]/95 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none">
      <div className="flex items-center gap-2 mb-5 border-b border-zinc-150 dark:border-zinc-850 pb-3">
        <AlignLeft className="h-4 w-4 text-amber-500" />
        <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
          02 // Problem Statement & Specifications
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        {/* Main Problem Description */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
            Problem Description (Markdown Supported)
          </label>
          <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
            <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] tracking-tight select-none ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
              <span>PROBLEM_DESCRIPTION // MONACO_ACTIVE</span>
              <span className="text-amber-500/80 font-bold uppercase">MARKDOWN MODE</span>
            </div>
            <Editor
              height="240px"
              language="markdown"
              theme={monacoTheme}
              value={descriptionValue}
              onChange={(val) => setValue("description", val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: "on",
                tabSize: 2,
                scrollBeyondLastLine: false,
                readOnly: disabled,
                padding: { top: 8, bottom: 8 },
                cursorBlinking: "smooth",
                fontFamily: "var(--font-geist-mono), monospace",
              }}
              className="w-full"
            />
          </div>
          {errors.description && (
            <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
              [CRITICAL] {errors.description.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input Format */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
              Input Specification
            </label>
            <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
              <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-tight select-none`}>
                <span>INPUT_SPEC // MONACO_ACTIVE</span>
                <span className="text-amber-500/80 font-bold uppercase">PLAINTEXT MODE</span>
              </div>
              <Editor
                height="120px"
                language="plaintext"
                theme={monacoTheme}
                value={inputValue}
                onChange={(val) => setValue("input", val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "off",
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  readOnly: disabled,
                  padding: { top: 8, bottom: 8 },
                  cursorBlinking: "smooth",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
                className="w-full"
              />
            </div>
            {errors.input && (
              <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
                [CRITICAL] {errors.input.message}
              </span>
            )}
          </div>

          {/* Output Format */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
              Output Specification
            </label>
            <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
              <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-tight select-none`}>
                <span>OUTPUT_SPEC // MONACO_ACTIVE</span>
                <span className="text-amber-500/80 font-bold uppercase">PLAINTEXT MODE</span>
              </div>
              <Editor
                height="120px"
                language="plaintext"
                theme={monacoTheme}
                value={outputValue}
                onChange={(val) => setValue("output", val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "off",
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  readOnly: disabled,
                  padding: { top: 8, bottom: 8 },
                  cursorBlinking: "smooth",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
                className="w-full"
              />
            </div>
            {errors.output && (
              <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
                [CRITICAL] {errors.output.message}
              </span>
            )}
          </div>

          {/* Output Explanation */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
              General Output Explanation
            </label>
            <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
              <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-tight select-none`}>
                <span>OUTPUT_EXPLANATION // MONACO_ACTIVE</span>
                <span className="text-amber-500/80 font-bold uppercase">PLAINTEXT MODE</span>
              </div>
              <Editor
                height="120px"
                language="plaintext"
                theme={monacoTheme}
                value={explanationValue}
                onChange={(val) => setValue("explanation", val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "off",
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  readOnly: disabled,
                  padding: { top: 8, bottom: 8 },
                  cursorBlinking: "smooth",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
                className="w-full"
              />
            </div>
            {errors.explanation && (
              <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
                [CRITICAL] {errors.explanation.message}
              </span>
            )}
          </div>

          {/* Constraints */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
              Constraints (one per line recommended)
            </label>
            <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
              <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-tight select-none`}>
                <span>CONSTRAINTS // MONACO_ACTIVE</span>
                <span className="text-amber-500/80 font-bold uppercase">PLAINTEXT MODE</span>
              </div>
              <Editor
                height="120px"
                language="plaintext"
                theme={monacoTheme}
                value={constraintsValue}
                onChange={(val) => setValue("constraints", val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  readOnly: disabled,
                  padding: { top: 8, bottom: 8 },
                  cursorBlinking: "smooth",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
                className="w-full"
              />
            </div>
            {errors.constraints && (
              <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
                [CRITICAL] {errors.constraints.message}
              </span>
            )}
          </div>

          {/* Optional Hints */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-550 dark:text-zinc-405">
              Admin Hints <span className="text-[7.5px] text-zinc-400 dark:text-zinc-550 font-normal uppercase tracking-wider">(Optional)</span>
            </label>
            <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
              <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-tight select-none`}>
                <span>ADMIN_HINTS // MONACO_ACTIVE</span>
                <span className="text-amber-500/80 font-bold uppercase">PLAINTEXT MODE</span>
              </div>
              <Editor
                height="120px"
                language="plaintext"
                theme={monacoTheme}
                value={hintsValue}
                onChange={(val) => setValue("hints", val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "off",
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  readOnly: disabled,
                  padding: { top: 8, bottom: 8 },
                  cursorBlinking: "smooth",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Optional Editorial */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-550 dark:text-zinc-405">
              Editorial Solution Analysis <span className="text-[7.5px] text-zinc-400 dark:text-zinc-550 font-normal uppercase tracking-wider">(Optional)</span>
            </label>
            <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
              <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-tight select-none`}>
                <span>EDITORIAL_ANALYSIS // MONACO_ACTIVE</span>
                <span className="text-amber-500/80 font-bold uppercase">MARKDOWN MODE</span>
              </div>
              <Editor
                height="120px"
                language="markdown"
                theme={monacoTheme}
                value={editorialValue}
                onChange={(val) => setValue("editorial", val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  readOnly: disabled,
                  padding: { top: 8, bottom: 8 },
                  cursorBlinking: "smooth",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
