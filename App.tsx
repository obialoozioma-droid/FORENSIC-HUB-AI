
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout.tsx';
import { AppView, Article, ForensicLevel, Case, UserProfile, UserRole, StudyReminder, Note } from './types.ts';
import { ARTICLES, CASES } from './constants.ts';
import { getGeminiChatStream, generateAnatomySpecimen, checkApiKey, generateArticleSummary } from './services/geminiService.ts';
import { supabase } from './supabase.ts';
import ArticleCard from './components/ArticleCard.tsx';
import ArticleView from './components/ArticleView.tsx';
import CaseView from './components/CaseView.tsx';
import LabTerminal from './components/LabTerminal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ResearchPortal from './components/ResearchPortal.tsx';
import NotesMarketplace from './components/NotesMarketplace.tsx';
import ProfileView from './components/ProfileView.tsx';
import ReminderModal from './components/ReminderModal.tsx';
import { 
  ChevronRight, 
  GraduationCap,
  Microscope,
  Database,
  Activity,
  Loader2,
  FileText,
  Search,
  Lock,
  UserCheck,
  Building,
  Fingerprint,
  Mail,
  User as UserIcon,
  Shield,
  UserPlus,
  ArrowRight,
  Key,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldAlert,
  Zap,
  Cpu,
  Terminal as TerminalIcon,
  MailCheck,
  RefreshCw,
  SendHorizontal,
  Bell
} from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [readingCase, setReadingCase] = useState<Case | null>(null);
  const [showPayment, setShowPayment] = useState<Article | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ForensicLevel | 'All'>('All');
  
  // Auth Flow States
  const [authStep, setAuthStep] = useState<'register' | 'login' | 'authenticated' | 'awaiting_verification'>('login');
  const [regPhase, setRegPhase] = useState<'select' | 'form'>('select');
  const [registrationRole, setRegistrationRole] = useState<UserRole | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isBypassing, setIsBypassing] = useState(false);
  
  // Credential States
  const [registrationName, setRegistrationName] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // User Data States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unlockedArticles, setUnlockedArticles] = useState<string[]>([]);
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);
  const [ownedNotes, setOwnedNotes] = useState<string[]>([]);
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  
  // Reminder Modal State
  const [reminderTarget, setReminderTarget] = useState<{ id: string, title: string, type: 'article' | 'note' } | null>(null);
  
  // System Status States
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSystemOnline, setIsSystemOnline] = useState(false);
  const [activeCaseContext, setActiveCaseContext] = useState<Case | null>(null);
  const summarizingRef = useRef<Set<string>>(new Set());

  // Initialize System and Session
  useEffect(() => {
    const init = async () => {
      const timer = setTimeout(() => {
        setIsSystemOnline(true);
        console.log("CORE_SYSTEM_STABLE: Permanent neural link established.");
      }, 1200);
      
      // Load local reminders
      const savedReminders = localStorage.getItem('study_reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (session.user.email_confirmed_at) {
          handleAuthTransition(session.user.id);
        } else {
          setRegistrationEmail(session.user.email || '');
          setAuthStep('awaiting_verification');
        }
      }

      // Check for due reminders every minute
      const reminderInterval = setInterval(() => {
        const now = new Date();
        const currentReminders = JSON.parse(localStorage.getItem('study_reminders') || '[]');
        
        currentReminders.forEach((rem: StudyReminder) => {
          if (!rem.isCompleted) {
            const remTime = new Date(rem.reminderTime);
            // If reminder is due (within the last minute)
            if (remTime <= now && now.getTime() - remTime.getTime() < 60000) {
              // Trigger System Notification
              if (Notification.permission === 'granted') {
                new Notification(`ForensicHub: Study Reminder`, {
                  body: `Time to study: ${rem.targetTitle}`,
                  icon: '/favicon.ico'
                });
              } else {
                alert(`STUDY_REMINDER: Time to review "${rem.targetTitle}"`);
              }

              // Mark as completed
              const updated = currentReminders.map((r: StudyReminder) => 
                r.id === rem.id ? { ...r, isCompleted: true } : r
              );
              setReminders(updated);
              localStorage.setItem('study_reminders', JSON.stringify(updated));
            }
          }
        });
      }, 60000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(reminderInterval);
      };
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        if (session.user.email_confirmed_at) {
          handleAuthTransition(session.user.id);
        } else {
          setRegistrationEmail(session.user.email || '');
          setAuthStep('awaiting_verification');
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthStep('login');
        setUserProfile(null);
        setRegPhase('select');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Reminder Check Loop
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const triggeredReminders: string[] = [];

      reminders.forEach(reminder => {
        if (!reminder.isCompleted) {
          const reminderTime = new Date(reminder.reminderTime);
          if (now >= reminderTime) {
            // Trigger notification
            if (Notification.permission === 'granted') {
              new Notification(`Study Reminder: ${reminder.targetTitle}`, {
                body: `It's time for your scheduled ${reminder.targetType} study session.`,
                icon: '/favicon.ico'
              });
            } else {
              alert(`STUDY_ALERT: Time to study "${reminder.targetTitle}"!`);
            }
            triggeredReminders.push(reminder.id);
          }
        }
      });

      if (triggeredReminders.length > 0) {
        const updatedReminders = reminders.map(r => 
          triggeredReminders.includes(r.id) ? { ...r, isCompleted: true } : r
        );
        setReminders(updatedReminders);
        localStorage.setItem('study_reminders', JSON.stringify(updatedReminders));
      }
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [reminders]);

  // AI Summary Generation Loop
  useEffect(() => {
    const generateSummaries = async () => {
      if (activeView !== AppView.ACADEMY) return;
      
      const articlesToSummarize = articles.filter(a => !a.aiSummary && !summarizingRef.current.has(a.id));
      if (articlesToSummarize.length === 0) return;

      for (const article of articlesToSummarize) {
        summarizingRef.current.add(article.id);
        setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isSummarizing: true } : a));
        
        const summary = await generateArticleSummary(article.title, article.description, article.content);
        
        setArticles(prev => prev.map(a => a.id === article.id ? { ...a, aiSummary: summary, isSummarizing: false } : a));
      }
    };

    generateSummaries();
  }, [activeView, articles]);

  const handleAuthTransition = (userId: string) => {
    setAuthStep('authenticated');
    setActiveView(AppView.HOME);
    fetchUserData(userId);
  };

  const handleResendVerification = async () => {
    if (isSyncing || !registrationEmail) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registrationEmail,
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          alert("PROTOCOL_ALERT: Email service rate limited. Please try again in 60 seconds or check your existing inbox.");
        } else {
          alert(`SMTP_ERROR: ${error.message}`);
        }
      } else {
        alert("TRANSMISSION_SUCCESS: A new authorization link has been dispatched to your institutional inbox.");
      }
    } catch (err: any) {
      alert(`SYSTEM_FAILURE: ${err.message || 'Unknown SMTP error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleForceRefreshSession = async () => {
    setIsSyncing(true);
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (session?.user?.email_confirmed_at) {
      handleAuthTransition(session.user.id);
    } else {
      // Small delay to prevent spamming
      setTimeout(() => {
        setIsSyncing(false);
        if (!session?.user?.email_confirmed_at) {
          alert("VERIFICATION_FAILED: Identity still unconfirmed. Please use the link sent to your email.");
        }
      }, 1000);
    }
  };

  const handleGuestBypass = () => {
    setIsBypassing(true);
    setIsSyncing(true);
    
    setTimeout(() => {
      const guestId = `GUEST_SEC_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const guestProfile: UserProfile = {
        id: guestId,
        name: registrationName || 'Investigator Alpha',
        email: registrationEmail || 'bypass@forensichub.ai',
        role: 'Expert',
        level: 500,
        department: 'Forensic Intelligence',
        institution: 'ForensicHub Global',
        certifications: ['AI_CERTIFIED', 'PROTOCOL_OVERRIDE'],
        unlocked_articles: ARTICLES.map(a => a.id),
      };
      
      setUserProfile(guestProfile);
      setUnlockedArticles(guestProfile.unlocked_articles || []);
      setAuthStep('authenticated');
      setIsSyncing(false);
      setIsBypassing(false);
    }, 2000);
  };

  const fetchUserData = async (userId: string) => {
    if (isSyncing || userId.startsWith('GUEST_')) return;
    setIsSyncing(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        setUserProfile(profile as UserProfile);
        setUnlockedArticles(profile.unlocked_articles || []);
        setCompletedArticles(profile.completed_articles || []);
        setOwnedNotes(profile.owned_notes || []);
      } else {
        setUserProfile({
          id: userId,
          name: registrationName || 'Investigator',
          email: registrationEmail || '',
          role: registrationRole || 'Student',
          level: 100,
          department: 'Forensic Science',
          institution: 'ForensicHub Academy',
          certifications: []
        });
      }
    } catch (err) {
      console.error("Profile Synchronization Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncUserData = async (updates: Partial<UserProfile>) => {
    if (userProfile?.id.startsWith('GUEST_')) {
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates, updated_at: new Date() });
    } catch (err) {
      console.error("Data Backup Error:", err);
    }
  };

  const handleRegisterRoleClick = (role: UserRole) => {
    setRegistrationRole(role);
    setRegPhase('form');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setIsRateLimited(false);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registrationEmail,
        password: password,
        options: {
          data: { full_name: registrationName, role: registrationRole || 'Student' }
        }
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          setIsRateLimited(true);
        } else {
          alert(`REGISTRY_ERROR: ${error.message}`);
        }
        setIsSyncing(false);
        return;
      }

      if (data.user) {
        const role = registrationRole || 'Student';
        const newProfile = {
          id: data.user.id,
          name: registrationName,
          email: registrationEmail,
          role: role,
          level: 100 as ForensicLevel,
          department: 'Forensic Science',
          institution: 'ForensicHub Academy',
          certifications: []
        };
        await supabase.from('profiles').upsert([newProfile]);
        setAuthStep('awaiting_verification');
      }
    } catch (err: any) {
      alert(`SYSTEM_FAILURE: ${err.message || 'Unknown Registry Error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: registrationEmail,
        password: password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setAuthStep('awaiting_verification');
        } else {
          alert(`AUTH_ERROR: ${error.message}`);
        }
        setIsSyncing(false);
        return;
      }
      
      if (data.session) {
        if (data.session.user.email_confirmed_at) {
          handleAuthTransition(data.session.user.id);
        } else {
          setAuthStep('awaiting_verification');
        }
      }
    } catch (err: any) {
      console.error("Critical Auth Error:", err);
      alert(`SYSTEM_ERROR: ${err.message || 'Unknown failure'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleArticleRead = (id: string) => {
    const article = ARTICLES.find(a => a.id === id);
    if (article) {
      setReadingArticle(article);
      window.scrollTo(0, 0);
    }
  };

  const handleArticlePay = (article: Article) => {
    setShowPayment(article);
  };

  const handlePaymentSuccess = async () => {
    if (showPayment) {
      const updated = [...unlockedArticles, showPayment.id];
      setUnlockedArticles(updated);
      await syncUserData({ unlocked_articles: updated as any });
      setShowPayment(null);
    }
  };

  const handleCompleteArticle = async (id: string) => {
    if (!completedArticles.includes(id)) {
      const updated = [...completedArticles, id];
      setCompletedArticles(updated);
      await syncUserData({ completed_articles: updated as any });
    }
  };

  const handleInvestigate = (caseData: Case) => {
    setActiveCaseContext(caseData);
    setActiveView(AppView.LAB);
    setReadingCase(null);
  };

  const handleSetReminder = (target: { id: string, title: string, type: 'article' | 'note' }) => {
    setReminderTarget(target);
  };

  const onAddReminder = (time: string) => {
    if (!reminderTarget) return;

    const newReminder: StudyReminder = {
      id: `rem-${Date.now()}`,
      targetId: reminderTarget.id,
      targetTitle: reminderTarget.title,
      targetType: reminderTarget.type,
      reminderTime: time,
      isCompleted: false
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem('study_reminders', JSON.stringify(updatedReminders));
    setReminderTarget(null);
    
    alert(`REMINDER_SET: Data scheduled for ${new Date(time).toLocaleString()}`);
  };

  const progressPercent = ARTICLES.length > 0 
    ? Math.round((completedArticles.length / ARTICLES.length) * 100) 
    : 0;

  if (isBypassing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 space-y-10 font-mono">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-12 h-12 text-emerald-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-emerald-500 text-2xl font-black uppercase tracking-widest italic animate-pulse">Initializing Bypass Protocol</h2>
          <div className="space-y-1 opacity-50 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
            <p>Injecting security tokens...</p>
            <p>Mounting encrypted filesystem...</p>
            <p>Authorizing Guest session...</p>
            <p>Registry override success.</p>
          </div>
        </div>
      </div>
    );
  }

  if (authStep === 'awaiting_verification') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="relative z-10 w-full max-w-xl bg-[#0a0f1d]/80 border border-blue-500/30 p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl text-center space-y-10 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(37,99,235,0.4)]">
            <MailCheck className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Verification Required</h1>
            <p className="text-slate-400 font-medium leading-relaxed px-4">
              We have dispatched an authorization link to <span className="text-blue-400 font-bold">{registrationEmail}</span>. Access is restricted until identity is confirmed.
            </p>
          </div>
          
          <div className="bg-black/40 border border-slate-800 p-8 rounded-3xl text-left font-mono space-y-4">
            <p className="text-[10px] text-blue-500 font-black tracking-widest uppercase mb-1">Status Report:</p>
            <div className="space-y-2 opacity-80">
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Identity Status: UNVERIFIED
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Signal: Awaiting Confirmation...
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-2 leading-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Note: Check Spam/Institutional folders.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleForceRefreshSession} 
              disabled={isSyncing}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Check Confirmation Status
            </button>
            
            <button 
              onClick={handleResendVerification} 
              disabled={isSyncing}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 py-6 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:border-blue-500/50 active:scale-95 disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
              Resend Authorization Link
            </button>

            <button 
              onClick={() => { setAuthStep('login'); handleSignOut(); }} 
              className="text-[10px] font-black uppercase text-slate-500 hover:text-white tracking-[0.3em] transition-colors py-2"
            >
              Back to Terminal
            </button>

            <div className="pt-6 border-t border-slate-800/50">
               <button 
                onClick={handleGuestBypass} 
                className="group flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-8 py-4 rounded-3xl text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 w-full"
              >
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Emergency Guest Bypass</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authStep !== 'authenticated') {
    if (authStep === 'register') {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          
          <div className="w-full max-w-2xl bg-[#0a0f1d]/80 border border-slate-800/40 p-8 md:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative z-10 space-y-12 animate-in fade-in zoom-in duration-700">
            {regPhase === 'select' ? (
              <div className="space-y-10">
                <div className="text-center space-y-6">
                  <div className="bg-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-900/40 border-4 border-white/5">
                    <UserPlus className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Forensic Hub Registry</h1>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Forensic Registry v.2.1</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { role: 'Student', icon: GraduationCap, color: 'blue' },
                    { role: 'Faculty', icon: Building, color: 'indigo' },
                    { role: 'Expert', icon: Fingerprint, color: 'purple' }
                  ].map((item) => (
                    <button key={item.role} onClick={() => handleRegisterRoleClick(item.role as UserRole)} className="group flex flex-col items-center text-center p-8 bg-slate-950/40 border border-slate-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl active:scale-[0.98]">
                      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all mb-4">
                        <item.icon className="w-10 h-10" />
                      </div>
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">{item.role}</h3>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-4">
                  <button onClick={() => setAuthStep('login')} className="text-[10px] font-black uppercase text-blue-500 hover:text-white tracking-[0.3em] transition-colors">Log in to terminal</button>
                  <button 
                    onClick={handleGuestBypass} 
                    className="group flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-8 py-4 rounded-3xl text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-xl"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Fast Guest Bypass</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-12 animate-in slide-in-from-right duration-500">
                <button type="button" onClick={() => setRegPhase('select')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.2em] group">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK
                </button>
                
                <div className="text-center space-y-6">
                  <div className="bg-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(37,99,235,0.3)] border-4 border-white/10">
                    {registrationRole === 'Student' ? <GraduationCap className="w-12 h-12 text-white" /> : registrationRole === 'Faculty' ? <Building className="w-12 h-12 text-white" /> : <Fingerprint className="w-12 h-12 text-white" />}
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{registrationRole} ACCESS ENTRY</h2>
                </div>

                <div className="space-y-4">
                  {isRateLimited && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl flex flex-col gap-4 text-emerald-400 animate-in zoom-in duration-300">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 shrink-0" />
                        <div className="text-[10px] font-black uppercase tracking-widest leading-tight">
                          INFRASTRUCTURE ALERT: Email Rate Limit Hit. 
                        </div>
                      </div>
                      <p className="text-[9px] font-medium leading-relaxed opacity-80">Supabase is currently throttling verification emails. You can bypass this limit immediately using Guest Investigator mode.</p>
                      <button type="button" onClick={handleGuestBypass} className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Cpu size={14} /> AUTHORIZE GUEST OVERRIDE
                      </button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-slate-800/50 rounded-lg text-slate-500 group-focus-within:text-blue-500 transition-all">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input required type="text" placeholder="Name" value={registrationName} onChange={(e) => setRegistrationName(e.target.value)} className="w-full bg-[#040813] border border-slate-800/60 rounded-2xl py-6 pl-16 pr-6 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-700" />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-slate-800/50 rounded-lg text-slate-500 group-focus-within:text-blue-500 transition-all">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input required type="email" placeholder="Institutional Email" value={registrationEmail} onChange={(e) => setRegistrationEmail(e.target.value)} className="w-full bg-[#040813] border border-slate-800/60 rounded-2xl py-6 pl-16 pr-6 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-slate-800/50 rounded-lg text-slate-500 group-focus-within:text-blue-500 transition-all">
                        <Key className="w-4 h-4" />
                      </div>
                      <input required type={showPassword ? "text" : "password"} placeholder="Secret Phrase" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#040813] border border-slate-800/60 rounded-2xl py-6 pl-16 pr-14 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-700" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-slate-800/50 rounded-lg text-slate-500 group-focus-within:text-blue-500 transition-all">
                        <Shield className="w-4 h-4" />
                      </div>
                      <input required type={showPassword ? "text" : "password"} placeholder="Confirm Phrase" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#040813] border border-slate-800/60 rounded-2xl py-6 pl-16 pr-14 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-700" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    type="submit" 
                    disabled={isSyncing} 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-7 rounded-full font-black transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[12px] border border-white/5"
                  >
                    {isSyncing ? <Loader2 className="animate-spin" /> : <span>OPEN HUB PORTAL</span>}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={handleGuestBypass} className="w-full py-4 border border-slate-800 hover:bg-slate-900 text-slate-500 hover:text-white rounded-3xl font-black text-[9px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2">
                    <TerminalIcon size={14} /> Protocol Override: Guest Entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    }

    if (authStep === 'login') {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
          <div className="relative z-10 w-full max-w-lg">
            <div className="border-[3px] border-blue-500 p-12 bg-black/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              <div className="flex flex-col items-center space-y-10">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                    SECURE <span className="text-blue-500 italic">TERMINAL</span>
                  </h1>
                  <p className="text-slate-500 font-bold text-[10px] tracking-[0.6em] uppercase">Authorization Verification</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-800/80 rounded-lg text-slate-500"><Mail className="w-4 h-4" /></div>
                    <input required type="email" placeholder="Institutional Email" value={registrationEmail} onChange={(e) => setRegistrationEmail(e.target.value)} className="w-full bg-black/80 border border-slate-800 rounded-xl py-5 pl-16 pr-6 text-white font-bold text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700" />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-800/80 rounded-lg text-slate-500"><Key className="w-4 h-4" /></div>
                    <input required type={showPassword ? "text" : "password"} placeholder="Secret Phrase" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/80 border border-slate-800 rounded-xl py-5 pl-16 pr-14 text-white font-bold text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  <button type="submit" disabled={isSyncing} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-3xl font-black transition-all shadow-[0_15px_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 uppercase tracking-[0.4em] text-[12px] border border-white/10 active:scale-95">
                    {isSyncing ? <Loader2 className="animate-spin w-5 h-5" /> : <span>Open Hub Portal</span>}
                  </button>
                </form>
                <div className="flex flex-col items-center gap-6 w-full">
                  <button type="button" onClick={() => setAuthStep('register')} className="text-[10px] font-black uppercase text-slate-600 hover:text-blue-500 tracking-[0.3em] transition-colors">Apply for Access</button>
                  <button 
                    type="button" 
                    onClick={handleGuestBypass} 
                    className="w-full group flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/40 py-4 rounded-3xl text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-lg"
                  >
                    <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Override: Guest Mode</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <Layout activeView={activeView} setActiveView={(v) => { setActiveView(v); setReadingArticle(null); setReadingCase(null); }} progress={progressPercent} userProfile={userProfile} onSignOut={handleSignOut}>
      {activeView === AppView.HOME && (readingArticle ? (
        <ArticleView article={readingArticle} onBack={() => setReadingArticle(null)} onComplete={() => handleCompleteArticle(readingArticle.id)} isCompleted={completedArticles.includes(readingArticle.id)} />
      ) : (
        <div className="space-y-12 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-900/40">
                {userProfile?.id.startsWith('GUEST_') ? <Shield className="w-10 h-10 text-white" /> : userProfile?.role === 'Student' ? <GraduationCap className="w-10 h-10 text-white" /> : userProfile?.role === 'Expert' ? <Fingerprint className="w-10 h-10 text-white" /> : <UserCheck className="w-10 h-10 text-white" />}
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3 italic">
                  Welcome Back, {userProfile?.name?.split(' ')[0] || 'Investigator'}
                </h1>
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-1">
                  {userProfile?.id.startsWith('GUEST_') ? 'OVERRIDE SESSION' : `Authorized ${userProfile?.role || 'User'}`} | ID: {userProfile?.id || 'PENDING'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800">
              <div className={`w-2 h-2 rounded-full ${userProfile?.id.startsWith('GUEST_') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : isSystemOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'} animate-pulse`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${userProfile?.id.startsWith('GUEST_') ? 'text-emerald-400' : 'text-slate-400'}`}>
                {userProfile?.id.startsWith('GUEST_') ? 'BYPASS_ACTIVE' : isSystemOnline ? 'Identity Verified' : 'Initializing...'}
              </span>
              {isSyncing && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
              <Activity className="w-4 h-4 text-slate-600 ml-2" />
            </div>
          </div>

          <section className="relative overflow-hidden rounded-[4rem] bg-[#0f172a] border border-slate-800 shadow-2xl min-h-[500px] flex items-center">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
            <div className="relative z-10 p-12 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
              <div className="max-w-3xl space-y-10">
                <div className="inline-flex items-center space-x-3 bg-blue-500/10 px-6 py-2.5 rounded-full border border-blue-500/20">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Encrypted Investigator Session</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                  The Path to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Certainty.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
                  Deploying real-world AI reasoning for {userProfile?.role === 'Student' ? 'aspiring experts' : 'verified investigators'}. Master the art of evidentiary science.
                </p>
                <div className="flex flex-wrap gap-5">
                  <button onClick={() => setActiveView(AppView.LAB)} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 rounded-[2.5rem] font-black transition-all shadow-2xl active:scale-95 text-lg">
                    <span>Launch AI Bench</span>
                  </button>
                  <button onClick={() => setActiveView(AppView.RESEARCH)} className="bg-slate-900/80 hover:bg-slate-800 text-white px-12 py-6 rounded-[2.5rem] font-black transition-all flex items-center space-x-4 border border-slate-800 active:scale-95 text-lg backdrop-blur-sm shadow-xl group">
                    <Search className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <span>Facility Intel</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Microscope, title: 'Evidence\nLab', desc: 'Neural Forensic\nAnalysis.', view: AppView.LAB },
              { icon: Database, title: 'Archive\nVault', desc: 'Historical\nSimulations.', view: AppView.CASES },
              { icon: FileText, title: 'Course\nNotes', desc: 'Faculty\nMaterials.', view: AppView.NOTES },
              { icon: GraduationCap, title: 'Academic\nTranscript', desc: 'Verified Record\nHistory.', view: AppView.PROFILE },
            ].map((feat, i) => (
              <button key={i} onClick={() => setActiveView(feat.view)} className="group p-5 md:p-8 rounded-[2.5rem] md:rounded-[3rem] bg-slate-950/40 border border-slate-900/60 hover:border-blue-500/50 transition-all text-left hover:translate-y-[-8px] backdrop-blur-sm shadow-2xl flex flex-col justify-between min-h-[260px] md:min-h-[340px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="p-4 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/60 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all w-fit shadow-xl">
                  <feat.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-black text-base md:text-2xl tracking-tighter uppercase leading-[1] md:leading-[0.9] text-white whitespace-pre-line group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-500 text-[9px] md:text-[10px] leading-tight font-black uppercase tracking-[0.1em] opacity-80 whitespace-pre-line">
                    {feat.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
      {activeView === AppView.ACADEMY && (readingArticle ? (
        <ArticleView article={readingArticle} onBack={() => setReadingArticle(null)} onComplete={() => handleCompleteArticle(readingArticle.id)} isCompleted={completedArticles.includes(readingArticle.id)} />
      ) : (
        <div className="space-y-12 animate-in slide-in-from-right duration-700">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-slate-900/40 p-12 rounded-[3.5rem] border border-slate-800/60">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter">Academic Repository</h1>
              <p className="text-slate-400 text-lg max-w-xl font-medium mt-4">Curated forensic modules covering the full curriculum.</p>
            </div>
            <div className="flex items-center space-x-3">
              {(['All', 100, 200, 300, 400, 500] as const).map(lvl => (
                <button key={lvl} onClick={() => setSelectedLevel(lvl as any)} className={`px-8 py-4 rounded-[1.8rem] text-xs font-black transition-all border whitespace-nowrap uppercase tracking-[0.2em] ${selectedLevel === lvl ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-900/40' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-500'}`}>
                  {lvl === 'All' ? 'All Levels' : `${lvl}L`}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.filter(a => selectedLevel === 'All' || a.level === selectedLevel).map(article => (
              <ArticleCard 
                key={article.id} 
                article={unlockedArticles.includes(article.id) ? { ...article, isPremium: false } : article} 
                onRead={handleArticleRead} 
                onPay={handleArticlePay} 
                onSetReminder={(a) => handleSetReminder({ id: a.id, title: a.title, type: 'article' })}
              />
            ))}
          </div>
        </div>
      ))}
      {activeView === AppView.NOTES && (
        <NotesMarketplace 
          ownedNotes={ownedNotes} 
          setOwnedNotes={setOwnedNotes} 
          syncUserData={syncUserData} 
          onSetReminder={(n) => handleSetReminder({ id: n.id, title: n.title, type: 'note' })}
        />
      )}
      {activeView === AppView.LAB && <LabTerminal caseContext={activeCaseContext} userProfile={userProfile} onClearContext={() => setActiveCaseContext(null)} />}
      {activeView === AppView.RESEARCH && <ResearchPortal />}
      {activeView === AppView.CASES && (
        readingCase ? (
          <CaseView caseData={readingCase} onBack={() => setReadingCase(null)} onInvestigate={handleInvestigate} />
        ) : (
          <div className="space-y-12 animate-in slide-in-from-right duration-700">
            <div className="bg-slate-900/40 p-12 rounded-[3.5rem] border border-slate-800/60">
              <h1 className="text-5xl font-black tracking-tighter">Forensic Case Archives</h1>
              <p className="text-slate-400 text-lg max-w-xl font-medium mt-4">Select a dossier to initiate spatial reconstruction or evidence analysis.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {CASES.map(c => (
                <div key={c.id} onClick={() => setReadingCase(c)} className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/60 p-8 hover:border-blue-500/50 transition-all cursor-pointer group shadow-xl flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : c.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {c.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-blue-400 mb-2 transition-colors flex-1">{c.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-6">{c.summary}</p>
                  <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between text-blue-500 font-black text-[10px] uppercase tracking-widest">
                    <span>View Dossier</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
      {activeView === AppView.PROFILE && <ProfileView completedArticles={completedArticles} unlockedArticles={unlockedArticles} ownedNotes={ownedNotes} userProfile={userProfile} />}
      {showPayment && <PaymentModal articleTitle={showPayment.title} onClose={() => setShowPayment(null)} onSuccess={handlePaymentSuccess} />}
      {reminderTarget && (
        <ReminderModal 
          targetId={reminderTarget.id}
          targetTitle={reminderTarget.title}
          targetType={reminderTarget.type}
          onClose={() => setReminderTarget(null)}
          onSetReminder={onAddReminder}
        />
      )}
    </Layout>
  );
}
