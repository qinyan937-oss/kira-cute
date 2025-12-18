
export enum AppState {
  TEMPLATE_SELECT = 'TEMPLATE_SELECT', 
  UPLOAD = 'UPLOAD',
  CAMERA = 'CAMERA', 
  PROCESSING = 'PROCESSING',
  EDIT = 'EDIT',
  LAYOUT = 'LAYOUT'
}

export interface BackgroundPreset {
  id: string;
  name: string;
  value: string; 
  type: 'color' | 'gradient' | 'pattern';
}

export interface FramePreset {
  id: string;
  name: string;
  src: string; 
  isCustom?: boolean;
}

export interface ProcessingOptions {
  lighting: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  slots: number; 
  aspectRatio: number; 
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  color: string;
  width: number;
  points: Point[];
  isNeon?: boolean; 
}

export interface StickerItem {
  id: string;
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  isFlipped?: boolean;
}

export interface DecorationState {
  strokes: Stroke[];
  stickers: StickerItem[];
}

export interface ImageTransform {
    x: number;
    y: number;
    scale: number;
}

export interface RenderParams {
  canvas: HTMLCanvasElement;
  personImage: HTMLImageElement;
  backgroundImage?: BackgroundPreset;
  frameImage?: HTMLImageElement | null;
  lightingEnabled: boolean;
  noiseLevel?: number;
  filmLookStrength?: number; 
  showDate?: boolean;
  decorations?: DecorationState;
  imageTransform?: ImageTransform;
  selectedStickerId?: string | null;
  isMoeMode?: boolean; 
  aspectRatio?: number;
  isImageFit?: boolean; 
}
