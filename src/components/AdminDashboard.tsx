import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";
import { UserManagement } from "./dashboard/UserManagement";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
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
      
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-background/50 backdrop-blur-sm border">
          <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
          <TabsTrigger value="blog">{t('tabs.blog')}</TabsTrigger>
          <TabsTrigger value="newsletter">{t('tabs.newsletter')}</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AdminMetricsCards />
          <SalesTrendChart />
          <DealershipComparison />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="blog">
          <BlogManagement />
        </TabsContent>

        <TabsContent value="newsletter">
          <NewsletterManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;