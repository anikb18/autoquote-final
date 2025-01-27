import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VehicleInfoStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const VehicleInfoStep = ({ formData, setFormData }: VehicleInfoStepProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      vehicleInfo: {
        ...formData.vehicleInfo,
        [name]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            name="make"
            value={formData.vehicleInfo.make}
            onChange={handleChange}
            placeholder="e.g., Toyota"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={formData.vehicleInfo.model}
            onChange={handleChange}
            placeholder="e.g., Camry"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.vehicleInfo.year}
            onChange={handleChange}
            placeholder="e.g., 2020"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trim">Trim Level</Label>
          <Input
            id="trim"
            name="trim"
            value={formData.vehicleInfo.trim}
            onChange={handleChange}
            placeholder="e.g., SE"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.vehicleInfo.mileage}
            onChange={handleChange}
            placeholder="Current mileage"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vin">VIN (Optional)</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vehicleInfo.vin}
            onChange={handleChange}
            placeholder="Vehicle Identification Number"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoStep;
