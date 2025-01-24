import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ServiceHistoryStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const ServiceHistoryStep = ({ formData, setFormData }: ServiceHistoryStepProps) => {
  const handleServiceHistoryChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      serviceHistory: {
        ...formData.serviceHistory,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="hasServiceRecords">Do you have service records?</Label>
        <Switch
          id="hasServiceRecords"
          checked={formData.serviceHistory.hasServiceRecords}
          onCheckedChange={(checked) => handleServiceHistoryChange('hasServiceRecords', checked)}
        />
      </div>

      {formData.serviceHistory.hasServiceRecords && (
        <>
          <div className="space-y-2">
            <Label htmlFor="lastServiceDate">Last Service Date</Label>
            <Input
              type="date"
              id="lastServiceDate"
              value={formData.serviceHistory.lastServiceDate}
              onChange={(e) => handleServiceHistoryChange('lastServiceDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceNotes">Service History Notes</Label>
            <Textarea
              id="serviceNotes"
              value={formData.serviceHistory.serviceNotes}
              onChange={(e) => handleServiceHistoryChange('serviceNotes', e.target.value)}
              placeholder="Please provide details about maintenance history, repairs, etc."
              className="h-32"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label>Has the vehicle been in any accidents?</Label>
        <RadioGroup
          value={formData.accidentHistory ? "yes" : "no"}
          onValueChange={(value) => setFormData({
            ...formData,
            accidentHistory: value === "yes"
          })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="accident-no" />
            <Label htmlFor="accident-no">No accidents</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="accident-yes" />
            <Label htmlFor="accident-yes">Yes, has been in accident(s)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({
            ...formData,
            location: e.target.value
          })}
          placeholder="City, Province"
          required
        />
      </div>
    </div>
  );
};

export default ServiceHistoryStep;