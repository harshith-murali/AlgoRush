import React from "react";

export function AlgoRushLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon representing a racing/rushing terminal cursor and brackets */}
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/35 bg-zinc-950 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-colors duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4.5 w-4.5"
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
      </div>
      <span className="font-mono text-lg font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">
        Algo<span className="text-amber-500">Rush</span>
      </span>
    </div>
  );
}
