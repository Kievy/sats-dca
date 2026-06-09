"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("sats-dca-theme", theme);
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const activeTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    setTheme(activeTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        compact
          ? "grid h-16 min-w-[86px] shrink-0 place-items-center rounded-2xl px-3 py-2 text-xs font-semibold text-muted transition hover:text-ink"
          : "flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-field px-4 font-bold text-ink transition hover:bg-subtle"
      }
      title={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
      aria-label={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
    >
      <Icon size={compact ? 18 : 19} />
      <span className={compact ? "whitespace-nowrap leading-none" : ""}>
        {theme === "dark" ? "Claro" : "Dark"}
      </span>
    </button>
  );
}
