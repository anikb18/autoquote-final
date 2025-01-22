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
  const carMakes = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
    { value: 'ford', label: 'Ford' },
    { value: 'chevrolet', label: 'Chevrolet' },
    { value: 'hyundai', label: 'Hyundai' }
  ];

  const getModelsByMake = (make: string) => {
    const modelMap: { [key: string]: { value: string, label: string }[] } = {
      toyota: [
        { value: 'camry', label: 'Camry' },
        { value: 'corolla', label: 'Corolla' },
        { value: 'rav4', label: 'RAV4' },
        { value: 'highlander', label: 'Highlander' }
      ],
      honda: [
        { value: 'civic', label: 'Civic' },
        { value: 'accord', label: 'Accord' },
        { value: 'cr-v', label: 'CR-V' },
        { value: 'pilot', label: 'Pilot' }
      ],
      ford: [
        { value: 'f-150', label: 'F-150' },
        { value: 'escape', label: 'Escape' },
        { value: 'explorer', label: 'Explorer' },
        { value: 'mustang', label: 'Mustang' }
      ],
      chevrolet: [
        { value: 'silverado', label: 'Silverado' },
        { value: 'equinox', label: 'Equinox' },
        { value: 'traverse', label: 'Traverse' },
        { value: 'malibu', label: 'Malibu' }
      ],
      hyundai: [
        { value: 'elantra', label: 'Elantra' },
        { value: 'tucson', label: 'Tucson' },
        { value: 'santa-fe', label: 'Santa Fe' },
        { value: 'palisade', label: 'Palisade' }
      ]
    };
    return modelMap[make] || [];
  };

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
            onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, year: value }))}
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
              {carMakes.map((make) => (
                <SelectItem key={make.value} value={make.value}>{make.label}</SelectItem>
              ))}
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
              {getModelsByMake(desiredVehicle.make).map((model) => (
                <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {carDetails && !isLoading && (
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