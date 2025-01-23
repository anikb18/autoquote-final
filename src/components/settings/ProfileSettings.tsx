import { useUser } from "@/hooks/use-user";
import { useUserRole } from "@/hooks/use-user-role";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ProfileSettings() {
  const { user } = useUser();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        full_name: formData.get('fullName')?.toString(),
        email: formData.get('email')?.toString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderBuyerFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={user?.user_metadata?.full_name}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email}
          required
        />
      </div>
    </>
  );

  const renderDealerFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="dealerName">Dealership Name</Label>
        <Input
          id="dealerName"
          name="dealerName"
          defaultValue={user?.user_metadata?.dealer_name}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={user?.user_metadata?.first_name}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={user?.user_metadata?.last_name}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessEmail">Business Email</Label>
        <Input
          id="businessEmail"
          name="businessEmail"
          type="email"
          defaultValue={user?.email}
          required
        />
      </div>
    </>
  );

  const renderAdminFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="adminName">Admin Name</Label>
        <Input
          id="adminName"
          name="adminName"
          defaultValue={user?.user_metadata?.full_name}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="adminEmail">Admin Email</Label>
        <Input
          id="adminEmail"
          name="adminEmail"
          type="email"
          defaultValue={user?.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          name="department"
          defaultValue={user?.user_metadata?.department}
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        {role === 'dealer' && renderDealerFields()}
        {role === 'admin' && renderAdminFields()}
        {(!role || role === 'user') && renderBuyerFields()}

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}