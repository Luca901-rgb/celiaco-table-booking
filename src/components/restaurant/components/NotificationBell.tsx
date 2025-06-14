
import { useState } from 'react';
import { Bell, BellRing, X, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateBookingStatus } from '@/hooks/useBookings';

export const NotificationBell = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications(user?.id || '');
  const updateBookingStatus = useUpdateBookingStatus();

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Se è una notifica di prenotazione, può gestirla direttamente
    if (notification.type === 'booking_request' && notification.data?.booking_id) {
      // Qui potresti navigare alla pagina delle prenotazioni o aprire un modal
      setIsOpen(false);
    }
  };

  const handleQuickAction = (bookingId: string, action: 'confirm' | 'reject') => {
    const status = action === 'confirm' ? 'confirmed' : 'cancelled';
    updateBookingStatus.mutate({ bookingId, status });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-green-600" />
        ) : (
          <Bell className="w-5 h-5 text-gray-600" />
        )}
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Overlay per chiudere cliccando fuori */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <Card className="absolute right-0 top-full mt-2 w-80 z-50 max-h-96 overflow-hidden shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Notifiche</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        !notification.read ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      
                      {/* Azioni rapide per le prenotazioni */}
                      {notification.type === 'booking_request' && 
                       notification.data?.booking_id && 
                       !notification.read && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAction(notification.data.booking_id, 'confirm');
                              markAsRead(notification.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 h-auto"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Conferma
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAction(notification.data.booking_id, 'reject');
                              markAsRead(notification.id);
                            }}
                            className="text-xs px-3 py-1 h-auto"
                          >
                            Rifiuta
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Nessuna notifica</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
