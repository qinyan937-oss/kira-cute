
import { GoogleGenAI } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { AppState, BackgroundPreset, FramePreset, LayoutTemplate, DecorationState, Stroke, ImageTransform, StickerItem } from './types';
import { BACKGROUND_PRESETS, FRAME_PRESETS, LAYOUT_TEMPLATES, PEN_COLORS, STICKER_CATEGORIES } from './constants';
import { loadImage, renderComposite, generateLayoutSheet, drawStickerAsset } from './services/processor';
import { playSound } from './services/audio';
import Button from './components/Button';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    appTitle: "KIRA",
    appSubtitle: "3D GUMMY KIRA",
    shots: "Shot",
    shots_plural: "Shots",
    tpl_cinema: "Life4Cuts",
    tpl_cinema_desc: "2 Separate Strips (White/Pink)",
    tpl_polaroid: "Polaroid",
    tpl_polaroid_desc: "Blue Frame & 5 Stars",
    tpl_standard: "ID Photo",
    tpl_standard_desc: "Perfect Blue Grid",
    tpl_driver_license: "License",
    tpl_driver_license_desc: "Pink Driver ID",
    choose_mode: "How to start?",
    start_camera: "Camera",
    upload_photos: "Album",
    pick_images: "Pick up to {n} images",
    cancel: "Cancel",
    reset: "Reset",
    tab_adjust: "Edit",
    tab_draw: "Draw",
    tab_sticker: "Sticker",
    tab_frame: "Frame",
    beauty_filter: "Beauty",
    moe_magic: "Moe!", 
    retro_grain: "Grain",
    film_look: "Film Tone",
    date_stamp: "Date",
    frames: "Frames",
    upload_frame: "Custom", 
    draw_hint: "Doodle time! 🎨",
    pen_normal: "Marker",
    pen_neon: "Neon",
    brush_size: "Thickness", 
    edit_photo_hint: "Tap photo to edit",
    undo: "Undo",
    enter_name: "Name", 
    enter_name_placeholder: "Your Name", 
    enter_location: "Loc", 
    enter_date: "Date", 
    flip: "Flip",
    front: "Front",
    delete: "Del",
    finish: "Finish",
    ready_msg: "✨ All Done! ✨",
    save_hint: "Long press to save",
    save_btn: "Save 📥",
    back: "Back",
    loading: "Magic...",
    mode_fit: "Fit",
    mode_fill: "Fill",
    collapse: "Hide",
    expand: "Show"
  },
  zh: {
    appTitle: "KIRA 闪闪",
    appSubtitle: "3D 果冻字",
    shots: "张",
    shots_plural: "张",
    tpl_cinema: "人生四格",
    tpl_cinema_desc: "双份独立条纸 (白/粉)",
    tpl_polaroid: "蓝彩拍立得",
    tpl_polaroid_desc: "蓝色渐变与5颗星",
    tpl_standard: "日系证件照",
    tpl_standard_desc: "完美蓝格排版",
    tpl_driver_license: "美国驾照",
    tpl_driver_license_desc: "粉色个性证件",
    choose_mode: "想怎么拍？",
    start_camera: "拍 照",
    upload_photos: "相 册",
    pick_images: "选择 {n} 张图片",
    cancel: "取消",
    reset: "重置",
    tab_adjust: "调节",
    tab_draw: "涂鸦",
    tab_sticker: "贴纸",
    tab_frame: "相框",
    beauty_filter: "美颜",
    moe_magic: "萌化!", 
    retro_grain: "颗粒感",
    film_look: "胶片感",
    date_stamp: "日期",
    frames: "相框",
    upload_frame: "上传",
    draw_hint: "在照片上画画吧！🎨",
    pen_normal: "马克笔",
    pen_neon: "荧光笔",
    brush_size: "笔触粗细", 
    edit_photo_hint: "点击照片可调节",
    undo: "撤销",
    enter_name: "姓名", 
    enter_name_placeholder: "输入名字", 
    enter_location: "地点", 
    enter_date: "日期", 
    flip: "翻转",
    front: "置顶",
    delete: "删除",
    finish: "完成",
    ready_msg: "✨ 制作完成！✨",
    save_hint: "保存到相册",
    save_btn: "保存图片 📥",
    back: "返回",
    loading: "施法中...",
    mode_fit: "留白",
    mode_fill: "填满",
    collapse: "收起",
    expand: "展开"
  }
};

const IconContainer = ({ children, color = "bg-pink-100", active = false }: { children?: React.ReactNode, color?: string, active?: boolean }) => (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border-2 ${active ? 'bg-white border-pink-400 -translate-y-1 shadow-[0_4px_0_#f472b6]' : `${color} border-white/50 shadow-inner opacity-70`}`}>
        {children}
    </div>
);

const Icons = {
    Camera: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    ),
    Image: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    ),
    Wand: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>
    ),
    Sparkles: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>
    ),
    Adjust: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
    Frame: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>,
    Brush: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2.5 2.24 0 .46.62.92 1 .92 1.81 0 2.54-.57 3.32-.57 1.77 0 3-1.35 3-3.02"/></svg>,
    Smile: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
    ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
    ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
    
    // --- 3D Hand-Drawn Template Icons ---
    Cinema3D: () => (
        <svg className="w-24 h-24 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="15" width="60" height="90" rx="10" fill="#FCE7F3" />
          <rect x="20" y="10" width="60" height="90" rx="10" fill="#F472B6" />
          <rect x="30" y="20" width="40" height="20" rx="4" fill="white" />
          <rect x="30" y="45" width="40" height="20" rx="4" fill="white" />
          <rect x="30" y="70" width="40" height="20" rx="4" fill="white" />
          <circle cx="28" cy="18" r="3" fill="#FDF2F8" />
          <path d="M85 20L85 90" stroke="#FBCFE8" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 8" />
        </svg>
    ),
    Polaroid3D: () => (
        <svg className="w-24 h-24 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="24" y="24" width="72" height="72" rx="12" fill="#E0F2FE" />
          <rect x="20" y="20" width="72" height="72" rx="12" fill="#3B82F6" />
          <rect x="32" y="32" width="48" height="40" rx="4" fill="white" />
          <rect x="28" y="78" width="56" height="8" rx="4" fill="#60A5FA" />
          <circle cx="80" cy="35" r="8" fill="#F472B6" />
          <circle cx="78" cy="33" r="8" fill="#FBCFE8" />
        </svg>
    ),
    Standard3D: () => (
        <svg className="w-24 h-24 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="24" y="24" width="72" height="84" rx="12" fill="#DBEAFE" />
          <rect x="20" y="20" width="72" height="84" rx="12" fill="#60A5FA" />
          <rect x="32" y="32" width="48" height="32" rx="6" fill="white" />
          <rect x="32" y="70" width="48" height="6" rx="3" fill="white" />
          <rect x="32" y="82" width="30" height="6" rx="3" fill="white" />
          <circle cx="28" cy="28" r="4" fill="#EFF6FF" />
        </svg>
    ),
    License3D: () => (
        <svg className="w-24 h-24 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="19" y="34" width="82" height="62" rx="12" fill="#FCE7F3" />
          <rect x="15" y="30" width="82" height="62" rx="12" fill="#F472B6" />
          <rect x="25" y="42" width="24" height="30" rx="4" fill="white" />
          <rect x="55" y="45" width="32" height="6" rx="3" fill="white" opacity="0.8" />
          <rect x="55" y="56" width="24" height="6" rx="3" fill="white" opacity="0.8" />
          <path d="M85 75L87.5 80H92.5L88.5 83.5L90 88.5L85 85.5L80 88.5L81.5 83.5L77.5 80H82.5L85 75Z" fill="#FBCFE8" />
        </svg>
    ),
};

const StickerPreview = ({ id }: { id: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, 100, 100); ctx.save(); ctx.translate(50, 50);
    drawStickerAsset(ctx, id, 35); ctx.restore();
  }, [id]);
  return <canvas ref={canvasRef} width={100} height={100} className="w-16 h-16 pointer-events-none" />;
};

const App = () => {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const t = TRANSLATIONS[lang];

  // State
  const [appState, setAppState] = useState<AppState>(AppState.TEMPLATE_SELECT);
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [uploadedImages, setUploadedImages] = useState<HTMLImageElement[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Editor State
  const [activeTab, setActiveTab] = useState<'adjust' | 'frame' | 'draw' | 'sticker'>('adjust');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [lightingEnabled, setLightingEnabled] = useState(true); 
  const [isMoeMode, setIsMoeMode] = useState(false);
  const [isImageFit, setIsImageFit] = useState(false); 
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [filmLookStrength, setFilmLookStrength] = useState(0);
  const [showDate, setShowDate] = useState(true);
  const [currentBg, setCurrentBg] = useState<BackgroundPreset>(BACKGROUND_PRESETS[0]);
  
  // Frame State
  const [currentFrameImage, setCurrentFrameImage] = useState<HTMLImageElement | null>(null);
  const frameInputRef = useRef<HTMLInputElement>(null);
  
  // Custom Name for ID/License
  const [customName, setCustomName] = useState("KIRA USER");
  const [customLocation, setCustomLocation] = useState("TOKYO / NAGOYA");
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0].replace(/-/g, '/'));

  // Transform State
  const [imageTransforms, setImageTransforms] = useState<ImageTransform[]>(
      Array.from({ length: 4 }, () => ({ x: 0, y: 0, scale: 1 }))
  );
  
  // Interaction Refs
  const interactionMode = useRef<'none' | 'draw' | 'pan' | 'sticker_drag' | 'sticker_transform'>('none');
  const startInteractionPos = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const startStickerState = useRef<StickerItem | null>(null);

  // Decorations
  const [decorations, setDecorations] = useState<DecorationState[]>(
    Array.from({ length: 4 }, () => ({ strokes: [], stickers: [] }))
  );
  const [currentPenColor, setCurrentPenColor] = useState(PEN_COLORS[2]);
  const [brushSize, setBrushSize] = useState(8);
  const [isNeonPen, setIsNeonPen] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  // Refs
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);

  // Final Result
  const [finalLayoutUrls, setFinalLayoutUrls] = useState<string[]>([]);

  // --- Effects ---

  useEffect(() => {
    if (appState === AppState.CAMERA && cameraStream && videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current.play().catch(e => console.error("Video play failed", e));
    }
  }, [appState, cameraStream]);

  useEffect(() => {
    if (appState === AppState.EDIT && uploadedImages.length > 0) {
       const timeoutId = setTimeout(() => {
           uploadedImages.forEach((img, idx) => {
               const canvas = canvasRefs.current[idx];
               if (canvas) {
                   renderComposite({
                       canvas,
                       personImage: img,
                       backgroundImage: currentBg,
                       frameImage: currentFrameImage, 
                       lightingEnabled,
                       noiseLevel,
                       filmLookStrength,
                       showDate,
                       decorations: decorations[idx],
                       imageTransform: imageTransforms[idx],
                       selectedStickerId: idx === activeImageIndex ? selectedStickerId : null,
                       isMoeMode, 
                       aspectRatio: selectedTemplate.aspectRatio,
                       isImageFit
                   });
               }
           });
       }, 10);
       return () => clearTimeout(timeoutId);
    }
  }, [appState, uploadedImages, currentBg, currentFrameImage, lightingEnabled, isMoeMode, isImageFit, noiseLevel, filmLookStrength, showDate, decorations, imageTransforms, activeImageIndex, selectedTemplate.aspectRatio, selectedStickerId]);

  // --- Handlers ---
  const handleTemplateSelect = (tpl: LayoutTemplate) => {
    setSelectedTemplate(tpl);
    setUploadedImages([]);
    setDecorations(Array.from({ length: 4 }, () => ({ strokes: [], stickers: [] })));
    setImageTransforms(Array.from({ length: 4 }, () => ({ x: 0, y: 0, scale: 1 })));
    setCurrentFrameImage(null);
    setCustomName("KIRA USER");
    setCustomLocation("TOKYO / NAGOYA");
    setCustomDate(new Date().toISOString().split('T')[0].replace(/-/g, '/'));
    setIsImageFit(false);
    canvasRefs.current = []; 
    setAppState(AppState.UPLOAD);
    playSound('pop');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, selectedTemplate.slots);
      try {
        const loadedImages = await Promise.all(
          files.map(f => loadImage(URL.createObjectURL(f as Blob)))
        );
        let finalImages = [...loadedImages];
        if (finalImages.length < selectedTemplate.slots && finalImages.length > 0) {
             while(finalImages.length < selectedTemplate.slots) {
                 finalImages.push(finalImages[finalImages.length-1]);
             }
        }
        setUploadedImages(finalImages);
        setAppState(AppState.EDIT);
        playSound('success');
      } catch (err) {
        console.error("Failed to load images", err);
      }
    }
  };

  const handleFrameSelect = async (frame: FramePreset) => {
      if (frame.id === 'none') {
          setCurrentFrameImage(null);
          playSound('cancel');
      } else {
          try {
              const img = await loadImage(frame.src);
              setCurrentFrameImage(img);
              playSound('pop');
          } catch (e) {
              console.error("Failed to load frame", e);
          }
      }
  };

  const handleCustomFrameUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const img = await loadImage(URL.createObjectURL(e.target.files[0]));
              setCurrentFrameImage(img);
              playSound('success');
          } catch (e) {
              console.error("Failed to upload frame", e);
          }
      }
  };

  const startCamera = async () => {
      try {
          const constraints = {
             audio: false,
             video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setCameraStream(stream);
          setAppState(AppState.CAMERA);
      } catch (e) {
          console.error("Camera access failed:", e);
          alert("无法访问相机 (Unable to access camera). Please check permissions.");
      }
  };

  const takeBurstPhotos = () => {
      const shotsNeeded = selectedTemplate.slots;
      const newImages: HTMLImageElement[] = [];
      const takeShot = (count: number) => {
          if (count >= shotsNeeded) {
              setUploadedImages(newImages);
              if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
              setAppState(AppState.EDIT);
              playSound('success');
              return;
          }
          let countdown = 3;
          setCameraCountdown(countdown);
          playSound('pop');
          const interval = setInterval(() => {
              countdown--;
              setCameraCountdown(countdown);
              if (countdown > 0) playSound('pop');
              if (countdown === 0) {
                  clearInterval(interval);
                  setCameraCountdown(null);
                  playSound('shutter');
                  if (videoRef.current) {
                      const canvas = document.createElement('canvas');
                      canvas.width = videoRef.current.videoWidth;
                      canvas.height = videoRef.current.videoHeight;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.translate(canvas.width, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(videoRef.current, 0, 0);
                      }
                      const img = new Image();
                      img.src = canvas.toDataURL('image/jpeg');
                      newImages.push(img);
                      setTimeout(() => takeShot(count + 1), 1000);
                  }
              }
          }, 1000);
      };
      takeShot(0);
  };

  // Canvas Interactions
  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
      setActiveImageIndex(idx);
      const pt = getCanvasPoint(e, idx);
      interactionMode.current = 'none';
      startInteractionPos.current = pt;

      if (activeTab === 'draw') {
          interactionMode.current = 'draw';
          const newStroke: Stroke = { color: currentPenColor, width: brushSize, isNeon: isNeonPen, points: [pt] };
          const newDecs = [...decorations];
          newDecs[idx].strokes.push(newStroke);
          setDecorations(newDecs);
      } else if (activeTab === 'sticker') {
          const stickers = decorations[idx].stickers;
          let hitId = null; let hitTransform = false;
          for (let i = stickers.length - 1; i >= 0; i--) {
              const s = stickers[i];
              // Check handle first
              if (s.id === selectedStickerId) {
                  const hx = s.x + (100 * s.scale) * Math.cos(s.rotation) - (100 * s.scale) * Math.sin(s.rotation);
                  const hy = s.y + (100 * s.scale) * Math.sin(s.rotation) + (100 * s.scale) * Math.cos(s.rotation);
                  if (Math.sqrt((pt.x - hx)**2 + (pt.y - hy)**2) < 40) { hitTransform = true; hitId = s.id; break; }
              }
              // Check body
              if (Math.sqrt((pt.x - s.x)**2 + (pt.y - s.y)**2) < 80 * s.scale) { hitId = s.id; break; }
          }
          if (hitId) {
              setSelectedStickerId(hitId);
              const s = stickers.find(x => x.id === hitId)!;
              startStickerState.current = { ...s };
              interactionMode.current = hitTransform ? 'sticker_transform' : 'sticker_drag';
              playSound('pop');
          } else {
              setSelectedStickerId(null);
          }
      } else if (activeTab === 'adjust') {
          interactionMode.current = 'pan';
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
          startInteractionPos.current = { x: clientX, y: clientY };
      }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
      if (interactionMode.current === 'none') return;
      if (e.cancelable) e.preventDefault();
      const pt = getCanvasPoint(e, idx);

      if (interactionMode.current === 'draw') {
           const newDecs = [...decorations];
           const strokes = newDecs[idx].strokes;
           if (strokes.length > 0) {
               strokes[strokes.length - 1].points.push(pt);
               setDecorations(newDecs);
           }
      } else if (interactionMode.current === 'sticker_drag' && selectedStickerId) {
          const newDecs = [...decorations];
          const s = newDecs[idx].stickers.find(x => x.id === selectedStickerId);
          if (s && startStickerState.current) {
              s.x = startStickerState.current.x + (pt.x - startInteractionPos.current.x);
              s.y = startStickerState.current.y + (pt.y - startInteractionPos.current.y);
              setDecorations(newDecs);
          }
      } else if (interactionMode.current === 'sticker_transform' && selectedStickerId) {
          const newDecs = [...decorations];
          const s = newDecs[idx].stickers.find(x => x.id === selectedStickerId);
          if (s && startStickerState.current) {
              const dx = pt.x - s.x, dy = pt.y - s.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              s.scale = Math.max(0.2, (dist / 141) * startStickerState.current.scale);
              s.rotation = Math.atan2(dy, dx) - 0.785;
              setDecorations(newDecs);
          }
      } else if (interactionMode.current === 'pan') {
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
          const screenDx = clientX - startInteractionPos.current.x;
          const screenDy = clientY - startInteractionPos.current.y;
          const canvas = canvasRefs.current[idx];
          const rect = canvas?.getBoundingClientRect();
          let scaleX = 2; 
          if (canvas && rect && rect.width > 0) scaleX = canvas.width / rect.width;
          const dx = screenDx * scaleX;
          const dy = screenDy * scaleX;
          const newTransforms = [...imageTransforms];
          newTransforms[idx] = { ...newTransforms[idx], x: newTransforms[idx].x + dx, y: newTransforms[idx].y + dy };
          setImageTransforms(newTransforms);
          startInteractionPos.current = { x: clientX, y: clientY };
      }
  };

  const handlePointerUp = () => {
      interactionMode.current = 'none';
      startStickerState.current = null;
  };

  const addSticker = (contentId: string) => {
      const newDecs = [...decorations];
      const id = Date.now().toString();
      newDecs[activeImageIndex].stickers.push({ id, content: contentId, x: 500, y: 700, scale: 1, rotation: 0 });
      setDecorations(newDecs); setSelectedStickerId(id); playSound('pop');
  };

  const generateFinal = async () => {
      setAppState(AppState.PROCESSING);
      setSelectedStickerId(null);
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
          const validCanvases = canvasRefs.current.filter((c): c is HTMLCanvasElement => c !== null && c instanceof HTMLCanvasElement && c.width > 0 && c.height > 0);
          const urls = generateLayoutSheet(validCanvases, selectedTemplate.id, customLocation, customName, customDate);
          setFinalLayoutUrls(urls);
          setAppState(AppState.LAYOUT);
          playSound('success');
      } catch (e) {
          console.error("Generation Error:", e);
          setAppState(AppState.EDIT);
      }
  };
  
  const handleDownload = (url: string, index: number) => {
      const a = document.createElement('a');
      a.href = url; a.download = `KIRA_${Date.now()}_${index+1}.png`; a.click();
      playSound('success');
  };

  const handleGoBack = (toState: AppState) => { setAppState(toState); playSound('cancel'); };

  const renderTemplateSelect = () => (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
          <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float pointer-events-none">☁️</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-30 animate-bounce-soft pointer-events-none">🎀</div>
          <div className="z-10 text-center mb-10">
              <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tight text-3d animate-pulse">{t.appTitle}</h1>
              <p className="text-3xl md:text-5xl font-black text-3d-blue animate-bounce-soft mt-2">
                  {t.appSubtitle}
              </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 z-10 w-full max-w-5xl">
              {LAYOUT_TEMPLATES.map(tpl => (
                  <button key={tpl.id} onClick={() => handleTemplateSelect(tpl)} className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 shadow-2xl hover:-translate-y-4 transition-all duration-300 border-[6px] border-white hover:border-pink-300 flex flex-col items-center group relative overflow-hidden">
                      <div className="mb-6 transform group-hover:rotate-6 transition-transform duration-300 drop-shadow-[0_10px_10px_rgba(236,72,153,0.3)]">
                          {(tpl.id === 'cinema' && <Icons.Cinema3D />) || (tpl.id === 'polaroid' && <Icons.Polaroid3D />) || (tpl.id === 'standard' && <Icons.Standard3D />) || <Icons.License3D />}
                      </div>
                      <h3 className="font-black text-slate-700 text-xl group-hover:text-pink-500 transition-colors">{t[`tpl_${tpl.id}` as keyof typeof t]}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-bold">{t[`tpl_${tpl.id}_desc` as keyof typeof t]}</p>
                      <span className="mt-4 bg-pink-100 text-pink-500 text-xs font-black px-4 py-1.5 rounded-full shadow-inner">{tpl.slots} {tpl.slots > 1 ? t.shots_plural : t.shots}</span>
                  </button>
              ))}
          </div>
          <div className="mt-16 flex justify-center space-x-4 z-10">
              <Button size="sm" variant={lang==='en'?'primary':'ghost'} onClick={() => setLang('en')}>English</Button>
              <Button size="sm" variant={lang==='zh'?'primary':'ghost'} onClick={() => setLang('zh')}>中文</Button>
          </div>
      </div>
  );

  const renderUpload = () => (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border-[8px] border-white relative">
              <div className="absolute -top-6 -left-6 text-6xl animate-bounce drop-shadow-md">📸</div>
              <h2 className="text-3xl font-black text-slate-700 mb-8 text-center text-3d-blue">{t.choose_mode}</h2>
              <div className="space-y-6">
                  <Button onClick={startCamera} fullWidth size="lg" className="h-24 text-xl flex flex-col gap-1 items-center justify-center"><Icons.Camera /><span>{t.start_camera}</span></Button>
                  <div className="bg-blue-50/50 p-6 rounded-3xl border-4 border-dashed border-blue-200 hover:bg-blue-50 transition-colors text-center cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform"><Icons.Image /></div>
                      <p className="text-slate-600 font-bold text-lg">{t.upload_photos}</p>
                      <p className="text-xs text-slate-400 mt-1">{t.pick_images.replace('{n}', selectedTemplate.slots.toString())}</p>
                      <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  </div>
                  <div className="pt-6 border-t border-slate-100"><Button fullWidth variant="secondary" onClick={() => handleGoBack(AppState.TEMPLATE_SELECT)}>← {t.back}</Button></div>
              </div>
          </div>
      </div>
  );
  
  const renderCamera = () => (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
             {cameraCountdown !== null && <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10"><span className="text-white text-[10rem] font-black animate-ping drop-shadow-2xl">{cameraCountdown}</span></div>}
          </div>
          <div className="h-48 bg-white/10 backdrop-blur-md flex justify-between items-center rounded-t-[3rem] border-t border-white/20 pb-8 px-10">
              <Button variant="secondary" onClick={() => { if (cameraStream) cameraStream.getTracks().forEach(t => t.stop()); handleGoBack(AppState.UPLOAD); }}>← {t.cancel}</Button>
              <button onClick={takeBurstPhotos} disabled={cameraCountdown !== null} className="w-24 h-24 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-4 border-white shadow-[0_0_0_8px_rgba(255,255,255,0.3)] flex items-center justify-center active:scale-95 transition-transform"><div className="w-20 h-20 border-2 border-white/50 rounded-full"></div></button>
              <div className="w-24 md:w-32 invisible"></div>
          </div>
      </div>
  );

  const renderEditor = () => (
      <div className="fixed inset-0 w-full flex flex-col md:flex-row overflow-hidden bg-[#fff0f5]">
          <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
              <div className="relative w-full h-full max-w-2xl max-h-full flex items-center justify-center">
                  <div className="grid gap-4 w-full h-full justify-center content-center" style={{ gridTemplateColumns: selectedTemplate.slots > 1 ? '1fr 1fr' : '1fr' }}>
                      {uploadedImages.map((img, idx) => (
                          <div key={idx} className={`relative rounded-lg overflow-hidden shadow-2xl border-[6px] transition-all duration-300 ${activeImageIndex === idx ? 'border-pink-400 scale-[1.02] rotate-1 z-10 shadow-pink-200' : 'border-white opacity-80'}`} style={{ aspectRatio: selectedTemplate.aspectRatio }}>
                              <canvas ref={el => { if (el) canvasRefs.current[idx] = el; }} className="w-full h-full object-contain bg-white cursor-crosshair touch-none" onMouseDown={(e) => handlePointerDown(e, idx)} onTouchStart={(e) => handlePointerDown(e, idx)} onMouseMove={(e) => handlePointerMove(e, idx)} onTouchMove={(e) => handlePointerMove(e, idx)} onMouseUp={handlePointerUp} onTouchEnd={handlePointerUp} onMouseLeave={handlePointerUp} />
                              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold pointer-events-none backdrop-blur-sm">#{idx + 1}</div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className={`flex-none z-20 w-full md:w-[420px] bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col rounded-t-[2.5rem] md:rounded-l-[2.5rem] md:rounded-tr-none border-t border-l border-white/60 transition-all duration-300 ${isSidebarOpen ? 'max-h-[55vh] md:h-full' : 'max-h-[140px] md:h-full'}`}>
              <div className="relative flex justify-around p-4 pb-2">
                  {[{ id: 'adjust', icon: <Icons.Adjust />, label: t.tab_adjust, color: 'bg-blue-100' }, { id: 'frame', icon: <Icons.Frame />, label: t.tab_frame, color: 'bg-purple-100' }, { id: 'draw', icon: <Icons.Brush />, label: t.tab_draw, color: 'bg-yellow-100' }, { id: 'sticker', icon: <Icons.Smile />, label: t.tab_sticker, color: 'bg-green-100' }].map(tab => (
                      <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(true); }} className="flex flex-col items-center gap-1 group">
                          <IconContainer color={tab.color} active={activeTab === tab.id}>{tab.icon}</IconContainer>
                          <span className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-pink-500' : 'text-slate-400'}`}>{tab.label}</span>
                      </button>
                  ))}
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 md:hidden">{isSidebarOpen ? <Icons.ChevronDown /> : <Icons.ChevronUp />}</button>
              </div>
              <div className="w-full h-px bg-slate-100 mb-2"></div>

              {isSidebarOpen && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {activeTab === 'adjust' && (
                      <div className="animate-fade-in space-y-5">
                        <div className="grid grid-cols-2 gap-3"><Button variant={lightingEnabled ? 'primary' : 'outline'} onClick={() => setLightingEnabled(!lightingEnabled)} size="sm"><Icons.Wand /><span className="ml-2">{t.beauty_filter}</span></Button><Button variant={isMoeMode ? 'secondary' : 'outline'} onClick={() => setIsMoeMode(!isMoeMode)} size="sm"><Icons.Sparkles /><span className="ml-2">{t.moe_magic}</span></Button></div>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <div className="flex justify-between items-center mb-2"><label className="text-xs font-bold text-slate-500">Photo Scale</label></div>
                             <input type="range" min="0.5" max="2" step="0.1" value={imageTransforms[activeImageIndex].scale} onChange={(e) => { const newT = [...imageTransforms]; newT[activeImageIndex].scale = parseFloat(e.target.value); setImageTransforms(newT); }} />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <div className="flex justify-between items-center mb-2">
                                 <label className="text-xs font-bold text-slate-500">{t.retro_grain}</label>
                                 <span className="text-[10px] font-bold text-slate-400">{(noiseLevel * 100).toFixed(0)}%</span>
                             </div>
                             <input type="range" min="0" max="1" step="0.1" value={noiseLevel} onChange={(e) => setNoiseLevel(parseFloat(e.target.value))} />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <div className="flex justify-between items-center mb-2">
                                 <label className="text-xs font-bold text-slate-500">{t.film_look}</label>
                                 <span className="text-[10px] font-bold text-slate-400">{(filmLookStrength * 100).toFixed(0)}%</span>
                             </div>
                             <input type="range" min="0" max="1" step="0.1" value={filmLookStrength} onChange={(e) => setFilmLookStrength(parseFloat(e.target.value))} />
                        </div>

                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                             <label className="text-sm font-bold text-slate-600">{t.date_stamp}</label>
                             <input type="checkbox" checked={showDate} onChange={(e) => setShowDate(e.target.checked)} className="w-6 h-6 accent-pink-500" />
                        </div>
                        
                        <div className="space-y-3 pt-4"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Background</label><div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">{BACKGROUND_PRESETS.map(bg => <button key={bg.id} onClick={() => setCurrentBg(bg)} className={`w-10 h-10 rounded-full border-4 flex-shrink-0 shadow-md ${currentBg.id === bg.id ? 'border-pink-500 scale-110' : 'border-white'}`} style={{ background: bg.value }} />)}</div></div>
                      </div>
                  )}
                  {activeTab === 'frame' && (
                      <div className="space-y-4 animate-fade-in">
                          <Button variant="secondary" fullWidth onClick={() => frameInputRef.current?.click()}>{t.upload_frame}</Button>
                          <input type="file" accept="image/png" className="hidden" ref={frameInputRef} onChange={handleCustomFrameUpload}/>
                          <div className="grid grid-cols-3 gap-3">{FRAME_PRESETS.map(frame => <button key={frame.id} onClick={() => handleFrameSelect(frame)} className={`aspect-[3/4] rounded-xl border-4 overflow-hidden relative bg-slate-50 ${currentFrameImage && frame.id !== 'none' ? 'border-pink-400' : 'border-slate-100'}`}>{frame.id === 'none' ? <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs">NONE</div> : <img src={frame.src} className="w-full h-full object-contain" />}</button>)}</div>
                      </div>
                  )}
                  {activeTab === 'draw' && (
                      <div className="animate-fade-in space-y-6">
                        <div className="flex justify-center gap-3"><Button size="sm" variant={!isNeonPen ? 'secondary' : 'outline'} onClick={() => setIsNeonPen(false)}>{t.pen_normal}</Button><Button size="sm" variant={isNeonPen ? 'primary' : 'outline'} onClick={() => setIsNeonPen(true)}>{t.pen_neon}</Button></div>
                        <div className="flex items-center gap-3"><label className="text-xs font-bold text-slate-500">Size</label><input type="range" min="4" max="80" step="2" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="flex-1" /></div>
                        <div className="flex flex-wrap gap-3 justify-center">{PEN_COLORS.map(c => <button key={c} onClick={() => setCurrentPenColor(c)} className={`w-9 h-9 rounded-full border-4 ${currentPenColor === c ? 'scale-110 border-slate-600' : 'border-white'}`} style={{ backgroundColor: c }} />)}</div>
                        <Button variant="ghost" fullWidth onClick={() => { const newDecs = [...decorations]; newDecs[activeImageIndex].strokes.pop(); setDecorations(newDecs); }}>{t.undo}</Button>
                      </div>
                  )}
                  {activeTab === 'sticker' && (
                      <div className="animate-fade-in space-y-6">
                        {selectedStickerId && (
                            <div className="bg-pink-50 p-4 rounded-2xl flex gap-3"><Button variant="outline" size="sm" fullWidth onClick={() => { const newDecs = [...decorations]; const s = newDecs[activeImageIndex].stickers.find(x => x.id === selectedStickerId); if(s) s.isFlipped = !s.isFlipped; setDecorations(newDecs); }}>{t.flip}</Button><Button variant="outline" size="sm" fullWidth onClick={() => { const newDecs = [...decorations]; const list = newDecs[activeImageIndex].stickers; const i = list.findIndex(x => x.id === selectedStickerId); if(i >= 0) list.push(list.splice(i, 1)[0]); setDecorations(newDecs); }}>{t.front}</Button><Button variant="danger" size="sm" fullWidth onClick={() => { const newDecs = [...decorations]; newDecs[activeImageIndex].stickers = newDecs[activeImageIndex].stickers.filter(s => s.id !== selectedStickerId); setDecorations(newDecs); setSelectedStickerId(null); }}>{t.delete}</Button></div>
                        )}
                        {Object.entries(STICKER_CATEGORIES).map(([cat, items]) => (
                            <div key={cat} className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{cat}</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {items.map(item => <button key={item.id} onClick={() => addSticker(item.id)} className="bg-white rounded-xl hover:bg-pink-50 border-2 border-transparent hover:border-pink-200 flex items-center justify-center p-1 shadow-sm"><StickerPreview id={item.id}/></button>)}
                                </div>
                            </div>
                        ))}
                      </div>
                  )}
              </div>
              )}
              <div className="p-4 border-t border-slate-100 flex gap-4 bg-white"><Button variant="secondary" onClick={() => handleGoBack(AppState.UPLOAD)}>← {t.back}</Button><Button fullWidth onClick={generateFinal}>{t.finish}</Button></div>
          </div>
      </div>
  );

  const renderLayout = () => (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 pb-32">
           <h2 className="text-white font-black text-4xl mb-8 animate-bounce text-3d-white">{t.ready_msg}</h2>
           <div className="flex flex-wrap gap-8 items-center justify-center">{finalLayoutUrls.map((url, i) => <div key={i} className="flex flex-col items-center gap-4"><div className="bg-white p-2 rounded-sm shadow-2xl max-h-[60vh] overflow-hidden"><img src={url} className="max-h-full" /></div><Button onClick={() => handleDownload(url, i)} size="sm">{t.save_btn}</Button></div>)}</div>
           <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-lg flex justify-center z-50"><div className="max-w-md w-full"><Button fullWidth variant="secondary" onClick={() => handleGoBack(AppState.EDIT)}>← {t.back}</Button></div></div>
      </div>
  );

  return (
    <>
      {appState === AppState.TEMPLATE_SELECT && renderTemplateSelect()}
      {appState === AppState.UPLOAD && renderUpload()}
      {appState === AppState.CAMERA && renderCamera()}
      {(appState === AppState.EDIT || appState === AppState.PROCESSING) && renderEditor()}
      {appState === AppState.PROCESSING && <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center flex-col"><div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div><p className="font-black text-pink-400 mt-4 tracking-widest">{t.loading}</p></div>}
      {appState === AppState.LAYOUT && renderLayout()}
    </>
  );
};

export default App;
