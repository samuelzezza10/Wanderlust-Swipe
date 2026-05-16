import { Link, useLocation } from "wouter";
import { Compass, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function MobileNav() {
  const [location] = useLocation();
  const { t } = useI18n();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const currentPath = location.replace(basePath, "") || "/";

  const navItems = [
    { href: "/discover", icon: Compass, label: t.nav.discover },
    { href: "/saved", icon: Heart, label: t.nav.saved },
    { href: "/profile", icon: User, label: t.nav.profile },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              data-testid={`mobile-nav-${item.href.replace("/", "")}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
