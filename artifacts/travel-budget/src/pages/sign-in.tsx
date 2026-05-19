import { SignIn } from "@clerk/react";
import { Link } from "wouter";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Plane, Hotel, Train } from "lucide-react";
import { motion } from "framer-motion";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[hsl(215,85%,48%)] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <Link href="/">
          <span className="text-white font-black text-lg tracking-tight cursor-pointer">
            Travel<span className="text-[hsl(25,90%,70%)]">Budget</span>
          </span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Floating icons */}
      <div className="relative z-10 flex justify-center items-end gap-4 mt-6 mb-6">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <Plane className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg"
        >
          <Hotel className="w-7 h-7 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <Train className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Clerk widget in white card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 pb-10">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            appearance={{
              elements: {
                card: "shadow-none rounded-none w-full",
                rootBox: "w-full",
              },
            }}
          />
        </div>

        <p className="mt-6 text-white/60 text-xs text-center">
          <Link href="/privacy" className="hover:text-white/90 underline">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-white/90 underline">Termini</Link>
        </p>
      </div>
    </div>
  );
}
