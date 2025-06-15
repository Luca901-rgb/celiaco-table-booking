
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail } from 'lucide-react';

interface RestaurantStats {
  id: string;
  name: string;
  totalBookings: number;
  monthlyBookings: number;
  averageRating: number;
  totalReviews: number;
  monthlyRevenue: number;
  pendingPayments: number;
  address: string;
  phone: string;
  email: string;
}

interface RestaurantStatsTableProps {
  restaurants: RestaurantStats[];
}

const RestaurantStatsTable = ({ restaurants }: RestaurantStatsTableProps) => {
  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : 'N/A';
  };

  const getPerformanceBadge = (monthlyBookings: number, totalBookings: number) => {
    const ratio = totalBookings > 0 ? (monthlyBookings / totalBookings) * 100 : 0;
    
    if (ratio > 20) return <Badge className="bg-green-100 text-green-800">Ottimo</Badge>;
    if (ratio > 10) return <Badge className="bg-yellow-100 text-yellow-800">Buono</Badge>;
    if (ratio > 5) return <Badge className="bg-orange-100 text-orange-800">Moderato</Badge>;
    return <Badge className="bg-red-100 text-red-800">Basso</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiche Dettagliate Ristoranti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ristorante</TableHead>
                <TableHead>Prenotazioni</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Ricavi Mensili</TableHead>
                <TableHead>Pagamenti Pendenti</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Contatti</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{restaurant.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {restaurant.address || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {restaurant.monthlyBookings}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        questo mese
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {restaurant.totalBookings} totali
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-medium">
                        {formatRating(restaurant.averageRating)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({restaurant.totalReviews})
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        €{restaurant.monthlyRevenue.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        commissioni
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-right">
                      {restaurant.pendingPayments > 0 ? (
                        <div className="font-medium text-orange-600">
                          €{restaurant.pendingPayments.toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">€0.00</div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getPerformanceBadge(restaurant.monthlyBookings, restaurant.totalBookings)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {restaurant.phone && (
                        <div className="flex items-center text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          {restaurant.phone}
                        </div>
                      )}
                      {restaurant.email && (
                        <div className="flex items-center text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          {restaurant.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {restaurants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nessun ristorante registrato nel sistema
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantStatsTable;
