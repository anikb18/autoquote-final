import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// Comprehensive list of car manufacturers available in Canada
const CANADIAN_CAR_MAKES = [
  { value: "acura", label: "Acura" },
  { value: "alfa-romeo", label: "Alfa Romeo" },
  { value: "aston-martin", label: "Aston Martin" },
  { value: "audi", label: "Audi" },
  { value: "bentley", label: "Bentley" },
  { value: "bmw", label: "BMW" },
  { value: "buick", label: "Buick" },
  { value: "cadillac", label: "Cadillac" },
  { value: "chevrolet", label: "Chevrolet" },
  { value: "chrysler", label: "Chrysler" },
  { value: "dodge", label: "Dodge" },
  { value: "ferrari", label: "Ferrari" },
  { value: "fiat", label: "Fiat" },
  { value: "ford", label: "Ford" },
  { value: "genesis", label: "Genesis" },
  { value: "gmc", label: "GMC" },
  { value: "honda", label: "Honda" },
  { value: "hyundai", label: "Hyundai" },
  { value: "infiniti", label: "Infiniti" },
  { value: "jaguar", label: "Jaguar" },
  { value: "jeep", label: "Jeep" },
  { value: "kia", label: "Kia" },
  { value: "lamborghini", label: "Lamborghini" },
  { value: "land-rover", label: "Land Rover" },
  { value: "lexus", label: "Lexus" },
  { value: "lincoln", label: "Lincoln" },
  { value: "maserati", label: "Maserati" },
  { value: "mazda", label: "Mazda" },
  { value: "mercedes-benz", label: "Mercedes-Benz" },
  { value: "mini", label: "MINI" },
  { value: "mitsubishi", label: "Mitsubishi" },
  { value: "nissan", label: "Nissan" },
  { value: "porsche", label: "Porsche" },
  { value: "ram", label: "RAM" },
  { value: "rolls-royce", label: "Rolls-Royce" },
  { value: "subaru", label: "Subaru" },
  { value: "tesla", label: "Tesla" },
  { value: "toyota", label: "Toyota" },
  { value: "volkswagen", label: "Volkswagen" },
  { value: "volvo", label: "Volvo" },
];

export async function fetchCarMakes() {
  return CANADIAN_CAR_MAKES;
}

export async function fetchCarModels(make: string, year: string) {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `List all ${make} models available in Canada for ${year} as a JSON array of objects with 'value' and 'label' properties. Only include models that are actually available in Canada for that year. Format as:
    [{"value": "lowercase-model", "label": "Model Name"}]
    
    Example response:
    [
      {"value": "civic", "label": "Civic"},
      {"value": "accord", "label": "Accord"}
    ]`;

    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing car models:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error fetching car models:", error);
    return [];
  }
}

export async function fetchCarDetailsFromGemini(
  make: string,
  model: string,
  year: string,
) {
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
      console.error("Error parsing car details:", parseError);
      return {
        engine: "Specifications unavailable",
        fuelEfficiency: "Fuel efficiency data unavailable",
        safetyFeatures: "Safety features information unavailable",
        technology: "Technology features unavailable",
        trims: "Trim levels unavailable",
        priceRange: "Price range unavailable",
      };
    }
  } catch (error) {
    console.error("Error fetching car details:", error);
    return null;
  }
}
