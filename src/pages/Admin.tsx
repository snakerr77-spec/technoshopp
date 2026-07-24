import { useMemo, useState } from "react";
import { useShop } from "../store/ShopStore";
import { Icon } from "../components/Icon";
import { StoredImage } from "../components/StoredImage";
import { currency, dateTime } from "../lib/utils";
import { deleteImage, saveImage } from "../lib/imageStore";
import { navigate } from "../lib/router";
import { useToast } from "../components/Toast";
import type {
  Category,
  IphoneEvaluation,
  OrderStatus,
  Product,
} from "../types";

type AdminTab =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "evaluations"
  | "messages"
  | "customers";

const emptyProduct = (): Omit<Product, "id" | "slug" | "createdAt"> & {
  id?: string;
} => ({
  name: "",
  categoryId: "",
  condition: "Novo",
  shortDescription: "",
  description: "",
  price: 0,
  compareAtPrice: undefined,
  images: [],
  stock: 1,
  active: true,
  featured: false,
  tags: [],
  dimensions: { weightKg: 0.5, widthCm: 12, heightCm: 8, lengthCm: 20 },
});

export function Admin() {
  const shop = useShop();
  const toast = useToast();
  const { currentUser, data } = shop;
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [productModal, setProductModal] = useState(false);
  const [productDraft, setProductDraft] = useState(emptyProduct());
  const [categoryDraft, setCategoryDraft] = useState<Partial<Category>>({
    name: "",
    active: true,
    order: data.categories.length + 1,
  });
  const [busy, setBusy] = useState(false);
  const [orderQuery, setOrderQuery] = useState("");

  if (!currentUser) {
    window.setTimeout(() => navigate("/entrar"), 0);
    return null;
  }
  if (currentUser.role !== "admin")
    return (
      <section className="page-section">
        <div className="container empty-panel">
          <Icon name="lock" size={36} />
          <h2>Acesso restrito</h2>
          <p>Somente administradores podem abrir esta área.</p>
          <button className="btn primary" onClick={() => navigate("/")}>
            Voltar para a loja
          </button>
        </div>
      </section>
    );

  const visibleOrders = data.orders.filter((order) =>
    `${order.code} ${order.customerName}`
      .toLowerCase()
      .includes(orderQuery.toLowerCase()),
  );

  function openNewProduct() {
    setProductDraft({
      ...emptyProduct(),
      categoryId: data.categories[0]?.id || "",
    });
    setProductModal(true);
  }

  function openEditProduct(product: Product) {
    setProductDraft({ ...product });
    setProductModal(true);
  }

  async function uploadProductImages(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files || []).slice(
      0,
      Math.max(0, 8 - productDraft.images.length),
    );
    if (!files.length) return;
    setBusy(true);
    try {
      const images = await Promise.all(files.map(saveImage));
      setProductDraft((current) => ({
        ...current,
        images: [...current.images, ...images],
      }));
      toast("Imagens adicionadas ao produto.");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Falha ao enviar as imagens.",
      );
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function removeDraftImage(ref: string) {
    setProductDraft((current) => ({
      ...current,
      images: current.images.filter((item) => item !== ref),
    }));
    await deleteImage(ref).catch(() => undefined);
  }

  function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (
      !productDraft.name.trim() ||
      !productDraft.categoryId ||
      productDraft.price <= 0
    )
      return toast("Preencha nome, categoria e preço.");
    shop.saveProduct({
      ...productDraft,
      tags: productDraft.tags.filter(Boolean),
    });
    setProductModal(false);
    toast(productDraft.id ? "Produto atualizado." : "Produto criado.");
  }

  function removeProduct(product: Product) {
    if (!window.confirm(`Excluir ${product.name}?`)) return;
    product.images.forEach((image) =>
      deleteImage(image).catch(() => undefined),
    );
    shop.deleteProduct(product.id);
    toast("Produto excluído.");
  }

  function saveCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!categoryDraft.name?.trim()) return;
    shop.saveCategory({
      id: categoryDraft.id,
      name: categoryDraft.name,
      active: categoryDraft.active !== false,
      order: Number(categoryDraft.order) || 1,
    });
    setCategoryDraft({
      name: "",
      active: true,
      order: data.categories.length + 1,
    });
    toast(categoryDraft.id ? "Categoria atualizada." : "Categoria criada.");
  }

  const navItems: [AdminTab, string, string, number?][] = [
    ["dashboard", "Visão geral", "dashboard"],
    ["products", "Produtos", "box", data.products.length],
    ["categories", "Categorias", "menu", data.categories.length],
    ["orders", "Pedidos", "bag", data.orders.length],
    ["evaluations", "Avaliações", "camera", data.evaluations.length],
    [
      "messages",
      "Mensagens",
      "message",
      data.messages.filter((item) => item.status === "Aberta").length,
    ],
    [
      "customers",
      "Clientes",
      "user",
      data.users.filter((item) => item.role === "customer").length,
    ],
  ];

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <button className="admin-brand" onClick={() => navigate("/")}>
          <img src="/assets/tecnoshop-logo.png" alt="" />
          <span>
            <strong>
              TECNO<span>SHOP</span>
            </strong>
            <small>PAINEL ADMIN</small>
          </span>
        </button>
        <nav>
          {navItems.map(([id, label, icon, count]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <Icon name={icon} size={19} />
              <span>{label}</span>
              {typeof count === "number" && <b>{count}</b>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <button onClick={() => navigate("/")}>
            <Icon name="arrow" size={18} /> Ver loja
          </button>
          <button onClick={shop.resetDemo}>
            <Icon name="trash" size={18} /> Restaurar demonstração
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>PAINEL ADMINISTRATIVO</span>
            <h1>{navItems.find(([id]) => id === tab)?.[1]}</h1>
          </div>
          <div>
            <small>Conectado como</small>
            <strong>{currentUser.name}</strong>
          </div>
        </header>
        <div className="admin-content">
          {tab === "dashboard" && <Dashboard />}
          {tab === "products" && (
            <section>
              <div className="admin-section-head">
                <div>
                  <h2>Produtos</h2>
                  <p>Cadastre itens, imagens, preço e estoque.</p>
                </div>
                <button className="btn primary" onClick={openNewProduct}>
                  <Icon name="plus" /> Novo produto
                </button>
              </div>
              <div className="admin-table products-table">
                <div className="table-head">
                  <span>Produto</span>
                  <span>Categoria</span>
                  <span>Preço</span>
                  <span>Estoque</span>
                  <span>Status</span>
                  <span>Ações</span>
                </div>
                {data.products.map((product) => (
                  <div className="table-row" key={product.id}>
                    <div className="table-product">
                      <StoredImage src={product.images[0]} alt="" />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.condition}</small>
                      </span>
                    </div>
                    <span>
                      {data.categories.find(
                        (category) => category.id === product.categoryId,
                      )?.name || "—"}
                    </span>
                    <strong>{currency(product.price)}</strong>
                    <span>{product.stock}</span>
                    <span
                      className={`status-pill ${product.active ? "on" : "off"}`}
                    >
                      {product.active ? "Publicado" : "Oculto"}
                    </span>
                    <div className="table-actions">
                      <button onClick={() => openEditProduct(product)}>
                        <Icon name="edit" size={17} />
                      </button>
                      <button onClick={() => removeProduct(product)}>
                        <Icon name="trash" size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {tab === "categories" && (
            <section>
              <div className="admin-section-head">
                <div>
                  <h2>Categorias</h2>
                  <p>Organize o catálogo da loja.</p>
                </div>
              </div>
              <div className="category-admin-layout">
                <form
                  className="admin-card category-form"
                  onSubmit={saveCategory}
                >
                  <h3>
                    {categoryDraft.id ? "Editar categoria" : "Nova categoria"}
                  </h3>
                  <label>
                    Nome
                    <input
                      required
                      value={categoryDraft.name || ""}
                      onChange={(event) =>
                        setCategoryDraft({
                          ...categoryDraft,
                          name: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Ordem
                    <input
                      type="number"
                      min="1"
                      value={categoryDraft.order || 1}
                      onChange={(event) =>
                        setCategoryDraft({
                          ...categoryDraft,
                          order: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="toggle-line">
                    <input
                      type="checkbox"
                      checked={categoryDraft.active !== false}
                      onChange={(event) =>
                        setCategoryDraft({
                          ...categoryDraft,
                          active: event.target.checked,
                        })
                      }
                    />{" "}
                    Categoria visível
                  </label>
                  <button className="btn primary full">
                    {categoryDraft.id ? "Salvar alterações" : "Criar categoria"}
                  </button>
                  {categoryDraft.id && (
                    <button
                      type="button"
                      className="btn ghost full"
                      onClick={() =>
                        setCategoryDraft({
                          name: "",
                          active: true,
                          order: data.categories.length + 1,
                        })
                      }
                    >
                      Cancelar edição
                    </button>
                  )}
                </form>
                <div className="category-list">
                  {[...data.categories]
                    .sort((a, b) => a.order - b.order)
                    .map((category) => (
                      <article key={category.id}>
                        <span>
                          <b>{String(category.order).padStart(2, "0")}</b>
                          <div>
                            <strong>{category.name}</strong>
                            <small>
                              {
                                data.products.filter(
                                  (product) =>
                                    product.categoryId === category.id,
                                ).length
                              }{" "}
                              produto(s)
                            </small>
                          </div>
                        </span>
                        <div>
                          <i className={category.active ? "active" : ""} />
                          <button onClick={() => setCategoryDraft(category)}>
                            <Icon name="edit" size={17} />
                          </button>
                          <button
                            onClick={() => {
                              const result = shop.deleteCategory(category.id);
                              toast(result.message);
                            }}
                          >
                            <Icon name="trash" size={17} />
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            </section>
          )}
          {tab === "orders" && (
            <section>
              <div className="admin-section-head">
                <div>
                  <h2>Pedidos recebidos</h2>
                  <p>Confirme estoque, pagamento e rastreamento.</p>
                </div>
                <label className="search-field admin-search">
                  <Icon name="search" size={17} />
                  <input
                    value={orderQuery}
                    onChange={(event) => setOrderQuery(event.target.value)}
                    placeholder="Buscar pedido ou cliente..."
                  />
                </label>
              </div>
              {visibleOrders.length ? (
                <div className="admin-order-list">
                  {visibleOrders.map((order) => (
                    <article key={order.id}>
                      <div className="admin-order-top">
                        <div>
                          <small>{dateTime(order.createdAt)}</small>
                          <h3>
                            #{order.code} • {order.customerName}
                          </h3>
                          <p>
                            {order.customerPhone} • {order.address.city}/
                            {order.address.state}
                          </p>
                        </div>
                        <strong>{currency(order.total)}</strong>
                      </div>
                      <div className="admin-order-items">
                        {order.items.map((item) => (
                          <span key={item.productId}>
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                      <div className="admin-order-controls">
                        <label>
                          Status
                          <select
                            value={order.status}
                            onChange={(event) =>
                              shop.updateOrderStatus(
                                order.id,
                                event.target.value as OrderStatus,
                              )
                            }
                          >
                            {[
                              "Aguardando vendedor",
                              "Pedido confirmado",
                              "Aguardando pagamento",
                              "Pagamento confirmado",
                              "Preparando envio",
                              "Enviado",
                              "Concluído",
                              "Cancelado",
                            ].map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Rastreamento
                          <input
                            defaultValue={order.trackingCode || ""}
                            onBlur={(event) =>
                              shop.updateOrderStatus(
                                order.id,
                                order.status,
                                event.target.value,
                              )
                            }
                            placeholder="Código dos Correios"
                          />
                        </label>
                      </div>
                      {order.note && (
                        <blockquote>Observação: {order.note}</blockquote>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyAdmin title="Nenhum pedido recebido" />
              )}
            </section>
          )}
          {tab === "evaluations" && (
            <section>
              <div className="admin-section-head">
                <div>
                  <h2>Avaliações de iPhone</h2>
                  <p>Analise os dados e envie uma estimativa.</p>
                </div>
              </div>
              {data.evaluations.length ? (
                <div className="admin-evaluation-grid">
                  {data.evaluations.map((item) => (
                    <EvaluationCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyAdmin title="Nenhuma avaliação recebida" />
              )}
            </section>
          )}
          {tab === "messages" && (
            <section>
              <div className="admin-section-head">
                <div>
                  <h2>Mensagens de clientes</h2>
                  <p>Responda solicitações enviadas pelo site.</p>
                </div>
              </div>
              {data.messages.length ? (
                <div className="admin-message-list">
                  {data.messages.map((item) => (
                    <article key={item.id}>
                      <div>
                        <small>
                          {dateTime(item.createdAt)} • {item.status}
                        </small>
                        <h3>{item.subject}</h3>
                        <strong>{item.customerName}</strong>
                        <p>{item.message}</p>
                      </div>
                      <textarea
                        defaultValue={item.reply || ""}
                        placeholder="Digite uma resposta..."
                        onBlur={(event) =>
                          event.target.value.trim() &&
                          shop.replyMessage(item.id, event.target.value.trim())
                        }
                      />
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyAdmin title="Nenhuma mensagem recebida" />
              )}
            </section>
          )}
          {tab === "customers" && (
            <section>
              <div className="admin-section-head">
                <div>
                  <h2>Clientes cadastrados</h2>
                  <p>
                    Dados básicos para atendimento. Senhas nunca são exibidas.
                  </p>
                </div>
              </div>
              {data.users.filter((user) => user.role === "customer").length ? (
                <div className="admin-table customer-table">
                  <div className="table-head">
                    <span>Cliente</span>
                    <span>Contato</span>
                    <span>Pedidos</span>
                    <span>Avaliações</span>
                    <span>Cadastro</span>
                  </div>
                  {data.users
                    .filter((user) => user.role === "customer")
                    .map((user) => (
                      <div className="table-row" key={user.id}>
                        <div>
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                        </div>
                        <span>{user.phone}</span>
                        <strong>
                          {
                            data.orders.filter(
                              (order) => order.userId === user.id,
                            ).length
                          }
                        </strong>
                        <span>
                          {
                            data.evaluations.filter(
                              (item) => item.userId === user.id,
                            ).length
                          }
                        </span>
                        <span>{dateTime(user.createdAt)}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyAdmin title="Nenhum cliente cadastrado" />
              )}
            </section>
          )}
        </div>
      </div>
      {productModal && (
        <div className="modal-shell">
          <button
            className="modal-backdrop"
            onClick={() => setProductModal(false)}
          />
          <form
            className="admin-modal product-editor-modal"
            onSubmit={saveProduct}
          >
            <div className="modal-head">
              <div className="product-modal-title">
                <b className="product-modal-icon">
                  <Icon name={productDraft.id ? "edit" : "plus"} size={20} />
                </b>
                <div>
                  <span>CATÁLOGO DE PRODUTOS</span>
                  <h2>{productDraft.id ? "Editar produto" : "Novo produto"}</h2>
                  <p>
                    {productDraft.id
                      ? "Atualize as informações que aparecem na loja."
                      : "Preencha os dados para adicionar um novo item à loja."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setProductModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-scroll">
              <div className="product-editor-grid">
                <main className="product-editor-main">
                  <section className="product-form-section">
                    <header className="product-section-head">
                      <b>
                        <Icon name="box" size={18} />
                      </b>
                      <div>
                        <h3>Informações básicas</h3>
                        <p>Identificação e organização do produto.</p>
                      </div>
                    </header>
                    <div className="product-fields basic-product-fields">
                      <label className="field-wide">
                        <span className="field-label">
                          Nome do produto <b>*</b>
                        </span>
                        <input
                          required
                          placeholder="Ex.: iPhone 15 Pro Max 256 GB"
                          value={productDraft.name}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              name: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        <span className="field-label">
                          Categoria <b>*</b>
                        </span>
                        <select
                          required
                          value={productDraft.categoryId}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              categoryId: event.target.value,
                            })
                          }
                        >
                          {data.categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="field-label">Condição</span>
                        <input
                          placeholder="Ex.: Seminovo premium"
                          value={productDraft.condition}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              condition: event.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  </section>

                  <section className="product-form-section">
                    <header className="product-section-head">
                      <b>
                        <Icon name="card" size={18} />
                      </b>
                      <div>
                        <h3>Preço e estoque</h3>
                        <p>Valores de venda e disponibilidade do item.</p>
                      </div>
                    </header>
                    <div className="product-fields commerce-product-fields">
                      <label>
                        <span className="field-label">
                          Preço de venda <b>*</b>
                        </span>
                        <div className="input-prefix">
                          <span>R$</span>
                          <input
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0,00"
                            value={productDraft.price || ""}
                            onChange={(event) =>
                              setProductDraft({
                                ...productDraft,
                                price: Number(event.target.value),
                              })
                            }
                          />
                        </div>
                      </label>
                      <label>
                        <span className="field-label">Preço anterior</span>
                        <div className="input-prefix">
                          <span>R$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            value={productDraft.compareAtPrice || ""}
                            onChange={(event) =>
                              setProductDraft({
                                ...productDraft,
                                compareAtPrice: event.target.value
                                  ? Number(event.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                      </label>
                      <label>
                        <span className="field-label">Estoque</span>
                        <input
                          type="number"
                          min="0"
                          value={productDraft.stock}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              stock: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        <span className="field-label">Peso</span>
                        <div className="input-suffix">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={productDraft.dimensions.weightKg}
                            onChange={(event) =>
                              setProductDraft({
                                ...productDraft,
                                dimensions: {
                                  ...productDraft.dimensions,
                                  weightKg: Number(event.target.value),
                                },
                              })
                            }
                          />
                          <span>kg</span>
                        </div>
                      </label>
                    </div>
                  </section>

                  <section className="product-form-section">
                    <header className="product-section-head">
                      <b>
                        <Icon name="message" size={18} />
                      </b>
                      <div>
                        <h3>Apresentação do produto</h3>
                        <p>Conte ao cliente os principais diferenciais.</p>
                      </div>
                    </header>
                    <div className="product-fields">
                      <label className="field-wide">
                        <span className="field-label">
                          Resumo curto <b>*</b>
                        </span>
                        <input
                          required
                          maxLength={140}
                          placeholder="Uma frase curta para aparecer nos cards da loja"
                          value={productDraft.shortDescription}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              shortDescription: event.target.value,
                            })
                          }
                        />
                        <small>
                          {productDraft.shortDescription.length}/140 caracteres
                        </small>
                      </label>
                      <label className="field-wide">
                        <span className="field-label">
                          Descrição completa <b>*</b>
                        </span>
                        <textarea
                          required
                          rows={6}
                          placeholder="Descreva estado, conservação, acessórios e diferenciais..."
                          value={productDraft.description}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              description: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label className="field-wide">
                        <span className="field-label">Tags de busca</span>
                        <input
                          placeholder="Apple, 5G, Seminovo"
                          value={productDraft.tags.join(", ")}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              tags: event.target.value
                                .split(",")
                                .map((tag) => tag.trim()),
                            })
                          }
                        />
                        <small>Separe cada tag usando uma vírgula.</small>
                      </label>
                    </div>
                  </section>
                </main>

                <aside className="product-editor-side">
                  <section className="product-form-section product-media-section">
                    <header className="product-section-head">
                      <b>
                        <Icon name="camera" size={18} />
                      </b>
                      <div>
                        <h3>Fotos do produto</h3>
                        <p>{productDraft.images.length} de 8 imagens</p>
                      </div>
                    </header>
                    <label className={`product-uploader ${busy ? "busy" : ""}`}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={uploadProductImages}
                        disabled={busy || productDraft.images.length >= 8}
                      />
                      <b>
                        <Icon name={busy ? "box" : "plus"} size={21} />
                      </b>
                      <strong>
                        {busy ? "Processando imagens..." : "Adicionar fotos"}
                      </strong>
                      <span>PNG, JPG ou WebP • até 8 imagens</span>
                    </label>
                    {productDraft.images.length > 0 ? (
                      <div className="admin-images product-image-grid">
                        {productDraft.images.map((image, index) => (
                          <div key={image}>
                            <StoredImage
                              src={image}
                              alt={`Foto ${index + 1} do produto`}
                            />
                            <span>
                              {index === 0
                                ? "Foto principal"
                                : `Foto ${index + 1}`}
                            </span>
                            <button
                              type="button"
                              aria-label={`Remover foto ${index + 1}`}
                              onClick={() => removeDraftImage(image)}
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="product-image-empty">
                        A primeira imagem será usada como capa do produto.
                      </div>
                    )}
                  </section>

                  <section className="product-form-section">
                    <header className="product-section-head">
                      <b>
                        <Icon name="check" size={18} />
                      </b>
                      <div>
                        <h3>Visibilidade</h3>
                        <p>Controle onde o produto será exibido.</p>
                      </div>
                    </header>
                    <div className="product-toggle-list">
                      <label className="product-toggle-card">
                        <span>
                          <strong>Publicar na loja</strong>
                          <small>Disponível para todos os visitantes.</small>
                        </span>
                        <input
                          type="checkbox"
                          checked={productDraft.active}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              active: event.target.checked,
                            })
                          }
                        />
                        <i />
                      </label>
                      <label className="product-toggle-card">
                        <span>
                          <strong>Produto em destaque</strong>
                          <small>Aparece nas áreas principais da loja.</small>
                        </span>
                        <input
                          type="checkbox"
                          checked={productDraft.featured}
                          onChange={(event) =>
                            setProductDraft({
                              ...productDraft,
                              featured: event.target.checked,
                            })
                          }
                        />
                        <i />
                      </label>
                    </div>
                  </section>

                  <div className="product-editor-summary">
                    <div>
                      <span
                        className={`summary-status ${
                          productDraft.active ? "active" : ""
                        }`}
                      >
                        <i />
                        {productDraft.active
                          ? "Será publicado"
                          : "Ficará oculto"}
                      </span>
                      <small>Prévia do cadastro</small>
                    </div>
                    <strong>
                      {productDraft.price > 0
                        ? currency(productDraft.price)
                        : "Preço não informado"}
                    </strong>
                    <span>{productDraft.stock} unidade(s) em estoque</span>
                  </div>
                </aside>
              </div>
            </div>
            <div className="modal-footer">
              <p>
                <Icon name="shield" size={16} />
                Revise as informações antes de salvar.
              </p>
              <div>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setProductModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn primary">
                  <Icon name="check" size={18} />
                  {productDraft.id ? "Salvar alterações" : "Criar produto"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function Dashboard() {
  const { data } = useShop();
  const revenue = data.orders
    .filter((order) => !["Cancelado"].includes(order.status))
    .reduce((sum, order) => sum + order.total, 0);
  const cards = [
    [
      "Produtos publicados",
      data.products.filter((item) => item.active).length,
      "box",
    ],
    ["Pedidos recebidos", data.orders.length, "bag"],
    [
      "Clientes",
      data.users.filter((item) => item.role === "customer").length,
      "user",
    ],
    ["Total estimado", currency(revenue), "card"],
  ];
  return (
    <section>
      <div className="dashboard-welcome">
        <div>
          <span>VISÃO GERAL</span>
          <h2>Sua operação em um só lugar.</h2>
          <p>
            Cadastre produtos, responda clientes e acompanhe pedidos enviados
            pela loja.
          </p>
        </div>
        <button className="btn secondary" onClick={() => navigate("/")}>
          Abrir loja <Icon name="arrow" />
        </button>
      </div>
      <div className="dashboard-cards">
        {cards.map(([label, value, icon]) => (
          <article key={String(label)}>
            <span>
              <Icon name={String(icon)} size={22} />
            </span>
            <small>{label}</small>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="dashboard-columns">
        <div className="admin-card">
          <h3>Pedidos recentes</h3>
          {data.orders.slice(0, 5).length ? (
            data.orders.slice(0, 5).map((order) => (
              <div className="dashboard-row" key={order.id}>
                <span>
                  <strong>#{order.code}</strong>
                  <small>{order.customerName}</small>
                </span>
                <b>{order.status}</b>
                <strong>{currency(order.total)}</strong>
              </div>
            ))
          ) : (
            <p className="muted">Nenhum pedido recebido ainda.</p>
          )}
        </div>
        <div className="admin-card">
          <h3>Pendências</h3>
          <div className="pending-row">
            <Icon name="camera" />
            <span>
              <strong>
                {
                  data.evaluations.filter(
                    (item) => item.status === "Aguardando análise",
                  ).length
                }{" "}
                avaliações
              </strong>
              <small>Aguardando análise</small>
            </span>
          </div>
          <div className="pending-row">
            <Icon name="message" />
            <span>
              <strong>
                {
                  data.messages.filter((item) => item.status === "Aberta")
                    .length
                }{" "}
                mensagens
              </strong>
              <small>Sem resposta</small>
            </span>
          </div>
          <div className="pending-row">
            <Icon name="bag" />
            <span>
              <strong>
                {
                  data.orders.filter(
                    (item) => item.status === "Aguardando vendedor",
                  ).length
                }{" "}
                pedidos
              </strong>
              <small>Precisam de confirmação</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function EvaluationCard({ item }: { item: IphoneEvaluation }) {
  const { updateEvaluation } = useShop();
  const [value, setValue] = useState(item.estimatedValue?.toString() || "");
  const [message, setMessage] = useState(item.adminMessage || "");
  return (
    <article>
      <div className="evaluation-head">
        <div>
          <small>{dateTime(item.createdAt)}</small>
          <h3>
            {item.model} • {item.storage}
          </h3>
          <p>
            {item.customerName} • {item.phone}
          </p>
        </div>
        <span>{item.status}</span>
      </div>
      {item.images.length > 0 && (
        <div className="evaluation-images">
          {item.images.slice(0, 4).map((image) => (
            <StoredImage key={image} src={image} alt="Foto do iPhone" />
          ))}
        </div>
      )}
      <div className="evaluation-details">
        <span>
          Bateria <strong>{item.batteryHealth}%</strong>
        </span>
        <span>
          Tela <strong>{item.screenState}</strong>
        </span>
        <span>
          Carcaça <strong>{item.bodyState}</strong>
        </span>
        <span>
          Biometria <strong>{item.biometricsOk ? "OK" : "Com falha"}</strong>
        </span>
      </div>
      {item.notes && <blockquote>{item.notes}</blockquote>}
      <div className="evaluation-response">
        <label>
          Valor estimado
          <input
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="0,00"
          />
        </label>
        <label>
          Resposta
          <textarea
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Explique a avaliação..."
          />
        </label>
        <button
          className="btn primary full"
          onClick={() =>
            updateEvaluation(item.id, {
              estimatedValue: Number(value) || undefined,
              adminMessage: message,
              status: "Avaliação enviada",
            })
          }
        >
          Enviar avaliação
        </button>
      </div>
    </article>
  );
}

function EmptyAdmin({ title }: { title: string }) {
  return (
    <div className="empty-panel small">
      <Icon name="box" size={30} />
      <h3>{title}</h3>
      <p>As informações aparecerão aqui automaticamente.</p>
    </div>
  );
}
