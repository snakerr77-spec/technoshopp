import { IMAGE_KEY_PREFIX } from "../../_shared/catalog.js";

export async function onRequestGet({ env, params }) {
  if (!env.CATALOG_KV) {
    return new Response("Imagem indisponível.", { status: 503 });
  }

  const id = String(params.id || "").replace(/[^a-f0-9-]/gi, "");
  if (!id) return new Response("Imagem não encontrada.", { status: 404 });

  const result = await env.CATALOG_KV.getWithMetadata(`${IMAGE_KEY_PREFIX}${id}`, {
    type: "arrayBuffer"
  });
  if (!result?.value) return new Response("Imagem não encontrada.", { status: 404 });

  return new Response(result.value, {
    headers: {
      "Content-Type": result.metadata?.contentType || "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export function onRequest() {
  return new Response("Método não permitido.", {
    status: 405,
    headers: { Allow: "GET" }
  });
}
