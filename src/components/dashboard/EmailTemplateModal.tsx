import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const EMAIL_TEMPLATES = [
  {
    title: "New Vehicle Arrival",
    description: "Announce new vehicle models to subscribers",
    fields: [
      { name: "vehicleMake", label: "Vehicle Make", placeholder: "e.g., Honda" },
      { name: "vehicleModel", label: "Vehicle Model", placeholder: "e.g., Civic" },
      { name: "yearModel", label: "Year", placeholder: "e.g., 2024" },
      { name: "keyFeatures", label: "Key Features", placeholder: "e.g., Hybrid engine, panoramic roof" }
    ]
  },
  {
    title: "Special Financing Offer",
    description: "Promote special financing rates and terms",
    fields: [
      { name: "interestRate", label: "Interest Rate", placeholder: "e.g., 1.9%" },
      { name: "termLength", label: "Term Length", placeholder: "e.g., 48 months" },
      { name: "minimumDownPayment", label: "Minimum Down Payment", placeholder: "e.g., $2,000" },
      { name: "eligibleModels", label: "Eligible Models", placeholder: "e.g., All 2024 SUVs" }
    ]
  },
  {
    title: "Trade-In Promotion",
    description: "Encourage vehicle trade-ins with special offers",
    fields: [
      { name: "minimumValue", label: "Minimum Trade-In Value", placeholder: "e.g., $3,000" },
      { name: "bonusAmount", label: "Additional Bonus", placeholder: "e.g., $500" },
      { name: "validUntil", label: "Valid Until", placeholder: "e.g., March 31, 2024" },
      { name: "conditions", label: "Special Conditions", placeholder: "e.g., Must be 2018 or newer" }
    ]
  },
  {
    title: "Service Special",
    description: "Promote maintenance services and packages",
    fields: [
      { name: "serviceType", label: "Service Type", placeholder: "e.g., Winter Maintenance Package" },
      { name: "discount", label: "Discount Amount", placeholder: "e.g., 15% off" },
      { name: "includedServices", label: "Included Services", placeholder: "e.g., Oil change, tire rotation" },
      { name: "validPeriod", label: "Valid Period", placeholder: "e.g., January 15-31, 2024" }
    ]
  }
];

interface EmailTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentGenerated: (content: string) => void;
}

export function EmailTemplateModal({ 
  open, 
  onOpenChange, 
  onContentGenerated 
}: EmailTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof EMAIL_TEMPLATES[0] | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async (templateData: any) => {
    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        Write a professional email for AutoQuote24, Quebec Canada's leading specialized car buying and selling platform.
        
        Business Context:
        - Platform specializes in streamlined vehicle purchases through private bidding
        - Dealers submit private bids without seeing competitors' offers
        - System automatically selects top 3 lowest price quotes
        - Trade-in value assessment available
        - Target audience: Quebec car buyers and sellers
        - Buyers pay $49.95 for quote service
        - Trade-in valuation costs $16.95
        - Dealer subscriptions: $1595/mo for new car quotes, $1895/mo including used car buyouts
        
        Email Type: ${templateData.title}
        
        Specific Details to Include:
        ${Object.entries(templateData.values || {})
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n')}
        
        Requirements:
        - Write in a professional but friendly tone
        - Include clear call-to-action
        - Keep paragraphs short and scannable
        - Include both English and French versions
        - Focus on value proposition and benefits
        - Include AutoQuote24's unique selling points where relevant
        - Emphasize cost savings and competitive advantages
        
        Format the email in HTML with appropriate styling.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      onContentGenerated(text);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Email content generated successfully!"
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: typeof EMAIL_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setFieldValues({});
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleGenerate = () => {
    if (selectedTemplate) {
      generateContent({
        title: selectedTemplate.title,
        values: fieldValues
      });
    } else if (customTopic) {
      generateContent({
        title: "Custom Topic",
        values: { topic: customTopic }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Email Content</DialogTitle>
          <DialogDescription>
            Choose a template or enter your own topic to generate professional email content
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            {!selectedTemplate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EMAIL_TEMPLATES.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left flex flex-col items-start space-y-2"
                    onClick={() => handleTemplateSelect(template)}
                    disabled={isGenerating}
                  >
                    <span className="font-semibold">{template.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {template.description}
                    </span>
                  </Button>
                ))}
              </div>
            )}

            {selectedTemplate && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{selectedTemplate.title}</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Choose Different Template
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Input
                        id={field.name}
                        placeholder={field.placeholder}
                        value={fieldValues[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedTemplate && (
              <div className="space-y-2">
                <Label htmlFor="customTopic">Custom Topic</Label>
                <div className="flex gap-2">
                  <Input
                    id="customTopic"
                    placeholder="Enter your topic..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end p-4 border-t">
          {(selectedTemplate || customTopic) && (
            <Button
              onClick={handleGenerate}
              disabled={
                (selectedTemplate && Object.keys(fieldValues).length === 0) || 
                (!selectedTemplate && !customTopic) || 
                isGenerating
              }
              className="w-full sm:w-auto"
            >
              {isGenerating ? "Generating..." : "Generate Email Content"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}