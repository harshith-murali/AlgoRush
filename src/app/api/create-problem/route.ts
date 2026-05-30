import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Difficulty, Language, UserRole } from "@/generated/prisma";

import { LANGUAGE_TO_JUDGE0_ID } from "@/lib/judge0";

// Configurable Judge0 Environment Constants
const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";
const JUDGE0_HOST = process.env.JUDGE0_HOST || "";


// Zod Input Validation Schema
const createProblemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.nativeEnum(Difficulty),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).min(1, "At least one tag is required"),
  input: z.string().min(1, "Input specification is required"),
  output: z.string().min(1, "Output specification is required"),
  explanation: z.string().min(1, "Explanation is required"),
  constraints: z.string().min(1, "Constraints specification is required"),
  hints: z.string().optional().nullable(),
  editorial: z.string().optional().nullable(),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isSample: z.boolean().default(false),
        isHidden: z.boolean().default(true),
        explanation: z.string().optional().nullable(),
        order: z.number().default(0),
      })
    )
    .min(1, "At least one test case is required"),
  codeSnippets: z
    .array(
      z.object({
        language: z.nativeEnum(Language),
        code: z.string().min(1, "Code snippet template cannot be empty"),
      })
    )
    .min(1, "At least one starter code snippet is required"),
  solutions: z
    .record(z.string(), z.string().min(1, "Solution code cannot be empty"))
    .refine((val) => Object.keys(val).length > 0, "At least one solution is required"),
});

interface Judge0Result {
  token: string;
  status?: {
    id: number;
    description: string;
  };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user & Authorize role
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, role: true },
    });

    if (!dbUser || dbUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can create programs" },
        { status: 403 }
      );
    }

    // 2. Parse and validate JSON request body
    const body = await request.json();
    const result = createProblemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const validatedData = result.data;

    // 3. Prepare headers for Judge0 connection
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (JUDGE0_API_KEY) {
      if (JUDGE0_BASE_URL.includes("rapidapi")) {
        headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
        headers["X-RapidAPI-Host"] = JUDGE0_HOST || new URL(JUDGE0_BASE_URL).hostname;
      } else {
        headers["X-Auth-Token"] = JUDGE0_API_KEY;
      }
    }

    // 4. Batch solution validation against Judge0 CE sandbox
    const submissionsToCreate = [];
    const submissionMapping: Array<{ language: Language; testCaseIndex: number }> = [];

    for (const [langStr, solutionCode] of Object.entries(validatedData.solutions)) {
      const language = langStr.toUpperCase() as Language;
      const judge0LangId = LANGUAGE_TO_JUDGE0_ID[language];

      if (!judge0LangId) {
        return NextResponse.json(
          { error: `Language '${langStr}' is not supported by Judge0 execution runner.` },
          { status: 400 }
        );
      }

      for (let i = 0; i < validatedData.testCases.length; i++) {
        const tc = validatedData.testCases[i];
        submissionsToCreate.push({
          language_id: judge0LangId,
          source_code: solutionCode,
          stdin: tc.input,
          expected_output: tc.expectedOutput,
        });
        submissionMapping.push({ language, testCaseIndex: i });
      }
    }

    // Submit batch executions
    let submitResponse;
    try {
      submitResponse = await fetch(`${JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`, {
        method: "POST",
        headers,
        body: JSON.stringify({ submissions: submissionsToCreate }),
      });
    } catch (err) {
      console.error("Error communicating with Judge0 batch service:", err);
      return NextResponse.json(
        { error: "Code executor sandbox is currently unreachable." },
        { status: 502 }
      );
    }

    if (!submitResponse.ok) {
      const errBody = await submitResponse.text();
      console.error("Judge0 batch submission rejected:", errBody);
      return NextResponse.json(
        { error: "Code execution engine rejected the validation suite." },
        { status: 502 }
      );
    }

    const tokensData = await submitResponse.json();
    const tokens: string[] = tokensData.map((t: any) => t.token).filter(Boolean);

    if (!tokens || tokens.length !== submissionsToCreate.length) {
      return NextResponse.json(
        { error: "Mismatch in execution tokens returned by sandboxed runner." },
        { status: 502 }
      );
    }

    // 5. Poll Judge0 submissions until all are processed
    let completed = false;
    let results: Judge0Result[] = [];
    const maxAttempts = 15;
    const pollIntervalMs = 1500;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

      try {
        const pollResponse = await fetch(
          `${JUDGE0_BASE_URL}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false`,
          { method: "GET", headers }
        );

        if (!pollResponse.ok) {
          throw new Error(`Execution poll error: HTTP ${pollResponse.status}`);
        }

        const data = await pollResponse.json();
        const batchResults: Judge0Result[] = data.submissions || data;
        results = batchResults;

        const allFinished = batchResults.every(
          (res) => res.status && res.status.id > 2 // Status > 2 means it is finished processing (e.g. 3 = Accepted)
        );

        if (allFinished) {
          completed = true;
          break;
        }
      } catch (pollErr) {
        console.error("Polling Judge0 results encountered an error:", pollErr);
      }
    }

    if (!completed) {
      return NextResponse.json(
        { error: "Execution validation timed out in sandbox environment." },
        { status: 408 }
      );
    }

    // 6. Judge solutions outcomes
    const failures = [];
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const mapping = submissionMapping[i];
      const statusId = res.status?.id;

      // Status 3 is 'Accepted' in Judge0 CE
      if (statusId !== 3) {
        failures.push({
          language: mapping.language,
          testCaseIndex: mapping.testCaseIndex,
          testCaseInput: validatedData.testCases[mapping.testCaseIndex].input,
          status: res.status?.description || "Execution Error",
          stdout: res.stdout || null,
          stderr: res.stderr || null,
          compile_output: res.compile_output || null,
        });
      }
    }

    if (failures.length > 0) {
      return NextResponse.json(
        {
          error: "Provided solutions failed validation testing inside the sandbox environment.",
          failures,
        },
        { status: 422 }
      );
    }

    // 7. All solutions passed! Persist new problem with transactions
    const newProgram = await prisma.$transaction(async (tx) => {
      return await tx.program.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          difficulty: validatedData.difficulty,
          tags: validatedData.tags,
          input: validatedData.input,
          output: validatedData.output,
          explanation: validatedData.explanation,
          constraints: validatedData.constraints,
          hints: validatedData.hints || null,
          editorial: validatedData.editorial || null,
          userId: dbUser.id,
          testCases: {
            create: validatedData.testCases.map((tc) => ({
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isSample: tc.isSample,
              isHidden: tc.isHidden,
              explanation: tc.explanation || null,
              order: tc.order,
            })),
          },
          codeSnippets: {
            create: validatedData.codeSnippets.map((cs) => ({
              language: cs.language,
              code: cs.code,
            })),
          },
          solutions: {
            create: Object.entries(validatedData.solutions).map(([langStr, code]) => ({
              language: langStr.toUpperCase() as Language,
              code,
              explanation: "Official validated sandbox reference solution.",
            })),
          },
        },
        include: {
          testCases: true,
          codeSnippets: true,
          solutions: true,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Problem created successfully after passing sandbox validation suite.",
        programId: newProgram.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal transaction or API execution error:", error);
    return NextResponse.json(
      { error: "Internal server error during problem registration." },
      { status: 500 }
    );
  }
}
