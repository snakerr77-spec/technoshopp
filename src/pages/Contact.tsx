import { useState } from "react";
import { useShop } from "../store/ShopStore";
import { Icon } from "../components/Icon";
import { navigate } from "../lib/router";
import { whatsappUrl } from "../lib/utils";

export function Contact() {
  const { currentUser, createMessage, data } = useShop();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ subject: "Dúvida sobre produto", message: "" });
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentUser) { sessionStorage.setItem("tecnoshop-next", "/contato"); navigate("/entrar"); return; }
    createMessage(form); setSent(true);
  }
  return <section className="page-section contact-page"><div className="container contact-layout"><div className="contact-copy"><span>ATENDIMENTO HUMANO</span><h1>Fale com quem entende de <em>tecnologia.</em></h1><p>Use o WhatsApp para resposta rápida ou deixe uma mensagem vinculada à sua conta.</p><div className="contact-methods"><a href={whatsappUrl(data.settings.whatsapp, "Olá! Vim pelo site e gostaria de falar com um vendedor.")} target="_blank" rel="noreferrer"><Icon name="phone"/><div><small>WHATSAPP OFICIAL</small><strong>(15) 99600-7266</strong><span>Atendimento direto com a loja</span></div><Icon name="arrow"/></a><article><Icon name="pin"/><div><small>LOJA FÍSICA</small><strong>{data.settings.storeAddress}</strong><span>{data.settings.city}</span></div></article></div></div><div className="contact-card">{sent ? <div className="success-mini"><Icon name="check" size={32}/><h2>Mensagem enviada</h2><p>Você pode acompanhar a resposta na área da sua conta.</p><button className="btn primary" onClick={() => navigate("/minha-conta")}>Abrir minha conta</button></div> : <><span className="section-kicker">MENSAGEM PELO SITE</span><h2>Como podemos ajudar?</h2><form onSubmit={submit} className="form-stack"><label>Assunto<select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}><option>Dúvida sobre produto</option><option>Pedido e entrega</option><option>Troca de iPhone</option><option>Problema com atendimento</option><option>Outro assunto</option></select></label><label>Mensagem<textarea required rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Descreva o que você precisa..."/></label><button className="btn primary full">Enviar mensagem <Icon name="arrow"/></button>{!currentUser && <small className="login-hint">Você entrará ou criará uma conta antes do envio.</small>}</form></>}</div></div></section>;
}
