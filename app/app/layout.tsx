import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <Topbar email={session.email} role={session.role} />
        <div className="flex flex-col md:flex-row gap-4">
          <Sidebar />
          <section className="flex-1 card p-5">{children}</section>
        </div>
      </div>
    </main>
  );
}
