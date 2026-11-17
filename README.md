# Chat Mistral (minimal)

App web mínimo de chat usando a API da Mistral com o SDK oficial em TypeScript ([@mistralai/mistralai](https://github.com/mistralai/client-js)), modelo `mistral-small-latest`. A `MISTRAL_API_KEY` fica apenas no servidor (Express); o navegador só fala com `/api/chat`.

## Estrutura

- `src/server.ts` — servidor Express em TypeScript: serve a UI e expõe `POST /api/chat`, que valida o histórico e chama `client.chat.complete` com `mistral-small-latest`.
- `public/index.html` — interface de chat simples (HTML/CSS/JS puro).

## Instalação

```bash
npm install
```

## Configuração

```bash
cp .env.example .env
```

Edite `.env` e coloque sua chave:

```
MISTRAL_API_KEY=...
```

## Executar localmente

```bash
npm run dev
```

Abra http://localhost:3000. Para rodar sem watch, use `npm start`. A porta pode ser alterada com a variável `PORT`.
