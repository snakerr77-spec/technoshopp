import { jsonResponse, readCatalog } from "../_shared/catalog.js";

export async function onRequestGet({ env }) {
  const { catalog, source } = await readCatalog(env);
  return jsonResponse(catalog, 200, { "X-TecnoShop-Catalog-Source": source });
}

export function onRequest() {
  return jsonResponse({ error: "Método não permitido." }, 405, { Allow: "GET" });
}
