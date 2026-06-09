"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Bitcoin, LockKeyhole, UserRound } from "lucide-react";
import { signInWithUsername, signUpWithUsername } from "@/backend/services/auth";
import type { AuthFormMode } from "@/backend/supabase/types";

export default function WelcomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthFormMode>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const username = String(form.get("username"));

    const result =
      mode === "login"
        ? await signInWithUsername(username, password)
        : await signUpWithUsername(username, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if ("needsEmailConfirmation" in result && result.needsEmailConfirmation) {
      setError("Cadastro criado. Voce ja pode fazer login.");
      setMode("login");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen gap-4 bg-app p-4 text-ink lg:grid-cols-[460px_1fr] lg:gap-0">
      <section className="order-2 flex min-h-[310px] flex-col rounded-[28px] border border-line bg-hero p-6 text-heroText shadow-soft sm:min-h-[380px] lg:order-1 lg:min-h-[calc(100vh-32px)] lg:p-8">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-bitcoin">
            <Bitcoin size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">Sats DCA</p>
            <p className="text-sm opacity-60">Bitcoin DCA Tracker</p>
          </div>
        </div>

        <div className="mt-12 max-w-sm sm:mt-16 lg:my-auto">
          <p className="mb-3 inline-flex rounded-full bg-bitcoin/10 px-3 py-1 text-xs font-semibold text-bitcoin sm:text-sm">
            DCA em Bitcoin
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl lg:text-5xl">
            Acompanhe seus sats.
          </h1>
          <p className="mt-3 text-sm leading-6 opacity-70 sm:text-base lg:mt-5 lg:text-lg lg:leading-8">
            Registre aportes, veja seu preco medio e acompanhe sua evolucao em
            Bitcoin.
          </p>
        </div>
      </section>

      <section className="order-1 flex items-start justify-center px-0 py-0 lg:order-2 lg:items-center lg:px-10 lg:py-8">
        <div className="w-full max-w-[520px] rounded-[28px] border border-line bg-panel p-6 shadow-soft sm:p-7">
          <div className="mb-6 flex rounded-2xl bg-subtle p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`h-11 flex-1 rounded-xl font-bold ${mode === "login" ? "bg-action text-actionText" : "text-muted"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`h-11 flex-1 rounded-xl font-bold ${mode === "register" ? "bg-action text-actionText" : "text-muted"}`}
            >
              Cadastro
            </button>
          </div>

          <h2 className="text-3xl font-bold">
            {mode === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
          </h2>
          <p className="mt-2 text-muted">
            {mode === "login"
              ? "Entre para acessar seu portfolio de Bitcoin."
              : "Use apenas usuario e senha para comecar."}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-muted">Usuario</span>
              <div className="mt-2 flex h-[52px] items-center gap-3 rounded-2xl border border-line bg-field px-4">
                <UserRound size={20} className="text-muted" />
                <input
                  name="username"
                  required
                  minLength={3}
                  autoComplete="username"
                  placeholder="seu-usuario"
                  className="h-full w-full bg-transparent outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-muted">Senha</span>
              <div className="mt-2 flex h-[52px] items-center gap-3 rounded-2xl border border-line bg-field px-4">
                <LockKeyhole size={20} className="text-muted" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="minimo 6 caracteres"
                  className="h-full w-full bg-transparent outline-none"
                />
              </div>
            </label>

            {error ? (
              <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>
            ) : null}

            <button
              disabled={loading}
              className="h-[52px] w-full rounded-2xl bg-action font-bold text-actionText transition hover:bg-bitcoin hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
