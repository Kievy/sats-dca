import { brl, usd } from "@/frontend/lib/format";
import { StatCard } from "@/frontend/components/stat-card";
import { useBitcoinPrice } from "@/frontend/hooks/use-bitcoin-price";

export function BtcNowCard() {
  const { price, status } = useBitcoinPrice();

  return (
    <StatCard
      label={`BTC agora • ${status}`}
      value={usd(price.usd)}
      sub={brl(price.brl)}
      tone="blue"
    />
  );
}
