import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={[
        "rounded-md border border-gray-200 bg-white p-4 shadow-sm",
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
    neutral: "bg-gray-100 text-gray-700",
    primary: "bg-primary-light text-primary-dark",
    student: "bg-student-light text-student-dark",
    warning: "bg-warning-bg text-gray-900",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
