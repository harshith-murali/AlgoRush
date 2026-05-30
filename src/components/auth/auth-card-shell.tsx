"use client";

import React, { useEffect, useState } from "react";
import { Shield, Terminal } from "lucide-react";
import { useTheme } from "next-themes";

interface AuthCardShellProps {
  children: React.ReactNode;
}

export function AuthCardShell({ children }: AuthCardShellProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authTheme = mounted && resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className="w-full min-w-0 flex flex-col items-stretch">
      {/* Security status bar */}
      <div className="w-full min-w-0 mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[8px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/60 pb-2 select-none">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-amber-500 animate-pulse" />
          <span>SECURITY_LEVEL: ACTIVE</span>
        </div>
        <div className="flex items-center gap-1">
          <Terminal className="h-3 w-3" />
          <span>NODE: SECURE_ONBOARD</span>
        </div>
      </div>

      {/* Auth card container */}
      <div className="w-full min-w-0 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative transition-colors duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 group">
        {/* Top amber gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0" />

        <div className="clerk-auth-form w-full min-w-0" data-auth-theme={authTheme}>
          {children}
        </div>
      </div>
    </div>
  );
}
