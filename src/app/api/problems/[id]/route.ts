import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { computeAcceptanceRate } from "@/lib/problems/utils";
import { Difficulty, Language, UserRole } from "@/generated/prisma";

async function requireAdmin() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    select: { id: true, role: true },
  });

  if (!dbUser || dbUser.role !== UserRole.ADMIN) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { dbUser };
}

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

    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        tags: true,
        input: true,
        output: true,
        explanation: true,
        constraints: true,
        hints: true,
        editorial: true,
        totalSubmissions: true,
        totalAccepted: true,
        likes: true,
        dislikes: true,
        createdAt: true,
        updatedAt: true,
        testCases: {
          where: { isSample: true, isHidden: false },
          orderBy: { order: "asc" },
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            explanation: true,
            order: true,
          },
        },
        codeSnippets: {
          orderBy: { language: "asc" },
          select: {
            language: true,
            code: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        problem: {
          id: program.id,
          title: program.title,
          description: program.description,
          difficulty: program.difficulty,
          tags: program.tags,
          input: program.input,
          output: program.output,
          explanation: program.explanation,
          constraints: program.constraints,
          hints: program.hints,
          editorial: program.editorial,
          totalSubmissions: program.totalSubmissions,
          totalAccepted: program.totalAccepted,
          acceptanceRate: computeAcceptanceRate(
            program.totalSubmissions,
            program.totalAccepted
          ),
          likes: program.likes,
          dislikes: program.dislikes,
          sampleTestCases: program.testCases,
          codeSnippets: program.codeSnippets,
          createdAt: program.createdAt.toISOString(),
          updatedAt: program.updatedAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/problems/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Validation schema ─────────────────────────────────────────────────────────
const updateProblemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.nativeEnum(Difficulty),
  tags: z.array(z.string().min(1)).min(1),
  input: z.string().min(1),
  output: z.string().min(1),
  explanation: z.string().min(1),
  constraints: z.string().min(1),
  hints: z.string().optional().nullable(),
  editorial: z.string().optional().nullable(),
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().default(false),
      isHidden: z.boolean().default(true),
      explanation: z.string().optional().nullable(),
      order: z.number().default(0),
    })
  ).min(1),
  codeSnippets: z.array(
    z.object({
      language: z.nativeEnum(Language),
      code: z.string().min(1),
    })
  ).min(1),
  solutions: z.record(z.string(), z.string().min(1)),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const parsedId = await parseProgramId(params);
    if ("error" in parsedId) return parsedId.error;
    const { programId } = parsedId;

    // Verify problem exists
    const existing = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Validate body
    const body = await request.json();
    const result = updateProblemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Update in a single transaction — delete & recreate relations
    const updated = await prisma.$transaction(async (tx) => {
      // Delete existing relations
      await tx.testCase.deleteMany({ where: { programId } });
      await tx.codeSnippet.deleteMany({ where: { programId } });
      await tx.solution.deleteMany({ where: { programId } });

      // Update core fields + recreate relations
      return tx.program.update({
        where: { id: programId },
        data: {
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          tags: data.tags,
          input: data.input,
          output: data.output,
          explanation: data.explanation,
          constraints: data.constraints,
          hints: data.hints || null,
          editorial: data.editorial || null,
          testCases: {
            create: data.testCases.map((tc) => ({
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isSample: tc.isSample,
              isHidden: tc.isHidden,
              explanation: tc.explanation || null,
              order: tc.order,
            })),
          },
          codeSnippets: {
            create: data.codeSnippets.map((cs) => ({
              language: cs.language,
              code: cs.code,
            })),
          },
          solutions: {
            create: Object.entries(data.solutions).map(([langStr, code]) => ({
              language: langStr.toUpperCase() as Language,
              code,
              explanation: "Updated reference solution.",
            })),
          },
        },
        select: { id: true, title: true },
      });
    });

    return NextResponse.json(
      { message: "Problem updated successfully.", programId: updated.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/problems/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const parsedId = await parseProgramId(params);
    if ("error" in parsedId) return parsedId.error;
    const { programId } = parsedId;

    const existing = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true, title: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    await prisma.program.delete({
      where: { id: programId },
    });

    return NextResponse.json(
      { message: "Problem deleted successfully.", programId: existing.id, title: existing.title },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/problems/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
