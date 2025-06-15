
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const useNotifications = (userId: string) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!userId,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('User ID is required')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Sottoscrizione in tempo reale con gestione corretta del canale
  useEffect(() => {
    if (!userId) return;

    // Pulisci il canale precedente se esiste
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Crea un nuovo canale con un nome unico
    const channelName = `notifications_${userId}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          // Aggiorna la cache
          queryClient.setQueryData(['notifications', userId], (old: Notification[] | undefined) => {
            return [newNotification, ...(old || [])];
          });

          // Mostra toast notification solo se l'utente non è nella pagina notifiche
          if (!window.location.pathname.includes('/notifications')) {
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      );

    // Sottoscrivi il canale
    channel.subscribe();
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, queryClient]);

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!notificationId) throw new Error('Notification ID is required');
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: (_, notificationId) => {
      // Aggiorna la cache localmente per un'esperienza più fluida
      queryClient.setQueryData(['notifications', userId], (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        );
      });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la notifica",
        variant: "destructive"
      });
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead: markAsReadMutation.mutate
  };
};
