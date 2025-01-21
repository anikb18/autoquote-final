import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";

interface ChatInterfaceProps {
  quoteId: string;
  dealerId?: string;
}

const ChatInterface = ({ quoteId, dealerId }: ChatInterfaceProps) => {
  const [autoTranslate, setAutoTranslate] = useState(false);
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat-messages', quoteId],
    queryFn: async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!inner(
            email,
            dealer_profiles(
              first_name,
              last_name,
              dealer_name
            )
          )
        `)
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });
      
      if (messagesError) throw messagesError;
      return messagesData;
    },
  });

  const { data: quoteDetails } = useQuery({
    queryKey: ['quote-details', quoteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_quotes')
        .select('is_accepted')
        .eq('quote_id', quoteId)
        .eq('dealer_id', dealerId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

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
        () => {
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
    },
  });

  const translateMessage = async (text: string, targetLang: string) => {
    try {
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
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

  if (isLoading) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      <ChatHeader 
        autoTranslate={autoTranslate}
        onAutoTranslateChange={setAutoTranslate}
      />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isDealer={msg.sender_id === dealerId}
              quoteAccepted={quoteDetails?.is_accepted ?? false}
              showTranslate={autoTranslate}
              onTranslate={async () => {
                const translated = await translateMessage(msg.content, i18n.language);
                queryClient.setQueryData(['chat-messages', quoteId], (old: any) =>
                  old.map((m: any) =>
                    m.id === msg.id ? { ...m, content: translated } : m
                  )
                );
              }}
            />
          ))}
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={(message) => sendMessage.mutate(message)} />
    </div>
  );
};

export default ChatInterface;
