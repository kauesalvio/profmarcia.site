/**
 * Tipos de pergunta suportados. Uma mesma atividade pode misturar vários deles
 * (specs/tech-spec.md, seção 5 - Activity).
 */
export type QuestionType =
  | "text"
  | "textarea"
  | "quiz"
  | "image-quiz"
  | "crossword"
  | "wordsearch"
  | "memory";

/** Palavra usada em cruzadinha e caça-palavra; a dica é opcional. */
export interface PuzzleWord {
  word: string;
  clue?: string;
}

export interface DecorationImage {
  /** Identificador público do Openverse; o arquivo da imagem não é salvo. */
  id: string;
  title: string;
  creator?: string;
  license: string;
  sourceUrl: string;
}

export type ImageSearchResult = DecorationImage;

interface BaseQuestion {
  label: string;
  decoration?: DecorationImage;
}

export interface TextQuestion extends BaseQuestion {
  type: "text" | "textarea";
}

export interface QuizQuestion extends BaseQuestion {
  type: "quiz";
  options: string[];
  correctAnswer: string | null;
}

export interface ImageQuizQuestion extends BaseQuestion {
  type: "image-quiz";
  options: (DecorationImage | null)[];
  correctAnswer: string | null;
}

export interface PuzzleQuestion extends BaseQuestion {
  type: "crossword" | "wordsearch";
  words: PuzzleWord[];
  gridSize?: number;
}

export interface FutureQuestion extends BaseQuestion {
  type: "memory";
}

export type Question =
  | TextQuestion
  | QuizQuestion
  | ImageQuizQuestion
  | PuzzleQuestion
  | FutureQuestion;

export interface ActivitySettings extends Record<string, unknown> {
  kahootUrl?: string;
}

export interface ActivityConfig {
  questions: Question[];
  settings: ActivitySettings;
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
  answers: Answer[];
  submittedAt?: string;
}

/** Payloads enviados para a API (sem os campos gerados pelo banco). */
export type ClassInput = Pick<SchoolClass, "name" | "year">;
export type ActivityInput = Pick<
  Activity,
  "title" | "description" | "classIds" | "config"
>;
export type ResponseInput = Pick<
  ActivityResponse,
  "activityId" | "classIds" | "answers"
>;
