import React from "react";
import { Navbar } from "@/components/navbar";
import { UserRole } from "@/lib/roles";
import { ShieldAlert, Terminal, AlertTriangle } from "lucide-react";

interface AppLayoutProps {
  userRole: UserRole;
  children: React.ReactNode;
}

export function AppLayout({ userRole, children }: AppLayoutProps) {
  const isAdmin = userRole === "admin";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* 1. Navbar: Receives userRole prop derived from Server Component parent */}
      <Navbar userRole={userRole} />

      {/* 2. Admin System Banner */}
      {isAdmin && (
        <div className="relative z-40 w-full bg-red-500/10 border-b border-red-500/20 text-red-550 dark:text-red-400 py-1.5 px-4 text-center font-mono text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 select-none">
          <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
          <span>System Administrator Control Shell</span>
          <span className="hidden sm:inline border border-red-500/30 rounded px-1 text-[8px] bg-red-500/10">Edge Security Active</span>
        </div>
      )}

      {/* 3. Role-driven Layout Shell */}
      {isAdmin ? (
        // Admin Page Chrome
        <div className="flex-1 w-full bg-zinc-50/30 dark:bg-zinc-950/20 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-900">
              <div>
                <span className="font-mono text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">
                  Admin System Mode
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
                  Console Control Shell
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-550 dark:text-zinc-450 border border-zinc-200 dark:border-zinc-900 rounded-lg p-2 bg-white dark:bg-zinc-950">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Production Environment</span>
              </div>
            </div>
            {children}
          </div>
        </div>
      ) : (
        // User/Practice Page Chrome
        <div className="flex-1 w-full bg-white dark:bg-zinc-950 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
