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
    <div className="container mx-auto py-8 bg-[#1A1F2C]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#D6BCFA]">Blog Posts</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
              <PlusCircle className="mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-[#1A1F2C] border-[#6E59A5]">
            <DialogHeader>
              <DialogTitle className="text-[#D6BCFA]">Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogEditor onSave={handleCreatePost} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {translatedPosts.map((post) => (
          <Card key={post.id} className="relative bg-[#1A1F2C] border-[#6E59A5] hover:border-[#9b87f5] transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {post.featured_image && (
                    <img 
                      src={post.featured_image} 
                      alt={post.image_alt || post.title}
                      className="w-24 h-24 object-cover rounded border border-[#6E59A5]"
                    />
                  )}
                  <div>
                    <CardTitle 
                      className="text-[#D6BCFA] hover:text-[#9b87f5] cursor-pointer transition-colors" 
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-[#8E9196]">
                      Status: {post.status} | Created: {new Date(post.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigate(`/blog/${post.id}/edit`)}
                    className="border-[#6E59A5] hover:border-[#9b87f5] text-[#D6BCFA]"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-[#C8C8C9]">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogList;