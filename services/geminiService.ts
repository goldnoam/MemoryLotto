
/**
 * Offline-First Image Service
 * Provides local Base64 SVG assets to ensure images are visible immediately.
 */

const SVGS = {
  animals: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0ZGRDcwMCIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNDAiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI0MCIgcj0iNSIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNNDAgNzAgUTUwIDgwIDYwIDcwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjIwIiBmaWxsPSIjRkY1NzMzIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUwLDEwIDkwLDkwIDEwLDkwIiBmaWxsPSIjMkVDQzcxIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1NSIgcj0iMTAiIGZpbGw9IiMyN0FFNjAiLz48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzM0OThEQiIvPjxyZWN0IHg9IjQwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0U3NEMzQyIvPjxyZWN0IHg9IjMwIiB5PSI0NSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzlCNTlCNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0YxQzQwRiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjE1IiBmaWxsPSJibGFjayIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNIDEwIDUwIEwgOTAgNTAgTCA1MCAxMCBaIiBmaWxsPSIjMUFCQzlDIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzk1QTVBNiIvPjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcng9IjMwIiBmaWxsPSIjMzQ0OTVFIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0ZGNjlCNCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIxMCIgeT0iNDAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0QzNTQwMCIvPjwvc3ZnPg=='
  ],
  space: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0YzOUMxMiIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUwLDEwIDYwLDQwIDkwLDQwIDY1LDYwIDc1LDkwIDUwLDcwIDI1LDkwIDM1LDYwIDEwLDQwIDQwLDQwIiBmaWxsPSIjRjFDNDBGIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0iIzI5ODBCOSIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjUwIiByeD0iNDUiIHJ5PSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNIDUwIDEwIEwgMjAgODAgTCA4MCA4MCBaIiBmaWxsPSIjRTc0QzNDIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI0JEQzNDNyIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZWxsaXBzZSBjeD0iNTAiIGN5PSI1MCIgcng9IjQwIiByeT0iMjAiIGZpbGw9IiM4RTQ0QUQiLz48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSI0MCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzE2QTA4NSIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iYmxhY2siLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI0QzNTQwMCIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgNTAgNTApIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iIzI3QUU2MCIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0MwMzkyQiIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
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
  await new Promise(resolve => setTimeout(resolve, 200));
  onProgress(`Done!`, 100);

  return selected;
}
