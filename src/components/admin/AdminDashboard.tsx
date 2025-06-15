
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, TrendingUp, Calendar, DollarSign, CreditCard, Users, Building2 } from 'lucide-react';
import { useAdminAuth, useAdminStats } from '@/hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import RestaurantStatsTable from './RestaurantStatsTable';

const AdminDashboard = () => {
  const { logout } = useAdminAuth();
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Errore nel caricamento dei dati</p>
            <Button onClick={() => window.location.reload()} className="w-full mt-4">
              Ricarica
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Amministratore</h1>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Statistiche Principali */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prenotazioni Totali</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBookings}</div>
              <p className="text-xs text-muted-foreground">Prenotazioni completate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prenotazioni Mensili</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.monthlyBookings}</div>
              <p className="text-xs text-muted-foreground">Questo mese</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ricavo Mensile</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats?.totalMonthlyRevenue?.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Commissioni incassate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamenti Pendenti</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">€{stats?.pendingPayments?.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Da riscuotere</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ristoranti Attivi</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.restaurantStats?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Partner registrati</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistiche Dettagliate Ristoranti */}
        <RestaurantStatsTable restaurants={stats?.restaurantStats || []} />

        {/* Ricavi per Ristorante */}
        <Card>
          <CardHeader>
            <CardTitle>Ricavi per Ristorante (Questo Mese)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.revenueByRestaurant?.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nessun dato disponibile per questo mese
                </p>
              ) : (
                stats?.revenueByRestaurant?.map((restaurant, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{restaurant.restaurantName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Commissioni generate
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        €{restaurant.revenue.toFixed(2)}
                      </div>
                      {restaurant.pendingPayments > 0 && (
                        <div className="text-sm text-orange-600">
                          Pendenti: €{restaurant.pendingPayments.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Sistema di Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Sistema di Commissioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Come funziona:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Commissione: €2.00 per persona per ogni prenotazione completata</li>
                <li>• Le commissioni vengono calcolate automaticamente quando il ristorante conferma l'arrivo del cliente</li>
                <li>• I pagamenti possono essere gestiti manualmente o tramite integrazione futura</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
