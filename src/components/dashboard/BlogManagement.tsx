import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const BlogManagement = () => {
  const { t } = useTranslation('admin');
  const { toast } = useToast();
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");

  const { data: blogPosts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateBlogPost = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: newBlogTitle,
          content: newBlogContent,
          author_id: user.id,
          status: 'draft'
        }
      ]);

    if (error) {
      toast({
        title: t('common:error'),
        description: t('blog.error.create'),
        variant: "destructive",
      });
    } else {
      toast({
        title: t('common:success'),
        description: t('blog.success.create'),
      });
      setNewBlogTitle("");
      setNewBlogContent("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t('blog.title')}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              {t('blog.createNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/80 backdrop-blur-lg">
            <DialogHeader>
              <DialogTitle>{t('blog.createNew')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder={t('blog.form.titlePlaceholder')}
                value={newBlogTitle}
                onChange={(e) => setNewBlogTitle(e.target.value)}
                className="bg-white/50"
              />
              <Textarea
                placeholder={t('blog.form.contentPlaceholder')}
                value={newBlogContent}
                onChange={(e) => setNewBlogContent(e.target.value)}
                className="min-h-[200px] bg-white/50"
              />
              <Button onClick={handleCreateBlogPost}>
                {t('blog.actions.create')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {blogPosts?.map((post) => (
          <Card key={post.id} className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {t('blog.status.label')}: {t(`blog.status.${post.status}`)} | 
                {t('blog.created')}: {new Date(post.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2">{post.content}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  {t('blog.actions.edit')}
                </Button>
                <Button size="sm">
                  {t(`blog.actions.${post.status === 'draft' ? 'publish' : 'preview'}`)}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};