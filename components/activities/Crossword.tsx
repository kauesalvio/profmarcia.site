"use client";

import { useMemo, useRef, useState } from "react";
import type { QuestionViewProps } from "@/components/activities/types";
import { Alert } from "@/components/ui/Feedback";
import { buildCrossword, normalizeWord, type CrosswordEntry } from "@/lib/puzzle";
import type { PuzzleQuestion } from "@/lib/types";

type Letters = Record<string, string>;

function entryCells(entry: CrosswordEntry) {
  return [...entry.word].map((_, index) => ({
    row: entry.direction === "across" ? entry.row : entry.row + index,
    col: entry.direction === "across" ? entry.col + index : entry.col,
  }));
}

/** Cruzadinha: o aluno preenche a grade a partir das dicas. */
export function Crossword({ question, onChange }: QuestionViewProps<PuzzleQuestion>) {
  const layout = useMemo(() => buildCrossword(question.words), [question.words]);
  const [letters, setLetters] = useState<Letters>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!layout) {
    return <Alert tone="info">Esta cruzadinha ainda não tem palavras cadastradas.</Alert>;
  }

  const { rows, cols, solution, entries } = layout;
  const numbersByCell = new Map(entries.map((entry) => [`${entry.row},${entry.col}`, entry.number]));
  const cellKeys = solution.flatMap((line, row) =>
    line.flatMap((letter, col) => (letter ? [`${row},${col}`] : [])),
  );

  /** Resposta enviada: uma palavra por entrada, na ordem cadastrada pela professora. */
  function compose(next: Letters) {
    const used = new Set<number>();
    return question.words
      .map((item) => normalizeWord(item.word))
      .filter((word) => word.length >= 2)
      .map((word) => {
        const position = entries.findIndex(
          (entry, index) => entry.word === word && !used.has(index),
        );
        if (position < 0) return word;
        used.add(position);
        return entryCells(entries[position])
          .map((cell) => next[`${cell.row},${cell.col}`] || "_")
          .join("");
      })
      .join(", ");
  }

  function setLetter(row: number, col: number, letter: string) {
    const key = `${row},${col}`;
    const normalized = normalizeWord(letter).slice(-1);
    const next = { ...letters, [key]: normalized };
    setLetters(next);
    onChange(compose(next));

    if (normalized) {
      const nextKey = cellKeys[cellKeys.indexOf(key) + 1];
      if (nextKey) inputRefs.current[nextKey]?.focus();
    }
  }

  const across = entries.filter((entry) => entry.direction === "across");
  const down = entries.filter((entry) => entry.direction === "down");
  const filled = Object.values(letters).filter(Boolean).length;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="rounded-xl border-2 border-student bg-student-light/35 p-3 text-sm font-bold text-gray-700 sm:p-4">
        <p><strong className="text-student-dark">1.</strong> Leia uma dica abaixo.</p>
        <p className="mt-1"><strong className="text-student-dark">2.</strong> Toque em um quadrinho e digite uma letra. O cursor avança sozinho.</p>
      </div>

      <div className="max-w-full overflow-auto rounded-xl border-2 border-gray-900 bg-gray-100 p-2 [overscroll-behavior-inline:contain] sm:p-3">
        <div
          role="grid"
          aria-label="Grade da cruzadinha. Deslize para ver todos os quadrinhos."
          className="inline-grid min-w-max gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 2.75rem))` }}
        >
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => {
              const key = `${row},${col}`;
              if (!solution[row][col]) return <div key={key} aria-hidden />;
              const number = numbersByCell.get(key);
              return (
                <div key={key} className="relative">
                  {number && (
                    <span
                      aria-hidden
                      className="absolute left-0.5 top-0 z-10 text-[0.55rem] font-extrabold text-student-dark"
                    >
                      {number}
                    </span>
                  )}
                  <input
                    ref={(element) => { inputRefs.current[key] = element; }}
                    aria-label={`Linha ${row + 1}, coluna ${col + 1}`}
                    autoComplete="off"
                    inputMode="text"
                    maxLength={1}
                    value={letters[key] ?? ""}
                    onChange={(event) => setLetter(row, col, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !letters[key]) {
                        const previousKey = cellKeys[cellKeys.indexOf(key) - 1];
                        if (previousKey) inputRefs.current[previousKey]?.focus();
                      }
                    }}
                    className="size-11 rounded-md border-2 border-gray-900 bg-white text-center text-xl font-extrabold uppercase text-gray-900 shadow-sm transition-colors duration-150 focus-visible:border-student focus-visible:bg-student-light focus-visible:outline-0"
                  />
                </div>
              );
            }),
          )}
        </div>
      </div>

      <p className="text-sm font-bold text-gray-600" aria-live="polite">
        Você preencheu <strong className="text-student-dark">{filled} de {cellKeys.length}</strong> quadrinhos.
        {cols > 8 && " Se a grade não couber, deslize para o lado."}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <ClueList title="Horizontais" entries={across} />
        <ClueList title="Verticais" entries={down} />
      </div>
    </div>
  );
}

function ClueList({ title, entries }: { title: string; entries: CrosswordEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
        {title}
      </h4>
      <ol className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <li key={`${entry.number}-${entry.direction}`} className="flex gap-2 text-sm font-semibold text-gray-700">
            <span className="font-extrabold text-student-dark">{entry.number}.</span>
            <span>{entry.clue ?? `Palavra com ${entry.word.length} letras`}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
