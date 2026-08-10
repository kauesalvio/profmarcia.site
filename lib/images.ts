/** URL estável da miniatura; o arquivo continua hospedado pelo Openverse. */
export function openverseThumbnailUrl(id: string) {
  return `https://api.openverse.org/v1/images/${encodeURIComponent(id)}/thumb/`;
}
