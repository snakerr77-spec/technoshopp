export function uid(prefix = "id") {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function currency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function dateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCep(value: string) {
  const clean = digits(value).slice(0, 8);
  return clean.replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

export function formatPhone(value: string) {
  const clean = digits(value).slice(0, 11);
  if (clean.length <= 10) return clean.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return clean.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${digits(number)}?text=${encodeURIComponent(message)}`;
}
