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
  status?: string;
  tickets: any[];
}

export function SupportTicketList({ userOnly, status, tickets }: SupportTicketListProps) {
  const { t } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('support.subject')}</TableHead>
              <TableHead>{t('support.category')}</TableHead>
              <TableHead>{t('support.status')}</TableHead>
              <TableHead>{t('support.created')}</TableHead>
              <TableHead className="text-right">{t('support.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.subject}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'}>
                    {t(`support.status.${ticket.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(ticket.created_at), 'PPp')}
                </TableCell>
                <TableCell className="text-right">
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
      </div>

      {selectedTicket && (
        <SupportTicketResponse
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}