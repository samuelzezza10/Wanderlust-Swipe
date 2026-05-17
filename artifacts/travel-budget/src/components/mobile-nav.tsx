import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Compass, Heart, User, Bell, X, Trash2, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useNotifications } from "@/lib/notifications";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumModal } from "./premium-modal";

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative bg-card rounded-t-3xl max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b">
          <h3 className="font-bold text-base">
            {t.notifications.title}
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">
                {unreadCount}
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary font-semibold"
                  >
                    {t.notifications.markRead}
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">{t.notifications.empty}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl transition-colors",
                    n.read ? "bg-muted/40" : "bg-primary/8 border border-primary/15"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm",
                    n.type === "trip_saved" ? "bg-green-100 text-green-600" :
                    n.type === "limit_warning" ? "bg-orange-100 text-orange-600" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    {n.type === "trip_saved" ? "✈️" : n.type === "limit_warning" ? "⚠️" : "ℹ️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-snug", !n.read && "font-semibold")}>
                      {n.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="h-safe-area-inset-bottom" />
      </motion.div>
    </motion.div>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  const { t } = useI18n();
  const { unreadCount } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const currentPath = location.replace(basePath, "") || "/";

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 pb-safe">
        <div className="flex justify-around items-center h-16">

          {/* Discover */}
          <Link
            href="/discover"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              currentPath.startsWith("/discover") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            data-testid="mobile-nav-discover"
          >
            <Compass className="w-6 h-6" />
            <span className="text-[10px] font-medium">{t.nav.discover}</span>
          </Link>

          {/* Premium crown — sits between Discover and Saved */}
          <button
            onClick={() => setPremiumOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors text-amber-500 hover:text-amber-400 relative"
            data-testid="mobile-nav-premium"
          >
            {/* Glow ring */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm scale-150" />
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-primary flex items-center justify-center shadow-md">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-[10px] font-semibold">Premium</span>
          </button>

          {/* Saved */}
          <Link
            href="/saved"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              currentPath.startsWith("/saved") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            data-testid="mobile-nav-saved"
          >
            <Heart className="w-6 h-6" />
            <span className="text-[10px] font-medium">{t.nav.saved}</span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              currentPath.startsWith("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            data-testid="mobile-nav-profile"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">{t.nav.profile}</span>
          </Link>

          {/* Bell */}
          <button
            onClick={() => setNotifOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <div className="relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{t.notifications.title}</span>
          </button>

        </div>
      </nav>

      <AnimatePresence>
        {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
      </AnimatePresence>

      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </>
  );
}
