
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { notifications, isLoading, unreadCount, markAsRead } = useNotifications(user?.id || '');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_request':
      case 'booking_confirmed':
      case 'booking_cancelled':
        return Calendar;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return 'bg-green-100 text-green-800';
      case 'booking_cancelled':
        return 'bg-red-100 text-red-800';
      case 'booking_request':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/client/profile">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Notifiche</h1>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div>Caricamento notifiche...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/client/profile">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Notifiche</h1>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-100 text-red-800 flex-shrink-0">
            {unreadCount} non {unreadCount === 1 ? 'letta' : 'lette'}
          </Badge>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessuna notifica
          </h3>
          <p className="text-gray-600">
            Le tue notifiche appariranno qui quando disponibili
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl mx-auto">
          {notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const isUnread = !notification.read;
            
            return (
              <Card 
                key={notification.id} 
                className={`transition-colors border-green-200 ${isUnread ? 'bg-green-50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 break-words ${isUnread ? 'text-gray-700' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), { 
                              addSuffix: true, 
                              locale: it 
                            })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isUnread && (
                            <>
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs whitespace-nowrap"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Letta
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
