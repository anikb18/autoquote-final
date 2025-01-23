import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";
import { UserManagement } from "./dashboard/UserManagement";
import AdminSettings from "./settings/AdminSettings";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background/50 backdrop-blur-sm border w-full justify-start h-auto flex-wrap gap-2 p-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            {t('tabs.analytics')}
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            {t('tabs.users')}
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            {t('tabs.blog')}
          </TabsTrigger>
          <TabsTrigger value="marketing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            {t('tabs.newsletter')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Settings
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <TabsContent value="overview" className="space-y-8 min-h-[calc(100vh-16rem)]">
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
          </TabsContent>

          <TabsContent value="users" className="min-h-[calc(100vh-16rem)]">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="min-h-[calc(100vh-16rem)]">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <BlogManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="min-h-[calc(100vh-16rem)]">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <NewsletterManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="min-h-[calc(100vh-16rem)]">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <AdminSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;