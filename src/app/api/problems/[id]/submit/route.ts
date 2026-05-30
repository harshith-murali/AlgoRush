import { NextRequest, NextResponse } from "next/server";
import { Language } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import type { ProblemRunResponse } from "@/types/problem";

function parseProgramId(id: string) {
  const programId = Number(id);
  if (!Number.isInteger(programId) || programId <= 0) return null;
  return programId;
}

function parseLanguage(value: unknown): Language | null {
  if (typeof value !== "string") return null;
  return Object.values(Language).includes(value as Language) ? (value as Language) : null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const programId = parseProgramId(id);
    if (!programId) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    const body = (await request.json()) as { language?: unknown; code?: unknown };
    const language = parseLanguage(body.language);
    if (!language || typeof body.code !== "string" || body.code.trim().length === 0) {
      return NextResponse.json({ error: "Invalid submission payload" }, { status: 400 });
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: {
        id: true,
        testCases: {
          select: {
            id: true,
            isHidden: true,
            isSample: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const response: ProblemRunResponse = {
      status: "UNAVAILABLE",
      message:
        "Submission was received, but Judge0 execution is not connected yet. Hidden judge cases remain server-side.",
      results: [
        {
          testCaseId: 0,
          label: "Judge",
          input: "",
          expectedOutput: "",
          actualOutput: null,
          status: "UNAVAILABLE",
          message: `${program.testCases.length} judge case${
            program.testCases.length === 1 ? "" : "s"
          } are available on the server and were not exposed to the client.`,
        },
      ],
    };

    return NextResponse.json(response, { status: 202 });
  } catch (error) {
    console.error("POST /api/problems/[id]/submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
