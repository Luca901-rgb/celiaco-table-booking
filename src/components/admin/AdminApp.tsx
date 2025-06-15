
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdmin';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AdminApp = () => {
  const { isAuthenticated } = useAdminAuth();

  console.log('AdminApp render - isAuthenticated:', isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </QueryClientProvider>
  );
};

export default AdminApp;
