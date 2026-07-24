import type { AppData, Category, Product } from "./types";

const now = new Date().toISOString();

export const seedCategories: Category[] = [
  { id: "cat-iphones", name: "iPhones", slug: "iphones", active: true, order: 1 },
  { id: "cat-android", name: "Android", slug: "android", active: true, order: 2 },
  { id: "cat-notebooks", name: "Notebooks", slug: "notebooks", active: true, order: 3 },
  { id: "cat-acessorios", name: "Acessórios", slug: "acessorios", active: true, order: 4 },
  { id: "cat-mobilidade", name: "Mobilidade", slug: "mobilidade", active: true, order: 5 }
];

export const seedProducts: Product[] = [
  {
    id: "prod-iphone-15-pro",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    categoryId: "cat-iphones",
    condition: "Seminovo premium",
    shortDescription: "Titânio, câmeras Pro e desempenho para vários anos.",
    description: "Aparelho selecionado para quem busca desempenho avançado, excelente autonomia e conjunto de câmeras profissional. Consulte capacidade, cor e estado disponível com o vendedor.",
    price: 4200,
    compareAtPrice: 4590,
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=88"],
    stock: 3,
    active: true,
    featured: true,
    tags: ["Apple", "5G", "Seminovo"],
    dimensions: { weightKg: 0.7, widthCm: 12, heightCm: 8, lengthCm: 20 },
    createdAt: now
  },
  {
    id: "prod-iphone-14",
    name: "iPhone 14",
    slug: "iphone-14",
    categoryId: "cat-iphones",
    condition: "Novo e seminovo",
    shortDescription: "Ótimo equilíbrio entre câmera, bateria e desempenho.",
    description: "Uma escolha segura para uso diário, trabalho e produção de conteúdo. Consulte as opções novas e seminovas disponíveis.",
    price: 3190,
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=88"],
    stock: 5,
    active: true,
    featured: true,
    tags: ["Apple", "5G"],
    dimensions: { weightKg: 0.6, widthCm: 12, heightCm: 8, lengthCm: 20 },
    createdAt: now
  },
  {
    id: "prod-samsung-s24",
    name: "Galaxy S24",
    slug: "galaxy-s24",
    categoryId: "cat-android",
    condition: "Lacrado",
    shortDescription: "Tela premium, câmeras inteligentes e Galaxy AI.",
    description: "Smartphone Android de alto desempenho, com ótimo conjunto de câmeras, recursos inteligentes e tela de alta qualidade.",
    price: 3790,
    compareAtPrice: 4090,
    images: ["https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=88"],
    stock: 4,
    active: true,
    featured: true,
    tags: ["Samsung", "Android", "5G"],
    dimensions: { weightKg: 0.6, widthCm: 12, heightCm: 8, lengthCm: 20 },
    createdAt: now
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
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=88"],
    stock: 8,
    active: true,
    featured: false,
    tags: ["Xiaomi", "Android"],
    dimensions: { weightKg: 0.6, widthCm: 12, heightCm: 8, lengthCm: 20 },
    createdAt: now
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
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=88"],
    stock: 2,
    active: true,
    featured: true,
    tags: ["Apple", "Notebook", "M2"],
    dimensions: { weightKg: 2.1, widthCm: 35, heightCm: 8, lengthCm: 45 },
    createdAt: now
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
    images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=88"],
    stock: 12,
    active: true,
    featured: false,
    tags: ["Relógio", "Bluetooth"],
    dimensions: { weightKg: 0.3, widthCm: 10, heightCm: 8, lengthCm: 12 },
    createdAt: now
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
    images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=88"],
    stock: 15,
    active: true,
    featured: false,
    tags: ["Áudio", "Bluetooth"],
    dimensions: { weightKg: 0.25, widthCm: 10, heightCm: 7, lengthCm: 12 },
    createdAt: now
  },
  {
    id: "prod-scooter",
    name: "Scooter elétrica Urban X",
    slug: "scooter-eletrica-urban-x",
    categoryId: "cat-mobilidade",
    condition: "Novo",
    shortDescription: "Mobilidade urbana com praticidade e economia.",
    description: "Scooter elétrica para deslocamentos urbanos. Consulte autonomia, velocidade, garantia e disponibilidade.",
    price: 3990,
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=88"],
    stock: 2,
    active: true,
    featured: true,
    tags: ["Elétrica", "Mobilidade"],
    dimensions: { weightKg: 18, widthCm: 22, heightCm: 58, lengthCm: 115 },
    createdAt: now
  }
];

export const seedData: AppData = {
  users: [
    {
      id: "user-admin",
      name: "Administrador TecnoShop",
      email: "admin@tecnoshop.com",
      phone: "15996007266",
      passwordHash: "a36aef5a11c4073fbe60314fc9df530a9d5f986533594d1f5190742ff9e0e408",
      role: "admin",
      addresses: [],
      createdAt: now
    }
  ],
  categories: seedCategories,
  products: seedProducts,
  orders: [],
  evaluations: [],
  messages: [],
  settings: {
    whatsapp: "5515996007266",
    sellerName: "Equipe TecnoShop",
    originCep: "18520000",
    storeAddress: "Rua Ângelo Luvizotto, 401 — Centro",
    city: "Cerquilho — SP"
  }
};
