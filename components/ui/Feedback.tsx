import type { ReactNode } from "react";

const TONES = {
  success: "bg-success-bg text-gray-900 border-success",
  error: "bg-error-bg text-gray-900 border-error",
  warning: "bg-warning-bg text-gray-900 border-warning",
  info: "bg-info-bg text-gray-900 border-info",
} as const;

/** Ícone textual junto da cor: nunca comunicar só por cor (design-tokens.md, seção 10). */
const ICONS = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
} as const;

export function Alert({
  tone,
  children,
  action,
}: {
  tone: keyof typeof TONES;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex flex-wrap items-center gap-3 rounded-md border-l-4 px-4 py-3 text-sm ${TONES[tone]}`}
    >
      <span aria-hidden className="font-bold">
        {ICONS[tone]}
      </span>
      <span className="flex-1">{children}</span>
      {action}
    </div>
  );
}

export function Spinner({ label = "Carregando..." }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 py-6 text-sm text-gray-500">
      <span
        aria-hidden
        className="size-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary"
      />
      {label}
    </div>
  );
}

export function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <p className="text-base text-gray-500">{message}</p>
      {action}
    </div>
  );
}
