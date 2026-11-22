export const runtime = "edge";

import { artworks } from "@/data/artworks";
import { galleryReply, type ChatTurn } from "@/lib/galleryConcierge";
import { formatPrice } from "@/lib/money";
import { NextResponse } from "next/server";

const MAX_TURNS = 40;
const MAX_CHARS = 2000;

function catalog() {
  return artworks
    .map(
      (work) =>
        `${work.title} by ${work.artist}. ${work.blurb} ${work.medium}. ${work.dimensionsCm}. Asking price ${formatPrice(work.price)}. Section: ${work.category}.`,
    )
    .join("\n");
}

function readTurns(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  const turns: ChatTurn[] = [];
  for (const item of value.slice(-MAX_TURNS)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const text = content.trim().slice(0, MAX_CHARS);
    if (!text) continue;
    turns.push({ role, content: text });
  }
  return turns;
}

async function remoteReply(messages: { role: string; content: string }[]): Promise<string | null> {
  const xai = process.env.XAI_API_KEY;
  const openai = process.env.OPENAI_API_KEY;
  const endpoint = xai
    ? "https://api.x.ai/v1/chat/completions"
    : openai
      ? "https://api.openai.com/v1/chat/completions"
      : null;
  const key = xai || openai;
  if (!endpoint || !key) return null;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: xai ? "grok-3" : "gpt-4o-mini",
        temperature: 0.3,
        messages,
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The message could not be read." }, { status: 400 });
  }
  const record = body && typeof body === "object" ? (body as { messages?: unknown; memory?: unknown }) : {};
  const messages = readTurns(record.messages);
  if (!messages.some((turn) => turn.role === "user")) {
    return NextResponse.json({ error: "Write a message first." }, { status: 400 });
  }
  const memory = typeof record.memory === "string" ? record.memory.trim().slice(0, 8000) : "";
  const system = [
    "You are the concierge of Victoria Boiker's private gallery.",
    "Reply in the language of the visitor's latest message.",
    "Read the whole conversation, including the earlier notes. Do not drop a work, a name, or a question that was already stated.",
    "Do not invent a year or a size in centimetres. None are published.",
    "The asking prices below are what the cart charges.",
    "To buy, the visitor uses Add to cart on that work, then Cart in the header.",
    "Stay with this gallery.",
    catalog(),
    memory ? `Earlier in this same conversation:\n${memory}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const reply =
    (await remoteReply([{ role: "system", content: system }, ...messages])) ?? galleryReply(messages, memory);
  return NextResponse.json({ reply });
}
