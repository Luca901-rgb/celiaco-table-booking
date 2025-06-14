
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { ClientProfile, RestaurantProfile } from '@/types';
import { UserProfile } from '@/types/supabase';

// Creazione di un tipo User personalizzato che estende quello di Supabase
interface AppUser extends User {
  name?: string;
  type?: 'client' | 'restaurant';
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  profile: ClientProfile | RestaurantProfile | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string, type: 'client' | 'restaurant') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateProfile: (data: Partial<ClientProfile | RestaurantProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const createDefaultProfile = (user: User, userType: 'client' | 'restaurant'): ClientProfile | RestaurantProfile => {
  const baseProfile = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    type: userType,
    profileComplete: false,
    createdAt: new Date()
  };

  if (userType === 'restaurant') {
    return {
      ...baseProfile,
      type: 'restaurant',
      address: '',
      phone: '',
      description: '',
      website: '',
      coverImage: '',
      openingHours: {},
      certifications: [],
      cuisineType: [],
      priceRange: 'medium',
      latitude: 0,
      longitude: 0
    } as RestaurantProfile;
  } else {
    return {
      ...baseProfile,
      type: 'client',
      phone: '',
      address: '',
      allergies: [],
      favoriteRestaurants: []
    } as ClientProfile;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ClientProfile | RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string): Promise<ClientProfile | RestaurantProfile | null> => {
    try {
      console.log('Loading user profile for:', userId);
      const { data: userProfile, error } = await supabase
        .from('userprofiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (userProfile) {
        console.log('User profile loaded:', userProfile);
        const baseProfile = {
          id: userProfile.id,
          email: userProfile.email,
          name: `${userProfile.first_name} ${userProfile.last_name}`.trim(),
          type: userProfile.user_type as 'client' | 'restaurant',
          profileComplete: true,
          createdAt: new Date()
        };

        if (userProfile.user_type === 'restaurant') {
          return {
            ...baseProfile,
            type: 'restaurant',
            address: userProfile.address || '',
            phone: userProfile.phone || '',
            description: '',
            website: '',
            coverImage: '',
            openingHours: {},
            certifications: [],
            cuisineType: [],
            priceRange: 'medium',
            latitude: 0,
            longitude: 0
          } as RestaurantProfile;
        } else {
          return {
            ...baseProfile,
            type: 'client',
            phone: userProfile.phone,
            address: userProfile.address,
            allergies: [],
            favoriteRestaurants: []
          } as ClientProfile;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const initializeAuth = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Existing session found:', session.user.id);
          setSession(session);
          
          // Imposta immediatamente l'utente con i dati di base
          const basicUser: AppUser = {
            ...session.user,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            type: session.user.user_metadata?.user_type || 'client'
          };
          setUser(basicUser);
          
          // Prova a caricare il profilo completo, ma non bloccare l'app se fallisce
          try {
            const userProfile = await loadUserProfile(session.user.id);
            if (userProfile) {
              setProfile(userProfile);
              setUser(prev => ({
                ...prev!,
                name: userProfile.name,
                type: userProfile.type
              }));
            } else {
              // Crea un profilo di default se non esiste
              const defaultProfile = createDefaultProfile(session.user, basicUser.type);
              setProfile(defaultProfile);
            }
          } catch (profileError) {
            console.error('Error loading profile, using default:', profileError);
            const defaultProfile = createDefaultProfile(session.user, basicUser.type);
            setProfile(defaultProfile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          console.log('User signed in:', session.user.id);
          
          // Imposta immediatamente l'utente
          const basicUser: AppUser = {
            ...session.user,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            type: session.user.user_metadata?.user_type || 'client'
          };
          setUser(basicUser);
          
          // Carica il profilo in background
          setTimeout(async () => {
            try {
              const userProfile = await loadUserProfile(session.user.id);
              if (userProfile) {
                setProfile(userProfile);
                setUser(prev => ({
                  ...prev!,
                  name: userProfile.name,
                  type: userProfile.type
                }));
              } else {
                const defaultProfile = createDefaultProfile(session.user, basicUser.type);
                setProfile(defaultProfile);
              }
            } catch (error) {
              console.error('Error loading profile in background:', error);
              const defaultProfile = createDefaultProfile(session.user, basicUser.type);
              setProfile(defaultProfile);
            }
          }, 100);
          
          setLoading(false);
        } else {
          console.log('User signed out');
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, type: 'client' | 'restaurant') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            user_type: type,
            first_name: name.split(' ')[0],
            last_name: name.split(' ')[1] || ''
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<ClientProfile | RestaurantProfile>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('userprofiles')
        .update({
          first_name: data.name?.split(' ')[0],
          last_name: data.name?.split(' ')[1] || '',
          phone: data.phone,
          address: data.address
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      profile, 
      login, 
      loginWithGoogle,
      register, 
      logout, 
      loading, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
