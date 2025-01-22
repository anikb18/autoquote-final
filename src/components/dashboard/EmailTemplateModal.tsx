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

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const EMAIL_TEMPLATES = [
  {
    title: "New Product Launch",
    description: "Announce a new product or service to your subscribers",
    prompt: "Write a professional and engaging email announcing a new product launch. The tone should be exciting but professional. Include sections for key features, benefits, and a clear call to action."
  },
  {
    title: "Special Promotion",
    description: "Share a limited-time offer or discount",
    prompt: "Create a compelling email for a special promotion that creates urgency without being pushy. Include clear terms, benefits, and how to claim the offer."
  },
  {
    title: "Monthly Newsletter",
    description: "Regular updates about your business and industry",
    prompt: "Write a friendly monthly newsletter that includes company updates, industry insights, and valuable tips for readers. The tone should be informative but conversational."
  },
  {
    title: "Customer Appreciation",
    description: "Thank your customers and share exclusive benefits",
    prompt: "Compose a heartfelt customer appreciation email that makes subscribers feel valued. Include exclusive offers or early access to new features."
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
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`
        Write a professional newsletter email with the following requirements:
        - Topic: ${prompt}
        - Tone: Professional but friendly
        - Structure: Clear sections with headers
        - Length: Concise but comprehensive
        - Include: Introduction, main content, and call to action
        - Format: Use HTML formatting for better presentation
        
        Important guidelines:
        - Keep paragraphs short and scannable
        - Use bullet points for key information
        - Include a clear call-to-action
        - Avoid excessive formatting
        - Make it personal and engaging
      `);
      const response = await result.response;
      const text = response.text();
      onContentGenerated(text);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Email content generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Email Content</DialogTitle>
          <DialogDescription>
            Choose a template or enter your own topic to generate professional email content
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {EMAIL_TEMPLATES.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left flex flex-col items-start space-y-2"
                  onClick={() => generateContent(template.prompt)}
                  disabled={isGenerating}
                >
                  <span className="font-semibold">{template.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {template.description}
                  </span>
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Custom Topic</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your topic..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  disabled={isGenerating}
                />
                <Button 
                  onClick={() => generateContent(customTopic)}
                  disabled={!customTopic || isGenerating}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}