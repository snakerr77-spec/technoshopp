const FALLBACK_CATALOG = {
  settings: {
    whatsapp: "5515996007266",
    sellerName: "Equipe TecnoShop",
    storeAddress: "Rua Ângelo Luvizotto, 401 — Centro",
    city: "Cerquilho — SP"
  },
  categories: [
    { id: "cat-iphones", name: "iPhones", slug: "iphones", active: true, order: 1 },
    { id: "cat-android", name: "Android", slug: "android", active: true, order: 2 },
    { id: "cat-notebooks", name: "Notebooks", slug: "notebooks", active: true, order: 3 },
    { id: "cat-acessorios", name: "Acessórios", slug: "acessorios", active: true, order: 4 },
    { id: "cat-mobilidade", name: "Mobilidade", slug: "mobilidade", active: true, order: 5 }
  ],
  products: [
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
  ]
};

const state = {
  catalog: FALLBACK_CATALOG,
  categoryId: "all",
  query: "",
  sort: "featured"
};

const elements = {
  chips: document.querySelector("#category-chips"),
  grid: document.querySelector("#product-grid"),
  count: document.querySelector("#result-count"),
  search: document.querySelector("#product-search"),
  sort: document.querySelector("#sort-products"),
  empty: document.querySelector("#empty-state"),
  footerCategories: document.querySelector("#footer-categories"),
  dialog: document.querySelector("#product-dialog"),
  dialogContent: document.querySelector("#dialog-content"),
  toast: document.querySelector("#toast")
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2
});

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeSearch(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function whatsappUrl(message) {
  const phone = String(state.catalog.settings?.whatsapp || "5515996007266").replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function updateStoreLinks() {
  const genericMessage = "Olá! Vi o catálogo da TecnoShop e gostaria de atendimento.";
  document.querySelectorAll(".js-whatsapp").forEach((link) => {
    link.href = whatsappUrl(genericMessage);
  });
  document.querySelectorAll(".js-trade-whatsapp").forEach((link) => {
    link.href = whatsappUrl(
      "Olá! Quero avaliar meu aparelho atual para fazer um upgrade. Podem me orientar?"
    );
  });

  const settings = state.catalog.settings || {};
  document.querySelector("#store-location").textContent = settings.city || "Cerquilho — SP";
  document.querySelector("#footer-address").textContent =
    [settings.storeAddress, settings.city].filter(Boolean).join(" • ") || "Cerquilho — SP";
}

function getVisibleCategories() {
  return [...(state.catalog.categories || [])]
    .filter((category) => category.active !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

function renderCategories() {
  const categories = getVisibleCategories();
  elements.chips.innerHTML = [
    `<button class="category-chip ${state.categoryId === "all" ? "is-active" : ""}" type="button" data-category="all">Todos</button>`,
    ...categories.map(
      (category) =>
        `<button class="category-chip ${state.categoryId === category.id ? "is-active" : ""}" type="button" data-category="${escapeHtml(category.id)}">${escapeHtml(category.name)}</button>`
    )
  ].join("");

  elements.footerCategories.innerHTML = categories
    .slice(0, 5)
    .map(
      (category) =>
        `<a href="#catalogo" data-footer-category="${escapeHtml(category.id)}">${escapeHtml(category.name)}</a>`
    )
    .join("");
}

function filteredProducts() {
  const query = normalizeSearch(state.query);
  const products = (state.catalog.products || []).filter((product) => {
    if (product.active === false) return false;
    if (state.categoryId !== "all" && product.categoryId !== state.categoryId) return false;
    if (!query) return true;

    const haystack = normalizeSearch(
      [product.name, product.condition, product.shortDescription, ...(product.tags || [])].join(" ")
    );
    return haystack.includes(query);
  });

  products.sort((a, b) => {
    if (state.sort === "price-asc") return Number(a.price || 0) - Number(b.price || 0);
    if (state.sort === "price-desc") return Number(b.price || 0) - Number(a.price || 0);
    if (state.sort === "name") return String(a.name).localeCompare(String(b.name), "pt-BR");
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });

  return products;
}

function productImage(product) {
  return product.images?.[0] || "/assets/hero-products-dark.webp";
}

function renderProducts() {
  const products = filteredProducts();
  elements.count.textContent = `${products.length} ${products.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
  elements.grid.hidden = products.length === 0;
  elements.empty.hidden = products.length !== 0;

  elements.grid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-card__media">
            <img
              src="${escapeHtml(productImage(product))}"
              alt="${escapeHtml(product.name)}"
              loading="lazy"
              onerror="this.onerror=null;this.src='/assets/hero-products-dark.webp'"
            />
            ${product.featured ? '<span class="product-card__badge">DESTAQUE</span>' : ""}
          </div>
          <div class="product-card__body">
            <span class="product-card__condition">${escapeHtml(product.condition || "Consulte")}</span>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="product-card__description">${escapeHtml(product.shortDescription || "")}</p>
            <div class="product-card__price-row">
              <div>
                ${product.compareAtPrice ? `<s class="product-card__compare">${currency.format(product.compareAtPrice)}</s>` : ""}
                <strong class="product-card__price">${currency.format(Number(product.price || 0))}</strong>
              </div>
              <button
                class="product-card__view"
                type="button"
                data-product-id="${escapeHtml(product.id)}"
                aria-label="Ver detalhes de ${escapeHtml(product.name)}"
              >→</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function openProduct(productId) {
  const product = state.catalog.products.find((item) => item.id === productId);
  if (!product) return;

  const message = `Olá! Tenho interesse no produto ${product.name} anunciado por ${currency.format(
    Number(product.price || 0)
  )}. Pode me passar mais detalhes?`;

  elements.dialogContent.innerHTML = `
    <article class="dialog-product">
      <div class="dialog-product__gallery">
        <img
          src="${escapeHtml(productImage(product))}"
          alt="${escapeHtml(product.name)}"
          onerror="this.onerror=null;this.src='/assets/hero-products-dark.webp'"
        />
      </div>
      <div class="dialog-product__details">
        <span class="dialog-product__condition">${escapeHtml(product.condition || "Consulte")}</span>
        <h2>${escapeHtml(product.name)}</h2>
        <p class="dialog-product__short">${escapeHtml(product.shortDescription || "")}</p>
        <div class="dialog-product__price">
          ${product.compareAtPrice ? `<s>${currency.format(product.compareAtPrice)}</s>` : ""}
          <strong>${currency.format(Number(product.price || 0))}</strong>
        </div>
        <p class="dialog-product__description">${escapeHtml(product.description || "")}</p>
        <div class="tag-list">
          ${(product.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <a class="button button--primary" href="${whatsappUrl(message)}" target="_blank" rel="noopener">
          Tenho interesse <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  `;

  elements.dialog.showModal();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.setTimeout(() => elements.toast.classList.remove("is-visible"), 3500);
}

async function loadCatalog() {
  try {
    const response = await fetch("/api/catalog", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Catálogo indisponível (${response.status})`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.products) || !Array.isArray(catalog.categories)) {
      throw new Error("Formato de catálogo inválido");
    }
    state.catalog = catalog;
  } catch (error) {
    console.warn(error);
    state.catalog = FALLBACK_CATALOG;
    showToast("Mostrando o catálogo inicial. Configure o KV no Cloudflare para publicar suas alterações.");
  }

  updateStoreLinks();
  renderCategories();
  renderProducts();
}

elements.chips.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.categoryId = button.dataset.category;
  renderCategories();
  renderProducts();
});

elements.footerCategories.addEventListener("click", (event) => {
  const link = event.target.closest("[data-footer-category]");
  if (!link) return;
  state.categoryId = link.dataset.footerCategory;
  renderCategories();
  renderProducts();
});

elements.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (button) openProduct(button.dataset.productId);
});

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

elements.sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  state.categoryId = "all";
  state.query = "";
  elements.search.value = "";
  renderCategories();
  renderProducts();
});

document.querySelector("#dialog-close").addEventListener("click", () => elements.dialog.close());
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});

const menuButton = document.querySelector("#menu-button");
const mobileNav = document.querySelector("#mobile-nav");
menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
mobileNav.addEventListener("click", () => {
  mobileNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
});

const savedTheme = localStorage.getItem("tecnoshop-theme");
if (savedTheme === "light") document.documentElement.dataset.theme = "light";
document.querySelector("#theme-toggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("tecnoshop-theme", nextTheme);
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
loadCatalog();
