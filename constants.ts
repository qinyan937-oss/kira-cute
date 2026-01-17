
import { BackgroundPreset, FramePreset, LayoutTemplate } from './types';

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: 'bg-white', name: 'White', value: '#ffffff', type: 'color' },
  { id: 'bg-pink', name: 'Sakura', value: '#fce7f3', type: 'color' },
  { id: 'bg-blue', name: 'Sky', value: '#e0f2fe', type: 'color' },
  { id: 'bg-green', name: 'Mint', value: '#f0fdf4', type: 'color' },
  { id: 'bg-cream', name: 'Cream', value: '#fffbeb', type: 'color' },
  { id: 'bg-grad-pink', name: 'Sunset', value: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)', type: 'gradient' },
  { id: 'bg-grad-blue', name: 'Ocean', value: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', type: 'gradient' },
  { id: 'bg-grad-lavender', name: 'Dream', value: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)', type: 'gradient' },
  { id: 'bg-grad-aurora', name: 'Aurora', value: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)', type: 'gradient' },
];

const createSVGFrame = (inner: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1333" viewBox="0 0 1000 1333">
      <defs>
        <filter id="complex-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.3"/>
          <feDropShadow dx="0" dy="20" stdDeviation="25" flood-opacity="0.15"/>
        </filter>
        <filter id="inner-recess">
          <feFlood flood-color="black" flood-opacity="0.2" />
          <feComposite in2="SourceGraphic" operator="out" />
          <feGaussianBlur stdDeviation="8" />
          <feComposite in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id="glossy-3d">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.8" specularExponent="20" lighting-color="white" result="specOut">
            <fePointLight x="-5000" y="-10000" z="20000"/>
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
          <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
        </filter>
        <linearGradient id="metal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef3c7" />
          <stop offset="50%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
      </defs>
      ${inner}
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// --- 3D DECORATION HELPERS ---
const draw3DCloud = (x: number, y: number, color: string = 'white') => `
  <g filter="url(#complex-shadow)">
    <g filter="url(#glossy-3d)">
      <circle cx="${x}" cy="${y}" r="40" fill="${color}" />
      <circle cx="${x+45}" cy="${y}" r="52" fill="${color}" />
      <circle cx="${x+95}" cy="${y}" r="40" fill="${color}" />
      <circle cx="${x+30}" cy="${y-30}" r="45" fill="${color}" />
      <circle cx="${x+65}" cy="${y-30}" r="45" fill="${color}" />
    </g>
  </g>
`;

const draw3DBow = (x: number, y: number, scale: number, color: string) => `
  <g transform="translate(${x},${y}) scale(${scale})" filter="url(#complex-shadow)">
    <g filter="url(#glossy-3d)">
        <ellipse cx="-22" cy="0" rx="30" ry="22" fill="${color}" transform="rotate(-15 -22 0)" />
        <ellipse cx="22" cy="0" rx="30" ry="22" fill="${color}" transform="rotate(15 22 0)" />
        <circle cx="0" cy="0" r="14" fill="${color}" />
        <path d="M-12,12 Q-20,40 -35,35 M12,12 Q20,40 35,35" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round" />
    </g>
  </g>
`;

const draw3DStar = (x: number, y: number, r: number, color: string) => {
    let pts = "";
    for (let i = 0; i < 10; i++) {
        let a = (i * Math.PI) / 5 - Math.PI/2;
        let rd = i % 2 === 0 ? r : r * 0.45;
        pts += `${x + Math.cos(a) * rd},${y + Math.sin(a) * rd} `;
    }
    return `<polygon points="${pts}" fill="${color}" filter="url(#glossy-3d)" />`;
};

// --- RENDER HELPERS ---
// This path creates a frame with a hole using even-odd fill rule.
const framePath = (fill: string, holeScale = 0.8) => {
    const margin = (1000 * (1 - holeScale)) / 2;
    const hMarginW = 1000 - margin;
    const hMarginH = 1150; // Custom height for bottom text space
    return `<path d="M0,0 H1000 V1333 H0 Z M${margin},${margin} V${hMarginH} H${hMarginW} V${margin} Z" fill="${fill}" fill-rule="evenodd" filter="url(#inner-recess)" />`;
};

export const FRAME_PRESETS: FramePreset[] = [
  { id: 'none', name: 'No Frame', src: '' },
  { 
    id: '3d_dreamy_wand', 
    name: 'Dreamy Magic', 
    src: createSVGFrame(`
      ${framePath('#ede9fe', 0.82)}
      ${draw3DCloud(120, 100, "white")} 
      ${draw3DCloud(680, 1220, "white")}
      <g transform="translate(180, 180) rotate(-45)" filter="url(#complex-shadow)">
        <rect x="-6" y="0" width="12" height="220" fill="#a78bfa" rx="6" filter="url(#glossy-3d)" />
        ${draw3DStar(0, -20, 50, "#fde047")}
      </g>
      <text x="500" y="1250" text-anchor="middle" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" fill="#7c3aed" font-size="100" filter="url(#complex-shadow)">DREAMY</text>
      ${draw3DStar(920, 140, 40, "#fef08a")}
      ${draw3DStar(80, 1180, 30, "#fef08a")}
    `) 
  },
  { 
    id: '3d_puffy_puppy', 
    name: 'Plush Puppy', 
    src: createSVGFrame(`
      ${framePath('#ffedd5', 0.84)}
      <g transform="translate(180, 1200)" filter="url(#complex-shadow)">
        <circle cx="0" cy="0" r="75" fill="#fafaf9" filter="url(#glossy-3d)" />
        <circle cx="-55" cy="-45" r="40" fill="#fafaf9" filter="url(#glossy-3d)" />
        <circle cx="55" cy="-45" r="40" fill="#fafaf9" filter="url(#glossy-3d)" />
        <circle cx="-25" cy="-10" r="8" fill="#1c1917" />
        <circle cx="25" cy="-10" r="8" fill="#1c1917" />
        <ellipse cx="0" cy="18" rx="12" ry="8" fill="#f87171" opacity="0.6" />
      </g>
      ${draw3DBow(860, 1180, 1.3, "#fb7185")}
      <circle cx="900" cy="100" r="80" fill="#fde047" filter="url(#glossy-3d)" />
      <circle cx="860" cy="80" r="80" fill="#ffedd5" />
      <text x="520" y="1220" text-anchor="middle" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" fill="#9a3412" font-size="80">PUPPY LOVE</text>
    `) 
  },
  { 
    id: '3d_y2k_chrome', 
    name: 'Chrome Y2K', 
    src: createSVGFrame(`
      <defs>
        <pattern id="plaid-3d" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#fdf2f8" />
          <rect width="80" height="40" fill="#e0f2fe" opacity="0.5" />
          <rect width="40" height="80" fill="#e0f2fe" opacity="0.5" />
        </pattern>
      </defs>
      ${framePath('url(#plaid-3d)', 0.8)}
      <path d="M0,0 H1000 V120 H0 Z" fill="url(#metal-gold)" opacity="0.9" filter="url(#glossy-3d)" />
      <path d="M0,1050 H1000 V1333 H0 Z" fill="url(#metal-gold)" opacity="0.9" filter="url(#glossy-3d)" />
      <g transform="translate(500, 1210)" filter="url(#complex-shadow)">
        <text text-anchor="middle" font-family="Impact, sans-serif" font-weight="900" fill="#ec4899" font-size="110" stroke="white" stroke-width="12" paint-order="stroke">BEST FRIENDS</text>
      </g>
      ${draw3DBow(120, 1100, 1.4, "#f472b6")}
      ${draw3DBow(880, 1100, 1.4, "#60a5fa")}
      ${[200, 400, 600, 800].map(x => draw3DStar(x, 60, 25, "white")).join('')}
    `) 
  },
  { 
    id: '3d_night_bear', 
    name: 'Cosmic Bear', 
    src: createSVGFrame(`
      ${framePath('#1e1b4b', 0.82)}
      <g transform="translate(850, 1200)" filter="url(#complex-shadow)">
        <circle cx="0" cy="0" r="85" fill="#7c2d12" filter="url(#glossy-3d)" />
        <circle cx="-60" cy="-50" r="40" fill="#7c2d12" filter="url(#glossy-3d)" />
        <circle cx="60" cy="-50" r="40" fill="#7c2d12" filter="url(#glossy-3d)" />
        <path d="M-30,-5 Q0,15 30,-5" stroke="white" stroke-width="6" fill="none" />
        <path d="M-35,-25 L-15,-25 M15,-25 L35,-25" stroke="white" stroke-width="5" stroke-linecap="round" />
      </g>
      <circle cx="880" cy="150" r="80" fill="#fef3c7" filter="url(#glossy-3d)" />
      <circle cx="830" cy="130" r="80" fill="#1e1b4b" />
      ${[150, 300, 450, 600].map(x => `<circle cx="${x}" cy="${1220}" r="12" fill="white" filter="url(#glossy-3d)" />`).join('')}
      ${draw3DStar(150, 220, 25, "white")}
      <text x="450" y="1235" text-anchor="middle" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" fill="#c4b5fd" font-size="90">STAR NIGHT</text>
    `) 
  },
  { 
    id: '3d_sweet_berry', 
    name: 'Berry Sweet', 
    src: createSVGFrame(`
      ${framePath('#fff1f2', 0.8)}
      ${[0, 1, 2, 3, 4].map(i => `
        <g transform="translate(${150 + i*170}, 80)" filter="url(#complex-shadow)">
           <path d="M0,-30 Q20,-30 20,0 Q20,30 0,30 Q-20,30 -20,0 Q-20,-30 0,-30" fill="#f43f5e" filter="url(#glossy-3d)" />
           <circle cx="-5" cy="-5" r="3" fill="white" opacity="0.5" />
           <path d="M-5,-35 L5,-35" stroke="#16a34a" stroke-width="10" stroke-linecap="round" />
        </g>
      `).join('')}
      <text x="500" y="1230" text-anchor="middle" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" fill="#e11d48" font-size="100" filter="url(#complex-shadow)">SO SWEET!</text>
      ${draw3DBow(100, 1180, 1.2, "#fb7185")}
      ${draw3DBow(900, 1180, 1.2, "#fb7185")}
    `) 
  },
  { 
    id: '3d_ocean_pearl', 
    name: 'Ocean Pearl', 
    src: createSVGFrame(`
      ${framePath('#f0f9ff', 0.85)}
      <g transform="translate(0, 1100)">
        <path d="M0,50 Q250,0 500,50 Q750,100 1000,50 V233 H0 Z" fill="#0ea5e9" filter="url(#glossy-3d)" />
      </g>
      ${[100, 300, 500, 700, 900].map(x => `
        <circle cx="${x}" cy="${1200 + (x%200===0?20:-20)}" r="30" fill="white" filter="url(#glossy-3d)" />
      `).join('')}
      <g transform="translate(150, 150)" filter="url(#complex-shadow)">
        <path d="M-40,40 Q0,0 40,40 L0,80 Z" fill="#fca5a5" filter="url(#glossy-3d)" />
      </g>
      <text x="500" y="1240" text-anchor="middle" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" fill="white" font-size="90" filter="url(#complex-shadow)">MERMAID</text>
    `) 
  },
  { 
    id: '3d_retro_pixel', 
    name: 'Arcade Pixel', 
    src: createSVGFrame(`
      ${framePath('#0f172a', 0.8)}
      <rect x="0" y="0" width="1000" height="120" fill="#334155" />
      <rect x="0" y="1050" width="1000" height="283" fill="#334155" />
      ${[100, 200, 300, 700, 800, 900].map(x => `
        <rect x="${x-20}" y="40" width="40" height="40" fill="#22c55e" filter="url(#glossy-3d)" />
      `).join('')}
      <g transform="translate(500, 1200)" filter="url(#complex-shadow)">
        <text text-anchor="middle" font-family="monospace" font-weight="900" fill="#22c55e" font-size="90" style="letter-spacing: 20px;">INSERT COIN</text>
      </g>
      <g transform="translate(150, 1180)" filter="url(#complex-shadow)">
        <rect x="-40" y="-40" width="80" height="80" fill="#ef4444" rx="10" filter="url(#glossy-3d)" />
        <circle cx="0" cy="0" r="20" fill="white" opacity="0.3" />
      </g>
    `) 
  },
  { 
    id: '3d_princess_lace', 
    name: 'Pink Lace', 
    src: createSVGFrame(`
      ${framePath('#fdf2f8', 0.82)}
      <path d="M0,120 Q50,70 100,120 Q150,170 200,120 Q250,70 300,120 Q350,170 400,120 Q450,70 500,120 Q550,170 600,120 Q650,70 700,120 Q750,170 800,120 Q850,70 900,120 Q950,170 1000,120" fill="none" stroke="#f472b6" stroke-width="30" filter="url(#glossy-3d)" />
      <g transform="translate(500, 1200)" filter="url(#complex-shadow)">
        <text text-anchor="middle" font-family="serif" font-style="italic" font-weight="900" fill="#db2777" font-size="100">Princess</text>
      </g>
      ${draw3DBow(120, 150, 1.2, "#f472b6")}
      ${draw3DBow(880, 150, 1.2, "#f472b6")}
      ${[100, 300, 500, 700, 900].map(x => draw3DStar(x, 1080, 15, "#fbc2eb")).join('')}
    `) 
  },
  { 
    id: '3d_honey_bee', 
    name: 'Honey Party', 
    src: createSVGFrame(`
      ${framePath('#fffbeb', 0.8)}
      <g transform="translate(850, 150)" filter="url(#complex-shadow)">
        <ellipse cx="0" cy="0" rx="50" ry="40" fill="#fde047" filter="url(#glossy-3d)" />
        <rect x="-30" y="-40" width="10" height="80" fill="#1e293b" />
        <rect x="0" y="-40" width="10" height="80" fill="#1e293b" />
        <path d="M-20,-40 Q0,-60 20,-40" fill="#e2e8f0" opacity="0.6" />
      </g>
      <text x="500" y="1230" text-anchor="middle" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" fill="#d97706" font-size="95" filter="url(#complex-shadow)">BEE HAPPY</text>
      ${[100, 300, 500, 700].map(x => `
        <circle cx="${x}" cy="${80}" r="25" fill="#fbbf24" filter="url(#glossy-3d)" />
      `).join('')}
    `) 
  },
  { 
    id: '3d_galaxy_core', 
    name: 'Space Orbit', 
    src: createSVGFrame(`
      ${framePath('#020617', 0.8)}
      <circle cx="500" cy="500" r="600" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3" />
      <g transform="translate(150, 150)" filter="url(#complex-shadow)">
        <circle cx="0" cy="0" r="60" fill="#f43f5e" filter="url(#glossy-3d)" />
        <ellipse cx="0" cy="0" rx="100" ry="30" fill="none" stroke="white" stroke-width="4" transform="rotate(30)" />
      </g>
      <text x="500" y="1220" text-anchor="middle" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" fill="#60a5fa" font-size="90" filter="url(#complex-shadow)">GALAXY</text>
      ${[1, 2, 3, 4, 5].map(i => draw3DStar(Math.random()*1000, Math.random()*1333, 10, "white")).join('')}
    `) 
  }
];

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  { id: 'cinema', name: 'Life4Cuts', description: 'Double Strip (White/Pink)', slots: 4, aspectRatio: 1.25 }, 
  { id: 'polaroid', name: 'Polaroid', description: 'Blue Gradient', slots: 1, aspectRatio: 1 }, 
  { id: 'standard', name: 'ID Photo', description: 'Blue Grid', slots: 1, aspectRatio: 0.77 }, 
  { id: 'driver_license', name: 'License', description: 'Pink Card', slots: 1, aspectRatio: 0.77 }, 
];

export const PEN_COLORS = ['#FFFFFF', '#000000', '#FF69B4', '#87CEFA', '#FFD700', '#98FB98', '#FF4500'];

export const STICKER_CATEGORIES = [
  {
    id: 'y2k',
    name: 'Y2K Galactic',
    stickers: ['y2k_star_chrome', 'y2k_moon_chrome', 'y2k_star_hologram', 'y2k_planet_chrome', 'y2k_cross_star']
  },
  {
    id: 'coquette',
    name: 'Coquette',
    stickers: ['coq_bow_pink', 'coq_bow_blue', 'coq_heart_silk', 'coq_flower_silk', 'coq_ribbon_long']
  },
  {
    id: 'purikura',
    name: 'Doodles',
    stickers: ['puri_star_white', 'puri_heart_white', 'puri_cat_whisker', 'puri_sparkle', 'puri_halo']
  },
  {
    id: 'cyber',
    name: 'Cyber Pets',
    stickers: ['cyber_bear', 'cyber_bunny', 'cyber_cat', 'cyber_bird', 'cyber_fox']
  },
  {
    id: 'xmas',
    name: 'Xmas Party',
    stickers: ['xmas_hat', 'xmas_deer', 'xmas_tree', 'xmas_socks', 'xmas_gift']
  }
];
