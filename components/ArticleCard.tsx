
import React, { useState } from 'react';
import { Article } from '../types';
import { Lock, Clock, User, ArrowRight, BookOpen, Image as ImageIcon, Bell, Loader2 } from 'lucide-react';
import { PREMIUM_PRICE_NGN } from '../constants';

interface ArticleCardProps {
  article: Article;
  onRead: (id: string) => void;
  onPay: (article: Article) => void;
  onSetReminder: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onRead, onPay, onSetReminder }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 overflow-hidden hover:border-blue-500/50 transition-all group h-full flex flex-col backdrop-blur-sm">
      <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-slate-800">
        {!imgError ? (
          <img 
            src={article.image} 
            alt={article.title} 
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/50">
            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
            <span className="text-[10px] uppercase font-bold tracking-tighter">Specimen Image Unavailable</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <div className="bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
            {article.category}
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-blue-300 border border-blue-500/30">
            {article.level} Level
          </div>
        </div>
        
        {article.isPremium && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black flex items-center space-x-1 shadow-xl animate-pulse">
            <Lock className="w-3 h-3" />
            <span>PREMIUM</span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-4 text-[10px] text-slate-500 mb-4 font-mono">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 text-blue-500" />
            <span className="truncate max-w-[100px]">{article.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>{article.readTime}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-extrabold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight min-h-[3rem]">
          {article.title}
        </h3>
        
        {article.isSummarizing ? (
          <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl relative overflow-hidden animate-pulse">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Generating AI Summary...</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full w-full mb-2"></div>
            <div className="h-2 bg-slate-800 rounded-full w-2/3"></div>
          </div>
        ) : article.aiSummary ? (
          <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl relative overflow-hidden group/summary">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40"></div>
            <p className="text-blue-200/90 text-[11px] font-bold leading-relaxed italic">
              <span className="text-blue-400 not-italic mr-1">AI_SUMMARY:</span>
              {article.aiSummary}
            </p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-1 min-h-[2.5rem]">
            {article.description}
          </p>
        )}
        
        <div className="pt-4 border-t border-slate-800/50 mt-auto flex flex-col gap-3">
          {article.isPremium ? (
            <button 
              onClick={() => onPay(article)}
              className="w-full bg-slate-800/50 hover:bg-yellow-500 hover:text-slate-900 py-3.5 rounded-2xl font-black transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-yellow-400 shadow-lg group/btn"
            >
              <span className="text-xs">UNLOCK • ₦{PREMIUM_PRICE_NGN.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => onRead(article.id)}
                className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white py-3.5 rounded-2xl font-black transition-all border border-blue-600/20 text-xs flex items-center justify-center space-x-2 shadow-inner"
              >
                <BookOpen className="w-4 h-4" />
                <span>STUDY</span>
              </button>
              <button 
                onClick={() => onSetReminder(article)}
                className="p-3.5 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-2xl border border-slate-700 transition-all"
                title="Set Study Reminder"
              >
                <Bell size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
