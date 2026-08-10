"use client";

import Link from "next/link";
import { Alert } from "@/components/ui/Feedback";
import {
  IconArrowRight,
  IconChart,
  IconClipboard,
  IconPlus,
  IconUsers,
} from "@/components/ui/Icons";
import { activitiesApi, classesApi, responsesApi } from "@/lib/api";
import { activityQuestionTypes } from "@/lib/labels";
import { useResource } from "@/lib/useResource";

const SHORTCUTS = [
  {
    href: "/professor/classes",
    icon: IconUsers,
    title: "Turmas",
    note: "Organize anos e turmas",
    surface: "bg-creme text-marinho",
    iconSurface: "bg-eletrico text-creme",
    arrowSurface: "bg-marinho text-creme",
  },
  {
    href: "/professor/atividades",
    icon: IconClipboard,
    title: "Atividades",
    note: "Crie e edite atividades",
    surface: "bg-eletrico text-creme",
    iconSurface: "bg-creme text-marinho",
    arrowSurface: "bg-amarelo text-marinho",
  },
  {
    href: "/professor/analise",
    icon: IconChart,
    title: "Ver respostas",
    note: "Acompanhe as entregas",
    surface: "bg-amarelo text-marinho",
    iconSurface: "bg-marinho text-creme",
    arrowSurface: "bg-creme text-marinho",
  },
] as const;

export default function ProfessorDashboardPage() {
  const classes = useResource(() => classesApi.list());
  const activities = useResource(() => activitiesApi.list(undefined, true));
  const responses = useResource(() => responsesApi.list());

  const classList = classes.data ?? [];
  const activityList = activities.data ?? [];
  const responseList = responses.data ?? [];
  const typeCount = new Set(activityList.flatMap(activityQuestionTypes)).size;
  const loading = classes.loading || activities.loading || responses.loading;
  const failed = classes.error || activities.error || responses.error;
  const indicators = [
    { label: "Atividades", value: activityList.length, note: "criadas na bancada", color: "bg-eletrico text-creme" },
    { label: "Entregas", value: responseList.length, note: "respostas recebidas", color: "bg-amarelo text-marinho" },
    { label: "Turmas", value: classList.length, note: "anos cadastrados", color: "bg-lima text-marinho" },
    { label: "Formatos", value: typeCount, note: "tipos já utilizados", color: "bg-coral text-marinho" },
  ];

  return (
    <>
      <section className="grid animate-rise gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end">
        <div className="min-w-0">
          <span className="inline-block -rotate-1 rounded-xl bg-eletrico px-3 py-1 text-xs font-black uppercase tracking-widest text-creme adesivo-sm">
            Bem-vinda de volta
          </span>
          <h1 className="mt-4 titulo-caixa text-4xl text-creme sm:text-6xl">
            Bancada da
            <br />
            <span className="text-amarelo">Professora Márcia</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-creme/75">
            Turmas, atividades e respostas reunidas para você preparar a próxima experiência da aula.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/professor/atividades/nova"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-amarelo px-6 py-3 font-black uppercase tracking-wide text-marinho adesivo transition-transform hover:-translate-y-0.5"
            >
              <IconPlus size={20} /> Criar atividade
            </Link>
            <Link
              href="/aluno"
              className="inline-flex min-h-12 items-center rounded-2xl border-2 border-creme/40 px-5 py-3 text-sm font-bold text-creme transition-colors hover:bg-marinho-2"
            >
              Ver como o aluno vê
            </Link>
          </div>
        </div>

        <div className="min-w-0 rotate-1 rounded-3xl bg-creme p-5 text-marinho adesivo">
          <p className="text-xs font-black uppercase tracking-widest text-marinho/60">Quadro de hoje</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold">
            <li className="flex items-center gap-3"><span aria-hidden className="size-3 shrink-0 rounded-full bg-eletrico" /> Organize as turmas da semana</li>
            <li className="flex items-center gap-3"><span aria-hidden className="size-3 shrink-0 rounded-full bg-amarelo" /> Prepare uma nova atividade</li>
            <li className="flex items-center gap-3"><span aria-hidden className="size-3 shrink-0 rounded-full bg-lima" /> Confira as respostas recebidas</li>
          </ul>
          <p className="mt-4 border-t-2 border-dashed border-marinho/25 pt-3 text-xs text-marinho/70">
            Escolha uma tarefa para começar.
          </p>
        </div>
      </section>

      {failed && (
        <Alert tone="warning">Alguns indicadores não puderam ser atualizados agora.</Alert>
      )}

      <section aria-labelledby="indicadores" className="mt-4">
        <h2 id="indicadores" className="titulo-caixa text-2xl text-creme">Indicadores</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map((indicator, index) => (
            <li
              key={indicator.label}
              className={`rounded-3xl bg-creme p-5 text-marinho adesivo ${index % 2 === 0 ? "lg:-translate-y-2" : ""}`}
            >
              <span className={`inline-block rounded-lg px-2 py-1 text-[11px] font-black uppercase tracking-widest ${indicator.color}`}>
                {indicator.label}
              </span>
              <p className="mt-3 titulo-caixa text-5xl">{loading ? "—" : indicator.value}</p>
              <p className="mt-1 text-sm font-semibold text-marinho/70">{indicator.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="atalhos" className="mt-8">
        <h2 id="atalhos" className="titulo-caixa text-2xl text-creme">Atalhos</h2>
        <ul className="mt-4 grid gap-5 md:grid-cols-3">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.href}>
              <Link
                href={shortcut.href}
                className={`group flex min-h-56 flex-col justify-between rounded-3xl p-6 adesivo transition-transform hover:-translate-y-1 active:translate-y-0 ${shortcut.surface}`}
              >
                <span
                  aria-hidden
                  className={`grid size-16 place-items-center rounded-2xl ${shortcut.iconSurface}`}
                >
                  <shortcut.icon size={30} />
                </span>

                <span className="mt-8 flex items-end justify-between gap-4">
                  <span className="min-w-0">
                    <span className="titulo-caixa block text-2xl">{shortcut.title}</span>
                    <span className="mt-2 block text-sm font-bold opacity-70">{shortcut.note}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`grid size-11 shrink-0 place-items-center rounded-full ${shortcut.arrowSurface}`}
                  >
                    <IconArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
