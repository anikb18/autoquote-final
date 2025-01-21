import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MetricsCardProps = {
  title: string;
  value: string | number;
  change?: number;
  className?: string;
};

const MetricsCard = ({ title, value, change, className }: MetricsCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="text-sm text-muted-foreground">
            {change > 0 ? '+' : ''}{change}% from last period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;