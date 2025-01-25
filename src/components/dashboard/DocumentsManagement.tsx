import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface CarDetails {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  options?: string;
}

interface Document {
  id: string;
  quote_id: string;
  type: string;
  file_path: string;
  status: string;
  created_at: string;
  quote: {
    car_details: CarDetails;
    user_id: string;
    profiles: {
      full_name: string | null;
      email: string | null;
    } | null;
  } | null;
}

export function DocumentsManagement() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          quote:quotes (
            car_details,
            user_id,
            profiles:profiles (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as unknown as Document[];
    }
  });

  const handleDownload = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);
      
      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents?.filter(doc => {
    if (filter === "all") return true;
    return doc.type === filter;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="quote_request">Quote Requests</SelectItem>
              <SelectItem value="trade_in">Trade-in Documents</SelectItem>
              <SelectItem value="accepted_quote">Accepted Quotes</SelectItem>
              <SelectItem value="offer">Offers</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments?.map((doc) => (
              <Card key={doc.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.quote?.profiles?.full_name || 'Unknown User'} - {doc.quote?.profiles?.email || 'No email'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(doc.file_path)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(doc.id, doc.file_path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredDocuments?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No documents found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}