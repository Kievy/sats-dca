"use client";

import { useEffect, useState } from "react";
import { btcNowUsd, usdBrl } from "@/frontend/data/bitcoin";

export type BitcoinPrice = {
  usd: number;
  brl: number;
  updatedAt: string;
  stale?: boolean;
};

export function useBitcoinPrice() {
  const [price, setPrice] = useState<BitcoinPrice>({
    usd: btcNowUsd,
    brl: btcNowUsd * usdBrl,
    updatedAt: "",
  });
  const [status, setStatus] = useState("Atualizando...");

  useEffect(() => {
    let active = true;

    async function loadPrice() {
      try {
        const response = await fetch("/api/bitcoin-price", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Price request failed");
        }

        const data = (await response.json()) as BitcoinPrice;

        if (active) {
          setPrice(data);
          setStatus(data.stale ? "Usando ultimo valor salvo" : "Tempo real");
        }
      } catch {
        if (active) {
          setStatus("Usando ultimo valor salvo");
        }
      }
    }

    void loadPrice();
    const interval = window.setInterval(loadPrice, 30_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return { price, status };
}
