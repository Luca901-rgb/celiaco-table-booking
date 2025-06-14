
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NotificationBell } from './components/NotificationBell';
import {
  LayoutDashboard,
  Calendar,
  Menu,
  Star,
  Settings,
  Image,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RestaurantLayoutProps {
  children: ReactNode;
}

const RestaurantLayout = ({ children }: RestaurantLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = () => {
    // Implementa la logica di logout qui
    // Per ora navighiamo alla pagina di login
    navigate('/');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/restaurant',
      icon: LayoutDashboard,
    },
    {
      name: 'Prenotazioni',
      href: '/restaurant/bookings',
      icon: Calendar,
    },
    {
      name: 'Menu',
      href: '/restaurant/menu',
      icon: Menu,
    },
    {
      name: 'Media',
      href: '/restaurant/media',
      icon: Image,
    },
    {
      name: 'Recensioni',
      href: '/restaurant/reviews',
      icon: Star,
    },
    {
      name: 'Profilo',
      href: '/restaurant/profile',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-green-800">
                Pannello Ristorante
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <NotificationBell />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-green-200 text-green-700 hover:bg-green-50 hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-green-200 text-green-700 hover:bg-green-50 sm:hidden"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <nav className="hidden lg:block w-64 bg-white shadow-sm h-[calc(100vh-4rem)] overflow-y-auto fixed left-0 top-16 z-30">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-green-100 text-green-800'
                          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content - Full width on mobile, with sidebar space on desktop */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-4">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 z-40">
        <div className="grid grid-cols-6 gap-1 p-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-medium transition-colors min-h-[60px]',
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] leading-tight text-center">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default RestaurantLayout;
