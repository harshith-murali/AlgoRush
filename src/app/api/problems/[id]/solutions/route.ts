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

    // Require auth — solutions are behind a sign-in gate
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true },
    });

    if (!program) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const solutions = await prisma.solution.findMany({
      where: { programId },
      orderBy: { language: "asc" },
      select: {
        id: true,
        language: true,
        code: true,
        explanation: true,
      },
    });

    return NextResponse.json({ solutions }, { status: 200 });
  } catch (error) {
    console.error("GET /api/problems/[id]/solutions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
