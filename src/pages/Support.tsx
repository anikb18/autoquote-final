import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SupportTicketList from "@/components/support/SupportTicketList";
import SupportRequest from "@/components/support/SupportRequest";

export default function Support() {
  const { data: tickets } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-8">
        <SupportRequest />
        {tickets && <SupportTicketList tickets={tickets} />}
      </div>
    </div>
  );
}