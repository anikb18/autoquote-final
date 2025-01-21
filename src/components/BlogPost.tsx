import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useTranslation } from "react-i18next";
import { translateBlogPost } from "@/services/translation";
import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [translatedPost, setTranslatedPost] = useState<BlogPost | null>(null);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            full_name
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return data as unknown as BlogPost;
    }
  });

  useEffect(() => {
    const translatePost = async () => {
      if (post && i18n.language !== 'en-US') {
        const translated = await translateBlogPost(post, i18n.language);
        setTranslatedPost({ ...post, ...translated });
      } else {
        setTranslatedPost(post);
      }
    };

    translatePost();
  }, [post, i18n.language]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!translatedPost) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h2>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/blog')}>
          <ArrowLeft className="mr-2" />
          Back to Blog
        </Button>
        <Button onClick={() => navigate(`/blog/${id}/edit`)}>
          <Edit className="mr-2" />
          Edit Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{translatedPost.title}</CardTitle>
          <CardDescription>
            By {translatedPost.profiles?.full_name || 'Unknown'} | 
            Published: {new Date(translatedPost.published_at || translatedPost.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: translatedPost.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPost;