import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={[
        "rounded-xl border border-gray-200/80 bg-white p-4 shadow-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

/** Card clicável: mesma base, com elevação no hover. */
export function InteractiveCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <Card
      className={[
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-soft-lg",
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
    neutral: "bg-gray-100 text-gray-700 ring-gray-200",
    primary: "bg-primary-light text-primary-dark ring-primary/15",
    student: "bg-student-light text-student-dark ring-student/15",
    warning: "bg-warning-bg text-gray-900 ring-warning/25",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
