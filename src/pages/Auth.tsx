import { useState } from "react";
import { useShop } from "../store/ShopStore";
import { Icon } from "../components/Icon";
import { navigate } from "../lib/router";
import { useToast } from "../components/Toast";

export function Auth() {
  const { login, register, currentUser } = useShop();
  const toast = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  if (currentUser) {
    window.setTimeout(() => navigate(currentUser.role === "admin" ? "/admin" : "/minha-conta"), 0);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setError("");
    const result = mode === "login" ? await login(form.email, form.password) : await register(form);
    setBusy(false);
    if (!result.ok) return setError(result.message);
    toast(result.message);
    const next = sessionStorage.getItem("tecnoshop-next");
    sessionStorage.removeItem("tecnoshop-next");
    navigate(next || (form.email.toLowerCase() === "admin@tecnoshop.com" ? "/admin" : "/minha-conta"));
  }

  return <section className="auth-page"><div className="auth-visual"><div><img src="/assets/tecnoshop-logo.png" alt="TecnoShop"/><span>CONTA TECNOSHOP</span><h1>Escolha com calma.<br/><em>Finalize com segurança.</em></h1><p>Você pode navegar sem cadastro. A conta é necessária apenas para enviar pedidos, acompanhar solicitações e avaliar seu iPhone.</p><div className="auth-features"><article><Icon name="shield"/><span><strong>Sem cobrança automática</strong><small>Pagamento combinado com o vendedor.</small></span></article><article><Icon name="truck"/><span><strong>Entrega assistida</strong><small>Frete estimado e confirmação antes do envio.</small></span></article></div></div></div><div className="auth-panel"><button className="auth-back" onClick={() => navigate("/")}>← Voltar para a loja</button><div className="auth-card"><span className="section-kicker">{mode === "login" ? "BEM-VINDO DE VOLTA" : "CRIE SUA CONTA"}</span><h2>{mode === "login" ? "Entre para continuar" : "Comece seu atendimento"}</h2><p>{mode === "login" ? "Acesse seus pedidos e avaliações." : "Leva menos de um minuto."}</p><div className="auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Entrar</button><button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Criar conta</button></div><form onSubmit={submit} className="form-stack">{mode === "register" && <><label>Nome completo<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Seu nome"/></label><label>WhatsApp<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="(15) 99999-9999"/></label></>}<label>E-mail<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="voce@email.com"/></label><label>Senha<input required type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Mínimo de 6 caracteres"/></label>{error && <div className="form-error">{error}</div>}<button className="btn primary full" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "Entrar na conta" : "Criar minha conta"}<Icon name="arrow"/></button></form><div className="demo-access"><strong>Acesso de demonstração do administrador</strong><code>admin@tecnoshop.com</code><code>Admin@2026</code></div></div></div></section>;
}
