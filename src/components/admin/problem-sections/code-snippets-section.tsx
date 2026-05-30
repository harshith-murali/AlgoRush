"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { Language } from "@/generated/prisma";
import { Code2, Plus, Trash } from "lucide-react";

interface SectionProps {
  disabled?: boolean;
}

export function CodeSnippetsSection({ disabled }: SectionProps) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateProblemFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "codeSnippets",
  });

  const activeSnippets = watch("codeSnippets") || [];

  // Filter languages to avoid duplicates
  const getAvailableLanguages = (currentIndex: number) => {
    const selectedLanguages = activeSnippets
      .map((s, idx) => (idx !== currentIndex ? s.language : null))
      .filter(Boolean);

    return Object.values(Language).filter((lang) => !selectedLanguages.includes(lang));
  };

  const addSnippet = () => {
    const available = getAvailableLanguages(-1);
    if (available.length > 0) {
      append({
        language: available[0],
        code: `// Starter template code for ${available[0]}`,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-150 dark:border-zinc-900 pb-2">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-amber-500" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            04 // Starter Code Snippet Templates
          </h3>
        </div>
        <button
          type="button"
          disabled={disabled || activeSnippets.length >= Object.keys(Language).length}
          onClick={addSnippet}
          className="font-mono text-[10px] font-bold uppercase tracking-tight bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-3 w-3" /> Add Template
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {fields.length === 0 && (
          <div className="text-center p-6 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg font-mono text-[10px] text-zinc-400">
            NO TEMPLATES ADDED. CANDIDATES WILL NOT HAVE STARTER CODE TO BEGIN PRACTICE.
          </div>
        )}

        {fields.map((field, idx) => {
          const snippetErrors = errors.codeSnippets?.[idx];
          const availableLangs = getAvailableLanguages(idx);

          return (
            <div
              key={field.id}
              className="border border-zinc-200 dark:border-zinc-900 rounded-lg p-4 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col gap-3"
            >
              {/* Header Selector */}
              <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900/50 pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">
                    Template Lang:
                  </span>
                  <select
                    disabled={disabled}
                    {...register(`codeSnippets.${idx}.language` as const)}
                    className="font-mono text-[10px] font-bold uppercase tracking-tight px-2 py-1 bg-zinc-150/70 dark:bg-zinc-850 border border-zinc-250 dark:border-zinc-850 rounded-md focus:outline-none focus:border-amber-500"
                  >
                    <option value={field.language}>{field.language}</option>
                    {availableLangs.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(idx)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove template"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Monospace Code Editor */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                  Boilerplate Solution Code Area
                </label>
                <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden bg-zinc-900 dark:bg-zinc-950">
                  <div className="bg-zinc-950 px-4 py-1.5 border-b border-zinc-800/80 flex items-center font-mono text-[9px] text-zinc-500 tracking-tight select-none">
                    CODE_TEMPLATE_SHELL // READ_ONLY
                  </div>
                  <textarea
                    disabled={disabled}
                    rows={8}
                    placeholder={`// Enter starter code here...`}
                    {...register(`codeSnippets.${idx}.code` as const)}
                    className="w-full font-mono text-xs p-4 bg-transparent text-zinc-100 dark:text-zinc-200 border-none outline-none focus:ring-0 resize-y block whitespace-pre"
                    style={{ tabSize: 2 }}
                  />
                </div>
                {snippetErrors?.code && (
                  <span className="font-mono text-[9px] text-red-500 uppercase mt-1">
                    {snippetErrors.code.message}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
