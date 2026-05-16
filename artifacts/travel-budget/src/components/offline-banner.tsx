import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

interface OfflineBannerProps {
  isOnline: boolean;
  onRetry?: () => Promise<boolean>;
}

export function OfflineBanner({ isOnline, onRetry }: OfflineBannerProps) {
  const { t } = useI18n();
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    if (!onRetry || retrying) return;
    setRetrying(true);
    await onRetry();
    setRetrying(false);
  }

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline-banner"
          initial={{ y: -52, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -52, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 320 }}
          className="fixed top-0 left-0 right-0 z-[350] bg-orange-500 text-white px-4 py-2.5 flex items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{t.offline.banner}</span>
          </div>
          {onRetry && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all disabled:opacity-50"
              aria-label="Retry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
