import { createContext, useContext, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

const ToastContext = createContext<(message: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  function show(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2800);
  }
  return <ToastContext.Provider value={show}>
    {children}
    <div className={`toast ${message ? "show" : ""}`}><Icon name="check" size={17}/><span>{message}</span></div>
  </ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}
