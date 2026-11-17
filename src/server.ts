import "dotenv/config";
import express from "express";
import { Mistral } from "@mistralai/mistralai";

const MODEL = "mistral-small-latest";
const PORT = Number(process.env.PORT ?? 3000);

if (!process.env.MISTRAL_API_KEY) {
  console.error("MISTRAL_API_KEY não definida. Crie um arquivo .env com MISTRAL_API_KEY=...");
  process.exit(1);
}

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
const app = express();

app.use(express.static("public"));
app.use(express.json());

type ChatMessage = { role: "user" | "assistant"; content: string };

app.post("/api/chat", async (req, res) => {
  const messages: unknown = req.body?.messages;
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: "Campo 'messages' inválido." });
    return;
  }

  const history: ChatMessage[] = [];
  for (const m of messages) {
    const role = (m as ChatMessage)?.role;
    const content = (m as ChatMessage)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      res.status(400).json({ error: "Mensagem inválida no histórico." });
      return;
    }
    if (content.length > 10_000) {
      res.status(400).json({ error: "Mensagem muito longa." });
      return;
    }
    history.push({ role, content });
  }

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    res.status(400).json({ error: "A última mensagem deve ser do usuário." });
    return;
  }

  try {
    const result = await client.chat.complete({
      model: MODEL,
      messages: history,
    });
    const reply = result.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || reply.length === 0) {
      res.status(502).json({ error: "Resposta vazia da API da Mistral." });
      return;
    }
    res.json({ reply });
  } catch (err) {
    console.error("Erro ao chamar a API da Mistral:", err);
    res.status(502).json({ error: "Falha ao chamar a API da Mistral." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} (modelo: ${MODEL})`);
});
