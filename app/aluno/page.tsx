"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { activitiesApi, classesApi } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS, yearLabel } from "@/lib/labels";
import { selectClassId, useSelectedClassId } from "@/lib/student";
import { useResource } from "@/lib/useResource";

export default function StudentHomePage() {
  const classes = useResource(() => classesApi.list());
  const storedClassId = useSelectedClassId();
  const [pickedClassId, setPickedClassId] = useState<string | null>(null);
  const classId = pickedClassId ?? storedClassId;

  const activities = useResource(
    () => (classId ? activitiesApi.list(classId) : Promise.resolve([])),
    classId ?? "",
  );

  function choose(id: string) {
    selectClassId(id);
    setPickedClassId(id);
  }

  const classList = [...(classes.data ?? [])].sort(
    (a, b) => a.year - b.year || a.name.localeCompare(b.name),
  );
  const current = classList.find((item) => item._id === classId);
  const list = activities.data ?? [];

  return (
    <>
      <Header variant="aluno" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Atividades de informática</h1>
          <p className="text-base text-gray-500">
            Escolha o seu ano para ver as atividades. Você não precisa de senha.
          </p>
        </div>

        {classes.loading && <Spinner label="Carregando anos..." />}

        {classes.error && !classes.loading && (
          <Alert
            tone="error"
            action={
              <Button variant="secondary" onClick={classes.reload}>
                Tentar novamente
              </Button>
            }
          >
            Não foi possível carregar os anos. Tente novamente.
          </Alert>
        )}

        {!classes.loading && !classes.error && classList.length === 0 && (
          <EmptyState message="Nenhuma turma disponível. Peça para a professora cadastrar as turmas." />
        )}

        {classList.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Escolher ano</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {classList.map((schoolClass) => {
                const active = schoolClass._id === classId;
                return (
                  <button
                    key={schoolClass._id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(schoolClass._id)}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border px-4 py-3 text-center transition-colors duration-200 ${
                      active
                        ? "border-student bg-student-light"
                        : "border-gray-300 bg-white hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {schoolClass.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {yearLabel(schoolClass.year)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {current && (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Atividades de {current.name}
            </h2>

            {activities.loading && <Spinner label="Carregando atividades..." />}

            {activities.error && !activities.loading && (
              <Alert
                tone="error"
                action={
                  <Button variant="secondary" onClick={activities.reload}>
                    Tentar novamente
                  </Button>
                }
              >
                Não foi possível carregar as atividades. Tente novamente.
              </Alert>
            )}

            {!activities.loading && !activities.error && list.length === 0 && (
              <EmptyState message="Nenhuma atividade disponível para este ano ainda." />
            )}

            <ul className="flex flex-col gap-3">
              {list.map((activity) => (
                <li key={activity._id}>
                  <Card className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-semibold text-gray-900">
                        {activity.title}
                      </span>
                      {activity.description && (
                        <span className="text-sm text-gray-500">{activity.description}</span>
                      )}
                      <Badge tone="student">{ACTIVITY_TYPE_LABELS[activity.type]}</Badge>
                    </div>
                    <ButtonLink
                      className="ml-auto"
                      variant="student"
                      size="lg"
                      href={`/atividade/${activity._id}`}
                    >
                      Começar
                    </ButtonLink>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
