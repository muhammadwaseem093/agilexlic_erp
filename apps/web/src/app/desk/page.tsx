import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBoxOpen,
  faFileInvoiceDollar,
  faTableCellsLarge,
  faUsers,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { AppShell } from "@/components/shell/AppShell";
import { GatewayStatusToast } from "@/components/feedback/GatewayStatusToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gatewayFetch, healthSchema } from "@/lib/api";
import { brand } from "@/brand";

const kpis: { label: string; value: string; icon: IconDefinition; hint: string }[] = [
  { label: "Customers", value: "—", icon: faUsers, hint: "Connect gateway auth" },
  { label: "Open orders", value: "—", icon: faBoxOpen, hint: "Sales module" },
  { label: "Invoices due", value: "—", icon: faFileInvoiceDollar, hint: "Accounting" },
];

async function getGatewayStatus(): Promise<string> {
  try {
    const health = await gatewayFetch("/health", healthSchema);
    return health.success ? (health.data?.status ?? "ok") : "error";
  } catch {
    return "unreachable";
  }
}

export default async function DeskPage() {
  const gatewayStatus = await getGatewayStatus();
  const reachable = gatewayStatus !== "unreachable" && gatewayStatus !== "error";

  return (
    <AppShell title="Desk">
      <GatewayStatusToast reachable={reachable} />

      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-sidebar via-brand-deep to-primary p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-white/80">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{brand.shortName} workspace</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Your command center. Modules, records, and workflows appear here as they come online.
        </p>
        <div className="ac-brand-rule absolute inset-x-0 bottom-0" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map(({ label, value, icon, hint }) => (
          <Card key={label} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                <FontAwesomeIcon icon={icon} />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform status</CardTitle>
            <CardDescription>Services behind this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">API gateway</dt>
                <dd>
                  <Badge variant={reachable ? "success" : "destructive"}>{gatewayStatus}</Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">ERP engine</dt>
                <dd>{brand.platformName}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
            <CardDescription>Jump into your work</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <a
                href={process.env.NEXT_PUBLIC_FRAPPE_DESK_URL ?? "https://erp.agileclix.com/desk"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Full {brand.shortName} workspace
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/apps">
                <FontAwesomeIcon icon={faTableCellsLarge} />
                Browse apps
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
