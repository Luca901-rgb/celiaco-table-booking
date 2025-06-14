
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ClientLayout from './ClientLayout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import RestaurantDetail from './pages/RestaurantDetail';

const ClientApp = () => {
  const { user } = useAuth();

  if (!user || user.type !== 'client') {
    return <Navigate to="/" replace />;
  }

  return (
    <ClientLayout>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="*" element={<Navigate to="/client/home" replace />} />
      </Routes>
    </ClientLayout>
  );
};

export default ClientApp;
