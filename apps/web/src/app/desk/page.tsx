import { AppShell } from "@/components/shell/AppShell";
import { gatewayFetch } from "@/lib/api";
import { ArrowUpRight, Package, Receipt, Users } from "lucide-react";

const kpis = [
  { label: "Customers", value: "—", icon: Users, hint: "Connect gateway auth" },
  { label: "Open orders", value: "—", icon: Package, hint: "Sales module" },
  { label: "Invoices due", value: "—", icon: Receipt, hint: "Accounting" },
];

export default async function DeskPage() {
  let gatewayStatus = "unreachable";
  try {
    const health = await gatewayFetch<{ status: string }>("/health");
    gatewayStatus = health.success ? health.data?.status ?? "ok" : "error";
  } catch {
    gatewayStatus = "unreachable";
  }

  return (
    <AppShell title="Desk">
      <div className="mb-6 rounded-xl border border-[var(--ac-border)] bg-gradient-to-r from-[var(--ac-sidebar)] to-slate-800 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-slate-300">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">AgileClix workspace</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Your headless command center. Modules, records, and workflows will appear here as we connect the
          metadata engine to ERPNext.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map(({ label, value, icon: Icon, hint }) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--ac-border)] bg-[var(--ac-surface)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--ac-muted)]">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-[var(--ac-muted)]">{hint}</p>
              </div>
              <Icon className="size-5 text-[var(--ac-accent)]" aria-hidden />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--ac-border)] bg-[var(--ac-surface)] p-5">
          <h3 className="text-sm font-semibold">Platform status</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--ac-muted)]">API gateway</dt>
              <dd className="font-mono">{gatewayStatus}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--ac-muted)]">ERP engine</dt>
              <dd>ERPNext v16</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-xl border border-[var(--ac-border)] bg-[var(--ac-surface)] p-5">
          <h3 className="text-sm font-semibold">Quick links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={process.env.NEXT_PUBLIC_FRAPPE_DESK_URL ?? "https://erp.agileclix.com/desk"}
                className="inline-flex items-center gap-1 font-medium text-[var(--ac-primary)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Classic Frappe Desk <ArrowUpRight className="size-4" />
              </a>
            </li>
            <li>
              <a href="/apps" className="font-medium text-[var(--ac-primary)]">
                Browse apps
              </a>
            </li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
