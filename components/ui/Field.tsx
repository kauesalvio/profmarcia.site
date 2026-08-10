import type { ComponentProps, ReactNode } from "react";

const CONTROL =
  "w-full min-h-12 rounded-xl border-2 border-tinta bg-creme px-4 py-2.5 text-base font-bold text-marinho shadow-sm transition-all duration-150 placeholder:font-semibold placeholder:text-gray-500 hover:-translate-y-px focus-visible:translate-y-0 focus-visible:border-eletrico disabled:bg-creme-2 disabled:text-gray-500";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  hintPosition = "above",
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  hintPosition?: "above" | "below";
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-black text-gray-900">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {hint && hintPosition === "above" && <p className="text-sm text-gray-500">{hint}</p>}
      {children}
      {hint && hintPosition === "below" && <p className="text-sm text-gray-500">{hint}</p>}
      {error && (
        <p className="text-sm font-bold text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={[CONTROL, className].filter(Boolean).join(" ")} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={4}
      className={[CONTROL, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={[CONTROL, className].filter(Boolean).join(" ")} {...props} />;
}
