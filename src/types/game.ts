export interface WordItem {
  id: string;
  es: string;
  en?: string;
  category?: string;
}

export interface RawCategoryFile {
  id: string;
  name: string;
  icon: string;
  description?: string;
  hasDualTitles?: boolean;
  words: {
    id: string;
    es: string;
    en?: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  hasDualTitles?: boolean;
  isCustom?: boolean;
  words: WordItem[];
}

export type GameMode = 'free' | 'score';

export interface Team {
  id: string;
  name: string;
  score: number;
  passes: number;
}

export interface ScoreConfig {
  teams: Team[];
  targetScore: number | null; // null = sin límite de puntos
}

export type ScreenState = 'home' | 'score-setup' | 'playing' | 'end-game';
