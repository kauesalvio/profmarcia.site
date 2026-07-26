import Link from "next/link";
import { PageHeader } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";

const ACTIONS = [
  {
    href: "/professor/classes",
    title: "Turmas",
    description: "Cadastre e organize as turmas do 1º ao 9º ano.",
  },
  {
    href: "/professor/atividades/nova",
    title: "Criar atividade",
    description: "Monte um quiz ou formulário e escolha para quais anos enviar.",
  },
  {
    href: "/professor/atividades",
    title: "Atividades",
    description: "Veja, edite ou exclua as atividades já criadas.",
  },
  {
    href: "/professor/analise",
    title: "Ver respostas",
    description: "Acompanhe quem respondeu e o que cada aluno respondeu.",
  },
];

export default function ProfessorDashboardPage() {
  return (
    <>
      <PageHeader
        title="Painel da professora"
        description="Escolha o que deseja fazer agora."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {ACTIONS.map((action) => (
          <Card key={action.href} className="p-0 transition-shadow duration-200 hover:shadow-md">
            <Link href={action.href} className="flex h-full flex-col gap-2 rounded-md p-5">
              <span className="text-xl font-semibold text-gray-900">{action.title}</span>
              <span className="text-sm text-gray-500">{action.description}</span>
            </Link>
          </Card>
        ))}
      </div>

      <Card className="bg-primary-light">
        <h2 className="text-lg font-semibold text-gray-900">Link para os alunos</h2>
        <p className="mt-2 text-sm text-gray-700">
          Os alunos não precisam de senha. Compartilhe o endereço{" "}
          <Link href="/aluno" className="font-semibold text-primary-dark underline">
            /aluno
          </Link>{" "}
          para que escolham o ano e respondam as atividades.
        </p>
      </Card>
    </>
  );
}
