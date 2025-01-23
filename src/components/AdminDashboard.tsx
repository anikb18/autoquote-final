import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          {t('dashboard.title')}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {t('dashboard.welcome')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.overview')}
        </p>
      </div>

      <div className="grid gap-8">
        <AdminMetricsCards />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-background/60 backdrop-blur-sm p-6 rounded-lg border">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Sales Trends</h2>
              <p className="text-sm text-muted-foreground">Monthly sales performance analysis</p>
            </div>
            <SalesTrendChart />
          </div>
          <div className="bg-background/60 backdrop-blur-sm p-6 rounded-lg border">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Dealership Performance</h2>
              <p className="text-sm text-muted-foreground">Comparison of top performing dealerships</p>
            </div>
            <DealershipComparison />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;