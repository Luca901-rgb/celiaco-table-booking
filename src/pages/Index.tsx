
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AuthPage from '@/components/auth/AuthPage';
import ClientApp from '@/components/client/ClientApp';
import RestaurantApp from '@/components/restaurant/RestaurantApp';
import { AuthProvider } from '@/contexts/AuthContext';

const Index = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/client/*" element={<ClientApp />} />
          <Route path="/restaurant/*" element={<RestaurantApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default Index;
