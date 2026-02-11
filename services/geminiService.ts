
import { GoogleGenAI } from "@google/genai";
import { Tour } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Explicitly using process.env.API_KEY as per coding guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async generateTourSummary(tour: Tour): Promise<string> {
    const prompt = `
      As a professional travel advisor, write a compelling, beautiful, and informative summary for this tour itinerary.
      Tour Title: ${tour.title}
      Destination: ${tour.destination}
      Number of Days: ${tour.days.length}
      
      Itinerary Details:
      ${tour.days.map(d => `Day ${d.dayNumber}: ${d.summary}. Activities: ${d.activities.map(a => a.name).join(', ')}`).join('\n')}
      
      Keep the tone inspiring and professional. Max 3 paragraphs.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Failed to generate summary.";
    } catch (error) {
      console.error("Error generating summary:", error);
      return "Unable to generate summary at this time.";
    }
  }

  async generateCoverImage(tour: Tour): Promise<string | undefined> {
    const prompt = `A cinematic, high-resolution travel photograph of ${tour.destination}. Professional photography, stunning lighting, wanderlust vibe.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return undefined;
    } catch (error) {
      console.error("Error generating image:", error);
      return undefined;
    }
  }

  async analyzeBudget(tour: Tour): Promise<string> {
    const totalCost = tour.days.reduce((acc, day) => 
      acc + day.activities.reduce((dAcc, act) => dAcc + act.cost, 0), 0);
    
    const prompt = `
      Analyze this travel budget for a ${tour.days.length}-day trip to ${tour.destination}.
      Total Cost: ${totalCost} ${tour.currency}
      
      Breakdown:
      ${tour.days.map(d => `Day ${d.dayNumber}: ${d.activities.map(a => `${a.name} (${a.cost} ${tour.currency})`).join(', ')}`).join('\n')}
      
      Provide 3 quick professional tips to optimize this budget or things to watch out for.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Budget analysis unavailable.";
    } catch (error) {
      console.error("Error analyzing budget:", error);
      return "Budget analysis currently unavailable.";
    }
  }
}

export const gemini = new GeminiService();
