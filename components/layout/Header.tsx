"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

const TEACHER_NAV = [
  ["/professor", "Bancada"],
  ["/professor/classes", "Turmas"],
  ["/professor/atividades", "Atividades"],
  ["/professor/analise", "Respostas"],
] as const;

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
    <header className="sticky top-0 z-20 border-b border-creme/15 bg-marinho/95 text-creme backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6">
        <Link
          href={isProfessor ? "/professor" : "/aluno"}
          aria-label="Professora Márcia — início"
          className="rounded-xl"
        >
          <Logo theme="light" />
        </Link>

        <div className="ml-auto flex items-center gap-3">{action}</div>
      </div>

      {isProfessor && (
        <nav aria-label="Área da professora" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <ul className="grid w-full grid-cols-4 gap-1 pb-3 sm:flex sm:flex-wrap sm:gap-2">
            {TEACHER_NAV.map(([href, label]) => {
              const active = href === "/professor" ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center justify-center rounded-t-2xl rounded-b-md border-2 px-1 text-[11px] font-bold whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
                      active
                        ? "border-tinta bg-creme text-marinho shadow-sm"
                        : "border-creme/20 text-creme/70 hover:bg-marinho-2 hover:text-creme"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
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
    <div className="flex animate-rise flex-wrap items-end justify-between gap-5 py-2">
      <div className="flex max-w-3xl flex-col gap-2">
        <h1 className="titulo-caixa text-4xl text-creme sm:text-5xl">{title}</h1>
        {description && <p className="max-w-2xl text-base font-semibold text-creme/75">{description}</p>}
      </div>
      {action}
    </div>
  );
}
