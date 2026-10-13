import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-[var(--ac-sidebar)] p-12 text-white lg:flex">
        <div>
          <p className="text-2xl font-semibold">AgileClix ERP</p>
          <p className="mt-1 text-sm text-slate-400">Published by ZentoriLabs</p>
        </div>
        <div>
          <p className="text-3xl font-semibold leading-tight">Work Smarter.<br />Grow Faster.</p>
          <p className="mt-4 max-w-md text-sm text-slate-400">
            Modern ERP for sales, inventory, accounting, and operations — powered by ERPNext under the hood.
          </p>
        </div>
        <p className="text-xs text-slate-500">© ZentoriLabs</p>
      </div>
      <div className="flex flex-1 items-center justify-center bg-[var(--ac-background)] px-6">
        <div className="w-full max-w-md rounded-2xl border border-[var(--ac-border)] bg-[var(--ac-surface)] p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--ac-primary)] text-lg font-bold text-white">
              AC
            </div>
          </div>
          <h1 className="text-center text-xl font-semibold">Sign in</h1>
          <p className="mt-2 text-center text-sm text-[var(--ac-muted)]">
            SSO and password login ship in Phase 3. Use classic Desk for full ERP access today.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_FRAPPE_DESK_URL ?? "https://erp.agileclix.com"}
            className="mt-8 flex w-full items-center justify-center rounded-lg bg-[var(--ac-primary)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
          >
            Continue to ERP login
          </a>
          <Link
            href="/desk"
            className="mt-3 block text-center text-sm font-medium text-[var(--ac-primary)]"
          >
            Preview AgileClix desk
          </Link>
        </div>
      </div>
    </div>
  );
}
