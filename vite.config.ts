import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // O Cloudflare Pages publica este projeto na raiz do domínio pages.dev.
  base: "/",
  server: { port: 5173, host: true },
  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
  },
});
