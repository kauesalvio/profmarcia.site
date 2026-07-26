"use client";

import Link from "next/link";
import { IconCheck } from "@/components/ui/Icons";
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
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-5 text-sm text-gray-500">
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
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-2.5 transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                checked
                  ? "border-primary bg-primary-light/50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(schoolClass._id)}
              />
              <span
                aria-hidden
                className={`grid size-5 shrink-0 place-items-center rounded-md border-2 text-white transition-colors duration-200 ${
                  checked ? "border-primary bg-primary" : "border-gray-300 bg-white"
                }`}
              >
                {checked && <IconCheck size={12} strokeWidth={3} />}
              </span>
              <span className="text-base font-medium text-gray-900">{schoolClass.name}</span>
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
