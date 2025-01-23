import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { translateBlogPost } from "@/services/translation";
import { BlogEditor } from "./blog/BlogEditor";

const BlogList = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const { data: blogData, refetch } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

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

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>Create New Blog</Button>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBlog ? "Edit Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>
          <BlogEditor blog={selectedBlog} onClose={handleDialogClose} />
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
