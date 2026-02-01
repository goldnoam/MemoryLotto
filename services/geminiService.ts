/**
 * Offline-First Image Service
 * Provides local SVG-based assets to ensure the game works without an internet connection.
 */

const SVGS = {
  animals: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGODAzMyI+PHBhdGggZD0iTTEyIDJDMiAyIDIgMTAgMiAxMGMwIDUgNSAxMCAxMCAxMHMxMC01IDEwLTEwYzAtOCAwLTgtMTAtOFoiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSIxMC41IiByPSIxLjUiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTUuNSIgY3k9IjEwLjUiIHI9IjEuNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', // Lion-ish
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJabS0xIDYgY2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMSIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iOSIgcj0iMSIvPjwvc3ZnPg==', // Panda
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0E1MkEyaCI+PHBhdGggZD0iTTExIDEzLjQ0bC0yLjUtM3MtMS4zOC0uOTQtMS4zOC0yLjIyIDAtMi4yMiAyLjIyLTIuMjIgMi4yMiAwIDIuMjIgMi4yMnoiLz48L3N2Zz4=', // Fox
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQwRTA0MCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIvPjwvc3ZnPg==', // Turtle
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGNkI2QiI+PHBhdGggZD0iTTEyIDJMOCAxMGg4eiIvPjwvc3ZnPg==', // Bird
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRDAwMCI+PHBhdGggZD0iTTEyIDlsLTItNkg0bDggMThsOC0xOGgtNnoiLz48L3N2Zz4=', // Giraffe
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzgwODA4MCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=', // Elephant
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzEwMTgxOCI+PHBhdGggZD0iTTEyIDJsLTEwIDhoMjB6Ii8+PC9zdmc+', // Cat
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlhNTEyNSI+PHBhdGggZD0iTTEyIDNsLTggNWg2djh6Ii8+PC9zdmc+', // Deer
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0REREREOCI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PC9zdmc+', // Polar Bear
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwN0Y3RiI+PGVsbGlwc2UgY3g9IjEyIiBjeT0iMTIiIHJ4PSI0IiByeT0iOCIvPjwvc3ZnPg==', // Penguin
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGQTUwMCI+PHBhdGggZD0iTTEyIDJsMTAtOHYxNnoiLz48L3N2Zz4=' // Fish
  ],
  space: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGQ0IxRSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=', // Sun
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0REQUE1NSI+PHBhdGggZD0iTTEyIDJMMiAxMmwxMCAxMCAxMC0xMHpNMTEgNWgydjJIMTF6Ii8+PC9zdmc+', // Planet
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTEyIDlsLTIuNSAyLjUtMS0xTDEyIDZ6Ii8+PC9zdmc+', // Star
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzBFRkZGRiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjYiLz48L3N2Zz4=', // Moon
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGMDAwMCI+PHBhdGggZD0iTTEyIDJsLTggMTBoMTZ6Ii8+PC9zdmc+', // Rocket
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzU1NTVGRiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMTAiLz48L3N2Zz4=', // Galaxy
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRUEwMCI+PHBhdGggZD0iTTEyIDJsMiA2aDZsLTUgNGwyIDZoLTVsLTUgNGwyLTZ6Ii8+PC9zdmc+', // Star Big
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzU1NTVGRiI+PGVsbGlwc2UgY3g9IjEyIiBjeT0iMTIiIHJ4PSIxMCIgcnk9IjUiLz48L3N2Zz4=', // Saturn
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzgwODA4MCI+PHJlY3QgeD0iMTAiIHk9IjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIi8+PC9zdmc+', // Satellite
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIvPjwvc3ZnPg==', // Black hole center
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzBFRkZGRiI+PHBhdGggZD0iTTIgMTJsMTAgMTBMMjIgMTJMMTIgMnoiLz48L3N2Zz4=', // Crystal
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQ0NDQ0NCI+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIvPjwvc3ZnPg==' // Asteroid
  ],
  food: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGMDAwMCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIvPjwvc3ZnPg==', // Apple
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGQTUwMCI+PHBhdGggZD0iTTEyIDJsLTEwIDEwaDIweiIvPjwvc3ZnPg==', // Pizza
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRDAwMCI+PGVsbGlwc2UgY3g9IjEyIiBjeT0iMTIiIHJ4PSI4IiByeT0iNCIvPjwvc3ZnPg==', // Burger
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRDYwMCI+PHBhdGggZD0iTTIgMTJzMTAtNCAxMC00IDExIDQgMTEgNFMxMiAxNiAxMiAxNiAyIDIyIDIgMTJaIi8+PC9zdmc+', // Taco
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRTgzMyI+PHBhdGggZD0iTTIgMTloMjBWMTJMMiAxOXoiLz48L3N2Zz4=', // Cake
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwN0YwMCI+PHJlY3QgeD0iMTAiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjE2Ii8+PC9zdmc+', // Asparagus
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0E1MkEyaCI+PHBhdGggZD0iTTQgNGgxNnYxNkg0eiIvPjwvc3ZnPg==', // Toast
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwRkZGRiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIvPjwvc3ZnPg==', // Donut
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRDYwMCI+PHBhdGggZD0iTTQgNHYxNmwxNi04eiIvPjwvc3ZnPg==', // Cheese
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+PGVsbGlwc2UgY3g9IjEyIiBjeT0iMTIiIHJ4PSI2IiByeT0iOSIvPjwvc3ZnPg==', // Egg
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDA4OCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIvPjwvc3ZnPg==', // Blueberry
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGNDQ0NCI+PGVsbGlwc2UgY3g9IjEyIiBjeT0iMTIiIHJ4PSI4IiByeT0iNiIvPjwvc3ZnPg==' // Tomato
  ],
  nature: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwN0YwMCI+PHBhdGggZD0iTTEyIDJMOCAxMGg4eiIvPjwvc3ZnPg==', // Tree
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDBGRiI+PHBhdGggZD0iTTIgMTlzMTAtNCAxMC00IDExIDQgMTEgNHoiLz48L3N2Zz4=', // Wave
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzgwODA4MCI+PHBhdGggZD0iTTEyIDJMMiAyMmg4bDIuNS01IDIgNSA4IDB6Ii8+PC9zdmc+', // Mountain
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=', // Cloud
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRDQwMCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIvPjwvc3ZnPg==', // Sun
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGMDAwMCI+PGVsbGlwc2UgY3g9IjEyIiBjeT0iMTIiIHJ4PSI0IiByeT0iNiIvPjwvc3ZnPg==', // Flower
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0E1MkEyaCI+PHJlY3QgeD0iMTAiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSI4Ii8+PC9zdmc+', // Mushroom
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRTYzMyI+PHBhdGggZD0iTTEyIDNsLTggMThoMTZ6Ii8+PC9zdmc+', // Island
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwRkYwMCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIvPjwvc3ZnPg==', // Leaf
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwODBCMCI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PC9zdmc+', // Lake
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRSI+PHBhdGggZD0iTTIgMTJsMTAgMTBMMjIgMTJMMTIgMnoiLz48L3N2Zz4=', // Snowflake
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRTAwMCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=' // Moon Yellow
  ],
  robots: [
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzgwODA4MCI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwRkZGRiI+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTEyIDlsLTQgNGg4eiIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGMDAwMCI+PHJlY3QgeD0iMTEiIHk9IjExIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwN0Y3RiI+PGVsbGlwc2UgY3g9IjEyIiBjeT0iMTIiIHJ4PSI2IiByeT0iNiIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzgwODA4MCI+PHBhdGggZD0iTTIgMTloMjB2LTNoLTIwdjN6Ii8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwRkYwMCI+PHJlY3QgeD0iNCIgeT0iMTQiIHdpZHRoPSIxNiIgaGVpZ2h0PSI0Ii8+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDBGRiI+PHBhdGggZD0iTTExIDloMnY2aC0yek00IDEzaDR2LTRoLTR6bTEyIDBoNHYtNGgtNHoiLz48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQwNDA0MCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwRkZGRiI+PHBhdGggZD0iTTEyIDlsLTQtNHY4eiIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMSIvPjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRDAwMCI+PHJlY3QgeD0iMTAiIHk9IjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiLz48L3N2Zz4='
  ]
};

const DEFAULT_POOL = [
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzZCQTVFRiI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ii8+PC9zdmc+',
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzgzQThGRiI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ii8+PC9zdmc+',
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzZDM0M5OCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ii8+PC9zdmc+'
];

/**
 * Pre-loads the assets from the local bank.
 */
export async function generateThemeImages(
  theme: string, 
  count: number, 
  onProgress: (status: string, progress: number) => void
): Promise<string[]> {
  onProgress(`Shuffling local board: ${theme}...`, 20);
  
  const themeKey = theme.toLowerCase().trim() as keyof typeof SVGS;
  let pool = SVGS[themeKey] || SVGS.animals;

  // Handle custom theme fallback using a pseudo-random selection from all icons
  if (!SVGS[themeKey]) {
    pool = [...SVGS.animals, ...SVGS.space, ...SVGS.food, ...SVGS.nature, ...SVGS.robots];
  }

  // Shuffle and take required number
  const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

  // Simulate a quick progress to provide feedback, but it's instant since it's local
  await new Promise(resolve => {
    let p = 20;
    const int = setInterval(() => {
      p += 20;
      onProgress(`Preparing assets...`, p);
      if (p >= 100) {
        clearInterval(int);
        resolve(null);
      }
    }, 50);
  });

  return selected;
}
