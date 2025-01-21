import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Upload } from "lucide-react";

interface TradeInSectionProps {
  hasTradeIn: boolean;
  setHasTradeIn: (value: boolean) => void;
  tradeInVehicle: {
    vin: string;
    make: string;
    model: string;
    trim: string;
    mileage: string;
    year: string;
    outstandingLoan: string;
    accidentFree: boolean;
  };
  setTradeInVehicle: (value: any) => void;
  photos: File[];
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TradeInSection = ({
  hasTradeIn,
  setHasTradeIn,
  tradeInVehicle,
  setTradeInVehicle,
  photos,
  handlePhotoUpload
}: TradeInSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="hasTrade">{t('form.tradeIn.question')}</Label>
        <Select onValueChange={(value) => setHasTradeIn(value === 'yes')}>
          <SelectTrigger id="hasTrade">
            <SelectValue placeholder={t('form.tradeIn.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">{t('form.tradeIn.no')}</SelectItem>
            <SelectItem value="yes">{t('form.tradeIn.yes')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasTradeIn && (
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t('form.tradeIn.details')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('form.tradeIn.vin')}</Label>
              <Input 
                value={tradeInVehicle.vin}
                onChange={(e) => setTradeInVehicle(prev => ({ ...prev, vin: e.target.value }))}
                placeholder="VIN"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('form.tradeIn.make')}</Label>
              <Input 
                value={tradeInVehicle.make}
                onChange={(e) => setTradeInVehicle(prev => ({ ...prev, make: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('form.tradeIn.model')}</Label>
              <Input 
                value={tradeInVehicle.model}
                onChange={(e) => setTradeInVehicle(prev => ({ ...prev, model: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('form.tradeIn.year')}</Label>
              <Input 
                type="number"
                min="1900"
                max="2025"
                value={tradeInVehicle.year}
                onChange={(e) => setTradeInVehicle(prev => ({ ...prev, year: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('form.tradeIn.mileage')}</Label>
              <Input 
                type="number"
                value={tradeInVehicle.mileage}
                onChange={(e) => setTradeInVehicle(prev => ({ ...prev, mileage: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('form.tradeIn.loan')}</Label>
              <Input 
                type="number"
                value={tradeInVehicle.outstandingLoan}
                onChange={(e) => setTradeInVehicle(prev => ({ ...prev, outstandingLoan: e.target.value }))}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>{t('form.tradeIn.photos')}</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="flex-1"
                />
                <Upload className="w-4 h-4 text-gray-500" />
              </div>
              {photos.length > 0 && (
                <p className="text-sm text-gray-500">
                  {photos.length} {photos.length === 1 ? t('form.tradeIn.photoSelected') : t('form.tradeIn.photosSelected')}
                </p>
              )}
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="accidentFree"
                checked={tradeInVehicle.accidentFree}
                onChange={(e) => setTradeInVehicle(prev => ({ ...prev, accidentFree: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="accidentFree">{t('form.tradeIn.accidentFree')}</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeInSection;