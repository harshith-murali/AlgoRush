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

    const body = (await request.json()) as {
      language?: unknown;
      code?: unknown;
      testCaseId?: unknown;
    };
    const language = parseLanguage(body.language);
    if (!language || typeof body.code !== "string" || body.code.trim().length === 0) {
      return NextResponse.json({ error: "Invalid execution payload" }, { status: 400 });
    }

    const selectedTestCaseId =
      typeof body.testCaseId === "number" && Number.isInteger(body.testCaseId)
        ? body.testCaseId
        : null;

    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: {
        id: true,
        testCases: {
          where: {
            isSample: true,
            isHidden: false,
            ...(selectedTestCaseId ? { id: selectedTestCaseId } : {}),
          },
          orderBy: { order: "asc" },
          select: {
            id: true,
            input: true,
            expectedOutput: true,
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
        "Execution service is ready to connect. Judge0 is not wired for this workspace yet, so no code was executed.",
      results: program.testCases.map((testCase, index) => ({
        testCaseId: testCase.id,
        label: `Case ${index + 1}`,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        status: "UNAVAILABLE",
        message: "Sample testcase loaded. Connect Judge0 here to execute user code.",
      })),
    };

    return NextResponse.json(response, { status: 202 });
  } catch (error) {
    console.error("POST /api/problems/[id]/run error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
