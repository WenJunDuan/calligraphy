export interface CalligraphySettings {
  text: string;
  gridType: 'tian' | 'mi' | 'huigong';
  fontSize: number;
  color: string;
  opacity: number;
  fontFamily: string;
  lineSpacing: number;
  characterSpacing: number;
  paperSize: 'A4' | 'A3' | 'B5';
  orientation: 'portrait' | 'landscape';
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Font {
  name: string;
  file: string;
  type: 'system' | 'custom';
}

export interface GridStyle {
  name: string;
  value: 'tian' | 'mi' | 'huigong';
  description: string;
} 