import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPasswordReset } from "./UserPasswordReset";
import { User } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";

interface UserTableProps {
  users: User[] | null;
  profiles?: Tables<'profiles'>[] | null;
  isLoading: boolean;
}

export const UserTable = ({ users, profiles, isLoading }: UserTableProps) => {
  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
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
                <UserPasswordReset userEmail={user.email || ''} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};