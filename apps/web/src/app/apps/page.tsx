import { AppShell } from "@/components/shell/AppShell";

const modules = [
  "CRM",
  "Sales",
  "Purchasing",
  "Inventory",
  "Accounting",
];

export default function AppsPage() {
  return (
    <AppShell title="Apps">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((name) => (
          <li
            key={name}
            className="rounded-lg border border-[var(--ac-border)] bg-[var(--ac-surface)] p-4 text-sm font-medium"
          >
            {name}
            <span className="mt-1 block text-xs font-normal text-[var(--ac-muted)]">Coming soon</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
