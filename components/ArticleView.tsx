
import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Calendar, 
  Share2, 
  Bookmark, 
  CheckCircle, 
  Quote, 
  Sparkles, 
  Volume2, 
  Loader2, 
  Play, 
  Pause, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Check, 
  BookmarkCheck 
} from 'lucide-react';
import { generateForensicSpeech } from '../services/geminiService';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, onComplete, isCompleted }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('fh_bookmarks');
      if (saved) {
        const bookmarks = JSON.parse(saved);
        return Array.isArray(bookmarks) && bookmarks.includes(article.id);
      }
    } catch (e) {}
    return false;
  });
  
  const [shareFeedback, setShareFeedback] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmark = () => {
    try {
      const saved = localStorage.getItem('fh_bookmarks');
      let bookmarks = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(bookmarks)) bookmarks = [];
      
      if (isBookmarked) {
        bookmarks = bookmarks.filter((id: string) => id !== article.id);
      } else {
        bookmarks.push(article.id);
      }
      
      localStorage.setItem('fh_bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(!isBookmarked);
    } catch (e) {}
  };

  const handleShare = async () => {
    const shareData = {
      title: `ForensicHub: ${article.title}`,
      text: `Check out this forensic science module: ${article.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const cleanMarkdownForSpeech = (text: string) => {
    return text
      .replace(/## /g, 'Chapter: ')
      .replace(/### /g, 'Section: ')
      .replace(/- /g, 'Point: ')
      .replace(/\*\*/g, '')
      .replace(/---/g, ' Next section. ')
      .trim();
  };

  const handleSpeak = async () => {
    if (isSynthesizing || isSpeaking) return;
    
    setIsSynthesizing(true);
    try {
      const titlePrefix = `Academic Note: ${article.title}. Authored by ${article.author}. `;
      const fullNote = article.content ? cleanMarkdownForSpeech(article.content) : article.description;
      const speechText = titlePrefix + fullNote;

      const success = await generateForensicSpeech(speechText);
      if (success) {
        setIsSpeaking(true);
        // Reset state after a long timeout or when audio finishes (if tracked)
        setTimeout(() => setIsSpeaking(false), 120000); 
      }
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl md:text-4xl font-black text-white mt-10 md:mt-16 mb-6 border-b border-slate-800 pb-4 tracking-tight">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg md:text-2xl font-black text-blue-400 mt-8 mb-4 tracking-tight">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 mb-3 text-slate-300 list-disc font-medium">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '---') {
        return <hr key={i} className="my-10 border-slate-800" />;
      }
      if (line.trim() === '') return <br key={i} />;
      
      return <p key={i} className="mb-5 text-slate-300 leading-relaxed text-base md:text-lg font-medium">{line}</p>;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 pb-32 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-slate-900/50 backdrop-blur-md">
        <div 
          className="h-full bg-blue-500 transition-all duration-150 shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 px-6 md:px-0 relative">
        <header className="space-y-8 pt-8">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-500 hover:text-blue-400 transition-all group mb-6 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Exit Module</span>
          </button>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-blue-600/10 text-blue-400 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-lg">
                {article.category}
              </span>
              <span className="text-slate-600 text-[10px] font-mono font-bold">NODE_ID: {article.id}</span>
              <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime} study</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              {article.title}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl border-l-2 border-blue-500/30 pl-6 italic">
              {article.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-slate-800/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 shadow-xl border border-white/5">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Primary Educator</p>
                <p className="text-base font-black text-white">{article.author}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSpeak}
                disabled={isSynthesizing}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${
                  isSpeaking 
                  ? 'bg-blue-600 text-white animate-pulse' 
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/50'
                }`}
              >
                {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : isSpeaking ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSynthesizing ? 'Synthesizing...' : isSpeaking ? 'Reading Full Note' : 'Listen to Module'}</span>
              </button>
              
              <div className="flex gap-3 relative">
                <button 
                  onClick={handleBookmark}
                  title={isBookmarked ? "Remove Bookmark" : "Save Module"}
                  className={`p-3.5 rounded-2xl border transition-all shadow-xl active:scale-90 ${
                    isBookmarked 
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30'
                  }`}
                >
                  {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleShare}
                  title="Share Module"
                  className={`p-3.5 rounded-2xl border transition-all shadow-xl active:scale-90 ${
                    shareFeedback 
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30'
                  }`}
                >
                  {shareFeedback ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="relative aspect-video sm:aspect-[21/9] rounded-[3rem] overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
          
          {isCompleted && (
            <div className="absolute top-8 right-8 bg-emerald-500 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl animate-in zoom-in duration-500 border-4 border-[#080b14]">
              <CheckCircle className="w-5 h-5" />
              <span>Module Mastered</span>
            </div>
          )}
        </div>

        <article className="max-w-none pb-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-blue-600/5 border-l-4 border-blue-600 p-8 md:p-10 rounded-r-[2.5rem] mb-12 italic text-slate-300 font-medium relative overflow-hidden shadow-inner">
                <Quote className="w-16 h-16 text-blue-600 absolute top-4 right-4 opacity-10" />
                <p className="relative z-10 text-lg md:text-xl leading-relaxed">
                  "Forensic evidence does not lie. It does not forget. It is factual evidence. Physical evidence cannot be wrong, it cannot perjure itself, it cannot be wholly absent."
                </p>
                <p className="mt-4 not-italic font-black text-[10px] uppercase tracking-widest text-blue-500">— Paul L. Kirk</p>
              </div>

              <div className="text-slate-300 leading-relaxed font-medium space-y-2">
                {article.content ? renderContent(article.content) : (
                  <div className="p-20 text-center space-y-6 bg-slate-900/30 rounded-[3rem] border border-slate-800 border-dashed">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                    <p className="italic text-slate-500 font-mono text-sm">Synchronizing faculty data repositories...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] space-y-6 backdrop-blur-md">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" /> Key Insights
                   </h4>
                   <ul className="space-y-4">
                     {['Scientific methodology', 'Evidence Individuality', 'Standardized protocols', 'Legal compliance'].map((item, idx) => (
                       <li key={idx} className="flex items-start gap-3">
                         <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                         <span className="text-[11px] font-bold text-slate-400 leading-tight">{item}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-24 p-8 md:p-14 bg-gradient-to-br rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 transition-all duration-700 shadow-[0_30px_100px_rgba(0,0,0,0.5)] ${
            isCompleted 
            ? 'from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30' 
            : 'from-slate-900 to-[#0c1221] border border-slate-800 hover:border-blue-500/40'
          }`}>
            <div className="space-y-4 text-center md:text-left">
              <h4 className="text-3xl md:text-4xl font-black text-white flex items-center justify-center md:justify-start gap-4 tracking-tighter">
                {isCompleted ? <CheckCircle className="text-emerald-500 w-10 h-10" /> : <Sparkles className="text-blue-500 w-10 h-10" />}
                {isCompleted ? 'Module Mastered' : 'Seal This Module?'}
              </h4>
              <p className="text-slate-400 text-base md:text-lg font-medium max-w-xl">
                {isCompleted ? 'Module successfully archived in your transcript.' : 'Certify your mastery of these fundamental concepts to progress.'}
              </p>
            </div>
            
            {!isCompleted ? (
              <button 
                onClick={() => {
                  onComplete?.();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 rounded-[2rem] font-black transition-all flex items-center justify-center space-x-4 shadow-2xl active:scale-95 uppercase tracking-[0.2em] text-xs"
              >
                <CheckCircle className="w-6 h-6" />
                <span>Finalize Study</span>
              </button>
            ) : (
              <div className="bg-emerald-500 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 shadow-2xl">
                <ShieldCheck className="w-6 h-6" />
                Verified Complete
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleView;
