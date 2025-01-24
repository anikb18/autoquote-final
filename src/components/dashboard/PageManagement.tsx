import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react'; // Import useState

// Define Interfaces
interface SeoSettings {
    page_identifier: number;
    title: string;
    meta_description: string;
    meta_keywords: string[];
    og_title: string;
    og_description: string;
    og_image: string;
}

interface Page {
    id: number;
    title: string;
    description: string;
}

interface PageWithSeo extends Page {
    seo: SeoSettings;
}

const PageManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const {
        data: pagesWithSeo,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<PageWithSeo[]>({
        queryKey: ['page-management-pages'],
        queryFn: async () => {
            const { data: pagesData, error: pagesError } = await supabase
                .from('pages')
                .select('*');

            if (pagesError) {
                console.error('Error fetching pages:', pagesError);
                throw pagesError;
            }

            if (!pagesData) return []; // Handle case where pagesData is null

            const pagesWithSeoData = await Promise.all(
                pagesData.map(async (page) => {
                    const { data: seoData, error: seoError } = await supabase
                        .from('seo_settings')
                        .select('*')
                        .eq('page_identifier', page.id)
                        .single();

                    if (seoError) {
                        console.error('Error fetching SEO settings:', seoError);
                        return {
                            ...page,
                            seo: {
                                page_identifier: page.id, // Ensure page_identifier is set
                                title: '',
                                meta_description: '',
                                meta_keywords: [],
                                og_title: '',
                                og_description: '',
                                og_image: '',
                            } as SeoSettings, // Type assertion here
                        };
                    }

                    return {
                        ...page,
                        seo: seoData || {
                            page_identifier: page.id, // Ensure page_identifier is set
                            title: '',
                            meta_description: '',
                            meta_keywords: [],
                            og_title: '',
                            og_description: '',
                            og_image: '',
                        } as SeoSettings, // Type assertion here
                    };
                })
            );
            return pagesWithSeoData as PageWithSeo[]; // Type assertion for the whole array
        },
        onError: (err: any) => {
            toast({
                title: "Error fetching pages",
                description: err.message || "Failed to fetch pages.",
                variant: "destructive",
            });
        },
    });

    const handlePageAndSeoSave = async (pageId: number, updatedPageData: Partial<Page>, updatedSeoData: Partial<SeoSettings>) => {
        try {
            const { error: pageError } = await supabase
                .from('pages')
                .update({ title: updatedPageData.title, description: updatedPageData.description })
                .eq('id', pageId);

            if (pageError) {
                console.error('Error updating page:', pageError);
                throw pageError;
            }

            const { error: seoError } = await supabase
                .from('seo_settings')
                .upsert({
                    page_identifier: pageId,
                    title: updatedSeoData.title,
                    meta_description: updatedSeoData.meta_description,
                    meta_keywords: updatedSeoData.meta_keywords,
                    og_title: updatedSeoData.og_title,
                    og_description: updatedSeoData.og_description,
                    og_image: updatedSeoData.og_image
                }, { onConflict: ['page_identifier'] }); // Specify onConflict strategy

            if (seoError) {
                console.error('Error updating SEO settings:', seoError);
                throw seoError;
            }

            toast({
                title: "Success",
                description: "Page and SEO settings updated successfully.",
            });
            queryClient.invalidateQueries(['page-management-pages']); // Refetch pages
        } catch (err: any) {
            toast({
                title: "Error saving changes",
                description: err.message || "Failed to save page and SEO settings.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return <div>Loading pages...</div>;
    }

    if (isError || !pagesWithSeo) {
        return (
            <div>
                Error loading pages: {error?.message || 'Unknown error'}
                <Button onClick={() => refetch()} className="ml-2">Retry</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <h1 className="text-3xl font-bold">Page Management</h1>
            <div className="space-y-4">
                {pagesWithSeo.map((pageWithSeoItem) => {
                    // Initialize local state for input values for each page
                    const [pageTitle, setPageTitle] = useState(pageWithSeoItem.title);
                    const [pageDescription, setPageDescription] = useState(pageWithSeoItem.description);
                    const [seoTitle, setSeoTitle] = useState(pageWithSeoItem.seo.title);
                    const [metaDescription, setMetaDescription] = useState(pageWithSeoItem.seo.meta_description);
                    const [metaKeywords, setMetaKeywords] = useState(pageWithSeoItem.seo.meta_keywords.join(', '));
                    const [ogTitle, setOgTitle] = useState(pageWithSeoItem.seo.og_title);
                    const [ogDescription, setOgDescription] = useState(pageWithSeoItem.seo.og_description);
                    const [ogImage, setOgImage] = useState(pageWithSeoItem.seo.og_image);


                    return (
                        <div key={pageWithSeoItem.id} className="space-y-4 border p-4 rounded-md">
                            <h2 className="text-xl font-semibold">Page: {pageWithSeoItem.title || `ID ${pageWithSeoItem.id}`}</h2>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Page Title</label>
                                <input
                                    type="text"
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Page Content</label>
                                <Editor
                                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                    initialValue={pageDescription}
                                    onEditorChange={(content) => setPageDescription(content)}
                                    init={{
                                        height: 300, // Adjust height as needed
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image code | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; }'
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">SEO Title</label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Meta Description</label>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={metaKeywords}
                                    onChange={(e) => setMetaKeywords(e.target.value)}
                                    placeholder="comma, separated, keywords"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">OG:Title</label>
                                <input
                                    type="text"
                                    value={ogTitle}
                                    onChange={(e) => setOgTitle(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">OG:Description</label>
                                <textarea
                                    value={ogDescription}
                                    onChange={(e) => setOgDescription(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="block text-sm font-medium">OG:Image</label>
                                <input
                                    type="text"
                                    value={ogImage}
                                    onChange={(e) => setOgImage(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>


                            <Button
                                onClick={() => handlePageAndSeoSave(
                                    pageWithSeoItem.id,
                                    { title: pageTitle, description: pageDescription },
                                    {
                                        page_identifier: pageWithSeoItem.id,
                                        title: seoTitle,
                                        meta_description: metaDescription,
                                        meta_keywords: metaKeywords.split(',').map(k => k.trim()),
                                        og_title: ogTitle,
                                        og_description: ogDescription,
                                        og_image: ogImage
                                    }
                                )}
                                variant="primary"
                            >
                                Save Changes
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PageManagement;