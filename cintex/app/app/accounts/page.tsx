import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") {
    return (
      <div>
        <h1 className="text-xl font-extrabold">Accounts</h1>
        <p className="text-sm text-slate-300 mt-2">Admin only.</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-extrabold">Accounts</h1>
      <p className="text-sm text-slate-300">Create/manage users in v1. (This list is live.)</p>

      <div className="overflow-auto border border-white/10 rounded-2xl">
        <table className="min-w-[680px] w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-3 text-slate-300">Email</th>
              <th className="text-left p-3 text-slate-300">Role</th>
              <th className="text-left p-3 text-slate-300">Disabled</th>
              <th className="text-left p-3 text-slate-300">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="p-3 font-mono text-xs">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.disabled ? "Yes" : "No"}</td>
                <td className="p-3 text-slate-400">{u.createdAt.toISOString().slice(0,10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400">
        Next: add Create/Disable/Reset UI + audit log.
      </div>
    </div>
  );
}
