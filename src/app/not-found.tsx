import React from "react";
import Link from "next/link";
import { Terminal, Home, ArrowRight, CornerDownLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-4 sm:px-6 relative transition-colors duration-300">
      
      {/* Background visual spotlight glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04),transparent_60%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center">
        
        {/* Error Flag Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/[0.04] text-[10px] font-bold font-mono tracking-wider text-red-500 uppercase mb-6 select-none shadow-sm shadow-red-500/5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          <span>Runtime Error: 404</span>
        </div>

        {/* Big Code Header */}
        <h1 className="text-7xl sm:text-8xl font-black font-mono tracking-tighter bg-gradient-to-b from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-800 bg-clip-text text-transparent leading-none">
          404
        </h1>
        
        <h2 className="mt-4 text-xl sm:text-2xl font-bold font-sans tracking-tight text-zinc-800 dark:text-zinc-200">
          Solution Not Found
        </h2>
        
        <p className="mt-4 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-md">
          The algorithm compiling this route could not trace the requested address. The pointer is referencing an out-of-bounds index.
        </p>

        {/* Interactive Mock terminal output panel */}
        <div className="w-full mt-10 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/40 p-4 sm:p-5 font-mono text-xs text-left text-zinc-500 dark:text-zinc-400 shadow-md">
          <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800/80 pb-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-red-500/80" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
            <div className="h-2 w-2 rounded-full bg-green-500/80" />
            <span className="ml-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase">stack_trace_dump.log</span>
          </div>
          <div className="space-y-1.5 text-[11px] sm:text-xs overflow-x-auto">
            <p className="text-zinc-400 dark:text-zinc-650">// Pointer lookup mismatch</p>
            <p className="text-zinc-800 dark:text-zinc-200">$ algorush debug --route-pointer=active</p>
            <p className="text-red-500 font-semibold">&gt; FatalError: INDEX_OUT_OF_BOUNDS (0x7FFF0404)</p>
            <p className="text-zinc-500">&gt; Frame 0: PageResolver.find_route() -&gt; failed to resolve route</p>
            <p className="text-zinc-500">&gt; Frame 1: RootRouter.match() -&gt; returned status code: 404</p>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold font-mono text-zinc-950 hover:bg-amber-400 transition-all select-none shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span>Return to Terminal</span>
            <CornerDownLeft className="h-3.5 w-3.5 opacity-60 group-hover:-translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/problems"
            className="group flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950/60 px-6 py-3 text-sm font-bold font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all select-none cursor-pointer w-full sm:w-auto"
          >
            <Terminal className="h-4 w-4" />
            <span>View Problem Sets</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
