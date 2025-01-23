import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DealershipData {
  name: string;
  revenue: number;
}

export const DealershipComparison = () => {
  const { theme } = useTheme();

  const { data: dealershipData } = useQuery<DealershipData[]>({
    queryKey: ['dealership-comparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_transactions')
        .select(`
          dealer_id,
          dealer_profiles!inner(
            dealer_name
          ),
          selling_price
        `)
        .order('selling_price', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data.map(item => ({
        name: item.dealer_profiles?.dealer_name || 'Unknown Dealer',
        revenue: item.selling_price
      }));
    }
  });

  const chartColors = {
    stroke: theme === 'dark' ? '#fff' : '#000',
    grid: theme === 'dark' ? '#333' : '#eee',
    bar: theme === 'dark' ? '#7c3aed' : '#4f46e5'
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dealershipData || []}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis 
            dataKey="name" 
            stroke={chartColors.stroke}
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
          />
          <YAxis
            stroke={chartColors.stroke}
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar 
            dataKey="revenue" 
            fill={chartColors.bar}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};