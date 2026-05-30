"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bitcoin,
  CircleHelp,
  Gauge,
  LogOut,
  PieChart,
  ShoppingCart,
  Target,
  Users,
} from "lucide-react";
import { getCurrentUser, signOut } from "@/backend/services/auth";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { getMyProfile, type AppProfile } from "@/backend/services/users";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/analise", label: "Analise", icon: PieChart },
  { href: "/dashboard/compras", label: "Compras", icon: ShoppingCart },
  { href: "/dashboard/metas", label: "Metas", icon: Target },
  { href: "/dashboard/faq", label: "FAQ", icon: CircleHelp },
];

const adminNav = [{ href: "/dashboard/usuarios", label: "Usuarios", icon: Users }];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<AppProfile | null>(null);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const { user, error } = await getCurrentUser();

      if (!active) {
        return;
      }

      if (!user && !error?.includes("Supabase ainda nao configurado")) {
        router.replace("/");
        return;
      }

      if (user) {
        const profileResult = await getMyProfile();
        if (active && profileResult.data) {
          setProfile(profileResult.data);
        }
      }

      setCheckingAuth(false);
    }

    void checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#f3f3f1] text-ink">
      <aside className="fixed left-4 top-4 z-20 hidden h-[calc(100vh-32px)] w-[280px] flex-col rounded-[28px] border border-line bg-white shadow-soft lg:flex">
        <div className="flex items-center gap-3 px-7 py-7">
          <div className="grid size-9 place-items-center rounded-full bg-bitcoin text-white">
            <Bitcoin size={20} />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">Sats DCA</p>
            <p className="mt-1 text-sm text-muted">Bitcoin DCA Tracker</p>
          </div>
        </div>

        <nav className="space-y-1 px-4">
          {[...nav, ...(profile?.role === "admin" ? adminNav : [])].map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex h-12 items-center gap-3 rounded-2xl px-4 text-base font-semibold transition",
                  active
                    ? "bg-[#111] text-white"
                    : "text-[#777] hover:bg-[#f0f0ed] hover:text-ink",
                )}
              >
                <Icon size={21} className={active ? "text-bitcoin" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-line p-4">
          <button
            onClick={handleSignOut}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 font-bold text-white transition hover:bg-bitcoin"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <main className="px-4 pb-32 pt-4 lg:pb-4 lg:pl-[320px]">
        <div className="mx-auto max-w-[1400px]">
          {checkingAuth ? (
            <div className="grid min-h-screen place-items-center">
              <p className="rounded-2xl bg-white px-5 py-3 font-semibold text-muted shadow-sm">
                Verificando login...
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto overscroll-x-contain">
          {[...nav, ...(profile?.role === "admin" ? adminNav : [])].map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "grid h-16 min-w-[86px] shrink-0 place-items-center rounded-2xl px-3 py-2 text-xs font-semibold",
                  active ? "bg-ink text-white" : "text-muted",
                )}
              >
                <Icon size={18} />
                <span className="whitespace-nowrap leading-none">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="grid h-16 min-w-[86px] shrink-0 place-items-center rounded-2xl px-3 py-2 text-xs font-semibold text-muted"
          >
            <LogOut size={18} />
            <span className="whitespace-nowrap leading-none">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
