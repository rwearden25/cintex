"use client";

import { useState } from "react";

export function Topbar({ email, role }: { email: string; role: string }) {
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/login";
  }

  return (
    <header className="card p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-sm font-bold text-slate-900">Signed in</div>
        <div className="text-xs text-slate-600">
          {email} • <span className="font-semibold">{role}</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => alert("Photo upload wired in v2")} className="btn-outline">
          Photo Send
        </button>

        <a href="/app/chat" className="btn-primary">
          Open Chat
        </a>

        <button onClick={logout} disabled={busy} className="btn-outline">
          {busy ? "Logging out…" : "Logout"}
        </button>
      </div>
    </header>
  );
}
