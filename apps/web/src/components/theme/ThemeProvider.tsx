"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("agileclix-theme") as Theme | null;
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-50 rounded-full border border-[var(--ac-border)] bg-[var(--ac-surface)] px-3 py-2 text-xs font-medium shadow-md"
        onClick={() => {
          const next = theme === "light" ? "dark" : "light";
          setTheme(next);
          document.documentElement.classList.toggle("dark", next === "dark");
          window.localStorage.setItem("agileclix-theme", next);
        }}
        aria-label="Toggle theme"
      >
        {theme === "light" ? "Dark" : "Light"}
      </button>
      {children}
    </>
  );
}
