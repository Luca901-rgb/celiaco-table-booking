import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Trash2,
  Eye,
  Plus,
  Loader2,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  useRestaurantPhotos, 
  useRestaurantVideos, 
  useAddPhoto, 
  useDeletePhoto,
  useAddVideo,
  useDeleteVideo
} from '@/hooks/useRestaurantMedia';

const MediaManagement = () => {
  const restaurantId = 'rest1'; // In produzione, questo verrà dal contesto auth
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: photos = [], isLoading: photosLoading } = useRestaurantPhotos(restaurantId);
  const { data: videos = [], isLoading: videosLoading } = useRestaurantVideos(restaurantId);
  
  const addPhotoMutation = useAddPhoto();
  const deletePhotoMutation = useDeletePhoto();
  const addVideoMutation = useAddVideo();
  const deleteVideoMutation = useDeleteVideo();

  const categories = ['ambiente', 'piatti'];

  // Funzione per rilevare se siamo su mobile
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const handlePhotoClick = (photoUrl: string) => {
    if (isMobile()) {
      setSelectedImage(photoUrl);
    } else {
      window.open(photoUrl, '_blank');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            addPhotoMutation.mutate({
              url: result,
              category: 'piatti',
              name: file.name.split('.')[0],
              uploadedAt: new Date()
            });
          }
        };
        reader.readAsDataURL(file);
      });
      // Reset input value to allow same file to be selected again
      e.target.value = '';
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const videoUrl = URL.createObjectURL(file);
        addVideoMutation.mutate({
          url: videoUrl,
          thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
          name: file.name.split('.')[0],
          duration: '0:00',
          category: 'presentazione',
          uploadedAt: new Date()
        });
      });
      // Reset input value to allow same file to be selected again
      e.target.value = '';
    }
  };

  const handlePhotoButtonClick = () => {
    photoInputRef.current?.click();
  };

  const handleVideoButtonClick = () => {
    videoInputRef.current?.click();
  };

  const getPhotosByCategory = (category: string) => {
    return photos.filter(photo => photo.category === category);
  };

  if (photosLoading || videosLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
        <p className="text-green-600 mt-2">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="space-y-1 md:space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-green-800">Gestione Media</h1>
        <p className="text-sm md:text-base text-green-600">Gestisci foto e video del tuo ristorante</p>
      </div>

      <Tabs defaultValue="photos" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">Foto Gallery ({photos.length})</TabsTrigger>
          <TabsTrigger value="videos">Video Gallery ({videos.length})</TabsTrigger>
        </TabsList>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-green-800">Foto Gallery</h2>
            <div className="flex-shrink-0">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={addPhotoMutation.isPending}
              />
              <Button 
                onClick={handlePhotoButtonClick}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                disabled={addPhotoMutation.isPending}
              >
                {addPhotoMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Aggiungi Foto
              </Button>
            </div>
          </div>

          {categories.map(category => {
            const categoryPhotos = getPhotosByCategory(category);
            if (categoryPhotos.length === 0) return null;

            return (
              <Card key={category} className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 capitalize flex items-center gap-2 text-base md:text-lg">
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                    {category}
                    <Badge variant="secondary">{categoryPhotos.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {categoryPhotos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-24 md:h-32 object-cover rounded-lg cursor-pointer"
                          loading="lazy"
                          onClick={() => handlePhotoClick(photo.url)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1 md:gap-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="text-xs md:text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePhotoClick(photo.url);
                            }}
                          >
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePhotoMutation.mutate(photo.id);
                            }}
                            disabled={deletePhotoMutation.isPending}
                            className="text-xs md:text-sm"
                          >
                            {deletePhotoMutation.isPending ? (
                              <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {photos.length === 0 && (
            <Card className="border-green-200">
              <CardContent className="py-8 md:py-12">
                <div className="text-center space-y-4">
                  <ImageIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800 text-sm md:text-base">Nessuna foto caricata</h3>
                    <p className="text-xs md:text-sm text-green-600 mt-1">
                      Inizia caricando le prime foto del tuo ristorante
                    </p>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={handlePhotoButtonClick}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Carica Prime Foto
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-green-800">Video Gallery</h2>
            <div className="flex-shrink-0">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
                disabled={addVideoMutation.isPending}
              />
              <Button 
                onClick={handleVideoButtonClick}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                disabled={addVideoMutation.isPending}
              >
                {addVideoMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Aggiungi Video
              </Button>
            </div>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {videos.map(video => (
                <Card key={video.id} className="border-green-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-36 md:h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3">
                        <Video className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-green-800 text-sm md:text-base truncate">{video.name}</h4>
                        <p className="text-xs md:text-sm text-gray-600">Durata: {video.duration}</p>
                      </div>
                      <div className="flex gap-1 md:gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" className="border-green-200 text-xs md:text-sm">
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteVideoMutation.mutate(video.id)}
                          disabled={deleteVideoMutation.isPending}
                          className="text-xs md:text-sm"
                        >
                          {deleteVideoMutation.isPending ? (
                            <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-green-200">
              <CardContent className="py-8 md:py-12">
                <div className="text-center space-y-4">
                  <Video className="w-12 h-12 md:w-16 md:h-16 mx-auto text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800 text-sm md:text-base">Nessun video caricato</h3>
                    <p className="text-xs md:text-sm text-green-600 mt-1">
                      Carica video promozionali del tuo ristorante
                    </p>
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={handleVideoButtonClick}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Carica Primo Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal per ingrandimento foto su mobile */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <img
              src={selectedImage}
              alt="Foto ingrandita"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagement;
