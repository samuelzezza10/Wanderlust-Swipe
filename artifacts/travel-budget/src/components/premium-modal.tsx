import { useAuth } from "@clerk/react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, X, Zap, SlidersHorizontal, Sparkles,
  Check, Star, Shield, Infinity,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useUpgradeSubscription, useGetUsage } from "@workspace/api-client-react";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  const { t } = useI18n();
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();

  const { data: usage, refetch } = useGetUsage({ query: { enabled: !!isSignedIn, queryKey: ["usage"] } });
  const upgradeSubscription = useUpgradeSubscription();

  const isPremium = usage?.isPremium ?? false;

  const handleUpgrade = () => {
    upgradeSubscription.mutate(undefined, {
      onSuccess: () => { refetch(); onClose(); },
    });
  };

  const PERKS = [
    { icon: <Zap className="w-4 h-4" />, title: "80 ricerche al giorno", sub: "vs 20 nel piano Free" },
    { icon: <Infinity className="w-4 h-4" />, title: t.premium.benefit1 },
    { icon: <SlidersHorizontal className="w-4 h-4" />, title: t.premium.benefit2 },
    { icon: <Sparkles className="w-4 h-4" />, title: t.premium.benefit3 },
    { icon: <Star className="w-4 h-4" />, title: "Risultati AI prioritari", sub: "Hotel e voli migliori in cima" },
    { icon: <Shield className="w-4 h-4" />, title: "Nessuna pubblicità" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative bg-background rounded-t-3xl px-6 pb-10 pt-6 shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-5" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Hero */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-primary flex items-center justify-center shadow-lg mb-3">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-center">{t.premium.title}</h2>
              <p className="text-sm text-muted-foreground text-center mt-1 max-w-xs">
                {isPremium ? "Sei già un membro Premium 🎉" : "Sblocca tutto per soli €3/mese"}
              </p>
            </div>

            {/* Free vs Premium */}
            <div className="flex gap-3 mb-5">
              <div className="flex-1 rounded-2xl border border-border bg-muted/40 p-3 text-center">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Free</p>
                <p className="text-3xl font-black">20</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.premium.perDay}</p>
              </div>
              <div className="relative flex-1 rounded-2xl border-2 border-primary bg-primary/5 p-3 text-center overflow-hidden">
                {!isPremium && (
                  <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    €3/mese
                  </span>
                )}
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Premium</p>
                <p className="text-3xl font-black text-primary">80</p>
                <p className="text-[11px] text-primary/70 mt-0.5">{t.premium.perDay}</p>
              </div>
            </div>

            {/* Perks list */}
            <div className="space-y-2.5 mb-6">
              {PERKS.map((p, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-tight">{p.title}</p>
                    {p.sub && <p className="text-[11px] text-muted-foreground">{p.sub}</p>}
                  </div>
                  <Check className="w-4 h-4 text-primary shrink-0" />
                </div>
              ))}
            </div>

            {isPremium ? (
              <div className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 rounded-2xl py-4 mb-3">
                <Crown className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary">Piano Premium attivo</span>
              </div>
            ) : !isSignedIn ? (
              <>
                <button
                  onClick={() => { onClose(); setLocation("/sign-up"); }}
                  className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(30,75,204,0.35)] hover:opacity-90 active:scale-95 transition-all mb-3"
                >
                  Registrati — poi scegli Premium
                </button>
                <p className="text-center text-xs text-muted-foreground">{t.premium.ctaSub}</p>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpgrade}
                  disabled={upgradeSubscription.isPending}
                  className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(30,75,204,0.35)] hover:opacity-90 active:scale-95 transition-all mb-3 disabled:opacity-60"
                >
                  {upgradeSubscription.isPending ? "..." : `${t.premium.cta} — ${t.premium.price}`}
                </button>
                <p className="text-center text-xs text-muted-foreground">{t.premium.ctaSub}</p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
