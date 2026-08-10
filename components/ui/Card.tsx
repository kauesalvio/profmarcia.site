import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={[
        "rounded-3xl border-[3px] border-tinta bg-creme p-5 text-marinho shadow-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

/** Card clicável com elevação no hover. */
export function InteractiveCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <Card
      className={[
        "transition-all duration-150 hover:-translate-y-1 hover:shadow-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "student" | "warning";
}) {
  const tones = {
    neutral: "border-tinta bg-creme-2 text-marinho",
    primary: "border-tinta bg-eletrico text-creme",
    student: "border-tinta bg-lima text-marinho",
    warning: "border-tinta bg-amarelo text-marinho",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border-2 px-2 py-1 text-[11px] font-black uppercase tracking-widest ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
