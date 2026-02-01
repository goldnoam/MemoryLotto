
/**
 * Production-ready Image Service
 * Uses a pre-defined bank of high-reliability Unsplash images.
 * Implements pre-loading to ensure images are visible before the game starts.
 */

const IMAGE_BANK: Record<string, string[]> = {
  animals: [
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=400&fit=crop", // Lion
    "https://images.unsplash.com/photo-1534188753412-3ee2f77d731a?w=400&h=400&fit=crop", // Elephant
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop", // Dog
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop", // Cat
    "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=400&fit=crop", // Turtle
    "https://images.unsplash.com/photo-1474511320721-9a53616e0197?w=400&h=400&fit=crop", // Fox
    "https://images.unsplash.com/photo-1555169062-013468b47731?w=400&h=400&fit=crop", // Parrot
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop", // Hamster
    "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&h=400&fit=crop", // Deer
    "https://images.unsplash.com/photo-1564349683136-77e08bef1ed1?w=400&h=400&fit=crop", // Panda
    "https://images.unsplash.com/photo-1459262443546-7784e28890f1?w=400&h=400&fit=crop", // Penguin
    "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?w=400&h=400&fit=crop"  // Giraffe
  ],
  space: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1464802686167-b939a67e06a1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1447433589675-4aaa56a4010a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop"
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1484723088339-fe28233e560e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
  ],
  nature: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1505765050516-f72feac8161e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1418489098021-ce81b3831f4a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1500627844105-eb940e4f0393?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1433086566608-57a448446968?w=400&h=400&fit=crop"
  ],
  robots: [
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop"
  ]
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1614850523020-c05b28ce3218?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682257-2f9c67f3a523?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682258-00967e97d33d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682260-96773eb0237a?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=400&fit=crop"
];

/**
 * Pre-loads a list of images into the browser cache.
 */
async function preloadImages(urls: string[], onProgress: (p: number) => void): Promise<void> {
  const promises = urls.map((url, index) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        onProgress(Math.floor(((index + 1) / urls.length) * 100));
        resolve(url);
      };
      img.onerror = () => {
        console.error("Failed to load image:", url);
        resolve(url); // Resolve anyway to allow game to continue with fallback
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
  onProgress(`Selecting theme: ${theme}...`, 10);
  
  // Normalize theme name
  const themeKey = Object.keys(IMAGE_BANK).find(k => k === theme.toLowerCase()) || 'animals';
  let pool = IMAGE_BANK[themeKey] || DEFAULT_IMAGES;

  // Handle custom themes or fallbacks by building a specific URL if not in bank
  if (!IMAGE_BANK[theme.toLowerCase()] && theme.length > 0) {
     pool = Array.from({ length: 12 }, (_, i) => 
       `https://loremflickr.com/400/400/${encodeURIComponent(theme)}?lock=${i + 100}`
     );
  }

  // Shuffle and pick required count
  const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

  onProgress(`Downloading high-res assets...`, 30);

  // Pre-load logic
  await preloadImages(selected, (p) => {
    onProgress(`Downloading high-res assets... ${p}%`, 30 + (p * 0.7));
  });

  onProgress(`Ready!`, 100);
  return selected;
}
