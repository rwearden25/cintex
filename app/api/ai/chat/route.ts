import { getSession } from "@/lib/auth";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const messages = (body?.messages || []) as Msg[];

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!apiKey) return Response.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });

  const system = [
    "You are Cintex, an internal diagnostics assistant.",
    "Be concise, practical, and step-by-step.",
    "Ask 1-3 targeted questions if needed, otherwise give the next actions and likely causes.",
    "When listing steps, use numbered steps.",
  ].join(" ");

  const payload = {
    model,
    messages: [
      { role: "system", content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.2,
  };

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await r.json().catch(() => null);
  if (!r.ok) {
    return Response.json(
      { error: json?.error?.message || "OpenAI request failed" },
      { status: 500 }
    );
  }

  const content = json?.choices?.[0]?.message?.content;
  return Response.json({ content: content || "" });
}
