"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/Header";
import { ActivityForm } from "@/components/professor/ActivityForm";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { activitiesApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";

export default function EditActivityPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading, reload } = useResource(() => activitiesApi.get(id), id);

  return (
    <>
      <PageHeader title="Editar atividade" description="Atualize os dados e as perguntas." />

      {loading && <Spinner label="Carregando atividade..." />}

      {error && !loading && (
        <Alert
          tone="error"
          action={
            <Button variant="secondary" onClick={reload}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar a atividade.
        </Alert>
      )}

      {!loading && !error && !data && (
        <EmptyState
          message="Atividade não encontrada."
          action={<ButtonLink href="/professor/atividades">Voltar para atividades</ButtonLink>}
        />
      )}

      {data && <ActivityForm activity={data} />}
    </>
  );
}
