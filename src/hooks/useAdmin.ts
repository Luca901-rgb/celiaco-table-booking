
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
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt started');
    setIsLoading(true);
    try {
      await adminService.login(email, password);
      localStorage.setItem('admin_token', 'admin_authenticated');
      setIsAuthenticated(true);
      console.log('Login successful, token set');
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

  return { isAuthenticated, isLoading, login, logout };
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getAdminStats,
    refetchInterval: 30000, // Aggiorna ogni 30 secondi
  });
};
