# Como publicar a TecnoShop no Cloudflare

Este projeto foi preparado para Cloudflare Pages + Pages Functions + Workers KV. Não usa R2 e não possui login de cliente.

## 1. Enviar o projeto para o GitHub

Crie um repositório novo ou substitua os arquivos do repositório `technoshopp`.

O mais importante é que estas pastas fiquem na raiz do repositório:

```text
functions/
public/
```

Não envie a pasta pai `tecnoshop-html-cloudflare` como uma pasta interna. O arquivo `public/index.html` precisa existir exatamente nesse caminho.

## 2. Criar o projeto no Cloudflare Pages

1. Entre no painel do Cloudflare.
2. Vá em **Workers & Pages**.
3. Selecione **Create application**.
4. Abra a aba **Pages**.
5. Escolha **Import an existing Git repository**.
6. Conecte o GitHub e selecione o repositório.
7. Preencha:

| Campo | Valor |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `public` |
| Root directory | deixe vazio |

8. Clique em **Save and Deploy**.

O comando `exit 0` é recomendado pela própria documentação do Pages para sites estáticos que usam Pages Functions.

## 3. Criar o KV

1. No Cloudflare, abra **Workers & Pages** e entre na área de **KV**. Dependendo da versão do painel, ela pode aparecer em **Storage & Databases > KV**.
2. Clique em **Create namespace**.
3. Use o nome:

```text
technoshopp-catalog
```

4. Confirme a criação.

Esse único KV guarda o catálogo e as imagens compactadas. Não crie bucket R2.

## 4. Conectar o KV ao projeto

1. Volte para **Workers & Pages**.
2. Abra o projeto da TecnoShop.
3. Vá em **Settings > Bindings**.
4. Clique em **Add > KV namespace**.
5. Em **Variable name**, digite exatamente:

```text
CATALOG_KV
```

6. Em **KV namespace**, selecione `technoshopp-catalog`.
7. Salve.
8. Faça um novo deploy em **Deployments > Retry deployment**.

O nome precisa ser exatamente `CATALOG_KV`, inclusive com letras maiúsculas.

Depois do deploy, abra:

```text
https://SEU-PROJETO.pages.dev/api/health
```

O resultado correto contém:

```json
{
  "ok": true,
  "kvConfigured": true
}
```

Se aparecer `false`, o binding não foi conectado ou o projeto ainda não foi republicado.

## 5. Adicionar o domínio oficial

1. Abra o projeto em **Workers & Pages**.
2. Vá em **Custom domains**.
3. Clique em **Set up a custom domain**.
4. Informe o endereço oficial, por exemplo:

```text
loja.seudominio.com.br
```

5. Conclua a configuração de DNS indicada pelo Cloudflare.

Use o domínio oficial nas etapas do Access abaixo. Para um domínio ser selecionado no Cloudflare Access, ele deve estar em uma zona ativa da sua conta Cloudflare.

## 6. Proteger somente o painel

A vitrine continuará pública. O Cloudflare Access ficará na frente do painel e da API administrativa. Não existe uma página de login dentro do site.

1. No Cloudflare, abra **Zero Trust**.
2. Vá em **Access controls > Applications**.
3. Clique em **Create new application**.
4. Escolha **Self-hosted and private**.
5. Dê o nome `TecnoShop Admin`.
6. Em **Public hostnames**, use o domínio oficial e adicione estes caminhos:

```text
admin
admin/*
api/admin/*
```

Inclua `admin` e `admin/*`, pois o curinga não protege o caminho pai sozinho.

7. Em **Access policies**, crie uma política com:
   - Action: `Allow`
   - Include: `Emails`
   - Value: o seu e-mail
8. Escolha o método de autenticação. Para uma configuração simples, use **One-time PIN** por e-mail.
9. Salve a aplicação.

Teste em uma janela anônima:

- `https://seu-dominio/` deve abrir sem login.
- `https://seu-dominio/admin/` deve pedir a confirmação do seu e-mail pelo Cloudflare.
- `https://seu-dominio/api/admin/catalog` também deve estar protegido.

Não deixe apenas `/admin/` protegido. A rota `/api/admin/*` também precisa do Access, senão outra pessoa poderia chamar a API diretamente.

## 7. Cadastrar os produtos oficiais

1. Abra `https://seu-dominio/admin/`.
2. Confirme o acesso com o e-mail permitido.
3. Entre em **Categorias** para criar ou ajustar as categorias.
4. Entre em **Produtos**.
5. Clique em **Novo produto**.
6. Preencha os dados e envie as imagens.
7. Clique em **Salvar produto**.
8. Abra a vitrine e confira.

As imagens são convertidas para WebP e reduzidas para até 1600 px antes do envio. Cada arquivo otimizado deve ter no máximo 2 MB.

## 8. Onde trocar o WhatsApp e o endereço

Os dados iniciais ficam em dois arquivos:

```text
public/app.js
functions/_shared/catalog.js
```

Procure por:

```text
5515996007266
Rua Ângelo Luvizotto, 401 — Centro
Cerquilho — SP
```

Altere nos dois arquivos antes do primeiro cadastro. Após o primeiro salvamento no painel, o catálogo passa a vir do KV.

## 9. Atualizações futuras

Quando alterar HTML, CSS ou JavaScript:

1. Envie a mudança para a branch `main` no GitHub.
2. O Cloudflare Pages fará um novo deploy automaticamente.
3. Os produtos e imagens continuarão no KV.

## Diagnóstico rápido

### A vitrine abre, mas o painel não salva

- Confirme o binding `CATALOG_KV`.
- Confira se o nome está em maiúsculas.
- Faça um novo deploy depois de criar o binding.
- Teste `/api/health`.

### O site mostra o catálogo inicial mesmo sem KV

Isso é esperado. O catálogo inicial funciona como fallback, mas alterações do painel só são publicadas quando o KV está ligado.

### A imagem não envia

- Use JPG, PNG ou WebP.
- Tente uma imagem menor.
- Confirme que `/api/admin/*` foi incluído na aplicação do Access.
- Confira os logs em **Workers & Pages > projeto > Functions > Logs**.

### A alteração demorou a aparecer

Workers KV é distribuído globalmente e prioriza muitas leituras. Aguarde alguns instantes e atualize a página.

## Documentação oficial usada

- Cloudflare Pages para HTML estático: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- Bindings de KV em Pages Functions: https://developers.cloudflare.com/pages/functions/bindings/
- Rotas das Pages Functions: https://developers.cloudflare.com/pages/functions/routing/
- Cloudflare Access: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/
- Caminhos e curingas do Access: https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/
