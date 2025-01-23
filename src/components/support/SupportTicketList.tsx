import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { SupportTicketResponse } from "./SupportTicketResponse";

interface SupportTicketListProps {
  userOnly: boolean;
}

export function SupportTicketList({ userOnly }: SupportTicketListProps) {
  const { t } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets', userOnly],
    queryFn: async () => {
      const query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (userOnly) {
        query.eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-4">{t('common.loading')}</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('support.subject')}</TableHead>
            <TableHead>{t('support.category')}</TableHead>
            <TableHead>{t('support.status')}</TableHead>
            <TableHead>{t('support.created')}</TableHead>
            <TableHead>{t('support.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets?.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.category}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(ticket.status)}>
                  {t(`support.status.${ticket.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(ticket.created_at), 'PPp')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('support.viewResponses')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedTicket && (
        <SupportTicketResponse
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}