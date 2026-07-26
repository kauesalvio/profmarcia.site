import { Alert } from "@/components/ui/Feedback";
import { QUESTION_TYPE_LABELS } from "@/lib/labels";
import type { QuestionType } from "@/lib/types";

export function ComingSoon({ type }: { type: QuestionType }) {
  return (
    <Alert tone="info">
      A pergunta do tipo <strong>{QUESTION_TYPE_LABELS[type]}</strong> ainda está em
      desenvolvimento. Fale com a professora para responder de outra forma.
    </Alert>
  );
}
