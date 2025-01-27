import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface PhotoUploadStepProps {
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

const PhotoUploadStep = ({ photos, setPhotos }: PhotoUploadStepProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      setPhotos((prevPhotos) => [...prevPhotos, ...files]);
    },
    [setPhotos],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files) {
        const files = Array.from(e.target.files);
        setPhotos((prevPhotos) => [...prevPhotos, ...files]);
      }
    },
    [setPhotos],
  );

  const removePhoto = useCallback(
    (index: number) => {
      setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    },
    [setPhotos],
  );

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Drag and drop photos here or click to select
            </p>
            <Button type="button" variant="outline">
              Select Photos
            </Button>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              className="absolute top-1 right-1"
              onClick={() => removePhoto(index)}
            >
              Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhotoUploadStep;
