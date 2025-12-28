import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateMarketingMessage = async (tone: 'professional' | 'casual' | 'urgent', referralLink: string): Promise<string> => {
  try {
    const prompt = `
      You are a marketing assistant for a Referral Partner of a lending platform called "Rupivo".
      The partner wants to share their referral link with their network.
      
      Goal: Create a short, engaging WhatsApp message that the partner can send to friends or clients.
      Constraint: 
      - Do NOT mention specific interest rates.
      - Do NOT promise guaranteed approval.
      - Do NOT mention EMI calculations.
      - Focus on ease, speed, and trust.
      - The tone should be ${tone}.
      - Include the referral link: ${referralLink} at the end.
      
      Keep it under 60 words. Use emojis where appropriate.
    `;

    if (!ai) {
      console.warn("Gemini API key is missing. Using fallback response.");
      return "Check out Rupivo for your financial needs! Apply here: " + referralLink;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Check out Rupivo for your financial needs! Apply here: " + referralLink;
  } catch (error) {
    console.error("Error generating marketing message:", error);
    return `Hey! I found a great platform for loans called Rupivo. It's fast and reliable. Check it out here: ${referralLink}`;
  }
};

export const generateBannerIdeas = async (targetAudience: string, referralLink: string): Promise<{ concept: string, tagline: string }[]> => {
  try {
    const prompt = `
      You are a creative marketing expert for "Rupivo", a fast and reliable lending platform.
      Generate 3 creative banner advertisement ideas for a referral partner targeting: ${targetAudience}.
      
      The banner is intended to drive traffic to this specific referral link: ${referralLink}
      
      For each idea, provide:
      1. A visual concept description (describe the image, colors, and mood).
      2. A catchy tagline that motivates the user to click the link/apply.
    `;

    if (!ai) {
      console.warn("Gemini API key is missing. Using fallback response.");
      throw new Error("API Key missing");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              concept: { type: Type.STRING },
              tagline: { type: Type.STRING }
            },
            required: ["concept", "tagline"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error generating banner ideas:", error);
    return [
      { concept: "A happy person holding a phone with a green checkmark", tagline: "Quick loans, simpler life." },
      { concept: "A handshake between two professionals", tagline: "Trusted partners in your growth." }
    ];
  }
};