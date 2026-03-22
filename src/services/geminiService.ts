import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Minifigure } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const searchMinifigures = async (query: string): Promise<Minifigure[]> => {
  if (!query) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for LEGO minifigures matching: "${query}". 
      
      CRITICAL ACCURACY:
      - sw0001/sw0001a = BATTLE DROID (NOT Darth Vader).
      - sw0011 = Darth Vader (Light Gray Head).
      - sw0218 = Darth Vader (Chrome Black).
      - col419 = E-Sports Gamer.
      
      VERIFICATION:
      1. Use Google Search to find the official Brickset ID.
      2. Verify the ID belongs to the correct character.
      3. Only return 100% verified Name-to-ID mappings.
      
      IMAGE URL: https://images.brickset.com/minifigs/large/{id}.jpg`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        tools: [
          { googleSearch: {} }
        ],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "The official Brickset ID (e.g. sw0011)" },
              name: { type: Type.STRING },
              series: { type: Type.STRING },
              theme: { type: Type.STRING },
              year: { type: Type.NUMBER },
              rarity: { 
                type: Type.STRING,
                enum: ['Common', 'Uncommon', 'Rare', 'Ultra Rare']
              },
              imageUrl: { type: Type.STRING },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              description: { type: Type.STRING },
              setNumber: { type: Type.STRING },
              marketPrice: { type: Type.NUMBER },
              partsCount: { type: Type.NUMBER, description: "The number of parts in the minifigure (e.g. 4, 5, 6)" },
              priceChange: { type: Type.NUMBER, description: "The 24h price change percentage (e.g. 2.5, -1.2)" },
              verification: { type: Type.STRING, description: "Briefly explain how you confirmed this ID is correct." }
            },
            required: ['id', 'name', 'theme', 'year', 'rarity', 'imageUrl', 'marketPrice', 'partsCount', 'priceChange', 'verification']
          }
        }
      }
    });

    const results = JSON.parse(response.text || '[]');
    return results;
  } catch (error) {
    console.error("Error searching minifigures:", error);
    return [];
  }
};
