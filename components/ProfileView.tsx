
import React, { useState, useRef } from 'react';
import { ForensicLevel, Article, UserProfile } from '../types';
import { ARTICLES, LECTURER_NOTES } from '../constants';
import { 
  GraduationCap, Award, BookOpen, ShieldCheck, TrendingUp, Target, CheckCircle2, 
  Flame, Fingerprint, QrCode, ShieldAlert, Building, UserCog, FileOutput, 
  Users, Search, Check, X, FileText, PlusCircle, Loader2, FileUp, Database, 
  UploadCloud, HardDrive, Bookmark, Zap
} from 'lucide-react';

interface ProfileViewProps {
  completedArticles: string[];
  unlockedArticles: string[];
  ownedNotes: string[];
  userProfile: UserProfile | null;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  module: string;
  level: number;
  grade: string;
  semester: number;
  status: 'Published' | 'Pending';
}

const ProfileView: React.FC<ProfileViewProps> = ({ completedArticles, unlockedArticles, ownedNotes, userProfile }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resultForm, setResultForm] = useState<Omit<StudentResult, 'status'>>({
    studentId: '', studentName: '', module: ARTICLES[0].title, level: 100, grade: 'A', semester: 1
  });

  const [recentUploads, setRecentUploads] = useState<StudentResult[]>([]);

  const gpa = 4.82;
  const progressPercent = ARTICLES.length > 0 ? Math.round((completedArticles.length / ARTICLES.length) * 100) : 0;

  const stats = [
    { label: 'Analytical GPS', value: gpa.toFixed(2), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Mastery Credits', value: (completedArticles.length * 2.5).toFixed(1), icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Certifications', value: `${completedArticles.length}/${ARTICLES.length}`, icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Academy Rank', value: 'Elite', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setRecentUploads([{ ...resultForm, status: 'Published' }, ...recentUploads]);
      setIsUploading(false);
      setResultForm({ ...resultForm, studentId: '', studentName: '' });
      alert("OFFICIAL_NOTICE: Result Published.");
    }, 1000);
  };

  const isFaculty = userProfile?.role === 'Faculty' || userProfile?.role === 'Expert';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
      {isFaculty && (
        <div className="flex justify-center md:justify-end mb-4">
          <button onClick={() => setIsAdminMode(!isAdminMode)} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border shadow-2xl ${isAdminMode ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>
            {isAdminMode ? <FileOutput className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
            {isAdminMode ? 'Personal Profile' : 'Faculty Terminal'}
          </button>
        </div>
      )}

      {isAdminMode && isFaculty ? (
        <div className="bg-slate-950/40 p-12 rounded-[3.5rem] border border-emerald-500/20 shadow-2xl space-y-12">
           <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Faculty Result Ledger</h2>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <form onSubmit={handleManualUpload} className="space-y-6">
               <input required placeholder="Student ID" className="w-full bg-black/40 border border-slate-800 rounded-xl py-4 px-5 text-white" value={resultForm.studentId} onChange={e => setResultForm({...resultForm, studentId: e.target.value})} />
               <input required placeholder="Student Name" className="w-full bg-black/40 border border-slate-800 rounded-xl py-4 px-5 text-white" value={resultForm.studentName} onChange={e => setResultForm({...resultForm, studentName: e.target.value})} />
               <button type="submit" className="w-full bg-emerald-600 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] text-white">Authorize Entry</button>
             </form>
             <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Transmission Log</h3>
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                 {recentUploads.map((res, i) => (
                   <div key={i} className="p-4 bg-black/40 border border-slate-800 rounded-xl flex justify-between items-center">
                     <div><p className="text-[11px] font-black text-white">{res.studentName}</p><p className="text-[9px] text-slate-600">{res.studentId}</p></div>
                     <span className="text-emerald-400 font-black">{res.grade}</span>
                   </div>
                 ))}
               </div>
             </div>
           </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-slate-900/40 p-10 md:p-14 rounded-[3.5rem] border border-slate-800/60 shadow-2xl flex flex-col md:flex-row items-center gap-12">
              <div className="relative"><div className="w-40 h-40 md:w-56 md:h-56 rounded-[4rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl"><GraduationCap className="w-20 h-20 md:w-28 md:h-28 text-white" /></div></div>
              <div className="text-center md:text-left space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-none">{userProfile?.name || 'Student Investigator'}</h1>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-[10px] font-bold text-blue-400 uppercase tracking-widest">{userProfile?.department}</span>
                  <span className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Level {userProfile?.level} Specialist</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6">
               <div className="p-6 bg-white rounded-3xl shadow-2xl"><QrCode className="w-24 h-24 text-slate-900" /></div>
               <p className="text-[10px] text-slate-500 font-mono italic">Verified Digital Transcript ID</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-900/30 border border-slate-800 p-8 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit`}><stat.icon size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p><p className="text-3xl font-black text-white">{stat.value}</p></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                   <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter"><Bookmark className="text-blue-500" /> Academic Portfolio</h3>
                </div>
                <div className="p-8 space-y-8">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastered Curriculum Modules</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ARTICLES.filter(a => completedArticles.includes(a.id)).map(a => (
                          <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                             <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                             <span className="text-[11px] font-bold text-slate-200 uppercase">{a.title}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Owned External Resources</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {LECTURER_NOTES.filter(n => ownedNotes.includes(n.id)).map(n => (
                          <div key={n.id} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-amber-500/30 transition-all">
                             <FileText className="w-5 h-5 text-amber-500" />
                             <span className="text-[11px] font-bold text-slate-200 uppercase">{n.title}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-10 space-y-6 text-center">
                  <Flame className="w-12 h-12 text-orange-500 mx-auto" />
                  <p className="text-3xl font-black text-white italic tracking-tighter">{progressPercent}% Mastery</p>
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-1"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPercent}%` }}></div></div>
               </div>
               <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-8 text-center"><ShieldCheck className="w-10 h-10 text-slate-800 mx-auto mb-4" /><p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.4em]">OFFICIAL ACADEMIC RECORD<br/>VERIFIED BY CORE AI SYSTEM</p></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileView;
