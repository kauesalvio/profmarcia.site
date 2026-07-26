"use client";

import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { activitiesApi } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS, formatDateTime } from "@/lib/labels";
import { useResource } from "@/lib/useResource";

export default function AnalysisIndexPage() {
  const { data, error, loading, reload } = useResource(() => activitiesApi.list());
  const activities = data ?? [];

  return (
    <>
      <PageHeader
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
          message="Nenhuma atividade criada."
          action={<ButtonLink href="/professor/atividades/nova">Nova atividade</ButtonLink>}
        />
      )}

      {!loading && !error && activities.length > 0 && (
        <ul className="flex flex-col gap-3">
          {activities.map((activity) => (
            <li key={activity._id}>
              <Card className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-gray-900">{activity.title}</span>
                  <span className="text-xs text-gray-500">
                    Criada em {formatDateTime(activity.createdAt)}
                  </span>
                </div>
                <Badge tone="primary">{ACTIVITY_TYPE_LABELS[activity.type]}</Badge>
                <ButtonLink className="ml-auto" href={`/professor/analise/${activity._id}`}>
                  Ver respostas
                </ButtonLink>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
