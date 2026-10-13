import Link from "next/link";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/desk", label: "Desk" },
  { href: "/apps", label: "Apps" },
];

type AppShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside
        className="flex w-64 flex-col border-r border-[var(--ac-border)] bg-[var(--ac-sidebar)] text-slate-100"
        aria-label="Primary navigation"
      >
        <div className="border-b border-slate-700 px-5 py-4">
          <p className="text-lg font-semibold tracking-tight">AgileClix ERP</p>
          <p className="text-xs text-slate-400">ZentoriLabs</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-slate-200",
                "hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ac-primary)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto p-4 text-xs text-slate-500">
          Frappe Desk remains available for break-glass admin.
        </p>
      </aside>
      <div className="flex flex-1 flex-col">
        <header
          className="flex h-14 items-center border-b border-[var(--ac-border)] bg-[var(--ac-surface)] px-6"
        >
          <h1 className="text-base font-semibold">{title}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
