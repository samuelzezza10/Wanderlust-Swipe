import { useEffect } from "react";
import { useClerk } from "@clerk/react";
import { Link } from "wouter";
import { Plane, Compass, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function DesktopNav() {
  const { signOut } = useClerk();

  return (
    <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-card border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary" data-testid="link-home">
        <Plane className="w-6 h-6" />
        <span>TravelBudget</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link href="/discover" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors" data-testid="link-discover">
          <Compass className="w-5 h-5" />
          <span>Discover</span>
        </Link>
        <Link href="/saved" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors" data-testid="link-saved">
          <Heart className="w-5 h-5" />
          <span>Saved</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors" data-testid="link-profile">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => signOut({ redirectUrl: basePath || "/" })} className="text-muted-foreground" data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </nav>
  );
}
