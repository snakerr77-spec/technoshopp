import { Layout } from "./components/Layout";
import { useRoute } from "./lib/router";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Auth } from "./pages/Auth";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Account } from "./pages/Account";
import { TradeIn } from "./pages/TradeIn";
import { Contact } from "./pages/Contact";
import { Admin } from "./pages/Admin";

export default function App() {
  const route = useRoute();
  if (route === "/entrar") return <Auth/>;
  if (route.startsWith("/admin")) return <Admin/>;

  let page: React.ReactNode = <Home/>;
  if (route === "/produtos") page = <Products/>;
  else if (route.startsWith("/produto/")) page = <ProductDetail id={route.split("/")[2] || ""}/>;
  else if (route === "/carrinho") page = <Cart/>;
  else if (route === "/checkout") page = <Checkout/>;
  else if (route === "/minha-conta") page = <Account/>;
  else if (route === "/avaliar-iphone") page = <TradeIn/>;
  else if (route === "/contato") page = <Contact/>;
  return <Layout route={route}>{page}</Layout>;
}
