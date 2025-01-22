import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCarDetailsFromGemini } from "@/utils/carData";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DesiredVehicleProps {
  desiredVehicle: {
    make: string;
    model: string;
    trim: string;
    year: string;
  };
  setDesiredVehicle: (value: any) => void;
}

const DesiredVehicleSection = ({ desiredVehicle, setDesiredVehicle }: DesiredVehicleProps) => {
  const { t } = useTranslation();

  const { data: carDetails, isLoading } = useQuery({
    queryKey: ['car-details', desiredVehicle.make, desiredVehicle.model, desiredVehicle.year],
    queryFn: () => fetchCarDetailsFromGemini(
      desiredVehicle.make,
      desiredVehicle.model,
      desiredVehicle.year
    ),
    enabled: !!(desiredVehicle.make && desiredVehicle.model && desiredVehicle.year),
  });

  const availableYears = ['2024', '2025'];

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium flex items-center gap-2">
        <Car className="w-4 h-4" />
        {t('form.desiredVehicle.title')}
      </h4>
      
      <Alert className="mb-4">
        <AlertDescription>
          {t('form.desiredVehicle.newCarOnly')}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('form.make.label')}</Label>
          <Select 
            onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, make: value }))}
            value={desiredVehicle.make}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('form.make.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
              <SelectItem value="ford">Ford</SelectItem>
              <SelectItem value="chevrolet">Chevrolet</SelectItem>
              <SelectItem value="hyundai">Hyundai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('form.year.label')}</Label>
          <Select 
            onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, year: value }))}
            value={desiredVehicle.year}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('form.year.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('form.model.label')}</Label>
          <Select 
            onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, model: value }))}
            value={desiredVehicle.model}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('form.model.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="camry">Camry</SelectItem>
              <SelectItem value="corolla">Corolla</SelectItem>
              <SelectItem value="rav4">RAV4</SelectItem>
              <SelectItem value="highlander">Highlander</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {carDetails && (
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h5 className="font-medium mb-2">{t('form.carDetails.specifications')}</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{carDetails.engine}</p>
                <p>{carDetails.fuelEfficiency}</p>
                <p>{carDetails.safetyFeatures}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesiredVehicleSection;