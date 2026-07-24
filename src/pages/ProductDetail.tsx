import { useState } from "react";
import { useShop } from "../store/ShopStore";
import { StoredImage } from "../components/StoredImage";
import { Icon } from "../components/Icon";
import { currency, whatsappUrl } from "../lib/utils";
import { navigate } from "../lib/router";
import { useToast } from "../components/Toast";

export function ProductDetail({ id }: { id: string }) {
  const { data, addToCart } = useShop();
  const toast = useToast();
  const product = data.products.find((item) => item.id === id && item.active);
  const [image, setImage] = useState(product?.images[0] || "");
  if (!product) return <section className="page-section"><div className="container empty-panel"><h2>Produto não encontrado</h2><button className="btn primary" onClick={() => navigate("/produtos")}>Voltar aos produtos</button></div></section>;
  const category = data.categories.find((item) => item.id === product.categoryId)?.name || "Produto";
  const message = `Olá! Tenho interesse no ${product.name}. Gostaria de confirmar estoque, condições e envio.`;

  return <section className="page-section"><div className="container product-detail"><div className="product-gallery"><div className="main-product-image"><StoredImage src={image} alt={product.name}/><span>{product.condition}</span></div>{product.images.length > 1 && <div className="product-thumbs">{product.images.map((item) => <button key={item} className={item === image ? "active" : ""} onClick={() => setImage(item)}><StoredImage src={item} alt=""/></button>)}</div>}</div><div className="product-info"><span className="section-kicker">{category}</span><h1>{product.name}</h1><p className="lead">{product.shortDescription}</p><div className="detail-price">{product.compareAtPrice && <del>{currency(product.compareAtPrice)}</del>}<strong>{currency(product.price)}</strong><small>Valor e disponibilidade serão confirmados pelo vendedor.</small></div><div className="stock-line"><i className={product.stock > 0 ? "available" : ""}/>{product.stock > 0 ? `${product.stock} unidade(s) cadastrada(s)` : "Indisponível"}</div><div className="detail-actions"><button className="btn primary" disabled={product.stock < 1} onClick={() => { addToCart(product.id); toast("Produto adicionado ao carrinho."); }}>Adicionar ao carrinho <Icon name="bag"/></button><a className="btn secondary" href={whatsappUrl(data.settings.whatsapp, message)} target="_blank" rel="noreferrer"><Icon name="phone"/> Falar com vendedor</a></div><div className="detail-description"><h3>Sobre o produto</h3><p>{product.description}</p></div><div className="tag-list">{product.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="safe-purchase"><Icon name="shield" size={25}/><div><strong>Compra assistida</strong><span>O site não realiza cobrança. O vendedor confirma pagamento, entrega e condições.</span></div></div></div></div></section>;
}
