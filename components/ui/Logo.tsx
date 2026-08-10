type LogoProps = {
  theme?: "dark" | "light";
  size?: "sm" | "lg";
};

export function Logo({ theme = "dark", size = "sm" }: LogoProps) {
  const light = theme === "light";
  const markSize = size === "lg" ? "size-20 sm:size-24" : "size-11";

  return (
    <span
      className={`inline-flex items-center ${size === "lg" ? "gap-4" : "gap-3"} ${
        light ? "text-cream" : "text-gray-900"
      }`}
    >
      <span
        aria-hidden
        className={`brand-mark grid shrink-0 place-items-center rounded-2xl bg-primary text-cream ${markSize}`}
      >
        <BrandMarkIcon size={size === "lg" ? 46 : 26} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`titulo-caixa block ${size === "lg" ? "text-2xl" : "text-base sm:text-lg"}`}>
          Professora Márcia
        </span>
      </span>
    </span>
  );
}

function BrandMarkIcon({ size }: { size: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 34V14l9.5 11L30 12v22"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30 34h8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="37" cy="12" r="3.5" fill="var(--color-amarelo)" />
    </svg>
  );
}
