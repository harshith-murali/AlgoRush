import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const solvedProblems = await prisma.solvedProblem.findMany({
      where: { userId: dbUser.id },
      include: {
        program: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        solvedAt: "desc",
      },
    });

    const response = solvedProblems.map((sp) => ({
      id: sp.program.id,
      title: sp.program.title,
      difficulty: sp.program.difficulty,
      solvedAt: sp.solvedAt,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/me/solved-problems error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
