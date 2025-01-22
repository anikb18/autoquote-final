import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function fetchCarMakes() {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `List all car manufacturers available in Canada in 2024-2025 as a JSON array of objects with 'value' and 'label' properties. Include all major brands like Toyota, Honda, Ford, etc. Format as:
    [{"value": "lowercase-brand", "label": "Brand Name"}]`;

    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing car makes:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error fetching car makes:', error);
    return [];
  }
}

export async function fetchCarModels(make: string) {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `List all ${make} models available in Canada for 2024-2025 as a JSON array of objects with 'value' and 'label' properties. Format as:
    [{"value": "lowercase-model", "label": "Model Name"}]`;

    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing car models:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error fetching car models:', error);
    return [];
  }
}

export async function fetchCarDetailsFromGemini(make: string, model: string, year: string) {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Provide detailed specifications for a ${year} ${make} ${model} available in Canada. Include:
    1. Engine options and power output
    2. Fuel efficiency (city/highway)
    3. Key safety features and ratings
    4. Notable technology features
    5. Available trim levels
    6. Price range in CAD
    
    Format the response as a JSON object with these keys:
    {
      "engine": "string describing engine specs",
      "fuelEfficiency": "string describing fuel efficiency",
      "safetyFeatures": "string listing key safety features",
      "technology": "string describing tech features",
      "trims": "string listing available trims",
      "priceRange": "string showing price range"
    }`;

    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing car details:', parseError);
      return {
        engine: "Specifications unavailable",
        fuelEfficiency: "Fuel efficiency data unavailable",
        safetyFeatures: "Safety features information unavailable",
        technology: "Technology features unavailable",
        trims: "Trim levels unavailable",
        priceRange: "Price range unavailable"
      };
    }
  } catch (error) {
    console.error('Error fetching car details:', error);
    return null;
  }
}