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
    <div className="p-6 bg-background/50 backdrop-blur-xl border rounded-lg shadow-sm hover:bg-background/60 transition-colors">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t(title)}
        </h3>
        <p className="text-2xl font-bold">
          {prefix}{value}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground">
            {t(description)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;