import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoleSelect } from "./UserRoleSelect";
import { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Profile = Tables<'profiles'>;
type UserRole = "super_admin" | "admin" | "dealer" | "user";

interface UserTableProps {
  profiles?: Profile[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
}

export const UserTable = ({ 
  profiles, 
  isLoading,
  page,
  setPage,
  itemsPerPage 
}: UserTableProps) => {
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-4">
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
            <TableRow key={profile.id} className="group">
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.full_name || 'N/A'}</TableCell>
              <TableCell>
                <UserRoleSelect
                  userId={profile.id}
                  currentRole={(profile.role as UserRole) || 'user'}
                  onRoleChange={handleRoleChange}
                />
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        // Implement view details
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        // Implement send email
                      }}
                    >
                      Send Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="gap-1 pl-2.5"
            >
              <span>Previous</span>
            </Button>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => setPage(page + 1)}
              disabled={!profiles || profiles.length < itemsPerPage}
              className="gap-1 pr-2.5"
            >
              <span>Next</span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};