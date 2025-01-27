import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const SalesTrendChart = () => {
  const { theme } = useTheme();

  const { data: salesData } = useQuery({
    queryKey: ["sales-trends"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_transactions")
        .select("selling_price, transaction_date")
        .order("transaction_date", { ascending: true });

      if (error) throw error;

      // Process data for the chart
      const processedData = data.reduce((acc: any[], curr) => {
        const date = new Date(curr.transaction_date).toLocaleDateString(
          "en-US",
          { month: "short" },
        );
        const existingEntry = acc.find((item) => item.name === date);

        if (existingEntry) {
          existingEntry.amount += curr.selling_price;
        } else {
          acc.push({ name: date, amount: curr.selling_price });
        }
        return acc;
      }, []);

      return processedData;
    },
  });

  const chartColors = {
    stroke: theme === "dark" ? "#fff" : "#000",
    grid: theme === "dark" ? "#333" : "#eee",
    line: theme === "dark" ? "#7c3aed" : "#4f46e5",
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData || []}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey="name"
            stroke={chartColors.stroke}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke={chartColors.stroke}
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number) => [
              `$${value.toLocaleString()}`,
              "Sales",
            ]}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={chartColors.line}
            strokeWidth={2}
            dot={{ fill: chartColors.line }}
            activeDot={{ r: 6, fill: chartColors.line }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
