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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = Tables<'profiles'>;

interface UserTableProps {
  profiles?: Profile[];
  isLoading: boolean;
}

export const UserTable = ({ profiles, isLoading }: UserTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Role</TableHead>
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
              <Badge variant="outline">
                {profile.role || 'user'}
              </Badge>
            </TableCell>
            <TableCell>
              {profile.created_at 
                ? format(new Date(profile.created_at), 'PPpp')
                : 'N/A'}
            </TableCell>
            <TableCell>
              <Badge variant={profile.subscription_status === 'active' ? 'default' : 'secondary'}>
                {profile.subscription_status || 'none'}
              </Badge>
            </TableCell>
            <TableCell>
              <UserPasswordReset userId={profile.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};