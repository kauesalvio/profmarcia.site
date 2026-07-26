"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { activitiesApi, responsesApi } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS, formatDateTime } from "@/lib/labels";
import { useResource } from "@/lib/useResource";

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const activity = useResource(() => activitiesApi.get(id), id);
  const responses = useResource(() => responsesApi.list(id), id);

  const list = responses.data ?? [];
  const correctAnswers = new Map(
    (activity.data?.config?.questions ?? [])
      .filter((question) => question.correctAnswer)
      .map((question) => [question.label, question.correctAnswer]),
  );

  return (
    <>
      <PageHeader
        title={activity.data?.title ?? "Respostas da atividade"}
        description={activity.data?.description || undefined}
        action={<ButtonLink href="/professor/analise" variant="secondary">Trocar atividade</ButtonLink>}
      />

      {activity.data && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">{ACTIVITY_TYPE_LABELS[activity.data.type]}</Badge>
          <Badge tone="student">
            {list.length} {list.length === 1 ? "aluno respondeu" : "alunos responderam"}
          </Badge>
        </div>
      )}

      {(activity.loading || responses.loading) && <Spinner label="Carregando respostas..." />}

      {responses.error && !responses.loading && (
        <Alert
          tone="error"
          action={
            <Button variant="secondary" onClick={responses.reload}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar as respostas. Tente novamente.
        </Alert>
      )}

      {!responses.loading && !responses.error && list.length === 0 && (
        <EmptyState message="Nenhum aluno respondeu esta atividade ainda." />
      )}

      {!responses.loading && !responses.error && list.length > 0 && (
        <ul className="flex flex-col gap-3">
          {list.map((response) => (
            <li key={response._id}>
              <Card className="p-0">
                <details className="group">
                  <summary className="flex min-h-11 cursor-pointer flex-wrap items-center gap-3 rounded-md p-4">
                    <span className="text-base font-semibold text-gray-900">
                      {response.studentName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDateTime(response.submittedAt)}
                    </span>
                    <span className="ml-auto text-sm font-medium text-primary">
                      Ver detalhes
                    </span>
                  </summary>

                  <dl className="flex flex-col gap-3 border-t border-gray-200 p-4">
                    {response.answers.map((answer, index) => {
                      const expected = correctAnswers.get(answer.question);
                      const isCorrect = expected ? expected === answer.answer : null;
                      return (
                        <div key={index} className="flex flex-col gap-1">
                          <dt className="text-sm font-semibold text-gray-900">
                            {answer.question}
                          </dt>
                          <dd className="flex flex-wrap items-center gap-2 text-base text-gray-700">
                            {answer.answer || <span className="text-gray-500">Sem resposta</span>}
                            {isCorrect !== null && (
                              <Badge tone={isCorrect ? "student" : "warning"}>
                                {isCorrect ? "✓ correta" : `✗ esperado: ${expected}`}
                              </Badge>
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </details>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
