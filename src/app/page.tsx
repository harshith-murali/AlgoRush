import React from "react";
import { onBoardUser } from "@modules/auth/actions";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { ProblemCategories } from "@/components/home/problem-categories";
import { Features } from "@/components/home/features";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Sync the authenticated Clerk user into the PostgreSQL database silently on load
  await onBoardUser();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="flex-1">
        {/* Homepage Hero with premium light mode dotted background */}
        <Hero />
        
        {/* Polished Stats Section */}
        <Stats />

        {/* DSA Problem Categories Showcase */}
        <ProblemCategories />

        {/* Platform Capabilities List */}
        <Features />
      </main>

      {/* Landing Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-8 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>&copy; {new Date().getFullYear()} Algo-Rush. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="/support" className="hover:text-amber-500 transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
