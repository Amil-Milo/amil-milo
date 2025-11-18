import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
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

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/notifications/me/unread");
      setNotifications(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        setNotifications([]);
        return;
      }
      if (axiosError.code === 'ERR_NETWORK' || axiosError.response?.status === 502) {
        setNotifications([]);
        return;
      }
      if (axiosError.response?.status !== 403 && axiosError.response?.status !== 404) {
        console.error("Erro ao buscar notificações:", error);
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
      await api.patch(`/notifications/me/${notificationId}/read`);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  return {
    notifications,
    loading,
    markAsRead,
    refetch: fetchNotifications,
  };
}

