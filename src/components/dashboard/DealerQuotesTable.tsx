import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "../ui/countdown-timer";

interface Quote {
  id: string;
  car_details: {
    make: string;
    model: string;
    year: number;
  };
  status: string;
  created_at: string;
}

export const DealerQuotesTable = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['dealer-quotes'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_quotes')
        .select(`
          quote_id,
          quotes:quote_id (
            id,
            car_details,
            status,
            created_at
          )
        `)
        .eq('dealer_id', profile.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data.map(q => q.quotes) as Quote[];
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: t("dealer.quotes.error.title"),
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleQuoteResponse = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Calculate expiration time (24 hours from creation)
  const getExpirationTime = (createdAt: string) => {
    const created = new Date(createdAt);
    return new Date(created.getTime() + (24 * 60 * 60 * 1000));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t("dealer.quotes.recentTitle")}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dealer.quotes.vehicle")}</TableHead>
            <TableHead>{t("dealer.quotes.status")}</TableHead>
            <TableHead>{t("dealer.quotes.timeLeft")}</TableHead>
            <TableHead>{t("dealer.quotes.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes?.map((quote) => (
            <TableRow key={quote.id} className="group">
              <TableCell>
                {quote.car_details.year} {quote.car_details.make} {quote.car_details.model}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={quote.status === 'pending' ? 'secondary' : 'default'}
                  className="transition-all group-hover:scale-105"
                >
                  {t(`dealer.quotes.status.${quote.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <CountdownTimer 
                  endDate={getExpirationTime(quote.created_at)}
                  onExpire={() => {
                    toast({
                      title: t("dealer.quotes.expiration.title"),
                      description: t("dealer.quotes.expiration.description"),
                      variant: "destructive",
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleQuoteResponse(quote.id)}
                  variant={quote.status === 'pending' ? 'default' : 'secondary'}
                  className="flex items-center gap-2 transition-all hover:scale-105"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  {quote.status === 'pending' 
                    ? t("dealer.quotes.actions.respond")
                    : t("dealer.quotes.actions.view")
                  }
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};