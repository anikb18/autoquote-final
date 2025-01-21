import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface UserPasswordResetProps {
  userEmail: string;
}

export const UserPasswordReset = ({ userEmail }: UserPasswordResetProps) => {
  const { toast } = useToast();
  const [resetEmailAddress, setResetEmailAddress] = useState(userEmail);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

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

  return (
    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setResetEmailAddress(userEmail)}
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
  );
};