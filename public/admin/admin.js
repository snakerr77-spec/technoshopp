const adminState = {
  catalog: { settings: {}, categories: [], products: [] },
  productImages: [],
  view: "products",
  confirmAction: null
};

const adminElements = {
  productList: document.querySelector("#admin-product-list"),
  categoryList: document.querySelector("#category-list"),
  productEmpty: document.querySelector("#product-list-empty"),
  categoryEmpty: document.querySelector("#category-list-empty"),
  categoryFilter: document.querySelector("#admin-category-filter"),
  statusFilter: document.querySelector("#admin-status-filter"),
  search: document.querySelector("#admin-product-search"),
  productModal: document.querySelector("#product-modal"),
  categoryModal: document.querySelector("#category-modal"),
  confirmDialog: document.querySelector("#confirm-dialog"),
  imageList: document.querySelector("#image-list"),
  uploadProgress: document.querySelector("#upload-progress"),
  toast: document.querySelector("#admin-toast"),
  pageLoading: document.querySelector("#page-loading"),
  syncStatus: document.querySelector("#sync-status")
};

const adminCurrency = new Intl.NumberFormat("pt-BR", {
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

function slugify(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function normalizeSearch(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function showToast(message, type = "success") {
  adminElements.toast.textContent = message;
  adminElements.toast.classList.toggle("is-error", type === "error");
  adminElements.toast.classList.add("is-visible");
  window.setTimeout(() => adminElements.toast.classList.remove("is-visible"), 3800);
}

function setSyncStatus(status, text) {
  adminElements.syncStatus.className = `sync-status ${status ? `is-${status}` : ""}`;
  adminElements.syncStatus.innerHTML = `<span></span>${escapeHtml(text)}`;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    const message =
      data?.error ||
      (response.status === 403
        ? "Acesso negado. Verifique a proteção do painel no Cloudflare Access."
        : `Não foi possível concluir a operação (${response.status}).`);
    throw new Error(message);
  }
  return data;
}

async function loadCatalog() {
  try {
    setSyncStatus("", "Conectando...");
    adminState.catalog = await apiRequest("/api/catalog");
    setSyncStatus("online", "Sincronizado com Cloudflare");
    renderAll();
  } catch (error) {
    setSyncStatus("error", "Catálogo indisponível");
    showToast(error.message, "error");
  } finally {
    adminElements.pageLoading.hidden = true;
  }
}

async function mutateCatalog(action, payload) {
  setSyncStatus("", "Salvando...");
  try {
    const result = await apiRequest("/api/admin/catalog", {
      method: "POST",
      body: JSON.stringify({ action, payload })
    });
    adminState.catalog = result.catalog;
    setSyncStatus("online", "Alterações publicadas");
    renderAll();
    return result;
  } catch (error) {
    setSyncStatus("error", "Erro ao salvar");
    throw error;
  }
}

function sortedCategories() {
  return [...adminState.catalog.categories].sort(
    (a, b) => Number(a.order || 0) - Number(b.order || 0)
  );
}

function categoryName(categoryId) {
  return adminState.catalog.categories.find((item) => item.id === categoryId)?.name || "Sem categoria";
}

function updateStats() {
  const products = adminState.catalog.products;
  const active = products.filter((product) => product.active !== false).length;
  const stock = products.reduce((sum, product) => sum + Math.max(0, Number(product.stock || 0)), 0);
  document.querySelector("#stat-products").textContent = String(products.length);
  document.querySelector("#stat-active").textContent = String(active);
  document.querySelector("#stat-stock").textContent = String(stock);
  document.querySelector("#stat-products-detail").textContent =
    products.length === 1 ? "1 item no catálogo" : `${products.length} itens no catálogo`;
  document.querySelector("#nav-product-count").textContent = String(products.length);
  document.querySelector("#nav-category-count").textContent = String(adminState.catalog.categories.length);
}

function renderCategoryOptions() {
  const categories = sortedCategories();
  adminElements.categoryFilter.innerHTML = [
    '<option value="all">Todas as categorias</option>',
    ...categories.map(
      (category) =>
        `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`
    )
  ].join("");

  const productCategory = document.querySelector("#product-category");
  productCategory.innerHTML = categories
    .map(
      (category) =>
        `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`
    )
    .join("");
}

function filteredAdminProducts() {
  const query = normalizeSearch(adminElements.search.value);
  const categoryId = adminElements.categoryFilter.value;
  const status = adminElements.statusFilter.value;

  return [...adminState.catalog.products]
    .filter((product) => {
      if (categoryId !== "all" && product.categoryId !== categoryId) return false;
      if (status === "active" && product.active === false) return false;
      if (status === "inactive" && product.active !== false) return false;
      if (!query) return true;
      return normalizeSearch(
        [product.name, product.condition, product.shortDescription, ...(product.tags || [])].join(" ")
      ).includes(query);
    })
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
}

function renderProducts() {
  const products = filteredAdminProducts();
  adminElements.productList.hidden = products.length === 0;
  adminElements.productEmpty.hidden = products.length !== 0;
  adminElements.productList.innerHTML = products
    .map(
      (product) => `
        <article class="product-row">
          <div class="product-row__main">
            <div class="product-row__image">
              <img
                src="${escapeHtml(product.images?.[0] || "/assets/hero-products-dark.webp")}"
                alt=""
                onerror="this.onerror=null;this.src='/assets/hero-products-dark.webp'"
              />
            </div>
            <div>
              <strong>${escapeHtml(product.name)}</strong>
              <small>${escapeHtml(product.condition || "Condição não informada")} ${product.featured ? "• Destaque" : ""}</small>
            </div>
          </div>
          <div class="product-row__category">
            <span class="row-label">Categoria</span>
            <span>${escapeHtml(categoryName(product.categoryId))}</span>
          </div>
          <div class="product-row__price">
            <span class="row-label">Preço</span>
            <strong>${adminCurrency.format(Number(product.price || 0))}</strong>
          </div>
          <div class="product-row__stock">
            <span class="row-label">Estoque</span>
            <span>${Math.max(0, Number(product.stock || 0))} un.</span>
          </div>
          <div class="row-actions">
            <span class="status-pill ${product.active === false ? "status-pill--inactive" : ""}">
              ${product.active === false ? "Inativo" : "Ativo"}
            </span>
            <button class="row-action" type="button" data-edit-product="${escapeHtml(product.id)}" title="Editar">✎</button>
            <button class="row-action row-action--danger" type="button" data-delete-product="${escapeHtml(product.id)}" title="Excluir">×</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCategories() {
  const categories = sortedCategories();
  adminElements.categoryList.hidden = categories.length === 0;
  adminElements.categoryEmpty.hidden = categories.length !== 0;
  adminElements.categoryList.innerHTML = categories
    .map((category) => {
      const productCount = adminState.catalog.products.filter(
        (product) => product.categoryId === category.id
      ).length;
      return `
        <article class="category-card">
          <div class="category-card__top">
            <span class="category-card__icon">◇</span>
            <div class="category-card__actions">
              <button class="row-action" type="button" data-edit-category="${escapeHtml(category.id)}" title="Editar">✎</button>
              <button class="row-action row-action--danger" type="button" data-delete-category="${escapeHtml(category.id)}" title="Excluir">×</button>
            </div>
          </div>
          <h3>${escapeHtml(category.name)}</h3>
          <p>${productCount} ${productCount === 1 ? "produto" : "produtos"} • Ordem ${Number(category.order || 0)} • ${category.active === false ? "Inativa" : "Ativa"}</p>
        </article>
      `;
    })
    .join("");
}

function renderAll() {
  updateStats();
  renderCategoryOptions();
  renderProducts();
  renderCategories();
}

function renderImageList() {
  adminElements.imageList.innerHTML = adminState.productImages
    .map(
      (url, index) => `
        <div class="image-item">
          <img src="${escapeHtml(url)}" alt="Imagem ${index + 1} do produto" />
          <button type="button" data-remove-image="${index}" aria-label="Remover imagem">×</button>
        </div>
      `
    )
    .join("");
}

function updateCharacterCounts() {
  document.querySelector("#short-description-count").textContent = String(
    document.querySelector("#product-short-description").value.length
  );
  document.querySelector("#description-count").textContent = String(
    document.querySelector("#product-description").value.length
  );
}

function openProductModal(product = null) {
  const form = document.querySelector("#product-form");
  form.reset();
  document.querySelector("#product-id").value = product?.id || "";
  document.querySelector("#product-modal-title").textContent = product ? "Editar produto" : "Novo produto";
  document.querySelector("#product-name").value = product?.name || "";
  document.querySelector("#product-category").value =
    product?.categoryId || sortedCategories()[0]?.id || "";
  document.querySelector("#product-condition").value = product?.condition || "";
  document.querySelector("#product-short-description").value = product?.shortDescription || "";
  document.querySelector("#product-description").value = product?.description || "";
  document.querySelector("#product-price").value = product?.price ?? "";
  document.querySelector("#product-compare-price").value = product?.compareAtPrice ?? "";
  document.querySelector("#product-stock").value = product?.stock ?? 1;
  document.querySelector("#product-tags").value = (product?.tags || []).join(", ");
  document.querySelector("#product-active").checked = product?.active !== false;
  document.querySelector("#product-featured").checked = Boolean(product?.featured);
  adminState.productImages = [...(product?.images || [])];
  document.querySelector("#image-url").value = "";
  renderImageList();
  updateCharacterCounts();
  adminElements.productModal.showModal();
  window.setTimeout(() => document.querySelector("#product-name").focus(), 50);
}

function openCategoryModal(category = null) {
  document.querySelector("#category-form").reset();
  document.querySelector("#category-id").value = category?.id || "";
  document.querySelector("#category-modal-title").textContent = category
    ? "Editar categoria"
    : "Nova categoria";
  document.querySelector("#category-name").value = category?.name || "";
  document.querySelector("#category-order").value =
    category?.order ?? sortedCategories().length + 1;
  document.querySelector("#category-active").checked = category?.active !== false;
  adminElements.categoryModal.showModal();
  window.setTimeout(() => document.querySelector("#category-name").focus(), 50);
}

function closeModal(id) {
  const modal = document.querySelector(`#${id}`);
  if (modal?.open) modal.close();
}

function askConfirmation({ title, message, actionLabel = "Excluir", action }) {
  document.querySelector("#confirm-title").textContent = title;
  document.querySelector("#confirm-message").textContent = message;
  document.querySelector("#confirm-action").textContent = actionLabel;
  adminState.confirmAction = action;
  adminElements.confirmDialog.showModal();
}

function setButtonLoading(button, loading) {
  button.classList.toggle("is-loading", loading);
  button.disabled = loading;
}

async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível otimizar a imagem."))),
      "image/webp",
      0.82
    );
  });
}

async function uploadFiles(fileList) {
  const remainingSlots = 8 - adminState.productImages.length;
  const files = [...fileList].slice(0, remainingSlots);
  if (!files.length) {
    showToast("O produto já possui o limite de 8 imagens.", "error");
    return;
  }

  adminElements.uploadProgress.hidden = false;
  try {
    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new Error(`O arquivo ${file.name} não é uma imagem compatível.`);
      }
      const optimized = await compressImage(file);
      if (optimized.size > 2 * 1024 * 1024) {
        throw new Error(`A imagem ${file.name} ficou maior que 2 MB após a otimização.`);
      }
      const formData = new FormData();
      formData.append("file", optimized, `${slugify(file.name.replace(/\.[^.]+$/, "")) || "produto"}.webp`);
      const result = await apiRequest("/api/admin/images", { method: "POST", body: formData });
      adminState.productImages.push(result.url);
      renderImageList();
    }
    showToast(files.length === 1 ? "Imagem enviada." : `${files.length} imagens enviadas.`);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    adminElements.uploadProgress.hidden = true;
    document.querySelector("#product-images").value = "";
  }
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    adminState.view = button.dataset.view;
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("is-active"));
    document.querySelector(`#${adminState.view}-view`).classList.add("is-active");
    const title = adminState.view === "products" ? "Produtos" : "Categorias";
    document.querySelector("#page-title").textContent = title;
    document.querySelector("#breadcrumb-current").textContent = title.toUpperCase();
    document.querySelector("#sidebar").classList.remove("is-open");
  });
});

document.querySelector("#sidebar-toggle").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.toggle("is-open");
});

document.querySelector("#new-product").addEventListener("click", () => {
  if (!adminState.catalog.categories.length) {
    showToast("Crie uma categoria antes de cadastrar um produto.", "error");
    return;
  }
  openProductModal();
});

document.querySelector("#new-category").addEventListener("click", () => openCategoryModal());

adminElements.search.addEventListener("input", renderProducts);
adminElements.categoryFilter.addEventListener("change", renderProducts);
adminElements.statusFilter.addEventListener("change", renderProducts);

adminElements.productList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-product]");
  if (editButton) {
    const product = adminState.catalog.products.find((item) => item.id === editButton.dataset.editProduct);
    if (product) openProductModal(product);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    const product = adminState.catalog.products.find((item) => item.id === deleteButton.dataset.deleteProduct);
    if (!product) return;
    askConfirmation({
      title: "Excluir produto?",
      message: `${product.name} será removido da vitrine e do catálogo.`,
      action: async () => {
        await mutateCatalog("deleteProduct", { id: product.id });
        showToast("Produto excluído.");
      }
    });
  }
});

adminElements.categoryList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-category]");
  if (editButton) {
    const category = adminState.catalog.categories.find(
      (item) => item.id === editButton.dataset.editCategory
    );
    if (category) openCategoryModal(category);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-category]");
  if (deleteButton) {
    const category = adminState.catalog.categories.find(
      (item) => item.id === deleteButton.dataset.deleteCategory
    );
    if (!category) return;
    askConfirmation({
      title: "Excluir categoria?",
      message: `${category.name} só poderá ser excluída se não possuir produtos.`,
      action: async () => {
        await mutateCatalog("deleteCategory", { id: category.id });
        showToast("Categoria excluída.");
      }
    });
  }
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.dataset.closeModal));
});

document.querySelector("#product-short-description").addEventListener("input", updateCharacterCounts);
document.querySelector("#product-description").addEventListener("input", updateCharacterCounts);

document.querySelector("#product-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.querySelector("#save-product");
  const categoryId = document.querySelector("#product-category").value;
  const name = document.querySelector("#product-name").value.trim();
  if (!name || !categoryId) {
    showToast("Preencha o nome e a categoria.", "error");
    return;
  }

  const product = {
    id: document.querySelector("#product-id").value || undefined,
    name,
    slug: slugify(name),
    categoryId,
    condition: document.querySelector("#product-condition").value.trim(),
    shortDescription: document.querySelector("#product-short-description").value.trim(),
    description: document.querySelector("#product-description").value.trim(),
    price: Number(document.querySelector("#product-price").value || 0),
    compareAtPrice: document.querySelector("#product-compare-price").value
      ? Number(document.querySelector("#product-compare-price").value)
      : null,
    stock: Math.max(0, Number(document.querySelector("#product-stock").value || 0)),
    images: adminState.productImages,
    tags: document
      .querySelector("#product-tags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 20),
    active: document.querySelector("#product-active").checked,
    featured: document.querySelector("#product-featured").checked
  };

  setButtonLoading(button, true);
  try {
    await mutateCatalog("saveProduct", product);
    closeModal("product-modal");
    showToast(product.id ? "Produto atualizado e publicado." : "Produto criado e publicado.");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setButtonLoading(button, false);
  }
});

document.querySelector("#category-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.querySelector("#save-category");
  const name = document.querySelector("#category-name").value.trim();
  const category = {
    id: document.querySelector("#category-id").value || undefined,
    name,
    slug: slugify(name),
    order: Math.max(0, Number(document.querySelector("#category-order").value || 0)),
    active: document.querySelector("#category-active").checked
  };

  setButtonLoading(button, true);
  try {
    await mutateCatalog("saveCategory", category);
    closeModal("category-modal");
    showToast(category.id ? "Categoria atualizada." : "Categoria criada.");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setButtonLoading(button, false);
  }
});

document.querySelector("#product-images").addEventListener("change", (event) => uploadFiles(event.target.files));

const uploadZone = document.querySelector("#upload-zone");
["dragenter", "dragover"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.add("is-dragging");
  });
});
["dragleave", "drop"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.remove("is-dragging");
  });
});
uploadZone.addEventListener("drop", (event) => uploadFiles(event.dataTransfer.files));

adminElements.imageList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-image]");
  if (!button) return;
  adminState.productImages.splice(Number(button.dataset.removeImage), 1);
  renderImageList();
});

document.querySelector("#add-image-url").addEventListener("click", () => {
  const input = document.querySelector("#image-url");
  const url = input.value.trim();
  if (!/^https?:\/\//i.test(url)) {
    showToast("Informe uma URL completa iniciada por http:// ou https://.", "error");
    return;
  }
  if (adminState.productImages.length >= 8) {
    showToast("O limite é de 8 imagens por produto.", "error");
    return;
  }
  adminState.productImages.push(url);
  input.value = "";
  renderImageList();
});

document.querySelector("#confirm-cancel").addEventListener("click", () => {
  adminState.confirmAction = null;
  adminElements.confirmDialog.close();
});

document.querySelector("#confirm-action").addEventListener("click", async () => {
  const button = document.querySelector("#confirm-action");
  const action = adminState.confirmAction;
  if (!action) return;
  button.disabled = true;
  try {
    await action();
    adminElements.confirmDialog.close();
    adminState.confirmAction = null;
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    button.disabled = false;
  }
});

[adminElements.productModal, adminElements.categoryModal, adminElements.confirmDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
});

loadCatalog();
