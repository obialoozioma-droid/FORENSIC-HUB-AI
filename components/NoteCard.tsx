
import React from 'react';
import { Note } from '../types';
import { FileText, User, Download, Lock, Banknote, ShieldCheck, Bell, ExternalLink } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onPurchase: (note: Note) => void;
  onDownload: (note: Note) => void;
  onSetReminder: (note: Note) => void;
  isOwned: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onPurchase, onDownload, onSetReminder, isOwned }) => {
  return (
    <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/60 p-8 hover:border-blue-500/50 transition-all group relative flex flex-col h-full shadow-xl backdrop-blur-sm overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10 rounded-full"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="bg-blue-600/20 p-4 rounded-[1.5rem] text-blue-400 group-hover:scale-110 transition-transform">
          <FileText className="w-8 h-8" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{note.level}L LEVEL</span>
          <div className={`mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${note.price === 0 || isOwned ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
            {isOwned ? 'OWNED' : note.price === 0 ? 'FREE' : `₦${note.price.toLocaleString()}`}
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-black mb-2 text-white group-hover:text-blue-400 transition-colors leading-tight">
        {note.title}
      </h3>
      
      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
        <User className="w-3.5 h-3.5 text-blue-500" />
        <span>Lecturer: {note.lecturer}</span>
      </div>

      <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-3 flex-1 font-medium">
        {note.description}
      </p>

      <div className="pt-6 border-t border-slate-800/50 mt-auto flex flex-col gap-3">
        {(note.price === 0 || isOwned) ? (
          <div className="flex gap-2">
            <button 
              onClick={() => onDownload(note)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95 uppercase tracking-widest text-xs"
            >
              {note.externalUrl ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{note.externalUrl ? 'Open Link' : 'Download PDF'}</span>
            </button>
            <button 
              onClick={() => onSetReminder(note)}
              className="p-4 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-2xl border border-slate-700 transition-all"
              title="Set Study Reminder"
            >
              <Bell size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onPurchase(note)}
            className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-3 border border-slate-700 hover:border-amber-400 shadow-xl active:scale-95 uppercase tracking-widest text-xs group/btn"
          >
            <Banknote className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            <span>Purchase Access</span>
          </button>
        )}
      </div>
      
      {isOwned && (
        <div className="absolute top-2 left-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500 drop-shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default NoteCard;
