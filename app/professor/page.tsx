import Link from "next/link";
import { PageHeader } from "@/components/layout/Header";
import { InteractiveCard } from "@/components/ui/Card";
import {
  IconArrowRight,
  IconChart,
  IconClipboard,
  IconLink,
  IconPlus,
  IconUsers,
} from "@/components/ui/Icons";

const ACTIONS = [
  {
    href: "/professor/classes",
    title: "Turmas",
    description: "Cadastre e organize as turmas do 1º ao 9º ano.",
    icon: IconUsers,
    accent: "bg-primary-light text-primary-dark",
  },
  {
    href: "/professor/atividades/nova",
    title: "Criar atividade",
    description: "Misture quiz, formulário, cruzadinha e caça-palavra em uma atividade.",
    icon: IconPlus,
    accent: "bg-student-light text-student-dark",
  },
  {
    href: "/professor/atividades",
    title: "Atividades",
    description: "Veja, edite ou exclua as atividades já criadas.",
    icon: IconClipboard,
    accent: "bg-info-bg text-primary-dark",
  },
  {
    href: "/professor/analise",
    title: "Ver respostas",
    description: "Acompanhe as respostas enviadas em cada atividade.",
    icon: IconChart,
    accent: "bg-warning-bg text-gray-900",
  },
];

export default function ProfessorDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Painel"
        title="Bem-vinda de volta!"
        description="Escolha o que deseja fazer agora."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <InteractiveCard key={action.href} className="p-0">
              <Link href={action.href} className="group flex h-full flex-col gap-4 rounded-xl p-5">
                <span
                  aria-hidden
                  className={`grid size-11 place-items-center rounded-lg ${action.accent}`}
                >
                  <Icon size={22} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                    {action.title}
                    <IconArrowRight
                      size={18}
                      className="text-gray-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </span>
                  <span className="text-sm leading-relaxed text-gray-500">
                    {action.description}
                  </span>
                </span>
              </Link>
            </InteractiveCard>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-soft-lg">
        <div aria-hidden className="dot-grid absolute inset-0 text-white/60" />
        <div className="relative flex flex-wrap items-center gap-4">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-lg bg-white/15"
          >
            <IconLink size={22} />
          </span>
          <div className="flex min-w-48 flex-1 flex-col gap-1">
            <h2 className="text-lg font-semibold">Link para os alunos</h2>
            <p className="text-sm leading-relaxed text-white/85">
              Os alunos não precisam de senha. Compartilhe o endereço abaixo para que
              escolham o ano e respondam as atividades.
            </p>
          </div>
          <Link
            href="/aluno"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-primary-dark shadow-sm transition-transform duration-150 hover:-translate-y-0.5"
          >
            /aluno
            <IconArrowRight size={17} />
          </Link>
        </div>
      </div>
    </>
  );
}
