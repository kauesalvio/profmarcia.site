type LogoProps = {
  theme?: "dark" | "light";
  area?: "professor" | "aluno";
  size?: "sm" | "lg";
};

export function Logo({ theme = "dark", area, size = "sm" }: LogoProps) {
  const isLight = theme === "light";
  const baseColor = isLight ? "text-white" : "text-gray-900";
  const mutedColor = isLight ? "text-white/80" : "text-gray-700/80";
  const areaColor =
    area === "professor"
      ? "text-primary"
      : area === "aluno"
        ? "text-student-dark"
        : undefined;

  if (size === "lg") {
    return (
      <span className={`inline-flex flex-col items-center ${baseColor}`}>
        <span
          className={`text-sm font-extrabold uppercase tracking-[0.2em] ${mutedColor}`}
        >
          Professora
        </span>
        <span className="heading-poster text-4xl sm:text-5xl">Márcia</span>
        {area && (
          <span className={`text-base font-bold tracking-wide ${areaColor}`}>
            Área d{area === "professor" ? "a professora" : "o aluno"}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col leading-tight ${baseColor}`}>
      <span
        className={`block text-[0.625rem] font-extrabold uppercase tracking-widest ${mutedColor}`}
      >
        Professora
      </span>
      <span className="block text-lg font-extrabold tracking-tight">Márcia</span>
      {area && (
        <span
          className={`block text-[0.625rem] font-extrabold uppercase tracking-widest ${areaColor}`}
        >
          Área d{area === "professor" ? "a professora" : "o aluno"}
        </span>
      )}
    </span>
  );
}
