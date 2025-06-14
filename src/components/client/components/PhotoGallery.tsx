
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { usePhotosByCategory, Photo } from '@/hooks/useRestaurantMedia';

interface PhotoGalleryProps {
  restaurantId: string;
}

const PhotoGallery = ({ restaurantId }: PhotoGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('tutte');

  const { data: photos = [], isLoading } = usePhotosByCategory(
    restaurantId, 
    selectedCategory === 'tutte' ? undefined : selectedCategory
  );

  // Ridotte le categorie a solo ambiente e piatti
  const categories = [
    { key: 'tutte', label: 'Tutte' },
    { key: 'ambiente', label: 'Ambiente' },
    { key: 'piatti', label: 'Piatti' }
  ];

  const openImageModal = (imageUrl: string) => {
    const index = photos.findIndex(photo => photo.url === imageUrl);
    setCurrentImageIndex(index);
    setSelectedImage(imageUrl);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + photos.length) % photos.length
      : (currentImageIndex + 1) % photos.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(photos[newIndex].url);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
        <p className="text-green-600 mt-2">Caricamento foto...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category.key
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                }`}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div 
              key={photo.id}
              className="relative aspect-square cursor-pointer group"
              onClick={() => openImageModal(photo.url)}
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
                <p className="text-white text-xs font-medium">{photo.name}</p>
                <p className="text-white/80 text-xs">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nessuna foto disponibile per questa categoria</p>
          </CardContent>
        </Card>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {photos.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-10"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-10"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            <img
              src={selectedImage}
              alt="Foto ingrandita"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="bg-black/60 text-white px-4 py-2 rounded-lg inline-block">
                <p className="font-medium">{photos[currentImageIndex]?.name}</p>
                <p className="text-sm opacity-80">
                  {currentImageIndex + 1} di {photos.length} - {photos[currentImageIndex]?.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
