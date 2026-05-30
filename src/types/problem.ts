import { Difficulty, Language } from "@/generated/prisma";

export interface ProblemListItem {
  id: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  totalSubmissions: number;
  totalAccepted: number;
  acceptanceRate: number | null;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSampleTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation: string | null;
  order: number;
}

export interface PublicCodeSnippet {
  language: Language;
  code: string;
}

export interface PublicProblemDetail {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  input: string;
  output: string;
  explanation: string;
  constraints: string;
  hints: string | null;
  editorial: string | null;
  totalSubmissions: number;
  totalAccepted: number;
  acceptanceRate: number | null;
  likes: number;
  dislikes: number;
  sampleTestCases: PublicSampleTestCase[];
  codeSnippets: PublicCodeSnippet[];
  createdAt: string;
  updatedAt: string;
}

export interface ProblemsListResponse {
  problems: ProblemListItem[];
  total: number;
}

export interface ProblemDetailResponse {
  problem: PublicProblemDetail;
}

export interface ApiErrorResponse {
  error: string;
}

export interface ProblemRunCaseResult {
  testCaseId: number;
  label: string;
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  status: "PENDING" | "ACCEPTED" | "WRONG_ANSWER" | "UNAVAILABLE";
  message: string;
}

export interface ProblemRunResponse {
  status: "UNAVAILABLE" | "COMPLETED";
  message: string;
  results: ProblemRunCaseResult[];
}
