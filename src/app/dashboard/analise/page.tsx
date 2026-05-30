"use client";

import { BadgeDollarSign, Crosshair, Layers3, Trophy, TriangleAlert } from "lucide-react";
import { PageTitle } from "@/frontend/components/page-title";
import { Panel } from "@/frontend/components/panel";
import { StatCard } from "@/frontend/components/stat-card";
import {
  AveragePriceChart,
  BtcPriceChart,
  SatsPerPurchaseChart,
} from "@/frontend/components/charts";
import type { DcaPoint } from "@/frontend/data/bitcoin";
import { sats, usd } from "@/frontend/lib/format";
import { getPortfolioStats } from "@/frontend/lib/portfolio";
import { usePurchases } from "@/frontend/hooks/use-purchases";

export default function AnalisePage() {
  const { purchases } = usePurchases();
  const rows = purchases;

  if (!rows.length) {
    return (
      <>
        <PageTitle icon={BadgeDollarSign} title="Analise" />
        <Panel title="Sem aportes ainda" icon={<BadgeDollarSign className="text-bitcoin" size={20} />}>
          <p className="text-muted">Cadastre seu primeiro aporte para liberar as analises.</p>
        </Panel>
      </>
    );
  }

  const stats = getPortfolioStats(rows);
  const oneShotSats = Math.round(stats.invested / 5.0613 / rows[0].btcPriceUsd * 100_000_000);
  const advantage = stats.totalSats - oneShotSats;
  const best = [...rows].sort((a, b) => a.btcPriceUsd - b.btcPriceUsd).slice(0, 3);
  const worst = [...rows].sort((a, b) => b.btcPriceUsd - a.btcPriceUsd).slice(0, 3);

  return (
    <>
      <PageTitle icon={BadgeDollarSign} title="Analise" />

      <Panel title="DCA vs Aporte Unico" icon={<BadgeDollarSign className="text-bitcoin" size={20} />}>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="DCA (sua estrategia)" value={`${sats(stats.totalSats)} sats`} sub={`Preco medio: ${usd(stats.averagePriceUsd)}`} tone="green" />
          <StatCard label="Aporte unico (1a compra)" value={`${sats(oneShotSats)} sats`} sub={`Preco fixo: ${usd(rows[0].btcPriceUsd)}`} tone="red" />
          <StatCard label="Vantagem DCA" value={`${sats(advantage)} sats`} sub={advantage > 0 ? "DCA rendeu mais" : "Aporte unico rendeu mais"} tone={advantage > 0 ? "green" : "red"} />
        </div>
      </Panel>

      <div className="mt-5 grid gap-5">
        <Panel title="Preco BTC em Cada Compra (USD)" icon={<Crosshair className="text-bitcoin" size={20} />}>
          <BtcPriceChart items={rows} />
        </Panel>
        <Panel title="Preco Medio Acumulado (USD)" icon={<Crosshair className="text-success" size={20} />}>
          <AveragePriceChart items={rows} />
        </Panel>
        <Panel title="Satoshis por Compra" icon={<Layers3 className="text-bitcoin" size={20} />}>
          <SatsPerPurchaseChart items={rows} />
          <p className="mt-2 text-center text-sm text-muted">Verde = acima da media | Vermelho = abaixo</p>
        </Panel>

        <div className="grid gap-5 xl:grid-cols-2">
          <PurchaseRank title="Melhores Compras (menor preco)" icon={<Trophy size={20} className="text-success" />} rows={best} good />
          <PurchaseRank title="Piores Compras (maior preco)" icon={<TriangleAlert size={20} className="text-danger" />} rows={worst} />
        </div>
      </div>
    </>
  );
}

function PurchaseRank({
  title,
  rows,
  icon,
  good = false,
}: {
  title: string;
  rows: DcaPoint[];
  icon: React.ReactNode;
  good?: boolean;
}) {
  return (
    <Panel title={title} icon={icon}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted">
            <tr>
              <th className="py-3">#</th>
              <th>Data</th>
              <th>Preco USD</th>
              <th>Sats</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-3 text-bitcoin">{row.id}</td>
                <td>{new Intl.DateTimeFormat("pt-BR").format(new Date(`${row.date}T00:00:00`))}</td>
                <td className={good ? "text-success" : "text-danger"}>{usd(row.btcPriceUsd)}</td>
                <td>{sats(row.sats)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
