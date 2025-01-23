import { useState } from "react";
import { SupportRequest } from "@/components/support/SupportRequest";
import { SupportTicketList } from "@/components/support/SupportTicketList";
import { useUserRole } from "@/hooks/use-user-role";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export default function Support() {
  const { t } = useTranslation();
  const { role } = useUserRole();
  const [activeTab, setActiveTab] = useState("new-request");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t('support.title')}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-request">
            {t('support.newRequest')}
          </TabsTrigger>
          <TabsTrigger value="my-tickets">
            {t('support.myTickets')}
          </TabsTrigger>
          {role === 'admin' && (
            <TabsTrigger value="all-tickets">
              {t('support.allTickets')}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="new-request" className="space-y-4">
          <SupportRequest />
        </TabsContent>

        <TabsContent value="my-tickets">
          <SupportTicketList userOnly={true} />
        </TabsContent>

        {role === 'admin' && (
          <TabsContent value="all-tickets">
            <SupportTicketList userOnly={false} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}