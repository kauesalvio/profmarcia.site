import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "student" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-md active:shadow-sm",
  student:
    "bg-student text-white shadow-sm hover:bg-student-dark hover:shadow-md active:shadow-sm",
  secondary:
    "bg-white text-gray-700 border border-gray-300 shadow-sm hover:border-gray-400 hover:bg-gray-50",
  danger: "bg-white text-error border border-error/40 hover:border-error hover:bg-error-bg",
  ghost: "text-gray-700 hover:bg-gray-900/5",
};

const SIZES: Record<Size, string> = {
  // Área de toque mínima de 44px (design-tokens.md, seção 10)
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-11 px-5 py-3 text-base",
  lg: "min-h-12 px-6 py-4 text-lg font-semibold",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:active:translate-y-0";

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
