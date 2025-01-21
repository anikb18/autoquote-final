import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  prefix?: string;
}

export const MetricsCard = ({ title, value, description, prefix = '' }: MetricsCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t(title)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{prefix}{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{t(description)}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;