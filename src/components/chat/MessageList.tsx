import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { MessageType } from "@/types/chat";

interface MessageListProps {
  messages: MessageType[];
  dealerId?: string;
  quoteAccepted: boolean;
  autoTranslate: boolean;
  onTranslate: (messageId: string) => Promise<void>;
}

export const MessageList = ({ 
  messages, 
  dealerId, 
  quoteAccepted,
  autoTranslate,
  onTranslate 
}: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages?.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isAccepted={quoteAccepted}
          />
        ))}
      </div>
    </ScrollArea>
  );
};