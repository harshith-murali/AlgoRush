import { ProblemsListClient } from "@/components/problems/problems-list-client";
import { Terminal } from "lucide-react";

export const metadata = {
  title: "Problems — AlgoRush",
  description: "Browse coding interview problems on AlgoRush.",
};

export default function ProblemsPage() {
  return (
    <div className="flex flex-col gap-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="h-5 w-5 text-amber-500" />
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-500">
            // Problem Arena
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Practice Problems
        </h1>
        <p className="mt-2 font-mono text-[11px] text-zinc-500 uppercase tracking-wider max-w-2xl">
          Curated challenges from the Algo-Rush registry. Select a problem to read the full statement and start coding.
        </p>
      </div>

      <ProblemsListClient />
    </div>
  );
}
