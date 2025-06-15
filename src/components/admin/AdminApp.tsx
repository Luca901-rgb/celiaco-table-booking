
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdmin';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminApp = () => {
  const { isAuthenticated } = useAdminAuth();

  console.log('AdminApp render - isAuthenticated:', isAuthenticated);

  return (
    <>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </>
  );
};

export default AdminApp;
