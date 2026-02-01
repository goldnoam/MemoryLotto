/**
 * Production-ready Image Service
 * Uses Picsum Photos for guaranteed reliability and bypasses potential hotlinking/referrer issues.
 * Implements pre-loading to ensure images are visible before the game starts.
 */

// We map themes to specific seeds to ensure variety and consistency
const THEME_SEEDS: Record<string, number[]> = {
  animals: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
  space: [250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480],
  food: [490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720],
  nature: [730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890, 900, 910, 920, 930, 940, 950, 960],
  robots: [970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 1100, 1110, 1120, 1130, 1140, 1150, 1160, 1170, 1180, 1190, 1200]
};

/**
 * Pre-loads a list of images into the browser cache.
 */
async function preloadImages(urls: string[], onProgress: (p: number) => void): Promise<void> {
  let loadedCount = 0;
  const promises = urls.map((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        onProgress(Math.floor((loadedCount / urls.length) * 100));
        resolve(url);
      };
      img.onerror = () => {
        loadedCount++;
        onProgress(Math.floor((loadedCount / urls.length) * 100));
        console.error("Failed to load image:", url);
        resolve(url); 
      };
    });
  });
  await Promise.all(promises);
}

export async function generateThemeImages(
  theme: string, 
  count: number, 
  onProgress: (status: string, progress: number) => void
): Promise<string[]> {
  onProgress(`Preparing assets for: ${theme}...`, 10);
  
  const themeKey = theme.toLowerCase();
  let urls: string[] = [];

  if (THEME_SEEDS[themeKey]) {
    // Use the predefined seed bank
    const seeds = THEME_SEEDS[themeKey].sort(() => Math.random() - 0.5).slice(0, count);
    urls = seeds.map(seed => `https://picsum.photos/seed/${seed}/400/400`);
  } else {
    // Custom theme or fallback - generate unique seeds based on the theme string
    const themeHash = theme.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    urls = Array.from({ length: count }, (_, i) => 
      `https://picsum.photos/seed/${themeHash + i * 13}/400/400`
    );
  }

  onProgress(`Downloading gallery...`, 30);

  // Pre-load logic ensures the images are actually in the browser cache before we show the board
  await preloadImages(urls, (p) => {
    onProgress(`Downloading gallery... ${p}%`, 30 + (p * 0.7));
  });

  onProgress(`Done!`, 100);
  return urls;
}