import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Compass, Map } from "lucide-react";

export default function LandingPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center px-4 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <Plane className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Wanderlust made effortless
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10">
        Swipe through curated trip suggestions like a glossy travel magazine. Find your next adventure on a whim.
      </p>

      <div className="flex flex-col sm:flex-row w-full max-w-sm gap-4">
        <Button asChild size="lg" className="w-full text-md font-medium" data-testid="button-get-started">
          <Link href="/sign-up">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full text-md font-medium" data-testid="button-login">
          <Link href="/sign-in">Log In</Link>
        </Button>
      </div>
      
      <div className="mt-8">
        <Button asChild variant="link" data-testid="button-guest-mode">
          <Link href="/discover">Continue as Guest</Link>
        </Button>
      </div>
    </div>
  );
}
