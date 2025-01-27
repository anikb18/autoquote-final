import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DesiredVehicleSection from "./forms/DesiredVehicleSection";
import FinancingSection from "./forms/FinancingSection";
import TradeInSection from "./forms/TradeInSection";

const VehiclePreferenceForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [financingType, setFinancingType] = useState<
    "cash" | "financing" | "lease"
  >("cash");

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
    setPhotos((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload photos if any
      const photoUrls = [];
      for (const photo of photos) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("vehicle-photos")
          .upload(fileName, photo);

        if (!uploadError) {
          photoUrls.push(fileName);
        }
      }

      const quoteData = {
        user_id: user.id,
        desired_vehicle_details: desiredVehicle,
        has_trade_in: hasTradeIn,
        trade_in_details: hasTradeIn
          ? {
              ...tradeInVehicle,
              photos: photoUrls,
            }
          : null,
        financing_preference: financingType,
        lease_term:
          financingType === "lease" ? parseInt(financingDetails.term) : null,
        annual_kilometers:
          financingType === "lease"
            ? parseInt(financingDetails.annualKilometers)
            : null,
      };

      const { error } = await supabase.from("quotes").insert(quoteData);

      if (error) throw error;

      toast({
        title: t("form.success.title"),
        description: t("form.success.description"),
      });
    } catch (error) {
      toast({
        title: t("form.error.title"),
        description: t("form.error.description"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-2 text-primary mb-6">
        <Car className="w-6 h-6" />
        <h3 className="text-xl font-semibold">{t("form.title")}</h3>
      </div>

      <DesiredVehicleSection
        desiredVehicle={desiredVehicle}
        setDesiredVehicle={setDesiredVehicle}
      />

      <FinancingSection
        financingType={financingType}
        setFinancingType={setFinancingType}
        financingDetails={financingDetails}
        setFinancingDetails={setFinancingDetails}
      />

      <TradeInSection
        hasTradeIn={hasTradeIn}
        setHasTradeIn={setHasTradeIn}
        tradeInVehicle={tradeInVehicle}
        setTradeInVehicle={setTradeInVehicle}
        photos={photos}
        handlePhotoUpload={handlePhotoUpload}
      />

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? t("form.submitting") : t("form.submit")}
      </Button>
    </form>
  );
};

export default VehiclePreferenceForm;
