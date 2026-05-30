"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Clock3, FileText, Send } from "lucide-react";
import type React from "react";

export type ProblemInfoTab = "description" | "editorial" | "solutions" | "submissions";

const tabs: Array<{
  value: ProblemInfoTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "description", label: "Description", icon: BookOpen },
  { value: "editorial", label: "Editorial", icon: FileText },
  { value: "solutions", label: "Solutions", icon: Send },
  { value: "submissions", label: "Submissions", icon: Clock3 },
];

interface ProblemTabsProps {
  activeTab: ProblemInfoTab;
  onChange: (tab: ProblemInfoTab) => void;
}

export function ProblemTabs({ activeTab, onChange }: ProblemTabsProps) {
  return (
    <div className="flex min-h-11 items-center gap-1 overflow-x-auto border-b border-zinc-200 bg-white px-2 dark:border-zinc-800 dark:bg-zinc-950">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 font-mono text-[10px] font-bold uppercase transition-colors",
              active
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
