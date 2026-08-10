import { requireAuth } from "@/lib/session";
import type { ImageSearchResult } from "@/lib/types";

interface OpenverseImage {
  id?: string;
  title?: string | null;
  creator?: string | null;
  license?: string | null;
  foreign_landing_url?: string | null;
}

interface OpenverseResponse {
  results?: OpenverseImage[];
}

export async function GET(request: Request) {
  try {
    await requireAuth();
  } catch {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) {
    return Response.json(
      { error: "Digite uma busca entre 2 e 80 caracteres." },
      { status: 400 },
    );
  }

  try {
    const endpoint = new URL("https://api.openverse.org/v1/images/");
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("page_size", "12");
    endpoint.searchParams.set("mature", "false");

    const response = await fetch(endpoint, {
      headers: { "User-Agent": "ProfessoraMarcia/1.0 (image search for education)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Openverse indisponível");

    const data = (await response.json()) as OpenverseResponse;
    const images: ImageSearchResult[] = (data.results ?? [])
      .filter(
        (image): image is OpenverseImage & { id: string } =>
          typeof image.id === "string" && /^[a-f0-9-]{36}$/i.test(image.id),
      )
      .map((image) => ({
        id: image.id,
        title: image.title?.trim() || "Imagem sem título",
        creator: image.creator?.trim() || undefined,
        license: image.license?.trim() || "licença não informada",
        sourceUrl: image.foreign_landing_url || "https://openverse.org/",
      }));

    return Response.json(images, {
      headers: { "Cache-Control": "private, max-age=300" },
    });
  } catch {
    return Response.json(
      { error: "Não foi possível buscar imagens agora. Tente novamente." },
      { status: 502 },
    );
  }
}
