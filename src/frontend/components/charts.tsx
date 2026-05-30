"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { purchases } from "@/frontend/data/bitcoin";
import type { DcaPoint } from "@/frontend/data/bitcoin";
import {
  buildAverageCurve,
  buildEquityCurve,
  monthlyContributions,
  platformDistribution,
} from "@/frontend/lib/portfolio";
import { brl, sats, usd } from "@/frontend/lib/format";

const palette = ["#f7931a", "#16c784", "#3b82f6", "#a855f7", "#ef4444", "#f59e0b"];

export function EquityChart({ items = purchases }: { items?: DcaPoint[] }) {
  const data = buildEquityCurve(items);

  return (
    <ChartFrame height={330}>
      <AreaChart data={data}>
        <CartesianGrid stroke="#e7e7e2" vertical={false} />
        <XAxis dataKey="date" tickMargin={12} minTickGap={24} />
        <YAxis tickFormatter={(value) => `${value / 1000}k`} />
        <Tooltip formatter={(value: number) => brl(value)} />
        <Legend />
        <Area
          type="monotone"
          dataKey="portfolio"
          name="Valor do Portfolio"
          stroke="#16c784"
          fill="#16c784"
          fillOpacity={0.16}
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="invested"
          name="Total Investido"
          stroke="#f7931a"
          strokeWidth={3}
          strokeDasharray="6 6"
          dot={false}
        />
      </AreaChart>
    </ChartFrame>
  );
}

export function PlatformChart({ items = purchases }: { items?: DcaPoint[] }) {
  const data = platformDistribution(items);

  return (
    <ChartFrame height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={72} outerRadius={118}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={palette[index % palette.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => brl(value)} />
        <Legend />
      </PieChart>
    </ChartFrame>
  );
}

export function MonthlyChart({ items = purchases }: { items?: DcaPoint[] }) {
  return (
    <ChartFrame height={300}>
      <BarChart data={monthlyContributions(items)}>
        <CartesianGrid stroke="#e7e7e2" vertical={false} />
        <XAxis dataKey="month" tickMargin={10} />
        <YAxis />
        <Tooltip formatter={(value: number) => brl(value)} />
        <Bar dataKey="value" name="Aportes" fill="#f7931a" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartFrame>
  );
}

export function SatsAccumulatedChart({ items = purchases }: { items?: DcaPoint[] }) {
  return (
    <ChartFrame height={300}>
      <AreaChart data={buildEquityCurve(items)}>
        <CartesianGrid stroke="#e7e7e2" vertical={false} />
        <XAxis dataKey="date" tickMargin={12} minTickGap={24} />
        <YAxis tickFormatter={(value) => sats(Number(value))} />
        <Tooltip formatter={(value: number) => sats(value)} />
        <Area
          type="monotone"
          dataKey="sats"
          name="Satoshis acumulados"
          stroke="#f7931a"
          fill="#f7931a"
          fillOpacity={0.16}
          strokeWidth={3}
        />
      </AreaChart>
    </ChartFrame>
  );
}

export function BtcPriceChart({ items = purchases }: { items?: DcaPoint[] }) {
  return (
    <ChartFrame height={310}>
      <LineChart data={items}>
        <CartesianGrid stroke="#e7e7e2" vertical={false} />
        <XAxis dataKey="id" label={{ value: "Compra #", position: "insideBottom", offset: -4 }} />
        <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
        <Tooltip formatter={(value: number) => usd(value)} />
        <Line
          dataKey="btcPriceUsd"
          name="Preco BTC"
          stroke="#f7931a"
          strokeWidth={3}
          dot={{ r: 4, fill: "#f7931a" }}
        />
      </LineChart>
    </ChartFrame>
  );
}

export function AveragePriceChart({ items = purchases }: { items?: DcaPoint[] }) {
  return (
    <ChartFrame height={320}>
      <AreaChart data={buildAverageCurve(items)}>
        <CartesianGrid stroke="#e7e7e2" vertical={false} />
        <XAxis dataKey="date" tickMargin={12} minTickGap={20} />
        <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
        <Tooltip formatter={(value: number) => usd(value)} />
        <Legend />
        <Area
          dataKey="average"
          name="Preco Medio DCA"
          stroke="#16c784"
          fill="#16c784"
          fillOpacity={0.15}
          strokeWidth={3}
        />
        <Line dataKey="price" name="Preco BTC na Compra" stroke="#f7931a" strokeWidth={3} dot={false} />
      </AreaChart>
    </ChartFrame>
  );
}

export function SatsPerPurchaseChart({ items = purchases }: { items?: DcaPoint[] }) {
  const average = items.length
    ? items.reduce((sum, item) => sum + item.sats, 0) / items.length
    : 0;

  return (
    <ChartFrame height={310}>
      <BarChart data={items}>
        <CartesianGrid stroke="#e7e7e2" vertical={false} />
        <XAxis dataKey="id" tickFormatter={(value) => `#${value}`} />
        <YAxis tickFormatter={(value) => sats(Number(value))} />
        <Tooltip formatter={(value: number) => sats(value)} />
        <Bar dataKey="sats" name="Sats">
          {items.map((entry) => (
            <Cell key={entry.id} fill={entry.sats >= average ? "#16c784" : "#d43d3d"} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  );
}

function ChartFrame({ children, height }: { children: React.ReactElement; height: number }) {
  return (
    <div className="chart-grid w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
