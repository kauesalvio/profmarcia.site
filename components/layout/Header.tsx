"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
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
    <header className="sticky top-0 z-20 border-b-4 border-gray-900 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link
          href={isProfessor ? "/professor" : "/aluno"}
          className="flex items-center gap-2.5 rounded-md text-gray-900"
        >
          <span
            aria-hidden
            className={`grid size-10 place-items-center rounded-lg border-2 border-gray-900 text-white shadow-sm ${
              isProfessor ? "bg-primary" : "bg-student"
            }`}
          >
            <IconMonitor size={22} />
          </span>
          <Logo area={isProfessor ? "professor" : "aluno"} />
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
                  className={`flex min-h-11 items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-extrabold uppercase tracking-wide transition-all duration-150 ${
                    active
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={17} />
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
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="heading-poster text-3xl text-gray-900">{title}</h1>
        {description && <p className="max-w-2xl text-base text-gray-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
