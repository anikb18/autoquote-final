import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PhotoUploadStepProps {
  onPhotosChange: (photos: File[]) => void;
}

const PhotoUploadStep = ({ onPhotosChange }: PhotoUploadStepProps) => {
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files);
      setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
      onPhotosChange([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prevPhotos => {
      const updatedPhotos = [...prevPhotos];
      updatedPhotos.splice(index, 1);
      onPhotosChange(updatedPhotos);
      return updatedPhotos;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Photos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <Card key={index} className="relative p-2">
            <img
              src={URL.createObjectURL(photo)}
              alt={`Vehicle photo ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removePhoto(index)}
            >
              Remove
            </Button>
          </Card>
        ))}
        {photos.length < 4 && (
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
              <span className="text-gray-500">+ Add Photo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              multiple={photos.length === 0}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadStep;