import { Alert } from "@/components/ui/Feedback";
import { ACTIVITY_TYPE_LABELS } from "@/lib/labels";
import type { ActivityType } from "@/lib/types";

export function ComingSoon({ type }: { type: ActivityType }) {
  return (
    <Alert tone="info">
      A atividade do tipo <strong>{ACTIVITY_TYPE_LABELS[type]}</strong> ainda está em
      desenvolvimento. Fale com a professora para responder de outra forma.
    </Alert>
  );
}
