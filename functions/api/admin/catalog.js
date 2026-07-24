import {
  IMAGE_KEY_PREFIX,
  errorResponse,
  jsonResponse,
  normalizeCategory,
  normalizeProduct,
  readCatalog,
  writeCatalog
} from "../../_shared/catalog.js";

export async function onRequestGet({ env }) {
  const { catalog, source } = await readCatalog(env);
  return jsonResponse({ catalog, source });
}

export async function onRequestPost({ request, env, waitUntil }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Envie uma requisição JSON válida.");
  }

  const { catalog } = await readCatalog(env);
  const action = String(body?.action || "");
  const payload = body?.payload || {};

  try {
    if (action === "saveProduct") {
      const existingIndex = catalog.products.findIndex((item) => item.id === payload.id);
      const existing = existingIndex >= 0 ? catalog.products[existingIndex] : null;
      const categoryIds = new Set(catalog.categories.map((category) => category.id));
      const product = normalizeProduct(payload, categoryIds, existing);

      if (existingIndex >= 0) catalog.products[existingIndex] = product;
      else catalog.products.push(product);

      const savedCatalog = await writeCatalog(env, catalog);
      return jsonResponse({ catalog: savedCatalog, product });
    }

    if (action === "deleteProduct") {
      const productIndex = catalog.products.findIndex((item) => item.id === payload.id);
      if (productIndex < 0) return errorResponse("Produto não encontrado.", 404);
      const [product] = catalog.products.splice(productIndex, 1);
      const savedCatalog = await writeCatalog(env, catalog);

      if (env.CATALOG_KV) {
        const imageIds = (product.images || [])
          .filter((url) => url.startsWith("/api/images/"))
          .map((url) => url.split("/").pop())
          .filter(Boolean);
        if (imageIds.length) {
          waitUntil(
            Promise.all(imageIds.map((id) => env.CATALOG_KV.delete(`${IMAGE_KEY_PREFIX}${id}`)))
          );
        }
      }
      return jsonResponse({ catalog: savedCatalog });
    }

    if (action === "saveCategory") {
      const duplicate = catalog.categories.find(
        (category) =>
          category.id !== payload.id &&
          category.name.trim().toLowerCase() === String(payload.name || "").trim().toLowerCase()
      );
      if (duplicate) return errorResponse("Já existe uma categoria com esse nome.", 409);

      const existingIndex = catalog.categories.findIndex((item) => item.id === payload.id);
      const existing = existingIndex >= 0 ? catalog.categories[existingIndex] : null;
      const category = normalizeCategory(payload, existing);
      if (existingIndex >= 0) catalog.categories[existingIndex] = category;
      else catalog.categories.push(category);

      const savedCatalog = await writeCatalog(env, catalog);
      return jsonResponse({ catalog: savedCatalog, category });
    }

    if (action === "deleteCategory") {
      const categoryIndex = catalog.categories.findIndex((item) => item.id === payload.id);
      if (categoryIndex < 0) return errorResponse("Categoria não encontrada.", 404);
      if (catalog.products.some((product) => product.categoryId === payload.id)) {
        return errorResponse("Mova ou exclua os produtos desta categoria antes de removê-la.", 409);
      }
      catalog.categories.splice(categoryIndex, 1);
      const savedCatalog = await writeCatalog(env, catalog);
      return jsonResponse({ catalog: savedCatalog });
    }

    return errorResponse("Ação não reconhecida.", 400);
  } catch (error) {
    console.error("Catalog mutation failed", error);
    const status = error.message.includes("CATALOG_KV") ? 503 : 400;
    return errorResponse(error.message || "Não foi possível salvar a alteração.", status);
  }
}

export function onRequest() {
  return jsonResponse({ error: "Método não permitido." }, 405, { Allow: "GET, POST" });
}
