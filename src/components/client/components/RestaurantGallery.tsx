
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestaurantPhotos, useRestaurantVideos } from '@/hooks/useRestaurantMedia';
import PhotoGallery from './PhotoGallery';
import VideoGallery from './VideoGallery';

interface RestaurantGalleryProps {
  restaurantId: string;
}

const RestaurantGallery = ({ restaurantId }: RestaurantGalleryProps) => {
  const { data: photos = [] } = useRestaurantPhotos(restaurantId);
  const { data: videos = [] } = useRestaurantVideos(restaurantId);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">Foto ({photos.length})</TabsTrigger>
          <TabsTrigger value="videos">Video ({videos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          <PhotoGallery restaurantId={restaurantId} />
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <VideoGallery restaurantId={restaurantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantGallery;
