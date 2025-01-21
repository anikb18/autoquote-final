import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const UserManagement = () => {
  const { toast } = useToast();
  const [resetEmailAddress, setResetEmailAddress] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return users;
    },
  });

  const { data: profiles, refetch: refetchProfiles } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          refetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchProfiles]);

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "The user will receive instructions to reset their password.",
      });
      
      setIsResetDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => {
            const userProfile = profiles?.find(p => p.id === user.id);
            return (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{userProfile?.full_name || 'N/A'}</TableCell>
                <TableCell>
                  {user.last_sign_in_at 
                    ? format(new Date(user.last_sign_in_at), 'PPpp')
                    : 'Never'}
                </TableCell>
                <TableCell>
                  {userProfile?.subscription_status 
                    ? `${userProfile.subscription_status} (${userProfile.subscription_type})`
                    : 'No subscription'}
                </TableCell>
                <TableCell>
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setResetEmailAddress(user.email || '')}
                      >
                        Reset Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset User Password</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Input
                            value={resetEmailAddress}
                            onChange={(e) => setResetEmailAddress(e.target.value)}
                            placeholder="Confirm email address"
                          />
                        </div>
                        <Button
                          onClick={() => handlePasswordReset(resetEmailAddress)}
                          className="w-full"
                        >
                          Send Reset Email
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};