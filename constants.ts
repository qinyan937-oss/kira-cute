
import { BackgroundPreset, FramePreset, LayoutTemplate } from './types';

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: 'bg-white', name: 'White', value: '#ffffff', type: 'color' },
  { id: 'bg-blue', name: 'Sky Blue', value: '#e0f2fe', type: 'color' },
  { id: 'bg-pink', name: 'Sakura', value: '#fce7f3', type: 'color' },
  { id: 'bg-purple', name: 'Lavender', value: '#f3e8ff', type: 'color' },
  { id: 'bg-grad-1', name: 'Sunset', value: 'linear-gradient(to top left, #fbc2eb 0%, #a6c1ee 100%)', type: 'gradient' },
];

export const FRAME_PRESETS: FramePreset[] = [
  { id: 'none', name: 'No Frame', src: '' },
  { id: 'polaroid', name: 'Polaroid', src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEzMzMiIHZpZXdCb3g9IjAgMCAxMDAwIDEzMzMiPjxyZWN0IHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEzMzMiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iNjAiLz48L3N2Zz4=' },
];

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  { id: 'cinema', name: 'Life4Cuts', description: 'Double Strip (White/Pink)', icon: '🎞️', slots: 4, aspectRatio: 1.5 }, 
  { id: 'polaroid', name: 'Polaroid', description: 'Blue Gradient & 5 Stars', icon: '📸', slots: 1, aspectRatio: 1 }, 
  { id: 'standard', name: 'ID Photo', description: 'Perfect Blue Grid', icon: '📋', slots: 1, aspectRatio: 0.77 }, 
  { id: 'driver_license', name: 'License', description: 'Pink Girl Driver Card', icon: '🪪', slots: 1, aspectRatio: 0.77 }, 
];

export const PEN_COLORS = ['#FFFFFF', '#000000', '#FF69B4', '#87CEFA', '#FFD700', '#98FB98'];

export const STICKER_CATEGORIES = {
  HATS: [{ id: 'hat_santa_classic', label: 'Santa' }],
  Y2K: [{ id: 'y2k_star_silver', label: 'Silver Star' }],
  RIBBON: [{ id: 'ribbon_red_satin', label: 'Red Satin' }],
  DOODLE: [{ id: 'doodle_sparkle', label: 'Sparkles' }],
  RETRO: [{ id: 'retro_tree', label: 'Xmas Tree' }],
  CYBER: [{ id: 'cyber_bear', label: 'Chrome Bear' }]
};

export const ALL_STICKER_IDS = Object.values(STICKER_CATEGORIES).flat().map(s => s.id);
