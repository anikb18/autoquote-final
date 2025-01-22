import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";
import { UserManagement } from "./dashboard/UserManagement";
import AdminSettings from "./settings/AdminSettings"; // Changed to default import
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="p-6 space-y-8 macOS-style">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.welcome')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.overview')}
        </p>
      </div>
      <div className="p-6 space-y-8">
        <AdminMetricsCards />
        <SalesTrendChart />
        <DealershipComparison />
        <UserManagement />
        <BlogManagement />
        <NewsletterManagement />
        <AdminSettings />
      </div>
    </div>
  );
};

export default AdminDashboard;