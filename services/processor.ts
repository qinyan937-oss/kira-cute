
import { BackgroundPreset, DecorationState, RenderParams, StickerItem } from "../types";

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
 * 核心贴纸绘制函数，导出供 UI 预览使用
 */
export const drawStickerAsset = (ctx: CanvasRenderingContext2D, type: string, size: number) => {
    ctx.save();
    
    // Group 1: Y2K Galactic (Liquid Metal)
    if (type.startsWith('y2k_')) {
      const grad = ctx.createLinearGradient(-size, -size, size, size);
      grad.addColorStop(0, '#e5e7eb');
      grad.addColorStop(0.2, '#ffffff');
      grad.addColorStop(0.5, '#94a3b8');
      grad.addColorStop(0.8, '#f8fafc');
      grad.addColorStop(1, '#cbd5e1');
      
      const holo = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      if (type === 'y2k_star_hologram') {
          holo.addColorStop(0, 'rgba(255, 0, 255, 0.6)');
          holo.addColorStop(0.5, 'rgba(0, 255, 255, 0.6)');
          holo.addColorStop(1, 'rgba(255, 255, 0, 0.6)');
      } else {
          holo.addColorStop(0, 'rgba(251, 194, 235, 0.4)');
          holo.addColorStop(1, 'rgba(166, 193, 238, 0.4)');
      }

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      ctx.shadowBlur = size / 4;

      if (type === 'y2k_star_chrome' || type === 'y2k_cross_star' || type === 'y2k_star_hologram') {
        const points = type === 'y2k_cross_star' ? 4 : 5;
        const inset = 0.4;
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
          const r = i % 2 === 0 ? size : size * inset;
          const angle = (Math.PI * i) / points - Math.PI/2;
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = holo;
        ctx.fill();
      } else if (type === 'y2k_moon_chrome') {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.arc(size * 0.4, 0, size * 0.8, 1.7 * Math.PI, 0.3 * Math.PI, true);
        ctx.fill();
      } else if (type === 'y2k_planet_chrome') {
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = size / 4;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.2, size * 0.3, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Group 2: Coquette Ribbons
    else if (type.startsWith('coq_')) {
      const silkHighlight = (color: string) => {
          const g = ctx.createRadialGradient(0, -size/4, 0, 0, -size/4, size);
          g.addColorStop(0, 'rgba(255,255,255,0.8)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = g;
          ctx.fill();
      };

      if (type === 'coq_bow_pink' || type === 'coq_bow_blue') {
        const isPink = type === 'coq_bow_pink';
        ctx.fillStyle = isPink ? '#f472b6' : '#60a5fa';
        ctx.beginPath();
        ctx.ellipse(-size/2, -size/4, size/2, size/3, -Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(size/2, -size/4, size/2, size/3, Math.PI/6, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-size/4, 0); ctx.lineTo(-size, size); ctx.lineTo(-size/2, size); ctx.lineTo(-size/6, size/4); ctx.closePath();
        ctx.moveTo(size/4, 0); ctx.lineTo(size, size); ctx.lineTo(size/2, size); ctx.lineTo(size/6, size/4); ctx.closePath();
        ctx.fill();
        ctx.beginPath(); ctx.arc(0, -size/4, size/4, 0, Math.PI*2); ctx.fill();
        if (!isPink) {
          ctx.globalCompositeOperation = 'source-atop';
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 10;
          for(let i = -size*2; i < size*2; i+=20) {
            ctx.beginPath(); ctx.moveTo(i, -size); ctx.lineTo(i, size); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-size, i); ctx.lineTo(size, i); ctx.stroke();
          }
        } else silkHighlight('#f472b6');
      } else if (type === 'coq_heart_silk') {
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.moveTo(0, size * 0.4);
          ctx.bezierCurveTo(-size, -size*0.6, -size*0.5, -size, 0, -size*0.3);
          ctx.bezierCurveTo(size*0.5, -size, size, -size*0.6, 0, size*0.4);
          ctx.fill();
          silkHighlight('#f472b6');
      } else if (type === 'coq_flower_silk') {
          ctx.fillStyle = '#fce7f3';
          for (let i = 0; i < 5; i++) {
              ctx.save();
              ctx.rotate((i * Math.PI * 2) / 5);
              ctx.beginPath(); ctx.ellipse(0, -size/2, size/2, size/3, 0, 0, Math.PI * 2); ctx.fill();
              ctx.restore();
          }
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath(); ctx.arc(0, 0, size/4, 0, Math.PI * 2); ctx.fill();
          silkHighlight('#fce7f3');
      } else if (type === 'coq_ribbon_long') {
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.moveTo(-size/3, -size); ctx.bezierCurveTo(-size, 0, size, 0, -size/3, size);
          ctx.lineTo(size/3, size); ctx.bezierCurveTo(size, 0, -size, 0, size/3, -size);
          ctx.closePath(); ctx.fill();
          silkHighlight('#f472b6');
      }
    }

    // Group 3: Purikura Doodles
    else if (type.startsWith('puri_')) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size / 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 10;

      if (type === 'puri_star_white') {
        ctx.beginPath();
        for(let i=0; i<4; i++) {
          ctx.moveTo(0,0);
          const angle = (i * Math.PI) / 2;
          ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        }
        ctx.stroke();
      } else if (type === 'puri_heart_white') {
        ctx.beginPath();
        ctx.moveTo(0, size/2);
        ctx.bezierCurveTo(-size, -size/2, -size/2, -size, 0, -size/4);
        ctx.bezierCurveTo(size/2, -size, size, -size/2, 0, size/2);
        ctx.stroke();
      } else if (type === 'puri_cat_whisker') {
        ctx.beginPath();
        ctx.moveTo(-size, -size/4); ctx.lineTo(-size/4, 0);
        ctx.moveTo(-size, 0); ctx.lineTo(-size/4, 0);
        ctx.moveTo(-size, size/4); ctx.lineTo(-size/4, 0);
        ctx.stroke();
      } else if (type === 'puri_sparkle') {
        ctx.beginPath();
        ctx.arc(0,0,size/4,0,Math.PI*2); ctx.stroke();
        for(let i=0; i<8; i++) {
          const a = i * Math.PI / 4;
          ctx.moveTo(Math.cos(a) * size/2, Math.sin(a) * size/2);
          ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
        }
        ctx.stroke();
      } else if (type === 'puri_halo') {
          ctx.beginPath();
          ctx.ellipse(0, 0, size, size/3, 0, 0, Math.PI * 2);
          ctx.stroke();
      }
    }

    // Group 4: Cyber Pets (Metallic 3D)
    else if (type.startsWith('cyber_')) {
      const g = ctx.createRadialGradient(-size/3, -size/3, size/10, 0, 0, size);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.3, '#94a3b8');
      g.addColorStop(1, '#475569');
      ctx.fillStyle = g;

      if (type === 'cyber_bear') {
        ctx.beginPath(); ctx.arc(0,0, size * 0.7, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(-size/1.5, -size/1.5, size/3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(size/1.5, -size/1.5, size/3, 0, Math.PI*2); ctx.fill();
      } else if (type === 'cyber_bunny') {
        ctx.beginPath(); ctx.arc(0, size/4, size * 0.6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-size/3, -size/2, size/4, size, Math.PI/12, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(size/3, -size/2, size/4, size, -Math.PI/12, 0, Math.PI*2); ctx.fill();
      } else if (type === 'cyber_cat') {
        ctx.beginPath(); ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-size * 0.5, -size * 0.3); ctx.lineTo(-size * 0.6, -size * 0.8); ctx.lineTo(-size * 0.1, -size * 0.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(size * 0.5, -size * 0.3); ctx.lineTo(size * 0.6, -size * 0.8); ctx.lineTo(size * 0.1, -size * 0.5); ctx.closePath(); ctx.fill();
      } else if (type === 'cyber_bird') {
          ctx.beginPath(); ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath(); ctx.moveTo(size*0.4, 0); ctx.lineTo(size*0.8, 0); ctx.lineTo(size*0.5, size*0.2); ctx.closePath(); ctx.fill();
      } else if (type === 'cyber_fox') {
          ctx.beginPath(); ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-size*0.6, -size*0.3); ctx.lineTo(-size*0.8, -size); ctx.lineTo(-size*0.2, -size*0.6); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(size*0.6, -size*0.3); ctx.lineTo(size*0.8, -size); ctx.lineTo(size*0.2, -size*0.6); ctx.closePath(); ctx.fill();
      }
    }

    // Group 5: Xmas Party
    else if (type.startsWith('xmas_')) {
      if (type === 'xmas_hat') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(-size, size/2); ctx.lineTo(size, size/2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff';
        for(let i=0; i<15; i++) {
          ctx.beginPath(); ctx.arc(-size + (size*2/15)*i, size/2, 15, 0, Math.PI*2); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(0, -size, 20, 0, Math.PI*2); ctx.fill();
      } else if (type === 'xmas_deer') {
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(0, -size/2); 
        ctx.lineTo(-size/2, -size); ctx.moveTo(0, -size/4); ctx.lineTo(size/2, -size/2);
        ctx.stroke();
      } else if (type === 'xmas_tree') {
          ctx.fillStyle = '#166534';
          for (let i = 0; i < 3; i++) {
              ctx.beginPath(); ctx.moveTo(0, -size + i*size/2); ctx.lineTo(-size + i*size/4, size/2 + i*size/4); ctx.lineTo(size - i*size/4, size/2 + i*size/4); ctx.closePath(); ctx.fill();
          }
      } else if (type === 'xmas_socks') {
          ctx.fillStyle = '#ef4444'; ctx.lineWidth = size/2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(0, -size/2); ctx.lineTo(0, size/2); ctx.lineTo(size/2, size/2); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-size/4, -size*0.7, size/2, size/3);
      } else if (type === 'xmas_gift') {
          ctx.fillStyle = '#ef4444'; ctx.fillRect(-size/2, -size/2, size, size);
          ctx.fillStyle = '#fbbf24'; ctx.fillRect(-size/8, -size/2, size/4, size); ctx.fillRect(-size/2, -size/8, size, size/4);
          ctx.beginPath(); ctx.arc(0, -size/2, size/4, 0, Math.PI * 2); ctx.stroke();
      }
    }

    ctx.restore();
};

export const renderComposite = (params: RenderParams) => {
    const { canvas, personImage, backgroundImage, frameImage, decorations, lightingEnabled, noiseLevel, contrast, imageTransform, selectedStickerId, isMoeMode, aspectRatio, dateStampEnabled, dateText } = params;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const TW = 1000;
    const TH = aspectRatio ? 1000 / aspectRatio : 1333;
    canvas.width = TW; canvas.height = TH;

    // 1. Background
    ctx.fillStyle = backgroundImage?.value || '#ffffff';
    if (backgroundImage?.type === 'gradient') {
        const g = ctx.createLinearGradient(0, 0, TW, TH);
        g.addColorStop(0, '#fbc2eb'); g.addColorStop(1, '#a6c1ee');
        ctx.fillStyle = g;
    }
    ctx.fillRect(0, 0, TW, TH);

    // 2. Person Image
    if (personImage) {
        ctx.save();
        const transform = imageTransform || { x: 0, y: 0, scale: 1 };
        ctx.translate(TW/2 + transform.x, TH/2 + transform.y);
        ctx.scale(transform.scale, transform.scale);
        ctx.translate(-TW/2, -TH/2);
        
        const imgW = personImage.naturalWidth, imgH = personImage.naturalHeight;
        const scale = Math.max(TW / imgW, TH / imgH);
        const drawW = imgW * scale, drawH = imgH * scale;
        const drawX = (TW - drawW)/2, drawY = (TH - drawH)/2;

        const personContrast = contrast * (lightingEnabled ? 0.95 : 1.0);
        if (isMoeMode) {
            ctx.filter = `brightness(1.1) saturate(1.25) contrast(${0.9 * contrast})`;
            ctx.drawImage(personImage, drawX, drawY, drawW, drawH);
            ctx.globalAlpha = 0.3;
            ctx.filter = `blur(4px) contrast(${contrast})`;
            ctx.drawImage(personImage, drawX, drawY, drawW, drawH);
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.5;
            ctx.filter = `blur(12px) brightness(1.3) contrast(${contrast})`;
            ctx.drawImage(personImage, drawX, drawY, drawW, drawH);
        } else {
            ctx.filter = lightingEnabled ? `brightness(1.1) contrast(${personContrast}) saturate(1.1)` : `contrast(${contrast})`;
            ctx.drawImage(personImage, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }

    // 3. Noise
    if (noiseLevel > 0) {
        try {
            const idata = ctx.getImageData(0, 0, TW, TH);
            const data = idata.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * noiseLevel * 100;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
                data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
            }
            ctx.putImageData(idata, 0, 0);
        } catch (e) {
            console.warn("Noise rendering failed.");
        }
    }

    // 4. Strokes
    if (decorations?.strokes) {
        decorations.strokes.forEach(s => {
            if (s.points.length < 2) return;
            ctx.save();
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            if (s.type === 'neon') {
                ctx.shadowColor = s.color; ctx.shadowBlur = s.width * 1.5;
                ctx.strokeStyle = s.color; ctx.lineWidth = s.width; ctx.globalAlpha = 0.8;
                drawSmoothPath(ctx, s.points);
                ctx.shadowBlur = 0; ctx.strokeStyle = '#fff'; ctx.lineWidth = s.width * 0.4; ctx.globalAlpha = 1.0;
                drawSmoothPath(ctx, s.points);
            } else {
                ctx.strokeStyle = s.color; ctx.lineWidth = s.width;
                drawSmoothPath(ctx, s.points);
            }
            ctx.restore();
        });
    }

    // 5. Frame
    if (frameImage) {
        ctx.drawImage(frameImage, 0, 0, TW, TH);
    }

    // 6. Stickers
    if (decorations?.stickers) {
      decorations.stickers.forEach(s => {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(s.scale, s.scale);
        ctx.rotate(s.rotation);
        
        drawStickerAsset(ctx, s.type, 80);

        if (s.id === selectedStickerId) {
          ctx.setLineDash([10, 5]);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 4;
          ctx.strokeRect(-90, -90, 180, 180);
          
          ctx.setLineDash([]);
          ctx.fillStyle = '#ec4899';
          ctx.beginPath(); ctx.arc(90, 90, 12, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
      });
    }

    // 7. Date Stamp - 高真实感经典胶片数字水印 (模拟截图中的橘红色点阵发光)
    if (dateStampEnabled) {
        ctx.save();
        const d = new Date();
        const year = String(d.getFullYear()).slice(-2);
        const month = String(d.getMonth() + 1);
        const day = String(d.getDate());
        const displayDate = `${year}  ${month.padStart(1, ' ')} ${day.padStart(2, ' ')}`;

        ctx.textAlign = 'right';
        ctx.font = '900 48px sans-serif'; 
        
        const x = TW - 70;
        const y = TH - 70;

        ctx.shadowColor = 'rgba(255, 80, 0, 0.7)';
        ctx.shadowBlur = 25;
        ctx.fillStyle = 'rgba(255, 110, 0, 0.4)';
        ctx.fillText(displayDate, x, y);

        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(255, 125, 0, 0.9)';
        ctx.fillText(displayDate, x, y);

        ctx.shadowBlur = 4;
        ctx.fillStyle = 'rgba(255, 160, 20, 1)';
        ctx.fillText(displayDate, x, y);
        
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for(let lineY = y - 50; lineY < y + 10; lineY += 4) {
          ctx.fillRect(x - 300, lineY, 300, 1);
        }
        
        ctx.restore();
    }
};

const drawSmoothPath = (ctx: CanvasRenderingContext2D, points: any[]) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    ctx.stroke();
};

export const generateLayoutSheetAsync = async (canvases: string[], templateId: string, loc: string, name: string, date: string): Promise<string[]> => {
    const images = await Promise.all(canvases.map(c => loadImage(c)));
    const finalDate = date || new Date().toISOString().split('T')[0].replace(/-/g, '/');

    if (templateId === 'cinema') {
        const renderStrip = (bg: string) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1200; canvas.height = 3800;
            const ctx = canvas.getContext('2d');
            if (!ctx) return "";
            
            ctx.fillStyle = bg; ctx.fillRect(0, 0, 1200, 3800);
            
            const numImages = images.length;
            const contentHeight = 3100;
            const slotHeight = contentHeight / Math.max(numImages, 1);
            const gap = 30;

            for(let i=0; i<numImages; i++) {
                if (images[i]) {
                  const imgH = slotHeight - gap;
                  ctx.drawImage(images[i], 100, 150 + i * slotHeight, 1000, imgH);
                }
            }
            ctx.fillStyle = '#ec4899';
            ctx.font = '900 180px sans-serif'; 
            ctx.textAlign = 'center';
            ctx.fillText("KIRA", 600, 3550);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '900 60px sans-serif';
            ctx.fillText(finalDate, 600, 3680);
            return canvas.toDataURL('image/png');
        };

        // 人生四格返回两张独立成片
        return [renderStrip('#ffffff'), renderStrip('#fce7f3')];
    }

    if (templateId === 'driver_license') {
        const canvas = document.createElement('canvas');
        canvas.width = 1800; canvas.height = 1100;
        const ctx = canvas.getContext('2d');
        if (!ctx) return [];
        
        ctx.fillStyle = '#fce7f3'; ctx.fillRect(0, 0, 1800, 1100);
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)'; ctx.lineWidth = 2;
        for(let i=0; i<1800; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1100); ctx.stroke(); }
        for(let i=0; i<1100; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1800, i); ctx.stroke(); }

        ctx.fillStyle = '#ec4899'; ctx.fillRect(0, 0, 1800, 150);
        ctx.fillStyle = '#000'; ctx.font = '600 60px sans-serif'; 
        ctx.fillText("GIRLSWHODRIVE. CLUB", 50, 95);
        ctx.textAlign = 'right'; ctx.fillText("DRIVER LICENCE", 1750, 95); ctx.textAlign = 'left';

        if (images[0]) ctx.drawImage(images[0], 80, 220, 550, 715);
        ctx.fillStyle = '#000'; ctx.font = '700 80px sans-serif';
        ctx.fillText(name.toUpperCase(), 150, 1030);

        ctx.font = '600 50px sans-serif'; ctx.fillStyle = '#ec4899';
        ctx.fillText("DL 12345678", 700, 300);
        ctx.fillStyle = '#ef4444'; ctx.fillText(`EXP ${finalDate}`, 700, 400);
        ctx.fillStyle = '#1e293b'; ctx.font = '700 75px sans-serif';
        ctx.fillText("LN USER", 700, 530);
        ctx.fillText("FN KIRA", 700, 630);
        ctx.fillStyle = '#ef4444'; ctx.fillText("DOB 02/14/1999", 700, 800);
        
        ctx.fillStyle = '#64748b'; ctx.font = '600 45px sans-serif';
        ctx.fillText("SEX F  HGT 5'-07'  WGT 125 lb", 850, 1030);

        return [canvas.toDataURL('image/png')];
    }

    if (templateId === 'standard') {
        const canvas = document.createElement('canvas');
        canvas.width = 2000; canvas.height = 1400;
        const ctx = canvas.getContext('2d');
        if (!ctx) return [];
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 2000, 1400);
        
        ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 2;
        for(let i=0; i<2000; i+=80) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1400); ctx.stroke(); }
        for(let i=0; i<1400; i+=80) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(2000, i); ctx.stroke(); }

        if (images[0]) {
            ctx.drawImage(images[0], 100, 100, 480, 640);
            ctx.drawImage(images[0], 680, 100, 480, 640);
            for(let i=0; i<4; i++) {
                ctx.drawImage(images[0], 100 + i * 290, 850, 240, 320);
            }
        }

        ctx.strokeStyle = '#000'; ctx.lineWidth = 0.5; 
        ctx.strokeRect(1320, 100, 580, 1200);
        ctx.fillStyle = '#334155'; ctx.fillRect(1550, 150, 100, 80);
        ctx.fillStyle = '#1e40af'; ctx.font = '700 80px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText("証明写真", 1610, 350);
        ctx.font = '500 45px sans-serif'; ctx.fillText("(ID PHOTO)", 1610, 420);
        ctx.font = '900 45px serif'; ctx.fillText("★ PERFECT QUALITY ★", 1610, 520);
        ctx.beginPath(); ctx.moveTo(1370, 580); ctx.lineTo(1850, 580); ctx.stroke();
        
        ctx.fillStyle = '#475569'; ctx.font = '700 40px sans-serif';
        ctx.fillText(`DATE: ${finalDate}`, 1610, 680);
        ctx.fillText(`LOC: ${loc.toUpperCase()}`, 1610, 770);
        ctx.font = '14px sans-serif'; ctx.fillText("NO. 001-A4", 1610, 840);

        if (images[0]) ctx.drawImage(images[0], 1420, 900, 380, 350);
        ctx.strokeRect(1420, 900, 380, 350);

        return [canvas.toDataURL('image/png')];
    }

    if (templateId === 'polaroid') {
        const renderSinglePolaroid = (img: HTMLImageElement | undefined) => {
            const c = document.createElement('canvas');
            c.width = 1200; c.height = 1600;
            const sctx = c.getContext('2d');
            if (!sctx) return "";
            sctx.fillStyle = '#2563eb'; sctx.fillRect(0, 0, 1200, 1600);
            if (img) sctx.drawImage(img, 80, 80, 1040, 1200);
            sctx.fillStyle = '#fff'; sctx.font = '900 140px sans-serif'; sctx.textAlign = 'center';
            sctx.fillText("KIRA", 600, 1450);
            sctx.fillStyle = '#fff'; sctx.font = '900 80px serif';
            sctx.fillText("★", 150, 1500); 
            sctx.fillStyle = '#f472b6'; sctx.fillText("★", 1080, 1380);
            sctx.fillStyle = 'rgba(255,255,255,0.4)'; sctx.fillText("★", 280, 1550);
            sctx.fillStyle = '#ec4899'; sctx.font = '900 40px serif'; sctx.fillText("★", 1080, 1520);
            return c.toDataURL('image/png');
        };

        // 拍立得只需出一张成片
        return [
            renderSinglePolaroid(images[0])
        ];
    }

    return canvases;
};
