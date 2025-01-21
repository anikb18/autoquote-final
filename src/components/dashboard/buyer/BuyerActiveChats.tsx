import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import ChatInterface from "@/components/ChatInterface";

export const BuyerActiveChats = () => {
  const { t } = useTranslation();
  
  const { data: activeChats, isLoading } = useQuery({
    queryKey: ['buyer-active-chats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          car_details,
          dealer_quotes!inner (
            dealer_id,
            dealer_profiles (
              dealer_name
            )
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('dealer_quotes.is_accepted', true);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.activeChats')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeChats?.map((chat) => (
          <div key={chat.id}>
            <h3 className="font-semibold mb-2">
              {chat.dealer_quotes[0].dealer_profiles?.dealer_name} - {formatCarDetails(chat.car_details)}
            </h3>
            <ChatInterface 
              quoteId={chat.id} 
              dealerId={chat.dealer_quotes[0].dealer_id}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};