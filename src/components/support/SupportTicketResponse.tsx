import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import { Database } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type SupportResponse = Database['public']['Tables']['support_responses']['Row'];

interface SupportTicketResponseProps {
  ticketId: string;
  onClose: () => void;
}

export function SupportTicketResponse({ ticketId, onClose }: SupportTicketResponseProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { role } = useUserRole();
  const [newResponse, setNewResponse] = useState("");
  const queryClient = useQueryClient();

  const { data: responses } = useQuery({
    queryKey: ['ticket-responses', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as SupportResponse[];
    }
  });

  const sendResponse = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('support_responses')
        .insert([{
          ticket_id: ticketId,
          response: newResponse,
          responder_id: user.id,
          is_admin_response: role === 'admin'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t('support.responseSubmitted'),
        description: t('support.responseSubmittedDesc'),
      });
      setNewResponse("");
      queryClient.invalidateQueries({ queryKey: ['ticket-responses', ticketId] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('support.responseError'),
        variant: "destructive",
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold">{t('support.responses')}</h2>
          <p className="text-sm text-muted-foreground">
            {role === 'admin' ? t('support.adminResponsePrompt') : t('support.userResponsePrompt')}
          </p>
        </div>
        
        <Separator />
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
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
                <span className="text-xs text-muted-foreground mt-2 block">
                  {new Date(response.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

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
            <Button 
              onClick={() => sendResponse.mutate()}
              disabled={!newResponse.trim() || sendResponse.isPending}
            >
              {t('support.sendResponse')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}