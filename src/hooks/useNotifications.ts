import { useState, useEffect, useCallback } from "react";
import { notificationsApi } from "@/lib/api";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  linkUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const getDismissedNotifications = (): number[] => {
    if (typeof window === "undefined") return [];
    const dismissed = localStorage.getItem("milo_seen_notifications");
    if (!dismissed) return [];
    try {
      return JSON.parse(dismissed);
    } catch {
      return [];
    }
  };

  const saveDismissedNotification = (id: number) => {
    if (typeof window === "undefined") return;
    const dismissed = getDismissedNotifications();
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem(
        "milo_seen_notifications",
        JSON.stringify(dismissed)
      );
    }
  };

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const response = await notificationsApi.getNotifications();
      const allNotifications = response.data || response || [];

      const dismissedIds = getDismissedNotifications();

      const filteredNotifications = allNotifications.filter(
        (notif: Notification) => !dismissedIds.includes(notif.id)
      );

      setNotifications(filteredNotifications);
    } catch (error: any) {
      if (
        error.response?.status !== 401 &&
        error.code !== "ERR_NETWORK" &&
        error.response?.status !== 502
      ) {
        console.error("Error fetching notifications:", error);
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications();

    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchNotifications();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated, authLoading, fetchNotifications]);

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationsApi.markAsRead(notificationId);
    } catch (error) {
      // Continue even if API call fails
    }

    saveDismissedNotification(notificationId);

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return {
    notifications,
    loading,
    markAsRead,
    refetch: fetchNotifications,
  };
}
