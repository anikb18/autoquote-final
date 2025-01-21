import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterManagement = () => {
  const { data: subscribers } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle>Newsletter Subscribers</CardTitle>
        <CardDescription>
          Total Subscribers: {subscribers?.length || 0}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {subscribers?.map((subscriber) => (
            <div 
              key={subscriber.id} 
              className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <span>{subscriber.email}</span>
              <span className="text-sm text-gray-500">
                Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};