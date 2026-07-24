# TecnoShop — vendas assistidas

Protótipo funcional em React + TypeScript + Vite, mantendo a identidade visual preta, branca e laranja da loja atual.

## O que funciona

- Loja pública sem exigir login;
- tema claro e escuro com imagens diferentes no banner;
- catálogo, categorias, busca e detalhes dos produtos;
- carrinho de interesse;
- cadastro e login;
- finalização do pedido somente após login;
- estimativa local de entrega por CEP;
- pedido salvo e mensagem pronta para WhatsApp;
- área do cliente com pedidos, avaliações e mensagens;
- formulário para avaliação de iPhone com fotos;
- painel administrativo protegido por função `admin`;
- cadastro, edição e exclusão de produtos e categorias;
- upload e remoção de imagens sem Cloudflare R2;
- gerenciamento de pedidos, avaliações, mensagens e clientes.

## Testar no computador

Abra o terminal dentro desta pasta e execute:

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente:

```text
http://localhost:5173
```

## Login do administrador da demonstração

```text
E-mail: admin@tecnoshop.com
Senha: Admin@2026
```

## Como as imagens funcionam nesta versão

As imagens adicionadas pelo painel são comprimidas em WebP e salvas no IndexedDB do navegador. Isso permite testar criação e remoção sem R2 e sem servidor.

Importante: como esta é uma versão de demonstração local, produtos, contas, pedidos e imagens criados em um navegador não aparecem automaticamente em outro dispositivo. Para produção, o próximo passo é conectar o projeto a uma nova API Cloudflare + D1 e usar a API do GitHub para gravar imagens na pasta `public/uploads`, mantendo o projeto sem R2.

## Publicar no Cloudflare Pages sem R2

```bash
npm run build
```

A pasta gerada será `dist`.

Ao conectar este repositório ao Cloudflare Pages, use:

```text
Framework preset: React (Vite)
Build command: npm run build
Build output directory: dist
Root directory: /
```

O projeto já inclui:

- `public/_redirects` para o funcionamento das rotas;
- `public/_headers` com cabeçalhos básicos de segurança;
- `wrangler.jsonc` apontando para a pasta `dist`;
- configuração do Vite para publicação na raiz do domínio.

Também é possível publicar pelo terminal:

```bash
npm run build
npx wrangler pages deploy dist --project-name technoshopp
```

Não é necessário configurar R2, D1, Worker ou variáveis de ambiente.
Veja o arquivo `CLOUDFLARE-PAGES.txt` para o passo a passo completo.

## Restaurar os dados iniciais

Entre no painel administrativo e clique em **Restaurar demonstração**.
