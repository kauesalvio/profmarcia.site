"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, InteractiveCard } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import {
  ACTIVITY_TYPE_ICONS,
  IconArrowRight,
  IconChart,
  IconClock,
  IconPlus,
} from "@/components/ui/Icons";
import { activitiesApi } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS, formatDateTime } from "@/lib/labels";
import { useResource } from "@/lib/useResource";

export default function AnalysisIndexPage() {
  const { data, error, loading, reload } = useResource(() => activitiesApi.list());
  const activities = data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Análise"
        title="Ver respostas"
        description="Selecione uma atividade para ver a situação dos alunos."
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
            const TypeIcon = ACTIVITY_TYPE_ICONS[activity.type];
            return (
              <li key={activity._id}>
                <InteractiveCard className="p-0">
                  <Link
                    href={`/professor/analise/${activity._id}`}
                    className="group flex flex-wrap items-center gap-4 rounded-xl p-5"
                  >
                    <span
                      aria-hidden
                      className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-light text-primary-dark"
                    >
                      <TypeIcon size={22} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </span>
                        <Badge tone="primary">{ACTIVITY_TYPE_LABELS[activity.type]}</Badge>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <IconClock size={14} />
                        Criada em {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                      Ver respostas
                      <IconArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
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
