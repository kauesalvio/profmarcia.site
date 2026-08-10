"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { IconCheck, IconSearch, IconTrash, IconX } from "@/components/ui/Icons";
import { openverseThumbnailUrl } from "@/lib/images";
import type { DecorationImage, ImageSearchResult } from "@/lib/types";

export function ImagePicker({
  questionIndex,
  pickerKey,
  heading = "Imagem decorativa",
  description = "Opcional. Ela aparece ao lado desta pergunta para deixar a atividade mais divertida.",
  value,
  onChange,
}: {
  questionIndex: number;
  pickerKey?: string | number;
  heading?: string;
  description?: string;
  value?: DecorationImage;
  onChange: (image?: DecorationImage) => void;
}) {
  const pickerId = `${questionIndex}${pickerKey === undefined ? "" : `-${pickerKey}`}`;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ImageSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function search() {
    const term = query.trim();
    if (term.length < 2) {
      setError("Digite pelo menos 2 letras para buscar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/imagens?q=${encodeURIComponent(term)}`);
      const body = (await response.json()) as ImageSearchResult[] | { error?: string };
      if (!response.ok) {
        throw new Error("error" in body ? body.error : undefined);
      }
      setResults(body as ImageSearchResult[]);
    } catch (reason) {
      setError(
        reason instanceof Error && reason.message !== "error"
          ? reason.message
          : "Não foi possível buscar imagens agora. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
            {heading}
          </h4>
          <p className="mt-1 text-sm font-semibold text-gray-600">
            {description}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          aria-expanded={open}
          aria-controls={`image-picker-${pickerId}`}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <IconX size={16} /> : <IconSearch size={16} />}
          {open ? "Fechar busca" : value ? "Trocar imagem" : "Buscar imagem"}
        </Button>
      </div>

      {value && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border-2 border-primary bg-white p-2">
          <Image
            src={openverseThumbnailUrl(value.id)}
            alt=""
            width={96}
            height={72}
            className="h-16 w-20 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-gray-900">{value.title}</p>
            <p className="truncate text-xs font-semibold text-gray-500">
              {value.creator ? `Por ${value.creator} · ` : ""}{value.license.toUpperCase()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Remover ${heading.toLowerCase()}`}
            onClick={() => onChange(undefined)}
          >
            <IconTrash size={16} />
            Remover
          </Button>
        </div>
      )}

      {open && (
        <div id={`image-picker-${pickerId}`} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor={`image-query-${pickerId}`} className="sr-only">
              O que você quer buscar?
            </label>
            <input
              id={`image-query-${pickerId}`}
              value={query}
              maxLength={80}
              placeholder="Ex.: computador, espaço, animais"
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-12 min-w-0 flex-1 rounded-lg border-2 border-gray-900 bg-white px-4 text-base font-semibold text-gray-900 placeholder:text-gray-500"
            />
            <Button onClick={search} disabled={loading}>
              <IconSearch size={18} />
              Buscar
            </Button>
          </div>

          {loading && <Spinner label="Buscando imagens livres..." />}
          {error && <Alert tone="error">{error}</Alert>}
          {!loading && !error && results.length === 0 && query.trim().length >= 2 && (
            <p className="text-sm font-semibold text-gray-600">
              Faça a busca para ver imagens livres do Openverse.
            </p>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Resultados da busca">
              {results.map((image) => {
                const selected = value?.id === image.id;
                return (
                  <button
                    key={image.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      onChange({
                        id: image.id,
                        title: image.title,
                        creator: image.creator,
                        license: image.license,
                        sourceUrl: image.sourceUrl,
                      })
                    }
                    className={`group relative min-h-28 overflow-hidden rounded-xl border-2 bg-white text-left transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-offset-2 ${
                      selected ? "border-primary shadow-md" : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={openverseThumbnailUrl(image.id)}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 180px, 45vw"
                      className="object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gray-900/85 px-2 py-1.5 text-xs font-bold text-white">
                      <span className="line-clamp-2">{image.title}</span>
                    </span>
                    {selected && (
                      <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full border-2 border-white bg-primary text-white">
                        <IconCheck size={17} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          <p className="text-xs font-semibold text-gray-500">
            Busca pelo Openverse. Só guardamos a referência da imagem, nunca o arquivo.
          </p>
        </div>
      )}
    </section>
  );
}
