import { useState, useEffect } from "react";
import api from "@/lib/api";

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

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/me/unread");
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

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

