import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Shield } from "lucide-react";

type UserRole = "super_admin" | "admin" | "dealer" | "user";

interface UserRoleSelectProps {
  userId: string;
  currentRole: UserRole;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export const UserRoleSelect = ({
  userId,
  currentRole,
  onRoleChange,
}: UserRoleSelectProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedRole) {
      await onRoleChange(userId, selectedRole);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Select onValueChange={handleRoleSelect} defaultValue={currentRole}>
        <SelectTrigger className="w-[140px]">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="super_admin">Super Admin</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="dealer">Dealer</SelectItem>
          <SelectItem value="user">Regular User</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this user's role to {selectedRole}
              ? This action will update their permissions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
