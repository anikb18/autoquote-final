import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";
import { UserManagement } from "./dashboard/UserManagement";
import AdminSettings from "./settings/AdminSettings";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background/50 backdrop-blur-sm border">
          <TabsTrigger value="overview">{t('tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
          <TabsTrigger value="content">{t('tabs.blog')}</TabsTrigger>
          <TabsTrigger value="marketing">{t('tabs.newsletter')}</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <AdminMetricsCards />
          <SalesTrendChart />
          <DealershipComparison />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="content">
          <BlogManagement />
        </TabsContent>

        <TabsContent value="marketing">
          <NewsletterManagement />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;