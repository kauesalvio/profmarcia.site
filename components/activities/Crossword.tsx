"use client";

import { useMemo, useState } from "react";
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
export function Crossword({ question, value, onChange }: QuestionViewProps<PuzzleQuestion>) {
  const layout = useMemo(() => buildCrossword(question.words), [question.words]);
  const [letters, setLetters] = useState<Letters>({});

  if (!layout) {
    return <Alert tone="info">Esta cruzadinha ainda não tem palavras cadastradas.</Alert>;
  }

  const { rows, cols, solution, entries } = layout;
  const numbersByCell = new Map(entries.map((entry) => [`${entry.row},${entry.col}`, entry.number]));

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
    const next = { ...letters, [`${row},${col}`]: normalizeWord(letter).slice(-1) };
    setLetters(next);
    onChange(compose(next));
  }

  const across = entries.filter((entry) => entry.direction === "across");
  const down = entries.filter((entry) => entry.direction === "down");
  const filled = value.replace(/[^A-Z]/g, "").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto">
        <div
          role="grid"
          aria-label="Grade da cruzadinha"
          className="inline-grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 2.25rem))` }}
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
                      className="absolute left-0.5 top-0 z-10 text-[0.55rem] font-bold text-student-dark"
                    >
                      {number}
                    </span>
                  )}
                  <input
                    aria-label={`Linha ${row + 1}, coluna ${col + 1}`}
                    maxLength={1}
                    value={letters[key] ?? ""}
                    onChange={(event) => setLetter(row, col, event.target.value)}
                    className="size-9 rounded-md border-2 border-gray-300 bg-white text-center text-lg font-bold uppercase text-gray-900 transition-colors duration-150 focus-visible:border-student focus-visible:bg-student-light"
                  />
                </div>
              );
            }),
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {filled} de {entries.reduce((total, entry) => total + entry.word.length, 0)} letras
        preenchidas.
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
      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h4>
      <ol className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <li key={`${entry.number}-${entry.direction}`} className="flex gap-2 text-sm text-gray-700">
            <span className="font-bold text-student-dark">{entry.number}.</span>
            <span>{entry.clue ?? `Palavra com ${entry.word.length} letras`}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
