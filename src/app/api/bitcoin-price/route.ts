import { NextResponse } from "next/server";
import { btcNowUsd, usdBrl } from "@/frontend/data/bitcoin";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,brl&include_last_updated_at=true";

export async function GET() {
  try {
    const response = await fetch(COINGECKO_URL, {
      next: { revalidate: 30 },
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko responded with ${response.status}`);
    }

    const data = (await response.json()) as {
      bitcoin?: {
        usd?: number;
        brl?: number;
        last_updated_at?: number;
      };
    };

    const usd = data.bitcoin?.usd;
    const brl = data.bitcoin?.brl;

    if (!usd || !brl) {
      throw new Error("Bitcoin price payload is missing values");
    }

    return NextResponse.json({
      usd,
      brl,
      updatedAt: data.bitcoin?.last_updated_at
        ? new Date(data.bitcoin.last_updated_at * 1000).toISOString()
        : new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      usd: btcNowUsd,
      brl: btcNowUsd * usdBrl,
      updatedAt: new Date().toISOString(),
      stale: true,
    });
  }
}
