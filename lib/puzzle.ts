import type { PuzzleWord } from "./types";

/**
 * Geração das grades de cruzadinha e caça-palavra a partir das palavras
 * cadastradas pela professora (specs/tech-spec.md, seção 5).
 *
 * A geração é determinística: a mesma lista de palavras sempre produz a mesma
 * grade, para que a atividade não mude a cada renderização.
 */

/** Deixa a palavra pronta para a grade: maiúscula, sem acento e só letras. */
export function normalizeWord(word: string) {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export interface PreparedWord {
  word: string;
  clue?: string;
}

/** Remove palavras vazias, curtas demais e repetidas. */
export function prepareWords(words: PuzzleWord[]): PreparedWord[] {
  const seen = new Set<string>();
  const prepared: PreparedWord[] = [];

  for (const item of words) {
    const word = normalizeWord(item.word ?? "");
    if (word.length < 2 || seen.has(word)) continue;
    seen.add(word);
    prepared.push({ word, clue: item.clue?.trim() || undefined });
  }

  return prepared;
}

/** Gerador pseudoaleatório com semente (mulberry32). */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(words: PreparedWord[]) {
  const text = words.map((item) => item.word).join("|");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// ---------------------------------------------------------------- cruzadinha

export type Direction = "across" | "down";

export interface CrosswordEntry {
  number: number;
  word: string;
  clue?: string;
  row: number;
  col: number;
  direction: Direction;
}

export interface CrosswordLayout {
  rows: number;
  cols: number;
  /** Letra da solução em cada célula; `null` quando a célula é vazia. */
  solution: (string | null)[][];
  entries: CrosswordEntry[];
}

interface Placement {
  word: string;
  clue?: string;
  row: number;
  col: number;
  direction: Direction;
}

function cellsOf(placement: Placement) {
  const { row, col, direction, word } = placement;
  return [...word].map((letter, index) => ({
    row: direction === "across" ? row : row + index,
    col: direction === "across" ? col + index : col,
    letter,
  }));
}

function fits(
  grid: Map<string, string>,
  placement: Placement,
  requireCrossing: boolean,
) {
  const { direction, word } = placement;
  const cells = cellsOf(placement);
  let crossings = 0;

  const before =
    direction === "across"
      ? `${placement.row},${placement.col - 1}`
      : `${placement.row - 1},${placement.col}`;
  const last = cells[cells.length - 1];
  const after =
    direction === "across" ? `${last.row},${last.col + 1}` : `${last.row + 1},${last.col}`;
  if (grid.has(before) || grid.has(after)) return false;

  for (const cell of cells) {
    const existing = grid.get(`${cell.row},${cell.col}`);
    if (existing) {
      if (existing !== cell.letter) return false;
      crossings += 1;
      continue;
    }

    const sides =
      direction === "across"
        ? [`${cell.row - 1},${cell.col}`, `${cell.row + 1},${cell.col}`]
        : [`${cell.row},${cell.col - 1}`, `${cell.row},${cell.col + 1}`];
    if (sides.some((key) => grid.has(key))) return false;
  }

  return requireCrossing ? crossings > 0 && crossings < word.length : true;
}

/** Monta a cruzadinha cruzando as palavras sempre que possível. */
export function buildCrossword(words: PuzzleWord[]): CrosswordLayout | null {
  const prepared = prepareWords(words).sort(
    (a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word),
  );
  if (prepared.length === 0) return null;

  const grid = new Map<string, string>();
  const placements: Placement[] = [];

  function commit(placement: Placement) {
    for (const cell of cellsOf(placement)) grid.set(`${cell.row},${cell.col}`, cell.letter);
    placements.push(placement);
  }

  commit({ ...prepared[0], row: 0, col: 0, direction: "across" });

  for (const item of prepared.slice(1)) {
    let placed = false;

    for (let index = 0; index < item.word.length && !placed; index += 1) {
      for (const other of placements) {
        const otherCells = cellsOf(other);
        const match = otherCells.find((cell) => cell.letter === item.word[index]);
        if (!match) continue;

        const direction: Direction = other.direction === "across" ? "down" : "across";
        const candidate: Placement = {
          ...item,
          direction,
          row: direction === "down" ? match.row - index : match.row,
          col: direction === "down" ? match.col : match.col - index,
        };

        if (fits(grid, candidate, true)) {
          commit(candidate);
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      const bottom = Math.max(...[...grid.keys()].map((key) => Number(key.split(",")[0])));
      const left = Math.min(...[...grid.keys()].map((key) => Number(key.split(",")[1])));
      commit({ ...item, row: bottom + 2, col: left, direction: "across" });
    }
  }

  const coords = [...grid.keys()].map((key) => key.split(",").map(Number));
  const minRow = Math.min(...coords.map(([row]) => row));
  const minCol = Math.min(...coords.map(([, col]) => col));
  const rows = Math.max(...coords.map(([row]) => row)) - minRow + 1;
  const cols = Math.max(...coords.map(([, col]) => col)) - minCol + 1;

  const normalized = placements.map((placement) => ({
    ...placement,
    row: placement.row - minRow,
    col: placement.col - minCol,
  }));

  const solution: (string | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );
  for (const placement of normalized) {
    for (const cell of cellsOf(placement)) solution[cell.row][cell.col] = cell.letter;
  }

  const ordered = [...normalized].sort((a, b) => a.row - b.row || a.col - b.col);
  const numbers = new Map<string, number>();
  const entries: CrosswordEntry[] = ordered.map((placement) => {
    const key = `${placement.row},${placement.col}`;
    if (!numbers.has(key)) numbers.set(key, numbers.size + 1);
    return { ...placement, number: numbers.get(key)! };
  });

  return { rows, cols, solution, entries };
}

// ------------------------------------------------------------- caça-palavras

export interface WordSearchPlacement {
  word: string;
  clue?: string;
  cells: { row: number; col: number }[];
}

export interface WordSearchLayout {
  size: number;
  grid: string[][];
  placements: WordSearchPlacement[];
}

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
] as const;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Monta a grade do caça-palavras escondendo as palavras em 8 direções. */
export function buildWordSearch(
  words: PuzzleWord[],
  gridSize?: number,
): WordSearchLayout | null {
  const prepared = prepareWords(words).sort((a, b) => b.word.length - a.word.length);
  if (prepared.length === 0) return null;

  const longest = Math.max(...prepared.map((item) => item.word.length));
  const size = Math.min(20, Math.max(gridSize ?? 10, longest, 5));

  const random = createRandom(seedFrom(prepared));
  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const placements: WordSearchPlacement[] = [];

  for (const item of prepared) {
    const { word } = item;
    if (word.length > size) continue;

    let placed = false;
    for (let attempt = 0; attempt < 300 && !placed; attempt += 1) {
      const [deltaRow, deltaCol] = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)];
      const row = Math.floor(random() * size);
      const col = Math.floor(random() * size);
      const endRow = row + deltaRow * (word.length - 1);
      const endCol = col + deltaCol * (word.length - 1);
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

      const cells = [...word].map((letter, index) => ({
        row: row + deltaRow * index,
        col: col + deltaCol * index,
        letter,
      }));
      if (cells.some((cell) => grid[cell.row][cell.col] && grid[cell.row][cell.col] !== cell.letter))
        continue;

      for (const cell of cells) grid[cell.row][cell.col] = cell.letter;
      placements.push({
        word,
        clue: item.clue,
        cells: cells.map(({ row: r, col: c }) => ({ row: r, col: c })),
      });
      placed = true;
    }
  }

  const filled = grid.map((line) =>
    line.map((letter) => letter ?? ALPHABET[Math.floor(random() * ALPHABET.length)]),
  );

  return { size, grid: filled, placements };
}

/** Células em linha reta entre dois pontos, ou `null` se não houver reta válida. */
export function straightLine(
  from: { row: number; col: number },
  to: { row: number; col: number },
) {
  const deltaRow = to.row - from.row;
  const deltaCol = to.col - from.col;
  const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
  if (steps === 0) return null;
  if (deltaRow !== 0 && deltaCol !== 0 && Math.abs(deltaRow) !== Math.abs(deltaCol)) return null;

  const stepRow = Math.sign(deltaRow);
  const stepCol = Math.sign(deltaCol);
  return Array.from({ length: steps + 1 }, (_, index) => ({
    row: from.row + stepRow * index,
    col: from.col + stepCol * index,
  }));
}
