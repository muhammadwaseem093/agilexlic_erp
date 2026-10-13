import { Bell, Search } from "lucide-react";

type TopbarProps = {
  title: string;
  userInitials?: string;
};

export function Topbar({ title, userInitials = "AC" }: TopbarProps) {
  return (
    <header
      className="flex h-14 items-center justify-between gap-4 border-b border-[var(--ac-border)] bg-[var(--ac-surface)] px-6"
    >
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <label className="relative hidden sm:block">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ac-muted)]" />
          <input
            type="search"
            placeholder="Search…"
            className="h-9 w-56 rounded-lg border border-[var(--ac-border)] bg-[var(--ac-background)] py-1 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ac-primary)]/30"
          />
        </label>
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--ac-muted)] hover:bg-[var(--ac-background)]"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
        <div
          className="flex size-9 items-center justify-center rounded-full bg-[var(--ac-primary)] text-xs font-semibold text-white"
          aria-hidden
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
