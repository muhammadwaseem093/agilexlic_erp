import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TopbarProps = {
  title: string;
  userInitials?: string;
};

export function Topbar({ title, userInitials = "AC" }: TopbarProps) {
  return (
    <header
      className="flex h-14 items-center justify-between gap-4 border-b bg-card px-6"
    >
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <label className="relative hidden sm:block">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search…" className="w-56 pl-9" />
        </label>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5 text-muted-foreground" />
        </Button>
        <div
          className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
          aria-hidden
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
