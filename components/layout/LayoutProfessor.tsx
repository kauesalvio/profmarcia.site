"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
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
        <Spinner label="Preparando a bancada..." />
      </div>
    );
  }

  return (
    <div className="ambient-professor flex flex-1 flex-col">
      <Header
        variant="professor"
        action={
          <>
            <span
              className="grid size-10 shrink-0 overflow-hidden rounded-full border-2 border-lab-deep bg-primary shadow-sm"
              title="Professora Márcia"
            >
              <Image
                src="/professora-marcia.png"
                alt="Foto de perfil da Professora Márcia"
                width={40}
                height={40}
                priority
                className="size-full object-cover"
              />
            </span>
            <Button className="text-cream hover:bg-cream/10 hover:text-cream" variant="ghost" onClick={handleSignOut}>
              Sair
            </Button>
          </>
        }
      />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
