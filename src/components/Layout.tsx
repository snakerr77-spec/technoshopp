import { useEffect, useState, type ReactNode } from "react";
import { useShop } from "../store/ShopStore";
import { navigate } from "../lib/router";
import { Icon } from "./Icon";
import { whatsappUrl } from "../lib/utils";

export function Layout({ children, route }: { children: ReactNode; route: string }) {
  const { currentUser, cartCount, data, logout } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => document.documentElement.dataset.theme === "light" ? "light" : "dark");

  useEffect(() => setMenuOpen(false), [route]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("tecnoshop-color-theme", next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f4f0e8" : "#070707");
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const nav = [
    ["/", "Início"], ["/produtos", "Produtos"], ["/avaliar-iphone", "Avalie seu iPhone"], ["/contato", "Falar com vendedor"]
  ];

  return <>
    <div className="announcement"><div className="container announcement-inner"><span><Icon name="card" size={15}/> Condições em até 18x</span><span className="announcement-center"><i/> Atendimento humano e pedido assistido</span><a href={whatsappUrl(data.settings.whatsapp, "Olá! Vim pelo site da TecnoShop.")} target="_blank" rel="noreferrer">WhatsApp oficial</a></div></div>
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand" onClick={() => navigate("/")} aria-label="Página inicial">
          <span className="brand-mark"><img src="/assets/tecnoshop-logo.png" alt=""/></span>
          <span className="brand-copy"><strong>TECNO<span>SHOP</span></strong><small>CERQUILHO</small></span>
        </button>
        <nav className="desktop-nav">
          {nav.map(([path, label]) => <button key={path} className={route === path || (path !== "/" && route.startsWith(path)) ? "active" : ""} onClick={() => navigate(path)}>{label}</button>)}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Alternar tema"><span>{theme === "dark" ? <Icon name="moon" size={14}/> : <Icon name="sun" size={14}/>}</span></button>
          <button className="header-icon" onClick={() => navigate("/carrinho")} aria-label="Carrinho"><Icon name="bag"/><b>{cartCount}</b></button>
          {currentUser ? <button className="account-button" onClick={() => navigate(currentUser.role === "admin" ? "/admin" : "/minha-conta")}><Icon name="user" size={17}/><span>{currentUser.role === "admin" ? "Painel" : "Minha conta"}</span></button> : <button className="account-button" onClick={() => navigate("/entrar")}><Icon name="user" size={17}/><span>Entrar</span></button>}
          <button className="menu-button" onClick={() => setMenuOpen(true)}><Icon name="menu"/></button>
        </div>
      </div>
    </header>
    <main>{children}</main>
    <footer className="site-footer"><div className="container footer-grid"><div><div className="footer-logo"><img src="/assets/tecnoshop-logo.png" alt="TecnoShop"/><strong>TECNO<span>SHOP</span></strong></div><p>Tecnologia, atendimento local e venda assistida para comprar com segurança.</p></div><div><h4>Navegue</h4><button onClick={() => navigate("/produtos")}>Produtos</button><button onClick={() => navigate("/avaliar-iphone")}>Avalie seu iPhone</button><button onClick={() => navigate("/contato")}>Falar com vendedor</button></div><div><h4>Sua conta</h4><button onClick={() => navigate(currentUser ? "/minha-conta" : "/entrar")}>{currentUser ? "Pedidos e perfil" : "Entrar ou criar conta"}</button>{currentUser?.role === "admin" && <button onClick={() => navigate("/admin")}>Painel administrativo</button>}{currentUser && <button onClick={handleLogout}>Sair</button>}</div><div><h4>Importante</h4><p>Não há pagamento online. O vendedor confirma estoque, frete e forma de pagamento antes do envio.</p></div></div><div className="container footer-bottom"><span>© 2026 TecnoShop Cerquilho</span><span>Protótipo funcional sem cobrança online</span></div></footer>

    <div className={`mobile-menu ${menuOpen ? "open" : ""}`}><button className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"/><aside><div><strong>Menu</strong><button onClick={() => setMenuOpen(false)}><Icon name="close"/></button></div>{nav.map(([path, label]) => <button key={path} onClick={() => navigate(path)}>{label}<Icon name="chevron" size={17}/></button>)}<button onClick={() => navigate("/carrinho")}>Carrinho ({cartCount})<Icon name="chevron" size={17}/></button><button onClick={() => navigate(currentUser ? (currentUser.role === "admin" ? "/admin" : "/minha-conta") : "/entrar")}>{currentUser ? "Minha área" : "Entrar ou cadastrar"}<Icon name="chevron" size={17}/></button>{currentUser && <button onClick={handleLogout}>Sair<Icon name="logout" size={17}/></button>}</aside></div>
  </>;
}
