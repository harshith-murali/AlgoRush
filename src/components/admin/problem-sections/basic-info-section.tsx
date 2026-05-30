"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateProblemFormValues } from "../create-problem-form";
import { Difficulty } from "@/generated/prisma";
import { Hash, X, Info } from "lucide-react";

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
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-150 dark:border-zinc-900 pb-2">
        <Hash className="h-4 w-4 text-amber-500" />
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
          01 // Basic Problem Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Title Field */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
            Problem Title
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="e.g. Invert a Binary Tree"
            {...register("title")}
            className="w-full font-sans text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors"
          />
          {errors.title && (
            <span className="font-mono text-[9px] text-red-500 uppercase">{errors.title.message}</span>
          )}
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">
            Complexity Level
          </label>
          <select
            disabled={disabled}
            {...register("difficulty")}
            className="w-full font-mono text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value={Difficulty.EASY}>EASY</option>
            <option value={Difficulty.MEDIUM}>MEDIUM</option>
            <option value={Difficulty.HARD}>HARD</option>
          </select>
          {errors.difficulty && (
            <span className="font-mono text-[9px] text-red-500 uppercase">{errors.difficulty.message}</span>
          )}
        </div>

        {/* Tags manager */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400 flex items-center gap-1.5">
            Problem Categorization Tags
            <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-normal normal-case">
              (Press enter or comma to register tag)
            </span>
          </label>
          
          <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md min-h-[42px] items-center">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="font-mono text-[9px] font-bold uppercase tracking-tight bg-zinc-200 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded flex items-center gap-1"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  disabled={disabled}
                  className="hover:text-red-500 cursor-pointer"
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
              className="flex-1 font-sans text-xs bg-transparent border-none outline-none min-w-[120px] focus:ring-0 p-0"
            />
          </div>
          {errors.tags && (
            <span className="font-mono text-[9px] text-red-500 uppercase">{errors.tags.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
