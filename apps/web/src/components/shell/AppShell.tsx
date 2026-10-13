import Link from "next/link";
import { cn } from "@/lib/cn";
import { Topbar } from "@/components/shell/Topbar";

const nav = [
  { href: "/desk", label: "Desk" },
  { href: "/apps", label: "Apps" },
  { href: "/login", label: "Account" },
];

type AppShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside
        className="flex w-64 shrink-0 flex-col border-r border-[var(--ac-border)] bg-[var(--ac-sidebar)] text-slate-100"
        aria-label="Primary navigation"
      >
        <div className="border-b border-slate-700 px-5 py-5">
          <p className="text-lg font-semibold tracking-tight">AgileClix ERP</p>
          <p className="mt-0.5 text-xs text-slate-400">ZentoriLabs</p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-teal-400/90">
            Work Smarter. Grow Faster.
          </p>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors",
                "hover:bg-slate-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ac-primary)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2 p-4 text-xs text-slate-500">
          <a
            href={process.env.NEXT_PUBLIC_FRAPPE_DESK_URL ?? "https://erp.agileclix.com/desk"}
            className="block rounded-md border border-slate-700 px-3 py-2 text-center text-slate-300 hover:bg-slate-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open classic Desk
          </a>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 bg-[var(--ac-background)] p-6">{children}</main>
      </div>
    </div>
  );
}
