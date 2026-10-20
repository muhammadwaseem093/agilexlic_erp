import Link from "next/link";
import { cn } from "@/lib/cn";
import { Topbar } from "@/components/shell/Topbar";
import { Logo } from "@/components/brand/Logo";
import { brand } from "@/brand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGauge, faTableCellsLarge, faUser } from "@fortawesome/free-solid-svg-icons";

const nav = [
  { href: "/desk", label: "Desk", icon: faGauge },
  { href: "/apps", label: "Apps", icon: faTableCellsLarge },
  { href: "/login", label: "Account", icon: faUser },
];

type AppShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside
        className="flex w-64 shrink-0 flex-col border-r bg-sidebar text-slate-100"
        aria-label="Primary navigation"
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-white p-1">
              <Logo size={32} />
            </span>
            <p className="text-lg font-semibold tracking-tight">{brand.name}</p>
          </div>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-sky-300">
            {brand.tagline}
          </p>
          <div className="ac-brand-rule mt-3 w-24 rounded-full" />
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors",
                "hover:bg-[var(--ac-sidebar-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              )}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4 text-slate-400" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2 p-4 text-xs text-slate-500">
          <a
            href={process.env.NEXT_PUBLIC_FRAPPE_DESK_URL ?? "https://erp.agileclix.com/desk"}
            className="block rounded-md border border-white/15 px-3 py-2 text-center text-slate-200 hover:bg-[var(--ac-sidebar-hover)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open full workspace
          </a>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 bg-background p-6">{children}</main>
      </div>
    </div>
  );
}
