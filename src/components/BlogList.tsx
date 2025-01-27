import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BlogEditor } from "./blog/BlogEditor";

interface Blog {
  id: string;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  created_at: string;
  excerpt: string;
  featured_image?: string;
  image_alt?: string;
}

const BlogList = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const { data: blogData, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });
      refetch();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedBlog(null);
  };

  const handleSave = async (values: {
    title: string;
    content: string;
    excerpt: string;
    featured_image?: string;
    image_alt?: string;
  }) => {
    const { error } = await supabase.from("blog_posts").upsert({
      id: selectedBlog?.id,
      ...values,
      status: selectedBlog?.status || "draft",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog saved successfully",
      });
      handleDialogClose();
      refetch();
    }
  };

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>Create New Blog</Button>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBlog ? "Edit Blog" : "Create Blog"}
            </DialogTitle>
          </DialogHeader>
          <BlogEditor
            onSave={handleSave}
            initialValues={
              selectedBlog
                ? {
                    title: selectedBlog.title,
                    content: selectedBlog.content,
                    excerpt: selectedBlog.excerpt,
                    featured_image: selectedBlog.featured_image,
                    image_alt: selectedBlog.image_alt,
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
      <ul>
        {blogData?.map((blog) => (
          <li key={blog.id}>
            <h3>{blog.title}</h3>
            <Button onClick={() => handleEdit(blog)}>Edit</Button>
            <Button onClick={() => handleDelete(blog.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
