import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface PerformanceData {
  period: string;
  conversionRate: number;
  responseTime: number;
  revenue: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="conversionRate"
                stroke="#8884d8"
                name="Conversion Rate"
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#82ca9d"
                name="Response Time"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ffc658"
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};