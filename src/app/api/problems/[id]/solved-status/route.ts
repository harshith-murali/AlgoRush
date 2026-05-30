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

/**
 * GET /api/problems/[id]/solved-status
 * Returns { solved: boolean } for the currently authenticated user.
 * Returns { solved: false } for unauthenticated requests (no 401).
 */
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
      return NextResponse.json({ solved: false }, { status: 200 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ solved: false }, { status: 200 });
    }

    const solved = await prisma.solvedProblem.findUnique({
      where: {
        userId_programId: {
          userId: dbUser.id,
          programId,
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ solved: !!solved }, { status: 200 });
  } catch (error) {
    console.error("GET /api/problems/[id]/solved-status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
