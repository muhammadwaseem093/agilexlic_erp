import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { brand } from "@/brand";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-sidebar via-brand-deep to-primary p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-white p-1.5">
            <Logo size={40} priority />
          </span>
          <p className="text-2xl font-semibold tracking-tight">{brand.name}</p>
        </div>
        <div>
          <p className="max-w-md text-3xl font-semibold leading-tight">{brand.tagline}</p>
          <p className="mt-4 max-w-md text-sm text-white/80">{brand.description}</p>
        </div>
        <div>
          <div className="ac-brand-rule mb-4 w-40 rounded-full" />
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} {brand.publisher}
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-6">
        <Card className="w-full max-w-md py-8 shadow-lg">
          <CardContent className="px-8">
            <div className="mb-6 flex justify-center">
              <Logo size={88} priority />
            </div>
            <h1 className="text-center text-xl font-semibold">Sign in</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Welcome back. Continue to your {brand.shortName} workspace.
            </p>
            <Button asChild size="lg" className="mt-8 w-full">
              <a href={process.env.NEXT_PUBLIC_FRAPPE_DESK_URL ?? "https://erp.agileclix.com"}>
                <FontAwesomeIcon icon={faArrowRightToBracket} />
                Sign in to {brand.shortName}
              </a>
            </Button>
            <Button asChild variant="link" className="mt-2 w-full">
              <Link href="/desk">Preview the new home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
