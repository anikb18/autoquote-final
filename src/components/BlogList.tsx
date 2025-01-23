import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translateBlogPost } from "@/services/translation";
import { useState, useEffect } from "react";

const BlogList = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [translatedPosts, setTranslatedPosts] = useState<any[]>([]);

  const { data: blogPosts, refetch } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            role
          )
        `)
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

  return (
    <div className="bg-[#1A1F2C] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#D6BCFA] sm:text-4xl">Latest Blog Posts</h2>
          <p className="mt-2 text-lg leading-8 text-[#8E9196]">
            Stay updated with the latest automotive insights and industry trends
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {translatedPosts?.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                <img
                  src={post.featured_image || '/placeholder.svg'}
                  alt={post.image_alt || post.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-[#2A303C] object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#6E59A5]/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.created_at} className="text-[#8E9196]">
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-xs ${
                    post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-[#D6BCFA] group-hover:text-[#9b87f5]">
                    <a onClick={() => navigate(`/blog/${post.id}`)}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#C8C8C9]">{post.excerpt}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-[#2A303C] flex items-center justify-center text-[#D6BCFA]">
                    {post.profiles?.full_name?.[0] || '?'}
                  </div>
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-[#D6BCFA]">
                      {post.profiles?.full_name || 'Anonymous'}
                    </p>
                    <p className="text-[#8E9196]">{post.profiles?.role || 'Author'}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;