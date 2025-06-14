
import { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MediaManagement = () => {
  const [photos, setPhotos] = useState([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      category: 'ambiente',
      name: 'Sala principale'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'piatti',
      name: 'Pizza senza glutine'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      category: 'piatti',
      name: 'Pasta alla carbonara'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      category: 'ambiente',
      name: 'Cucina a vista'
    }
  ]);

  const [videos, setVideos] = useState([
    {
      id: '1',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      name: 'Presentazione ristorante',
      duration: '2:30'
    },
    {
      id: '2',
      url: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      name: 'Preparazione pizza',
      duration: '1:45'
    }
  ]);

  const categories = ['ambiente', 'piatti', 'staff', 'esterni'];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            category: 'piatti',
            name: file.name.split('.')[0]
          };
          setPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      });
      toast({
        title: "Foto caricate",
        description: "Le foto sono state aggiunte alla gallery"
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newVideo = {
          id: Date.now().toString() + Math.random(),
          url: URL.createObjectURL(file),
          thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
          name: file.name.split('.')[0],
          duration: '0:00'
        };
        setVideos(prev => [...prev, newVideo]);
      });
      toast({
        title: "Video caricati",
        description: "I video sono stati aggiunti alla gallery"
      });
    }
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
    toast({
      title: "Foto eliminata",
      description: "La foto è stata rimossa dalla gallery"
    });
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
    toast({
      title: "Video eliminato",
      description: "Il video è stato rimosso dalla gallery"
    });
  };

  const getPhotosByCategory = (category: string) => {
    return photos.filter(photo => photo.category === category);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">Gestione Media</h1>
        <p className="text-green-600">Gestisci foto e video del tuo ristorante</p>
      </div>

      <Tabs defaultValue="photos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">Foto Gallery</TabsTrigger>
          <TabsTrigger value="videos">Video Gallery</TabsTrigger>
        </TabsList>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-800">Foto Gallery</h2>
            <label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Foto
              </Button>
            </label>
          </div>

          {categories.map(category => {
            const categoryPhotos = getPhotosByCategory(category);
            if (categoryPhotos.length === 0) return null;

            return (
              <Card key={category} className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 capitalize flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    {category}
                    <Badge variant="secondary">{categoryPhotos.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryPhotos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePhoto(photo.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <ImageIcon className="w-16 h-16 mx-auto text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800">Nessuna foto caricata</h3>
                    <p className="text-sm text-green-600">
                      Inizia caricando le prime foto del tuo ristorante
                    </p>
                  </div>
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Carica Prime Foto
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-800">Video Gallery</h2>
            <label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
              />
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Video
              </Button>
            </label>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <Card key={video.id} className="border-green-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">{video.name}</h4>
                        <p className="text-sm text-gray-600">Durata: {video.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-green-200">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-green-200">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Video className="w-16 h-16 mx-auto text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800">Nessun video caricato</h3>
                    <p className="text-sm text-green-600">
                      Carica video promozionali del tuo ristorante
                    </p>
                  </div>
                  <label>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Carica Primo Video
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaManagement;
