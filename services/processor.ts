
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
    const { canvas, personImage, backgroundImage, frameImage, lightingEnabled, noiseLevel, filmLookStrength, showDate, decorations, selectedStickerId, imageTransform, isMoeMode, aspectRatio, isImageFit } = params;
    const ctx = canvas.getContext('2d')!;
    const TW = 1000;
    const TH = aspectRatio ? 1000 / aspectRatio : 1333; 
    canvas.width = TW; canvas.height = TH;

    // Background - Fixed Gradient Support
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

        if (lightingEnabled) ctx.filter = "brightness(1.08) saturate(1.15) contrast(0.95)";
        ctx.drawImage(personImage, dx, dy, imgW*finalScale, imgH*finalScale);
        ctx.filter = "none";
        
        if (isMoeMode) {
            ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.filter = "blur(12px)"; ctx.globalAlpha = 0.3;
            ctx.drawImage(personImage, dx, dy, imgW*finalScale, imgH*finalScale); ctx.restore();
        }
        ctx.restore();
    }

    // Stickers & Drawing
    if (decorations) {
        decorations.strokes.forEach(s => {
            ctx.beginPath(); ctx.lineWidth = s.width; ctx.strokeStyle = s.color;
            if (s.isNeon) { ctx.shadowBlur = 15; ctx.shadowColor = s.color; }
            s.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.stroke(); ctx.shadowBlur = 0;
        });
        decorations.stickers.forEach(s => {
            ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rotation); ctx.scale(s.scale * (s.isFlipped ? -1 : 1), s.scale);
            ctx.font = "80px sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText("✨", 0, 0); 
            if (selectedStickerId === s.id) { ctx.strokeStyle = '#3b82f6'; ctx.setLineDash([10,5]); ctx.strokeRect(-60,-60,120,120); }
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

    if (templateId === 'cinema') {
        const styles = [
            { bg: '#ffffff', accent: '#ec4899', name: 'white' },
            { bg: '#fce7f3', accent: '#db2777', name: 'pink' }
        ];

        styles.forEach(style => {
            const sheet = document.createElement('canvas');
            const ctx = sheet.getContext('2d')!;
            sheet.width = 600; sheet.height = 1800;
            ctx.fillStyle = style.bg; ctx.fillRect(0,0,600,1800);
            ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 596, 1796);
            
            canvases.slice(0, 4).forEach((c, i) => {
                ctx.drawImage(c, 50, 80 + i*380, 500, 340);
            });
            
            draw3DTitle(ctx, "KIRA", 300, 1660, 90, style.accent, '#fff');
            ctx.fillStyle = '#99aabb'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
            ctx.fillText(date, 300, 1740);
            results.push(sheet.toDataURL('image/png'));
        });
        
    } else {
        const sheet = document.createElement('canvas');
        const ctx = sheet.getContext('2d')!;

        if (templateId === 'polaroid') {
            sheet.width = 1100; sheet.height = 1400;
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
            results.push(sheet.toDataURL('image/png'));

        } else if (templateId === 'driver_license') {
            sheet.width = 1000; sheet.height = 630;
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
            results.push(sheet.toDataURL('image/png'));

        } else if (templateId === 'standard') {
            sheet.width = 1200; sheet.height = 800;
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

                // RIGHT INFO BOX - HORIZONTAL DESIGN AS REQUESTED
                const boxX = 820, boxY = 90, boxW = 310, boxH = 650;
                ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#000000'; ctx.lineWidth = 3;
                ctx.fillRect(boxX, boxY, boxW, boxH);
                ctx.strokeRect(boxX, boxY, boxW, boxH);

                ctx.textAlign = 'center';
                
                // Camera Icon
                ctx.font = '50px sans-serif';
                ctx.fillText("📷", boxX + boxW/2, boxY + 80);

                // Main Title
                ctx.fillStyle = '#1e3a8a';
                ctx.font = '900 34px serif';
                ctx.fillText("証明写真", boxX + boxW/2, boxY + 140);
                ctx.font = '900 24px serif';
                ctx.fillText("(ID PHOTO)", boxX + boxW/2, boxY + 180);

                // Perfect Quality Star text
                ctx.font = 'bold 18px sans-serif';
                ctx.fillText("★ PERFECT QUALITY ★", boxX + boxW/2, boxY + 230);

                // Horizontal Line
                ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(boxX + 40, boxY + 250); ctx.lineTo(boxX + boxW - 40, boxY + 250); ctx.stroke();

                // Detailed Typography
                ctx.fillStyle = '#334155'; ctx.font = 'bold 16px monospace';
                ctx.fillText(`DATE: ${date}`, boxX + boxW/2, boxY + 290);
                // Ensure Location fits
                const safeLoc = loc.length > 20 ? loc.substring(0, 17) + "..." : loc;
                ctx.fillText(`LOC: ${safeLoc}`, boxX + boxW/2, boxY + 325);
                
                ctx.fillStyle = '#94a3b8'; ctx.font = 'italic 14px serif';
                ctx.fillText("NO. 001-A4", boxX + boxW/2, boxY + 360);

                // BOTTOM PHOTO
                ctx.drawImage(c, boxX + boxW/2 - 95, boxY + 420, 190, 190);
            }
            results.push(sheet.toDataURL('image/png'));
        }
    }
    return results;
};

export const STICKER_BASE_SIZE = 150; export const STICKER_HANDLE_RADIUS = 24;
