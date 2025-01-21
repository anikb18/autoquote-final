import { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogEditorProps {
  onSave: (values: { 
    title: string; 
    content: string; 
    excerpt: string; 
    featured_image?: string; 
    image_alt?: string; 
  }) => Promise<void>;
  initialValues?: {
    title: string;
    content: string;
    excerpt: string;
    featured_image?: string;
    image_alt?: string;
  };
}

export const BlogEditor = ({ onSave, initialValues }: BlogEditorProps) => {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState(initialValues?.image_alt || "");
  const [title, setTitle] = useState(initialValues?.title || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt || "");
  const { toast } = useToast();

  const searchImages = async () => {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${searchQuery}&per_page=12`, {
        headers: {
          Authorization: process.env.PEXELS_API_KEY || "",
        },
      });
      const data = await response.json();
      setImages(data.photos || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!title || !content || !excerpt) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    await onSave({
      title,
      content,
      excerpt,
      featured_image: selectedImage || initialValues?.featured_image,
      image_alt: imageAlt,
    });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-bold"
      />
      
      <Input
        placeholder="Brief excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />

      <div className="flex items-center gap-4 mb-4">
        {selectedImage && (
          <img src={selectedImage} alt={imageAlt} className="w-32 h-32 object-cover rounded" />
        )}
        <Button onClick={() => setIsImagePickerOpen(true)}>
          {selectedImage ? "Change Featured Image" : "Add Featured Image"}
        </Button>
      </div>

      {selectedImage && (
        <Input
          placeholder="Image alt text"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
          className="mb-4"
        />
      )}

      <Editor
        apiKey={process.env.TINYMCE_API_KEY}
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />

      <Dialog open={isImagePickerOpen} onOpenChange={setIsImagePickerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Choose Featured Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchImages()}
              />
              <Button onClick={searchImages}>Search</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`cursor-pointer relative ${
                    selectedImage === image.src.medium ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedImage(image.src.medium);
                    setIsImagePickerOpen(false);
                  }}
                >
                  <img
                    src={image.src.tiny}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Post</Button>
      </div>
    </div>
  );
};