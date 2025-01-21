import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealerMetricsSection } from "./dashboard/DealerMetricsSection";
import { DealerQuotesTable } from "./dashboard/DealerQuotesTable";
import { PerformanceChart, type PerformanceData } from "./dashboard/PerformanceChart";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";

const DealerDashboard = () => {
  const { toast } = useToast();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const { data: profile } = useQuery({
    queryKey: ['dealer-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: performanceData } = useQuery({
    queryKey: ['dealer-performance'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_analytics')
        .select('*')
        .eq('dealer_id', user.id)
        .order('period_start', { ascending: true });

      if (error) throw error;

      return data.map(record => ({
        period: new Date(record.period_start).toLocaleDateString('en-US', { month: 'short' }),
        conversionRate: record.conversion_rate || 0,
        responseTime: typeof record.quote_response_time === 'number' ? record.quote_response_time : 0,
        revenue: record.total_revenue || 0,
      })) as PerformanceData[];
    },
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    const channel = supabase
      .channel('dealer-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dealer_notifications',
          filter: `dealer_id=eq.${profile?.id}`,
        },
        (payload) => {
          toast({
            title: "New Notification",
            description: "You have a new quote request.",
          });
          setUnreadNotifications((prev) => prev + 1);
        }
      )
      .subscribe();

    // Fetch initial unread notifications count
    const fetchUnreadNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('dealer_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('dealer_id', user.id)
        .eq('read', false);

      setUnreadNotifications(count || 0);
    };

    fetchUnreadNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, toast]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile?.dealer_name}</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your dealership today
          </p>
        </div>
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
          {unreadNotifications > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-500"
            >
              {unreadNotifications}
            </Badge>
          )}
        </div>
      </div>
      
      <DealerMetricsSection />
      
      <DealerQuotesTable />
      
      <PerformanceChart data={performanceData || []} />
    </div>
  );
};

export default DealerDashboard;