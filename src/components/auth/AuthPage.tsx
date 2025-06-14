
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Utensils, Users, Mail, Lock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const { user, login, register, loading, profile } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'client' | 'restaurant'>('client');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Redirect logic - now checks both user and profile
  useEffect(() => {
    if (user && profile) {
      console.log('Redirecting user:', user, 'with profile:', profile);
      const redirectPath = profile.type === 'client' ? '/client/home' : '/restaurant/dashboard';
      navigate(redirectPath);
    } else if (user && !profile && !loading) {
      // If user exists but no profile and not loading, wait a bit more
      console.log('User exists but no profile yet, waiting...');
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non coincidono",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        console.log('Login successful');
      } else {
        await register(formData.email, formData.password, formData.name, userType);
        console.log('Registration successful');
      }
      toast({
        title: "Successo!",
        description: isLogin ? "Accesso effettuato con successo" : "Registrazione completata con successo"
      });
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = "Si è verificato un errore. Riprova.";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = "Email o password non corretti";
            break;
          case 'auth/email-already-in-use':
            errorMessage = "Questa email è già registrata";
            break;
          case 'auth/weak-password':
            errorMessage = "La password deve essere di almeno 6 caratteri";
            break;
          case 'auth/invalid-email':
            errorMessage = "Email non valida";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Show loading state while authentication is being processed
  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white mb-4">
            <Utensils className="w-8 h-8" />
          </div>
          <p className="text-green-600">Caricamento del profilo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white mb-4">
            <Utensils className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-green-800">GlutenFreeEats</h1>
          <p className="text-green-600">La tua app per ristoranti senza glutine</p>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader className="space-y-4">
            {!isLogin && (
              <Tabs value={userType} onValueChange={(value) => setUserType(value as 'client' | 'restaurant')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Cliente
                  </TabsTrigger>
                  <TabsTrigger value="restaurant" className="flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    Ristorante
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            
            <div>
              <CardTitle className="text-2xl text-center">
                {isLogin ? 'Accedi' : 'Registrati'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? 'Accedi al tuo account'
                  : userType === 'client' 
                    ? 'Trova e prenota ristoranti senza glutine' 
                    : 'Gestisci il tuo ristorante senza glutine'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome {userType === 'restaurant' ? 'Ristorante' : 'Completo'}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={userType === 'restaurant' ? 'Nome del ristorante' : 'Il tuo nome'}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="La tua email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="La tua password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Conferma Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Conferma la tua password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                disabled={loading}
              >
                {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-700"
              >
                {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
