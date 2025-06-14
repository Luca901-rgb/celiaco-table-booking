
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MapPin, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/client/home', icon: Home, label: 'Home' },
    { path: '/client/map', icon: MapPin, label: 'Mappa' },
    { path: '/client/favorites', icon: Heart, label: 'Preferiti' },
    { path: '/client/profile', icon: User, label: 'Profilo' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 shadow-lg">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg transition-all duration-200",
                isActive(path)
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive(path) && "scale-110"
                )} 
              />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ClientLayout;
