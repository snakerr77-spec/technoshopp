export type Role = "customer" | "admin";
export type Theme = "dark" | "light";
export type OrderStatus =
  | "Aguardando vendedor"
  | "Pedido confirmado"
  | "Aguardando pagamento"
  | "Pagamento confirmado"
  | "Preparando envio"
  | "Enviado"
  | "Concluído"
  | "Cancelado";

export interface Address {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  passwordHash: string;
  role: Role;
  addresses: Address[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  order: number;
}

export interface ProductDimensions {
  weightKg: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  condition: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  active: boolean;
  featured: boolean;
  tags: string[];
  dimensions: ProductDimensions;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  deadline: string;
  description: string;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  code: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItemSnapshot[];
  address: Address;
  shipping: ShippingOption;
  subtotal: number;
  total: number;
  status: OrderStatus;
  note?: string;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IphoneEvaluation {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  model: string;
  storage: string;
  color: string;
  batteryHealth: string;
  screenState: string;
  bodyState: string;
  camerasOk: boolean;
  biometricsOk: boolean;
  hasBox: boolean;
  hasInvoice: boolean;
  notes: string;
  images: string[];
  status: "Aguardando análise" | "Em análise" | "Avaliação enviada" | "Recusado";
  estimatedValue?: number;
  adminMessage?: string;
  createdAt: string;
}

export interface SellerMessage {
  id: string;
  userId: string;
  customerName: string;
  subject: string;
  message: string;
  status: "Aberta" | "Respondida" | "Encerrada";
  reply?: string;
  createdAt: string;
}

export interface ShopSettings {
  whatsapp: string;
  sellerName: string;
  originCep: string;
  storeAddress: string;
  city: string;
}

export interface AppData {
  users: User[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  evaluations: IphoneEvaluation[];
  messages: SellerMessage[];
  settings: ShopSettings;
}
