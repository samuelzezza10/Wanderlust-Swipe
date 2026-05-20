import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Zap, Shield, Heart, Mail, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function LandingPage() {
  const { t } = useI18n();
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-hidden relative bg-[hsl(215,85%,48%)]">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex justify-end p-4">
        <LanguageSwitcher />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">

        {/* Floating icon trio */}
        <motion.div
          className="flex items-end gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Plane className="w-7 h-7 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg"
          >
            <Hotel className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Zap className="w-7 h-7 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span className="text-white">Travel</span>
          <span className="text-[hsl(25,90%,70%)]">Budget</span>
        </motion.h1>

        <motion.p
          className="text-white/85 text-base max-w-xs mx-auto mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {t.landing.subtitle}
        </motion.p>

        {/* Site description */}
        <motion.p
          className="text-white/60 text-sm max-w-xs mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Scorri le offerte, salva i viaggi che ti piacciono e confronta voli, treni e hotel in un colpo solo. Tutto gratis, nessuna registrazione obbligatoria.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {[
            { icon: Zap, label: t.landing.featureAI },
            { icon: Shield, label: t.landing.featureFree },
            { icon: Heart, label: t.landing.featureSave },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col w-full max-w-xs gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {isSignedIn ? (
            /* ── Signed-in state ── */
            <>
              <Link href="/discover" className="w-full">
                <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[hsl(25,90%,55%)] text-white font-bold text-base shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:bg-[hsl(25,90%,50%)] active:scale-[0.98] transition-all">
                  <Plane className="w-5 h-5" />
                  {t.landing.continueAsGuest !== "Continua come ospite" ? "Esplora i viaggi" : "Esplora i viaggi"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </Link>
              <Link href="/saved" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/15 backdrop-blur-sm text-white font-semibold text-sm border border-white/30 hover:bg-white/25 active:scale-[0.98] transition-all">
                  <Heart className="w-4 h-4" />
                  I miei viaggi salvati
                </button>
              </Link>
              <Link href="/profile" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white/80 font-semibold text-sm border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all">
                  Il mio profilo
                </button>
              </Link>
            </>
          ) : (
            /* ── Signed-out state ── */
            <>
              {/* Google login */}
              <Link href="/sign-in" className="w-full">
                <button
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white text-zinc-800 font-bold text-base shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:bg-zinc-50 active:scale-[0.98] transition-all border border-white/60"
                  data-testid="button-google-login"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Accedi con Google
                </button>
              </Link>

              {/* Email login */}
              <Button
                asChild
                size="lg"
                className="w-full bg-[hsl(25,90%,55%)] hover:bg-[hsl(25,90%,50%)] text-white font-bold text-base shadow-[0_6px_20px_rgba(0,0,0,0.2)] border-0"
                data-testid="button-get-started"
              >
                <Link href="/sign-in">
                  <Mail className="w-4 h-4 mr-2" />
                  Accedi con email
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/40 text-white hover:bg-white/15 hover:text-white font-semibold bg-white/10 backdrop-blur-sm"
                data-testid="button-login"
              >
                <Link href="/sign-in">{t.landing.logIn}</Link>
              </Button>

              <Button
                asChild
                variant="link"
                className="text-white/70 hover:text-white text-sm"
                data-testid="button-guest-mode"
              >
                <Link href="/discover">{t.landing.continueAsGuest}</Link>
              </Button>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer links */}
      <div className="relative z-10 pb-6 flex justify-center gap-4 text-xs text-white/40">
        <Link href="/privacy" className="hover:text-white/70 transition-colors">{t.legal.privacyPolicy}</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-white/70 transition-colors">{t.legal.termsOfService}</Link>
      </div>
    </div>
  );
}
