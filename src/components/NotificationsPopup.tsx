import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Loader2, CheckCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export function NotificationsPopup() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications", "me"],
    queryFn: async () => {
      const data = await notificationsApi.getNotifications();
      return data.map((notif: any) => ({
        ...notif,
        createdAt: new Date(notif.createdAt),
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "count"],
    queryFn: async () => {
      const data = await notificationsApi.getNotificationCount();
      return data.unread || 0;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Todas as notificações foram marcadas como lidas");
    },
  });

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsReadMutation.mutate();
  };

  const recentNotifications = notifications.slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const hasUnread = unreadNotifications.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
          title="Notificações"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex flex-col max-h-[600px]">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Notificações
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </h3>
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="h-auto p-1"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma notificação
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 transition-colors cursor-pointer hover:bg-accent/50",
                      !notification.isRead && "bg-primary/5"
                    )}
                    onClick={() => {
                      if (!notification.isRead) {
                        handleMarkAsRead(notification.id, {
                          stopPropagation: () => {},
                        } as React.MouseEvent);
                      }
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={cn(
                              "font-medium text-sm truncate",
                              !notification.isRead && "text-primary"
                            )}
                          >
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {recentNotifications.length > 0 && (
            <div className="p-3 border-t border-border">
              <Link
                to="/notificacoes"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas as notificações
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

