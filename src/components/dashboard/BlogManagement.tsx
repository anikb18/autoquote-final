import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlogList from "@/components/BlogList";

export const BlogManagement = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {t('blog.description')}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">All Posts</h2>
          <p className="text-muted-foreground">
            Manage your blog content and create new posts
          </p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/blog/new")}
          className="bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <div className="bg-background/60 backdrop-blur-sm rounded-lg border">
        <BlogList />
      </div>
    </div>
  );
};