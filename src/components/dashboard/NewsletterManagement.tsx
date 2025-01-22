import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Send, Sparkles } from "lucide-react";
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
    <Tabs defaultValue="create" className="space-y-6">
      <TabsList className="bg-background/50 backdrop-blur-sm border">
        <TabsTrigger value="create">Create Newsletter</TabsTrigger>
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
        <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Create New Newsletter</CardTitle>
            <CardDescription>
              Compose a new newsletter to send to your subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Newsletter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="relative"
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate email content with AI templates</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Editor
              apiKey={import.meta.env.VITE_TINY_MCE_API}
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
            <div className="flex justify-end gap-2">
              <Button onClick={handleCreateNewsletter}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="drafts" className="space-y-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Newsletter Drafts</CardTitle>
            <CardDescription>
              Manage your newsletter drafts and scheduled sends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {newsletters?.map((newsletter) => (
                  <div 
                    key={newsletter.id} 
                    className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subscribers" className="space-y-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Newsletter Subscribers</CardTitle>
            <CardDescription>
              Total Subscribers: {subscribers?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {subscribers?.map((subscriber) => (
                  <div 
                    key={subscriber.id} 
                    className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span>{subscriber.email}</span>
                    <span className="text-sm text-gray-500">
                      Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <EmailTemplateModal
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
        onContentGenerated={setContent}
      />
    </Tabs>
  );
};