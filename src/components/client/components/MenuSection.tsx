
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye, Filter } from 'lucide-react';
import { useRestaurantMenu } from '@/hooks/useMenu';
import PdfViewer from './PdfViewer';

interface MenuSectionProps {
  restaurantId: string;
}

const MenuSection = ({ restaurantId }: MenuSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: menuItems = [], isLoading } = useRestaurantMenu(restaurantId);

  const categories = [
    { id: 'all', name: 'Tutti' },
    { id: 'antipasti', name: 'Antipasti' },
    { id: 'primi', name: 'Primi Piatti' },
    { id: 'secondi', name: 'Secondi Piatti' },
    { id: 'contorni', name: 'Contorni' },
    { id: 'dolci', name: 'Dolci' },
    { id: 'bevande', name: 'Bevande' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="text-green-600">Caricamento menù...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pdf" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf">Menù PDF</TabsTrigger>
          <TabsTrigger value="interactive">Menù Interattivo</TabsTrigger>
        </TabsList>

        <TabsContent value="pdf" className="space-y-4">
          <PdfViewer restaurantId={restaurantId} />
        </TabsContent>

        <TabsContent value="interactive" className="space-y-4">
          {/* Category Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Filtra per categoria:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedCategory === category.id
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          {Object.keys(groupedItems).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Nessun piatto disponibile per questa categoria</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedItems).map(([categoryId, items]) => (
              <Card key={categoryId}>
                <CardHeader>
                  <CardTitle className="text-green-800">
                    {getCategoryName(categoryId)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="p-4 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            {item.isGlutenFree && (
                              <Badge className="bg-green-600 text-xs">
                                Senza Glutine
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          )}
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              <span className="text-xs text-gray-500">Allergeni:</span>
                              {item.allergens.map(allergen => (
                                <Badge
                                  key={allergen}
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <span className="text-lg font-bold text-green-600">
                            €{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuSection;
