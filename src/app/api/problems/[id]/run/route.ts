import { NextRequest, NextResponse } from "next/server";
import { Language } from "@/generated/prisma";
import { prisma } from "@/lib/db";
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
        solutions: {
          where: { language },
          select: { code: true },
        },
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

    if (program.testCases.length === 0) {
      return NextResponse.json({ error: "No test cases found to execute" }, { status: 400 });
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

    // 5. Map results to ProblemRunResponse
    const caseResults: ProblemRunCaseResult[] = program.testCases.map((testCase, index) => {
      const res = results[index];
      const statusId = res?.status?.id;

      let mappedStatus: "PENDING" | "ACCEPTED" | "WRONG_ANSWER" | "UNAVAILABLE" = "UNAVAILABLE";
      let message = "Execution failed";
      let actualOutput: string | null = null;

      if (statusId === Judge0Status.ACCEPTED) {
        mappedStatus = "ACCEPTED";
        message = "Passed";
        actualOutput = res.stdout ? res.stdout.trim() : "";
      } else if (statusId === Judge0Status.WRONG_ANSWER) {
        mappedStatus = "WRONG_ANSWER";
        message = "Wrong Answer";
        actualOutput = res.stdout ? res.stdout.trim() : "";
      } else if (statusId === Judge0Status.TIME_LIMIT_EXCEEDED) {
        mappedStatus = "WRONG_ANSWER";
        message = "Time Limit Exceeded";
      } else if (statusId === Judge0Status.COMPILATION_ERROR) {
        mappedStatus = "WRONG_ANSWER";
        message = res.compile_output ? res.compile_output.trim() : "Compilation Error";
        actualOutput = res.compile_output ? res.compile_output.trim() : null;
      } else if (statusId && statusId >= Judge0Status.RUNTIME_ERROR_SIGSEGV && statusId <= Judge0Status.RUNTIME_ERROR_OTHER) {
        mappedStatus = "WRONG_ANSWER";
        message = res.stderr ? res.stderr.trim() : (res.compile_output ? res.compile_output.trim() : "Runtime Error");
        actualOutput = res.stderr ? res.stderr.trim() : null;
      } else {
        mappedStatus = "UNAVAILABLE";
        message = res?.status?.description || "Unknown Execution State";
      }

      return {
        testCaseId: testCase.id,
        label: `Case ${index + 1}`,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        status: mappedStatus,
        message,
      };
    });

    const overallCompleted = caseResults.every((r) => r.status === "ACCEPTED");

    const response: ProblemRunResponse = {
      status: "COMPLETED",
      message: overallCompleted
        ? "All sample test cases passed!"
        : "Some sample test cases failed.",
      results: caseResults,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("POST /api/problems/[id]/run error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
