
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService, AdminStats } from '@/services/adminService';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Controlla se l'admin è già autenticato
    const adminToken = localStorage.getItem('admin_token');
    console.log('Admin token check:', adminToken);
    if (adminToken === 'admin_authenticated') {
      console.log('Setting authenticated to true from localStorage');
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt started');
    setIsLoading(true);
    try {
      const result = await adminService.login(email, password);
      console.log('Login service result:', result);
      localStorage.setItem('admin_token', 'admin_authenticated');
      console.log('Token set in localStorage');
      setIsAuthenticated(true);
      console.log('Authentication state set to true');
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Admin logout');
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  console.log('useAdminAuth state:', { isAuthenticated, isLoading });
  
  return { isAuthenticated, isLoading, login, logout };
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getAdminStats,
    refetchInterval: 30000, // Aggiorna ogni 30 secondi
  });
};
