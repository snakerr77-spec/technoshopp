import { useMemo } from "react";
import { useShop } from "../store/ShopStore";
import { ProductCard } from "../components/ProductCard";
import { Icon } from "../components/Icon";
import { navigate } from "../lib/router";
import { whatsappUrl } from "../lib/utils";

export function Home() {
  const { activeProducts, data } = useShop();
  const featured = useMemo(() => activeProducts.filter((product) => product.featured).slice(0, 4), [activeProducts]);

  return <>
    <section className="hero-section">
      <div className="hero-grid" aria-hidden="true"/>
      <div className="container hero-layout">
        <div className="hero-copy reveal">
          <div className="eyebrow"><span/> TECNOLOGIA • CERQUILHO</div>
          <h1>Tecnologia que acompanha o <em>seu ritmo.</em></h1>
          <p>Escolha produtos, calcule uma estimativa de entrega e envie o pedido. O vendedor confirma estoque, pagamento e envio diretamente com você.</p>
          <div className="hero-actions"><button className="btn primary" onClick={() => navigate("/produtos")}>Explorar produtos <Icon name="arrow"/></button><a className="btn secondary" href={whatsappUrl(data.settings.whatsapp, "Olá! Quero conhecer as ofertas disponíveis hoje.")} target="_blank" rel="noreferrer">Ofertas no WhatsApp</a></div>
          <div className="hero-metrics"><div><strong>18x</strong><span>condições confirmadas pelo vendedor</span></div><div><strong>Trade-in</strong><span>avalie seu iPhone usado</span></div><div><strong>Sem pagamento</strong><span>negociação assistida e segura</span></div></div>
        </div>
        <div className="hero-stage reveal delay">
          <div className="stage-frame clean">
            <img className="hero-scene hero-scene-dark" src="/assets/hero-products-dark.webp" alt="Produtos TecnoShop no tema escuro"/>
            <img className="hero-scene hero-scene-light" src="/assets/hero-products-light.webp" alt="Produtos TecnoShop no tema claro"/>
            <div className="stage-vignette"/>
            <div className="floating-card product-highlight"><span>SEMINOVO PREMIUM</span><strong>iPhone 15 Pro Max</strong><small>a partir de R$ 4.200*</small></div>
            <div className="floating-card finance-highlight"><Icon name="card" size={18}/><span><strong>Até 18x</strong><small>consulte condições</small></span></div>
            <div className="floating-card availability-highlight"><i/><small>Atendimento conectado</small></div>
          </div>
          <div className="stage-caption"><span>01</span><p>Uma loja completa, com atendimento humano antes do pagamento.</p></div>
        </div>
      </div>
    </section>

    <section className="marquee"><div><span>IPHONES</span><i/><span>ANDROID</span><i/><span>NOTEBOOKS</span><i/><span>SMARTWATCH</span><i/><span>ACESSÓRIOS</span><i/><span>MOBILIDADE</span><i/><span>IPHONES</span><i/><span>ANDROID</span><i/><span>NOTEBOOKS</span></div></section>

    <section className="section products-preview">
      <div className="container">
        <div className="section-heading"><div><span>SELEÇÃO EM DESTAQUE</span><h2>Escolha pelo estilo.<br/><em>Confirme com o vendedor.</em></h2><p>Produtos cadastrados no painel aparecem na loja. O pedido não cobra nada automaticamente.</p></div><button className="text-link" onClick={() => navigate("/produtos")}>Ver catálogo completo <Icon name="arrow" size={18}/></button></div>
        <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product}/>)}</div>
      </div>
    </section>

    <section className="section trade-home">
      <div className="container split-layout">
        <div className="trade-image"><img src="/assets/trade-upgrade-premium.webp" alt="Avaliação de iPhone usado"/><span>TRADE-IN</span></div>
        <div className="trade-copy"><span className="section-kicker">AVALIE SEU IPHONE</span><h2>Seu usado pode virar parte do próximo upgrade.</h2><p>Envie as informações e fotos do aparelho. O vendedor analisa e responde com uma estimativa, sem compromisso.</p><div className="steps"><article><b>01</b><div><strong>Preencha os dados</strong><span>Modelo, bateria e conservação.</span></div></article><article><b>02</b><div><strong>Envie fotos</strong><span>As imagens ficam salvas localmente nesta demonstração.</span></div></article><article><b>03</b><div><strong>Receba a avaliação</strong><span>O administrador responde pelo painel.</span></div></article></div><button className="btn primary" onClick={() => navigate("/avaliar-iphone")}>Avaliar meu aparelho <Icon name="arrow"/></button></div>
      </div>
    </section>

    <section className="section how-it-works"><div className="container"><div className="center-heading"><span>COMPRA ASSISTIDA</span><h2>Você escolhe. <em>O vendedor confirma.</em></h2><p>Um fluxo direto, sem cobrança automática e sem surpresas.</p></div><div className="experience-grid"><article><b>01</b><Icon name="search" size={28}/><h3>Explore</h3><p>Navegue sem login e compare produtos com calma.</p></article><article><b>02</b><Icon name="bag" size={28}/><h3>Monte o pedido</h3><p>Adicione ao carrinho e calcule uma estimativa de entrega.</p></article><article><b>03</b><Icon name="message" size={28}/><h3>Converse</h3><p>O vendedor confirma estoque, frete e forma de pagamento.</p></article></div></div></section>
  </>;
}
