
import React, { useState } from 'react';
import { AppView, UserProfile } from '../types';
import { 
  Shield, 
  BookOpen, 
  Microscope, 
  Zap, 
  User, 
  Menu, 
  X, 
  GraduationCap, 
  Search, 
  Trophy, 
  TrendingUp, 
  Award,
  Info,
  FileText,
  ArrowLeft,
  Settings,
  Bell,
  ChevronRight,
  ExternalLink,
  Copyright,
  Scale,
  Activity,
  LogOut,
  Power
} from 'lucide-react';

interface LayoutProps {
  // Use React.ReactNode instead of React.Node
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  progress?: number;
  userProfile?: UserProfile | null;
  onSignOut: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, progress = 0, userProfile, onSignOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTierDetails, setShowTierDetails] = useState(false);

  const navItems = [
    { view: AppView.HOME, label: 'Dashboard', icon: Shield },
    { view: AppView.ACADEMY, label: 'Academy', icon: BookOpen },
    { view: AppView.NOTES, label: 'Course Notes', icon: FileText },
    { view: AppView.LAB, label: 'AI Bench', icon: Microscope },
    { view: AppView.RESEARCH, label: 'Research', icon: Search },
    { view: AppView.CASES, label: 'Case Files', icon: Zap },
    { view: AppView.PROFILE, label: 'Transcript', icon: GraduationCap },
  ];

  const AcademicTierCard = ({ isMobile = false }) => (
    <div className="relative group">
      <div 
        onClick={() => setShowTierDetails(!showTierDetails)}
        className={`cursor-pointer bg-gradient-to-br from-slate-900 via-[#0a0f1d] to-black rounded-[2.5rem] p-6 border transition-all duration-500 shadow-2xl relative overflow-hidden active:scale-[0.98] hover:shadow-blue-900/20 hover:border-blue-500/40 ${
          showTierDetails ? 'border-blue-500/60 ring-4 ring-blue-500/10' : 'border-slate-800'
        }`}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 transition-all duration-700 ${
          showTierDetails ? 'bg-blue-500/40 opacity-100' : 'bg-blue-600/10 opacity-50'
        }`}></div>
        
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <p className="text-[9px] text-slate-300 uppercase tracking-widest font-black">Standing</p>
            </div>
            <div className={`p-1.5 rounded-lg transition-colors ${showTierDetails ? 'bg-blue-500/20 text-blue-400' : 'text-slate-600 group-hover:text-blue-400'}`}>
               <Info className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-black block text-white group-hover:text-blue-200 transition-colors">{userProfile?.role || 'Student'}</span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                   {userProfile?.level || 100}L <span className="w-1 h-1 bg-slate-700 rounded-full"></span> Active
                </span>
              </div>
              <span className="relative text-[10px] bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 px-3 py-1.5 rounded-xl font-black border border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.2)] uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 transition-transform cursor-default">
                <Award className="w-3.5 h-3.5" />
                Pro
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tight text-slate-400">
                <span className="flex items-center gap-1">Progress</span>
                <span className="text-blue-400">{progress}%</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="relative group/access">
              <div className="absolute inset-0 bg-blue-600 blur-xl opacity-0 group-hover/access:opacity-20 transition-opacity rounded-2xl"></div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView(AppView.ACADEMY);
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
                className="relative w-full text-[10px] group/subbtn bg-white text-black hover:bg-blue-600 hover:text-white px-4 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-[0.92] flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 group-hover/subbtn:rotate-6 transition-transform" />
                Access Repository
                <ChevronRight className="w-3.5 h-3.5 group-hover/subbtn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTierDetails && (
        <div className={`absolute ${isMobile ? 'bottom-full mb-4' : 'bottom-full mb-6'} left-0 w-full animate-in slide-in-from-bottom-4 zoom-in-95 fade-in duration-400 z-50`}>
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-blue-500/30 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-[1.2rem] border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">GPA Ranking</p>
                  <p className="text-2xl font-black text-white leading-none">4.82</p>
                </div>
              </div>
              <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            </div>
            <button 
              onClick={() => {
                setActiveView(AppView.PROFILE);
                setShowTierDetails(false);
                if (isMobile) setIsMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 hover:bg-blue-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl group/prof"
            >
              <GraduationCap className="w-4 h-4 text-blue-400 group-hover/prof:text-white transition-colors" />
              Full Transcript Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080b14] text-slate-200 overflow-hidden font-sans">
      <aside className="hidden md:flex flex-col w-72 bg-slate-950 border-r border-slate-900/80 p-6 space-y-8 relative z-30">
        <div 
          className="flex items-center space-x-3 mb-4 group cursor-pointer active:scale-95 transition-transform" 
          onClick={() => setActiveView(AppView.HOME)}
        >
          <div className="bg-blue-600 p-2.5 rounded-[1.2rem] shadow-2xl shadow-blue-900/50 group-hover:rotate-12 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">FORENSIC<span className="text-blue-500 italic">HUB</span></span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.8rem] transition-all duration-300 group active:scale-95 ${
                activeView === item.view
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40 translate-x-2'
                  : 'hover:bg-slate-900/50 text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${activeView === item.view ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'}`} />
              <span className="font-black text-[10px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="space-y-4 pt-4 mt-auto">
           {/* SIGN OUT BUTTON: REFINED TO MATCH SCREENSHOT */}
           <div className="px-2">
             <button 
               onClick={onSignOut}
               className="group relative w-full flex items-center justify-center space-x-4 px-5 py-4 border-2 border-blue-500 bg-blue-500/5 text-blue-500 hover:text-white hover:bg-blue-500 transition-all duration-300 active:scale-95 overflow-hidden"
             >
               <div className="relative z-10 flex items-center space-x-3">
                 <LogOut className="w-4 h-4" />
                 <span className="font-black text-[10px] uppercase tracking-[0.2em] italic leading-none">Sign Out</span>
               </div>
             </button>
           </div>
           
           <AcademicTierCard />
        </div>

        <div className="pt-6 border-t border-slate-900/80 text-center space-y-3">
          <div className="flex items-center space-x-2 text-slate-700 opacity-50 justify-center">
            <Scale className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Institutional Core v1.2</span>
          </div>
          <div className="space-y-3 flex flex-col items-center">
            <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.15em] leading-relaxed">
              © 2024 FORENSICHUB AI<br/>
              OWNED BY OZIOMACHUKWU CHRISTIAN OBIALO.
            </p>
            <div className="border border-blue-500 px-4 py-2 mt-1">
              <p className="text-[8px] text-blue-500 font-black uppercase tracking-[0.3em] leading-relaxed italic">
                MANAGED BY THE TECHKEYZS
              </p>
            </div>
          </div>
        </div>
      </aside>

      <header className="md:hidden bg-slate-950/90 p-5 border-b border-slate-900 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center space-x-3 cursor-pointer active:scale-95 transition-transform" onClick={() => setActiveView(AppView.HOME)}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
             <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight uppercase text-white">ForensicHub</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onSignOut} className="p-3 bg-slate-900 rounded-2xl border border-blue-500/30 text-blue-400 active:scale-90 hover:text-white hover:bg-blue-600 transition-all shadow-xl">
            <LogOut size={18} />
          </button>
          <button className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 active:scale-90 hover:text-blue-400 transition-colors">
            <Bell size={18} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl active:scale-90 text-white flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/95 pt-28 p-8 space-y-4 animate-in fade-in slide-in-from-top duration-500 backdrop-blur-3xl overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setActiveView(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-5 p-6 rounded-[2.5rem] transition-all active:scale-[0.98] ${
                activeView === item.view 
                ? 'bg-blue-600 text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)] border-transparent' 
                : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          
          <button 
             onClick={() => {
               setIsMobileMenuOpen(false);
               onSignOut();
             }}
             className="w-full flex items-center space-x-5 p-6 rounded-[2.5rem] bg-slate-900/60 text-blue-400 border border-blue-500/40 active:scale-95 transition-all shadow-xl hover:bg-blue-600 hover:text-white"
           >
             <LogOut className="w-6 h-6" />
             <span className="text-lg font-black uppercase tracking-widest italic">Sign out</span>
           </button>

          <div className="pt-10 border-t border-slate-800/50 mt-10">
             <div className="mb-10">
                <AcademicTierCard isMobile={true} />
             </div>
             
             <div className="text-center space-y-4 pb-10 flex flex-col items-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">ForensicHub AI</p>
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-600 font-medium leading-relaxed">
                    © 2024. OWNED BY OZIOMACHUKWU CHRISTIAN OBIALO.
                  </p>
                  <div className="border border-blue-500 px-4 py-2 mt-2">
                    <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] italic">
                      MANAGED BY THE TECHKEYZS
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-[#080b14] relative p-4 md:p-14 lg:p-20 scroll-smooth">
        <div className="max-w-7xl mx-auto h-full relative z-10">
          {activeView !== AppView.HOME && (
            <button 
              onClick={() => setActiveView(AppView.HOME)}
              className="mb-10 flex items-center space-x-3 text-slate-500 hover:text-blue-400 transition-all group w-fit animate-in slide-in-from-left duration-500 active:scale-95"
            >
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all shadow-xl">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] group-hover:translate-x-1 transition-transform">Return to Hub</span>
            </button>
          )}

          <div className="min-h-[70vh]">
            {children}
          </div>

          <footer className="mt-32 pt-16 border-t border-slate-900 flex flex-col items-center space-y-6 pb-20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            
            <div className="flex items-center space-x-6 text-slate-700">
               <div className="flex items-center space-x-2">
                 <Shield className="w-4 h-4 text-blue-900" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em]">Forensic Integrity</span>
               </div>
               <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
               <div className="flex items-center space-x-2">
                 <Scale className="w-4 h-4 text-emerald-900" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em]">Authorized Portal</span>
               </div>
            </div>

            <div className="text-center space-y-6 flex flex-col items-center">
               <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-lg">
                 Authorized learning terminal for forensic science curriculum. System architecture and intellectual property strictly governed by academic licensing protocols.
               </p>
               <div className="space-y-4 flex flex-col items-center">
                 <p className="text-[11px] text-white font-black uppercase tracking-widest">
                   © 2024 FORENSICHUB AI. OWNED BY OZIOMACHUKWU CHRISTIAN OBIALO.
                 </p>
                 <div className="border border-blue-500 px-8 py-3">
                   <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em] italic leading-none">
                     MANAGED BY THE TECHKEYZS
                   </p>
                 </div>
               </div>
            </div>

            <div className="pt-8 flex items-center space-x-4">
              <div className="h-px w-12 bg-slate-900"></div>
              <Copyright className="w-5 h-5 text-slate-800" />
              <div className="h-px w-12 bg-slate-900"></div>
            </div>
          </footer>
        </div>
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none -z-10"></div>
      </main>
    </div>
  );
};

export default Layout;
