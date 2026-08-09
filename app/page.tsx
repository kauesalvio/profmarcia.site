"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
import { Logo } from "@/components/ui/Logo";
import { IconArrowRight, IconBackpack } from "@/components/ui/Icons";
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
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-primary px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 size-80 rounded-full border-[24px] border-white/10" />
        <div className="absolute -left-24 bottom-0 size-96 rounded-full bg-student/20" />
        <div className="absolute left-[10%] top-[15%] h-24 w-16 rotate-12 bg-white/10" />
        <div className="absolute bottom-[20%] right-[12%] h-16 w-32 -rotate-6 bg-white/10" />
        <div className="dot-grid absolute inset-0 text-white/20" />
      </div>

      <div className="relative grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_25rem] lg:gap-20">
        <div className="flex flex-col gap-7 text-white">
          <h1>
            <Logo size="lg" theme="light" area="professor" />
          </h1>
          <div className="max-w-lg">
            <p className="text-xl font-bold leading-snug sm:text-2xl">
              Gerencie turmas, crie atividades e acompanhe as respostas em um só lugar.
            </p>
            <p className="mt-3 text-base font-medium text-white/75">
              Entre para começar a preparar a próxima aula.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="heading-poster text-2xl text-gray-900">Entrar</h2>
              <p className="text-sm font-medium text-gray-500">Área da professora</p>
            </div>
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

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Card>

          <Link
            href="/aluno"
            className="group flex items-center gap-4 rounded-xl border-2 border-gray-900 bg-student px-5 py-4 text-white shadow-md transition-all duration-150 hover:-translate-y-1 hover:shadow-lg"
          >
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-lg border-2 border-white bg-student-dark text-white"
            >
              <IconBackpack size={24} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-extrabold uppercase tracking-wide">É aluno?</span>
              <span className="text-sm font-semibold text-white/90">
                Acesse as atividades sem senha
              </span>
            </span>
            <IconArrowRight
              size={22}
              className="shrink-0 text-white transition-transform duration-150 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
