import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminMetricsCards = () => {
  const { data: salesData } = useQuery({
    queryKey: ['sales-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_transactions')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: dealerStats } = useQuery({
    queryKey: ['dealer-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_profiles')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: blogPosts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
          <CardDescription>Monthly overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${salesData?.reduce((acc, curr) => acc + (curr.selling_price || 0), 0).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Active Dealers</CardTitle>
          <CardDescription>Currently registered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dealerStats?.length || 0}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
          <CardDescription>All registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userStats?.length || 0}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
          <CardDescription>Quotes to Sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {salesData && salesData.length > 0
              ? `${((salesData.length / (blogPosts?.length || 1)) * 100).toFixed(1)}%`
              : '0%'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};