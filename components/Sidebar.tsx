import Link from "next/link";

const groups = [
  {
    title: "Dashboard",
    items: [
      { href: "/app/overview", label: "Overview" },
      { href: "/app/content", label: "Content" },
      { href: "/app/tips-queue", label: "Tips Queue" },
      { href: "/app/kb-gaps", label: "KB Gaps" },
      { href: "/app/chat-logs", label: "Chat Logs" },
    ],
  },
  {
    title: "Knowledge Base",
    items: [
      { href: "/app/kb-contents", label: "KB Contents" },
      { href: "/app/web-scraper", label: "Web Scraper" },
      { href: "/app/analytics", label: "Analytics" },
    ],
  },
  { title: "Users", items: [{ href: "/app/accounts", label: "Accounts" }] },
];

export function Sidebar() {
  const name = process.env.APP_NAME || "Cintex";
  const tagline = process.env.APP_TAGLINE || "by RockStandard";

  return (
    <aside className="w-full md:w-72 shrink-0 card p-4">
      <div className="mb-4">
        <div className="text-lg font-extrabold tracking-tight">{name}</div>
        <div className="text-xs text-slate-600">{tagline}</div>

        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-xs font-semibold text-slate-700">Workspace</div>
          <div className="text-xs text-slate-600">Diagnostics • Service • Knowledge Base</div>
        </div>
      </div>

      <nav className="space-y-5">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
              {g.title}
            </div>
            <div className="space-y-1">
              {g.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500">
        Clean UI • v1
      </div>
    </aside>
  );
}
