"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/Header";
import { ClassForm } from "@/components/professor/ClassForm";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { classesApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";

export default function EditClassPage() {
  const { id } = useParams<{ id: string }>();
  // GET /api/classes lista todas as turmas; buscamos a turma editada nessa lista.
  const { data, error, loading, reload } = useResource(
    () => classesApi.list().then((classes) => classes.find((item) => item._id === id) ?? null),
    id,
  );

  return (
    <>
      <PageHeader
        title="Editar turma"
        description="Atualize o nome ou o ano da turma."
      />

      {loading && <Spinner label="Carregando turma..." />}

      {error && !loading && (
        <Alert
          tone="error"
          action={
            <Button variant="secondary" onClick={reload}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar a turma.
        </Alert>
      )}

      {!loading && !error && !data && (
        <EmptyState
          message="Turma não encontrada."
          action={<ButtonLink href="/professor/classes">Voltar para turmas</ButtonLink>}
        />
      )}

      {data && <ClassForm schoolClass={data} />}
    </>
  );
}
