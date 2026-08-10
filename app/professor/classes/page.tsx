"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { InteractiveCard } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { IconPencil, IconPlus, IconTrash, IconUsers } from "@/components/ui/Icons";
import { classesApi } from "@/lib/api";
import { yearLabel } from "@/lib/labels";
import { useResource } from "@/lib/useResource";

export default function ClassesPage() {
  const { data, error, loading, reload } = useResource(() => classesApi.list());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleRemove(id: string, name: string) {
    if (!window.confirm(`Excluir a turma "${name}"?`)) return;

    setFeedback(null);
    setRemovingId(id);
    try {
      await classesApi.remove(id);
      setFeedback(`Turma "${name}" excluída.`);
      reload();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Não foi possível excluir a turma.");
    } finally {
      setRemovingId(null);
    }
  }

  const classes = [...(data ?? [])].sort(
    (a, b) => a.year - b.year || a.name.localeCompare(b.name),
  );

  return (
    <>
      <PageHeader
        title="Turmas"
        description="Turmas do 1º ao 9º ano usadas na distribuição das atividades."
        action={
          <ButtonLink href="/professor/classes/nova">
            <IconPlus size={18} />
            Nova turma
          </ButtonLink>
        }
      />

      {feedback && <Alert tone="success">{feedback}</Alert>}

      {loading && <Spinner label="Carregando turmas..." />}

      {error && !loading && (
        <Alert
          tone="error"
          action={
            <Button variant="secondary" onClick={reload}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar as turmas.
        </Alert>
      )}

      {!loading && !error && classes.length === 0 && (
        <EmptyState
          icon={<IconUsers size={28} />}
          message="Nenhuma turma cadastrada. Crie a primeira turma."
          action={
            <ButtonLink href="/professor/classes/nova">
              <IconPlus size={18} />
              Nova turma
            </ButtonLink>
          }
        />
      )}

      {!loading && !error && classes.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {classes.map((schoolClass) => (
            <li key={schoolClass._id}>
              <InteractiveCard className="flex items-center gap-4 border-[3px] border-tinta p-5">
                <span
                  aria-hidden
                  className="grid size-14 shrink-0 place-items-center rounded-xl border-2 border-gray-900 bg-primary-light text-2xl font-extrabold text-primary-dark"
                >
                  {schoolClass.year}º
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-lg font-extrabold text-gray-900">
                    {schoolClass.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">{yearLabel(schoolClass.year)}</span>
                </div>
                <div className="ml-auto flex shrink-0 gap-2">
                  <ButtonLink
                    href={`/professor/classes/${schoolClass._id}/editar`}
                    variant="secondary"
                    size="sm"
                    aria-label={`Editar turma ${schoolClass.name}`}
                  >
                    <IconPencil size={16} />
                    <span className="hidden sm:inline">Editar</span>
                  </ButtonLink>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={removingId === schoolClass._id}
                    aria-label={`Excluir turma ${schoolClass.name}`}
                    onClick={() => void handleRemove(schoolClass._id, schoolClass.name)}
                  >
                    <IconTrash size={16} />
                    <span className="hidden sm:inline">
                      {removingId === schoolClass._id ? "Excluindo..." : "Excluir"}
                    </span>
                  </Button>
                </div>
              </InteractiveCard>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
