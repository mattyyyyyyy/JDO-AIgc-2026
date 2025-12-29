import React, { useState } from 'react';
import { 
  Settings, Save, ChevronLeft, Mic, 
  MessageSquare, User, Box, Play, Send, Loader2, Info, Search
} from 'lucide-react';
import { AppModule, Asset, Voice } from '../../types';
import { DH_TEXT_CONTENT } from './constants';
import GlassCard from '../../components/GlassCard';

interface StudioProps {
  module: AppModule;
  onBack: () => void;
  lang: string;
}

const Studio: React.FC<StudioProps> = ({ module, onBack, lang }) => {
  const t_dh = (DH_TEXT_CONTENT as any)[lang] || DH_TEXT_CONTENT.CN;
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Asset data for visualization
  const [activeAsset, setActiveAsset] = useState<string | null>(null);

  const getModuleTitle = () => {
    switch(module) {
      case AppModule.DH_AUDIO: return t_dh.features[0];
      case AppModule.DH_CHAT: return t_dh.features[1];
      case AppModule.DH_AVATAR: return t_dh.features[2];
      case AppModule.DH_3D: return t_dh.features[3];
      default: return "Digital Human Studio";
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">{getModuleTitle()}</h2>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Digital Human Studio • Phase v2.5</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Save size={14} /> {t_dh.studio.nav.saveSettings}
          </button>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-[380px] border-r border-white/10 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">
           <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-spark-accent shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                 <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{t_dh.studio.controls.voice}</h3>
              </div>
              <GlassCard className="!p-4 bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all flex items-center gap-4 group">
                 <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <User size={24} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{t_dh.studio.controls.voiceSelectLabel}</span>
                    <span className="text-[10px] text-white/30 uppercase font-medium">Standard / Warm</span>
                 </div>
              </GlassCard>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-spark-amber shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                 <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{t_dh.studio.assets.models}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      onClick={() => setActiveAsset(`asset_${i}`)}
                      className={`aspect-square rounded-2xl border transition-all cursor-pointer hover:scale-105 ${activeAsset === `asset_${i}` ? 'bg-spark-accent/20 border-spark-accent/60' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                       <img 
                         src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=avatar_${i}`} 
                         className="w-full h-full p-2"
                         alt="avatar"
                       />
                    </div>
                 ))}
              </div>
           </section>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 relative flex flex-col p-8 items-center justify-center">
            <div className="relative w-full max-w-4xl aspect-video rounded-[3rem] border border-white/10 bg-black/40 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={activeAsset ? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${activeAsset}` : `https://api.dicebear.com/7.x/pixel-art/svg?seed=default`}
                    className="h-4/5 object-contain transition-transform duration-700 group-hover:scale-105"
                    alt="Main Avatar"
                  />
                  {/* Digital Grid Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" 
                       style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                  />
               </div>
               
               {/* Status Badge */}
               <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t_dh.studio.controls.ready}</span>
               </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl">
               <div className="relative group">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 pr-32 text-white font-medium placeholder-white/20 outline-none focus:border-spark-accent/50 shadow-2xl resize-none transition-all"
                    placeholder={t_dh.studio.controls.drivePlaceholder}
                    rows={2}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                        <Mic size={18} />
                     </button>
                     <button 
                       onClick={() => setIsProcessing(true)}
                       className="px-6 py-2.5 rounded-xl bg-spark-accent hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                     >
                        {isProcessing ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                        {t_dh.studio.controls.send}
                     </button>
                  </div>
               </div>
            </div>
        </main>

        {/* Right Info Panel */}
        <aside className="w-[320px] border-l border-white/10 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
           <div className="space-y-4">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{t_dh.studio.controls.actions}</h3>
              <div className="space-y-2">
                 {['打招呼', '演示 PPT', '生气', '思考', '鼓掌'].map(act => (
                    <button key={act} className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                       {act}
                    </button>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default Studio;