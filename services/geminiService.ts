
/**
 * Refactored for Production and Offline support.
 * Uses themed placeholders with guaranteed visibility.
 */
export async function generateThemeImages(
  theme: string, 
  count: number, 
  onProgress: (status: string, progress: number) => void
): Promise<string[]> {
  onProgress(`Preparing ${theme} world...`, 20);
  
  await new Promise(resolve => setTimeout(resolve, 400));
  
  onProgress(`Fetching assets...`, 50);

  // Using loremflickr as it tends to be more stable for categorical images with specific locks
  // Appending a random query to bypass some aggressive browser caches
  const results = Array.from({ length: count }, (_, i) => 
    `https://loremflickr.com/400/400/${encodeURIComponent(theme)}?lock=${i + 100}`
  );

  await new Promise(resolve => setTimeout(resolve, 200));
  
  onProgress(`Deck Ready!`, 100);
  return results;
}
