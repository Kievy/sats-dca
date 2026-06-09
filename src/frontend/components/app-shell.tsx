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
import { useEffect, useRef, useState } from "react";
import { getMyProfile, type AppProfile } from "@/backend/services/users";
import { ThemeToggle } from "@/frontend/components/theme-toggle";

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
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const [mobileScroll, setMobileScroll] = useState({ left: 0, max: 0 });

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

  useEffect(() => {
    updateMobileScroll();

    window.addEventListener("resize", updateMobileScroll);

    return () => {
      window.removeEventListener("resize", updateMobileScroll);
    };
  }, [profile?.role]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  function updateMobileScroll() {
    const navElement = mobileNavRef.current;

    if (!navElement) {
      return;
    }

    setMobileScroll({
      left: navElement.scrollLeft,
      max: navElement.scrollWidth - navElement.clientWidth,
    });
  }

  const hasMobileOverflow = mobileScroll.max > 4;
  const scrollProgress = hasMobileOverflow
    ? Math.min(mobileScroll.left / mobileScroll.max, 1)
    : 0;

  return (
    <div className="min-h-screen bg-app text-ink">
      <aside className="fixed left-4 top-4 z-20 hidden h-[calc(100vh-32px)] w-[280px] flex-col rounded-[28px] border border-line bg-panel shadow-soft lg:flex">
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
                    ? "bg-action text-actionText"
                    : "text-muted hover:bg-subtle hover:text-ink",
                )}
              >
                <Icon size={21} className={active ? "text-bitcoin" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-line p-4">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-action px-4 font-bold text-actionText transition hover:bg-bitcoin hover:text-white"
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
              <p className="rounded-2xl bg-panel px-5 py-3 font-semibold text-muted shadow-sm">
                Verificando login...
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-panel px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-4 lg:hidden">
        <div
          className={clsx(
            "absolute left-1/2 top-1 h-1 w-24 -translate-x-1/2 rounded-full bg-subtle",
            !hasMobileOverflow && "opacity-40",
          )}
          aria-hidden="true"
        >
          <div
            className="h-full w-9 rounded-full bg-muted transition-transform duration-150"
            style={{
              transform: `translateX(${scrollProgress * 60}px)`,
            }}
          />
        </div>
        <div
          ref={mobileNavRef}
          onScroll={updateMobileScroll}
          onMouseEnter={updateMobileScroll}
          onTouchStart={updateMobileScroll}
          className="scrollbar-hide flex gap-2 overflow-x-auto overscroll-x-contain"
        >
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
                  active ? "bg-action text-actionText" : "text-muted",
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
          <ThemeToggle compact />
        </div>
      </div>
    </div>
  );
}
