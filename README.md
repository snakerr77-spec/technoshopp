# TecnoShop — HTML, CSS e JavaScript

Mostruário oficial da TecnoShop em código puro, sem React, TypeScript, Vite ou login de cliente.

## O que está incluído

- Vitrine pública responsiva em `public/`
- Catálogo com busca, filtros e detalhes do produto
- Botões de atendimento e interesse pelo WhatsApp
- Painel em `/admin/` somente para produtos e categorias
- Pages Functions em JavaScript para leitura, cadastro, edição e exclusão
- Cloudflare KV para catálogo e imagens, sem R2
- Compactação de imagens no navegador antes do envio
- Arquivo `_routes.json` para que somente `/api/*` invoque Functions

## Estrutura

```text
public/
  index.html
  styles.css
  app.js
  admin/
    index.html
    admin.css
    admin.js
  assets/
  _headers
  _redirects
  _routes.json
functions/
  _shared/catalog.js
  api/catalog.js
  api/health.js
  api/admin/catalog.js
  api/admin/images.js
  api/images/[id].js
```

## Publicação

Siga o arquivo `PASSO-A-PASSO-CLOUDFLARE.md`. Os valores principais são:

- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `public`
- KV binding: `CATALOG_KV`
- Vitrine: `https://seu-dominio/`
- Painel: `https://seu-dominio/admin/`

## Desenvolvimento local opcional

É possível testar as páginas estáticas com qualquer servidor local. Para testar também as Functions e um KV local:

```bash
npx wrangler pages dev public --kv=CATALOG_KV
```

Depois acesse `http://localhost:8788/` e `http://localhost:8788/admin/`.

## Observações

- Sem o binding `CATALOG_KV`, a vitrine mostra o catálogo inicial, mas o painel não salva.
- O painel não possui uma tela de login própria. Proteja `/admin`, `/admin/*` e `/api/admin/*` com Cloudflare Access.
- O KV é indicado para uma vitrine de leitura frequente e poucas edições. Uma alteração pode levar alguns instantes para aparecer em todos os pontos da rede.
- O limite implementado é de 8 imagens por produto e 2 MB por imagem já otimizada.
