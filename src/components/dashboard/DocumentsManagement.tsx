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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DocumentsManagement() {
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          quotes (
            car_details,
            user_id,
            created_at,
            dealer_quotes (
              dealer_id,
              dealer_profile:dealer_profiles(dealer_name)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching documents",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    }
  });

  const handleDownload = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);
      
      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Error downloading document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quote Documents</h2>
          <p className="text-muted-foreground">
            View and manage all quote-related documents
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Dealer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.type}</TableCell>
                <TableCell>
                  {doc.quotes?.car_details?.year} {doc.quotes?.car_details?.make} {doc.quotes?.car_details?.model}
                </TableCell>
                <TableCell>{doc.quotes?.user_id}</TableCell>
                <TableCell>
                  {doc.quotes?.dealer_quotes?.[0]?.dealer_profile?.dealer_name}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={doc.status === 'pending' ? 'secondary' : 'default'}
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(doc.created_at), 'PPp')}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc.file_path)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.file_path, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}