import React from 'react';
import { Globe, Check } from 'lucide-react';
import { AppModule } from '../types';

interface NavbarProps {
  lang: 'zh' | 'en';
  setLang: (l: 'zh' | 'en') => void;
  t: any;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({ lang, setLang, activeTab = '数字人', onTabChange }: NavbarProps) {
  const tabs = [
    { id: 'digital-human', label: '数字人' },
    { id: 'ai-voice', label: 'AI语音' },
    { id: 'prompt-engine', label: '提示词引擎' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 z-[60] flex items-center justify-between px-4 md:px-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto transition-all duration-300">
      {/* Left: Logo */}
      <div className="flex items-center gap-3 md:gap-4">
        <img src="https://github.com/mattyyyyyyy/picture2bed/blob/main/e850352ac65c103853436eb801478413b07eca802308%20(1).png?raw=true" className="w-7 h-7 md:w-9 md:h-9 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <span className="text-xl md:text-2xl font-black tracking-tighter text-white drop-shadow-lg">JDO</span>
      </div>

      {/* Center: Tabs */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">
         {tabs.map((tab) => (
           <button 
             key={tab.id} 
             onClick={() => onTabChange && onTabChange(tab.id)}
             className={`px-4 py-1.5 md:px-6 md:py-2 text-[10px] md:text-xs font-bold tracking-[0.15em] transition-all rounded-lg whitespace-nowrap ${activeTab === tab.id ? 'bg-white/15 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] border border-white/10' : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'}`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      {/* Right: Language */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer group px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/5" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
          <Globe size={14} className="text-white/40 group-hover:text-white transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors hidden sm:inline">
            {lang === 'zh' ? 'CN' : 'EN'}
          </span>
        </div>
      </div>
    </nav>
  );
}