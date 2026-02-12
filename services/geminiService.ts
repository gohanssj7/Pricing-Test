import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePricingSensitivity = async (
  baseRate: number,
  currentDiscount: number,
  competitorRate: number,
  volume: number,
  customerSegment: string
): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Act as a Senior Pricing Analyst for FedEx. 
      Analyze a pricing scenario with the following parameters:
      - Base Shipping Rate: $${baseRate}
      - Current Proposed Discount: ${currentDiscount}%
      - Average Competitor Rate: $${competitorRate}
      - Annual Volume: ${volume} packages
      - Customer Segment: ${customerSegment}

      Perform a sensitivity analysis. 
      1. Provide a strategic recommendation on whether to approve, reject, or negotiate.
      2. Assess the risk of churn vs. profit erosion.
      3. Estimate the projected margin percentage.
      4. Generate hypothetical sensitivity data for discount tiers (0%, 5%, 10%, 15%, 20%) showing impact on Margin, Volume (elasticity assumption), and Total Revenue.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            riskAssessment: { type: Type.STRING },
            projectedMargin: { type: Type.STRING },
            sensitivityData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  discount: { type: Type.NUMBER },
                  margin: { type: Type.NUMBER, description: "Profit margin percentage" },
                  volume: { type: Type.NUMBER, description: "Projected volume" },
                  revenue: { type: Type.NUMBER, description: "Projected total revenue" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Analysis failed", error);
    throw error;
  }
};

export const generateAgreementSummary = async (agreementText: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize the key commercial terms, discount structures, and validity periods from the following logistics pricing agreement text. Keep it executive level. \n\n ${agreementText}`
        });
        return response.text || "Summary unavailable.";
    } catch (e) {
        console.error(e);
        return "Error generating summary.";
    }
}
