
/**
 * Offline-First Image Service
 * Provides local SVG-based assets to ensure the game works without an internet connection.
 */

const SVGS = {
  animals: [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FFD700"/><circle cx="35" cy="40" r="5" fill="black"/><circle cx="65" cy="40" r="5" fill="black"/><path d="M40 70 Q50 80 60 70" stroke="black" stroke-width="5" fill="none"/></svg>', // Lion/Face
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="20" fill="%23FF5733"/><circle cx="30" cy="30" r="10" fill="white"/><circle cx="70" cy="30" r="10" fill="white"/></svg>', // Fox/Orange
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="%232ECC71"/><circle cx="50" cy="55" r="10" fill="%2327AE60"/></svg>', // Turtle/Green
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%233498DB"/><rect x="40" y="20" width="20" height="10" fill="white"/></svg>', // Penguin/Blue
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23E74C3C"/><rect x="30" y="45" width="40" height="10" fill="white"/></svg>', // Bird/Red
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="%239B59B6"/><circle cx="50" cy="50" r="20" fill="white"/></svg>', // Purple Cat
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23F1C40F"/><circle cx="50" cy="50" r="15" fill="black"/></svg>', // Bee/Yellow
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10 50 L90 50 L50 10 Z" fill="%231ABC9C"/></svg>', // Fish/Teal
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2395A5A6"/><rect x="20" y="40" width="60" height="20" fill="black"/></svg>', // Koala/Grey
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="30" fill="%2334495E"/></svg>', // Bear/Dark
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FF69B4"/><circle cx="50" cy="50" r="10" fill="white"/></svg>', // Pig/Pink
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="40" width="80" height="20" fill="%23D35400"/></svg>' // Worm/Orange
  ],
  space: [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23F39C12"/><circle cx="30" cy="30" r="5" fill="white" opacity="0.5"/></svg>', // Sun
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 60,40 90,40 65,60 75,90 50,70 25,90 35,60 10,40 40,40" fill="%23F1C40F"/></svg>', // Star
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="%232980B9"/><ellipse cx="50" cy="50" rx="45" ry="10" fill="none" stroke="white" stroke-width="2"/></svg>', // Saturn
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 L20 80 L80 80 Z" fill="%23E74C3C"/></svg>', // Rocket
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23BDC3C7"/><circle cx="30" cy="40" r="5" fill="%237F8C8D"/></svg>', // Moon
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="40" ry="20" fill="%238E44AD"/></svg>', // Galaxy
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="40" y="10" width="20" height="80" fill="%2316A085"/></svg>', // Satellite
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="black"/><circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="2"/></svg>', // Black Hole
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="30" width="40" height="40" fill="%23D35400" transform="rotate(45 50 50)"/></svg>', // Asteroid
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="%2327AE60"/></svg>', // Planet Earth-ish
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23C0392B"/></svg>', // Mars
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="20" height="20" fill="white"/></svg>' // Comet
  ]
};

// Add fallback categories
(SVGS as any).food = (SVGS as any).animals;
(SVGS as any).nature = (SVGS as any).space;
(SVGS as any).robots = (SVGS as any).space;

/**
 * Pre-loads the assets from the local bank.
 */
export async function generateThemeImages(
  theme: string, 
  count: number, 
  onProgress: (status: string, progress: number) => void
): Promise<string[]> {
  onProgress(`Preparing memory board...`, 20);
  
  const themeKey = theme.toLowerCase().trim() as keyof typeof SVGS;
  let pool = SVGS[themeKey] || SVGS.animals;

  // Handle custom theme fallback
  if (!SVGS[themeKey]) {
    pool = [...SVGS.animals, ...SVGS.space];
  }

  // Shuffle and take required number
  const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

  // Instant progress simulation
  onProgress(`Setting up cards...`, 60);
  await new Promise(resolve => setTimeout(resolve, 300));
  onProgress(`Done!`, 100);

  return selected;
}
