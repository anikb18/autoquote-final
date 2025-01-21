import { supabase } from "@/integrations/supabase/client";

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt }
    });

    if (error) throw error;
    return data.image;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}