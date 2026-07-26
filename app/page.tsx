"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
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
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            aria-hidden
            className="grid size-12 place-items-center rounded-lg bg-primary text-lg font-bold text-white"
          >
            AI
          </span>
          <h1 className="text-3xl font-bold text-gray-900">Aulas de Informática</h1>
          <p className="text-base text-gray-500">Entre para gerenciar turmas e atividades.</p>
        </div>

        <Card className="p-6">
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

        <p className="text-center text-sm text-gray-500">
          É aluno?{" "}
          <Link href="/aluno" className="font-semibold text-student-dark underline">
            Acessar as atividades
          </Link>
        </p>
      </div>
    </main>
  );
}
