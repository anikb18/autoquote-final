import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: string;
  created_at: string;
  message: string;
}

interface SupportTicketListProps {
  tickets: SupportTicket[];
}

export function SupportTicketList({ tickets }: SupportTicketListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="border p-4 rounded-lg">
          <h3 className="font-semibold">{ticket.subject}</h3>
          <p className="text-sm text-gray-600">{ticket.category}</p>
          <p className="text-sm">{ticket.message}</p>
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/support/ticket/${ticket.id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SupportTicketList;