import { AppShell } from "@/components/shell/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
          <li key={name}>
            <Card className="py-4">
              <CardContent className="flex items-center justify-between px-4 text-sm font-medium">
                {name}
                <Badge variant="secondary">Coming soon</Badge>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
