import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/utils/imageGeneration";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { RichTextEditor } from "../editor/RichTextEditor";

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!searchQuery) {
      toast({
        title: "Error",
        description: "Please enter a description for the image",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const generatedImage = await generateImage(searchQuery);
      if (generatedImage) {
        setSelectedImage(generatedImage);
        setIsImagePickerOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
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
    <div className="space-y-6">
      <div className="relative">
        <label
          htmlFor="title"
          className="absolute -top-2 left-2 inline-block bg-background px-1 text-xs font-medium text-foreground"
        >
          Post Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          placeholder="Enter post title"
        />
      </div>
      
      <div className="relative">
        <label
          htmlFor="excerpt"
          className="absolute -top-2 left-2 inline-block bg-background px-1 text-xs font-medium text-foreground"
        >
          Brief Excerpt
        </label>
        <input
          id="excerpt"
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          placeholder="Enter brief excerpt"
        />
      </div>

      <div className="flex items-center gap-4 mb-4">
        {selectedImage && (
          <img src={selectedImage} alt={imageAlt} className="w-32 h-32 object-cover rounded" />
        )}
        <Button onClick={() => setIsImagePickerOpen(true)}>
          {selectedImage ? "Change Featured Image" : "Add Featured Image"}
        </Button>
      </div>

      {selectedImage && (
        <div className="relative">
          <label
            htmlFor="imageAlt"
            className="absolute -top-2 left-2 inline-block bg-background px-1 text-xs font-medium text-foreground"
          >
            Image Alt Text
          </label>
          <input
            id="imageAlt"
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Describe the image"
          />
        </div>
      )}

      <RichTextEditor
        value={content}
        onChange={(newContent) => setContent(newContent)}
        className="min-h-[400px]"
      />

      <Dialog open={isImagePickerOpen} onOpenChange={setIsImagePickerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Generate or Choose Featured Image</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              <div className="flex gap-2">
                <input
                  placeholder="Describe the image you want..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateImage()}
                  className="flex-1 rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                <Button 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
              {images.length > 0 && (
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
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Post</Button>
      </div>
    </div>
  );
};