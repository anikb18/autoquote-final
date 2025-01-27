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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Editor } from "@tinymce/tinymce-react";
import { Eye, Mail, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Profile = Tables<"profiles">;
type UserRole = "super_admin" | "admin" | "dealer" | "user";

interface UserTableProps {
  profiles?: Profile[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
  onSendEmail: (
    to: string[],
    subject: string,
    content: string,
    scheduledFor?: string,
  ) => Promise<void>;
}

export const UserTable = ({
  profiles,
  isLoading,
  page,
  setPage,
  itemsPerPage,
  onRoleChange,
  onSendEmail,
}: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const handleSendEmail = async () => {
    if (!selectedUser?.email) return;

    await onSendEmail(
      [selectedUser.email],
      emailSubject,
      emailContent,
      scheduledDate || undefined,
    );

    setIsEmailOpen(false);
    setEmailContent("");
    setEmailSubject("");
    setScheduledDate("");
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">Email</TableHead>
              <TableHead className="w-[200px]">Full Name</TableHead>
              <TableHead className="w-[150px]">Role</TableHead>
              <TableHead className="w-[200px]">Created At</TableHead>
              <TableHead className="w-[150px]">Subscription</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id} className="group">
                <TableCell className="font-medium">{profile.email}</TableCell>
                <TableCell>{profile.full_name || "N/A"}</TableCell>
                <TableCell>
                  <UserRoleSelect
                    userId={profile.id}
                    currentRole={(profile.role as UserRole) || "user"}
                    onRoleChange={(newRole) =>
                      onRoleChange(profile.id, newRole as UserRole)
                    }
                  />
                </TableCell>
                <TableCell>
                  {profile.created_at
                    ? format(new Date(profile.created_at), "PPpp")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      profile.subscription_status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {profile.subscription_status || "none"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(profile);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(profile);
                          setIsEmailOpen(true);
                        }}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage(page + 1)}
          disabled={!profiles || profiles.length < itemsPerPage}
        >
          Next
        </Button>
      </div>

      {/* User Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Email</h4>
              <p className="text-sm">{selectedUser?.email}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Full Name</h4>
              <p className="text-sm">{selectedUser?.full_name || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Role</h4>
              <p className="text-sm">{selectedUser?.role || "user"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Subscription Status</h4>
              <p className="text-sm">
                {selectedUser?.subscription_status || "none"}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Created At</h4>
              <p className="text-sm">
                {selectedUser?.created_at
                  ? format(new Date(selectedUser.created_at), "PPpp")
                  : "N/A"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Email Modal */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule Send (Optional)</Label>
              <Input
                id="schedule"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={emailContent}
              onEditorChange={(content) => setEmailContent(content)}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              {scheduledDate ? "Schedule Email" : "Send Email"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
