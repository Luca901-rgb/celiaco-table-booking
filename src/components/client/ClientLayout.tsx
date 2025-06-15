
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Heart, User, Calendar, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id || '');

  const navItems = [
    { path: '/client/home', icon: Home, label: 'Home' },
    { path: '/client/map', icon: MapPin, label: 'Mappa' },
    { path: '/client/favorites', icon: Heart, label: 'Preferiti' },
    { path: '/client/profile', icon: User, label: 'Profilo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 ${
                    isActive 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6 mb-1" />
                    {item.path === '/client/profile' && unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold" style={{ fontSize: '8px' }}>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium truncate max-w-[60px]">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ClientLayout;
