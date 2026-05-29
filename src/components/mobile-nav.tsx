"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Terminal, Trophy, Users, BookOpen, ShieldAlert, X, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface MobileNavProps {
  isAdminUser: boolean;
}

export function MobileNav({ isAdminUser }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden">
      {/* Trigger Button */}
      <button
        onClick={toggleMenu}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer select-none"
        aria-label="Open mobile navigation"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[280px] border-l border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-150 dark:border-zinc-900">
          <span className="font-mono text-sm font-bold tracking-tight text-zinc-800 dark:text-zinc-200 uppercase">
            Navigation
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={closeMenu}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2.5 mt-6">
          <Link
            href="/problems"
            onClick={closeMenu}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold font-mono transition-all ${
              isActive("/problems")
                ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Problems</span>
          </Link>

          <Link
            href="/contests"
            onClick={closeMenu}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold font-mono transition-all ${
              isActive("/contests")
                ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Contests</span>
          </Link>

          <Link
            href="/leaderboard"
            onClick={closeMenu}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold font-mono transition-all ${
              isActive("/leaderboard")
                ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>

          <Link
            href="/discuss"
            onClick={closeMenu}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold font-mono transition-all ${
              isActive("/discuss")
                ? "bg-zinc-100 dark:bg-zinc-900 text-amber-500 border border-zinc-200 dark:border-zinc-800"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Discuss</span>
          </Link>

          {/* Admin gate */}
          {isAdminUser && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold font-mono transition-all border border-red-500/10 ${
                isActive("/admin")
                  ? "bg-red-50 dark:bg-red-950/20 text-red-500 border-red-500/30"
                  : "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Admin Control</span>
            </Link>
          )}
        </nav>

        {/* Auth CTA for mobile */}
        <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-zinc-150 dark:border-zinc-900">
          <Show when="signed-out">
            <div className="flex flex-col gap-2">
              <SignInButton mode="modal">
                <button
                  onClick={closeMenu}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 text-xs font-semibold font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer select-none"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={closeMenu}
                  className="w-full rounded-lg bg-amber-500 py-2 text-xs font-semibold font-mono text-zinc-950 hover:bg-amber-400 cursor-pointer select-none shadow-md shadow-amber-500/10"
                >
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
