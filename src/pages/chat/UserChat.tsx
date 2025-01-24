import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

interface CarDetails {
  year: number;
  make: string;
  model: string;
}

interface UserChatData {
  id: string;
  car_details: CarDetails;
  dealer_quotes: Array<{
    id: string;
    dealer_id: string;
    is_accepted: boolean;
    dealer_profiles: {
      dealer_name: string;
      first_name: string;
      last_name: string;
    };
  }>;
}

const UserChat = () => {
  const { data: activeChats, isLoading } = useQuery({
    queryKey: ['user-active-chats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          car_details,
          dealer_quotes!inner (
            id,
            dealer_id,
            is_accepted,
            dealer_profiles:dealer_profiles!dealer_quotes_dealer_id_fkey (
              dealer_name,
              first_name,
              last_name
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('dealer_quotes.is_accepted', true);

      if (error) throw error;
      
      return (data as any[]).map(chat => ({
        ...chat,
        car_details: chat.car_details as CarDetails
      })) as UserChatData[];
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
            <CardTitle>My Conversations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {activeChats?.map((chat) => (
                <div key={chat.id} className="space-y-4">
                  {chat.dealer_quotes.map((dealerQuote) => (
                    <div key={dealerQuote.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {chat.car_details.year} {chat.car_details.make} {chat.car_details.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Dealer: {dealerQuote.dealer_profiles.dealer_name}
                          </p>
                        </div>
                      </div>
                      <ChatInterface
                        quoteId={chat.id}
                        dealerId={dealerQuote.dealer_id}
                      />
                      <Separator className="my-4" />
                    </div>
                  ))}
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

export default UserChat;