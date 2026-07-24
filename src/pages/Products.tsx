import { useMemo, useState } from "react";
import { useShop } from "../store/ShopStore";
import { ProductCard } from "../components/ProductCard";
import { Icon } from "../components/Icon";

export function Products() {
  const { activeProducts, data } = useShop();
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const visibleCategories = data.categories.filter((category) => category.active).sort((a, b) => a.order - b.order);
  const filtered = useMemo(() => activeProducts.filter((product) => {
    const categoryMatch = categoryId === "all" || product.categoryId === categoryId;
    const text = `${product.name} ${product.shortDescription} ${product.tags.join(" ")}`.toLowerCase();
    return categoryMatch && text.includes(query.toLowerCase().trim());
  }), [activeProducts, categoryId, query]);

  return <section className="page-section catalog-page"><div className="container"><div className="page-hero"><span>CATÁLOGO ONLINE</span><h1>Encontre seu próximo <em>upgrade.</em></h1><p>Navegue sem login. Para enviar o pedido, basta entrar ou criar uma conta.</p></div><div className="catalog-toolbar"><div className="category-chips"><button className={categoryId === "all" ? "active" : ""} onClick={() => setCategoryId("all")}>Todos <small>{activeProducts.length}</small></button>{visibleCategories.map((category) => <button key={category.id} className={categoryId === category.id ? "active" : ""} onClick={() => setCategoryId(category.id)}>{category.name}<small>{activeProducts.filter((product) => product.categoryId === category.id).length}</small></button>)}</div><label className="search-field"><Icon name="search" size={19}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto..."/>{query && <button onClick={() => setQuery("")}><Icon name="close" size={15}/></button>}</label></div>{filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <div className="empty-panel"><Icon name="search" size={32}/><h3>Nenhum produto encontrado</h3><p>Tente outro termo ou selecione outra categoria.</p></div>}</div></section>;
}
