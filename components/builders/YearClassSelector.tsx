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
      <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-5 text-sm font-semibold text-gray-600">
        Nenhuma turma cadastrada.{" "}
        <Link href="/professor/classes/nova" className="font-extrabold text-eletrico underline">
          Crie a primeira turma
        </Link>{" "}
        para poder distribuir a atividade.
      </div>
    );
  }

  const sorted = [...classes].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
        Disponível para
      </legend>
      <p className="text-sm font-semibold text-gray-600">
        Marque os anos/turmas que verão esta atividade.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {sorted.map((schoolClass) => {
          const checked = selected.includes(schoolClass._id);
          return (
            <label
              key={schoolClass._id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-4 px-4 py-2.5 transition-all duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                checked
                  ? "border-tinta bg-lima shadow-sm"
                  : "border-marinho/15 bg-creme hover:border-tinta"
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
                className={`grid size-6 shrink-0 place-items-center rounded-md border-2 text-white transition-colors duration-150 ${
                  checked ? "border-tinta bg-marinho" : "border-gray-400 bg-creme"
                }`}
              >
                {checked && <IconCheck size={14} strokeWidth={3} />}
              </span>
              <span className="text-base font-extrabold text-gray-900">{schoolClass.name}</span>
              <span className="ml-auto text-sm font-bold text-gray-500">
                {yearLabel(schoolClass.year)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
