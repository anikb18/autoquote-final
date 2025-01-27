import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: string;
  created_at: string;
  message: string;
  support_responses: { count: number };
}

interface SupportTicketListProps {
  tickets: SupportTicket[];
  isAdmin?: boolean;
  onTicketRead?: () => void;
}

export function SupportTicketList({
  tickets,
  isAdmin,
  onTicketRead,
}: SupportTicketListProps) {
  const navigate = useNavigate();

  const handleTicketClick = (ticketId: string) => {
    if (onTicketRead) {
      onTicketRead();
    }
    navigate(`/support/ticket/${ticketId}`);
  };

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {isAdmin
            ? "No support tickets to review"
            : "No support tickets found"}
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{ticket.subject}</h3>
              <div className="flex items-center gap-2">
                {ticket.support_responses?.count > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    {ticket.support_responses.count}
                  </Badge>
                )}
                <Badge
                  variant={ticket.status === "open" ? "destructive" : "default"}
                >
                  {ticket.status}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600">{ticket.category}</p>
            <p className="text-sm line-clamp-2 mb-2">{ticket.message}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {new Date(ticket.created_at).toLocaleDateString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTicketClick(ticket.id)}
              >
                {isAdmin ? "Review Ticket" : "View Details"}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SupportTicketList;
