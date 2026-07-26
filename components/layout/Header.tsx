"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  IconChart,
  IconClipboard,
  IconMonitor,
  IconUsers,
} from "@/components/ui/Icons";

const PROFESSOR_LINKS = [
  { href: "/professor/classes", label: "Turmas", icon: IconUsers },
  { href: "/professor/atividades", label: "Atividades", icon: IconClipboard },
  { href: "/professor/analise", label: "Ver respostas", icon: IconChart },
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
    <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link
          href={isProfessor ? "/professor" : "/aluno"}
          className="flex items-center gap-2.5 rounded-md text-lg font-bold tracking-tight text-gray-900"
        >
          <span
            aria-hidden
            className={`grid size-9 place-items-center rounded-lg text-white shadow-sm ${
              isProfessor
                ? "bg-gradient-to-br from-primary to-primary-dark"
                : "bg-gradient-to-br from-student to-student-dark"
            }`}
          >
            <IconMonitor size={20} />
          </span>
          <span className="leading-tight">
            Aulas de Informática
            <span
              className={`block text-[0.6875rem] font-semibold uppercase tracking-widest ${
                isProfessor ? "text-primary" : "text-student-dark"
              }`}
            >
              {isProfessor ? "Área da professora" : "Área do aluno"}
            </span>
          </span>
        </Link>

        {isProfessor && (
          <nav
            aria-label="Área da professora"
            className="order-last flex w-full flex-wrap items-center gap-1 sm:order-none sm:w-auto"
          >
            {PROFESSOR_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-primary-light text-primary-dark"
                      : "text-gray-600 hover:bg-gray-900/5 hover:text-gray-900"
                  }`}
                >
                  <Icon size={17} className={active ? "text-primary" : "text-gray-400"} />
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
  eyebrow,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {description && <p className="max-w-2xl text-base text-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
