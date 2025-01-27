import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VehicleInfoStep from "./steps/VehicleInfoStep";
import ConditionStep from "./steps/ConditionStep";
import PhotoUploadStep from "./steps/PhotoUploadStep";
import ServiceHistoryStep from "./steps/ServiceHistoryStep";
import PaymentStep from "./steps/PaymentStep";
import { Progress } from "@/components/ui/progress";

const TradeInValuationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    vehicleInfo: {
      make: "",
      model: "",
      year: "",
      trim: "",
      mileage: "",
      vin: "",
    },
    conditionReport: {
      exterior: {
        paint: "excellent",
        body: "excellent",
        wheels: "excellent",
        glass: "excellent",
      },
      interior: {
        seats: "excellent",
        dashboard: "excellent",
        electronics: "excellent",
        headliner: "excellent",
      },
      mechanical: {
        engine: "excellent",
        transmission: "excellent",
        brakes: "excellent",
        suspension: "excellent",
      },
    },
    serviceHistory: {
      hasServiceRecords: false,
      lastServiceDate: "",
      serviceNotes: "",
    },
    accidentHistory: false,
    location: "",
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload photos
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

      // Create trade-in request
      const { error } = await supabase.from("trade_in_requests").insert({
        user_id: user.id,
        vehicle_info: formData.vehicleInfo,
        condition_report: formData.conditionReport,
        photo_urls: photoUrls,
        mileage: parseInt(formData.vehicleInfo.mileage),
        accident_history: formData.accidentHistory,
        service_history: formData.serviceHistory.hasServiceRecords,
        location: formData.location,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your trade-in request has been submitted successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting trade-in request:", error);
      toast({
        title: "Error",
        description: "Failed to submit trade-in request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleInfoStep formData={formData} setFormData={setFormData} />
        );
      case 2:
        return <ConditionStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <PhotoUploadStep photos={photos} setPhotos={setPhotos} />;
      case 4:
        return (
          <ServiceHistoryStep formData={formData} setFormData={setFormData} />
        );
      case 5:
        return <PaymentStep onSuccess={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Trade-In Valuation Request</CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          {renderStep()}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                variant="outline"
              >
                Previous
              </Button>
            )}
            {currentStep < totalSteps && (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="ml-auto"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeInValuationForm;
