import Image from "next/image";
import { cn } from "@/lib/cn";
import { brand } from "@/brand";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ size = 40, className, priority }: LogoProps) {
  return (
    <Image
      src={brand.logoUrl}
      alt={brand.shortName}
      width={size}
      height={size}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
