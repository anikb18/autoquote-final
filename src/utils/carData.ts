import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function fetchCarDetailsFromGemini(make: string, model: string, year: string) {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Provide detailed specifications and recommendations for a ${year} ${make} ${model}. 
                   Include: engine options, fuel efficiency, safety features, and notable features. 
                   Format the response as a JSON object with the following structure:
                   {
                     "engine": "string describing engine specs",
                     "fuelEfficiency": "string describing fuel efficiency",
                     "safetyFeatures": "string listing key safety features"
                   }`;

    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return {
        engine: "Engine specifications unavailable",
        fuelEfficiency: "Fuel efficiency data unavailable",
        safetyFeatures: "Safety features information unavailable"
      };
    }
  } catch (error) {
    console.error('Error fetching car details:', error);
    return null;
  }
}