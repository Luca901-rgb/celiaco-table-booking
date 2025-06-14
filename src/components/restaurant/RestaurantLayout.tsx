
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Settings, 
  Menu, 
  Image, 
  Calendar, 
  Star, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestaurantLayoutProps {
  children: ReactNode;
}

const RestaurantLayout = ({ children }: RestaurantLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { path: '/restaurant/dashboard', icon: LayoutDashboard, label: 'Dashboard', shortLabel: 'Home' },
    { path: '/restaurant/profile', icon: Settings, label: 'Profilo', shortLabel: 'Profilo' },
    { path: '/restaurant/menu', icon: Menu, label: 'Menù', shortLabel: 'Menù' },
    { path: '/restaurant/media', icon: Image, label: 'Media', shortLabel: 'Media' },
    { path: '/restaurant/bookings', icon: Calendar, label: 'Prenotazioni', shortLabel: 'Prenot.' },
    { path: '/restaurant/reviews', icon: Star, label: 'Recensioni', shortLabel: 'Recens.' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className={cn(
        "hidden md:flex bg-white border-r border-green-200 shadow-lg transition-all duration-300 flex-col",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-green-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-green-800 text-sm">{user?.name}</h2>
                  <p className="text-xs text-green-600">Dashboard Ristorante</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-green-600 hover:bg-green-50"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Button
              key={path}
              variant="ghost"
              onClick={() => navigate(path)}
              className={cn(
                "w-full justify-start h-auto py-3 transition-all duration-200",
                sidebarCollapsed ? "px-2" : "px-3",
                isActive(path)
                  ? "bg-green-100 text-green-700 border-r-2 border-green-600"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <Icon className={cn("w-5 h-5", sidebarCollapsed ? "" : "mr-3")} />
              {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-green-200">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start h-auto py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200",
              sidebarCollapsed ? "px-2" : "px-3"
            )}
          >
            <LogOut className={cn("w-5 h-5", sidebarCollapsed ? "" : "mr-3")} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Disconnetti</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 shadow-lg">
        <div className="grid grid-cols-6 gap-0 p-1">
          {navItems.map(({ path, icon: Icon, shortLabel }) => (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center h-14 px-1 py-1 transition-all duration-200",
                isActive(path)
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium leading-none">{shortLabel}</span>
            </Button>
          ))}
        </div>
        
        {/* Logout button for mobile */}
        <div className="border-t border-green-200 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Disconnetti</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLayout;
