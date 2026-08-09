import Image from "next/image";

type LogoProps = {
  theme?: "dark" | "light";
  area?: "professor" | "aluno";
  size?: "sm" | "lg";
};

export function Logo({ theme = "dark", area, size = "sm" }: LogoProps) {
  const baseColor = theme === "light" ? "text-white" : "text-gray-900";
  const mutedColor = theme === "light" ? "text-white/75" : "text-gray-700/80";
  const areaColor =
    theme === "light"
      ? "text-white/75"
      : area === "aluno"
        ? "text-student-dark"
        : "text-primary";
  const markSize = size === "lg" ? "size-24 sm:size-28" : "size-10";
  const markFrame =
    size === "lg"
      ? "rounded-2xl border-4 border-gray-900 p-2 shadow-hard"
      : "rounded-xl border-2 border-gray-900 p-1 shadow-sm";

  return (
    <span
      className={`inline-flex items-center ${size === "lg" ? "gap-4" : "gap-3"} ${baseColor}`}
    >
      <span
        aria-hidden
        className={`relative block shrink-0 overflow-hidden bg-white ${markSize} ${markFrame}`}
      >
        <Image
          src="/logo-mark.png"
          alt=""
          fill
          priority={size === "lg"}
          unoptimized
          sizes={size === "lg" ? "7rem" : "2.5rem"}
          className="object-contain"
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={`block font-extrabold uppercase tracking-[0.18em] ${
            size === "lg" ? "text-sm" : "text-[0.625rem]"
          } ${mutedColor}`}
        >
          Professora
        </span>
        <span
          className={`heading-poster block ${size === "lg" ? "text-4xl sm:text-5xl" : "text-lg"}`}
        >
          Márcia
        </span>
        {area && (
          <span
            className={`${size === "lg" ? "text-sm" : "text-[0.625rem]"} font-extrabold uppercase tracking-widest ${areaColor}`}
          >
            Área d{area === "professor" ? "a professora" : "o aluno"}
          </span>
        )}
      </span>
    </span>
  );
}
