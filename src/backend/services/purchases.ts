"use client";

import { createClient } from "@/backend/supabase/client";
import type { PurchaseInsert, PurchaseUpdate } from "@/backend/supabase/types";
import type { DcaPoint } from "@/frontend/data/bitcoin";

export async function listPurchases() {
  const supabase = createClient();
  if (!supabase) {
    return { error: "Supabase ainda nao configurado.", data: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuario nao autenticado.", data: [] };
  }

  const { data, error } = await supabase.rpc("list_btc_purchases");

  if (error) {
    return { error: error.message, data: [] };
  }

  return { error: null, data: mapRpcRowsToDcaPoints((data ?? []) as PurchaseRpcRow[]) };
}

export async function createPurchase(input: PurchaseInsert) {
  const supabase = createClient();
  if (!supabase) {
    return { error: "Supabase ainda nao configurado.", data: null };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { error: "Sessao expirada. Saia e faca login novamente.", data: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuario nao autenticado.", data: null };
  }

  const { data, error } = await supabase
    .rpc("create_btc_purchase", {
      p_purchased_at: input.date,
      p_sats: input.sats,
      p_btc_price_usd: input.btc_price_usd,
      p_invested_brl: input.invested_brl,
      p_platform_name: input.platform,
      p_goal_name: input.goal?.trim() || null,
      p_notes: input.notes ?? null,
    });

  return {
    data: data ? mapRpcRowsToDcaPoints([data as PurchaseRpcRow])[0] : null,
    error: error?.message,
  };
}

export async function updatePurchase(input: PurchaseUpdate) {
  const supabase = createClient();
  if (!supabase) {
    return { error: "Supabase ainda nao configurado.", data: null };
  }

  const { data, error } = await supabase.rpc("update_btc_purchase", {
    p_purchase_id: input.id,
    p_purchased_at: input.date,
    p_sats: input.sats,
    p_btc_price_usd: input.btc_price_usd,
    p_invested_brl: input.invested_brl,
    p_platform_name: input.platform,
    p_goal_name: input.goal?.trim() || null,
    p_notes: input.notes ?? null,
  });

  return {
    data: data ? mapRpcRowsToDcaPoints([data as PurchaseRpcRow])[0] : null,
    error: error?.message,
  };
}

export async function deletePurchase(id: string) {
  const supabase = createClient();
  if (!supabase) {
    return { error: "Supabase ainda nao configurado." };
  }

  const { error } = await supabase.rpc("delete_btc_purchase", {
    p_purchase_id: id,
  });

  return { error: error?.message };
}

type PurchaseRpcRow = {
  id: string;
  user_id: string;
  purchased_at: string;
  sats: number;
  btc_price_usd: number;
  invested_brl: number;
  platform_name: string | null;
  goal_name: string | null;
  notes?: string | null;
};

function mapRpcRowsToDcaPoints(rows: PurchaseRpcRow[]): DcaPoint[] {
  return rows.map((row, index) => ({
    id: index + 1,
    dbId: row.id,
    date: row.purchased_at,
    sats: Number(row.sats),
    btcPriceUsd: Number(row.btc_price_usd),
    investedBrl: Number(row.invested_brl),
    platform: row.platform_name ?? "Sem plataforma",
    goal: row.goal_name ?? "Sem meta",
    notes: row.notes ?? null,
  }));
}
