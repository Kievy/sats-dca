"use client";

import { createClient } from "@/backend/supabase/client";

export type UserRole = "user" | "admin";

export type AppProfile = {
  id: string;
  username: string | null;
  email: string | null;
  role: UserRole;
};

export type AppUserListItem = {
  id: string;
  username: string;
  role: UserRole;
  last_sign_in_at: string | null;
};

export async function getMyProfile() {
  const supabase = createClient();
  if (!supabase) {
    return { data: null, error: "Supabase ainda nao configurado." };
  }

  const { data, error } = await supabase.rpc("get_my_profile");

  if (!error && data) {
    return {
      data: data as AppProfile,
      error: undefined,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: error?.message ?? "Usuario nao autenticado." };
  }

  const fallback = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .eq("id", user.id)
    .single<AppProfile>();

  return {
    data: fallback.data,
    error: fallback.error?.message ?? error?.message,
  };
}

export async function listAppUsers() {
  const supabase = createClient();
  if (!supabase) {
    return { data: null, error: "Supabase ainda nao configurado." };
  }

  const { data, error } = await supabase.rpc("list_app_users");

  return {
    data: (data ?? []) as AppUserListItem[],
    error: error?.message,
  };
}
