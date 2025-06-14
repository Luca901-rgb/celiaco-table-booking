
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RestaurantLayout from './RestaurantLayout';
import RestaurantOnboarding from './onboarding/RestaurantOnboarding';
import DashboardPage from './pages/DashboardPage';
import ProfileManagement from './pages/ProfileManagement';
import MenuManagement from './pages/MenuManagement';
import MediaManagement from './pages/MediaManagement';
import BookingManagement from './pages/BookingManagement';
import ReviewsManagement from './pages/ReviewsManagement';

const RestaurantApp = () => {
  const { user, profile } = useAuth();

  if (!user || user.type !== 'restaurant') {
    return <Navigate to="/" replace />;
  }

  // Se il profilo non è completo, mostra l'onboarding
  if (!profile?.profileComplete) {
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
