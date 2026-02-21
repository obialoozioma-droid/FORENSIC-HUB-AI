
import React, { useState, useRef, useEffect } from 'react';
import { X, Landmark, CheckCircle, Copy, Check, ArrowLeft, Camera, Upload, FileCheck, Sparkles, ShieldCheck, ChevronRight, CreditCard, ChevronUp, ChevronDown } from 'lucide-react';
import { PREMIUM_PRICE_NGN } from '../constants';

interface PaymentModalProps {
  articleTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ articleTitle, onClose, onSuccess }) => {
  const [step, setStep] = useState<'selection' | 'bank_details' | 'confirm_transfer' | 'processing' | 'success'>('selection');
  const [copied, setCopied] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollControls, setShowScrollControls] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setShowScrollControls(scrollHeight > clientHeight);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [step]);

  const handleScroll = (direction: 'up' | 'down') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'up' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = () => {
    if (!receiptFile) {
      alert("Please upload a transaction screenshot to continue.");
      return;
    }
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('9137603171');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.6)] border-t-emerald-500/30 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/30 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                if (step === 'selection') onClose();
                else if (step === 'bank_details') setStep('selection');
                else if (step === 'confirm_transfer') setStep('bank_details');
              }} 
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all active:scale-90 text-slate-400 border border-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Access Terminal</h2>
              <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest">Secure Verification Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-2xl transition-all">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div 
          ref={scrollContainerRef}
          className="p-8 md:p-10 overflow-y-auto no-scrollbar relative flex-grow"
        >
          {step === 'selection' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 text-center pb-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">Premium Authentication</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight line-clamp-2">{articleTitle}</h3>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tighter">₦{PREMIUM_PRICE_NGN.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setStep('bank_details')}
                  className="group relative w-28 h-28 md:w-32 md:h-32 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] flex items-center justify-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all active:scale-95 shadow-2xl"
                >
                  <CreditCard className="w-12 h-12 md:w-14 md:h-14 text-emerald-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-slate-800/50 flex items-center space-x-5 text-left">
                <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-400 shadow-inner flex-shrink-0">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Direct Verification</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Verified by faculty administrator. Access is granted instantly upon proof verification.</p>
                </div>
              </div>
              
              <button 
                onClick={() => setStep('bank_details')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-3xl font-black transition-all shadow-2xl shadow-emerald-900/40 active:scale-[0.98] flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-xs"
              >
                <span>Initialize Bank Transfer</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'bank_details' && (
            <div className="space-y-10 animate-in slide-in-from-right duration-300 pb-6">
              <div className="text-center space-y-3">
                <div className="bg-emerald-500/10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-4 border border-emerald-500/20 shadow-inner">
                   <Landmark className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Bank Protocol</h3>
                <p className="text-slate-500 text-xs font-medium max-w-[280px] mx-auto">Please transfer ₦{PREMIUM_PRICE_NGN.toLocaleString()} to the account below.</p>
              </div>

              <div className="bg-slate-950 p-6 md:p-8 rounded-[3rem] border border-slate-800/80 space-y-8 relative overflow-hidden shadow-2xl">
                <div className="space-y-3 relative z-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Number</p>
                  <div className="flex items-center justify-between bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-800 group hover:border-emerald-500/50 transition-colors shadow-inner">
                    <span className="text-2xl md:text-3xl font-mono font-black text-emerald-400 tracking-tighter">9137603171</span>
                    <button onClick={copyToClipboard} className="p-3 md:p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all text-slate-400 hover:text-white active:scale-90 shadow-lg">
                      {copied ? <Check className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" /> : <Copy className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institution</p>
                    <p className="font-black text-white text-lg md:text-xl">OPAY</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fee Amount</p>
                    <p className="font-black text-emerald-400 text-lg md:text-xl tracking-tight">₦{PREMIUM_PRICE_NGN.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-2 relative z-10 border-t border-slate-800/50 mt-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Account Beneficiary</p>
                  <p className="font-black text-white text-sm md:text-base tracking-tight uppercase">ACADEMY ADMINISTRATOR</p>
                </div>
              </div>

              <div className="space-y-5">
                <button 
                  onClick={() => setStep('confirm_transfer')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-3xl font-black transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center space-x-3 active:scale-[0.98] group uppercase tracking-widest text-xs"
                >
                  <span>Transfer Completed</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 'confirm_transfer' && (
            <div className="space-y-10 animate-in slide-in-from-right duration-300 pb-6">
               <div className="text-center space-y-3">
                <div className="bg-blue-500/10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-4 border border-blue-500/20 shadow-inner">
                   <Camera className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Submit Proof</h3>
                <p className="text-slate-500 text-xs font-medium max-w-[280px] mx-auto">Upload a screenshot of your successful transaction.</p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer group relative flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] p-12 transition-all duration-300 ${
                  receiptFile ? 'bg-emerald-500/5 border-emerald-500/50' : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {receiptFile ? (
                  <div className="flex flex-col items-center space-y-6 animate-in zoom-in duration-300 text-center">
                    <FileCheck className="w-10 h-10 text-emerald-400" />
                    <p className="text-base font-black text-white">{receiptFile.name}</p>
                    <button onClick={(e) => { e.stopPropagation(); setReceiptFile(null); }} className="text-[10px] font-black text-red-500 uppercase tracking-widest">Reset Submission</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-5 text-center transition-transform group-hover:scale-105">
                    <Upload className="w-10 h-10 text-emerald-400" />
                    <p className="text-lg font-black text-white">Tap to Upload Receipt</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleFinalSubmit}
                disabled={!receiptFile}
                className={`w-full py-6 rounded-3xl font-black transition-all shadow-2xl flex items-center justify-center space-x-4 active:scale-[0.98] uppercase tracking-widest text-xs ${receiptFile ? 'bg-emerald-600 text-white shadow-emerald-900/40' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Initialize Verification</span>
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-24 flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-300">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin shadow-2xl"></div>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter">Analyzing Payload</h3>
            </div>
          )}

          {step === 'success' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-emerald-500 animate-bounce" />
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Access Authorized</h3>
                <p className="text-slate-400 text-sm max-w-[300px] mx-auto">Access is granted instantly upon proof verification.</p>
              </div>
              <button onClick={onSuccess} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-3xl font-black transition-all uppercase tracking-[0.25em] text-xs">Launch Unlocked Material</button>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-center flex-shrink-0">
           <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">FORENSICHUB ACADEMY © 2024</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
