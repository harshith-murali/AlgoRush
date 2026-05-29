import React from "react";
import { Terminal, Award, BarChart3, Shield, Zap, Sparkles, ArrowUpRight } from "lucide-react";

export function Features() {
  const items = [
    {
      icon: Terminal,
      title: "Interactive Sandbox",
      description: "Write, trace, and debug solutions in our high-performance sandbox with active performance visualizers and memory stack tracing.",
      index: "01"
    },
    {
      icon: Award,
      title: "Contest Arenas",
      description: "Engage in timed contests, solve live-ranking algorithmic challenges, and climb the Leaderboard vs. global engineers.",
      index: "02"
    },
    {
      icon: BarChart3,
      title: "Cognitive Metrics",
      description: "Get detailed telemetry on execution times, spatial complexities, code size metrics, and analytical runtime beat-ratios.",
      index: "03"
    },
    {
      icon: Zap,
      title: "Active Learning Tracks",
      description: "Our hand-selected progression tracks map to exact DSA paradigms (sliding windows, tree graphs, dynamic programming).",
      index: "04"
    },
    {
      icon: Shield,
      title: "Interview Simulations",
      description: "Simulate rigorous company-specific technical rounds under pressure with exact timers and simulated interviewer queries.",
      index: "05"
    },
    {
      icon: Sparkles,
      title: "Intelligent Feedback",
      description: "Identify hidden logic bottlenecks, infinite recursive structures, and edge-case exceptions immediately upon test execution.",
      index: "06"
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-300">
      
      {/* Premium ambient radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.04),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/[0.01] dark:bg-amber-500/[0.02] blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/10 dark:border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-bold font-mono tracking-wider text-amber-600 dark:text-amber-500 uppercase mb-4 select-none">
            <Sparkles className="h-3 w-3" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-100 font-sans leading-tight">
            Engineered for <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Structural Skill Building</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-medium leading-relaxed">
            Algo-Rush bypasses generic SaaS templates, delivering high-fidelity performance metrics, custom arena pressure, and immediate logical feedback.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:bg-zinc-50/50 dark:hover:bg-zinc-900 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-none transition-all duration-300 ease-out cursor-default"
              >
                {/* Micro-light bar indicator on top border */}
                <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/50 transition-all duration-500" />

                {/* Tech specifications ID indicator */}
                <div className="absolute top-6 right-6 font-mono text-[10px] font-semibold text-zinc-350 dark:text-zinc-650 tracking-wider select-none">
                  /{item.index}
                </div>

                <div className="flex flex-col gap-5">
                  {/* Icon Container */}
                  <div className="flex h-11 w-11 shrink-0 self-start items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/[0.06] text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/40 transition-all duration-300 shadow-sm shadow-amber-500/5">
                    <Icon className="h-5.5 w-5.5 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  
                  {/* Title & Desc Container */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 font-sans tracking-tight uppercase flex items-center gap-1">
                      <span>{item.title}</span>
                      <ArrowUpRight className="h-3 w-3 text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </h3>
                    
                    {/* Description */}
                    <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Muted background spot glow inside card */}
                <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-amber-500/[0.01] dark:bg-amber-500/[0.02] blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
