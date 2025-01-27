import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ConditionStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const conditions = ["excellent", "good", "fair", "poor"];

const ConditionStep = ({ formData, setFormData }: ConditionStepProps) => {
  const handleConditionChange = (
    category: string,
    subcategory: string,
    value: string,
  ) => {
    setFormData({
      ...formData,
      conditionReport: {
        ...formData.conditionReport,
        [category]: {
          ...formData.conditionReport[category],
          [subcategory]: value,
        },
      },
    });
  };

  const renderConditionSection = (
    title: string,
    category: string,
    items: string[],
  ) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {items.map((item) => (
        <div key={item} className="space-y-2">
          <Label className="capitalize">{item}</Label>
          <RadioGroup
            value={formData.conditionReport[category][item]}
            onValueChange={(value) =>
              handleConditionChange(category, item, value)
            }
            className="flex space-x-4"
          >
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={condition}
                  id={`${category}-${item}-${condition}`}
                />
                <Label
                  htmlFor={`${category}-${item}-${condition}`}
                  className="capitalize"
                >
                  {condition}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {renderConditionSection("Exterior Condition", "exterior", [
        "paint",
        "body",
        "wheels",
        "glass",
      ])}
      {renderConditionSection("Interior Condition", "interior", [
        "seats",
        "dashboard",
        "electronics",
        "headliner",
      ])}
      {renderConditionSection("Mechanical Condition", "mechanical", [
        "engine",
        "transmission",
        "brakes",
        "suspension",
      ])}
    </div>
  );
};

export default ConditionStep;
