import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";
import { UserManagement } from "./dashboard/UserManagement";
import { AdminSettings } from "./settings/AdminSettings";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface AdminDashboardProps {
  onSettingsClick: () => void;
}

const AdminDashboard = ({ onSettingsClick }: AdminDashboardProps) => {
  const { t } = useTranslation('admin');
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <AdminSettings />;
  }

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      <div className="flex justify-between items-center">
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
        <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
          <Settings className="h-4 w-4" />
        </Button>
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