import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealerMetricsSection } from "./dashboard/DealerMetricsSection";
import { DealerQuotesTable } from "./dashboard/DealerQuotesTable";
import { PerformanceChart, type PerformanceData } from "./dashboard/PerformanceChart";
import { WelcomeHeader } from "./dashboard/dealer/WelcomeHeader";
import { NotificationHandler } from "./dashboard/dealer/NotificationHandler";

const DealerDashboard = () => {
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

  // Fetch initial unread notifications count
  useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count } = await supabase
        .from('dealer_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('dealer_id', user.id)
        .eq('read', false);

      setUnreadNotifications(count || 0);
      return count;
    },
  });

  return (
    <div className="p-6 space-y-8 macOS-style">
      <WelcomeHeader unreadNotifications={unreadNotifications} />

      <NotificationHandler
        dealerId={profile?.id}
        onNotificationReceived={() => setUnreadNotifications(prev => prev + 1)}
      />

      <DealerMetricsSection />

      <DealerQuotesTable />

      <PerformanceChart data={performanceData || []} />
    </div>
  );
};

export default DealerDashboard;
