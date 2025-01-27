import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const SeoManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    homeTitle: "",
    homeDescription: "",
    blogTitle: "",
    blogDescription: "",
    dealerTitle: "",
    dealerDescription: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error: homeError } = await supabase.from("seo_settings").upsert({
        page_identifier: "home",
        title: formData.homeTitle,
        meta_description: formData.homeDescription,
      });

      const { error: blogError } = await supabase.from("seo_settings").upsert({
        page_identifier: "blog",
        title: formData.blogTitle,
        meta_description: formData.blogDescription,
      });

      const { error: dealerError } = await supabase
        .from("seo_settings")
        .upsert({
          page_identifier: "dealers",
          title: formData.dealerTitle,
          meta_description: formData.dealerDescription,
        });

      if (homeError || blogError || dealerError)
        throw new Error("Failed to update SEO settings");

      toast({
        title: "Success",
        description: "SEO settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SEO Management</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Homepage SEO</CardTitle>
            <CardDescription>
              Manage SEO settings for the homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeTitle">Title</Label>
              <Input
                id="homeTitle"
                name="homeTitle"
                value={formData.homeTitle}
                onChange={handleInputChange}
                placeholder="Enter homepage title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeDescription">Meta Description</Label>
              <Textarea
                id="homeDescription"
                name="homeDescription"
                value={formData.homeDescription}
                onChange={handleInputChange}
                placeholder="Enter homepage meta description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog SEO</CardTitle>
            <CardDescription>
              Manage SEO settings for the blog section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blogTitle">Title</Label>
              <Input
                id="blogTitle"
                name="blogTitle"
                value={formData.blogTitle}
                onChange={handleInputChange}
                placeholder="Enter blog title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blogDescription">Meta Description</Label>
              <Textarea
                id="blogDescription"
                name="blogDescription"
                value={formData.blogDescription}
                onChange={handleInputChange}
                placeholder="Enter blog meta description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dealer Section SEO</CardTitle>
            <CardDescription>
              Manage SEO settings for the dealer section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dealerTitle">Title</Label>
              <Input
                id="dealerTitle"
                name="dealerTitle"
                value={formData.dealerTitle}
                onChange={handleInputChange}
                placeholder="Enter dealer section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dealerDescription">Meta Description</Label>
              <Textarea
                id="dealerDescription"
                name="dealerDescription"
                value={formData.dealerDescription}
                onChange={handleInputChange}
                placeholder="Enter dealer section meta description"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save SEO Settings"}
        </Button>
      </form>
    </div>
  );
};
