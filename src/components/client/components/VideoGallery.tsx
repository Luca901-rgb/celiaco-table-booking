
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video as VideoIcon, 
  Play,
  X,
  Loader2
} from 'lucide-react';
import { useVideosByCategory, Video } from '@/hooks/useRestaurantMedia';

interface VideoGalleryProps {
  restaurantId: string;
}

const VideoGallery = ({ restaurantId }: VideoGalleryProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('tutti');

  const { data: videos = [], isLoading } = useVideosByCategory(
    restaurantId, 
    selectedCategory === 'tutti' ? undefined : selectedCategory
  );

  const categories = [
    { key: 'tutti', label: 'Tutti' },
    { key: 'presentazione', label: 'Presentazione' },
    { key: 'cucina', label: 'Cucina' },
    { key: 'ambiente', label: 'Ambiente' }
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
        <p className="text-green-600 mt-2">Caricamento video...</p>
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

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map(video => (
            <Card key={video.id} className="overflow-hidden cursor-pointer group">
              <div 
                className="relative"
                onClick={() => setSelectedVideo(video)}
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
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-black/60 text-white border-none text-xs">
                    {video.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium text-green-800 mb-1">{video.name}</h4>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Durata: {video.duration}</span>
                  <span className="capitalize">{video.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <VideoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nessun video disponibile per questa categoria</p>
          </CardContent>
        </Card>
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
              src={selectedVideo.url}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg"
              poster={selectedVideo.thumbnail}
            />
            
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="bg-black/60 text-white px-4 py-2 rounded-lg inline-block">
                <p className="font-medium">{selectedVideo.name}</p>
                <p className="text-sm opacity-80">
                  {selectedVideo.duration} - {selectedVideo.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
