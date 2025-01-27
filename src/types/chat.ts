export interface MessageType {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    email?: string;
    dealer_profiles?: Array<{
      first_name?: string;
      last_name?: string;
      dealer_name?: string;
    }>;
  };
}

export interface ChatProps {
  quoteId: string;
  dealerId?: string;
}
