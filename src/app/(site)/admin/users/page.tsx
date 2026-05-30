import React from "react";
import { prisma } from "@/lib/db";
import { Users, Shield, Award, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Users",
};

export default async function UsersControlPage() {
  // Query all registered users from PostgreSQL
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-500" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            01-02 // Candidate & Administrator Profiles List
          </h3>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto w-full">
        {users.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg font-mono text-[10px] text-zinc-400">
            NO USERS REGISTERED IN DATABASE.
          </div>
        ) : (
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-900 font-mono text-[10px] text-zinc-500 uppercase font-bold select-none">
                <th className="py-2.5 px-3">Username / Email</th>
                <th className="py-2.5 px-3 w-28">Authority Role</th>
                <th className="py-2.5 px-3 w-28 text-center">XP Points</th>
                <th className="py-2.5 px-3 w-28 text-center">Streak Days</th>
                <th className="py-2.5 px-3 w-32">Created At</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-755 dark:text-zinc-350">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-150 dark:border-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors"
                >
                  {/* Username / Email */}
                  <td className="py-3 px-3 flex flex-col gap-0.5">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {u.username || "unnamed_candidate"}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-450">{u.email}</span>
                  </td>
                  {/* Role */}
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${
                        u.role === "ADMIN"
                          ? "text-red-500 bg-red-500/10 border-red-500/20"
                          : "text-zinc-650 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  {/* XP Points */}
                  <td className="py-3 px-3 font-mono text-[10px] text-center text-zinc-800 dark:text-zinc-300 font-bold">
                    {u.xp}
                  </td>
                  {/* Streak */}
                  <td className="py-3 px-3 font-mono text-[10px] text-center text-zinc-800 dark:text-zinc-300">
                    🔥 {u.streak}
                  </td>
                  {/* Date Created */}
                  <td className="py-3 px-3 font-mono text-[10px] text-zinc-450">
                    {u.createdAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
