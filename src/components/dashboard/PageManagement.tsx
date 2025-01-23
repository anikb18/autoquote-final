import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Editor } from '@tinymce/tinymce-react';

const PageManagement = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<{ id: number; title: string; description: string; seo: { title: string; meta_description: string; meta_keywords: string[]; og_title: string; og_description: string; og_image: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*');

      if (error) {
        console.error('Error fetching pages:', error);
        toast({
          title: "Error",
          description: "Failed to fetch pages.",
          variant: "destructive",
        });
      } else {
        const pagesWithSeo = await Promise.all(data.map(async (page) => {
          const { data: seoData, error: seoError } = await supabase
            .from('seo_settings')
            .select('*')
            .eq('page_identifier', page.id)
            .single();

          if (seoError) {
            console.error('Error fetching SEO settings:', seoError);
            return { ...page, seo: { title: '', meta_description: '', meta_keywords: [], og_title: '', og_description: '', og_image: '' } }; // Default SEO data
          }

          return { ...page, seo: seoData || { title: '', meta_description: '', meta_keywords: [], og_title: '', og_description: '', og_image: '' } };
        }));

        setPages(pagesWithSeo);
      }
      setLoading(false);
    };

    fetchPages();
  }, [toast]);

  const saveSeoSettings = async (seoData) => {
    const { data, error } = await supabase.rpc('upsert_seo_setting', {
      p_page_identifier: seoData.page_identifier,
      p_title: seoData.title,
      p_meta_description: seoData.meta_description,
      p_meta_keywords: seoData.meta_keywords,
      p_og_title: seoData.og_title,
      p_og_description: seoData.og_description,
      p_og_image: seoData.og_image
    });
    if (error) {
      console.error('Error saving SEO settings:', error);
    } else {
      console.log('SEO settings saved successfully:', data);
    }
  };

  const deleteSeoSetting = async (pageIdentifier) => {
    const { data, error } = await supabase.rpc('delete_seo_setting', {
      p_page_identifier: pageIdentifier
    });
    
    if (error) {
      console.error('Error deleting SEO setting:', error);
    } else {
      console.log('SEO setting deleted successfully:', data);
    }
  };

  const loadSeoSettings = async (pageIdentifier) => {
    const { data, error } = await supabase.rpc('get_seo_setting', {
      p_page_identifier: pageIdentifier
    });
    
    if (error) {
      console.error('Error loading SEO settings:', error);
    } else {
      console.log('SEO settings loaded:', data);
      // Populate your form with the data
    }
  };

  const handleSave = async (pageId: number, title: string, description: string, seoTitle: string, metaDescription: string, metaKeywords: string[]) => {
    const { error: pageError } = await supabase
      .from('pages')
      .update({ title, description })
      .eq('id', pageId);

    const { error: seoError } = await supabase
      .from('seo_settings')
      .upsert({
        page_identifier: pageId,
        title: seoTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords
      });

    if (pageError || seoError) {
      console.error('Error updating page or SEO settings:', pageError || seoError);
      toast({
        title: "Error",
        description: "Failed to update page or SEO settings.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Page and SEO settings updated successfully.",
      });
      setPages(); // Optionally, refetch the pages to reflect the changes
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Page Management</h1>
      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="space-y-2">
            <label className="block text-sm font-medium">Page Title</label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => handleSave(page.id, e.target.value, page.description, page.seo.title, page.seo.meta_description, page.seo.meta_keywords)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            <label className="block text-sm font-medium">Page Content</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              initialValue={page.description}
              onEditorChange={(content) => handleSave(page.id, page.title, content, page.seo.title, page.seo.meta_description, page.seo.meta_keywords)}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; }'
              }}
            />
            <label className="block text-sm font-medium">SEO Title</label>
            <input
              type="text"
              value={page.seo.title}
              onChange={(e) => handleSave(page.id, page.title, page.description, e.target.value, page.seo.meta_description, page.seo.meta_keywords)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            <label className="block text-sm font-medium">Meta Description</label>
            <textarea
              value={page.seo.meta_description}
              onChange={(e) => handleSave(page.id, page.title, page.description, page.seo.title, e.target.value, page.seo.meta_keywords)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            <label className="block text-sm font-medium">Meta Keywords</label>
            <input
              type="text"
              value={page.seo.meta_keywords.join(', ')}
              onChange={(e) => handleSave(page.id, page.title, page.description, page.seo.title, page.seo.meta_description, e.target.value.split(',').map(k => k.trim()))}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageManagement;