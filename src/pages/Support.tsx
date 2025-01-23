import { useState } from "react";
import { SupportRequest } from "@/components/support/SupportRequest";
import { SupportTicketList } from "@/components/support/SupportTicketList";
import { useUserRole } from "@/hooks/use-user-role";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Support() {
  const { t } = useTranslation();
  const { role } = useUserRole();
  const [activeTab, setActiveTab] = useState("new-request");

  // Query for unread responses/messages count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-support-messages'],
    queryFn: async () => {
      if (role === 'admin') {
        // For admins, count unread tickets
        const { count } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
        return count || 0;
      } else {
        // For users/dealers, count unread admin responses
        const { data: responses } = await supabase
          .from('support_responses')
          .select('*')
          .eq('is_admin_response', true);
          
        // Since we don't have a read status column, we'll just show the total number
        // of admin responses for now. In a future update, we should add a read status column
        return responses?.length || 0;
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const pageTitle = role === 'admin' ? 'Tickets Center' : 'Support';

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold">{t(`support.${pageTitle}`)}</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 rounded-full flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            {role === 'admin' ? (
              <>
                <TabsTrigger value="all-tickets">
                  {t('support.allTickets')}
                </TabsTrigger>
                <TabsTrigger value="open-tickets">
                  {t('support.openTickets')}
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="new-request">
                  {t('support.newRequest')}
                </TabsTrigger>
                <TabsTrigger value="my-tickets">
                  {t('support.myTickets')}
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {role === 'admin' ? (
            <>
              <TabsContent value="all-tickets">
                <SupportTicketList userOnly={false} />
              </TabsContent>
              <TabsContent value="open-tickets">
                <SupportTicketList userOnly={false} status="open" />
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="new-request">
                <SupportRequest />
              </TabsContent>
              <TabsContent value="my-tickets">
                <SupportTicketList userOnly={true} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}