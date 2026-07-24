import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ShopProvider } from "./store/ShopStore";
import { ToastProvider } from "./components/Toast";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ShopProvider>
      <ToastProvider>
        <App/>
      </ToastProvider>
    </ShopProvider>
  </React.StrictMode>
);
