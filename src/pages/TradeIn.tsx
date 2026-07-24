import { useState } from "react";
import { useShop } from "../store/ShopStore";
import { Icon } from "../components/Icon";
import { saveImage } from "../lib/imageStore";
import { navigate } from "../lib/router";
import { useToast } from "../components/Toast";
import { StoredImage } from "../components/StoredImage";

export function TradeIn() {
  const { currentUser, createEvaluation } = useShop();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({ phone: currentUser?.phone || "", model: "", storage: "128 GB", color: "", batteryHealth: "", screenState: "Sem trincos", bodyState: "Bom estado", camerasOk: true, biometricsOk: true, hasBox: false, hasInvoice: false, notes: "" });

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, 6 - images.length));
    if (!files.length) return;
    setBusy(true);
    try { const refs = await Promise.all(files.map(saveImage)); setImages((current) => [...current, ...refs]); toast("Fotos adicionadas."); } catch (error) { toast(error instanceof Error ? error.message : "Falha ao adicionar imagens."); } finally { setBusy(false); event.target.value = ""; }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentUser) { sessionStorage.setItem("tecnoshop-next", "/avaliar-iphone"); navigate("/entrar"); return; }
    createEvaluation({ ...form, images });
    setDone(true);
  }

  if (done) return <section className="page-section"><div className="container success-panel"><span><Icon name="check" size={34}/></span><small>AVALIAÇÃO ENVIADA</small><h1>Seu iPhone entrou na <em>fila de análise.</em></h1><p>O vendedor poderá responder com uma estimativa pelo painel.</p><button className="btn primary" onClick={() => navigate("/minha-conta")}>Acompanhar avaliação</button></div></section>;

  return <section className="trade-page"><div className="trade-page-hero"><div className="container"><span>TRADE-IN TECNOSHOP</span><h1>Seu iPhone usado pode valer um <em>novo upgrade.</em></h1><p>Preencha as informações e envie fotos claras. A avaliação final depende da análise presencial do aparelho.</p></div></div><div className="container trade-form-layout"><form className="trade-form" onSubmit={submit}><section className="form-card"><div className="form-card-title"><b>01</b><div><h3>Informações do aparelho</h3><p>Conte exatamente qual iPhone você possui.</p></div></div><div className="form-grid"><label>Modelo<input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} placeholder="Ex.: iPhone 13 Pro"/></label><label>Capacidade<select value={form.storage} onChange={(event) => setForm({ ...form, storage: event.target.value })}><option>64 GB</option><option>128 GB</option><option>256 GB</option><option>512 GB</option><option>1 TB</option></select></label><label>Cor<input required value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })}/></label><label>Saúde da bateria (%)<input required type="number" min="1" max="100" value={form.batteryHealth} onChange={(event) => setForm({ ...form, batteryHealth: event.target.value })}/></label><label>Estado da tela<select value={form.screenState} onChange={(event) => setForm({ ...form, screenState: event.target.value })}><option>Sem trincos</option><option>Riscos leves</option><option>Riscos fortes</option><option>Trincada</option><option>Tela com falhas</option></select></label><label>Estado da carcaça<select value={form.bodyState} onChange={(event) => setForm({ ...form, bodyState: event.target.value })}><option>Excelente</option><option>Bom estado</option><option>Marcas de uso</option><option>Amassados</option><option>Danos fortes</option></select></label></div><div className="check-grid"><label><input type="checkbox" checked={form.camerasOk} onChange={(event) => setForm({ ...form, camerasOk: event.target.checked })}/> Câmeras funcionando</label><label><input type="checkbox" checked={form.biometricsOk} onChange={(event) => setForm({ ...form, biometricsOk: event.target.checked })}/> Face ID/Touch ID funcionando</label><label><input type="checkbox" checked={form.hasBox} onChange={(event) => setForm({ ...form, hasBox: event.target.checked })}/> Possui caixa</label><label><input type="checkbox" checked={form.hasInvoice} onChange={(event) => setForm({ ...form, hasInvoice: event.target.checked })}/> Possui nota fiscal</label></div></section><section className="form-card"><div className="form-card-title"><b>02</b><div><h3>Fotos do aparelho</h3><p>Frente, traseira, laterais e tela ligada.</p></div></div><label className="image-uploader"><input type="file" accept="image/*" multiple onChange={upload} disabled={busy || images.length >= 6}/><Icon name="camera" size={30}/><strong>{busy ? "Processando imagens..." : "Adicionar fotos"}</strong><span>Até 6 imagens • JPG, PNG ou WEBP</span></label>{images.length > 0 && <div className="uploaded-grid">{images.map((image) => <div key={image}><StoredImage src={image} alt="Foto do aparelho"/><button type="button" onClick={() => setImages((current) => current.filter((item) => item !== image))}><Icon name="trash" size={16}/></button></div>)}</div>}</section><section className="form-card"><div className="form-card-title"><b>03</b><div><h3>Contato e observações</h3><p>Detalhes que ajudam na análise.</p></div></div><label>WhatsApp<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })}/></label><label>Observações<textarea rows={5} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Informe reparos, peças trocadas ou qualquer detalhe importante."/></label></section><button className="btn primary full" disabled={busy}>Enviar para avaliação <Icon name="arrow"/></button></form><aside className="trade-guide"><img src="/assets/trade-upgrade-premium.webp" alt="iPhone para avaliação"/><div><span>COMO FUNCIONA</span><h3>A estimativa não obriga a venda.</h3><p>O valor enviado pelo painel é inicial. A confirmação depende da inspeção presencial.</p><ul><li><Icon name="check" size={16}/> Fotos claras e sem filtros</li><li><Icon name="check" size={16}/> Informe defeitos e reparos</li><li><Icon name="check" size={16}/> Remova contas antes da entrega</li></ul></div></aside></div></section>;
}
