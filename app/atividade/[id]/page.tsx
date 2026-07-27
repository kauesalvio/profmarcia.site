"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ActivityPlayer } from "@/components/activities/ActivityPlayer";
import { Header } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { IconCheck, IconClipboard, QUESTION_TYPE_ICONS } from "@/components/ui/Icons";
import { activitiesApi, responsesApi } from "@/lib/api";
import { QUESTION_TYPE_LABELS, activityQuestionTypes } from "@/lib/labels";
import { getSelectedClassId } from "@/lib/student";
import { useResource } from "@/lib/useResource";
import type { Answer } from "@/lib/types";

export default function StudentActivityPage() {
  const { id } = useParams<{ id: string }>();
  const { data: activity, error, loading, reload } = useResource(
    () => activitiesApi.get(id),
    id,
  );

  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(answers: Answer[]) {
    if (!activity) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      const classId = getSelectedClassId();
      await responsesApi.create({
        activityId: activity._id,
        // A turma escolhida pelo aluno em /aluno; se não houver, usamos as da atividade.
        classIds: classId ? [classId] : activity.classIds,
        answers,
      });
      setDone(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Não foi possível enviar sua resposta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const types = activity ? activityQuestionTypes(activity) : [];
  const TypeIcon = types.length > 0 ? QUESTION_TYPE_ICONS[types[0]] : null;

  return (
    <div className="ambient-aluno flex flex-1 flex-col">
      <Header variant="aluno" />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:py-10">
        {loading && <Spinner label="Carregando atividade..." />}

        {error && !loading && (
          <Alert
            tone="error"
            action={
              <Button variant="secondary" onClick={reload}>
                Tentar novamente
              </Button>
            }
          >
            Não foi possível carregar a atividade. Tente novamente.
          </Alert>
        )}

        {!loading && !error && !activity && (
          <EmptyState
            icon={<IconClipboard size={28} />}
            message="Atividade não encontrada."
            action={
              <ButtonLink href="/aluno" variant="student">
                Ver atividades
              </ButtonLink>
            }
          />
        )}

        {activity && !done && (
          <div className="flex animate-rise items-start gap-4">
            {TypeIcon && (
              <span
                aria-hidden
                className="grid size-14 shrink-0 place-items-center rounded-xl border-2 border-gray-900 bg-student-light text-student-dark"
              >
                <TypeIcon size={28} />
              </span>
            )}
            <div className="flex flex-col gap-1.5">
              <h1 className="heading-poster text-3xl text-gray-900">{activity.title}</h1>
              {activity.description && (
                <p className="text-base font-semibold leading-relaxed text-gray-700">
                  {activity.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <Badge key={type} tone="student">
                    {QUESTION_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {activity && !done && (
          <>
            {submitError && <Alert tone="error">{submitError}</Alert>}
            <ActivityPlayer
              activity={activity}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          </>
        )}

        {done && (
          <Card className="dot-grid relative animate-rise overflow-hidden border-4 border-student p-10 text-center text-student shadow-hard">
            <div className="relative flex flex-col items-center gap-4 text-gray-900">
              <span
                aria-hidden
                className="grid size-16 place-items-center rounded-full border-4 border-gray-900 bg-student text-white shadow-md"
              >
                <IconCheck size={36} strokeWidth={3} />
              </span>
              <h1 className="heading-poster text-3xl text-gray-900">
                Resposta enviada!
              </h1>
              <p className="max-w-sm text-base font-semibold text-gray-700">
                Sua resposta chegou para a professora.
              </p>
              <ButtonLink href="/aluno" variant="student" size="lg" className="mt-2">
                Voltar para as atividades
              </ButtonLink>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
