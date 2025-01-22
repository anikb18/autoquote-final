import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCarDetailsFromGemini, fetchCarMakes, fetchCarModels } from "@/utils/carData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface DesiredVehicleProps {
  desiredVehicle: {
    make: string;
    model: string;
    trim: string;
    year: string;
  };
  setDesiredVehicle: (value: any) => void;
  openToVariants?: boolean;
  setOpenToVariants?: (value: boolean) => void;
}

const DesiredVehicleSection = ({ 
  desiredVehicle, 
  setDesiredVehicle,
  openToVariants = false,
  setOpenToVariants = () => {}
}: DesiredVehicleProps) => {
  const { t } = useTranslation();

  const { data: carMakes = [], isLoading: isLoadingMakes } = useQuery({
    queryKey: ['car-makes'],
    queryFn: fetchCarMakes,
  });

  const { data: carModels = [], isLoading: isLoadingModels } = useQuery({
    queryKey: ['car-models', desiredVehicle.make, desiredVehicle.year],
    queryFn: () => fetchCarModels(desiredVehicle.make, desiredVehicle.year),
    enabled: !!(desiredVehicle.make && desiredVehicle.year),
  });

  const { data: carDetails, isLoading: isLoadingDetails } = useQuery({
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
          <Label>{t('form.year.label')}</Label>
          <Select 
            onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, year: value, model: '' }))}
            value={desiredVehicle.year}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('form.year.selectYear')} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('form.make.label')}</Label>
          <Select 
            onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, make: value, model: '' }))}
            value={desiredVehicle.make}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('form.make.selectMake')} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingMakes ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                carMakes.map((make) => (
                  <SelectItem key={make.value} value={make.value}>{make.label}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('form.model.label')}</Label>
          <Select 
            onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, model: value }))}
            value={desiredVehicle.model}
            disabled={!desiredVehicle.make}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('form.model.selectModel')} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingModels ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                carModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 flex items-center space-x-2 py-4">
          <Switch
            id="variants"
            checked={openToVariants}
            onCheckedChange={setOpenToVariants}
          />
          <Label htmlFor="variants" className="font-normal">
            {t('form.desiredVehicle.variantQuestion')}
          </Label>
        </div>

        {carDetails && !isLoadingDetails && (
          <Card className="col-span-2 p-4 space-y-3">
            <h5 className="font-medium">{t('form.carDetails.specifications')}</h5>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Engine:</strong> {carDetails.engine}</p>
              <p><strong>Fuel Efficiency:</strong> {carDetails.fuelEfficiency}</p>
              <p><strong>Safety Features:</strong> {carDetails.safetyFeatures}</p>
              <p><strong>Technology:</strong> {carDetails.technology}</p>
              <p><strong>Available Trims:</strong> {carDetails.trims}</p>
              <p><strong>Price Range:</strong> {carDetails.priceRange}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DesiredVehicleSection;