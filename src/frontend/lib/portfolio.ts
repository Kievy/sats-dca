import { btcNowUsd, purchases, usdBrl, type DcaPoint } from "@/frontend/data/bitcoin";

export function getPortfolioStats(
  items: DcaPoint[] = purchases,
  currentBtcUsd = btcNowUsd,
) {
  if (items.length === 0) {
    return {
      invested: 0,
      totalSats: 0,
      btc: 0,
      currentValue: 0,
      averagePriceUsd: 0,
      profit: 0,
      profitPercent: 0,
      count: 0,
    };
  }

  const invested = items.reduce((sum, item) => sum + item.investedBrl, 0);
  const totalSats = items.reduce((sum, item) => sum + item.sats, 0);
  const btc = totalSats / 100_000_000;
  const currentValue = btc * currentBtcUsd * usdBrl;
  const averagePriceUsd =
    items.reduce((sum, item) => sum + item.btcPriceUsd * item.sats, 0) /
    totalSats;
  const profit = currentValue - invested;
  const profitPercent = (profit / invested) * 100;

  return {
    invested,
    totalSats,
    btc,
    currentValue,
    averagePriceUsd,
    profit,
    profitPercent,
    count: items.length,
  };
}

export function buildEquityCurve(items: DcaPoint[] = purchases) {
  let invested = 0;
  let totalSats = 0;

  return items.map((item) => {
    invested += item.investedBrl;
    totalSats += item.sats;

    return {
      date: item.date,
      invested,
      portfolio: (totalSats / 100_000_000) * item.btcPriceUsd * usdBrl,
      sats: totalSats,
    };
  });
}

export function buildAverageCurve(items: DcaPoint[] = purchases) {
  let totalSats = 0;
  let weightedPrice = 0;

  return items.map((item) => {
    totalSats += item.sats;
    weightedPrice += item.sats * item.btcPriceUsd;

    return {
      date: item.date,
      price: item.btcPriceUsd,
      average: weightedPrice / totalSats,
    };
  });
}

export function monthlyContributions(items: DcaPoint[] = purchases) {
  const grouped = new Map<string, number>();
  for (const item of items) {
    const month = item.date.slice(0, 7);
    grouped.set(month, (grouped.get(month) ?? 0) + item.investedBrl);
  }

  return Array.from(grouped, ([month, value]) => ({ month, value }));
}

export function platformDistribution(items: DcaPoint[] = purchases) {
  const grouped = new Map<string, number>();
  for (const item of items) {
    grouped.set(item.platform, (grouped.get(item.platform) ?? 0) + item.investedBrl);
  }

  return Array.from(grouped, ([name, value]) => ({ name, value }));
}
