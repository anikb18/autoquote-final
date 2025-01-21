import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
        Admin Dashboard
      </h1>
      
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blog">Blog Management</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AdminMetricsCards />
          <SalesTrendChart />
          <DealershipComparison />
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