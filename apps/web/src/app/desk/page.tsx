import { AppShell } from "@/components/shell/AppShell";
import { gatewayFetch } from "@/lib/api";

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
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-[var(--ac-border)] bg-[var(--ac-surface)] p-5 shadow-sm">
          <h2 className="text-sm font-medium text-[var(--ac-muted)]">Welcome</h2>
          <p className="mt-2 text-lg font-semibold">AgileClix workspace</p>
          <p className="mt-1 text-sm text-[var(--ac-muted)]">
            Headless UI scaffold — modules and metadata engine ship in later phases.
          </p>
        </section>
        <section className="rounded-xl border border-[var(--ac-border)] bg-[var(--ac-surface)] p-5 shadow-sm">
          <h2 className="text-sm font-medium text-[var(--ac-muted)]">API gateway</h2>
          <p className="mt-2 font-mono text-sm">Status: {gatewayStatus}</p>
        </section>
      </div>
    </AppShell>
  );
}
