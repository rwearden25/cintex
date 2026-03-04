"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatClient() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "What are we working on today? Give me machine details + symptoms." }
  ]);
  const [busy, setBusy] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...msgs, { role: "user", content: text } as Msg];
    setMsgs(next);
    setBusy(true);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.content) {
      setMsgs([...next, { role: "assistant", content: data?.error || "AI error" }]);
      setBusy(false);
      return;
    }

    setMsgs([...next, { role: "assistant", content: data.content }]);
    setBusy(false);
  }

  return (
    <div className="space-y-3">
      <div className="border border-white/10 rounded-2xl bg-black/20 p-3 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className={"inline-block max-w-[92%] rounded-2xl px-3 py-2 text-sm border " + (m.role === "user"
              ? "bg-cintex-500/20 border-cintex-500/30"
              : "bg-white/5 border-white/10")}>
              <div className="text-xs opacity-70 mb-1">{m.role}</div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe symptoms, readings, and what you've tried…"
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button
          onClick={send}
          disabled={busy}
          className="rounded-xl border border-cintex-500/40 bg-cintex-500/20 hover:bg-cintex-500/30 px-4 py-2 font-semibold"
        >
          {busy ? "…" : "Send"}
        </button>
      </div>

      <div className="text-xs text-slate-400">
        Uses server route <span className="font-mono">/api/ai/chat</span>. Set <span className="font-mono">OPENAI_API_KEY</span>.
      </div>
    </div>
  );
}
