import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageType } from "@/types/chat";

interface ChatMessageProps {
  message: MessageType;
  isAccepted: boolean;
}

export const ChatMessage = ({ message, isAccepted }: ChatMessageProps) => {
  const { data: senderProfile } = useQuery({
    queryKey: ['user-profile', message.sender_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', message.sender_id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const displayName = senderProfile ? (
    isAccepted ? 
      senderProfile.full_name : 
      senderProfile.full_name.split(' ')[0] // Only show first name if quote not accepted
  ) : 'Unknown User';

  return (
    <div className="flex items-start space-x-4 p-4">
      <Avatar>
        <AvatarImage src={message.sender?.avatar_url} />
        <AvatarFallback>
          {displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.created_at), 'MMM d, h:mm a')}
          </span>
        </div>
        <p className="text-sm text-foreground">{message.content}</p>
      </div>
    </div>
  );
};