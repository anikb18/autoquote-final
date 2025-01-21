import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { translateMessage } from "@/services/translation";
import { ChatProps, MessageType } from "@/types/chat";

const ChatInterface = ({ quoteId, dealerId }: ChatProps) => {
  const [autoTranslate, setAutoTranslate] = useState(false);
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat-messages', quoteId],
    queryFn: async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          quote_id,
          sender:profiles!sender_id(
            email,
            dealer_profiles(
              first_name,
              last_name,
              dealer_name
            )
          )
        `)
        .eq('quote_id', quoteId);
      
      if (messagesError) throw messagesError;
      return messagesData as MessageType[];
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
        .maybeSingle();
      
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

  const handleTranslate = async (messageId: string) => {
    const message = messages?.find(m => m.id === messageId);
    if (!message) return;

    const translated = await translateMessage(message.content, i18n.language);
    queryClient.setQueryData(['chat-messages', quoteId], (old: any) =>
      old.map((m: any) =>
        m.id === messageId ? { ...m, content: translated } : m
      )
    );
  };

  if (isLoading) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      <ChatHeader 
        autoTranslate={autoTranslate}
        onAutoTranslateChange={setAutoTranslate}
      />
      
      <MessageList
        messages={messages || []}
        dealerId={dealerId}
        quoteAccepted={quoteDetails?.is_accepted ?? false}
        autoTranslate={autoTranslate}
        onTranslate={handleTranslate}
      />

      <ChatInput onSendMessage={(message) => sendMessage.mutate(message)} />
    </div>
  );
};

export default ChatInterface;