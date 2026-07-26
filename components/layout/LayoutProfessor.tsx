"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { signOut, useTeacherSession } from "@/lib/auth";

/**
 * Layout protegido da área da professora. Quem não tem sessão volta para o
 * login. A checagem real acontece no proxy (JWT) e nas API routes.
 */
export function LayoutProfessor({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useTeacherSession();

  useEffect(() => {
    if (session === null) router.replace("/");
  }, [session, router]);

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4">
        <Spinner label="Verificando acesso..." />
      </div>
    );
  }

  return (
    <>
      <Header
        variant="professor"
        action={
          <>
            <span className="hidden text-sm text-gray-500 sm:inline">{session.name}</span>
            <Button variant="ghost" onClick={handleSignOut}>
              Sair
            </Button>
          </>
        }
      />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        {children}
      </main>
    </>
  );
}
