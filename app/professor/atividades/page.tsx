"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Field, Select } from "@/components/ui/Field";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { activitiesApi, classesApi } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS, formatDateTime, yearLabel } from "@/lib/labels";
import { useResource } from "@/lib/useResource";

export default function ActivitiesPage() {
  const [classId, setClassId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const classes = useResource(() => classesApi.list());
  const activities = useResource(() => activitiesApi.list(classId || undefined), classId);

  const classNames = new Map((classes.data ?? []).map((item) => [item._id, item]));

  async function handleRemove(id: string, title: string) {
    if (!window.confirm(`Excluir a atividade "${title}"?`)) return;

    setFeedback(null);
    setRemovingId(id);
    try {
      await activitiesApi.remove(id);
      setFeedback(`Atividade "${title}" excluída.`);
      activities.reload();
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : "Não foi possível excluir a atividade.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  const list = activities.data ?? [];

  return (
    <>
      <PageHeader
        title="Atividades"
        description="Atividades criadas e os anos em que estão disponíveis."
        action={<ButtonLink href="/professor/atividades/nova">Nova atividade</ButtonLink>}
      />

      {feedback && <Alert tone="success">{feedback}</Alert>}

      <Card className="max-w-sm">
        <Field label="Filtrar por ano/turma" htmlFor="filter-class">
          <Select
            id="filter-class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Todas as turmas</option>
            {(classes.data ?? []).map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} — {yearLabel(item.year)}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

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
          message="Nenhuma atividade criada."
          action={<ButtonLink href="/professor/atividades/nova">Nova atividade</ButtonLink>}
        />
      )}

      {!activities.loading && !activities.error && list.length > 0 && (
        <ul className="flex flex-col gap-3">
          {list.map((activity) => (
            <li key={activity._id}>
              <Card className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-gray-900">{activity.title}</h2>
                    {activity.description && (
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    )}
                  </div>
                  <Badge tone="primary">{ACTIVITY_TYPE_LABELS[activity.type]}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">Disponível para:</span>
                  {activity.classIds.map((id) => (
                    <Badge key={id}>
                      {classNames.get(id)?.name ?? "Turma removida"}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500">
                    Criada em {formatDateTime(activity.createdAt)}
                  </span>
                  <div className="ml-auto flex flex-wrap gap-2">
                    <ButtonLink href={`/professor/analise/${activity._id}`}>
                      Ver respostas
                    </ButtonLink>
                    <ButtonLink
                      href={`/professor/atividades/${activity._id}/editar`}
                      variant="secondary"
                    >
                      Editar
                    </ButtonLink>
                    <Button
                      variant="danger"
                      disabled={removingId === activity._id}
                      onClick={() => void handleRemove(activity._id, activity.title)}
                    >
                      {removingId === activity._id ? "Excluindo..." : "Excluir"}
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
