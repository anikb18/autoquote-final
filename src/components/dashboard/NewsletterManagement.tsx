import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Send, Sparkles, Mail, Users, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmailTemplateModal } from "./EmailTemplateModal";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NewsletterManagement = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNewsletter, setSelectedNewsletter] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const { data: subscribers } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: newsletters, refetch: refetchNewsletters } = useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateNewsletter = async () => {
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('newsletters')
      .insert([
        { 
          title,
          content,
          status: 'draft'
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create newsletter",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Newsletter created successfully"
    });

    setTitle("");
    setContent("");
    refetchNewsletters();
  };

  const handleSendNewsletter = async (newsletterId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { newsletterId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Newsletter sending started"
      });

      refetchNewsletters();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send newsletter",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Newsletter Management</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Use Template
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Create
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Subscribers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Newsletter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="max-w-[400px]"
                />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                value={content}
                onEditorChange={setContent}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={handleCreateNewsletter}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="rounded-lg border">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-2">
                {newsletters?.map((newsletter) => (
                  <div 
                    key={newsletter.id} 
                    className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 rounded-lg border transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{newsletter.title}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(newsletter.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button size="sm" onClick={() => handleSendNewsletter(newsletter.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <div className="rounded-lg border">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-2">
                {subscribers?.map((subscriber) => (
                  <div 
                    key={subscriber.id} 
                    className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 rounded-lg border transition-colors"
                  >
                    <span>{subscriber.email}</span>
                    <span className="text-sm text-gray-500">
                      Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>

      <EmailTemplateModal
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
        onContentGenerated={setContent}
      />
    </div>
  );
};
