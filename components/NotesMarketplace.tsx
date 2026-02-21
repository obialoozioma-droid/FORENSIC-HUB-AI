
import React, { useState, useRef, useEffect } from 'react';
import { Note, ForensicLevel } from '../types';
import { LECTURER_NOTES } from '../constants';
import NoteCard from './NoteCard';
import PaymentModal from './PaymentModal';
import { Upload, Search, BookOpen, Plus, X, Sparkles, CheckCircle2, ShieldAlert, FileUp, Loader2 } from 'lucide-react';

interface NotesMarketplaceProps {
  ownedNotes: string[];
  setOwnedNotes: React.Dispatch<React.SetStateAction<string[]>>;
  syncUserData: (updates: any) => Promise<void>;
  onSetReminder: (note: Note) => void;
}

const NotesMarketplace: React.FC<NotesMarketplaceProps> = ({ ownedNotes, setOwnedNotes, syncUserData, onSetReminder }) => {
  const [notes, setNotes] = useState<Note[]>(LECTURER_NOTES);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState<ForensicLevel | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [noteToPurchase, setNoteToPurchase] = useState<Note | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: '',
    lecturer: '',
    level: 100 as ForensicLevel,
    description: '',
    content: '',
    price: 0 as 0 | 1000,
    courseCode: '',
    externalUrl: ''
  });

  const handlePurchaseRequest = (note: Note) => {
    setNoteToPurchase(note);
  };

  const handlePaymentSuccess = async () => {
    if (noteToPurchase) {
      const updatedNotes = [...ownedNotes, noteToPurchase.id];
      setOwnedNotes(updatedNotes);
      await syncUserData({ owned_notes: updatedNotes });
      
      const note = noteToPurchase;
      setNoteToPurchase(null);
      
      // Auto-download after successful payment
      setTimeout(() => {
        handleDownload(note);
      }, 500);
    }
  };

  const handleDownload = (note: Note) => {
    if (note.externalUrl) {
      window.open(note.externalUrl, '_blank');
      return;
    }

    setIsProcessing(`dl-${note.id}`);
    
    const content = `
      ========================================================================
                      FORENSIC HUB AI - ACADEMIC REPOSITORY
      ========================================================================
      DOCUMENT ID: FH-MD-${note.id.toUpperCase()}
      TIMESTAMP: ${new Date().toLocaleString()}
      CLASSIFICATION: AUTHORIZED STUDENT MATERIAL
      
      TITLE: ${note.title.toUpperCase()}
      COURSE LEVEL: ${note.level}L
      FACULTY LECTURER: ${note.lecturer}
      
      ------------------------------------------------------------------------
      CURRICULUM SUMMARY:
      ${note.description}
      ------------------------------------------------------------------------
      
      FULL ACADEMIC COURSE CONTENT:
      
      ${note.content || "Digital content is being synchronized with the forensic core repository. This transcript serves as proof of authorization."}
      
      ------------------------------------------------------------------------
      
      [ FORENSIC NOTICE ]
      Proprietary academic curriculum material.
      Authorized for use by students in the Forensic Science program.
      
      DIGITAL DISTRIBUTION RIGHTS:
      FORENSICHUB ACADEMY © 2024
      
      ========================================================================
      END OF DOCUMENT TRANSMISSION
      ========================================================================
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, '_')}_FORENSIC_MASTER.txt`;
    document.body.appendChild(link);
    
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsProcessing(null);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !form.externalUrl) {
      alert("Please select a document file or provide an external link.");
      return;
    }

    const newNote: Note = {
      ...form,
      id: `note-${Date.now()}`,
      timestamp: Date.now(),
      isVerified: false
    };
    
    setIsProcessing('uploading');
    setTimeout(async () => {
      setNotes([newNote, ...notes]);
      
      // Add to owned notes
      const updatedOwned = [...ownedNotes, newNote.id];
      setOwnedNotes(updatedOwned);
      await syncUserData({ owned_notes: updatedOwned });

      setIsUploadOpen(false);
      setForm({ title: '', lecturer: '', level: 100, description: '', content: '', price: 0, courseCode: '', externalUrl: '' });
      setSelectedFile(null);
      setIsProcessing(null);
      alert("ACADEMIC_NODE: Material successfully published and added to your repository.");
    }, 1500);
  };

  const filteredNotes = notes.filter(n => {
    const matchesLevel = filterLevel === 'All' || n.level === filterLevel;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-in slide-in-from-right duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-slate-900/40 p-12 rounded-[3.5rem] border border-slate-800/60 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10"></div>
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 mb-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Faculty Archives</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">Institutional Repository</h1>
          <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">Secure access to premium forensic courseware and lecture materials.</p>
        </div>
        
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[2rem] font-black transition-all flex items-center space-x-3 shadow-2xl shadow-blue-900/40 active:scale-95 text-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Upload Material</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-900/20 p-6 rounded-[2.5rem] border border-slate-800/50 shadow-inner">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
          <input 
            type="text"
            placeholder="Search repository..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-16 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-700 text-white shadow-inner"
          />
        </div>
        <div className="flex items-center space-x-2 bg-slate-950/50 p-2 rounded-[1.8rem] border border-slate-800 shadow-lg">
          {(['All', 100, 200, 300, 400, 500] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl as any)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest active:scale-90 ${
                filterLevel === lvl 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {lvl === 'All' ? 'All' : `${lvl}L`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredNotes.length > 0 ? filteredNotes.map(note => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onPurchase={handlePurchaseRequest} 
            onDownload={handleDownload}
            onSetReminder={onSetReminder}
            isOwned={ownedNotes.includes(note.id)}
          />
        )) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-600 space-y-4">
            <ShieldAlert className="w-16 h-16 opacity-20" />
            <p className="font-black text-xs uppercase tracking-widest">No matching records found.</p>
          </div>
        )}
      </div>

      {noteToPurchase && (
        <PaymentModal 
          articleTitle={noteToPurchase.title}
          onClose={() => setNoteToPurchase(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl my-8">
            <div className="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-900/20 transition-transform">
                  <FileUp className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Upload Terminal</h2>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Authorized Academic Personnel Only</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploadOpen(false)} 
                className="p-4 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-full transition-all active:scale-90"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-10 space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Document Payload</label>
                <div 
                  onClick={handleUploadClick}
                  className={`relative cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-300 active:scale-[0.99] ${
                    selectedFile 
                    ? 'bg-emerald-500/5 border-emerald-500/50' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 shadow-inner'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                  
                  {selectedFile ? (
                    <div className="flex flex-col items-center space-y-4 animate-in zoom-in duration-300 text-center">
                      <div className="p-6 bg-emerald-500/20 rounded-full text-emerald-400 shadow-lg">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-white">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-5 text-center transition-transform group-hover:scale-105">
                      <div className="p-6 bg-blue-600/10 rounded-full text-blue-400 group-hover:bg-blue-600/20 shadow-inner">
                        <Upload className="w-12 h-12" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-black text-white">Select Academic File</p>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">Transmit forensic coursework for repository ingestion</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Module Title</label>
                  <input 
                    required
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-700 text-white shadow-inner"
                    placeholder="e.g. Advanced DNA Profiling II"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Course Code</label>
                  <input 
                    required
                    value={form.courseCode}
                    onChange={e => setForm({...form, courseCode: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-700 text-white shadow-inner"
                    placeholder="e.g. FSC 411"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Lecturer Name</label>
                <input 
                  required
                  value={form.lecturer}
                  onChange={e => setForm({...form, lecturer: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-700 text-white shadow-inner"
                  placeholder="Instructor name"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">External Link (Optional)</label>
                <input 
                  value={form.externalUrl}
                  onChange={e => setForm({...form, externalUrl: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-700 text-white shadow-inner"
                  placeholder="e.g. https://drive.google.com/file/..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Curriculum Level</label>
                  <select 
                    value={form.level}
                    onChange={e => setForm({...form, level: parseInt(e.target.value) as ForensicLevel})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-white shadow-inner cursor-pointer"
                  >
                    {[100, 200, 300, 400, 500].map(l => <option key={l} value={l}>{l}L</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!selectedFile || isProcessing === 'uploading'}
                className="group relative w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white py-6 rounded-[2rem] font-black transition-all shadow-2xl shadow-blue-900/40 active:scale-95 text-sm flex items-center justify-center space-x-3 overflow-hidden"
              >
                {isProcessing === 'uploading' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Authorize Publication</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesMarketplace;
