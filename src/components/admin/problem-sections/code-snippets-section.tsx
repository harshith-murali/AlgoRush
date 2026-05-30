"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { Language } from "@/generated/prisma";
import { SUPPORTED_LANGUAGES } from "@/lib/problem-language-templates";
import { getSampleTemplate } from "@/lib/problem-sample-data";
import { Code2, Plus, Trash } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";

interface SectionProps {
  disabled?: boolean;
}

const mapLanguageToMonaco = (lang: Language): string => {
  switch (lang) {
    case Language.CPP:
      return "cpp";
    case Language.JAVASCRIPT:
      return "javascript";
    case Language.PYTHON:
      return "python";
    case Language.JAVA:
      return "java";
    default:
      return "plaintext";
  }
};

export function CodeSnippetsSection({ disabled }: SectionProps) {
  const monacoTheme = useMonacoTheme();
  const isLight = monacoTheme === "vs-light";
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProblemFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "codeSnippets",
  });

  const activeSnippets = watch("codeSnippets") || [];
  const title = watch("title") || "";

  // Filter languages to only supported ones and avoid duplicates
  const getAvailableLanguages = (currentIndex: number) => {
    const selectedLanguages = activeSnippets
      .map((s, idx) => (idx !== currentIndex ? s.language : null))
      .filter(Boolean);

    return SUPPORTED_LANGUAGES.filter((lang) => !selectedLanguages.includes(lang));
  };

  const addSnippet = () => {
    const available = getAvailableLanguages(-1);
    if (available.length > 0) {
      append({
        language: available[0],
        code: getSampleTemplate(title, available[0], "starter"),
      });
    }
  };

  return (
    <div className="bg-[#fcfcfd]/70 dark:bg-[#0c0c0e]/95 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none">
      <div className="flex items-center justify-between mb-5 border-b border-zinc-150 dark:border-zinc-850 pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-amber-500" />
          <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
            04 // Starter Code Snippet Templates
          </h3>
        </div>
        <button
          type="button"
          disabled={disabled || activeSnippets.length >= SUPPORTED_LANGUAGES.length}
          onClick={addSnippet}
          className="font-mono text-[9px] font-black uppercase tracking-tight bg-amber-500 hover:bg-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-550/20 text-zinc-955 dark:text-amber-500 border border-amber-550 dark:border-amber-500/25 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-md shadow-amber-500/5 dark:shadow-none"
        >
          <Plus className="h-3.5 w-3.5" /> Add Template
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-xl font-mono text-[10px] text-zinc-450 dark:text-zinc-555 uppercase tracking-widest">
            NO STARTER TEMPLATES ADDED. CANDIDATES WILL HAVE NO CODE TO BEGIN.
          </div>
        )}

        {fields.map((field, idx) => {
          const snippetErrors = errors.codeSnippets?.[idx];
          const availableLangs = getAvailableLanguages(idx);
          const snippetCode = watch(`codeSnippets.${idx}.code`) || "";

          return (
            <div
              key={field.id}
              className="border border-zinc-200/80 dark:border-zinc-900/80 rounded-xl p-4 bg-[#fcfcfd]/40 dark:bg-[#08080a] flex flex-col gap-3 relative hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-200"
            >
              {/* Header Selector */}
              <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900/60 pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400">
                    Template Lang:
                  </span>
                  <select
                    disabled={disabled}
                    {...register(`codeSnippets.${idx}.language` as const, {
                      onChange: (e) => {
                        const selectedLang = e.target.value as Language;
                        setValue(`codeSnippets.${idx}.code`, getSampleTemplate(title, selectedLang, "starter"));
                      },
                    })}
                    className="font-mono text-[10px] font-bold uppercase tracking-tight px-2.5 py-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-855 rounded-md focus:outline-none focus:border-amber-500 text-zinc-800 dark:text-zinc-200 cursor-pointer transition-colors duration-150"
                  >
                    <option value={field.language}>{field.language}</option>
                    {availableLangs.filter((lang) => lang !== field.language).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <span className="font-mono text-[8px] text-zinc-400 dark:text-zinc-650 uppercase">
                    // Template updates on selection
                  </span>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(idx)}
                  className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove template"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Monospace Code Editor */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[8.5px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-555">
                  Boilerplate Solution Code Area
                </label>
                <div className="relative border border-zinc-200 dark:border-[#141418] rounded-xl overflow-hidden shadow-inner">
                  <div className={`${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-950 border-zinc-800/80"} px-4 py-2 border-b flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-tight select-none`}>
                    <span>CODE_TEMPLATE_SHELL // MONACO_ACTIVE</span>
                    <span className="text-amber-500/80 font-bold uppercase">{field.language} MODE</span>
                  </div>
                  <Editor
                    height="240px"
                    language={mapLanguageToMonaco(field.language)}
                    theme={monacoTheme}
                    value={snippetCode}
                    onChange={(val) => setValue(`codeSnippets.${idx}.code`, val || "")}
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
                {snippetErrors?.code && (
                  <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 font-bold">
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
