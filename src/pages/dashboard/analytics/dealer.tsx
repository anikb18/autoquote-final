import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealershipComparison } from "@/components/dashboard/DealershipComparison";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { MetricsOverview } from "@/components/dashboard/shared/MetricsOverview";
import { DollarSign, TrendingUp, Users, BarChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DealerPerformanceStats {
  dealer_id: string;
  dealer_name: string;
  total_sales: number;
  total_revenue: number;
  avg_profit_margin: number;
  total_quotes: number;
  accepted_quotes: number;
  conversion_rate: number;
}

export default function DealerAnalytics() {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { data: stats, isLoading } = useQuery<DealerPerformanceStats>({
    queryKey: ['dealer-performance-stats'],
    queryFn: async () => {
      const { data: canAccess } = await supabase.rpc('can_access_dealer_stats', {
        dealer_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (!canAccess) {
        throw new Error('Unauthorized access to dealer stats');
      }

      const { data, error } = await supabase
        .from('dealer_performance_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching dealer stats",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const dealerStats = [
    {
      id: 1,
      name: "Total Quotes",
      stat: stats?.total_quotes || 0,
      icon: BarChart,
      change: `${((stats?.accepted_quotes || 0) / (stats?.total_quotes || 1) * 100).toFixed(1)}%`,
      changeType: "increase" as const
    },
    {
      id: 2,
      name: "Total Sales",
      stat: stats?.total_sales || 0,
      icon: TrendingUp,
      change: `${stats?.conversion_rate.toFixed(1)}%`,
      changeType: "increase" as const
    },
    {
      id: 3,
      name: "Revenue",
      stat: stats?.total_revenue || 0,
      icon: DollarSign,
      change: `${stats?.avg_profit_margin.toFixed(1)}%`,
      changeType: "increase" as const,
      prefix: "$"
    },
    {
      id: 4,
      name: "Active Customers",
      stat: stats?.accepted_quotes || 0,
      icon: Users,
      change: "+12.3%",
      changeType: "increase" as const
    }
  ];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <Card className="border-none shadow-none md:border md:shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Dealer Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dealerStats.map((stat) => (
                  <Card key={stat.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.name}
                        </p>
                        <p className="text-2xl font-bold">
                          {stat.prefix}{typeof stat.stat === 'number' ? stat.stat.toLocaleString() : stat.stat}
                        </p>
                      </div>
                      <stat.icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="mt-4">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SalesTrendChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dealership Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DealershipComparison />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}