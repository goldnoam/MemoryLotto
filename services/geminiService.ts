
/**
 * Refactored for Production and Offline support.
 * Removed Gemini API calls as per user request to 'remove ai features'.
 */
export async function generateThemeImages(
  theme: string, 
  count: number, 
  onProgress: (status: string, progress: number) => void
): Promise<string[]> {
  // Providing visual feedback for the loading state even in static mode
  onProgress(`Generating ${theme} world...`, 20);
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  onProgress(`Assembling deck...`, 50);

  // Use high-quality themed placeholders that work without an API key
  const results = Array.from({ length: count }, (_, i) => 
    `https://picsum.photos/seed/${theme}-${i}/400`
  );

  await new Promise(resolve => setTimeout(resolve, 300));
  
  onProgress(`Ready!`, 100);
  return results;
}
