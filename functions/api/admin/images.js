import {
  IMAGE_KEY_PREFIX,
  errorResponse,
  hasCatalogBinding,
  jsonResponse
} from "../../_shared/catalog.js";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export async function onRequestPost({ request, env }) {
  if (!hasCatalogBinding(env)) {
    return errorResponse("O binding CATALOG_KV ainda não foi configurado no Cloudflare.", 503);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("Envie a imagem como multipart/form-data.");
  }

  const file = formData.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return errorResponse("Selecione uma imagem.");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return errorResponse("Formato inválido. Envie JPG, PNG ou WebP.");
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
    return errorResponse("A imagem precisa ter no máximo 2 MB.");
  }

  const id = crypto.randomUUID();
  await env.CATALOG_KV.put(`${IMAGE_KEY_PREFIX}${id}`, await file.arrayBuffer(), {
    metadata: {
      contentType: file.type,
      uploadedAt: new Date().toISOString()
    }
  });

  return jsonResponse(
    {
      id,
      url: `/api/images/${id}`,
      contentType: file.type,
      size: file.size
    },
    201
  );
}

export function onRequest() {
  return jsonResponse({ error: "Método não permitido." }, 405, { Allow: "POST" });
}
