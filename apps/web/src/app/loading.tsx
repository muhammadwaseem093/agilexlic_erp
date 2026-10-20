import { BrandLoader } from "@/components/brand/BrandLoader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <BrandLoader />
    </div>
  );
}
