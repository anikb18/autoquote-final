import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Car, Upload, DollarSign, CalendarDays, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const VehiclePreferenceForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [financingType, setFinancingType] = useState<'cash' | 'financing' | 'lease'>('cash');
  
  const [desiredVehicle, setDesiredVehicle] = useState({
    make: "",
    model: "",
    trim: "",
    year: "",
  });

  const [tradeInVehicle, setTradeInVehicle] = useState({
    vin: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    year: "",
    outstandingLoan: "",
    accidentFree: true,
  });

  const [financingDetails, setFinancingDetails] = useState({
    term: "",
    annualKilometers: "",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload photos if any
      const photoUrls = [];
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('vehicle-photos')
          .upload(fileName, photo);
        
        if (!uploadError) {
          photoUrls.push(fileName);
        }
      }

      const quoteData = {
        user_id: user.id,
        desired_vehicle_details: desiredVehicle,
        has_trade_in: hasTradeIn,
        trade_in_details: hasTradeIn ? {
          ...tradeInVehicle,
          photos: photoUrls,
        } : null,
        financing_preference: financingType,
        lease_term: financingType === 'lease' ? parseInt(financingDetails.term) : null,
        annual_kilometers: financingType === 'lease' ? parseInt(financingDetails.annualKilometers) : null,
      };

      const { error } = await supabase
        .from('quotes')
        .insert(quoteData);

      if (error) throw error;

      toast({
        title: t('form.success.title'),
        description: t('form.success.description'),
      });
    } catch (error) {
      toast({
        title: t('form.error.title'),
        description: t('form.error.description'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 text-primary mb-6">
        <Car className="w-6 h-6" />
        <h3 className="text-xl font-semibold">{t('form.title')}</h3>
      </div>

      {/* Desired Vehicle Section */}
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
                {/* Add your make options here */}
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
                {/* Add your model options here */}
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
                {/* Add your trim options here */}
                <SelectItem value="le">LE</SelectItem>
                <SelectItem value="xle">XLE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Financing Options */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          {t('form.financing.title')}
        </h4>

        <RadioGroup
          value={financingType}
          onValueChange={(value: 'cash' | 'financing' | 'lease') => setFinancingType(value)}
          className="grid grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash">{t('form.financing.cash')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="financing" id="financing" />
            <Label htmlFor="financing">{t('form.financing.loan')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lease" id="lease" />
            <Label htmlFor="lease">{t('form.financing.lease')}</Label>
          </div>
        </RadioGroup>

        {(financingType === 'financing' || financingType === 'lease') && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('form.financing.term')}</Label>
              <Select 
                onValueChange={(value) => setFinancingDetails(prev => ({ ...prev, term: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.financing.termPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 {t('form.financing.months')}</SelectItem>
                  <SelectItem value="36">36 {t('form.financing.months')}</SelectItem>
                  <SelectItem value="48">48 {t('form.financing.months')}</SelectItem>
                  <SelectItem value="60">60 {t('form.financing.months')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {financingType === 'lease' && (
              <div className="space-y-2">
                <Label>{t('form.financing.annualKm')}</Label>
                <Select 
                  onValueChange={(value) => setFinancingDetails(prev => ({ ...prev, annualKilometers: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.financing.kmPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12000">12,000 km</SelectItem>
                    <SelectItem value="16000">16,000 km</SelectItem>
                    <SelectItem value="20000">20,000 km</SelectItem>
                    <SelectItem value="24000">24,000 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trade-in Section */}
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

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? t('form.submitting') : t('form.submit')}
      </Button>
    </form>
  );
};

export default VehiclePreferenceForm;