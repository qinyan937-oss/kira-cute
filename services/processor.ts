
import { BackgroundPreset, FramePreset, LayoutTemplate, DecorationState, ImageTransform, RenderParams } from "../types";

// Helper to load image from URL/Blob
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

/**
 * PURE CANVAS STICKER DRAWING
 */
export const drawStickerAsset = (ctx: CanvasRenderingContext2D, id: string, size: number) => {
    ctx.save();
    switch (id) {
        // Group 1: Y2K Galactic (Liquid Metal)
        case 'y2k_galactic_star': {
            const g = ctx.createLinearGradient(-size, -size, size, size);
            g.addColorStop(0, "#FFFFFF"); g.addColorStop(0.3, "#E0E0E0"); g.addColorStop(0.5, "#B0B0B0"); g.addColorStop(0.8, "#606060"); g.addColorStop(1, "#A0A0A0");
            ctx.fillStyle = g; ctx.shadowColor = "#00FFFF"; ctx.shadowBlur = size * 0.2;
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const r = i % 2 === 0 ? size : size * 0.35;
                const a = (i * 36 - 90) * Math.PI / 180;
                ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.closePath(); ctx.fill();
            // Highlight
            ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.arc(-size*0.3, -size*0.3, size*0.15, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'y2k_galactic_moon': {
            const g = ctx.createLinearGradient(-size, -size, size, size);
            g.addColorStop(0, "#fbc2eb"); g.addColorStop(0.5, "#a6c1ee"); g.addColorStop(1, "#fbc2eb");
            ctx.fillStyle = g; ctx.shadowColor = "rgba(255,255,255,0.8)"; ctx.shadowBlur = size * 0.3;
            ctx.beginPath(); ctx.arc(0, 0, size, 0.3 * Math.PI, 1.7 * Math.PI);
            ctx.quadraticCurveTo(size * 0.4, 0, size * Math.cos(0.3 * Math.PI), size * Math.sin(0.3 * Math.PI));
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.ellipse(-size*0.4, -size*0.4, size*0.3, size*0.1, Math.PI/4, 0, Math.PI*2); ctx.fill();
            break;
        }

        // Group 2: Coquette Ribbons
        case 'coquette_ribbon_pink': {
            ctx.fillStyle = "#FFC0CB"; ctx.shadowColor = "#D22B2B"; ctx.shadowBlur = size * 0.05;
            for (let s of [-1, 1]) {
                ctx.save(); ctx.scale(s, 1);
                ctx.beginPath(); ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-size, -size, -size * 1.5, size * 0.5, 0, 0);
                ctx.fill();
                ctx.beginPath(); ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-size*0.2, size*0.5, -size*0.8, size*1.2, -size*0.5, size*1.5);
                ctx.lineWidth = size*0.2; ctx.strokeStyle = "#FFC0CB"; ctx.stroke();
                ctx.restore();
            }
            const knot = ctx.createRadialGradient(0, 0, 0, 0, 0, size*0.3);
            knot.addColorStop(0, "#FFB6C1"); knot.addColorStop(1, "#FF69B4");
            ctx.fillStyle = knot; ctx.beginPath(); ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2); ctx.fill();
            break;
        }
        case 'coquette_ribbon_blue': {
            ctx.save();
            ctx.beginPath(); ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2); ctx.clip();
            ctx.fillStyle = "#E0F2FE"; ctx.fillRect(-size, -size, size * 2, size * 2);
            ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
            const step = size * 0.25;
            for (let i = -size*2; i < size*2; i += step) {
                ctx.fillRect(i, -size*2, step/2, size*4);
                ctx.fillRect(-size*2, i, size*4, step/2);
            }
            ctx.restore();
            ctx.strokeStyle = "white"; ctx.lineWidth = size * 0.1; ctx.stroke();
            break;
        }

        // Group 3: Purikura Doodles (White + Pink Outline)
        case 'purikura_doodle_sparkle': {
            ctx.strokeStyle = "white"; ctx.lineWidth = size * 0.2; ctx.lineCap = "round";
            ctx.shadowColor = "#FF69B4"; ctx.shadowBlur = size * 0.3;
            ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(0, size); ctx.moveTo(-size, 0); ctx.lineTo(size, 0); ctx.stroke();
            ctx.lineWidth = size * 0.1; ctx.beginPath(); ctx.moveTo(-size*0.5, -size*0.5); ctx.lineTo(size*0.5, size*0.5); ctx.moveTo(size*0.5, -size*0.5); ctx.lineTo(-size*0.5, size*0.5); ctx.stroke();
            break;
        }
        case 'purikura_doodle_heart': {
            ctx.strokeStyle = "white"; ctx.lineWidth = size * 0.15; ctx.lineCap = "round";
            ctx.shadowColor = "#FF69B4"; ctx.shadowBlur = size * 0.2;
            ctx.beginPath(); ctx.moveTo(0, size * 0.4);
            ctx.bezierCurveTo(-size, -size * 0.5, -size * 0.5, -size, 0, -size * 0.3);
            ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.5, 0, size * 0.4);
            ctx.stroke();
            break;
        }
        case 'purikura_doodle_whiskers': {
            ctx.strokeStyle = "white"; ctx.lineWidth = size * 0.1; ctx.shadowColor = "#FF69B4"; ctx.shadowBlur = 8;
            for (let s of [-1, 1]) {
                ctx.save(); ctx.scale(s, 1);
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath(); ctx.moveTo(size * 0.2, (i - 1) * size * 0.15);
                    ctx.lineTo(size * 0.9, (i - 1.5) * size * 0.3); ctx.stroke();
                }
                ctx.restore();
            }
            break;
        }

        // Group 4: Cyber Pets (Liquid Metal 3D Spheres)
        case 'cyber_pet_bear': {
            const drawBall = (x: number, y: number, r: number) => {
                const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
                g.addColorStop(0, "#FFFFFF"); g.addColorStop(0.5, "#808080"); g.addColorStop(1, "#202020");
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
            };
            drawBall(0, 0, size * 0.8); // Body
            drawBall(-size*0.6, -size*0.6, size*0.35); // Ear L
            drawBall(size*0.6, -size*0.6, size*0.35); // Ear R
            ctx.fillStyle = "black"; ctx.beginPath(); ctx.arc(-size*0.2, -size*0.1, size*0.08, 0, Math.PI*2); ctx.arc(size*0.2, -size*0.1, size*0.08, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'cyber_pet_bunny': {
            const drawBall = (x: number, y: number, r: number, color: string = "#A0A0A0") => {
                const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
                g.addColorStop(0, "#FFFFFF"); g.addColorStop(0.4, color); g.addColorStop(1, "#303030");
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
            };
            drawBall(0, size*0.2, size*0.7, "#E9D5FF"); // Face
            ctx.save(); ctx.translate(-size*0.3, -size*0.4); ctx.rotate(-0.1); 
            ctx.beginPath(); ctx.ellipse(0, 0, size*0.2, size*0.7, 0, 0, Math.PI*2); 
            const eg = ctx.createRadialGradient(-size*0.1, -size*0.2, 0, 0, 0, size*0.7);
            eg.addColorStop(0, "#fff"); eg.addColorStop(1, "#E9D5FF");
            ctx.fillStyle = eg; ctx.fill(); ctx.restore();
            ctx.save(); ctx.translate(size*0.3, -size*0.4); ctx.rotate(0.1); 
            ctx.beginPath(); ctx.ellipse(0, 0, size*0.2, size*0.7, 0, 0, Math.PI*2); 
            ctx.fillStyle = eg; ctx.fill(); ctx.restore();
            break;
        }

        // Group 5: Xmas Party (Vintage Illustration)
        case 'xmas_party_hat': {
            ctx.fillStyle = "#C4423F"; ctx.strokeStyle = "#4A3328"; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(-size, size * 0.4); 
            ctx.quadraticCurveTo(0, -size * 1.5, size * 0.8, -size * 0.6); 
            ctx.lineTo(size, size * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
            // Fuzzy ball
            ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(size * 0.8, -size * 0.6, size * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            // Fur trim
            ctx.beginPath(); ctx.roundRect(-size * 1.1, size * 0.4, size * 2.2, size * 0.4, 20); ctx.fill(); ctx.stroke();
            break;
        }
        case 'xmas_party_antlers': {
            ctx.strokeStyle = "#5C3D2E"; ctx.lineWidth = size * 0.15; ctx.lineCap = "round";
            for (let s of [-1, 1]) {
                ctx.save(); ctx.scale(s, 1);
                ctx.beginPath(); ctx.moveTo(size * 0.1, size); ctx.quadraticCurveTo(size * 0.3, 0, size * 0.6, -size * 0.5);
                ctx.moveTo(size * 0.4, size * 0.3); ctx.lineTo(size * 0.85, size * 0.1);
                ctx.moveTo(size * 0.5, -size * 0.1); ctx.lineTo(size * 0.9, -size * 0.4);
                ctx.stroke(); ctx.restore();
            }
            break;
        }
        default:
            ctx.font = `${size}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText("✨", 0, 0);
    }
    ctx.restore();
};

/**
 * DECORATION DRAWING HELPERS
 */
const draw3DTitle = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, mainColor: string, shadowColor: string) => {
    ctx.save();
    ctx.font = `900 ${fontSize}px "M PLUS Rounded 1c", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.strokeText(text, x, y);
    ctx.fillStyle = shadowColor; ctx.fillText(text, x + 4, y + 4);
    ctx.fillStyle = mainColor; ctx.fillText(text, x, y);
    ctx.restore();
};

const drawHandDrawnStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, inner: number, color: string) => {
    let rot = Math.PI / 2 * 3; let step = Math.PI / 5;
    ctx.beginPath(); ctx.moveTo(cx, cy - outer);
    for (let i = 0; i < 5; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer); rot += step;
        ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner); rot += step;
    }
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
};

/**
 * RENDER COMPOSITE
 */
export const renderComposite = (params: RenderParams) => {
    const { canvas, personImage, backgroundImage, frameImage, lightingEnabled, noiseLevel, filmLookStrength, showDate, decorations, imageTransform, isMoeMode, aspectRatio, isImageFit, selectedStickerId } = params;
    const ctx = canvas.getContext('2d')!;
    const TW = 1000;
    const TH = aspectRatio ? 1000 / aspectRatio : 1333; 
    canvas.width = TW; canvas.height = TH;

    // Background
    if (backgroundImage?.type === 'gradient') {
        const g = ctx.createLinearGradient(0, 0, TW, TH);
        if (backgroundImage.id === 'bg-grad-1') {
            g.addColorStop(0, '#fbc2eb');
            g.addColorStop(1, '#a6c1ee');
        } else {
            g.addColorStop(0, '#ffffff');
            g.addColorStop(1, '#e2e8f0');
        }
        ctx.fillStyle = g;
    } else {
        ctx.fillStyle = backgroundImage?.value || '#ffffff';
    }
    ctx.fillRect(0, 0, TW, TH);

    // Person Image
    if (personImage && personImage.width > 0) {
        ctx.save();
        const imgW = personImage.naturalWidth, imgH = personImage.naturalHeight;
        const scaleBase = isImageFit ? Math.min(TW/imgW, TH/imgH) : Math.max(TW/imgW, TH/imgH);
        const finalScale = scaleBase * (imageTransform?.scale || 1);
        const dx = (TW - imgW * finalScale)/2 + (imageTransform?.x || 0);
        const dy = (TH - imgH * finalScale)/2 + (imageTransform?.y || 0);

        // Apply filters
        let filterStr = "";
        if (lightingEnabled) filterStr += "brightness(1.08) saturate(1.15) contrast(0.95) ";
        
        // Film Look affects contrast and color tone
        if (filmLookStrength && filmLookStrength > 0) {
            filterStr += `contrast(${1 - filmLookStrength * 0.15}) saturate(${1 - filmLookStrength * 0.1}) sepia(${filmLookStrength * 0.1}) `;
        }
        
        ctx.filter = filterStr || "none";
        ctx.drawImage(personImage, dx, dy, imgW*finalScale, imgH*finalScale);
        ctx.filter = "none";
        
        if (isMoeMode) {
            ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.filter = "blur(12px)"; ctx.globalAlpha = 0.3;
            ctx.drawImage(personImage, dx, dy, imgW*finalScale, imgH*finalScale); ctx.restore();
        }
        ctx.restore();
    }

    // Apply Grain (Noise)
    if (noiseLevel && noiseLevel > 0) {
        ctx.save();
        ctx.globalAlpha = noiseLevel * 0.3;
        // Draw tiny random pixels for grain effect
        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * TW;
            const y = Math.random() * TH;
            const size = Math.random() * 1.5 + 1;
            ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
            ctx.fillRect(x, y, size, size);
        }
        ctx.restore();
    }

    // Apply Film Tone Overlays
    if (filmLookStrength && filmLookStrength > 0) {
        ctx.save();
        // Warm/Pink Vintage Overlay
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = filmLookStrength * 0.35;
        ctx.fillStyle = '#ff9a9e'; // Pinkish tint
        ctx.fillRect(0, 0, TW, TH);
        
        // Slight Amber Burn
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = filmLookStrength * 0.1;
        ctx.fillStyle = '#f6d365'; // Amber tint
        ctx.fillRect(0, 0, TW, TH);
        ctx.restore();
    }

    // Drawing & Stickers
    if (decorations) {
        // Strokes
        decorations.strokes.forEach(s => {
            ctx.beginPath(); ctx.lineWidth = s.width; ctx.strokeStyle = s.color;
            if (s.isNeon) { ctx.shadowBlur = 15; ctx.shadowColor = s.color; }
            s.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.stroke(); ctx.shadowBlur = 0;
        });
        
        // Stickers
        decorations.stickers.forEach(s => {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rotation);
            ctx.scale(s.scale * (s.isFlipped ? -1 : 1), s.scale);
            
            drawStickerAsset(ctx, s.content, 80);
            
            // Selection Handle
            if (selectedStickerId === s.id) {
                ctx.strokeStyle = '#3b82f6'; ctx.setLineDash([10,5]); ctx.lineWidth = 4;
                ctx.strokeRect(-100, -100, 200, 200);
                ctx.setLineDash([]); ctx.fillStyle = '#3b82f6'; 
                ctx.beginPath(); ctx.arc(100, 100, 20, 0, Math.PI*2); ctx.fill(); // Transform handle
            }
            ctx.restore();
        });
    }

    if (frameImage) ctx.drawImage(frameImage, 0, 0, TW, TH);
};

/**
 * LAYOUT ENGINE
 */
export const generateLayoutSheet = (canvases: HTMLCanvasElement[], templateId: string, loc: string, name: string, date: string): string[] => {
    const results: string[] = [];
    const SAVE_SCALE = 0.6; // Reduced slightly more for optimized mobile storage/speed

    if (templateId === 'cinema') {
        const styles = [
            { bg: '#ffffff', accent: '#ec4899', name: 'white' },
            { bg: '#fce7f3', accent: '#db2777', name: 'pink' }
        ];

        styles.forEach(style => {
            const sheet = document.createElement('canvas');
            const ctx = sheet.getContext('2d')!;
            sheet.width = 600 * SAVE_SCALE; sheet.height = 1800 * SAVE_SCALE;
            ctx.scale(SAVE_SCALE, SAVE_SCALE);
            
            ctx.fillStyle = style.bg; ctx.fillRect(0,0,600,1800);
            ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 596, 1796);
            
            canvases.slice(0, 4).forEach((c, i) => {
                ctx.drawImage(c, 50, 80 + i*380, 500, 340);
            });
            
            draw3DTitle(ctx, "KIRA", 300, 1660, 90, style.accent, '#fff');
            ctx.fillStyle = '#99aabb'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
            ctx.fillText(date, 300, 1740);
            results.push(sheet.toDataURL('image/jpeg', 0.85)); // Using JPEG for smaller file size
        });
        
    } else {
        const sheet = document.createElement('canvas');
        const ctx = sheet.getContext('2d')!;

        if (templateId === 'polaroid') {
            sheet.width = 1100 * SAVE_SCALE; sheet.height = 1400 * SAVE_SCALE;
            ctx.scale(SAVE_SCALE, SAVE_SCALE);
            
            const g = ctx.createLinearGradient(0, 0, 0, 1400); 
            g.addColorStop(0, '#3b82f6'); 
            g.addColorStop(0.5, '#2563eb');
            g.addColorStop(1, '#1e3a8a');
            ctx.fillStyle = g; ctx.fillRect(0, 0, 1100, 1400);
            
            ctx.fillStyle = 'white'; ctx.fillRect(80, 80, 940, 940);
            ctx.drawImage(canvases[0], 80, 80, 940, 940);
            
            drawHandDrawnStar(ctx, 120, 1150, 70, 30, '#ffffff'); 
            drawHandDrawnStar(ctx, 280, 1290, 40, 18, '#cbd5e1'); 
            drawHandDrawnStar(ctx, 980, 1080, 90, 40, '#f0abfc'); 
            drawHandDrawnStar(ctx, 940, 1300, 50, 22, '#1e3a8a'); 
            drawHandDrawnStar(ctx, 1040, 1230, 35, 16, '#f472b6'); 
            
            draw3DTitle(ctx, "KIRA", 550, 1180, 110, '#fff', '#60a5fa');
            results.push(sheet.toDataURL('image/jpeg', 0.85));

        } else if (templateId === 'driver_license') {
            sheet.width = 1000 * SAVE_SCALE; sheet.height = 630 * SAVE_SCALE;
            ctx.scale(SAVE_SCALE, SAVE_SCALE);
            
            ctx.fillStyle = '#fce7f3'; ctx.fillRect(0, 0, 1000, 630);
            
            ctx.strokeStyle = '#fbcfe8'; ctx.lineWidth = 1;
            for(let x=0; x<1000; x+=25) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,630); ctx.stroke(); }
            for(let y=0; y<630; y+=25) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(1000,y); ctx.stroke(); }

            ctx.fillStyle = '#f472b6'; ctx.fillRect(0, 0, 1000, 100);
            ctx.fillStyle = 'black'; ctx.font = '900 44px serif'; ctx.fillText("GIRLSWHODRIVE.CLUB", 40, 65);
            ctx.textAlign = 'right'; ctx.fillText("DRIVER LICENCE", 960, 65); ctx.textAlign = 'left';
            
            ctx.drawImage(canvases[0], 40, 140, 310, 400); 
            
            ctx.font = 'bold 28px "Arial", sans-serif'; 
            ctx.fillStyle = '#ec4899'; ctx.fillText("DL 12345678", 380, 180);
            ctx.fillStyle = '#dc2626'; ctx.fillText(`EXP ${date}`, 380, 240);
            
            ctx.fillStyle = '#1e293b'; ctx.font = 'bold 36px sans-serif';
            ctx.fillText(`LN ${name.split(' ')[1] || 'KAVINSKY'}`, 380, 310);
            ctx.fillText(`FN ${name.split(' ')[0]}`, 380, 365);
            
            ctx.fillStyle = '#dc2626'; ctx.font = 'bold 38px sans-serif';
            ctx.fillText(`DOB 02/14/1999`, 380, 460);
            
            ctx.fillStyle = '#475569'; ctx.font = 'bold 24px sans-serif';
            ctx.fillText("SEX F   HGT 5'-07'   WGT 125 lb", 450, 590);
            
            ctx.font = '48px "Dancing Script", cursive'; 
            ctx.fillStyle = 'black'; ctx.fillText(name, 120, 595);
            results.push(sheet.toDataURL('image/jpeg', 0.85));

        } else if (templateId === 'standard') {
            sheet.width = 1200 * SAVE_SCALE; sheet.height = 800 * SAVE_SCALE;
            ctx.scale(SAVE_SCALE, SAVE_SCALE);
            
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1200, 800);
            
            ctx.strokeStyle = '#bae6fd'; ctx.lineWidth = 1;
            for(let x=0; x<=1200; x+=48) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,800); ctx.stroke(); }
            for(let y=0; y<=800; y+=48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(1200,y); ctx.stroke(); }
            
            const c = canvases[0];
            if (c) {
                ctx.drawImage(c, 70, 90, 310, 410);
                ctx.drawImage(c, 420, 90, 310, 410);
                for(let i=0; i<4; i++) {
                    ctx.drawImage(c, 70 + i*175, 530, 150, 210);
                }

                // RIGHT INFO BOX
                const boxX = 820, boxY = 90, boxW = 310, boxH = 650;
                ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#000000'; ctx.lineWidth = 3;
                ctx.fillRect(boxX, boxY, boxW, boxH);
                ctx.strokeRect(boxX, boxY, boxW, boxH);

                ctx.textAlign = 'center';
                ctx.font = '50px sans-serif';
                ctx.fillText("📷", boxX + boxW/2, boxY + 80);
                ctx.fillStyle = '#1e3a8a';
                ctx.font = '900 34px serif';
                ctx.fillText("証明写真", boxX + boxW/2, boxY + 140);
                ctx.font = '900 24px serif';
                ctx.fillText("(ID PHOTO)", boxX + boxW/2, boxY + 180);
                ctx.font = 'bold 18px sans-serif';
                ctx.fillText("★ PERFECT QUALITY ★", boxX + boxW/2, boxY + 230);
                ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(boxX + 40, boxY + 250); ctx.lineTo(boxX + boxW - 40, boxY + 250); ctx.stroke();
                ctx.fillStyle = '#334155'; ctx.font = 'bold 16px monospace';
                ctx.fillText(`DATE: ${date}`, boxX + boxW/2, boxY + 290);
                const safeLoc = loc.length > 20 ? loc.substring(0, 17) + "..." : loc;
                ctx.fillText(`LOC: ${safeLoc}`, boxX + boxW/2, boxY + 325);
                ctx.fillStyle = '#94a3b8'; ctx.font = 'italic 14px serif';
                ctx.fillText("NO. 001-A4", boxX + boxW/2, boxY + 360);
                ctx.drawImage(c, boxX + boxW/2 - 95, boxY + 420, 190, 190);
            }
            results.push(sheet.toDataURL('image/jpeg', 0.85));
        }
    }
    return results;
};
