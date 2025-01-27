import { useTranslation } from "react-i18next";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  DollarSign,
  BarChart3,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricItem {
  id: number;
  name: string;
  stat: string | number;
  icon: any;
  change: string;
  changeType: "increase" | "decrease";
  prefix?: string;
  suffix?: string;
}

interface MetricsOverviewProps {
  title: string;
  stats: MetricItem[];
}

export function MetricsOverview({ title, stats }: MetricsOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-background/60 backdrop-blur-xl border px-4 pb-12 pt-5 shadow-sm hover:bg-background/70 transition-colors sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <item.icon
                  className="h-6 w-6 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-muted-foreground">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-foreground">
                {item.prefix}
                {item.stat}
                {item.suffix}
              </p>
              <p
                className={cn(
                  "ml-2 flex items-baseline text-sm font-semibold",
                  item.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">
                  {item.changeType === "increase" ? "Increased" : "Decreased"}{" "}
                  by
                </span>
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-muted/50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    {t("common.viewAll")}
                    <span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
