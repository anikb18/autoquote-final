-- Create quotes table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  vehicle_details JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dealer_quotes junction table
CREATE TABLE dealer_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id) NOT NULL,
  dealer_id UUID REFERENCES auth.users NOT NULL,
  price NUMERIC NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (quote_id, dealer_id)
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id) NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  message TEXT NOT NULL,
  is_anon BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Quotes RLS Policies
CREATE POLICY "Users can manage their quotes" ON quotes
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dealers can view accepted quotes" ON quotes
FOR SELECT USING (EXISTS (
  SELECT 1 FROM dealer_quotes 
  WHERE dealer_quotes.quote_id = quotes.id 
  AND dealer_quotes.dealer_id = auth.uid()
  AND dealer_quotes.status = 'accepted'
));

-- Dealer Quotes RLS Policies
CREATE POLICY "Dealers can manage their quotes" ON dealer_quotes
FOR ALL USING (auth.uid() = dealer_id);

CREATE POLICY "Users can view their quotes" ON dealer_quotes
FOR SELECT USING (EXISTS (
  SELECT 1 FROM quotes 
  WHERE quotes.id = dealer_quotes.quote_id 
  AND quotes.user_id = auth.uid()
  AND quotes.status = 'accepted'
));

-- Chat Messages RLS Policies
CREATE POLICY "Participants can view messages" ON chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM quotes
    WHERE quotes.id = chat_messages.quote_id
    AND (quotes.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM dealer_quotes
      WHERE dealer_quotes.quote_id = chat_messages.quote_id
      AND dealer_quotes.dealer_id = auth.uid()
    ))
  )
);

CREATE POLICY "Participants can send messages" ON chat_messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM quotes
    WHERE quotes.id = chat_messages.quote_id
    AND (quotes.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM dealer_quotes
      WHERE dealer_quotes.quote_id = chat_messages.quote_id
      AND dealer_quotes.dealer_id = auth.uid()
    ))
  )
);
