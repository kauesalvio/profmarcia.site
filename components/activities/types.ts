import type { Question } from "@/lib/types";

/**
 * Contrato comum dos componentes de pergunta da área do aluno. Cada pergunta de
 * uma atividade produz uma resposta em texto (specs/frontend/frontend.md).
 */
export interface QuestionViewProps<Q extends Question = Question> {
  question: Q;
  index: number;
  value: string;
  onChange: (value: string) => void;
}
