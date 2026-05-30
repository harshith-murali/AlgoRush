"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { Difficulty } from "@/generated/prisma";
import { Hash, X } from "lucide-react";

interface SectionProps {
  disabled?: boolean;
}

export function BasicInfoSection({ disabled }: SectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProblemFormValues>();

  const tags = watch("tags") || [];
  const [tagInput, setTagInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().replace(/,/g, "");
      if (value && !tags.includes(value)) {
        setValue("tags", [...tags, value], { shouldValidate: true });
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setValue(
      "tags",
      tags.filter((_, index) => index !== indexToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <div className="bg-[#fcfcfd]/70 dark:bg-[#0c0c0e]/95 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none">
      <div className="flex items-center gap-2 mb-5 border-b border-zinc-150 dark:border-zinc-850 pb-3">
        <Hash className="h-4 w-4 text-amber-500" />
        <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
          01 // Basic Problem Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Title Field */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Problem Title
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="e.g. Invert a Binary Tree"
            {...register("title")}
            className="w-full font-mono text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 rounded-lg text-zinc-850 dark:text-zinc-250 placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 transition-all duration-200 shadow-inner"
          />
          {errors.title && (
            <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
              [CRITICAL] {errors.title.message}
            </span>
          )}
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Complexity Level
          </label>
          <select
            disabled={disabled}
            {...register("difficulty")}
            className="w-full font-mono text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 rounded-lg text-zinc-850 dark:text-zinc-250 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 transition-all duration-200 cursor-pointer shadow-inner"
          >
            <option value={Difficulty.EASY}>EASY</option>
            <option value={Difficulty.MEDIUM}>MEDIUM</option>
            <option value={Difficulty.HARD}>HARD</option>
          </select>
          {errors.difficulty && (
            <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
              [CRITICAL] {errors.difficulty.message}
            </span>
          )}
        </div>

        {/* Tags manager */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            Problem Categorization Tags
            <span className="text-[7.5px] text-zinc-400 dark:text-zinc-550 font-normal normal-case">
              (Press enter or comma to register tag)
            </span>
          </label>
          
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 rounded-lg min-h-[46px] items-center transition-all duration-200 shadow-inner">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="font-mono text-[8.5px] font-bold uppercase tracking-tight bg-zinc-150 dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 border border-zinc-250 dark:border-zinc-800/80 px-2.5 py-1 rounded flex items-center gap-1.5 select-none transition-all"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  disabled={disabled}
                  className="hover:text-red-500 cursor-pointer transition-colors duration-150 p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            
            <input
              type="text"
              disabled={disabled}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? "Add tags..." : ""}
              className="flex-1 font-mono text-xs bg-transparent border-none outline-none min-w-[120px] focus:ring-0 p-0 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-450 dark:placeholder:text-zinc-600"
            />
          </div>
          {errors.tags && (
            <span className="font-mono text-[8px] text-red-500 uppercase mt-0.5 tracking-tight font-bold">
              [CRITICAL] {errors.tags.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
