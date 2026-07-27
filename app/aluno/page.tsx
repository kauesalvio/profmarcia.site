"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, InteractiveCard } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import {
  IconArrowRight,
  IconBackpack,
  IconClipboard,
  QUESTION_TYPE_ICONS,
} from "@/components/ui/Icons";
import { activitiesApi, classesApi } from "@/lib/api";
import { QUESTION_TYPE_LABELS, activityQuestionTypes, yearLabel } from "@/lib/labels";
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
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-student-dark">
            <IconBackpack size={16} />
            Sem senha, só escolher e responder
          </span>
          <h1 className="heading-poster text-4xl text-gray-900">
            Atividades de Informática
          </h1>
          <p className="text-base font-medium text-gray-600">
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
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-500">
              Escolher ano
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {classList.map((schoolClass) => {
                const active = schoolClass._id === classId;
                return (
                  <button
                    key={schoolClass._id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(schoolClass._id)}
                    className={`flex min-h-28 flex-col items-center justify-center gap-1 rounded-2xl border-4 px-4 py-4 text-center shadow-sm transition-all duration-150 ${
                      active
                        ? "border-student bg-student text-white shadow-md"
                        : "border-gray-900 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md"
                    }`}
                  >
                    <span
                      className={`text-3xl font-extrabold ${
                        active ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {schoolClass.year}º
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        active ? "text-white/90" : "text-gray-700"
                      }`}
                    >
                      {schoolClass.name}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        active ? "text-white/80" : "text-gray-500"
                      }`}
                    >
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
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-500">
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
                const types = activityQuestionTypes(activity);
                const TypeIcon = QUESTION_TYPE_ICONS[types[0] ?? "text"];
                return (
                  <li key={activity._id}>
                    <InteractiveCard className="flex flex-wrap items-center gap-4 border-2 border-student p-5">
                      <span
                        aria-hidden
                        className="grid size-14 shrink-0 place-items-center rounded-xl border-2 border-gray-900 bg-student-light text-student-dark"
                      >
                        <TypeIcon size={26} />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-lg font-extrabold text-gray-900">
                          {activity.title}
                        </span>
                        {activity.description && (
                          <span className="text-sm font-medium text-gray-600">
                            {activity.description}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {types.map((type) => (
                            <Badge key={type} tone="student">
                              {QUESTION_TYPE_LABELS[type]}
                            </Badge>
                          ))}
                        </div>
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
