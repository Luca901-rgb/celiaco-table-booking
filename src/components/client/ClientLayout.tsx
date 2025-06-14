
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Heart, User } from 'lucide-react';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/client/home', icon: Home, label: 'Home' },
    { path: '/client/map', icon: MapPin, label: 'Mappa' },
    { path: '/client/favorites', icon: Heart, label: 'Preferiti' },
    { path: '/client/profile', icon: User, label: 'Profilo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default ClientLayout;
