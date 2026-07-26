import { PageHeader } from "@/components/layout/Header";
import { ClassForm } from "@/components/professor/ClassForm";

export default function NewClassPage() {
  return (
    <>
      <PageHeader
        eyebrow="Turmas"
        title="Nova turma"
        description="Informe o nome e o ano da turma."
      />
      <ClassForm />
    </>
  );
}
