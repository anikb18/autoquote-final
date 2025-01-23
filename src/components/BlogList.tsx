import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { translateBlogPost } from "@/services/translation";
import { BlogEditor } from "./blog/BlogEditor";

const BlogList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { i18n } = useTranslation();
  const [translatedPosts, setTranslatedPosts] = useState<any[]>([]);

  const { data: blogPosts, refetch } = useQuery({
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

  useEffect(() => {
    const translatePosts = async () => {
      if (blogPosts && i18n.language !== 'en-US') {
        const translated = await Promise.all(
          blogPosts.map(async (post) => {
            const translatedContent = await translateBlogPost(post, i18n.language);
            return { ...post, ...translatedContent };
          })
        );
        setTranslatedPosts(translated);
      } else {
        setTranslatedPosts(blogPosts || []);
      }
    };

    translatePosts();
  }, [blogPosts, i18n.language]);

  const handleCreatePost = async (values: { 
    title: string; 
    content: string; 
    excerpt: string;
    featured_image?: string;
    image_alt?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: values.title,
          content: values.content,
          excerpt: values.excerpt,
          featured_image: values.featured_image,
          image_alt: values.image_alt,
          author_id: user.id,
          status: 'draft'
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      setIsCreateDialogOpen(false);
      refetch();
    }
  };

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      refetch();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-primary/20">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-3">Blog Posts</h1>
          <p className="text-muted-foreground text-lg">Manage your blog content and create new posts</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-primary text-2xl">Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogEditor onSave={handleCreatePost} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 pt-4">
        {translatedPosts?.map((post) => (
          <Card 
            key={post.id} 
            className="relative bg-background border-border hover:border-accent transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <CardHeader className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex gap-6">
                  {post.featured_image && (
                    <div className="flex-shrink-0">
                      <img 
                        src={post.featured_image} 
                        alt={post.image_alt || post.title}
                        className="w-32 h-32 object-cover rounded-lg border border-border shadow-md"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <CardTitle 
                      className="text-2xl text-primary hover:text-accent cursor-pointer transition-colors" 
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {post.status}
                      </span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </CardDescription>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground line-clamp-2 mt-2">{post.excerpt}</p>
                    </CardContent>
                  </div>
                </div>
                <div className="flex gap-2 md:self-start">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigate(`/blog/${post.id}/edit`)}
                    className="border-border hover:border-accent text-primary h-10 w-10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeletePost(post.id)}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
