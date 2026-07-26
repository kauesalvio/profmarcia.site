export type ActivityType = "quiz" | "form" | "crossword" | "wordsearch" | "memory";

export type QuestionType = "text" | "textarea" | "single" | "multiple";

export interface Question {
  label: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string | null;
}

export interface ActivityConfig {
  questions: Question[];
  settings: Record<string, unknown>;
}

export interface SchoolClass {
  _id: string;
  name: string;
  year: number;
  createdAt?: string;
}

export interface Activity {
  _id: string;
  classIds: string[];
  title: string;
  description: string;
  type: ActivityType;
  config: ActivityConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface Answer {
  question: string;
  answer: string;
}

export interface ActivityResponse {
  _id: string;
  activityId: string;
  classIds: string[];
  studentName: string;
  answers: Answer[];
  submittedAt?: string;
}

/** Payloads enviados para a API (sem os campos gerados pelo banco). */
export type ClassInput = Pick<SchoolClass, "name" | "year">;
export type ActivityInput = Pick<
  Activity,
  "title" | "description" | "type" | "classIds" | "config"
>;
export type ResponseInput = Pick<
  ActivityResponse,
  "activityId" | "classIds" | "studentName" | "answers"
>;
