"use client";

import { useSyncExternalStore } from "react";

/**
 * Leitura reativa de `localStorage`/`sessionStorage`.
 *
 * `undefined` significa "ainda não sabemos" (render no servidor / hidratação) e
 * `null` significa "não existe" — a diferença evita redirecionar a professora
 * antes de conhecer a sessão.
 */
export type StorageArea = "local" | "session";

const listeners = new Set<() => void>();

function storageOf(area: StorageArea) {
  return area === "local" ? window.localStorage : window.sessionStorage;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readStored(area: StorageArea, key: string): string | null {
  if (typeof window === "undefined") return null;
  return storageOf(area).getItem(key);
}

export function writeStored(area: StorageArea, key: string, value: string) {
  storageOf(area).setItem(key, value);
  listeners.forEach((listener) => listener());
}

export function removeStored(area: StorageArea, key: string) {
  storageOf(area).removeItem(key);
  listeners.forEach((listener) => listener());
}

export function useStoredValue(area: StorageArea, key: string): string | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => readStored(area, key),
    () => undefined,
  );
}
