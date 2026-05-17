import { useEffect, useRef } from "react";
import { ClerkProvider, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { queryClient } from "./lib/queryClient";
import { LanguageProvider, useI18n } from "./lib/i18n";
import { NotificationsProvider } from "./lib/notifications";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { OfflineBanner } from "./components/offline-banner";

import { Layout } from "./components/layout";
import LandingPage from "./pages/landing";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import Onboarding from "./pages/onboarding";
import Discover from "./pages/discover";
import Saved from "./pages/saved";
import SavedDetail from "./pages/saved-detail";
import Profile from "./pages/profile";
import PrivacyPolicy from "./pages/privacy";
import TermsOfService from "./pages/terms";
import SurprisePage from "./pages/surprise";
import NotFound from "./pages/not-found";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(15 85% 55%)",
    colorForeground: "hsl(220 30% 15%)",
    colorMutedForeground: "hsl(220 15% 45%)",
    colorDanger: "hsl(0 84% 60%)",
    colorBackground: "hsl(0 0% 100%)",
    colorInput: "hsl(30 20% 85%)",
    colorInputForeground: "hsl(220 30% 15%)",
    colorNeutral: "hsl(30 20% 85%)",
    fontFamily: "Outfit, sans-serif",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl border border-[hsl(30,20%,90%)]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground font-bold",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    formFieldLabel: "text-foreground font-medium",
    footerActionLink: "text-primary font-bold hover:text-primary/90",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-green-600",
    alertText: "text-danger",
    logoBox: "",
    logoImage: "",
    socialButtonsBlockButton: "border-border hover:bg-muted",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
    formFieldInput: "bg-background border-border text-foreground",
    footerAction: "",
    dividerLine: "bg-border",
    alert: "bg-danger/10 border-danger text-danger",
    otpCodeFieldInput: "border-border",
    formFieldRow: "",
    main: "",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }: { user?: { id: string } | null }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function NetworkStatusManager() {
  const { isOnline, checkConnectivity } = useOnlineStatus();
  const { t } = useI18n();
  const prevOnlineRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevOnlineRef.current === false && isOnline) {
      toast.success(t.offline.reconnected, { duration: 3000 });
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, t.offline.reconnected]);

  return <OfflineBanner isOnline={isOnline} onRetry={checkConnectivity} />;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/discover" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to access your account",
          },
        },
        signUp: {
          start: {
            title: "Start your journey",
            subtitle: "Create an account to save trips",
          },
        },
      }}
      routerPush={(to: string) => setLocation(stripBase(to))}
      routerReplace={(to: string) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <NetworkStatusManager />
        <Layout>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/discover" component={Discover} />
            <Route path="/saved" component={Saved} />
            <Route path="/saved/:id" component={SavedDetail} />
            <Route path="/profile" component={Profile} />
            <Route path="/surprise" component={SurprisePage} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <LanguageProvider>
        <NotificationsProvider>
          <ClerkProviderWithRoutes />
        </NotificationsProvider>
      </LanguageProvider>
    </WouterRouter>
  );
}
