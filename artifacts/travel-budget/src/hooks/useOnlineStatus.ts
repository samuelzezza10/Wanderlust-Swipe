import { useState, useEffect, useCallback, useRef } from "react";

const PING_URL = "/api/healthz";
const PING_TIMEOUT_MS = 5_000;
const POLL_INTERVAL_MS = 30_000;

async function pingServer(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
    const res = await fetch(PING_URL, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const pingInFlight = useRef(false);

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    if (pingInFlight.current) return isOnline;
    pingInFlight.current = true;
    try {
      if (!navigator.onLine) {
        setIsOnline(false);
        return false;
      }
      const reachable = await pingServer();
      setIsOnline(reachable);
      return reachable;
    } finally {
      pingInFlight.current = false;
    }
  }, [isOnline]);

  useEffect(() => {
    const handleOnline = () => {
      checkConnectivity();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(() => {
      if (navigator.onLine) checkConnectivity();
    }, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [checkConnectivity]);

  return { isOnline, checkConnectivity };
}
