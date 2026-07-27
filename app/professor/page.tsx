import Link from "next/link";
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
    border: "border-primary",
  },
  {
    href: "/professor/atividades/nova",
    title: "Criar atividade",
    description: "Misture quiz, formulário, cruzadinha e caça-palavra.",
    icon: IconPlus,
    accent: "bg-student-light text-student-dark",
    border: "border-student",
  },
  {
    href: "/professor/atividades",
    title: "Atividades",
    description: "Veja, edite ou exclua as atividades já criadas.",
    icon: IconClipboard,
    accent: "bg-info-bg text-info",
    border: "border-info",
  },
  {
    href: "/professor/analise",
    title: "Ver respostas",
    description: "Acompanhe as respostas enviadas em cada atividade.",
    icon: IconChart,
    accent: "bg-warning-bg text-warning",
    border: "border-warning",
  },
];

export default function ProfessorDashboardPage() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <InteractiveCard
              key={action.href}
              className={`border-2 ${action.border} p-0`}
            >
              <Link
                href={action.href}
                className="group flex h-full flex-col gap-4 rounded-xl p-5"
              >
                <span
                  aria-hidden
                  className={`grid size-12 place-items-center rounded-lg border-2 border-gray-900 ${action.accent} shadow-sm`}
                >
                  <Icon size={24} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-wide text-gray-900">
                    {action.title}
                    <IconArrowRight
                      size={20}
                      className="text-gray-400 transition-all duration-150 group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {action.description}
                  </span>
                </span>
              </Link>
            </InteractiveCard>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-2xl border-4 border-gray-900 bg-student p-6 text-white shadow-hard">
        <div aria-hidden className="dot-grid absolute inset-0 text-white/40" />
        <div className="relative flex flex-wrap items-center gap-4">
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-white bg-white/15"
          >
            <IconLink size={24} />
          </span>
          <div className="flex min-w-48 flex-1 flex-col gap-1">
            <h2 className="text-lg font-extrabold uppercase tracking-wide">
              Link para os alunos
            </h2>
            <p className="text-sm font-semibold leading-relaxed text-white/90">
              Os alunos não precisam de senha. Compartilhe o endereço abaixo para que
              escolham o ano e respondam as atividades.
            </p>
          </div>
          <Link
            href="/aluno"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-gray-900 bg-white px-5 py-3 font-extrabold uppercase tracking-wide text-student-dark shadow-sm transition-all duration-150 hover:-translate-y-0.5"
          >
            /aluno
            <IconArrowRight size={18} />
          </Link>
        </div>
      </div>
    </>
  );
}
