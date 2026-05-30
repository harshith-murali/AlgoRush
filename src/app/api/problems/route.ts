import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeAcceptanceRate } from "@/lib/problems/utils";
import type { ProblemListItem, ProblemsListResponse } from "@/types/problem";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: [{ difficulty: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
        totalSubmissions: true,
        totalAccepted: true,
        likes: true,
        dislikes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const problems: ProblemListItem[] = programs.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      tags: p.tags,
      totalSubmissions: p.totalSubmissions,
      totalAccepted: p.totalAccepted,
      acceptanceRate: computeAcceptanceRate(p.totalSubmissions, p.totalAccepted),
      likes: p.likes,
      dislikes: p.dislikes,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    const body: ProblemsListResponse = {
      problems,
      total: problems.length,
    };

    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.error("GET /api/problems error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
