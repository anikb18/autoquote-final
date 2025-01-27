import { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SupportTicketList from "@/components/support/SupportTicketList";
import SupportRequest from "@/components/support/SupportRequest";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { role } = useUserRole();
  const { toast } = useToast();
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from("support_tickets")
          .select(
            `
            *,
            support_responses(count)
          `,
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTickets(data || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load support tickets",
          variant: "destructive",
        });
      }
    };

    fetchTickets();

    // Set up realtime subscription for new tickets and responses
    const channel = supabase
      .channel("support-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_tickets",
        },
        () => {
          fetchTickets();
          setUnreadCount((prev) => prev + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isAdmin ? "Support Center Administration" : "Support Center"}
        </h1>
        {isAdmin && unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <Badge variant="destructive">{unreadCount} new</Badge>
          </div>
        )}
      </div>

      {!isAdmin && <SupportRequest />}
      <SupportTicketList
        tickets={tickets}
        isAdmin={isAdmin}
        onTicketRead={() => setUnreadCount((prev) => Math.max(0, prev - 1))}
      />
    </div>
  );
}
