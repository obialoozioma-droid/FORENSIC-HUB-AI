
import React from 'react';
import { Mail, ShieldCheck, ChevronRight, FileText, Scale } from 'lucide-react';
import { UserProfile } from '../types';

interface WelcomeEmailProps {
  user: UserProfile;
  onConfirm: () => active;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ user, onConfirm }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full bg-white text-slate-900 rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative">
        {/* Email Header */}
        <div className="bg-slate-900 text-white p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">ForensicHub Internal Mail</p>
              <h3 className="font-bold text-sm">Academy Onboarding Terminal</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-mono text-slate-500">REF_ID: #882-SYS</p>
            <p className="text-[10px] font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Email Content */}
        <div className="p-10 md:p-14 space-y-8 font-serif leading-relaxed text-slate-700">
          <div className="space-y-4">
            <h1 className="text-3xl font-black font-sans text-slate-900 tracking-tight italic">
              Formal Academic Welcome
            </h1>
            <div className="h-1 w-20 bg-blue-600"></div>
          </div>

          <p className="text-lg">
            Dear <span className="font-bold text-slate-900">{user.name}</span>,
          </p>

          <p>
            On behalf of the <strong>ForensicHub Academy Administration</strong>, it is my distinct honor to welcome you to our professional learning ecosystem. By registering as a <span className="text-blue-600 font-bold uppercase tracking-tight italic">{user.role}</span>, you have gained access to the most advanced AI-assisted forensic repository currently available.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 font-sans">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institutional Credentials Issued:</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Investigator ID</p>
                <p className="text-xl font-mono font-black text-blue-700 tracking-tighter">{user.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Verification Level</p>
                <p className="text-xl font-bold text-slate-900 italic">Tier 1: Access Granted</p>
              </div>
            </div>
          </div>

          <p>
            Our mission is to provide you with a high-fidelity environment where theory meets application. Whether you are conducting ballistics analysis or reviewing cold case files, our AI core will assist in your pursuit of scientific truth.
          </p>

          <div className="pt-8 flex items-center justify-between border-t border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Dr. Helena Vance</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-sans font-black mt-1">Dean of Forensic Sciences</p>
            </div>
            <div className="flex flex-col items-end opacity-20 rotate-12">
               <Scale className="w-12 h-12" />
               <p className="text-[8px] font-black uppercase mt-1">Institutional Seal</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="bg-slate-50 p-6 flex justify-center">
          <button 
            onClick={onConfirm}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black transition-all flex items-center gap-4 shadow-xl active:scale-95"
          >
            <span className="uppercase tracking-[0.2em] text-xs">Verify Credentials & Enter Academy</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeEmail;
