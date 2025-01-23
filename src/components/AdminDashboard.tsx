import { AdminMetricsCards } from "./dashboard/AdminMetricsCards";
import { SalesTrendChart } from "./dashboard/SalesTrendChart";
import { DealershipComparison } from "./dashboard/DealershipComparison";
import { BlogManagement } from "./dashboard/BlogManagement";
import { NewsletterManagement } from "./dashboard/NewsletterManagement";
import { UserManagement } from "./dashboard/UserManagement";
import AdminSettings from "./settings/AdminSettings";
import { useTranslation } from "react-i18next";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  TextCursorInput, 
  Square,
  ChevronDown,
  SeparatorHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboard = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-8 p-8">
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

      {/* Example of using the UI components */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Text Input</label>
            <div className="flex items-center gap-2">
              <TextCursorInput className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter text..." />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Dropdown Menu</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Select Option
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Option 1</DropdownMenuItem>
                <DropdownMenuItem>Option 2</DropdownMenuItem>
                <DropdownMenuItem>Option 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Text Area</label>
          <Textarea placeholder="Enter longer text..." className="min-h-[100px]" />
        </div>

        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            Primary Button
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            Secondary Button
          </Button>
        </div>

        <div className="flex items-center gap-4 py-4">
          <span className="text-sm text-muted-foreground">Section 1</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">Section 2</span>
          <SeparatorHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Section 3</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background/50 backdrop-blur-sm border w-full justify-start">
          <TabsTrigger value="overview">{t('tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
          <TabsTrigger value="content">{t('tabs.blog')}</TabsTrigger>
          <TabsTrigger value="marketing">{t('tabs.newsletter')}</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8">
            <AdminMetricsCards />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <SalesTrendChart />
              <DealershipComparison />
            </div>
          </div>
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