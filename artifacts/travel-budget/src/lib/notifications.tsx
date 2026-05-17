import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface AppNotification {
  id: string;
  type: "trip_saved" | "limit_warning" | "info";
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (message: string, type?: AppNotification["type"]) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAllRead: () => {},
  clearAll: () => {},
});

const STORAGE_KEY = "tb_notifications";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function loadNotifications(): AppNotification[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as AppNotification[];
    const cutoff = Date.now() - THIRTY_DAYS;
    return stored.filter((n) => n.timestamp > cutoff);
  } catch {
    return [];
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function addNotification(message: string, type: AppNotification["type"] = "info") {
    const n: AppNotification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      message,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [n, ...prev].slice(0, 50));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
