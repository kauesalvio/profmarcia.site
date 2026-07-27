import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={[
        "rounded-xl border-2 border-gray-900 bg-white p-5 shadow-md",
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
    neutral: "border-gray-900 bg-gray-100 text-gray-900",
    primary: "border-primary-dark bg-primary-light text-primary-dark",
    student: "border-student-dark bg-student-light text-student-dark",
    warning: "border-warning bg-warning-bg text-gray-900",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
