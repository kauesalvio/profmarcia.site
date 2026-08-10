import { PageHeader } from "@/components/layout/Header";
import { ActivityForm } from "@/components/professor/ActivityForm";

export default function NewActivityPage() {
  return (
    <>
      <span className="inline-block w-fit -rotate-1 rounded-xl bg-coral px-3 py-1 text-xs font-black uppercase tracking-widest text-marinho adesivo-sm">
        Nova atividade
      </span>
      <PageHeader
        title="Montar atividade"
        description="Quatro etapas curtas: defina as informações, escolha as turmas, monte as perguntas e revise."
      />
      <ActivityForm />
    </>
  );
}
