import type { Product } from "../types";
import { useShop } from "../store/ShopStore";
import { currency } from "../lib/utils";
import { navigate } from "../lib/router";
import { StoredImage } from "./StoredImage";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, data } = useShop();
  const toast = useToast();
  const category = data.categories.find((item) => item.id === product.categoryId)?.name || "Produto";

  function add() {
    addToCart(product.id);
    toast(`${product.name} adicionado ao carrinho.`);
  }

  return <article className="product-card">
    <button className="product-media" onClick={() => navigate(`/produto/${product.id}`)}>
      <StoredImage src={product.images[0]} alt={product.name}/>
      <span>{product.condition}</span>
      {product.featured && <b>Destaque</b>}
    </button>
    <div className="product-body">
      <small>{category}</small>
      <button className="product-title" onClick={() => navigate(`/produto/${product.id}`)}>{product.name}</button>
      <p>{product.shortDescription}</p>
      <div className="product-price"><div>{product.compareAtPrice && <del>{currency(product.compareAtPrice)}</del>}<strong>{currency(product.price)}</strong><small>valor sujeito à confirmação</small></div><button onClick={add} aria-label={`Adicionar ${product.name} ao carrinho`}><Icon name="bag"/></button></div>
    </div>
  </article>;
}
