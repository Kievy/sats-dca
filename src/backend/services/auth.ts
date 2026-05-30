"use client";

import { createClient } from "@/backend/supabase/client";

function normalizeUsername(username: string) {
  return username
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function authEmailFromUsername(username: string) {
  return `${normalizeUsername(username)}@sats-dca.app`;
}

function validateUsername(username: string): { username: string; error?: never } | { username?: never; error: string } {
  const normalized = normalizeUsername(username);

  if (normalized.length < 3) {
    return { error: "Use um usuario com pelo menos 3 caracteres." };
  }

  return { username: normalized };
}

export async function signInWithUsername(username: string, password: string) {
  const supabase = createClient();
  if (!supabase) {
    return {
      error:
        "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar o login.",
    };
  }

  const validation = validateUsername(username);
  if ("error" in validation) {
    return { error: validation.error };
  }

  const email = authEmailFromUsername(validation.username);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error: error?.message };
}

export async function signUpWithUsername(
  username: string,
  password: string,
) {
  const supabase = createClient();
  if (!supabase) {
    return {
      error:
        "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar o cadastro.",
    };
  }

  const validation = validateUsername(username);
  if ("error" in validation) {
    return { error: validation.error };
  }

  const normalizedUsername = validation.username;
  const email = authEmailFromUsername(normalizedUsername);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: normalizedUsername,
      },
    },
  });

  return {
    data,
    error: error?.message === "Unable to validate email address: invalid format"
      ? "Nao foi possivel criar esse usuario. Tente outro nome de usuario."
      : error?.message,
    needsEmailConfirmation: !data.session,
  };
}

export async function getCurrentUser() {
  const supabase = createClient();
  if (!supabase) {
    return { user: null, error: "Supabase ainda nao configurado." };
  }

  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error: error?.message };
}

export async function signOut() {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}
