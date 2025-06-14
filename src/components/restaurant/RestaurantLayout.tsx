
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
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-green-800">
                Pannello Ristorante
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] overflow-y-auto">
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

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
