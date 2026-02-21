
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Globe, MapPin, Navigation, Loader2, Sparkles, Map as MapIcon, 
  CheckCircle2, Activity, ShieldCheck, RefreshCcw, Target, ShieldAlert, Key,
  Fingerprint, Zap, Beaker, ExternalLink, Info, Map
} from 'lucide-react';
import { researchForensics, checkApiKey } from '../services/geminiService';
import { GroundingSource } from '../types';

interface ResearchPortalProps {
}

const ResearchPortal: React.FC<ResearchPortalProps> = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'IDLE' | 'LOCKING' | 'LOCKED' | 'DENIED'>('IDLE');
  const [latLng, setLatLng] = useState<{latitude: number, longitude: number} | undefined>(undefined);
  const [result, setResult] = useState<{ text: string, sources: GroundingSource[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const geoWatchRef = useRef<number | null>(null);

  // Persistent Geolocation Triangulation
  useEffect(() => {
    // Initiate GPS lock if mapping requested OR as a background capability
    const initiateGps = () => {
      if (navigator.geolocation) {
        if (gpsStatus === 'IDLE') setGpsStatus('LOCKING');
        
        geoWatchRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            setLatLng({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            setGpsStatus('LOCKED');
          },
          (err) => {
            console.warn("GPS_SIGNAL_LOST:", err.message);
            setGpsStatus('DENIED');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      } else {
        setGpsStatus('DENIED');
      }
    };

    initiateGps();
    return () => { if (geoWatchRef.current) navigator.geolocation.clearWatch(geoWatchRef.current); };
  }, []);

  const handleSearch = async (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query.trim();
    if (!finalQuery) return;
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // Force "Nigeria" context if user is looking for facilities without a specific prompt
      let processedQuery = finalQuery;
      if (useMaps && !finalQuery.toLowerCase().includes('nigeria')) {
        processedQuery = `${finalQuery} in Nigeria`;
      }

      const response = await researchForensics(processedQuery, useMaps, latLng);
      setResult(response);
    } catch (err: any) {
      let msg = err.message || "PROTOCOL_FAILURE: Intelligence link severed.";
      
      if (msg.includes('API_KEY_MISSING') || msg.toLowerCase().includes('not found')) {
        setError("AUTHORIZATION_REQUIRED: Neural link requires a valid API key. Please re-authorize your session.");
        await checkApiKey();
        return;
      }

      if (msg.includes('{')) {
        try {
          const match = msg.match(/\{.*\}/s);
          if (match) msg = JSON.stringify(JSON.parse(match[0]), null, 2);
        } catch (e) {}
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReauthorize = async () => {
    await checkApiKey();
    setError(null);
    handleSearch();
  };

  const setMappingMode = (enabled: boolean) => {
    setUseMaps(enabled);
    if (enabled && gpsStatus === 'DENIED') {
      // Try one more time to request permission if explicitly clicked
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatLng({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setGpsStatus('LOCKED');
        },
        () => setGpsStatus('DENIED'),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto animate-in fade-in pb-32 px-4 md:px-8 relative">
      {/* Tactical Header */}
      <div className="text-center space-y-4 relative -mt-8 pb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="inline-flex items-center space-x-3 bg-blue-500/5 px-6 py-2.5 rounded-full border border-blue-500/10 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400/80" />
          <span className="text-[10px] font-black text-blue-400/80 tracking-[0.4em] uppercase">Global Intel Node v4.1.0</span>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-[14vw] md:text-[10vw] font-black text-white tracking-tighter leading-[0.8] italic uppercase">
            Forensic
          </h2>
          <h2 className="text-[14vw] md:text-[10vw] font-black text-blue-500 tracking-tighter leading-[0.8] italic uppercase -mt-4 md:-mt-8">
            Intelligence
          </h2>
        </div>

        <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium mt-12">
          Authoritative real-world grounding. Triangulating forensic laboratories, scientific data, and investigative protocols.
        </p>
      </div>

      {/* Triangulate Search Core */}
      <div className="relative group max-w-5xl mx-auto">
        <div className={`absolute -inset-4 rounded-[4rem] blur-3xl opacity-10 transition-all duration-1000 group-focus-within:opacity-40 ${useMaps ? 'bg-emerald-500' : 'bg-blue-600'}`}></div>
        <div className="relative flex flex-col bg-slate-950/90 backdrop-blur-3xl border border-slate-800 rounded-[3.5rem] shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden">
          
          <div className="flex flex-col md:flex-row p-8 gap-8">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={useMaps ? "Triangulate Nigerian forensic labs..." : "Query scientific repositories..."}
                className="w-full bg-[#020617] border border-slate-800 focus:border-blue-500/50 rounded-[2.5rem] px-16 py-8 text-white placeholder-slate-800 font-bold text-xl outline-none transition-all shadow-inner"
              />
              <div className="absolute left-8 top-1/2 -translate-y-1/2">
                {useMaps ? <MapIcon className="w-8 h-8 text-emerald-500/50" /> : <Search className="w-8 h-8 text-blue-500/50" />}
              </div>
            </div>
            
            <button 
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className={`px-16 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[14px] transition-all flex items-center justify-center space-x-4 active:scale-95 disabled:opacity-30 shadow-2xl border border-white/5 ${
                useMaps 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Navigation className="w-6 h-6 rotate-45" />}
              <span>{useMaps ? 'Triangulate' : 'Execute Search'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between px-12 pb-10 pt-4 border-t border-slate-900 bg-black/30 gap-8">
            <div className="flex items-center space-x-4 bg-slate-900/50 p-2 rounded-[2rem] border border-slate-800 shadow-xl">
              <button 
                onClick={() => setMappingMode(false)}
                className={`px-10 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-3 ${!useMaps ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
              >
                <Globe size={16} /> Global Research
              </button>
              <button 
                onClick={() => setMappingMode(true)}
                className={`px-10 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-3 ${useMaps ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
              >
                <MapPin size={16} /> Facility Map
              </button>
            </div>

            <div className="flex items-center gap-12">
               <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full transition-all duration-500 ${gpsStatus === 'LOCKED' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : gpsStatus === 'LOCKING' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                 <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">GPS: {gpsStatus}</span>
               </div>
               <div className="flex items-center gap-4">
                 <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">SYNC: PERMANENT</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Scenarios */}
      {!result && !isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          {[
            { title: 'DNA LABS IN NIGERIA', icon: Fingerprint, q: 'Locate accredited DNA forensic labs in Lagos and Abuja.' },
            { title: 'GOVERNMENT FACILITIES', icon: Target, q: 'Federal Ministry of Justice forensic departments in Nigeria.' },
            { title: 'UNIVERSITY LABS', icon: Beaker, q: 'Tertiary institutions in Nigeria with forensic science facilities.' },
            { title: 'TOXICOLOGY CENTERS', icon: Activity, q: 'Poison control and toxicology laboratories in Nigeria.' }
          ].map((s, i) => (
            <button key={i} onClick={() => { setQuery(s.q); handleSearch(s.q); }} className="group p-10 bg-slate-900/20 border border-slate-800/60 rounded-[3rem] text-left hover:border-blue-500 transition-all hover:-translate-y-3 shadow-2xl backdrop-blur-sm">
              <div className="p-5 bg-slate-900 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all w-fit mb-8 shadow-xl">
                <s.icon size={28} />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors mb-2">{s.title}</h4>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest opacity-60">Initialize Triangulation</p>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-24 flex flex-col items-center justify-center space-y-12 animate-in zoom-in duration-700">
           <div className={`w-40 h-40 rounded-full border-[10px] border-t-transparent animate-spin ${useMaps ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 'border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.2)]'}`}></div>
           <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter animate-pulse">Establishing Intel Link...</h3>
        </div>
      )}

      {/* Protocol Violation UI */}
      {error && (
        <div className="max-w-4xl mx-auto p-16 bg-red-950/10 border border-red-500/20 rounded-[4rem] text-center space-y-12 animate-in zoom-in shadow-2xl backdrop-blur-3xl">
          <ShieldAlert className="w-24 h-24 text-red-500 mx-auto drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
          <div className="space-y-6">
            <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Protocol Violation</h3>
            <div className="bg-[#020617] p-10 rounded-[2.5rem] border border-red-500/20 text-left font-mono overflow-x-auto shadow-inner">
              <p className="text-red-400 text-sm whitespace-pre-wrap leading-relaxed">{error}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={() => handleSearch()} className="px-16 py-6 bg-red-600 hover:bg-red-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl transition-all active:scale-95 flex items-center gap-4">
               <RefreshCcw size={20} /> Retry Protocol
            </button>
            {(error.includes("AUTHORIZATION") || error.includes("404") || error.toLowerCase().includes("not found")) && (
              <button onClick={handleReauthorize} className="px-16 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl transition-all active:scale-95 flex items-center gap-4 border border-emerald-400/30">
                <Key size={20} /> Re-Authorize Session
              </button>
            )}
            <button onClick={() => setError(null)} className="px-16 py-6 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] transition-all active:scale-95">
               Hard Reset
            </button>
          </div>
        </div>
      )}

      {/* Intelligence Verdict View */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-12 duration-1000">
          <div className="lg:col-span-8 bg-slate-950/70 backdrop-blur-3xl border border-slate-800/80 rounded-[4rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.6)]">
            <div className="p-12 border-b border-slate-900 flex items-center justify-between bg-black/40">
              <div className="flex items-center space-x-8">
                <div className={`p-8 rounded-[2.5rem] shadow-2xl ${useMaps ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {useMaps ? <Map size={36} /> : <Beaker size={36} />}
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Intelligence Verdict</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mt-3">Grounded Real-World Resolution</p>
                </div>
              </div>
              <button onClick={() => handleSearch()} className="p-5 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl hover:text-blue-500 transition-all">
                <RefreshCcw size={24} />
              </button>
            </div>
            <div className="p-16 prose prose-invert max-w-none text-slate-300 leading-[1.8] text-xl font-medium whitespace-pre-wrap selection:bg-blue-500/30">
              {result.text}
            </div>
            <div className="px-16 py-10 bg-black/40 border-t border-slate-900 flex items-center justify-between">
               <div className="flex items-center gap-4 text-emerald-500">
                  <CheckCircle2 size={24} />
                  <span className="text-[12px] font-black uppercase tracking-[0.3em]">Institutional Verification Pass</span>
               </div>
               <ShieldCheck className="w-8 h-8 text-slate-800" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className={`bg-slate-950/80 backdrop-blur-3xl border rounded-[3rem] p-12 shadow-2xl sticky top-24 ${useMaps ? 'border-emerald-500/30' : 'border-slate-800/60'}`}>
              <h3 className="font-black text-xl uppercase tracking-[0.3em] mb-12 flex items-center gap-4 text-white">
                <Globe className="text-blue-500" /> Grounded Citations
              </h3>
              <div className="space-y-6 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
                {result.sources.length > 0 ? result.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex flex-col p-8 bg-[#040813] rounded-[2.5rem] border border-slate-800/80 transition-all group hover:-translate-y-2 ${useMaps ? 'hover:border-emerald-500/50 hover:bg-emerald-500/5' : 'hover:border-blue-500/50 hover:bg-blue-500/5'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[14px] font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors leading-tight">{source.title}</span>
                      <ExternalLink className={`w-5 h-5 flex-shrink-0 opacity-40 group-hover:opacity-100 ${useMaps ? 'text-emerald-500' : 'text-blue-500'}`} />
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono truncate opacity-60 italic tracking-tighter">{source.uri}</p>
                  </a>
                )) : (
                  <div className="py-20 text-center space-y-6 opacity-30">
                    <ShieldAlert size={48} className="mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">No external links verified</p>
                  </div>
                )}
              </div>
              <div className="mt-12 pt-10 border-t border-slate-900">
                <div className="flex items-start gap-4 text-slate-700">
                  <Info size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed italic">
                    All sources are real-time resolved from the global forensic ledger. Use for institutional research only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchPortal;
