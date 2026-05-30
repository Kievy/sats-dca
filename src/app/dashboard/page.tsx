"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Bitcoin, CalendarDays, Layers3, PieChart } from "lucide-react";
import { PageTitle } from "@/frontend/components/page-title";
import { Panel } from "@/frontend/components/panel";
import { StatCard } from "@/frontend/components/stat-card";
import { BtcNowCard } from "@/frontend/components/btc-now-card";
import {
  EquityChart,
  MonthlyChart,
  PlatformChart,
  SatsAccumulatedChart,
} from "@/frontend/components/charts";
import { usdBrl } from "@/frontend/data/bitcoin";
import { brl, percent, sats, usd } from "@/frontend/lib/format";
import { getPortfolioStats } from "@/frontend/lib/portfolio";
import { usePurchases } from "@/frontend/hooks/use-purchases";
import { useBitcoinPrice } from "@/frontend/hooks/use-bitcoin-price";
import { getMyProfile, type AppProfile } from "@/backend/services/users";

export default function DashboardPage() {
  const { purchases, loading, error } = usePurchases();
  const { price } = useBitcoinPrice();
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const stats = getPortfolioStats(purchases, price.usd);
  const displayName = useMemo(() => {
    if (profile?.username) {
      return profile.username;
    }

    if (profile?.email) {
      return profile.email.split("@")[0];
    }

    return "usuario";
  }, [profile]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const result = await getMyProfile();

      if (active && result.data) {
        setProfile(result.data);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <p className="pt-4 text-lg font-semibold text-muted">
        Bem vindo de volta, <span className="text-ink">{displayName}</span>.
      </p>

      <PageTitle
        icon={Bitcoin}
        title="Meu Portfolio"
        action={
          <a
            href="/dashboard/compras"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-5 font-bold text-white transition hover:bg-bitcoin"
          >
            Novo aporte
          </a>
        }
      />

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      {loading ? <p className="mb-5 text-sm font-semibold text-muted">Carregando aportes...</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total investido" value={brl(stats.invested)} sub={`${stats.count} compras`} tone="orange" />
        <StatCard label="BTC acumulado" value={`${sats(stats.totalSats)} sats`} sub={`${stats.btc.toFixed(8)} BTC`} tone="orange" />
        <StatCard label="Valor atual" value={brl(stats.currentValue)} sub={usd(stats.btc * price.usd)} />
        <StatCard label="Preco medio" value={usd(stats.averagePriceUsd)} sub={brl(stats.averagePriceUsd * usdBrl)} />
        <StatCard
          label="Lucro / prejuizo"
          value={percent(stats.profitPercent)}
          sub={brl(stats.profit)}
          tone={stats.profit >= 0 ? "green" : "red"}
        />
        <BtcNowCard />
      </div>

      <div className="mt-5 grid gap-5">
        <Panel title="Curva de Equity" icon={<BarChart3 className="text-bitcoin" size={20} />}>
          <EquityChart items={purchases} />
        </Panel>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel title="Plataformas" icon={<PieChart className="text-bitcoin" size={20} />}>
            <PlatformChart items={purchases} />
          </Panel>
          <Panel title="Aportes Mensais" icon={<CalendarDays className="text-bitcoin" size={20} />}>
            <MonthlyChart items={purchases} />
          </Panel>
        </div>

        <Panel title="BTC Acumulado (satoshis)" icon={<Layers3 className="text-bitcoin" size={20} />}>
          <SatsAccumulatedChart items={purchases} />
        </Panel>
      </div>
    </>
  );
}
