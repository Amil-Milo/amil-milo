import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bell, Loader2, CheckCheck, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";
import { formatNotificationType } from "@/lib/notificationUtils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export default function Notificacoes() {
  const queryClient = useQueryClient();
  const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null);

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

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notificação excluída com sucesso");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao excluir notificação");
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationToDelete(id);
  };

  const confirmDelete = () => {
    if (notificationToDelete) {
      deleteNotificationMutation.mutate(notificationToDelete);
      setNotificationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setNotificationToDelete(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12 px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
        <Card className="p-4 md:p-6 mb-4 md:mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3 flex items-center gap-2 md:gap-3">
                <Bell className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                Notificações
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Mantenha-se atualizado sobre seu programa de cuidado
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
                disabled={markAllAsReadMutation.isPending}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </Card>

        {notifications.length === 0 ? (
          <Card className="p-8 md:p-12 text-center border-2 border-primary/20 shadow-lg rounded-xl">
            <Bell className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4 opacity-50" />
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
              Nenhuma notificação
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Você não possui notificações no momento.
            </p>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "p-4 md:p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-md relative",
                  notification.isRead
                    ? "border-border"
                    : "border-primary/30 bg-primary/5 shadow-sm"
                )}
                onClick={() => {
                  if (!notification.isRead) {
                    handleMarkAsRead(notification.id);
                  }
                }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-70 hover:opacity-100"
                  onClick={(e) => handleDeleteNotification(notification.id, e)}
                  disabled={deleteNotificationMutation.isPending}
                >
                  {deleteNotificationMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </Button>
                <div className="flex items-start justify-between gap-3 md:gap-4 pr-8">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <h3
                        className={cn(
                          "text-sm sm:text-base md:text-lg font-semibold break-words",
                          notification.isRead
                            ? "text-foreground"
                            : "text-primary"
                        )}
                      >
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-2 md:mb-3 break-words">
                      {notification.message}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs w-fit">
                        {formatNotificationType(notification.type)}
                      </Badge>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={notificationToDelete !== null} onOpenChange={(open) => {
          if (!open) {
            setNotificationToDelete(null);
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Notificação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteNotificationMutation.isPending}
              >
                {deleteNotificationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

