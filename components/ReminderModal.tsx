
import React, { useState } from 'react';
import { Bell, X, Calendar, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface ReminderModalProps {
  targetId: string;
  targetTitle: string;
  targetType: 'article' | 'note';
  onClose: () => void;
  onSetReminder: (time: string) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ 
  targetTitle, 
  targetType, 
  onClose, 
  onSetReminder 
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(Notification.permission);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    
    const reminderDateTime = new Date(`${date}T${time}`);
    if (reminderDateTime <= new Date()) {
      alert("PROTOCOL_ERROR: Reminder time must be in the future.");
      return;
    }

    onSetReminder(reminderDateTime.toISOString());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-[#0a0f1d] border border-blue-500/30 rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Set Study Reminder</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Temporal Scheduling Protocol</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-2">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Target {targetType}:</p>
            <p className="text-white font-bold text-lg leading-tight">{targetTitle}</p>
          </div>

          {permissionStatus !== 'granted' && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-amber-200 leading-relaxed uppercase tracking-tight">
                  System notifications are currently restricted. Authorization is required for real-time alerts.
                </p>
                <button 
                  onClick={requestPermission}
                  className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest underline decoration-2 underline-offset-4"
                >
                  Authorize Notifications
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Calendar size={12} /> Date
                </label>
                <input 
                  required
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-black/50 border border-slate-800 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Clock size={12} /> Time
                </label>
                <input 
                  required
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-black/50 border border-slate-800 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs active:scale-95 border border-white/5"
            >
              <ShieldCheck size={20} />
              <span>Initialize Reminder</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
