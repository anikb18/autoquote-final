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
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface Document {
  id: string;
  quote_id: string;
  type: string;
  file_path: string;
  status: string;
  created_at: string;
  quote: {
    car_details: {
      year: string;
      make: string;
      model: string;
    };
    user: {
      full_name: string;
      email: string;
    };
    dealer_quotes: {
      dealer: {
        dealer_name: string;
      };
    }[];
  };
}

export const DocumentsManagement = () => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          quote:quotes (
            car_details,
            user:profiles (full_name, email),
            dealer_quotes (
              dealer:dealer_profiles (dealer_name)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'approved':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleDownload = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);
    
    if (error) {
      console.error('Error downloading file:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">Documents</h1>
        <p className="text-lg text-muted-foreground mt-2">
          View and manage all quote-related documents
        </p>
      </div>

      <div className="bg-background/60 backdrop-blur-sm rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Dealer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  {doc.quote?.car_details?.year} {doc.quote?.car_details?.make} {doc.quote?.car_details?.model}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{doc.quote?.user?.full_name}</div>
                    <div className="text-sm text-muted-foreground">{doc.quote?.user?.email}</div>
                  </div>
                </TableCell>
                <TableCell>{doc.quote?.dealer_quotes[0]?.dealer?.dealer_name || 'N/A'}</TableCell>
                <TableCell className="capitalize">{doc.type}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(doc.status)} variant="outline">
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(doc.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc.file_path)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};