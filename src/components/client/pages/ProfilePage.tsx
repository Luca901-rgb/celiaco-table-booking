
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Calendar, QrCode, Settings, LogOut, Edit3, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+39 123 456 7890',
    location: 'Milano, Italia',
    allergies: ['Glutine', 'Lattosio'],
    preferences: ['Italiana', 'Mediterranea', 'Vegetariana']
  });

  // Mock QR codes and booking history
  const qrCodes = [
    {
      id: '1',
      restaurantName: 'Gluten Free Bistrot',
      bookingDate: '2023-12-15',
      bookingTime: '20:00',
      status: 'used',
      code: 'QR123456'
    },
    {
      id: '2',
      restaurantName: 'Celiac Garden',
      bookingDate: '2023-12-20',
      bookingTime: '19:30',
      status: 'active',
      code: 'QR789012'
    }
  ];

  const bookingHistory = [
    {
      id: '1',
      restaurantName: 'Gluten Free Bistrot',
      date: '2023-12-15',
      time: '20:00',
      guests: 2,
      status: 'completed',
      reviewed: true
    },
    {
      id: '2',
      restaurantName: 'Free From Pizza',
      date: '2023-12-10',
      time: '19:00',
      guests: 4,
      status: 'completed',
      reviewed: false
    },
    {
      id: '3',
      restaurantName: 'Celiac Garden',
      date: '2023-12-20',
      time: '19:30',
      guests: 2,
      status: 'upcoming',
      reviewed: false
    }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profilo aggiornato",
      description: "Le tue informazioni sono state salvate con successo"
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Disconnesso",
      description: "Sei stato disconnesso con successo"
    });
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Profile Header */}
      <Card className="border-green-200">
        <CardHeader className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">{profileData.name}</h1>
            <p className="text-green-600">{profileData.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Annulla' : 'Modifica Profilo'}
          </Button>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Informazioni Personali</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="border-green-200 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="border-green-200 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="location">Località</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  className="border-green-200 focus:border-green-500"
                />
              </div>
              <Button 
                onClick={handleSaveProfile}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Salva Modifiche
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>{profileData.location}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allergie e Preferenze */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Allergie e Preferenze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Allergie</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.allergies.map((allergy) => (
                <Badge key={allergy} variant="destructive">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Preferenze Culinarie</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.preferences.map((preference) => (
                <Badge key={preference} className="bg-green-100 text-green-800 hover:bg-green-200">
                  {preference}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Codes */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            I Tuoi QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="p-3 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-green-800">{qr.restaurantName}</h4>
                  <p className="text-sm text-gray-600">{qr.bookingDate} alle {qr.bookingTime}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={qr.status === 'active' ? 'default' : 'secondary'}
                    className={qr.status === 'active' ? 'bg-green-600' : ''}
                  >
                    {qr.status === 'active' ? 'Attivo' : 'Utilizzato'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{qr.code}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Booking History */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Storico Prenotazioni
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookingHistory.map((booking) => (
            <div key={booking.id} className="p-3 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-green-800">{booking.restaurantName}</h4>
                  <p className="text-sm text-gray-600">
                    {booking.date} alle {booking.time} • {booking.guests} persone
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <Badge 
                    variant={
                      booking.status === 'completed' ? 'secondary' : 
                      booking.status === 'upcoming' ? 'default' : 'destructive'
                    }
                    className={booking.status === 'upcoming' ? 'bg-green-600' : ''}
                  >
                    {booking.status === 'completed' ? 'Completata' : 
                     booking.status === 'upcoming' ? 'Prossima' : 'Cancellata'}
                  </Badge>
                  {booking.status === 'completed' && !booking.reviewed && (
                    <Button size="sm" variant="outline" className="block text-xs border-green-200">
                      <Star className="w-3 h-3 mr-1" />
                      Recensisci
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings and Logout */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full border-green-200 text-green-600 hover:bg-green-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Impostazioni
        </Button>
        
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnetti
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
