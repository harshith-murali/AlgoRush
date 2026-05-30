import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { SubmissionStatus } from "@/generated/prisma";

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

    const searchParams = request.nextUrl.searchParams;
    const tzOffset = Number(searchParams.get("tzOffset") || "0");

    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    // Fetch all successful submissions in the last year
    const submissions = await prisma.submission.findMany({
      where: {
        userId: dbUser.id,
        status: SubmissionStatus.PASS,
        createdAt: {
          gte: oneYearAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group counts by YYYY-MM-DD
    const countsMap: Record<string, number> = {};

    submissions.forEach((sub) => {
      // Adjust timezone offset (tzOffset is in minutes)
      const localTime = new Date(sub.createdAt.getTime() - tzOffset * 60 * 1000);
      const dateStr = localTime.toISOString().split("T")[0];
      countsMap[dateStr] = (countsMap[dateStr] || 0) + 1;
    });

    const response = Object.entries(countsMap).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/me/solve-calendar error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
