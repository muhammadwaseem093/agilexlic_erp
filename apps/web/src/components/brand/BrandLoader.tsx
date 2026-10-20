import { cn } from "@/lib/cn";
import { Logo } from "@/components/brand/Logo";

type BrandLoaderProps = {
  size?: number;
  label?: string;
  className?: string;
};

/** Brand logo with a spinning progress ring; matches the Desk loader. */
export function BrandLoader({ size = 96, label = "Loading", className }: BrandLoaderProps) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="ac-loader-ring absolute inset-0 rounded-full" aria-hidden />
        <Logo size={Math.round(size * 0.62)} priority className="animate-pulse" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}…</span>
    </div>
  );
}
