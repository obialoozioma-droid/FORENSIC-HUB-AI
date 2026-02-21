
import React, { useState, useEffect, useRef } from 'react';
import { 
  Microscope, Terminal, Loader2, Camera, X, Send, 
  ShieldAlert, CheckCircle2, Monitor, Target, History, 
  Trash2, Scan, RotateCcw, ArrowRight, Zap, Focus, Crosshair,
  Upload, FileText, Image as ImageIcon, File, ShieldCheck,
  Timer, TimerOff, Activity, ZoomIn, ZoomOut, Minus, Plus,
  Database
} from 'lucide-react';
import { getGeminiChatStream, generateAnatomySpecimen, checkApiKey } from '../services/geminiService';
import { ChatMessage, Case, UserProfile } from '../types';

/**
 * MAPPING OF PROTOCOL ERROR CODES TO USER-FACING FEEDBACK
 */
const ERROR_PROTOCOL_MAP: Record<string, { title: string, desc: string }> = {
  'CAMERA_INIT_FAILURE': { 
    title: 'SENSOR_INITIALIZATION_ERROR', 
    desc: 'The optical sensor could not be initialized. This is typically caused by a hardware problem or the camera being used by another application.' 
  },
  'CAMERA_PERMISSION_DENIED': {
    title: 'ACCESS_RESTRICTED', 
    desc: 'Forensic imaging requires camera access. Please enable camera permissions in your browser to capture evidence specimens.'
  },
  'FILE_INGESTION_ERROR': {
    title: 'INGESTION_FAILED',
    desc: 'File packet corrupted or unsupported by forensic core.'
  },
  'API_KEY_MISSING': {
    title: 'AUTHORIZATION_REQUIRED',
    desc: 'Neural link requires a valid API key. Please select an authorized project key to continue.'
  },
  'NOT_FOUND': {
    title: 'KEY_INVALID',
    desc: 'The selected API key is invalid or has expired. Please re-authorize your session.'
  }
};

/**
 * CORE LAB TERMINAL COMPONENT
 */
const LabTerminal: React.FC<{caseContext?: Case | null, userProfile?: UserProfile | null, onClearContext?: () => void}> = ({ caseContext, userProfile, onClearContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [mode, setMode] = useState<'analysis' | 'image_analysis' | 'imaging' | 'ballistics'>('analysis');
  const [toasts, setToasts] = useState<{id: string, type: string, title: string, desc: string}[]>([]);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<{data: string, mimeType: string, preview: string, fileName?: string} | null>(null);
  
  // Camera Timer & Zoom States
  const [timerDelay, setTimerDelay] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [zoomCaps, setZoomCaps] = useState<{ min: number; max: number; step: number } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isBusy]);

  // Immediate feedback on mount
  useEffect(() => {
    const initMsg: ChatMessage = { 
      role: 'model', 
      text: 'NEURAL_LINK_ESTABLISHED: Forensic Hub Tactical Core online. Awaiting data injection.' 
    };
    setMessages([initMsg]);
  }, []);

  useEffect(() => {
    if (streamRef.current && zoomCaps) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && track.readyState === 'live' && typeof track.applyConstraints === 'function') {
        track.applyConstraints({ advanced: [{ zoom }] } as any).catch(() => {
          console.warn("ZOOM_UPDATE_FAIL: Constraint could not be applied to active track.");
        });
      }
    }
  }, [zoom, zoomCaps]);

  const addToast = (rawCode: string, type: 'error' | 'success' = 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    const info = ERROR_PROTOCOL_MAP[rawCode] || { title: rawCode, desc: 'Protocol violation detected.' };
    setToasts(prev => [...prev, { id, type, ...info }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      addToast('CAMERA_INIT_FAILURE');
      return;
    }
    try {
      // Try basic constraints first to ensure compatibility across all devices
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      setIsCameraOpen(true);
      
      const videoTrack = stream.getVideoTracks()[0];
      
      // Attempt to apply zoom if supported, but don't fail if it isn't
      if (videoTrack && typeof videoTrack.getCapabilities === 'function') {
        const caps = videoTrack.getCapabilities() as any;
        if (caps.zoom) {
          setZoomCaps({ 
            min: caps.zoom.min || 1, 
            max: caps.zoom.max || 10, 
            step: caps.zoom.step || 0.1 
          });
          
          // Apply initial zoom if possible
          if (typeof videoTrack.applyConstraints === 'function') {
            videoTrack.applyConstraints({ advanced: [{ zoom: 1 }] } as any).catch(() => {
              console.warn("ZOOM_INIT_FAIL: Hardware does not support initial zoom constraint.");
            });
          }
        }
      }
      
      setTimeout(() => { 
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Ensure video plays
          videoRef.current.play().catch(e => console.error("VIDEO_PLAY_FAIL", e));
        } 
      }, 150);
    } catch (err: any) {
      console.error("SENSOR_INIT_FAULT:", err);
      addToast(err.name === 'NotAllowedError' ? 'CAMERA_PERMISSION_DENIED' : 'CAMERA_INIT_FAILURE');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsCameraOpen(false);
    setCountdown(null);
  };

  const performCapture = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage({ data: dataUrl.split(',')[1], mimeType: 'image/jpeg', preview: dataUrl });
      stopCamera();
    }
  };

  const capture = () => {
    if (timerDelay > 0 && countdown === null) {
      let timeLeft = timerDelay;
      setCountdown(timeLeft);
      countdownIntervalRef.current = window.setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          window.clearInterval(countdownIntervalRef.current!);
          setCountdown(null);
          performCapture();
        }
      }, 1000);
    } else {
      performCapture();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCapturedImage({ data: result.split(',')[1], mimeType: file.type || 'image/jpeg', preview: result, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e?: React.FormEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    const finalInput = overridePrompt || input;
    if (!finalInput && !capturedImage) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: finalInput || (capturedImage?.fileName ? `Analyze payload: ${capturedImage.fileName}` : 'Initiate consult.'), 
      image: capturedImage ? { data: capturedImage.data, mimeType: capturedImage.mimeType } : undefined 
    };
    
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    const currentImg = capturedImage;
    setCapturedImage(null);
    setIsBusy(true);
    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      if (mode !== 'imaging') {
        const stream = getGeminiChatStream(userMsg.text, messages, mode, userMsg.image, caseContext);
        setMessages(prev => [...prev, { role: 'model', text: '📡 ESTABLISHING_LINK...' }]);
        let fullText = '';
        let firstChunk = true;
        
        for await (const chunk of stream) {
          if (abortControllerRef.current?.signal.aborted) break;
          
          if (firstChunk) {
            fullText = chunk;
            firstChunk = false;
          } else {
            fullText += chunk;
          }
          
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: 'model', text: fullText };
            return next;
          });
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🧬 INITIATING_ANATOMICAL_RECONSTRUCTION... (High-fidelity render in progress)' }]);
        const result = await generateAnatomySpecimen(userMsg.text, currentImg || undefined);
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'model', text: 'ANATOMICAL_RECONSTRUCTION: Specimen finalized.', image: { data: result.split(',')[1], mimeType: 'image/png' } };
          return next;
        });
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('API_KEY_MISSING')) {
        addToast('API_KEY_MISSING');
        await checkApiKey();
      } else if (msg.includes('not found')) {
        addToast('NOT_FOUND');
        await checkApiKey();
      } else {
        addToast(err.message || 'SYSTEM_FAILURE');
      }
    } finally {
      setIsBusy(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setMessages(prev => {
        const next = [...prev];
        if (next[next.length - 1].role === 'model' && next[next.length - 1].text.includes('ESTABLISHING')) {
          next[next.length - 1].text = '⚠️ LINK_TERMINATED: Analysis aborted by operator.';
        } else if (next[next.length - 1].role === 'model') {
          next[next.length - 1].text += '\n\n[ANALYSIS_INTERRUPTED_BY_OPERATOR]';
        }
        return next;
      });
    }
  };

  useEffect(() => {
    if (caseContext && messages.length <= 1 && !isBusy) {
      const initialPrompt = `Initiate comprehensive forensic analysis for Case ${caseContext.id}: ${caseContext.title}. Review all evidence parameters and provide a tactical investigation briefing.`;
      handleSend(undefined, initialPrompt);
    }
  }, [caseContext]);

  return (
    <div className="h-[85vh] flex flex-col bg-slate-950 border border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
      {/* Tactical Header */}
      <div className="p-8 border-b border-slate-900 flex flex-col md:flex-row md:items-center justify-between bg-black/40 backdrop-blur-md relative z-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-blue-600 rounded-3xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"><Microscope className="w-8 h-8 text-white" /></div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Tactical Analysis Bench</h2>
            {caseContext ? (
              <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                <Target size={12} /> Case Attached: {caseContext.id}
                <button onClick={onClearContext} className="ml-2 hover:text-red-400"><X size={12} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                Network Status: Online
              </div>
            )}
          </div>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
          {(['analysis', 'image_analysis', 'imaging', 'ballistics'] as const).map(m => (
            <button 
              key={m} 
              onClick={() => setMode(m)} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === m ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {m === 'analysis' ? 'Lab Core' : m === 'image_analysis' ? 'Image AI' : m === 'imaging' ? '3D Reconstruction' : 'Ballistics Trajectory Analysis'}
            </button>
          ))}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar relative" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-10 animate-pulse text-center">
            <Terminal className="w-32 h-32 mb-6 mx-auto" />
            <p className="font-black uppercase tracking-[0.6em] text-sm">Awaiting Forensic Data Stream</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] p-8 rounded-[2.5rem] relative ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#0a0f1d] border border-slate-800 text-slate-200 rounded-tl-none'}`}>
              {m.image && <img src={`data:${m.image.mimeType};base64,${m.image.data}`} className="rounded-2xl mb-4 border border-white/10 max-h-[400px] w-auto object-contain shadow-2xl" alt="Specimen" />}
              <div className="prose prose-invert max-w-none text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap">
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isBusy && (
          <div className="flex justify-start">
            <div className="bg-[#0a0f1d] border border-slate-800 p-8 rounded-[2.5rem] rounded-tl-none flex items-center gap-4 animate-pulse">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Processing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Terminal */}
      <div className="p-8 border-t border-slate-900 bg-black/40 backdrop-blur-md relative z-10">
        <form onSubmit={handleSend} className="flex gap-4">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject query or transmit payload..."
              className="w-full bg-[#020617] border border-slate-800 rounded-2xl px-14 py-6 text-white placeholder-slate-700 font-bold text-sm focus:border-blue-500/50 transition-all outline-none"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700">
              <Terminal className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-blue-400 transition-all">
              <Upload className="w-6 h-6" />
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            </button>
            <button type="button" onClick={startCamera} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-blue-400 transition-all">
              <Camera className="w-6 h-6" />
            </button>
            <button 
              type="submit" 
              disabled={isBusy || (!input.trim() && !capturedImage)} 
              className={`px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl ${isGenerating ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white disabled:opacity-30`}
              onClick={(e) => {
                if (isGenerating) {
                  e.preventDefault();
                  handleStop();
                }
              }}
            >
              {isGenerating ? 'Abort' : 'Execute'}
            </button>
          </div>
        </form>
      </div>

      {/* Camera Overlay & Toast Implementation */}
      {isCameraOpen && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-slate-950 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border border-white/10 grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => <div key={i} className="border border-white/5" />)}
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500/20 rounded-full animate-pulse flex items-center justify-center">
                 <Crosshair size={32} className="text-blue-500/40" />
              </div>
              {countdown !== null && <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 text-9xl font-black text-white">{countdown}</div>}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 pointer-events-auto">
                <button onClick={stopCamera} className="p-6 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-md border border-red-500/20"><X className="w-8 h-8" /></button>
                <button onClick={capture} disabled={countdown !== null} className="w-28 h-28 bg-white rounded-full border-[12px] border-white/20 hover:scale-110 active:scale-90 transition-all flex items-center justify-center"><Scan className="w-8 h-8 text-black" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Captured Preview */}
      {capturedImage && (
        <div className="absolute bottom-32 left-8 z-20 animate-in slide-in-from-left duration-500">
          <div className="relative p-4 bg-slate-900 border-2 border-blue-500/50 rounded-3xl shadow-2xl">
            <img src={capturedImage.preview} className="w-32 h-32 object-cover rounded-2xl" alt="Preview" />
            <button onClick={() => setCapturedImage(null)} className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full shadow-xl"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Toast System */}
      <div className="absolute top-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`p-6 rounded-2xl border flex items-center gap-4 shadow-2xl animate-in slide-in-from-right duration-500 pointer-events-auto ${t.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-200' : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'}`}>
            {t.type === 'error' ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{t.title}</p>
              <p className="text-[9px] font-bold opacity-70 leading-tight">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabTerminal;
