"use client";

import React from "react";
import { Terminal, Shield } from "lucide-react";

interface AuthCardShellProps {
  children: React.ReactNode;
}

export function AuthCardShell({ children }: AuthCardShellProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Dynamic Header Security Details */}
      <div className="w-full mb-4 flex items-center justify-between font-mono text-[8px] uppercase tracking-wider text-zinc-550 dark:text-zinc-500 border-b border-zinc-900/60 pb-2 select-none">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-amber-500 animate-pulse" />
          <span>SECURITY_LEVEL: ACTIVE</span>
        </div>
        <div className="flex items-center gap-1">
          <Terminal className="h-3 w-3" />
          <span>NODE: SECURE_ONBOARD</span>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="w-full bg-[#09090b] border border-zinc-900/60 rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
        {/* Minimal border accent detail */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0" />
        
        {/* Child Form (Clerk) */}
        {children}
      </div>
    </div>
  );
}
