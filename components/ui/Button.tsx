import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "student" | "secondary" | "danger" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  student: "bg-student text-white hover:bg-student-dark",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100",
  danger: "bg-white text-error border border-error hover:bg-error-bg",
  ghost: "text-gray-700 hover:bg-gray-100",
};

const SIZES: Record<Size, string> = {
  // Área de toque mínima de 44px (design-tokens.md, seção 10)
  md: "min-h-11 px-5 py-3 text-base",
  lg: "min-h-12 px-6 py-4 text-lg font-semibold",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

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
