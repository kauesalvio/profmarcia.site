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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Preencha usuário e senha.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signIn(username.trim(), password);
      router.push("/professor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ambient-professor relative flex flex-1 items-center justify-center px-4 py-12 text-creme sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 top-8 hidden size-40 -rotate-6 rounded-full bg-coral/20 md:block" />
      </div>

      <div className="relative grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_27rem] lg:gap-20">
        <div className="flex flex-col gap-7">
          <h1><Logo size="lg" theme="light" /></h1>
          <div className="hidden max-w-xl sm:block">
            <p className="titulo-caixa text-3xl sm:text-4xl">
              Sua bancada para criar, experimentar e acompanhar cada descoberta da turma.
            </p>
            <p className="mt-4 max-w-lg text-base font-bold text-cream/70">
              Organize turmas, monte atividades e veja as respostas em um só lugar.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="titulo-caixa text-3xl text-marinho">Acessar bancada</h2>
              <p className="text-sm font-bold text-gray-500">Área da professora</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {error && <Alert tone="error">{error}</Alert>}
              <Field label="Usuário" htmlFor="username" required>
                <Input id="username" name="username" type="text" autoComplete="username" placeholder="marcia" value={username} onChange={(e) => setUsername(e.target.value)} />
              </Field>
              <Field label="Senha" htmlFor="password" required>
                <Input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Card>

          <Link href="/aluno" className="group flex items-center gap-4 rounded-3xl bg-lima px-5 py-4 text-marinho adesivo transition-all duration-150 hover:-translate-y-1">
            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-creme text-marinho adesivo-sm">
              <IconBackpack size={24} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-black">É aluno?</span>
              <span className="text-sm font-bold text-lab/75">Acesse as atividades sem senha</span>
            </span>
            <IconArrowRight size={22} className="shrink-0 transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
