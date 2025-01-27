import { supabase } from "@/integrations/supabase/client";

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-image", {
      body: { prompt },
    });

    if (error) throw error;
    return data.image;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

export const createCarImage = (car: any, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");

  const { make, year, model, color } = car.car_details; // Access car_details from Supabase data

  url.searchParams.append("customer", "hrjavascript-mastery"); // Free customer key
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("paintdescription", color || "radiant-green"); // Use car color or default
  url.searchParams.append("modelFamily", model.split(" ")[0]); // Extract the model family
  url.searchParams.append("make", make);
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("angle", `${angle}`); // Optional: Add angle for different views

  return `${url}`;
};
