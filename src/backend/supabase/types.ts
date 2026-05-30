export type PurchaseInsert = {
  date: string;
  sats: number;
  btc_price_usd: number;
  invested_brl: number;
  platform: string;
  goal?: string | null;
  notes?: string | null;
};

export type PurchaseUpdate = PurchaseInsert & {
  id: string;
};

export type PurchaseRow = {
  id: string;
  user_id: string;
  asset_id: string;
  platform_id: string | null;
  goal_id: string | null;
  purchased_at: string;
  sats: number;
  btc_price_usd: number;
  invested_brl: number;
  notes: string | null;
  created_at: string;
  platforms: { name: string } | { name: string }[] | null;
  goals: { name: string } | { name: string }[] | null;
  assets: { symbol: string; name: string } | { symbol: string; name: string }[] | null;
};

export type AuthFormMode = "login" | "register";
