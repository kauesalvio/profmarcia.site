import type { ReactNode } from "react";

const TONES = {
  success: "bg-success-bg border-success text-success",
  error: "bg-error-bg border-error text-error",
  warning: "bg-warning-bg border-warning text-warning",
  info: "bg-info-bg border-info text-info",
} as const;

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
      className={`flex flex-wrap items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ${TONES[tone]}`}
    >
      <span
        aria-hidden
        className="grid size-7 shrink-0 place-items-center rounded-full bg-gray-900 text-xs font-extrabold text-white"
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
    <div role="status" className="flex items-center gap-3 py-6 text-sm font-bold text-gray-700">
      <span
        aria-hidden
        className="size-6 animate-spin rounded-full border-4 border-gray-200 border-t-primary"
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
    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-300 bg-white/70 px-6 py-16 text-center">
      {icon && (
        <span
          aria-hidden
          className="grid size-16 place-items-center rounded-full border-2 border-gray-900 bg-gray-100 text-gray-500 shadow-sm"
        >
          {icon}
        </span>
      )}
      <p className="max-w-sm text-base font-semibold text-gray-700">{message}</p>
      {action}
    </div>
  );
}
