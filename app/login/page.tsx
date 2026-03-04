import { LoginForm } from "./ui";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md border border-white/10 bg-white/5 rounded-2xl p-6">
        <div className="text-xl font-extrabold tracking-tight">
          {(process.env.APP_NAME || "Cintex")} <span className="text-slate-300 text-base font-bold">{process.env.APP_TAGLINE || "by RockStandard"}</span>
        </div>
        <div className="text-sm text-slate-300 mt-1">Sign in to continue</div>
        <div className="mt-5">
          <LoginForm />
        </div>
        <div className="text-xs text-slate-400 mt-4">
          Seeded admin defaults to <span className="font-mono">admin@rockstandard.com</span> (change via env).
        </div>
      </div>
    </main>
  );
}
