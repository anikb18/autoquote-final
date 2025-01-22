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
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<'profiles'>;

interface UserTableProps {
  profiles?: Profile[] | null;
  isLoading: boolean;
}

export const UserTable = ({ profiles, isLoading }: UserTableProps) => {
  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Subscription</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles?.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.email}</TableCell>
            <TableCell>{profile.full_name || 'N/A'}</TableCell>
            <TableCell>
              {profile.created_at 
                ? format(new Date(profile.created_at), 'PPpp')
                : 'Never'}
            </TableCell>
            <TableCell>
              {profile.subscription_status 
                ? `${profile.subscription_status} (${profile.subscription_type})`
                : 'No subscription'}
            </TableCell>
            <TableCell>
              <UserPasswordReset userEmail={profile.email || ''} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};