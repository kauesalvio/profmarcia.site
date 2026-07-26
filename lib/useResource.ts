"use client";

import { useEffect, useRef, useState } from "react";

interface ResourceState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Carrega um recurso da API expondo estados de loading, erro e recarga —
 * usados pelos estados de interface descritos em information-architecture.md.
 *
 * `key` identifica o recurso: sempre que muda, o recurso é buscado de novo.
 */
export function useResource<T>(loader: () => Promise<T>, key = "") {
  const loaderRef = useRef(loader);
  useEffect(() => {
    loaderRef.current = loader;
  });

  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    loaderRef.current().then(
      (data) => {
        if (active) setState({ data, error: null, loading: false });
      },
      (err: unknown) => {
        if (active) {
          setState({
            data: null,
            error: err instanceof Error ? err.message : "Erro inesperado.",
            loading: false,
          });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [key, attempt]);

  function reload() {
    setState((current) => ({ ...current, loading: true, error: null }));
    setAttempt((value) => value + 1);
  }

  return { ...state, reload };
}
