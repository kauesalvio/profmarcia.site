"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
import { IconArrowRight, IconBackpack, IconMonitor } from "@/components/ui/Icons";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.push("/professor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ambient-professor relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-64 text-primary"
      />

      <div className="relative flex w-full max-w-sm animate-rise flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-soft-lg"
          >
            <IconMonitor size={34} />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Aulas de Informática
            </h1>
            <p className="text-base text-gray-500">
              Entre para gerenciar turmas e atividades.
            </p>
          </div>
        </div>

        <Card className="p-6 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {error && <Alert tone="error">{error}</Alert>}

            <Field label="E-mail" htmlFor="email" required>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="professora@escola.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label="Senha" htmlFor="password" required>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Card>

        <Link
          href="/aluno"
          className="group flex items-center gap-3 rounded-xl border border-student/25 bg-student-light/60 px-5 py-4 transition-colors duration-200 hover:border-student/50 hover:bg-student-light"
        >
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-student text-white shadow-sm"
          >
            <IconBackpack size={22} />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">É aluno?</span>
            <span className="text-sm text-student-dark">
              Acesse as atividades sem senha
            </span>
          </span>
          <IconArrowRight
            size={18}
            className="ml-auto text-student-dark transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </main>
  );
}
