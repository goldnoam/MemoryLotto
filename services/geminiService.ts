
import { GoogleGenAI } from "@google/genai";

export async function generateThemeImages(
  theme: string, 
  count: number, 
  onProgress: (status: string, progress: number) => void
): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    onProgress(`Thinking of ${theme} items...`, 10);
    
    // Step 1: Brainstorm specific items for the theme
    const brainstormResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a comma-separated list of exactly ${count} unique visual objects or characters for the theme: "${theme}". Simple, iconic items. No preamble.`,
    });

    const items = brainstormResponse.text?.split(',').map(s => s.trim()).filter(s => s) || [];
    const validItems = items.slice(0, count);

    onProgress(`Drawing ${validItems.length} unique images...`, 30);

    // Step 2: Generate images in batches to respect constraints while being fast
    const imagePromises = validItems.map(async (item, index) => {
      try {
        const imgRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `A vibrant, high-quality square icon of a ${item} on a simple clean minimalist background, professional illustration style.` }]
          },
          config: {
            imageConfig: { aspectRatio: "1:1" }
          }
        });

        // Update progress per image
        const currentProgress = 30 + Math.floor(((index + 1) / validItems.length) * 60);
        onProgress(`Finished drawing: ${item}`, currentProgress);

        for (const part of imgRes.candidates?.[0]?.content.parts || []) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      } catch (e) {
        console.warn(`Failed image for ${item}, using fallback`, e);
      }
      return `https://picsum.photos/seed/${item}-${index}/300`;
    });

    const results = await Promise.all(imagePromises);
    onProgress(`Shuffling cards...`, 100);
    return results;

  } catch (error) {
    console.error("Gemini Generation Failed:", error);
    onProgress("Error! Falling back to random images...", 100);
    return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${theme}-${i}/300`);
  }
}
