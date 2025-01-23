import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-8 p-8">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-4xl font-bold">
            {t('dashboard.title')}
          </CardTitle>
          <CardDescription className="text-lg">
            {t('dashboard.welcome')}
          </CardDescription>
          <CardDescription className="text-sm">
            {t('dashboard.overview')}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-8">
        <AdminMetricsCards />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Monthly sales performance analysis</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <SalesTrendChart />
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Dealership Performance</CardTitle>
              <CardDescription>Comparison of top performing dealerships</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <DealershipComparison />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;