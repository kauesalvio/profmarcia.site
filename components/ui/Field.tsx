import type { ComponentProps, ReactNode } from "react";

const CONTROL =
  "w-full min-h-11 rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm transition-colors duration-200 placeholder:text-gray-500 disabled:bg-gray-100";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
      {children}
      {error && <p className="text-sm font-medium text-error">{error}</p>}
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
