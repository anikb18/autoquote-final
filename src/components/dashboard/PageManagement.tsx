import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PageManagement = () => {
  const { toast } = useToast();

  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching pages",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages?.map((page) => (
              <Card key={page.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {page.description}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageManagement;