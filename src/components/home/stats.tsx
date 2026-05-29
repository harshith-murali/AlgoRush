import React from "react";
import { Terminal, Users, Trophy, GraduationCap } from "lucide-react";

export function Stats() {
  const stats = [
    {
      icon: Terminal,
      value: "1,250+",
      label: "Problems to Solve",
      description: "From basic array traversals to advanced dynamic programming paradigms.",
      accent: "from-amber-500/20 to-transparent",
    },
    {
      icon: Users,
      value: "84k+",
      label: "Active Coders",
      description: "Ambitious software engineers practicing, competing, and optimizing today.",
      accent: "from-orange-500/20 to-transparent",
    },
    {
      icon: Trophy,
      value: "24/7",
      label: "Live Contests",
      description: "Instant competitive arena matchmaking to battle against other developers.",
      accent: "from-amber-600/20 to-transparent",
    },
    {
      icon: GraduationCap,
      value: "14",
      label: "Interview Tracks",
      description: "Curated learning paths mapped to exact technical loop standards.",
      accent: "from-orange-600/20 to-transparent",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 sm:p-8 hover:border-amber-500/30 dark:hover:border-amber-500/20 hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
              >
                {/* Visual subtle card glow */}
                <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${stat.accent} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    {/* Icon wrapper */}
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-colors">
                      <Icon className="h-5.5 w-5.5" />
                    </div>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                        {stat.value}
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 font-sans tracking-tight uppercase">
                      {stat.label}
                    </h3>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-medium">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
