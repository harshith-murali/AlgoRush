import { CreateProblemForm } from "@/components/admin/create-problem-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Problem",
  description: "Register and validate new practice problems.",
};

export default function CreateProblemPage() {
  return (
    <div className="w-full">
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <h2 className="text-base font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="text-red-500 animate-pulse">&gt;</span> REGISTRY_PROBLEM_SEQUENCE
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-tight">
          Define starter templates, assertions test suite, and reference solutions. Judge0 execution verification is required before db transaction.
        </p>
      </div>
      <CreateProblemForm />
    </div>
  );
}
