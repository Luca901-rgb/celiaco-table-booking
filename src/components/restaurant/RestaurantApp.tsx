
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurantService';
import RestaurantLayout from './RestaurantLayout';
import RestaurantOnboarding from './onboarding/RestaurantOnboarding';
import DashboardPage from './pages/DashboardPage';
import ProfileManagement from './pages/ProfileManagement';
import MenuManagement from './pages/MenuManagement';
import MediaManagement from './pages/MediaManagement';
import BookingManagement from './pages/BookingManagement';
import ReviewsManagement from './pages/ReviewsManagement';

const RestaurantApp = () => {
  const { user } = useAuth();

  if (!user || user.type !== 'restaurant') {
    return <Navigate to="/" replace />;
  }

  // Verifica se il ristorante esiste nel database
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', user.id],
    queryFn: () => restaurantService.getRestaurantByOwnerId(user.id),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-green-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Se il ristorante non esiste, mostra l'onboarding
  if (!restaurant) {
    return <RestaurantOnboarding />;
  }

  return (
    <RestaurantLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/media" element={<MediaManagement />} />
        <Route path="/bookings" element={<BookingManagement />} />
        <Route path="/reviews" element={<ReviewsManagement />} />
        <Route path="*" element={<Navigate to="/restaurant/dashboard" replace />} />
      </Routes>
    </RestaurantLayout>
  );
};

export default RestaurantApp;
