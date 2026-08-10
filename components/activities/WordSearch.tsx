"use client";

import { useMemo, useState } from "react";
import type { QuestionViewProps } from "@/components/activities/types";
import { Alert } from "@/components/ui/Feedback";
import { IconCheck } from "@/components/ui/Icons";
import { buildWordSearch, normalizeWord, straightLine } from "@/lib/puzzle";
import type { PuzzleQuestion } from "@/lib/types";

type Cell = { row: number; col: number };

/** Caça-palavra: o aluno clica na primeira e na última letra de cada palavra. */
export function WordSearch({ question, index, onChange }: QuestionViewProps<PuzzleQuestion>) {
  const layout = useMemo(
    () => buildWordSearch(question.words, question.gridSize),
    [question.words, question.gridSize],
  );
  const [found, setFound] = useState<string[]>([]);
  const [start, setStart] = useState<Cell | null>(null);
  const [message, setMessage] = useState("Escolha a primeira letra de uma palavra.");

  if (!layout) {
    return <Alert tone="info">Este caça-palavras ainda não tem palavras cadastradas.</Alert>;
  }

  const { size, grid, placements } = layout;
  const helpId = `wordsearch-help-${index}`;
  const foundCells = new Set(
    placements
      .filter((placement) => found.includes(placement.word))
      .flatMap((placement) => placement.cells.map((cell) => `${cell.row},${cell.col}`)),
  );

  function select(cell: Cell) {
    if (!start) {
      setStart(cell);
      setMessage("Ótimo! Agora escolha a última letra da palavra.");
      return;
    }

    const line = straightLine(start, cell);
    setStart(null);
    if (!line) {
      setMessage("Esses pontos não formam uma linha reta. Tente de novo.");
      return;
    }

    const letters = line.map(({ row, col }) => grid[row][col]).join("");
    const reversed = [...letters].reverse().join("");
    const match = placements.find(
      (placement) =>
        !found.includes(placement.word) &&
        (placement.word === letters || placement.word === reversed),
    );
    if (!match) {
      setMessage("Ainda não foi dessa vez. Procure outra linha e tente novamente.");
      return;
    }

    const next = [...found, match.word];
    setMessage(`Você encontrou ${match.word}!`);
    setFound(next);
    onChange(
      question.words
        .map((item) => normalizeWord(item.word))
        .filter((word) => next.includes(word))
        .join(", "),
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="rounded-xl border-2 border-student bg-student-light/35 p-3 text-sm font-bold text-gray-700 sm:p-4">
        <p><strong className="text-student-dark">1.</strong> Procure uma palavra da lista.</p>
        <p className="mt-1"><strong className="text-student-dark">2.</strong> Toque na primeira letra e depois na última. Vale para qualquer direção.</p>
      </div>

      <p id={helpId} className="rounded-lg bg-white px-3 py-2 text-sm font-extrabold text-student-dark" aria-live="polite">
        {message}
      </p>

      <div className="max-w-full overflow-auto rounded-xl border-2 border-gray-900 bg-gray-100 p-2 [overscroll-behavior-inline:contain] sm:p-3">
        <div
          role="grid"
          aria-label="Grade do caça-palavra. Deslize para ver todas as letras."
          aria-describedby={helpId}
          className="inline-grid min-w-max touch-pan-x gap-1"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 2.75rem))` }}
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
                  className={`size-11 rounded-md border-2 text-base font-extrabold uppercase transition-colors duration-150 ${
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

      <p className="text-sm font-bold text-gray-600">
        Você encontrou <strong className="text-student-dark">{found.length} de {placements.length}</strong> palavras.
        {size > 8 && " Se a grade não couber, deslize para o lado."}
      </p>
    </div>
  );
}
