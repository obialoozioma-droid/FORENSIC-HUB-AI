
import React, { useState } from 'react';
import { Case } from '../types';
import { ArrowLeft, MapPin, Calendar, FileText, ClipboardList, ShieldAlert, Zap, Search, Download, Share2, Volume2, Loader2 } from 'lucide-react';
import { generateForensicSpeech } from '../services/geminiService';

interface CaseViewProps {
  caseData: Case;
  onBack: () => void;
  onInvestigate: (caseData: Case) => void;
}

const CaseView: React.FC<CaseViewProps> = ({ caseData, onBack, onInvestigate }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleBriefing = async () => {
    setIsSynthesizing(true);
    const speechText = `Case ID: ${caseData.id}. Title: ${caseData.title}. Location: ${caseData.location}. Report Date: ${caseData.date}. ${caseData.content || caseData.summary}`;
    await generateForensicSpeech(speechText);
    setIsSynthesizing(false);
  };

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-black text-white mt-8 mb-4 border-b border-slate-800 pb-2 uppercase tracking-tighter">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-black text-blue-500 mt-6 mb-2 uppercase tracking-tight">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={i} className="text-sm font-black text-slate-300 mt-4 mb-2 uppercase italic">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-1 text-slate-400 font-mono text-sm">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mb-4 text-slate-300 font-mono text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 pb-32">
      <div className="max-w-5xl mx-auto space-y-10">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-400 transition-all group active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Return to Archives</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Dossier Content */}
          <div className="lg:col-span-8 bg-[#0a0f1d] border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
              <ClipboardList className="w-64 h-64 text-white" />
            </div>
            
            <div className="p-10 md:p-14 space-y-8 relative z-10">
              <div className="flex flex-wrap items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  caseData.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  caseData.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {caseData.difficulty} LEVEL
                </span>
                <span className="text-slate-600 font-mono text-[10px] font-black tracking-widest uppercase">{caseData.id}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                {caseData.title}
              </h1>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-800/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Location</p>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold">{caseData.location}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Report Filed</p>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold">{caseData.date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {caseData.content ? renderContent(caseData.content) : (
                  <p className="text-slate-400 font-mono leading-relaxed">{caseData.summary}</p>
                )}
              </div>
            </div>
          </div>

          {/* Evidence Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-500" /> Evidence Repository
               </h3>
               <div className="space-y-3">
                 {caseData.evidence.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                     <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                       <FileText size={18} />
                     </div>
                     <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{item}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div 
              onClick={() => onInvestigate(caseData)}
              className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] space-y-6 cursor-pointer hover:bg-blue-600/10 hover:border-blue-500/40 transition-all group/bench"
            >
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 group-hover/bench:animate-pulse" /> Lab Protocol
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                This case file is linked to the Virtual Lab. Opening the investigation will transmit all case parameters to the AI Bench for thorough analysis.
              </p>
              <button 
                className="w-full bg-blue-600 group-hover/bench:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <Search size={18} />
                Open Bench
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleBriefing}
                disabled={isSynthesizing}
                className="flex-1 p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-blue-400 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isSynthesizing ? <Loader2 className="animate-spin" size={20} /> : <Volume2 size={20} />}
                <span className="text-[9px] font-black uppercase tracking-widest">Audio Brief</span>
              </button>
              <button className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-blue-400 transition-all active:scale-95">
                <Download size={20} />
              </button>
              <button className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-blue-400 transition-all active:scale-95">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseView;
