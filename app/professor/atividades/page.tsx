"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, InteractiveCard } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import {
  IconChart,
  IconClipboard,
  IconClock,
  IconPencil,
  IconPlus,
  IconTrash,
  QUESTION_TYPE_ICONS,
} from "@/components/ui/Icons";
import { activitiesApi, classesApi } from "@/lib/api";
import {
  QUESTION_TYPE_LABELS,
  activityQuestionTypes,
  formatDateTime,
  yearLabel,
} from "@/lib/labels";
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
        eyebrow="Gerenciamento"
        title="Atividades"
        description="Atividades criadas e os anos em que estão disponíveis."
        action={
          <ButtonLink href="/professor/atividades/nova">
            <IconPlus size={18} />
            Nova atividade
          </ButtonLink>
        }
      />

      {feedback && <Alert tone="success">{feedback}</Alert>}

      <div className="flex max-w-sm items-center gap-3">
        <label
          htmlFor="filter-class"
          className="shrink-0 text-sm font-extrabold uppercase tracking-wide text-gray-900"
        >
          Filtrar
        </label>
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
      </div>

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
          message="Nenhuma atividade criada."
          action={
            <ButtonLink href="/professor/atividades/nova">
              <IconPlus size={18} />
              Nova atividade
            </ButtonLink>
          }
        />
      )}

      {!activities.loading && !activities.error && list.length > 0 && (
        <ul className="flex flex-col gap-3">
          {list.map((activity) => {
            const types = activityQuestionTypes(activity);
            const TypeIcon = QUESTION_TYPE_ICONS[types[0] ?? "text"];
            return (
              <li key={activity._id}>
                <InteractiveCard className="flex flex-col gap-4 border-2 border-primary p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <span
                      aria-hidden
                      className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-gray-900 bg-primary-light text-primary-dark"
                    >
                      <TypeIcon size={24} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-extrabold text-gray-900">
                          {activity.title}
                        </h2>
                        {types.map((type) => (
                          <Badge key={type} tone="primary">
                            {QUESTION_TYPE_LABELS[type]}
                          </Badge>
                        ))}
                      </div>
                      {activity.description && (
                        <p className="text-sm font-medium text-gray-600">{activity.description}</p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Disponível:</span>
                        {activity.classIds.map((id) => (
                          <Badge key={id}>
                            {classNames.get(id)?.name ?? "Turma removida"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t-2 border-gray-100 pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <IconClock size={14} />
                      Criada em {formatDateTime(activity.createdAt)}
                    </span>
                    <div className="ml-auto flex flex-wrap gap-2">
                      <ButtonLink href={`/professor/analise/${activity._id}`} size="sm">
                        <IconChart size={16} />
                        Ver respostas
                      </ButtonLink>
                      <ButtonLink
                        href={`/professor/atividades/${activity._id}/editar`}
                        variant="secondary"
                        size="sm"
                      >
                        <IconPencil size={16} />
                        Editar
                      </ButtonLink>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={removingId === activity._id}
                        onClick={() => void handleRemove(activity._id, activity.title)}
                      >
                        <IconTrash size={16} />
                        {removingId === activity._id ? "Excluindo..." : "Excluir"}
                      </Button>
                    </div>
                  </div>
                </InteractiveCard>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
