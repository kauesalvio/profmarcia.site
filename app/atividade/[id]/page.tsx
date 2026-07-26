"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ActivityPlayer } from "@/components/activities/ActivityPlayer";
import { Header } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { ACTIVITY_TYPE_ICONS, IconCheck, IconClipboard } from "@/components/ui/Icons";
import { activitiesApi, responsesApi } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS } from "@/lib/labels";
import { getSelectedClassId, saveStudentName, useStudentName } from "@/lib/student";
import { useResource } from "@/lib/useResource";
import type { Answer } from "@/lib/types";

type Step = "name" | "activity" | "done";

export default function StudentActivityPage() {
  const { id } = useParams<{ id: string }>();
  const { data: activity, error, loading, reload } = useResource(
    () => activitiesApi.get(id),
    id,
  );

  const [step, setStep] = useState<Step>("name");
  // O nome já usado antes fica salvo no navegador; `typedName` assume ao digitar.
  const savedName = useStudentName();
  const [typedName, setTypedName] = useState<string | null>(null);
  const name = typedName ?? savedName;
  const [nameError, setNameError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startActivity(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setNameError("Escreva seu nome completo para começar.");
      return;
    }
    setNameError(undefined);
    saveStudentName(name.trim());
    setStep("activity");
  }

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
        studentName: name.trim(),
        answers,
      });
      setStep("done");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Não foi possível enviar sua resposta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const TypeIcon = activity ? ACTIVITY_TYPE_ICONS[activity.type] : null;

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

        {activity && step !== "done" && (
          <div className="flex animate-rise items-start gap-4">
            {TypeIcon && (
              <span
                aria-hidden
                className="grid size-12 shrink-0 place-items-center rounded-xl bg-student-light text-student-dark"
              >
                <TypeIcon size={24} />
              </span>
            )}
            <div className="flex flex-col gap-1.5">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {activity.title}
              </h1>
              {activity.description && (
                <p className="text-base leading-relaxed text-gray-700">
                  {activity.description}
                </p>
              )}
              <span>
                <Badge tone="student">{ACTIVITY_TYPE_LABELS[activity.type]}</Badge>
              </span>
            </div>
          </div>
        )}

        {activity && step === "name" && (
          <Card className="animate-rise p-6">
            <form onSubmit={startActivity} className="flex flex-col gap-5" noValidate>
              <Field
                label="Seu nome"
                htmlFor="student-name"
                hint="A professora vai ver seu nome junto das respostas."
                error={nameError}
                required
              >
                <Input
                  id="student-name"
                  value={name}
                  autoComplete="name"
                  placeholder="Maria Silva"
                  onChange={(e) => setTypedName(e.target.value)}
                />
              </Field>

              <Button type="submit" variant="student" size="lg">
                Começar atividade
              </Button>
            </form>
          </Card>
        )}

        {activity && step === "activity" && (
          <>
            {submitError && <Alert tone="error">{submitError}</Alert>}
            <ActivityPlayer
              activity={activity}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          </>
        )}

        {step === "done" && (
          <Card className="dot-grid relative animate-rise overflow-hidden p-10 text-center text-student">
            <div className="relative flex flex-col items-center gap-4 text-gray-700">
              <span
                aria-hidden
                className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-student to-student-dark text-white shadow-soft-lg"
              >
                <IconCheck size={32} strokeWidth={2.5} />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Resposta enviada!
              </h1>
              <p className="max-w-sm text-base text-gray-500">
                Obrigado, {name.trim()}. Sua resposta chegou para a professora.
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
