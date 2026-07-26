"use client";

import Link from "next/link";
import { yearLabel } from "@/lib/labels";
import type { SchoolClass } from "@/lib/types";

export function YearClassSelector({
  classes,
  selected,
  onChange,
}: {
  classes: SchoolClass[];
  selected: string[];
  onChange: (classIds: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
        Nenhuma turma cadastrada.{" "}
        <Link href="/professor/classes/nova" className="font-semibold text-primary underline">
          Crie a primeira turma
        </Link>{" "}
        para poder distribuir a atividade.
      </div>
    );
  }

  const sorted = [...classes].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-gray-900">Disponível para</legend>
      <p className="text-sm text-gray-500">
        Marque os anos/turmas que verão esta atividade.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {sorted.map((schoolClass) => {
          const checked = selected.includes(schoolClass._id);
          return (
            <label
              key={schoolClass._id}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-4 py-2 transition-colors duration-200 ${
                checked
                  ? "border-primary bg-primary-light"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={checked}
                onChange={() => toggle(schoolClass._id)}
              />
              <span className="text-base text-gray-900">{schoolClass.name}</span>
              <span className="ml-auto text-sm text-gray-500">
                {yearLabel(schoolClass.year)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
