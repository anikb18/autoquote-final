import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SupportTicketResponseProps {
  ticketId: string;
  onClose: () => void;
}

export function SupportTicketResponse({ ticketId, onClose }: SupportTicketResponseProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { role } = useUserRole();
  const [newResponse, setNewResponse] = useState("");

  const { data: responses, refetch } = useQuery({
    queryKey: ['ticket-responses', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmitResponse = async () => {
    try {
      const { error } = await supabase
        .from('support_responses')
        .insert([
          {
            ticket_id: ticketId,
            response: newResponse,
            responder_id: (await supabase.auth.getUser()).data.user?.id,
            is_admin_response: role === 'admin'
          }
        ]);

      if (error) throw error;

      toast({
        title: t('support.responseSubmitted'),
        description: t('support.responseSubmittedDesc'),
      });

      setNewResponse("");
      refetch();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('support.responseError'),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('support.responses')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {responses?.map((response) => (
              <div
                key={response.id}
                className={`p-4 rounded-lg ${
                  response.is_admin_response
                    ? 'bg-primary/10 ml-4'
                    : 'bg-muted mr-4'
                }`}
              >
                <p className="text-sm">{response.response}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              placeholder={t('support.writeResponse')}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSubmitResponse} disabled={!newResponse.trim()}>
                {t('support.sendResponse')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}