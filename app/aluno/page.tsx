"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, InteractiveCard } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import {
  ACTIVITY_TYPE_ICONS,
  IconArrowRight,
  IconBackpack,
  IconClipboard,
} from "@/components/ui/Icons";
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
    <div className="ambient-aluno flex flex-1 flex-col">
      <Header variant="aluno" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:py-10">
        <div className="flex animate-rise flex-col gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-student-dark">
            <IconBackpack size={16} />
            Sem senha, só escolher e responder
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Atividades de informática
          </h1>
          <p className="text-base text-gray-500">
            Escolha o seu ano para ver as atividades disponíveis.
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
          <EmptyState
            icon={<IconBackpack size={28} />}
            message="Nenhuma turma disponível. Peça para a professora cadastrar as turmas."
          />
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
                    className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 px-4 py-4 text-center transition-all duration-200 ${
                      active
                        ? "border-student bg-student-light shadow-soft"
                        : "border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-student/40 hover:shadow-soft"
                    }`}
                  >
                    <span
                      className={`text-2xl font-bold ${
                        active ? "text-student-dark" : "text-gray-900"
                      }`}
                    >
                      {schoolClass.year}º
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {schoolClass.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {yearLabel(schoolClass.year)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {current && (
          <section className="flex animate-rise flex-col gap-3">
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
              <EmptyState
                icon={<IconClipboard size={28} />}
                message="Nenhuma atividade disponível para este ano ainda."
              />
            )}

            <ul className="flex flex-col gap-3">
              {list.map((activity) => {
                const TypeIcon = ACTIVITY_TYPE_ICONS[activity.type];
                return (
                  <li key={activity._id}>
                    <InteractiveCard className="flex flex-wrap items-center gap-4 p-5">
                      <span
                        aria-hidden
                        className="grid size-12 shrink-0 place-items-center rounded-xl bg-student-light text-student-dark"
                      >
                        <TypeIcon size={24} />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </span>
                        {activity.description && (
                          <span className="text-sm text-gray-500">
                            {activity.description}
                          </span>
                        )}
                        <span>
                          <Badge tone="student">
                            {ACTIVITY_TYPE_LABELS[activity.type]}
                          </Badge>
                        </span>
                      </div>
                      <ButtonLink
                        className="ml-auto"
                        variant="student"
                        size="lg"
                        href={`/atividade/${activity._id}`}
                      >
                        Começar
                        <IconArrowRight size={18} />
                      </ButtonLink>
                    </InteractiveCard>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
