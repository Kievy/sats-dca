"use client";

import { Target } from "lucide-react";
import { PageTitle } from "@/frontend/components/page-title";
import { Panel } from "@/frontend/components/panel";
import { brl, sats } from "@/frontend/lib/format";
import { getPortfolioStats } from "@/frontend/lib/portfolio";
import { usePurchases } from "@/frontend/hooks/use-purchases";

export default function MetasPage() {
  const { purchases } = usePurchases();
  const stats = getPortfolioStats(purchases);
  const initialTargetSats = 1_000_000;
  const mainTargetSats = 10_000_000;
  const initialProgress = Math.min(100, (stats.totalSats / initialTargetSats) * 100);
  const mainProgress = Math.min(100, (stats.totalSats / mainTargetSats) * 100);

  return (
    <>
      <PageTitle icon={Target} title="Metas" />
      <Panel title="Metas de Bitcoin" icon={<Target size={20} className="text-bitcoin" />}>
        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          <div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="font-bold">Meta inicial</p>
                <p className="text-sm font-semibold text-muted">0,01 BTC</p>
              </div>
              <p className="mt-1 text-muted">Primeiro marco: acumular 1.000.000 sats.</p>
              <div className="mt-4 h-4 overflow-hidden rounded-full bg-subtle">
                <div className="h-full rounded-full bg-bitcoin" style={{ width: `${initialProgress}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-muted">
                {sats(stats.totalSats)} de {sats(initialTargetSats)} sats
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                <p className="font-bold">Meta principal</p>
                <p className="text-sm font-semibold text-muted">0,1 BTC</p>
              </div>
              <p className="mt-1 text-muted">Objetivo principal: acumular 10.000.000 sats.</p>
              <div className="mt-4 h-4 overflow-hidden rounded-full bg-subtle">
                <div className="h-full rounded-full bg-action" style={{ width: `${mainProgress}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-muted">
                {sats(stats.totalSats)} de {sats(mainTargetSats)} sats
              </p>
            </div>
          </div>
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[22px] bg-subtle p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-muted">Total investido</p>
            <p className="mt-3 text-4xl font-extrabold leading-tight">{brl(stats.invested)}</p>
            <p className="mt-3 text-sm font-semibold text-muted">{stats.count} compras registradas</p>
          </div>
        </div>
      </Panel>
    </>
  );
}
