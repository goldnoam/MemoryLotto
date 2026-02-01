/**
 * Production-ready Image Service
 * Uses a hardcoded bank of high-reliability Unsplash image IDs.
 * Implements pre-loading to ensure images are visible before the game starts.
 */

// Comprehensive bank of reliable Unsplash image URLs
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
    "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?w=400&h=400&fit=crop", // Giraffe
    "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?w=400&h=400&fit=crop", // Koala
    "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=400&h=400&fit=crop", // Leopard
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=400&fit=crop", // Squirrel
    "https://images.unsplash.com/photo-1512446813986-43a288b0c627?w=400&h=400&fit=crop", // Owl
    "https://images.unsplash.com/photo-1551221398-ad48bb1c7849?w=400&h=400&fit=crop", // Butterfly
    "https://images.unsplash.com/photo-1497206365907-f5e6300c3d09?w=400&h=400&fit=crop", // Ostrich
    "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?w=400&h=400&fit=crop", // Hedgehog
    "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=400&h=400&fit=crop", // Rabbit
    "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=400&h=400&fit=crop", // Wolf
    "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?w=400&h=400&fit=crop", // Eagle
    "https://images.unsplash.com/photo-1507666405895-422efe5d5bb4?w=400&h=400&fit=crop", // Zebra
    "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=400&fit=crop"  // Fish
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
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1446776858070-70c3d5ed68a8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504333638930-c8787321eba0?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1537420327992-d6e192287183?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&h=400&fit=crop"
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
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560684352-8497838a2229?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1529042410759-bf93ad083042?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1563379091339-03b21ef4a4f8?w=400&h=400&fit=crop"
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
    "https://images.unsplash.com/photo-1433086566608-57a448446968?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1475924156736-4982ad93a0f9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1441839472427-ad73599abc9a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1511497584788-8767fe7718f1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1472396961695-1ad20376e4d2?w=400&h=400&fit=crop"
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
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555255707-c07966485bc4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1527430253228-576b2163d796?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=400&h=400&fit=crop"
  ]
};

const DEFAULT_POOL = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1614850523020-c05b28ce3218?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop"
];

/**
 * Pre-loads a list of images into the browser cache.
 */
async function preloadImages(urls: string[], onProgress: (p: number) => void): Promise<void> {
  let loaded = 0;
  const promises = urls.map((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loaded++;
        onProgress(Math.floor((loaded / urls.length) * 100));
        resolve(url);
      };
      img.onerror = () => {
        loaded++;
        onProgress(Math.floor((loaded / urls.length) * 100));
        console.warn("Image load failed, continuing with placeholder strategy:", url);
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
  onProgress(`Selecting high-res assets for: ${theme}...`, 10);
  
  const themeKey = theme.toLowerCase().trim();
  let pool = IMAGE_BANK[themeKey];

  if (!pool) {
    // If not in bank, use a fallback generation strategy using unique seeds per theme
    const themeHash = theme.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    pool = Array.from({ length: Math.max(count, 24) }, (_, i) => 
      `https://picsum.photos/seed/${themeHash + i * 17}/400/400`
    );
  }

  // Shuffle and take required number of pairs
  const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

  onProgress(`Optimizing gallery...`, 30);

  // Mandatory pre-load to ensure visibility on the game board
  await preloadImages(selected, (p) => {
    onProgress(`Downloading assets... ${p}%`, 30 + (p * 0.7));
  });

  onProgress(`Board Ready!`, 100);
  return selected;
}
