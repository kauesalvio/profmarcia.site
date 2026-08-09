"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export function Header({
  variant,
  action,
}: {
  variant: "professor" | "aluno";
  action?: ReactNode;
}) {
  const isProfessor = variant === "professor";

  return (
    <header className="sticky top-0 z-20 border-b-2 border-gray-900 bg-white/95">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link
          href={isProfessor ? "/professor" : "/aluno"}
          className="rounded-xl text-gray-900"
        >
          <Logo area={isProfessor ? "professor" : "aluno"} />
        </Link>

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
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="heading-poster text-3xl text-gray-900">{title}</h1>
        {description && <p className="max-w-2xl text-base text-gray-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
