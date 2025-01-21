import ChatInterface from "@/components/ChatInterface";
import { DealerQuoteResponse } from "./DealerQuoteResponse";
import { DealerQuote } from "@/types/quotes";

interface DealerQuoteItemProps {
  dealerQuote: DealerQuote;
  quoteId: string;
  hasTradeIn?: boolean;
}

export const DealerQuoteItem = ({ dealerQuote, quoteId, hasTradeIn = false }: DealerQuoteItemProps) => {
  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold">
        {dealerQuote.dealer_profile?.dealer_name}
      </h3>
      {dealerQuote.is_accepted ? (
        <ChatInterface
          quoteId={quoteId}
          dealerId={dealerQuote.dealer_id}
        />
      ) : (
        <DealerQuoteResponse quoteId={quoteId} hasTradeIn={hasTradeIn} />
      )}
    </div>
  );
};