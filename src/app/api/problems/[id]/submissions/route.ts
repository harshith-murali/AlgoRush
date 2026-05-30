import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

async function parseProgramId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const programId = Number(id);
  if (isNaN(programId) || !Number.isInteger(programId) || programId <= 0) {
    return { error: NextResponse.json({ error: "Invalid problem ID" }, { status: 400 }) };
  }
  return { programId };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const parsedId = await parseProgramId(params);
    if ("error" in parsedId) return parsedId.error;
    const { programId } = parsedId;

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User profile not synced yet" }, { status: 404 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        userId: dbUser.id,
        programId: programId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        language: true,
        code: true,
        status: true,
        runtimeMs: true,
        memoryKb: true,
        passedTestCases: true,
        totalTestCases: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("GET /api/problems/[id]/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
