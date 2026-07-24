import { hasCatalogBinding, jsonResponse } from "../_shared/catalog.js";

export function onRequestGet({ env }) {
  const kvConfigured = hasCatalogBinding(env);
  return jsonResponse(
    {
      ok: kvConfigured,
      service: "tecnoshop-catalog",
      kvConfigured,
      timestamp: new Date().toISOString()
    },
    kvConfigured ? 200 : 503
  );
}

export function onRequest() {
  return jsonResponse({ error: "Método não permitido." }, 405, { Allow: "GET" });
}
