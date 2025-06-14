
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, ClientProfile, RestaurantProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: ClientProfile | RestaurantProfile | null;
  login: (email: string, password: string) => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ClientProfile | RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Recupera il profilo utente dal Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
          
          // Recupera il profilo specifico (client o restaurant)
          const profileDoc = await getDoc(doc(db, userData.type === 'client' ? 'clients' : 'restaurants', firebaseUser.uid));
          if (profileDoc.exists()) {
            setProfile(profileDoc.data() as ClientProfile | RestaurantProfile);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, type: 'client' | 'restaurant') => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: User = {
        id: firebaseUser.uid,
        email,
        name,
        type,
        profileComplete: false,
        createdAt: new Date()
      };

      // Salva i dati base dell'utente
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Crea il profilo specifico
      const profileData = type === 'client' 
        ? { ...userData, favoriteRestaurants: [] } as ClientProfile
        : { 
            ...userData, 
            address: '',
            phone: '',
            openingHours: {
              monday: { open: '19:00', close: '23:00', closed: false },
              tuesday: { open: '19:00', close: '23:00', closed: false },
              wednesday: { open: '19:00', close: '23:00', closed: false },
              thursday: { open: '19:00', close: '23:00', closed: false },
              friday: { open: '19:00', close: '24:00', closed: false },
              saturday: { open: '19:00', close: '24:00', closed: false },
              sunday: { open: '19:00', close: '23:00', closed: false }
            },
            certifications: []
          } as RestaurantProfile;

      await setDoc(doc(db, type === 'client' ? 'clients' : 'restaurants', firebaseUser.uid), profileData);
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<ClientProfile | RestaurantProfile>) => {
    if (!user) return;
    
    try {
      const collection = user.type === 'client' ? 'clients' : 'restaurants';
      await setDoc(doc(db, collection, user.id), data, { merge: true });
      
      // Aggiorna lo stato locale
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      login, 
      register, 
      logout, 
      loading, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
