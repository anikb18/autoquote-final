import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    user: {
      full_name: string;
      email: string;
    } | null;
    dealer_quotes: Array<{
      id: string;
      dealer_id: string;
      status: string;
    }>;
  } | null;
}

interface CarDetails {
  make: string;
  model: string;
  year: number;
}

export function DocumentsManagement() {
  const { toast } = useToast();

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
            user:profiles (
              full_name,
              email
            ),
            dealer_quotes (
              id,
              dealer_id,
              status
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((doc: any) => {
        let carDetails: CarDetails = {
          make: 'Unknown',
          model: 'Unknown',
          year: 0
        };

        if (doc.quote?.car_details) {
          carDetails = {
            make: doc.quote.car_details.make || 'Unknown',
            model: doc.quote.car_details.model || 'Unknown',
            year: doc.quote.car_details.year || 0
          };
        }

        return {
          ...doc,
          quote: doc.quote ? {
            ...doc.quote,
            car_details: carDetails,
            user: doc.quote.user || null,
            dealer_quotes: doc.quote.dealer_quotes || []
          } : null
        } as Document;
      });
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents?.map((doc) => (
              <Card key={doc.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.quote?.user?.full_name || 'Unknown User'} - {doc.quote?.user?.email || 'No email'}
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
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}