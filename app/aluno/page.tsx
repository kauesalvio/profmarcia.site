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
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-9 px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid animate-rise gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
          <span className="inline-flex rotate-1 items-center gap-2 rounded-xl bg-lima px-3 py-1 text-xs font-black uppercase tracking-widest text-marinho adesivo-sm">
            <IconBackpack size={16} />
            Área do aluno
          </span>
          <h1 className="mt-4 titulo-caixa text-4xl text-creme sm:text-5xl">
            Minhas atividades
          </h1>
          <p className="mt-3 max-w-lg text-base text-creme/75">
            Escolha sua turma para ver o que a Professora Márcia preparou.
          </p>
          </div>
          {current && (
            <div className="rounded-3xl bg-creme px-5 py-4 text-marinho adesivo">
              <p className="text-xs font-black uppercase tracking-widest text-marinho/60">Turma atual</p>
              <p className="titulo-caixa text-2xl">{current.name}</p>
              <p className="text-sm font-semibold text-marinho/70">{yearLabel(current.year)}</p>
            </div>
          )}
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
          <section className="flex flex-col gap-4">
            <h2 className="titulo-caixa text-2xl text-creme">
              Escolha a turma
            </h2>
            <div role="radiogroup" aria-label="Escolha a turma" className="flex flex-wrap gap-3">
              {classList.map((schoolClass, index) => {
                const active = schoolClass._id === classId;
                const activeColor = ["bg-eletrico text-creme", "bg-coral text-marinho", "bg-lima text-marinho", "bg-amarelo text-marinho"][index % 4];
                return (
                  <button
                    key={schoolClass._id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => choose(schoolClass._id)}
                    className={`min-h-12 rounded-2xl px-5 py-3 text-sm uppercase tracking-wide transition-all duration-150 ${
                      active
                        ? `${activeColor} font-black adesivo`
                        : "border-2 border-creme/30 font-bold text-creme/80 hover:bg-marinho-2 hover:text-creme"
                    }`}
                  >
                    {schoolClass.name}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {current && (
          <section className="flex animate-rise flex-col gap-4">
            <h2 className="titulo-caixa text-2xl text-creme">
              Para fazer — {current.name}
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

            <ul className="grid gap-5 md:grid-cols-2">
              {list.map((activity, index) => {
                const types = activityQuestionTypes(activity);
                const TypeIcon = QUESTION_TYPE_ICONS[types[0] ?? "text"];
                return (
                  <li key={activity._id}>
                    <InteractiveCard className={`flex h-full flex-col items-start gap-4 p-6 ${index % 2 === 1 ? "md:translate-y-4" : ""}`}>
                      <span
                        aria-hidden
                        className="grid size-12 shrink-0 place-items-center rounded-xl bg-lima text-marinho adesivo-sm"
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
                        className="mt-auto w-full"
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
