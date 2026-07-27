"use client";

import { useMemo, useState } from "react";
import type { QuestionViewProps } from "@/components/activities/types";
import { Alert } from "@/components/ui/Feedback";
import { IconCheck } from "@/components/ui/Icons";
import { buildWordSearch, normalizeWord, straightLine } from "@/lib/puzzle";
import type { PuzzleQuestion } from "@/lib/types";

type Cell = { row: number; col: number };

/** Caça-palavra: o aluno clica na primeira e na última letra de cada palavra. */
export function WordSearch({ question, onChange }: QuestionViewProps<PuzzleQuestion>) {
  const layout = useMemo(
    () => buildWordSearch(question.words, question.gridSize),
    [question.words, question.gridSize],
  );
  const [found, setFound] = useState<string[]>([]);
  const [start, setStart] = useState<Cell | null>(null);

  if (!layout) {
    return <Alert tone="info">Este caça-palavras ainda não tem palavras cadastradas.</Alert>;
  }

  const { size, grid, placements } = layout;
  const foundCells = new Set(
    placements
      .filter((placement) => found.includes(placement.word))
      .flatMap((placement) => placement.cells.map((cell) => `${cell.row},${cell.col}`)),
  );

  function select(cell: Cell) {
    if (!start) {
      setStart(cell);
      return;
    }

    const line = straightLine(start, cell);
    setStart(null);
    if (!line) return;

    const letters = line.map(({ row, col }) => grid[row][col]).join("");
    const reversed = [...letters].reverse().join("");
    const match = placements.find(
      (placement) =>
        !found.includes(placement.word) &&
        (placement.word === letters || placement.word === reversed),
    );
    if (!match) return;

    const next = [...found, match.word];
    setFound(next);
    onChange(
      question.words
        .map((item) => normalizeWord(item.word))
        .filter((word) => next.includes(word))
        .join(", "),
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
        Clique na primeira e depois na última letra de cada palavra escondida.
      </p>

      <div className="overflow-x-auto">
        <div
          className="inline-grid gap-1"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 2rem))` }}
        >
          {grid.map((line, row) =>
            line.map((letter, col) => {
              const isFound = foundCells.has(`${row},${col}`);
              const isStart = start?.row === row && start?.col === col;
              return (
                <button
                  key={`${row},${col}`}
                  type="button"
                  aria-label={`Letra ${letter}, linha ${row + 1}, coluna ${col + 1}`}
                  aria-pressed={isStart}
                  onClick={() => select({ row, col })}
                  className={`size-8 rounded-md border-2 text-sm font-extrabold uppercase transition-colors duration-150 ${
                    isFound
                      ? "border-gray-900 bg-student text-white shadow-sm"
                      : isStart
                        ? "border-student bg-student-light text-student-dark"
                        : "border-gray-200 bg-white text-gray-700 hover:border-student hover:bg-student-light hover:text-student-dark"
                  }`}
                >
                  {letter}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {placements.map((placement) => {
          const isFound = found.includes(placement.word);
          return (
            <li
              key={placement.word}
              title={placement.clue}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide transition-colors duration-200 ${
                isFound
                  ? "border-student bg-student-light text-student-dark line-through"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              {isFound && <IconCheck size={14} strokeWidth={3} />}
              {placement.clue ?? placement.word}
            </li>
          );
        })}
      </ul>

      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
        {found.length} de {placements.length} palavras encontradas.
      </p>
    </div>
  );
}
