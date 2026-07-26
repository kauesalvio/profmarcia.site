import type { Activity, Question, QuestionType } from "./types";

/** Labels do frontend - ver specs/frontend/information-architecture.md (seção 8). */
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text: "Resposta curta",
  textarea: "Resposta longa",
  quiz: "Quiz",
  crossword: "Cruzadinha",
  wordsearch: "Caça-palavra",
  memory: "Jogo da Memória",
};

export const QUESTION_TYPE_DESCRIPTIONS: Record<QuestionType, string> = {
  text: "Campo de texto curto para o aluno responder.",
  textarea: "Campo de texto longo para respostas com mais detalhes.",
  quiz: "Pergunta com alternativas e resposta correta.",
  crossword: "Palavras cruzadas montadas a partir das palavras e dicas.",
  wordsearch: "Grade com palavras escondidas para o aluno encontrar.",
  memory: "Jogo de cartas com pares.",
};

/** Tipos disponíveis no MVP; os demais ficam para versões futuras. */
export const AVAILABLE_QUESTION_TYPES: QuestionType[] = [
  "text",
  "textarea",
  "quiz",
  "crossword",
  "wordsearch",
];
export const FUTURE_QUESTION_TYPES: QuestionType[] = ["memory"];

/** Tipos usados por uma atividade, sem repetição, para exibir nos resumos. */
export function activityQuestionTypes(activity: Activity): QuestionType[] {
  const types = (activity.config?.questions ?? [])
    .map((question) => question.type)
    .filter((type) => type in QUESTION_TYPE_LABELS);
  return [...new Set(types)];
}

/** Resposta esperada de uma pergunta, quando existe gabarito. */
export function expectedAnswer(question: Question): string | null {
  if (question.type === "quiz") return question.correctAnswer;
  if (question.type === "crossword" || question.type === "wordsearch") {
    return question.words.map((item) => item.word.toUpperCase()).join(", ");
  }
  return null;
}

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
