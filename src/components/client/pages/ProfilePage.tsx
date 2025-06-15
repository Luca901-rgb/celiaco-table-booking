
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Heart, Calendar, Bell, LogOut, MapPin, Phone, Mail, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClientProfile } from '@/types';

const ProfilePage = () => {
  const { user, profile, logout } = useAuth();
  const clientProfile = profile as ClientProfile;

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Il Mio Profilo</h1>
        <p className="text-gray-600">Gestisci le tue informazioni e preferenze</p>
      </div>

      {/* Profile Info Card */}
      <Card className="mb-6 border-green-200">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {user?.name || 'Utente'}
              </h2>
              {user?.email && (
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Modifica
            </Button>
          </div>
        </CardHeader>
        
        {clientProfile && (
          <CardContent className="space-y-4">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientProfile.phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{clientProfile.phone}</span>
                </div>
              )}
              {clientProfile.address && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{clientProfile.address}</span>
                </div>
              )}
            </div>

            {/* Allergies */}
            {clientProfile.allergies && clientProfile.allergies.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Le tue allergie:</h3>
                <div className="flex flex-wrap gap-2">
                  {clientProfile.allergies.map((allergy) => (
                    <Badge key={allergy} variant="secondary" className="bg-red-100 text-red-800 text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Link to="/client/bookings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">Storico Prenotazioni</h3>
                  <p className="text-sm text-gray-600 truncate">Visualizza le tue prenotazioni</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/client/favorites">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">Ristoranti Preferiti</h3>
                  <p className="text-sm text-gray-600 truncate">I tuoi ristoranti del cuore</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/client/notifications">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">Notifiche</h3>
                  <p className="text-sm text-gray-600 truncate">Le tue notifiche</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">Impostazioni</h3>
                <p className="text-sm text-gray-600 truncate">Gestisci le tue preferenze</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <Card className="border-red-200">
        <CardContent className="p-4">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnetti
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
