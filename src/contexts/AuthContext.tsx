
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

const mapProfileToAppUser = (profile: UserProfile): ClientProfile | RestaurantProfile => {
  const baseProfile = {
    id: profile.id,
    email: profile.email,
    name: `${profile.first_name} ${profile.last_name}`.trim(),
    type: profile.user_type as 'client' | 'restaurant',
    profileComplete: true,
    createdAt: new Date()
  };

  if (profile.user_type === 'restaurant') {
    return {
      ...baseProfile,
      type: 'restaurant',
      address: profile.address || '',
      phone: profile.phone || '',
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
      phone: profile.phone,
      address: profile.address,
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

  const loadUserProfile = async (userId: string) => {
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
        const typedProfile = {
          ...userProfile,
          user_type: userProfile.user_type as 'client' | 'restaurant'
        } as UserProfile;
        
        const mappedProfile = mapProfileToAppUser(typedProfile);
        console.log('Mapped profile:', mappedProfile);
        return mappedProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Check for existing session first
    const initializeAuth = async () => {
      console.log('Checking for existing session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('Existing session found, setting session and user immediately');
        setSession(session);
        
        // Set basic user info immediately to unblock UI
        setUser({
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          type: session.user.user_metadata?.user_type || 'client'
        });
        
        // Then load full profile
        const userProfile = await loadUserProfile(session.user.id);
        if (userProfile) {
          setProfile(userProfile);
          setUser(prev => ({
            ...prev!,
            name: userProfile.name,
            type: userProfile.type
          }));
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          if (event === 'SIGNED_IN') {
            console.log('User signed in, setting user immediately');
            setLoading(true);
            
            // Set basic user info immediately
            setUser({
              ...session.user,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
              type: session.user.user_metadata?.user_type || 'client'
            });
            
            // Then load full profile
            const userProfile = await loadUserProfile(session.user.id);
            if (userProfile) {
              setProfile(userProfile);
              setUser(prev => ({
                ...prev!,
                name: userProfile.name,
                type: userProfile.type
              }));
            }
            setLoading(false);
          }
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
