import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Editor } from "@tinymce/tinymce-react";

// ...existing code...

const PageItem = ({
  pageWithSeoItem,
  onSave,
}: {
  pageWithSeoItem: PageWithSeo;
  onSave: (
    pageId: string,
    updatedPageData: Partial<Page>,
    updatedSeoData: Partial<SeoSettings>,
  ) => Promise<void>;
}) => {
  const [pageTitle, setPageTitle] = useState(pageWithSeoItem.title);
  const [pageDescription, setPageDescription] = useState(
    pageWithSeoItem.description,
  );
  const [seoTitle, setSeoTitle] = useState(pageWithSeoItem.seo.title);
  const [metaDescription, setMetaDescription] = useState(
    pageWithSeoItem.seo.meta_description,
  );
  const [metaKeywords, setMetaKeywords] = useState(
    pageWithSeoItem.seo.meta_keywords.join(", "),
  );
  const [ogTitle, setOgTitle] = useState(pageWithSeoItem.seo.og_title);
  const [ogDescription, setOgDescription] = useState(
    pageWithSeoItem.seo.og_description,
  );
  const [ogImage, setOgImage] = useState(pageWithSeoItem.seo.og_image);

  return (
    <Card key={pageWithSeoItem.id} className="border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Page: {pageWithSeoItem.title || `ID ${pageWithSeoItem.id}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor={`page-title-${pageWithSeoItem.id}`}>
              Page Title
            </Label>
            <Input
              id={`page-title-${pageWithSeoItem.id}`}
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Enter page title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`page-content-${pageWithSeoItem.id}`}>
              Page Content
            </Label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              initialValue={pageDescription}
              onEditorChange={(content) => setPageDescription(content)}
              id={`page-content-${pageWithSeoItem.id}`}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | styles | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image code | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; }",
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`seo-title-${pageWithSeoItem.id}`}>SEO Title</Label>
            <Input
              id={`seo-title-${pageWithSeoItem.id}`}
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Enter SEO title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`meta-description-${pageWithSeoItem.id}`}>
              Meta Description
            </Label>
            <Textarea
              id={`meta-description-${pageWithSeoItem.id}`}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`meta-keywords-${pageWithSeoItem.id}`}>
              Meta Keywords
            </Label>
            <Input
              id={`meta-keywords-${pageWithSeoItem.id}`}
              type="text"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="comma, separated, keywords"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`og-title-${pageWithSeoItem.id}`}>OG:Title</Label>
            <Input
              id={`og-title-${pageWithSeoItem.id}`}
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Enter OG:Title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`og-description-${pageWithSeoItem.id}`}>
              OG:Description
            </Label>
            <Textarea
              id={`og-description-${pageWithSeoItem.id}`}
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              placeholder="Enter OG:Description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`og-image-${pageWithSeoItem.id}`}>OG:Image</Label>
            <Input
              id={`og-image-${pageWithSeoItem.id}`}
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="Enter OG:Image URL"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() =>
            onSave(
              pageWithSeoItem.id,
              { title: pageTitle, description: pageDescription },
              {
                page_identifier: pageWithSeoItem.id,
                title: seoTitle,
                meta_description: metaDescription,
                meta_keywords: metaKeywords.split(",").map((k) => k.trim()),
                og_title: ogTitle,
                og_description: ogDescription,
                og_image: ogImage,
              },
            )
          }
          variant="default"
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

interface SeoSettings {
  page_identifier: string;
  title: string;
  meta_description: string;
  meta_keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
}

interface Page {
  id: string;
  title: string;
  description: string;
}

interface PageWithSeo extends Page {
  seo: SeoSettings;
}

const PageManagement = () => {
  const { toast } = useToast();

  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching pages",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages?.map((page) => (
              <Card key={page.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {page.description}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageManagement;
