import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationHandlerProps {
  dealerId?: string;
  onNotificationReceived: () => void;
}

export const NotificationHandler = ({
  dealerId,
  onNotificationReceived,
}: NotificationHandlerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!dealerId) return;

    const channel = supabase
      .channel("dealer-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dealer_notifications",
          filter: `dealer_id=eq.${dealerId}`,
        },
        () => {
          toast({
            title: "New Notification",
            description: "You have a new quote request.",
          });
          onNotificationReceived();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dealerId, toast, onNotificationReceived]);

  return null;
};
