import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedData } from "../data";
import type { Address, AppData, CartItem, Category, IphoneEvaluation, Order, OrderStatus, Product, SellerMessage, ShippingOption, User } from "../types";
import { digits, sha256, slugify, uid } from "../lib/utils";

const DATA_KEY = "tecnoshop-vendas-data-v1";
const SESSION_KEY = "tecnoshop-vendas-session-v1";
const CART_KEY = "tecnoshop-vendas-cart-v1";

type ProductInput = Omit<Product, "id" | "slug" | "createdAt"> & { id?: string };
type CategoryInput = Omit<Category, "id" | "slug"> & { id?: string };

interface StoreValue {
  data: AppData;
  currentUser: User | null;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  activeProducts: Product[];
  login(email: string, password: string): Promise<{ ok: boolean; message: string }>;
  register(input: { name: string; email: string; phone: string; password: string }): Promise<{ ok: boolean; message: string }>;
  logout(): void;
  addToCart(productId: string, quantity?: number): void;
  setCartQuantity(productId: string, quantity: number): void;
  removeFromCart(productId: string): void;
  clearCart(): void;
  saveAddress(address: Omit<Address, "id"> & { id?: string }): Address;
  calculateShipping(cep: string): ShippingOption[];
  createOrder(input: { address: Address; shipping: ShippingOption; note?: string }): Order;
  updateOrderStatus(orderId: string, status: OrderStatus, trackingCode?: string): void;
  saveProduct(product: ProductInput): Product;
  deleteProduct(productId: string): void;
  saveCategory(category: CategoryInput): Category;
  deleteCategory(categoryId: string): { ok: boolean; message: string };
  createEvaluation(input: Omit<IphoneEvaluation, "id" | "userId" | "customerName" | "status" | "createdAt">): IphoneEvaluation;
  updateEvaluation(id: string, patch: Partial<IphoneEvaluation>): void;
  createMessage(input: { subject: string; message: string }): SellerMessage;
  replyMessage(id: string, reply: string): void;
  resetDemo(): void;
}

const ShopContext = createContext<StoreValue | null>(null);

function loadData(): AppData {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY) || "null");
    return saved && Array.isArray(saved.products) ? saved : seedData;
  } catch {
    return seedData;
  }
}

function loadCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));

  useEffect(() => localStorage.setItem(DATA_KEY, JSON.stringify(data)), [data]);
  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

  const currentUser = data.users.find((user) => user.id === sessionId) || null;
  const activeProducts = useMemo(() => data.products.filter((product) => product.active), [data.products]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const product = data.products.find((candidate) => candidate.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  async function login(email: string, password: string) {
    const passwordHash = await sha256(password);
    const user = data.users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.passwordHash === passwordHash);
    if (!user) return { ok: false, message: "E-mail ou senha incorretos." };
    setSessionId(user.id);
    localStorage.setItem(SESSION_KEY, user.id);
    return { ok: true, message: "Login realizado." };
  }

  async function register(input: { name: string; email: string; phone: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    if (data.users.some((user) => user.email.toLowerCase() === email)) return { ok: false, message: "Este e-mail já está cadastrado." };
    if (input.password.length < 6) return { ok: false, message: "A senha precisa ter pelo menos 6 caracteres." };
    const user: User = {
      id: uid("user"),
      name: input.name.trim(),
      email,
      phone: digits(input.phone),
      passwordHash: await sha256(input.password),
      role: "customer",
      addresses: [],
      createdAt: new Date().toISOString()
    };
    setData((current) => ({ ...current, users: [...current.users, user] }));
    setSessionId(user.id);
    localStorage.setItem(SESSION_KEY, user.id);
    return { ok: true, message: "Conta criada." };
  }

  function logout() {
    setSessionId(null);
    localStorage.removeItem(SESSION_KEY);
  }

  function addToCart(productId: string, quantity = 1) {
    const product = data.products.find((candidate) => candidate.id === productId);
    if (!product || !product.active || product.stock < 1) return;
    setCart((items) => {
      const existing = items.find((item) => item.productId === productId);
      if (existing) return items.map((item) => item.productId === productId ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item);
      return [...items, { productId, quantity: Math.min(product.stock, quantity) }];
    });
  }

  function setCartQuantity(productId: string, quantity: number) {
    const product = data.products.find((candidate) => candidate.id === productId);
    if (!product) return;
    if (quantity <= 0) return removeFromCart(productId);
    setCart((items) => items.map((item) => item.productId === productId ? { ...item, quantity: Math.min(product.stock, quantity) } : item));
  }

  function removeFromCart(productId: string) {
    setCart((items) => items.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  function saveAddress(input: Omit<Address, "id"> & { id?: string }) {
    if (!currentUser) throw new Error("Faça login para salvar o endereço.");
    const address: Address = { ...input, id: input.id || uid("address") };
    setData((current) => ({
      ...current,
      users: current.users.map((user) => user.id === currentUser.id
        ? { ...user, addresses: user.addresses.some((item) => item.id === address.id) ? user.addresses.map((item) => item.id === address.id ? address : item) : [...user.addresses, address] }
        : user)
    }));
    return address;
  }

  function calculateShipping(cep: string): ShippingOption[] {
    const destination = Number(digits(cep).slice(0, 5));
    const origin = Number(digits(data.settings.originCep).slice(0, 5));
    if (!destination || digits(cep).length !== 8) return [];
    const variation = Math.min(42, Math.abs(destination - origin) * 0.0022);
    const packageWeight = cart.reduce((sum, item) => {
      const product = data.products.find((candidate) => candidate.id === item.productId);
      return sum + (product?.dimensions.weightKg || 0.5) * item.quantity;
    }, 0);
    const weightFee = Math.min(32, packageWeight * 1.8);
    const economy = Math.round((18.9 + variation + weightFee) * 100) / 100;
    return [
      { id: "pickup", label: "Retirada na loja", price: 0, deadline: "A combinar", description: data.settings.storeAddress },
      { id: "economy", label: "Entrega econômica", price: economy, deadline: `${Math.max(3, Math.round(4 + variation / 5))} a ${Math.max(6, Math.round(8 + variation / 4))} dias úteis`, description: "Estimativa para envio nacional" },
      { id: "express", label: "Entrega expressa", price: Math.round((economy + 16.5) * 100) / 100, deadline: `${Math.max(2, Math.round(2 + variation / 9))} a ${Math.max(4, Math.round(5 + variation / 7))} dias úteis`, description: "Estimativa para envio mais rápido" }
    ];
  }

  function createOrder(input: { address: Address; shipping: ShippingOption; note?: string }) {
    if (!currentUser) throw new Error("Faça login para enviar o pedido.");
    if (!cart.length) throw new Error("O carrinho está vazio.");
    const items = cart.map((item) => {
      const product = data.products.find((candidate) => candidate.id === item.productId);
      if (!product) throw new Error("Um produto do carrinho não está mais disponível.");
      return { productId: product.id, name: product.name, image: product.images[0] || "", quantity: item.quantity, unitPrice: product.price };
    });
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const timestamp = new Date().toISOString();
    const order: Order = {
      id: uid("order"),
      code: `TS${String(data.orders.length + 1).padStart(5, "0")}`,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      items,
      address: input.address,
      shipping: input.shipping,
      subtotal,
      total: subtotal + input.shipping.price,
      status: "Aguardando vendedor",
      note: input.note,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setData((current) => ({ ...current, orders: [order, ...current.orders] }));
    setCart([]);
    return order;
  }

  function updateOrderStatus(orderId: string, status: OrderStatus, trackingCode?: string) {
    setData((current) => ({
      ...current,
      orders: current.orders.map((order) => order.id === orderId ? { ...order, status, trackingCode: trackingCode ?? order.trackingCode, updatedAt: new Date().toISOString() } : order)
    }));
  }

  function saveProduct(input: ProductInput) {
    const existing = input.id ? data.products.find((product) => product.id === input.id) : undefined;
    const product: Product = {
      ...input,
      id: input.id || uid("product"),
      slug: slugify(input.name),
      createdAt: existing?.createdAt || new Date().toISOString()
    };
    setData((current) => ({
      ...current,
      products: existing ? current.products.map((item) => item.id === product.id ? product : item) : [product, ...current.products]
    }));
    return product;
  }

  function deleteProduct(productId: string) {
    setData((current) => ({ ...current, products: current.products.filter((product) => product.id !== productId) }));
    setCart((items) => items.filter((item) => item.productId !== productId));
  }

  function saveCategory(input: CategoryInput) {
    const existing = input.id ? data.categories.find((category) => category.id === input.id) : undefined;
    const category: Category = { ...input, id: input.id || uid("category"), slug: slugify(input.name) };
    setData((current) => ({
      ...current,
      categories: existing ? current.categories.map((item) => item.id === category.id ? category : item) : [...current.categories, category]
    }));
    return category;
  }

  function deleteCategory(categoryId: string) {
    if (data.products.some((product) => product.categoryId === categoryId)) return { ok: false, message: "Mova ou exclua os produtos desta categoria primeiro." };
    setData((current) => ({ ...current, categories: current.categories.filter((category) => category.id !== categoryId) }));
    return { ok: true, message: "Categoria excluída." };
  }

  function createEvaluation(input: Omit<IphoneEvaluation, "id" | "userId" | "customerName" | "status" | "createdAt">) {
    if (!currentUser) throw new Error("Faça login para enviar a avaliação.");
    const evaluation: IphoneEvaluation = {
      ...input,
      id: uid("evaluation"),
      userId: currentUser.id,
      customerName: currentUser.name,
      status: "Aguardando análise",
      createdAt: new Date().toISOString()
    };
    setData((current) => ({ ...current, evaluations: [evaluation, ...current.evaluations] }));
    return evaluation;
  }

  function updateEvaluation(id: string, patch: Partial<IphoneEvaluation>) {
    setData((current) => ({ ...current, evaluations: current.evaluations.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  }

  function createMessage(input: { subject: string; message: string }) {
    if (!currentUser) throw new Error("Faça login para enviar uma mensagem.");
    const item: SellerMessage = {
      id: uid("message"),
      userId: currentUser.id,
      customerName: currentUser.name,
      subject: input.subject,
      message: input.message,
      status: "Aberta",
      createdAt: new Date().toISOString()
    };
    setData((current) => ({ ...current, messages: [item, ...current.messages] }));
    return item;
  }

  function replyMessage(id: string, reply: string) {
    setData((current) => ({ ...current, messages: current.messages.map((item) => item.id === id ? { ...item, reply, status: "Respondida" } : item) }));
  }

  function resetDemo() {
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(SESSION_KEY);
    setData(seedData);
    setCart([]);
    setSessionId(null);
  }

  const value: StoreValue = {
    data, currentUser, cart, cartCount, cartSubtotal, activeProducts,
    login, register, logout, addToCart, setCartQuantity, removeFromCart, clearCart,
    saveAddress, calculateShipping, createOrder, updateOrderStatus,
    saveProduct, deleteProduct, saveCategory, deleteCategory,
    createEvaluation, updateEvaluation, createMessage, replyMessage, resetDemo
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop precisa estar dentro de ShopProvider.");
  return context;
}
