"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlgoRushLogo } from "@/components/logo/algo-rush-logo";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Terminal, Trophy, Users, BookOpen, ShieldAlert, Flame, Settings, BarChart4, FolderKanban } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { UserRole } from "@/lib/roles";

interface NavbarProps {
  userRole: UserRole;
}

export function Navbar({ userRole }: NavbarProps) {
  const pathname = usePathname();
  const isAdmin = userRole === "admin";

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-900 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <AlgoRushLogo />
          </Link>

          {/* Desktop Navigation Links (Role-driven) */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAdmin ? (
              // Normal User Links
              <>
                <Link
                  href="/problems"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/problems")
                      ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Problems</span>
                </Link>

                <Link
                  href="/contests"
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/contests")
                      ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Contests</span>
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                </Link>

                <Link
                  href="/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/leaderboard")
                      ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Leaderboard</span>
                </Link>

                <Link
                  href="/discuss"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/discuss")
                      ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Discuss</span>
                </Link>
              </>
            ) : (
              // Admin-Specific Links
              <>
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/admin")
                      ? "bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-200 dark:border-red-950/40"
                      : "text-red-550 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Admin Dashboard</span>
                </Link>

                <Link
                  href="/admin/problems"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/admin/problems")
                      ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <FolderKanban className="h-3.5 w-3.5" />
                  <span>Manage Problems</span>
                </Link>

                <Link
                  href="/admin/users"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/admin/users")
                      ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Users Control</span>
                </Link>

                <Link
                  href="/admin/analytics"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all duration-200 ${
                    isActive("/admin/analytics")
                      ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <BarChart4 className="h-3.5 w-3.5" />
                  <span>Analytics</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right: Auth & theme toggles */}
        <div className="flex items-center gap-3">
          {/* Flame streak indicator */}
          {!isAdmin && (
            <Show when="signed-in">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-500/20 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 select-none shadow-sm">
                <Flame className="h-3.5 w-3.5 fill-orange-500/80 dark:fill-orange-400" />
                <span className="font-mono text-[10px] font-bold">7 Day Streak</span>
              </div>
            </Show>
          )}

          {/* Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Clerk Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-1.5 text-xs font-semibold font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all select-none cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold font-mono text-zinc-950 hover:bg-amber-400 transition-all select-none shadow-md shadow-amber-500/10 cursor-pointer">
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-amber-500/50 transition-colors",
                  }
                }}
              />
            </Show>
          </div>

          {/* Mobile Navigation Drawer */}
          <MobileNav isAdminUser={isAdmin} />
        </div>
      </div>
    </header>
  );
}
