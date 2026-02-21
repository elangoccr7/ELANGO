import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    template: { type: Type.STRING, enum: ["modern", "classic", "minimal", "executive", "creative"] },
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        address: { type: Type.STRING },
        website: { type: Type.STRING },
        objective: { type: Type.STRING },
      },
      required: ["fullName", "email", "phone", "address", "website", "objective"],
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["id", "school", "degree", "startDate", "endDate", "description"],
      },
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["id", "company", "position", "startDate", "endDate", "description"],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          link: { type: Type.STRING },
        },
        required: ["id", "name", "description", "link"],
      },
    },
    certifications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["personalInfo", "education", "experience", "skills", "projects", "certifications"],
};

export async function generateResume(prompt: string): Promise<ResumeData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a professional resume based on this input: "${prompt}". 
    If the input is sparse, use your knowledge to fill in realistic details for a high-quality resume. 
    Choose the most appropriate template ('modern', 'classic', 'minimal', 'executive', or 'creative') based on the profession or style.
    Ensure all IDs are unique strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data as ResumeData;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to generate resume data");
  }
}
