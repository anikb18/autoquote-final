import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SupportTicketList from "@/components/support/SupportTicketList";
import SupportRequest from "@/components/support/SupportRequest";

export default function Support() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTickets(data);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <SupportRequest />
      <SupportTicketList tickets={tickets} />
    </div>
  );
}