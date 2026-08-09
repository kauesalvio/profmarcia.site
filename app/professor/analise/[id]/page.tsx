"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { IconChart, IconChevronDown, IconClock, IconUsers } from "@/components/ui/Icons";
import { activitiesApi, responsesApi } from "@/lib/api";
import {
  QUESTION_TYPE_LABELS,
  answerLabel,
  activityQuestionTypes,
  expectedAnswer,
  formatDateTime,
} from "@/lib/labels";
import { useResource } from "@/lib/useResource";
import type { Answer } from "@/lib/types";

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const activity = useResource(() => activitiesApi.get(id, true), id);
  const responses = useResource(() => responsesApi.list(id), id);

  const list = responses.data ?? [];
  const types = activity.data ? activityQuestionTypes(activity.data) : [];
  const correctAnswers = new Map(
    (activity.data?.config?.questions ?? [])
      .map((question) => [question.label, expectedAnswer(question)] as const)
      .filter(([, expected]) => expected),
  );
  const questionsByLabel = new Map(
    (activity.data?.config?.questions ?? []).map((question) => [question.label, question]),
  );
  const isGraded = correctAnswers.size > 0;

  function scoreOf(answers: Answer[]) {
    return answers.filter(
      (answer) => correctAnswers.get(answer.question) === answer.answer,
    ).length;
  }

  return (
    <>
      <PageHeader
        title={activity.data?.title ?? "Respostas da atividade"}
        description={activity.data?.description || undefined}
        action={
          <ButtonLink href="/professor/analise" variant="secondary">
            Trocar atividade
          </ButtonLink>
        }
      />

      {activity.data && (
        <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
          <Card className="flex items-center gap-3 p-4">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-lg border-2 border-gray-900 bg-primary-light text-primary-dark"
            >
              <IconChart size={20} />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Tipos de pergunta
              </span>
              <div className="flex flex-wrap gap-1.5">
                {types.map((type) => (
                  <Badge key={type} tone="primary">
                    {QUESTION_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-lg border-2 border-gray-900 bg-student-light text-student-dark"
            >
              <IconUsers size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Respostas
              </span>
              <span className="text-lg font-extrabold text-gray-900">
                {list.length} {list.length === 1 ? "enviada" : "enviadas"}
              </span>
            </div>
          </Card>
        </div>
      )}

      {(activity.loading || responses.loading) && <Spinner label="Carregando respostas..." />}

      {responses.error && !responses.loading && (
        <Alert
          tone="error"
          action={
            <ButtonLink href="/professor/analise" variant="secondary">
              Tentar novamente
            </ButtonLink>
          }
        >
          Não foi possível carregar as respostas. Tente novamente.
        </Alert>
      )}

      {!responses.loading && !responses.error && list.length === 0 && (
        <EmptyState
          icon={<IconUsers size={28} />}
          message="Nenhuma resposta enviada para esta atividade ainda."
        />
      )}

      {!responses.loading && !responses.error && list.length > 0 && (
        <ul className="flex flex-col gap-3">
          {list.map((response, position) => {
            const score = isGraded ? scoreOf(response.answers) : null;
            return (
              <li key={response._id}>
                <Card className="p-0">
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer flex-wrap items-center gap-3 rounded-xl p-4 transition-colors duration-150 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                      <span
                        aria-hidden
                        className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-gray-900 bg-student-light text-sm font-extrabold text-student-dark"
                      >
                        {position + 1}
                      </span>
                      <span className="text-base font-extrabold text-gray-900">
                        Resposta {position + 1}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        <IconClock size={14} />
                        {formatDateTime(response.submittedAt)}
                      </span>
                      {score !== null && (
                        <Badge tone={score === correctAnswers.size ? "student" : "warning"}>
                          {score}/{correctAnswers.size} corretas
                        </Badge>
                      )}
                      <IconChevronDown
                        size={18}
                        className="ml-auto text-gray-400 transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>

                    <dl className="flex flex-col gap-4 border-t-2 border-gray-100 p-5">
                      {response.answers.map((answer, index) => {
                        const expected = correctAnswers.get(answer.question);
                        const isCorrect = expected ? expected === answer.answer : null;
                        const question = questionsByLabel.get(answer.question);
                        const displayedAnswer = answerLabel(question, answer.answer);
                        const displayedExpected = expected ? answerLabel(question, expected) : null;
                        return (
                          <div key={index} className="flex gap-3">
                            <span
                              aria-hidden
                              className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-gray-900 bg-gray-100 text-xs font-extrabold text-gray-500"
                            >
                              {index + 1}
                            </span>
                            <div className="flex flex-col gap-1">
                              <dt className="text-sm font-extrabold text-gray-900">
                                {answer.question}
                              </dt>
                              <dd className="flex flex-wrap items-center gap-2 text-base font-semibold text-gray-700">
                                {displayedAnswer || (
                                  <span className="text-gray-400">Sem resposta</span>
                                )}
                                {isCorrect !== null && (
                                  <Badge tone={isCorrect ? "student" : "warning"}>
                                    {isCorrect ? "✓ correta" : `✗ esperado: ${displayedExpected}`}
                                  </Badge>
                                )}
                              </dd>
                            </div>
                          </div>
                        );
                      })}
                    </dl>
                  </details>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
