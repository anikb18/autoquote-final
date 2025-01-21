import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BuyerDashboard from "./BuyerDashboard";
import DealerDashboard from "./DealerDashboard";
import AdminDashboard from "./AdminDashboard";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { ChatbotPopup } from "./chat/ChatbotPopup";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "./settings/SettingsLayout";
import { SettingsForm } from "./settings/SettingsForm";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewAs, setViewAs] = useState<'admin' | 'dealer' | 'buyer'>('admin');
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // First check if user is authenticated
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) {
        navigate('/');
        throw new Error('Not authenticated');
      }
      return session;
    },
  });

  // Then fetch user role only if we have a session
  const { data: userRole, isLoading: isRoleLoading, error } = useQuery({
    queryKey: ['user-role', session?.user.id],
    queryFn: async () => {
      if (!session?.user) throw new Error('Not authenticated');
      
      const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (roleError && roleError.code === 'PGRST116') {
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert([
            { id: session.user.id, role: 'buyer' }
          ])
          .select('role')
          .single();

        if (insertError) {
          console.error('Error creating user role:', insertError);
          throw new Error('Failed to create user role');
        }
        return newRole?.role;
      }
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
        throw new Error('Failed to fetch user role');
      }

      return existingRole?.role;
    },
    enabled: !!session?.user.id,
    meta: {
      errorMessage: "Failed to load dashboard. Please try again later."
    }
  });

  const isLoading = isSessionLoading || isRoleLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard. Please try refreshing the page or sign in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderDashboardContent = () => {
    if (showSettings && userRole === 'admin') {
      return (
        <SettingsLayout>
          <SettingsForm />
        </SettingsLayout>
      );
    }

    if ((userRole === 'admin' && viewAs === 'admin')) {
      return <AdminDashboard onSettingsClick={() => setShowSettings(true)} />;
    } else if ((userRole === 'admin' && viewAs === 'dealer') || userRole === 'dealer') {
      return <DealerDashboard />;
    } else {
      return <BuyerDashboard />;
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel 
        defaultSize={20} 
        minSize={15} 
        maxSize={25} 
        collapsible={true}
        onCollapse={() => setCollapsed(true)}
        onExpand={() => setCollapsed(false)}
        className="bg-muted/50 p-4"
      >
        {userRole === 'admin' && (
          <div className="space-y-4">
            <h3 className="font-semibold mb-2">View As</h3>
            <Select value={viewAs} onValueChange={(value: 'admin' | 'dealer' | 'buyer') => {
              setViewAs(value);
              setShowSettings(false);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select view..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin View</SelectItem>
                <SelectItem value="dealer">Dealer View</SelectItem>
                <SelectItem value="buyer">Buyer View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <nav className="space-y-2 mt-6">
          {/* Add navigation items based on role */}
        </nav>
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel defaultSize={80}>
        <div className="p-6">
          {renderDashboardContent()}
        </div>
      </ResizablePanel>

      <ChatbotPopup />
    </ResizablePanelGroup>
  );
};

export default Dashboard;