"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, InteractiveCard } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import {
  IconArrowRight,
  IconChart,
  IconClock,
  IconPlus,
  QUESTION_TYPE_ICONS,
} from "@/components/ui/Icons";
import { activitiesApi } from "@/lib/api";
import {
  QUESTION_TYPE_LABELS,
  activityQuestionTypes,
  formatDateTime,
} from "@/lib/labels";
import { useResource } from "@/lib/useResource";

export default function AnalysisIndexPage() {
  const { data, error, loading, reload } = useResource(() => activitiesApi.list(undefined, true));
  const activities = data ?? [];

  return (
    <>
      <PageHeader
        title="Ver respostas"
        description="Selecione uma atividade para ver as respostas enviadas."
      />

      {loading && <Spinner label="Carregando atividades..." />}

      {error && !loading && (
        <Alert
          tone="error"
          action={
            <Button variant="secondary" onClick={reload}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar as atividades. Tente novamente.
        </Alert>
      )}

      {!loading && !error && activities.length === 0 && (
        <EmptyState
          icon={<IconChart size={28} />}
          message="Nenhuma atividade criada."
          action={
            <ButtonLink href="/professor/atividades/nova">
              <IconPlus size={18} />
              Nova atividade
            </ButtonLink>
          }
        />
      )}

      {!loading && !error && activities.length > 0 && (
        <ul className="flex flex-col gap-3">
          {activities.map((activity) => {
            const types = activityQuestionTypes(activity);
            const TypeIcon = QUESTION_TYPE_ICONS[types[0] ?? "text"];
            return (
              <li key={activity._id}>
                <InteractiveCard className="border-[3px] border-tinta p-0">
                  <Link
                    href={`/professor/analise/${activity._id}`}
                    className="group flex flex-wrap items-center gap-4 rounded-xl p-5"
                  >
                    <span
                      aria-hidden
                      className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-gray-900 bg-primary-light text-primary-dark"
                    >
                      <TypeIcon size={24} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-extrabold text-gray-900">
                          {activity.title}
                        </span>
                        {types.map((type) => (
                          <Badge key={type} tone="primary">
                            {QUESTION_TYPE_LABELS[type]}
                          </Badge>
                        ))}
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <IconClock size={14} />
                        Criada em {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary">
                      Ver respostas
                      <IconArrowRight
                        size={18}
                        className="transition-transform duration-150 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </InteractiveCard>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
