import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ChatInterfaceProps {
  quoteId: string;
  dealerId?: string;
}

const ChatInterface = ({ quoteId, dealerId }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [autoTranslate, setAutoTranslate] = useState(false);
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat-messages', quoteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:sender_id (
            email,
            dealer_profiles (
              first_name,
              last_name,
              dealer_name
            )
          )
        `)
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `quote_id=eq.${quoteId}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', quoteId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [quoteId, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            quote_id: quoteId,
            content,
            sender_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', quoteId] });
      setMessage("");
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
    }
  };

  const translateMessage = async (text: string, targetLang: string) => {
    try {
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a translator. Translate the following text to ${targetLang}:`
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const getDealerName = (message: any) => {
    const dealerProfile = message.sender?.dealer_profiles?.[0];
    if (!dealerProfile) return message.sender?.email;

    // If this dealer's quote is accepted, show full name
    if (message.sender_id === dealerId) {
      return `${dealerProfile.first_name} ${dealerProfile.last_name}`;
    }
    // Otherwise only show first name
    return dealerProfile.first_name;
  };

  if (isLoading) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Chat</h3>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <Switch
              checked={autoTranslate}
              onCheckedChange={setAutoTranslate}
              id="auto-translate"
            />
            <Label htmlFor="auto-translate">Auto-translate</Label>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === (dealerId ?? '') ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender_id === (dealerId ?? '')
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm font-semibold">{getDealerName(msg)}</p>
                <p className="text-sm">{msg.content}</p>
                {autoTranslate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={async () => {
                      const translated = await translateMessage(msg.content, i18n.language);
                      // Update the message content in the UI
                      queryClient.setQueryData(['chat-messages', quoteId], (old: any) =>
                        old.map((m: any) =>
                          m.id === msg.id ? { ...m, content: translated } : m
                        )
                      );
                    }}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Translate
                  </Button>
                )}
                <span className="text-xs opacity-70">
                  {new Date(msg.created_at!).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
