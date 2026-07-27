import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "student" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border-2 border-primary-dark bg-primary text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm",
  student:
    "border-2 border-student-dark bg-student text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm",
  secondary:
    "border-2 border-gray-900 bg-white text-gray-900 shadow-sm hover:bg-gray-900 hover:text-white hover:-translate-y-0.5 active:translate-y-0",
  danger:
    "border-2 border-error bg-white text-error shadow-sm hover:bg-error hover:text-white hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "border-2 border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-11 px-4 py-2 text-sm tracking-wide",
  md: "min-h-12 px-5 py-3 text-sm tracking-wide",
  lg: "min-h-14 px-6 py-4 text-base font-extrabold tracking-wide uppercase",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0 disabled:active:translate-y-0";

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
