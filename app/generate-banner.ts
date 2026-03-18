import { GoogleGenAI } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

export async function generateBanner(title: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: `A high-quality, professional, and minimalist banner image for a business card titled "${title}". The style should be modern, clean, and sophisticated, suitable for a SaaS dashboard.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data ?? '';
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  return null;
}

// Example usage:
// const banner = await generateBanner("Solo Venture");
// console.log(banner);
