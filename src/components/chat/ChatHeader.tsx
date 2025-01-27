import React from "react";
import { MessageCircle, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ChatHeaderProps {
  autoTranslate: boolean;
  onAutoTranslateChange: (checked: boolean) => void;
}

export const ChatHeader = ({
  autoTranslate,
  onAutoTranslateChange,
}: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-semibold">Chat</h3>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <Switch
            checked={autoTranslate}
            onCheckedChange={onAutoTranslateChange}
            id="auto-translate"
          />
          <Label htmlFor="auto-translate">Auto-translate</Label>
        </div>
      </div>
    </div>
  );
};
