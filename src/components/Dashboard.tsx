import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomToast } from "./notifications/CustomToast";
import { DashboardLayout } from "./layouts/DashboardLayout";

const Dashboard = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Listen for new chat messages
    const chatChannel = supabase
      .channel('chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        async (payload) => {
          const { data: sender } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', payload.new.sender_id)
            .single();

          toast({
            description: (
              <CustomToast
                title={sender?.full_name || sender?.email || 'New message'}
                description="You have received a new message"
                imageUrl="/avatar.png"
              />
            ),
            duration: 5000,
          });
        }
      )
      .subscribe();

    // Listen for new quotes
    const quoteChannel = supabase
      .channel('quote-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dealer_quotes'
        },
        async (payload) => {
          const { data: dealer } = await supabase
            .from('dealer_profiles')
            .select('dealer_name')
            .eq('id', payload.new.dealer_id)
            .single();

          toast({
            description: (
              <CustomToast
                title={dealer?.dealer_name || 'New quote'}
                description="You have received a new quote"
                imageUrl="/avatar.png"
              />
            ),
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(quoteChannel);
    };
  }, [toast]);

  return (
    <DashboardLayout>
      {/* Your existing dashboard content goes here */}
    </DashboardLayout>
  );
};

export default Dashboard;
