import type { ReactNode } from "react";

const TONES = {
  success: "bg-success-bg/70 border-success/30 [--tone:var(--color-success)]",
  error: "bg-error-bg/70 border-error/30 [--tone:var(--color-error)]",
  warning: "bg-warning-bg/70 border-warning/40 [--tone:var(--color-warning)]",
  info: "bg-info-bg/70 border-info/30 [--tone:var(--color-info)]",
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
      className={`flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm text-gray-900 shadow-sm ${TONES[tone]}`}
    >
      <span
        aria-hidden
        className="grid size-6 shrink-0 place-items-center rounded-full bg-(--tone) text-xs font-bold text-white"
      >
        {ICONS[tone]}
      </span>
      <span className="flex-1 leading-relaxed">{children}</span>
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
  icon,
}: {
  message: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-white/60 px-6 py-14 text-center">
      {icon && (
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-2xl bg-gray-100 text-gray-400"
        >
          {icon}
        </span>
      )}
      <p className="max-w-sm text-base text-gray-500">{message}</p>
      {action}
    </div>
  );
}
