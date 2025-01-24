import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import { CarDetails } from "@/types/quotes";

interface DealerChatData {
  id: string;
  quote_id: string;
  dealer_id: string;
  is_accepted: boolean;
  quotes: {
    id: string;
    car_details: CarDetails;
    user_id: string;
    user: {
      full_name: string | null;
    };
  };
}

const DealerChat = () => {
  const { data: activeChats, isLoading } = useQuery({
    queryKey: ['dealer-active-chats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_quotes')
        .select(`
          id,
          quote_id,
          is_accepted,
          dealer_id,
          quotes (
            id,
            car_details,
            user_id,
            user:profiles!user_id (
              full_name
            )
          )
        `)
        .eq('dealer_id', user.id)
        .eq('is_accepted', true);

      if (error) throw error;
      
      return (data as any[]).map(chat => ({
        ...chat,
        quotes: {
          ...chat.quotes,
          car_details: chat.quotes.car_details as CarDetails
        }
      })) as DealerChatData[];
    },
  });

  if (isLoading) {
    return <div>Loading chats...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <CardTitle>Active Conversations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {activeChats?.map((chat) => (
                <div key={chat.quote_id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {chat.quotes.car_details.year} {chat.quotes.car_details.make} {chat.quotes.car_details.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Customer: {chat.quotes.user?.full_name?.split(' ')[0] || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <ChatInterface
                    quoteId={chat.quote_id}
                    dealerId={chat.dealer_id}
                  />
                  <Separator className="my-4" />
                </div>
              ))}
              {(!activeChats || activeChats.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active conversations</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerChat;