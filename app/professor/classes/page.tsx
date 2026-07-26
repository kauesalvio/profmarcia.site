"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/Header";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
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

  const classes = data ?? [];

  return (
    <>
      <PageHeader
        title="Turmas"
        description="Turmas do 1º ao 9º ano usadas na distribuição das atividades."
        action={<ButtonLink href="/professor/classes/nova">Nova turma</ButtonLink>}
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
          message="Nenhuma turma cadastrada. Crie a primeira turma."
          action={<ButtonLink href="/professor/classes/nova">Nova turma</ButtonLink>}
        />
      )}

      {!loading && !error && classes.length > 0 && (
        <ul className="flex flex-col gap-3">
          {classes.map((schoolClass) => (
            <li key={schoolClass._id}>
              <Card className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-gray-900">
                    {schoolClass.name}
                  </span>
                  <Badge tone="primary">{yearLabel(schoolClass.year)}</Badge>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                  <ButtonLink
                    href={`/professor/classes/${schoolClass._id}/editar`}
                    variant="secondary"
                  >
                    Editar
                  </ButtonLink>
                  <Button
                    variant="danger"
                    disabled={removingId === schoolClass._id}
                    onClick={() => void handleRemove(schoolClass._id, schoolClass.name)}
                  >
                    {removingId === schoolClass._id ? "Excluindo..." : "Excluir"}
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
