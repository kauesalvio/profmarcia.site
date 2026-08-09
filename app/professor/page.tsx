import Link from "next/link";
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
    description: "Cadastre e organize os anos das suas turmas.",
    icon: IconUsers,
  },
  {
    href: "/professor/atividades/nova",
    title: "Nova atividade",
    description: "Monte uma atividade com diferentes tipos de pergunta.",
    icon: IconPlus,
  },
  {
    href: "/professor/atividades",
    title: "Atividades",
    description: "Veja e organize o que já foi criado.",
    icon: IconClipboard,
  },
  {
    href: "/professor/analise",
    title: "Ver respostas",
    description: "Acompanhe as respostas enviadas pelos alunos.",
    icon: IconChart,
  },
];

export default function ProfessorDashboardPage() {
  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Link
          href="/professor/atividades/nova"
          className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border-2 border-gray-900 bg-primary p-6 text-white shadow-hard transition-all duration-150 hover:-translate-y-1 hover:shadow-lg sm:p-8"
        >
          <span aria-hidden className="dot-grid absolute inset-0 text-white/30" />
          <span className="relative flex size-14 items-center justify-center rounded-xl border-2 border-gray-900 bg-white text-primary shadow-md">
            <IconPlus size={30} />
          </span>
          <span className="relative flex flex-col gap-2">
            <span className="flex items-center gap-3 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Criar atividade
              <IconArrowRight
                size={28}
                className="transition-transform duration-150 group-hover:translate-x-1"
              />
            </span>
            <span className="max-w-md text-base font-semibold leading-relaxed text-white/85">
              Monte uma atividade com quiz, formulário, cruzadinha ou caça-palavra.
            </span>
          </span>
        </Link>

        <nav
          aria-label="Atalhos da professora"
          className="divide-y-2 divide-gray-200 rounded-2xl border-2 border-gray-900 bg-white px-5"
        >
          {ACTIONS.filter((action) => action.href !== "/professor/atividades/nova").map(
            (action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex min-h-[5.5rem] items-center gap-4 py-4 first:pt-5 last:pb-5"
                >
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-lg bg-gray-100 text-primary transition-colors group-hover:bg-primary group-hover:text-white"
                  >
                    <Icon size={21} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-base font-extrabold uppercase tracking-wide text-gray-900">
                      {action.title}
                    </span>
                    <span className="text-sm font-medium leading-snug text-gray-500">
                      {action.description}
                    </span>
                  </span>
                  <IconArrowRight
                    size={19}
                    className="shrink-0 text-gray-400 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              );
            },
          )}
        </nav>
      </section>

      <div className="relative overflow-hidden rounded-2xl border-2 border-gray-900 bg-student p-5 text-white shadow-md sm:p-6">
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
              Os alunos não precisam de senha. Compartilhe o endereço abaixo para que escolham
              o ano e respondam as atividades.
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
