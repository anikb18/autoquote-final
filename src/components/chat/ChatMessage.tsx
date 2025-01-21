import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    sender?: {
      email?: string;
      dealer_profiles?: Array<{
        first_name?: string;
        last_name?: string;
        dealer_name?: string;
      }>;
    };
  };
  isDealer: boolean;
  quoteAccepted: boolean;
  onTranslate: () => Promise<void>;
  showTranslate: boolean;
}

export const ChatMessage = ({ 
  message, 
  isDealer, 
  quoteAccepted,
  onTranslate,
  showTranslate 
}: ChatMessageProps) => {
  const getSenderName = () => {
    const dealerProfile = message.sender?.dealer_profiles?.[0];
    if (!dealerProfile) return message.sender?.email;

    if (isDealer) {
      return quoteAccepted 
        ? `${dealerProfile.first_name} ${dealerProfile.last_name}`
        : dealerProfile.first_name;
    }
    return dealerProfile.dealer_name;
  };

  return (
    <div className={`flex ${isDealer ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isDealer ? 'bg-muted' : 'bg-primary text-primary-foreground'
        }`}
      >
        <p className="text-sm font-semibold">{getSenderName()}</p>
        <p className="text-sm">{message.content}</p>
        {showTranslate && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={onTranslate}
          >
            <Globe className="h-3 w-3 mr-1" />
            Translate
          </Button>
        )}
        <span className="text-xs opacity-70">
          {new Date(message.created_at).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};