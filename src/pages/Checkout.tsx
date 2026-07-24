import { useMemo, useState } from "react";
import { useShop } from "../store/ShopStore";
import { Icon } from "../components/Icon";
import { currency, formatCep, whatsappUrl } from "../lib/utils";
import { navigate } from "../lib/router";
import type { Address, ShippingOption } from "../types";

const emptyAddress: Omit<Address, "id"> = { label: "Principal", cep: "", street: "", number: "", complement: "", district: "", city: "", state: "SP" };

export function Checkout() {
  const { currentUser, cart, cartSubtotal, data, saveAddress, calculateShipping, createOrder } = useShop();
  const [address, setAddress] = useState<Omit<Address, "id"> & { id?: string }>(() => currentUser?.addresses[0] || emptyAddress);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [note, setNote] = useState("");
  const [finished, setFinished] = useState<{ code: string; url: string } | null>(null);
  const options = useMemo(() => calculateShipping(address.cep), [address.cep, cart, calculateShipping]);

  if (!currentUser) { sessionStorage.setItem("tecnoshop-next", "/checkout"); window.setTimeout(() => navigate("/entrar"), 0); return null; }
  if (!cart.length && !finished) { window.setTimeout(() => navigate("/carrinho"), 0); return null; }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedShipping) return;
    const saved = saveAddress(address);
    const order = createOrder({ address: saved, shipping: selectedShipping, note });
    const list = order.items.map((item, index) => `${index + 1}. ${item.quantity}x ${item.name} — ${currency(item.unitPrice * item.quantity)}`).join("\n");
    const message = `Olá! Enviei um pedido pelo site da TecnoShop.\n\nPedido: #${order.code}\n\n${list}\n\nEntrega: ${order.shipping.label} — ${order.shipping.price ? currency(order.shipping.price) : "Grátis"}\nTotal estimado: ${currency(order.total)}\n\nGostaria de confirmar estoque, pagamento e envio.`;
    setFinished({ code: order.code, url: whatsappUrl(data.settings.whatsapp, message) });
  }

  if (finished) return <section className="page-section"><div className="container success-panel"><span><Icon name="check" size={34}/></span><small>PEDIDO ENVIADO</small><h1>Recebemos o pedido <em>#{finished.code}</em></h1><p>Agora envie a mensagem ao vendedor para confirmar disponibilidade, pagamento e entrega.</p><a className="btn primary" href={finished.url} target="_blank" rel="noreferrer"><Icon name="phone"/> Falar com vendedor</a><button className="btn secondary" onClick={() => navigate("/minha-conta")}>Acompanhar pedido</button></div></section>;

  return <section className="page-section"><div className="container"><div className="page-hero compact"><span>FINALIZAR PEDIDO</span><h1>Dados para <em>confirmação.</em></h1><p>Você não será cobrado pelo site.</p></div><form className="checkout-layout" onSubmit={submit}><div className="checkout-form"><section className="form-card"><div className="form-card-title"><b>01</b><div><h3>Endereço</h3><p>Usado para estimar a entrega.</p></div></div><div className="form-grid"><label>CEP<input required value={address.cep} onChange={(event) => { setAddress({ ...address, cep: formatCep(event.target.value) }); setSelectedShipping(null); }} placeholder="00000-000"/></label><label className="span-2">Rua<input required value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })}/></label><label>Número<input required value={address.number} onChange={(event) => setAddress({ ...address, number: event.target.value })}/></label><label>Complemento<input value={address.complement} onChange={(event) => setAddress({ ...address, complement: event.target.value })}/></label><label>Bairro<input required value={address.district} onChange={(event) => setAddress({ ...address, district: event.target.value })}/></label><label>Cidade<input required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })}/></label><label>Estado<input required maxLength={2} value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value.toUpperCase() })}/></label></div></section><section className="form-card"><div className="form-card-title"><b>02</b><div><h3>Entrega</h3><p>Valores estimados para confirmação.</p></div></div>{options.length ? <div className="checkout-shipping">{options.map((option) => <label key={option.id} className={selectedShipping?.id === option.id ? "active" : ""}><input required type="radio" name="shipping" onChange={() => setSelectedShipping(option)}/><div><strong>{option.label}</strong><span>{option.description}</span><small>{option.deadline}</small></div><b>{option.price ? currency(option.price) : "Grátis"}</b></label>)}</div> : <div className="notice">Informe um CEP completo para calcular.</div>}</section><section className="form-card"><div className="form-card-title"><b>03</b><div><h3>Observações</h3><p>Cor, capacidade ou outra preferência.</p></div></div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ex.: prefiro a cor preta e quero saber se aceita meu iPhone na troca." rows={5}/></section></div><aside className="order-summary checkout-summary"><h3>Resumo final</h3><div className="summary-row"><span>Produtos</span><strong>{currency(cartSubtotal)}</strong></div><div className="summary-row"><span>Entrega</span><strong>{selectedShipping ? selectedShipping.price ? currency(selectedShipping.price) : "Grátis" : "—"}</strong></div><div className="summary-total"><span>Total estimado</span><strong>{currency(cartSubtotal + (selectedShipping?.price || 0))}</strong></div><div className="safe-purchase"><Icon name="lock"/><div><strong>Sem pagamento online</strong><span>O vendedor entrará em contato antes de qualquer cobrança.</span></div></div><button className="btn primary full" disabled={!selectedShipping}>Enviar pedido <Icon name="arrow"/></button></aside></form></div></section>;
}
