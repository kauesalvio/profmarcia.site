"use client";

import { readStored, useStoredValue, writeStored } from "./browserStore";

/**
 * Guarda a turma escolhida pelo aluno e o último nome informado.
 * O aluno não faz login (specs/frontend/frontend.md), então isso fica só no navegador.
 */
const CLASS_KEY = "aluno-class-id";
const NAME_KEY = "aluno-nome";

export function useSelectedClassId() {
  return useStoredValue("local", CLASS_KEY) ?? null;
}

export function selectClassId(id: string) {
  writeStored("local", CLASS_KEY, id);
}

export function getSelectedClassId() {
  return readStored("local", CLASS_KEY);
}

export function useStudentName() {
  return useStoredValue("local", NAME_KEY) ?? "";
}

export function saveStudentName(name: string) {
  writeStored("local", NAME_KEY, name);
}
