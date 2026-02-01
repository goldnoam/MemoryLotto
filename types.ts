
export interface Card {
  id: number;
  pairId: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export enum GameStatus {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

export type ThemeType = 'dark' | 'bright' | 'colorful';
export type FontSize = 'small' | 'medium' | 'large';
export type LanguageCode = 'en' | 'he' | 'zh' | 'hi' | 'de' | 'es' | 'fr';

export interface GameSettings {
  pairsCount: number;
  playersCount: 1 | 2;
  theme: string;
  uiTheme: ThemeType;
  fontSize: FontSize;
  lang: LanguageCode;
}

export interface GameHistoryEntry {
  id: string;
  date: string;
  p1Score: number;
  p2Score: number;
  theme: string;
  duration: number;
  pairsCount: number;
}
