"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const PROFESSOR_LINKS = [
  { href: "/professor/classes", label: "Turmas" },
  { href: "/professor/atividades", label: "Atividades" },
  { href: "/professor/analise", label: "Ver respostas" },
];

export function Header({
  variant,
  action,
}: {
  variant: "professor" | "aluno";
  action?: ReactNode;
}) {
  const pathname = usePathname();
  const isProfessor = variant === "professor";

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
        <Link
          href={isProfessor ? "/professor" : "/aluno"}
          className="flex items-center gap-2 text-lg font-bold text-gray-900"
        >
          <span
            aria-hidden
            className={`grid size-8 place-items-center rounded-md text-sm font-bold text-white ${
              isProfessor ? "bg-primary" : "bg-student"
            }`}
          >
            AI
          </span>
          Aulas de Informática
        </Link>

        {isProfessor && (
          <nav aria-label="Área da professora" className="flex flex-wrap items-center gap-1">
            {PROFESSOR_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-primary-light text-primary-dark"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">{action}</div>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="text-base text-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
