import { PageHeader } from "@/components/layout/Header";
import { ActivityForm } from "@/components/professor/ActivityForm";

export default function NewActivityPage() {
  return (
    <>
      <PageHeader
        title="Nova atividade"
        description="Escolha o tipo, configure as perguntas e selecione os anos que vão receber."
      />
      <ActivityForm />
    </>
  );
}
