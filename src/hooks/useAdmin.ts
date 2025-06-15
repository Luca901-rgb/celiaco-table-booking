
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService, AdminStats } from '@/services/adminService';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Controlla se l'admin è già autenticato (semplice localStorage check)
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken === 'admin_authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await adminService.login(email, password);
      localStorage.setItem('admin_token', 'admin_authenticated');
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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
