import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { SubmissionStatus, Difficulty } from "@prisma/client";
import { calculateStreak } from "@/lib/problems/streak";

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, xp: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Get timezone offset query parameter (minutes from UTC), default to 0
    const searchParams = request.nextUrl.searchParams;
    const tzOffset = Number(searchParams.get("tzOffset") || "0");
    const todayStr = searchParams.get("today") || new Date().toISOString().split("T")[0];

    // 1. Fetch all successful submissions for streak and active days
    const successfulSubmissions = await prisma.submission.findMany({
      where: {
        userId: dbUser.id,
        status: SubmissionStatus.PASS,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group submission dates to unique YYYY-MM-DD local strings
    const uniqueDatesSet = new Set<string>();
    successfulSubmissions.forEach((sub) => {
      // Adjust timezone offset (tzOffset is in minutes, e.g. -330 for GMT+5:30)
      const localTime = new Date(sub.createdAt.getTime() - tzOffset * 60 * 1000);
      const dateStr = localTime.toISOString().split("T")[0];
      uniqueDatesSet.add(dateStr);
    });

    const sortedSolveDates = Array.from(uniqueDatesSet).sort();
    const { currentStreak, longestStreak } = calculateStreak(sortedSolveDates, todayStr);

    // 2. Fetch solved problems difficulty breakdown
    const solvedProblems = await prisma.solvedProblem.findMany({
      where: { userId: dbUser.id },
      include: {
        program: {
          select: {
            difficulty: true,
          },
        },
      },
    });

    const solvedCounts = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    };

    solvedProblems.forEach((sp) => {
      if (sp.program.difficulty in solvedCounts) {
        solvedCounts[sp.program.difficulty as keyof typeof solvedCounts]++;
      }
    });

    // 3. Fetch total problem counts in the database
    const totalProblemsGroupBy = await prisma.program.groupBy({
      by: ["difficulty"],
      _count: {
        id: true,
      },
    });

    const totalCounts = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    };

    totalProblemsGroupBy.forEach((group) => {
      if (group.difficulty in totalCounts) {
        totalCounts[group.difficulty as keyof typeof totalCounts] = group._count.id;
      }
    });

    // Update user's streak in PostgreSQL database asynchronously so it remains persistent
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        streak: currentStreak,
      },
    });

    return NextResponse.json({
      xp: dbUser.xp,
      streak: {
        current: currentStreak,
        longest: longestStreak,
      },
      solved: {
        total: solvedProblems.length,
        easy: solvedCounts.EASY,
        medium: solvedCounts.MEDIUM,
        hard: solvedCounts.HARD,
      },
      totalProblems: {
        total: totalCounts.EASY + totalCounts.MEDIUM + totalCounts.HARD,
        easy: totalCounts.EASY,
        medium: totalCounts.MEDIUM,
        hard: totalCounts.HARD,
      },
      activeDays: sortedSolveDates.length,
    });
  } catch (error) {
    console.error("GET /api/me/progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
