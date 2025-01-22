import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function fetchCarDetailsFromGemini(make: string, model: string, year: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Provide detailed specifications and recommendations for a ${year} ${make} ${model}. 
                   Include: engine options, fuel efficiency, safety features, and notable features. 
                   Format the response as a JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching car details:', error);
    return null;
  }
}