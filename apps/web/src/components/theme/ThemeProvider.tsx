"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

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
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-4 z-50 rounded-full shadow-md"
        onClick={() => {
          const next = theme === "light" ? "dark" : "light";
          setTheme(next);
          document.documentElement.classList.toggle("dark", next === "dark");
          window.localStorage.setItem("agileclix-theme", next);
        }}
        aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      >
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
      </Button>
      {children}
    </>
  );
}
