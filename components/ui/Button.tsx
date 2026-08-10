import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "student" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border-2 border-tinta bg-amarelo text-marinho shadow-sm hover:-translate-y-0.5 hover:bg-sun-light active:translate-y-0",
  student:
    "border-2 border-tinta bg-lima text-marinho shadow-sm hover:-translate-y-0.5 hover:bg-student-light active:translate-y-0",
  secondary:
    "border-2 border-tinta bg-creme text-marinho shadow-sm hover:-translate-y-0.5 hover:bg-creme-2 active:translate-y-0",
  danger:
    "border-2 border-tinta bg-coral text-marinho shadow-sm hover:-translate-y-0.5 hover:bg-error-bg active:translate-y-0",
  ghost:
    "border-2 border-transparent text-current hover:bg-current/10",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-11 px-4 py-2 text-sm tracking-wide",
  md: "min-h-12 px-5 py-3 text-sm tracking-wide",
  lg: "min-h-14 px-7 py-4 text-base font-black",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-black transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0 disabled:active:translate-y-0";

function classes(variant: Variant, size: Size, className?: string) {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(" ");
}

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={classes(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={classes(variant, size, className)} {...props} />;
}
