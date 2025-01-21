import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type PerformanceData = {
  period: string;
  conversionRate: number;
  responseTime: number;
  revenue: number;
};

type PerformanceChartProps = {
  data: PerformanceData[];
  onDateRangeChange?: (range: DateRange | undefined) => void;
};

const PerformanceChart = ({ data, onDateRangeChange }: PerformanceChartProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Metrics</CardTitle>
        <DatePickerWithRange date={date} onDateChange={handleDateRangeChange} />
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="conversionRate" name="Conversion Rate (%)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;