
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
    { path: '/restaurant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/restaurant/profile', icon: Settings, label: 'Profilo Ristorante' },
    { path: '/restaurant/menu', icon: Menu, label: 'Gestione Menù' },
    { path: '/restaurant/media', icon: Image, label: 'Foto e Video' },
    { path: '/restaurant/bookings', icon: Calendar, label: 'Prenotazioni' },
    { path: '/restaurant/reviews', icon: Star, label: 'Recensioni' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex">
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-green-200 shadow-lg transition-all duration-300 flex flex-col",
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
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default RestaurantLayout;
