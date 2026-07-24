export const CATALOG_KEY = "tecnoshop:catalog:v1";
export const IMAGE_KEY_PREFIX = "tecnoshop:image:";

const defaultCategories = [
  { id: "cat-iphones", name: "iPhones", slug: "iphones", active: true, order: 1 },
  { id: "cat-android", name: "Android", slug: "android", active: true, order: 2 },
  { id: "cat-notebooks", name: "Notebooks", slug: "notebooks", active: true, order: 3 },
  { id: "cat-acessorios", name: "Acessórios", slug: "acessorios", active: true, order: 4 },
  { id: "cat-mobilidade", name: "Mobilidade", slug: "mobilidade", active: true, order: 5 }
];

const defaultProducts = [
  {
    id: "prod-iphone-15-pro",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    categoryId: "cat-iphones",
    condition: "Seminovo premium",
    shortDescription: "Titânio, câmeras Pro e desempenho para vários anos.",
    description:
      "Aparelho selecionado para quem busca desempenho avançado, excelente autonomia e conjunto de câmeras profissional. Consulte capacidade, cor e estado disponível com o vendedor.",
    price: 4200,
    compareAtPrice: 4590,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 3,
    active: true,
    featured: true,
    tags: ["Apple", "5G", "Seminovo"]
  },
  {
    id: "prod-iphone-14",
    name: "iPhone 14",
    slug: "iphone-14",
    categoryId: "cat-iphones",
    condition: "Novo e seminovo",
    shortDescription: "Ótimo equilíbrio entre câmera, bateria e desempenho.",
    description:
      "Uma escolha segura para uso diário, trabalho e produção de conteúdo. Consulte as opções novas e seminovas disponíveis.",
    price: 3190,
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 5,
    active: true,
    featured: true,
    tags: ["Apple", "5G"]
  },
  {
    id: "prod-samsung-s24",
    name: "Galaxy S24",
    slug: "galaxy-s24",
    categoryId: "cat-android",
    condition: "Lacrado",
    shortDescription: "Tela premium, câmeras inteligentes e Galaxy AI.",
    description:
      "Smartphone Android de alto desempenho, com ótimo conjunto de câmeras, recursos inteligentes e tela de alta qualidade.",
    price: 3790,
    compareAtPrice: 4090,
    images: [
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 4,
    active: true,
    featured: true,
    tags: ["Samsung", "Android", "5G"]
  },
  {
    id: "prod-redmi-note",
    name: "Redmi Note 14",
    slug: "redmi-note-14",
    categoryId: "cat-android",
    condition: "Novo",
    shortDescription: "Bateria para o dia todo e excelente custo-benefício.",
    description: "Ideal para quem quer boa tela, autonomia e desempenho sem pagar pelo segmento premium.",
    price: 1490,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 8,
    active: true,
    featured: false,
    tags: ["Xiaomi", "Android"]
  },
  {
    id: "prod-macbook-air",
    name: "MacBook Air M2",
    slug: "macbook-air-m2",
    categoryId: "cat-notebooks",
    condition: "Seminovo selecionado",
    shortDescription: "Leve, silencioso e rápido para trabalho e estudos.",
    description: "Notebook premium com ótima autonomia e desempenho para produtividade, criação e estudos.",
    price: 6490,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 2,
    active: true,
    featured: true,
    tags: ["Apple", "Notebook", "M2"]
  },
  {
    id: "prod-watch",
    name: "Smartwatch Active",
    slug: "smartwatch-active",
    categoryId: "cat-acessorios",
    condition: "Novo",
    shortDescription: "Notificações, exercícios e rotina no pulso.",
    description: "Modelo versátil para acompanhar notificações, atividades físicas e funções do dia a dia.",
    price: 399,
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 12,
    active: true,
    featured: false,
    tags: ["Relógio", "Bluetooth"]
  },
  {
    id: "prod-earbuds",
    name: "Fones Bluetooth Pro",
    slug: "fones-bluetooth-pro",
    categoryId: "cat-acessorios",
    condition: "Novo",
    shortDescription: "Som limpo, baixa latência e estojo compacto.",
    description: "Fones sem fio para música, chamadas, estudos e rotina. Consulte cores e modelos disponíveis.",
    price: 249,
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 15,
    active: true,
    featured: false,
    tags: ["Áudio", "Bluetooth"]
  },
  {
    id: "prod-scooter",
    name: "Scooter elétrica Urban X",
    slug: "scooter-eletrica-urban-x",
    categoryId: "cat-mobilidade",
    condition: "Novo",
    shortDescription: "Mobilidade urbana com praticidade e economia.",
    description:
      "Scooter elétrica para deslocamentos urbanos. Consulte autonomia, velocidade, garantia e disponibilidade.",
    price: 3990,
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=88"
    ],
    stock: 2,
    active: true,
    featured: true,
    tags: ["Elétrica", "Mobilidade"]
  }
];

export function createDefaultCatalog() {
  const now = new Date().toISOString();
  return {
    version: 1,
    settings: {
      whatsapp: "5515996007266",
      sellerName: "Equipe TecnoShop",
      storeAddress: "Rua Ângelo Luvizotto, 401 — Centro",
      city: "Cerquilho — SP"
    },
    categories: defaultCategories.map((category) => ({ ...category })),
    products: defaultProducts.map((product) => ({
      ...product,
      images: [...product.images],
      tags: [...product.tags],
      createdAt: now,
      updatedAt: now
    })),
    updatedAt: now
  };
}

export function hasCatalogBinding(env) {
  return Boolean(env?.CATALOG_KV);
}

export async function readCatalog(env) {
  if (!hasCatalogBinding(env)) {
    return { catalog: createDefaultCatalog(), source: "defaults-no-binding" };
  }

  try {
    const stored = await env.CATALOG_KV.get(CATALOG_KEY, { type: "json" });
    if (!stored || !Array.isArray(stored.products) || !Array.isArray(stored.categories)) {
      return { catalog: createDefaultCatalog(), source: "defaults-empty-kv" };
    }
    return { catalog: stored, source: "kv" };
  } catch (error) {
    console.error("Failed to read catalog", error);
    return { catalog: createDefaultCatalog(), source: "defaults-read-error" };
  }
}

export async function writeCatalog(env, catalog) {
  if (!hasCatalogBinding(env)) {
    throw new Error("O binding CATALOG_KV ainda não foi configurado no Cloudflare.");
  }

  const updatedCatalog = {
    ...catalog,
    version: 1,
    updatedAt: new Date().toISOString()
  };
  await env.CATALOG_KV.put(CATALOG_KEY, JSON.stringify(updatedCatalog));
  return updatedCatalog;
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

export function cleanText(value, maxLength = 200) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export function cleanSlug(value, fallback = "item") {
  const slug = cleanText(value, 100)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || fallback;
}

export function cleanNumber(value, { min = 0, max = 99999999, integer = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  const bounded = Math.min(max, Math.max(min, number));
  return integer ? Math.round(bounded) : Math.round(bounded * 100) / 100;
}

export function normalizeCategory(input, existing = null) {
  const name = cleanText(input?.name, 60);
  if (!name) throw new Error("Informe o nome da categoria.");
  const id = cleanText(input?.id, 100) || `cat-${crypto.randomUUID()}`;
  return {
    id,
    name,
    slug: cleanSlug(input?.slug || name, "categoria"),
    active: input?.active !== false,
    order: cleanNumber(input?.order, { min: 0, max: 9999, integer: true }),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function normalizeProduct(input, categoryIds, existing = null) {
  const name = cleanText(input?.name, 100);
  const categoryId = cleanText(input?.categoryId, 100);
  if (!name) throw new Error("Informe o nome do produto.");
  if (!categoryIds.has(categoryId)) throw new Error("Selecione uma categoria válida.");

  const id = cleanText(input?.id, 100) || `prod-${crypto.randomUUID()}`;
  const images = Array.isArray(input?.images)
    ? input.images
        .map((url) => cleanText(url, 2048))
        .filter((url) => /^(https?:\/\/|\/api\/images\/)/i.test(url))
        .slice(0, 8)
    : [];
  const tags = Array.isArray(input?.tags)
    ? [...new Set(input.tags.map((tag) => cleanText(tag, 40)).filter(Boolean))].slice(0, 20)
    : [];
  const compareAtPrice =
    input?.compareAtPrice === null || input?.compareAtPrice === "" || input?.compareAtPrice === undefined
      ? null
      : cleanNumber(input.compareAtPrice);

  return {
    id,
    name,
    slug: cleanSlug(input?.slug || name, "produto"),
    categoryId,
    condition: cleanText(input?.condition, 60),
    shortDescription: cleanText(input?.shortDescription, 150),
    description: cleanText(input?.description, 1800),
    price: cleanNumber(input?.price),
    compareAtPrice,
    images,
    stock: cleanNumber(input?.stock, { min: 0, max: 999999, integer: true }),
    active: input?.active !== false,
    featured: Boolean(input?.featured),
    tags,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
