import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";

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

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium flex items-center gap-2">
        <Car className="w-4 h-4" />
        {t('form.desiredVehicle.title')}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('form.make.label')}</Label>
          <Select onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, make: value }))}>
            <SelectTrigger>
              <SelectValue placeholder={t('form.make.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('form.model.label')}</Label>
          <Select onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, model: value }))}>
            <SelectTrigger>
              <SelectValue placeholder={t('form.model.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="camry">Camry</SelectItem>
              <SelectItem value="corolla">Corolla</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('form.year.label')}</Label>
          <Input 
            type="number"
            min="2000"
            max="2025"
            value={desiredVehicle.year}
            onChange={(e) => setDesiredVehicle(prev => ({ ...prev, year: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('form.trim.label')}</Label>
          <Select onValueChange={(value) => setDesiredVehicle(prev => ({ ...prev, trim: value }))}>
            <SelectTrigger>
              <SelectValue placeholder={t('form.trim.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="le">LE</SelectItem>
              <SelectItem value="xle">XLE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DesiredVehicleSection;