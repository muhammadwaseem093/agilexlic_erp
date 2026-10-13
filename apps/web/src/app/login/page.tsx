import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ac-background)] px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--ac-border)] bg-[var(--ac-surface)] p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Sign in to AgileClix ERP</h1>
        <p className="mt-2 text-sm text-[var(--ac-muted)]">
          Session proxy login lands in Phase 3. Until then, administrators can use Frappe Desk on the
          ERP host.
        </p>
        <Link
          href="/desk"
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[var(--ac-primary)] px-4 py-2 text-sm font-medium text-white"
        >
          Continue to desk preview
        </Link>
      </div>
    </div>
  );
}
