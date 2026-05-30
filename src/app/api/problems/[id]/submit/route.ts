import { NextRequest, NextResponse } from "next/server";
import { Language, SubmissionStatus, Difficulty } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import type { ProblemRunResponse, ProblemRunCaseResult } from "@/types/problem";
import { LANGUAGE_TO_JUDGE0_ID, Judge0Status, JUDGE0_STATUS_DESCRIPTIONS } from "@/lib/judge0";
import { wrapUserCode } from "@/lib/problems/utils";

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";
const JUDGE0_HOST = process.env.JUDGE0_HOST || "";

function parseProgramId(id: string) {
  const programId = Number(id);
  if (!Number.isInteger(programId) || programId <= 0) return null;
  return programId;
}

function parseLanguage(value: unknown): Language | null {
  if (typeof value !== "string") return null;
  return Object.values(Language).includes(value as Language) ? (value as Language) : null;
}

interface Judge0Result {
  token: string;
  status?: {
    id: number;
    description: string;
  };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string | number | null;
  memory?: string | number | null;
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

    const body = (await request.json()) as { language?: unknown; code?: unknown };
    const language = parseLanguage(body.language);
    if (!language || typeof body.code !== "string" || body.code.trim().length === 0) {
      return NextResponse.json({ error: "Invalid submission payload" }, { status: 400 });
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: {
        id: true,
        difficulty: true,
        solutions: {
          where: { language },
          select: { code: true },
        },
        testCases: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            isSample: true,
            isHidden: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    if (program.testCases.length === 0) {
      return NextResponse.json({ error: "No test cases found to submit against" }, { status: 400 });
    }

    const judge0LangId = LANGUAGE_TO_JUDGE0_ID[language];
    if (!judge0LangId) {
      return NextResponse.json({ error: "Language not supported by executor" }, { status: 400 });
    }

    // 1. Prepare headers for Judge0 connection
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

    // Wrap the user's code to append standard helper library and LeetCode-style stdin main drivers
    const wrappedSourceCode = wrapUserCode(
      body.code as string,
      language,
      program.solutions[0]?.code
    );

    // 2. Prepare batch submissions payload
    const submissions = program.testCases.map((tc) => ({
      language_id: judge0LangId,
      source_code: wrappedSourceCode,
      stdin: tc.input,
      expected_output: tc.expectedOutput,
    }));

    // 3. Submit batch to Judge0
    let submitResponse;
    try {
      submitResponse = await fetch(`${JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`, {
        method: "POST",
        headers,
        body: JSON.stringify({ submissions }),
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

    if (!tokens || tokens.length !== submissions.length) {
      return NextResponse.json(
        { error: "Mismatch in execution tokens returned by sandboxed runner." },
        { status: 502 }
      );
    }

    // 4. Poll Judge0 submissions until all are processed
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
          (res) => res.status && res.status.id > Judge0Status.PROCESSING
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

    // 5. Map results to ProblemRunResponse and calculate aggregate metrics
    let passedTestCases = 0;
    let maxRuntimeMs = 0;
    let maxMemoryKb = 0;
    let overallSubmissionStatus: SubmissionStatus = SubmissionStatus.PASS;

    // Collect first error to determine overall status if not PASS
    const errors: SubmissionStatus[] = [];

    const caseResults: ProblemRunCaseResult[] = program.testCases.map((testCase, index) => {
      const res = results[index];
      const statusId = res?.status?.id;

      let mappedStatus: "PENDING" | "ACCEPTED" | "WRONG_ANSWER" | "UNAVAILABLE" = "UNAVAILABLE";
      let message = "Execution failed";
      let actualOutput: string | null = null;

      // Extract execution stats
      const executionTime = res?.time ? Number(res.time) * 1000 : 0; // seconds to ms
      const executionMemory = res?.memory ? Number(res.memory) : 0; // kb
      if (executionTime > maxRuntimeMs) maxRuntimeMs = Math.round(executionTime);
      if (executionMemory > maxMemoryKb) maxMemoryKb = Math.round(executionMemory);

      if (statusId === Judge0Status.ACCEPTED) {
        mappedStatus = "ACCEPTED";
        message = "Passed";
        actualOutput = res.stdout ? res.stdout.trim() : "";
        passedTestCases++;
      } else if (statusId === Judge0Status.WRONG_ANSWER) {
        mappedStatus = "WRONG_ANSWER";
        message = "Wrong Answer";
        actualOutput = res.stdout ? res.stdout.trim() : "";
        errors.push(SubmissionStatus.FAIL);
      } else if (statusId === Judge0Status.TIME_LIMIT_EXCEEDED) {
        mappedStatus = "WRONG_ANSWER";
        message = "Time Limit Exceeded";
        errors.push(SubmissionStatus.TIME_LIMIT_EXCEEDED);
      } else if (statusId === Judge0Status.COMPILATION_ERROR) {
        mappedStatus = "WRONG_ANSWER";
        message = res.compile_output ? res.compile_output.trim() : "Compilation Error";
        actualOutput = res.compile_output ? res.compile_output.trim() : null;
        errors.push(SubmissionStatus.COMPILE_ERROR);
      } else if (statusId && statusId >= Judge0Status.RUNTIME_ERROR_SIGSEGV && statusId <= Judge0Status.RUNTIME_ERROR_OTHER) {
        mappedStatus = "WRONG_ANSWER";
        message = res.stderr ? res.stderr.trim() : (res.compile_output ? res.compile_output.trim() : "Runtime Error");
        actualOutput = res.stderr ? res.stderr.trim() : null;
        errors.push(SubmissionStatus.RUNTIME_ERROR);
      } else {
        mappedStatus = "UNAVAILABLE";
        message = res?.status?.description || "Unknown Execution State";
        errors.push(SubmissionStatus.FAIL);
      }

      // Secure hidden test cases:
      const input = testCase.isHidden ? "[Hidden Input]" : testCase.input;
      const expectedOutput = testCase.isHidden ? "[Hidden Output]" : testCase.expectedOutput;
      const finalActualOutput = testCase.isHidden && mappedStatus !== "ACCEPTED" ? "[Hidden Output]" : actualOutput;

      return {
        testCaseId: testCase.id,
        label: testCase.isSample ? `Case ${index + 1}` : `Judge Case ${index + 1}`,
        input,
        expectedOutput,
        actualOutput: finalActualOutput,
        status: mappedStatus,
        message,
      };
    });

    // If not all test cases passed, determine overall submission status from priority errors
    if (passedTestCases !== program.testCases.length) {
      if (errors.includes(SubmissionStatus.TIME_LIMIT_EXCEEDED)) {
        overallSubmissionStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
      } else if (errors.includes(SubmissionStatus.COMPILE_ERROR)) {
        overallSubmissionStatus = SubmissionStatus.COMPILE_ERROR;
      } else if (errors.includes(SubmissionStatus.RUNTIME_ERROR)) {
        overallSubmissionStatus = SubmissionStatus.RUNTIME_ERROR;
      } else {
        overallSubmissionStatus = SubmissionStatus.FAIL;
      }
    }

    // 6. DB Updates in transaction: create Submission, update Program stats, SolvedProblem, and user XP
    await prisma.$transaction(async (tx) => {
      // Create DB submission
      await tx.submission.create({
        data: {
          userId: dbUser.id,
          programId: program.id,
          language,
          code: body.code as string,
          status: overallSubmissionStatus,
          runtimeMs: maxRuntimeMs > 0 ? maxRuntimeMs : null,
          memoryKb: maxMemoryKb > 0 ? maxMemoryKb : null,
          passedTestCases,
          totalTestCases: program.testCases.length,
        },
      });

      // Update program submission counters
      await tx.program.update({
        where: { id: program.id },
        data: {
          totalSubmissions: { increment: 1 },
          ...(overallSubmissionStatus === SubmissionStatus.PASS
            ? { totalAccepted: { increment: 1 } }
            : {}),
        },
      });

      // If passing, award user XP and add solved problem
      if (overallSubmissionStatus === SubmissionStatus.PASS) {
        const existingSolved = await tx.solvedProblem.findUnique({
          where: {
            userId_programId: {
              userId: dbUser.id,
              programId: program.id,
            },
          },
        });

        if (!existingSolved) {
          // Record solved problem
          await tx.solvedProblem.create({
            data: {
              userId: dbUser.id,
              programId: program.id,
            },
          });

          // Award XP based on difficulty
          const xpReward = {
            [Difficulty.EASY]: 10,
            [Difficulty.MEDIUM]: 20,
            [Difficulty.HARD]: 30,
          }[program.difficulty] || 10;

          await tx.user.update({
            where: { id: dbUser.id },
            data: {
              xp: { increment: xpReward },
              lastActive: new Date(),
            },
          });
        } else {
          // Just update last active
          await tx.user.update({
            where: { id: dbUser.id },
            data: {
              lastActive: new Date(),
            },
          });
        }
      }
    });

    const response: ProblemRunResponse = {
      status: "COMPLETED",
      message: overallSubmissionStatus === SubmissionStatus.PASS
        ? `Submission Accepted! Passed all ${passedTestCases}/${program.testCases.length} cases.`
        : `Submission Failed with status ${overallSubmissionStatus}. Passed ${passedTestCases}/${program.testCases.length} cases.`,
      results: caseResults,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("POST /api/problems/[id]/submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
