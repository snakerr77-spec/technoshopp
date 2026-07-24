import { useMemo, useState } from "react";
import { useShop } from "../store/ShopStore";
import { StoredImage } from "../components/StoredImage";
import { Icon } from "../components/Icon";
import { currency, formatCep } from "../lib/utils";
import { navigate } from "../lib/router";

export function Cart() {
  const { cart, data, cartSubtotal, setCartQuantity, removeFromCart, calculateShipping, currentUser } = useShop();
  const [cep, setCep] = useState("");
  const [shippingId, setShippingId] = useState("");
  const options = useMemo(() => calculateShipping(cep), [cep, cart, calculateShipping]);
  const selected = options.find((option) => option.id === shippingId);
  const items = cart.map((item) => ({ ...item, product: data.products.find((product) => product.id === item.productId) })).filter((item) => item.product);

  function checkout() {
    if (!currentUser) {
      sessionStorage.setItem("tecnoshop-next", "/checkout");
      navigate("/entrar");
      return;
    }
    navigate("/checkout");
  }

  if (!items.length) return <section className="page-section"><div className="container empty-panel"><Icon name="bag" size={38}/><h2>Seu carrinho está vazio</h2><p>Explore o catálogo e adicione os produtos que deseja consultar.</p><button className="btn primary" onClick={() => navigate("/produtos")}>Ver produtos <Icon name="arrow"/></button></div></section>;

  return <section className="page-section"><div className="container"><div className="page-hero compact"><span>SEU PEDIDO</span><h1>Carrinho de <em>interesse.</em></h1><p>Nenhuma cobrança será feita nesta etapa.</p></div><div className="cart-layout"><div className="cart-list">{items.map(({ product, quantity }) => product && <article key={product.id}><StoredImage src={product.images[0]} alt={product.name}/><div><small>{product.condition}</small><button onClick={() => navigate(`/produto/${product.id}`)}>{product.name}</button><span>{currency(product.price)} cada</span></div><div className="quantity"><button onClick={() => setCartQuantity(product.id, quantity - 1)}><Icon name="minus" size={15}/></button><b>{quantity}</b><button onClick={() => setCartQuantity(product.id, quantity + 1)}><Icon name="plus" size={15}/></button></div><strong>{currency(product.price * quantity)}</strong><button className="remove" onClick={() => removeFromCart(product.id)}><Icon name="trash" size={18}/></button></article>)}</div><aside className="order-summary"><h3>Resumo</h3><div className="summary-row"><span>Produtos</span><strong>{currency(cartSubtotal)}</strong></div><div className="shipping-box"><label>Calcular entrega<input value={cep} onChange={(event) => { setCep(formatCep(event.target.value)); setShippingId(""); }} placeholder="00000-000"/></label>{cep.replace(/\D/g, "").length === 8 && <div className="shipping-options">{options.map((option) => <label key={option.id} className={shippingId === option.id ? "active" : ""}><input type="radio" name="shipping" checked={shippingId === option.id} onChange={() => setShippingId(option.id)}/><span><strong>{option.label}</strong><small>{option.deadline}</small></span><b>{option.price ? currency(option.price) : "Grátis"}</b></label>)}</div>}</div><div className="summary-total"><span>Total estimado</span><strong>{currency(cartSubtotal + (selected?.price || 0))}</strong></div><p className="summary-note">Frete, estoque e pagamento serão confirmados pelo vendedor.</p><button className="btn primary full" onClick={checkout}>Continuar pedido <Icon name="arrow"/></button><button className="btn ghost full" onClick={() => navigate("/produtos")}>Continuar comprando</button></aside></div></div></section>;
}
