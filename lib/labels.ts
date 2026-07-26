import type { ActivityType, QuestionType } from "./types";

/** Labels do frontend - ver specs/frontend/information-architecture.md (seção 8). */
export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  quiz: "Quiz",
  form: "Formulário",
  crossword: "Cruzadinha",
  wordsearch: "Caça-palavra",
  memory: "Jogo da Memória",
};

export const ACTIVITY_TYPE_DESCRIPTIONS: Record<ActivityType, string> = {
  quiz: "Perguntas com alternativas e resposta correta.",
  form: "Campos de texto livre para o aluno responder.",
  crossword: "Palavras cruzadas geradas a partir de dicas.",
  wordsearch: "Grade com palavras a serem encontradas.",
  memory: "Jogo de cartas com pares.",
};

/** Tipos disponíveis no MVP; os demais ficam para versões futuras. */
export const AVAILABLE_ACTIVITY_TYPES: ActivityType[] = ["quiz", "form"];
export const FUTURE_ACTIVITY_TYPES: ActivityType[] = [
  "crossword",
  "wordsearch",
  "memory",
];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text: "Resposta curta",
  textarea: "Resposta longa",
  single: "Alternativa única",
  multiple: "Múltiplas alternativas",
};

/** Anos escolares atendidos pelo site: 1º ao 9º ano. */
export const SCHOOL_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function yearLabel(year: number) {
  return `${year}º ano`;
}

export function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
