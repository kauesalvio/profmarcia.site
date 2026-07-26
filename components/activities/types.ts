import type { Activity, Answer } from "@/lib/types";

/** Contrato comum dos componentes de atividade da área do aluno. */
export interface ActivityPlayerProps {
  activity: Activity;
  submitting: boolean;
  onSubmit: (answers: Answer[]) => void;
}
