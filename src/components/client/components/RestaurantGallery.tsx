
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image as ImageIcon, 
  Video, 
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useRestaurantPhotos, useRestaurantVideos } from '@/hooks/useRestaurantMedia';

interface RestaurantGalleryProps {
  restaurantId: string;
}

const RestaurantGallery = ({ restaurantId }: RestaurantGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('tutti');

  const { data: photos = [], isLoading: photosLoading } = useRestaurantPhotos(restaurantId);
  const { data: videos = [], isLoading: videosLoading } = useRestaurantVideos(restaurantId);

  const categories = ['tutti', 'ambiente', 'piatti', 'esterni', 'staff'];

  const filteredPhotos = selectedCategory === 'tutti' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const openImageModal = (imageUrl: string) => {
    const index = filteredPhotos.findIndex(photo => photo.url === imageUrl);
    setCurrentImageIndex(index);
    setSelectedImage(imageUrl);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (currentImageIndex + 1) % filteredPhotos.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredPhotos[newIndex].url);
  };

  if (photosLoading || videosLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
        <p className="text-green-600 mt-2">Caricamento gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">Foto ({photos.length})</TabsTrigger>
          <TabsTrigger value="videos">Video ({videos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          {/* Category Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer capitalize ${
                      selectedCategory === category
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos Grid */}
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPhotos.map(photo => (
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
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map(video => (
                <Card key={video.id} className="overflow-hidden cursor-pointer group">
                  <div 
                    className="relative"
                    onClick={() => setSelectedVideo(video.url)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-green-800">{video.name}</h4>
                    <p className="text-sm text-gray-600">Durata: {video.duration}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Nessun video disponibile</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
            
            {filteredPhotos.length > 1 && (
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
                <p className="font-medium">{filteredPhotos[currentImageIndex]?.name}</p>
                <p className="text-sm opacity-80">
                  {currentImageIndex + 1} di {filteredPhotos.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white z-10"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantGallery;
