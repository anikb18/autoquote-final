import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Camera, X } from "lucide-react";

interface PhotoUploadStepProps {
  photos: File[];
  setPhotos: (photos: File[]) => void;
}

const requiredViews = [
  { name: "Front Exterior", description: "Straight-on view of the front" },
  { name: "Rear Exterior", description: "Straight-on view of the rear" },
  { name: "Driver Side", description: "Full side view" },
  { name: "Passenger Side", description: "Full side view" },
  { name: "Dashboard", description: "Full view of dashboard and controls" },
  { name: "Interior Front", description: "Front seats and console" },
  { name: "Interior Rear", description: "Back seats and cargo area" },
  { name: "Odometer", description: "Clear view of the mileage" }
];

const PhotoUploadStep = ({ photos, setPhotos }: PhotoUploadStepProps) => {
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 8) {
      alert("Maximum 8 photos allowed");
      return;
    }
    setPhotos(prev => [...prev, ...files]);
  }, [photos, setPhotos]);

  const removePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, [setPhotos]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Required Photos</h3>
        <p className="text-sm text-gray-500">
          Please provide clear photos of all required views. Each photo should be less than 10MB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredViews.map((view, index) => (
          <Card key={view.name} className="p-4">
            <div className="space-y-2">
              <Label className="font-medium">{view.name}</Label>
              <p className="text-sm text-gray-500">{view.description}</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mt-2"
              />
            </div>
          </Card>
        ))}
      </div>

      {photos.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Uploaded Photos ({photos.length}/8)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadStep;