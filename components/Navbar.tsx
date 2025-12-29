import React from 'react';
import { Globe, Check } from 'lucide-react';
import { AppModule } from '../types';
import DropdownMenu, { DropdownOption } from './DropdownMenu';

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
    { id: 'prompt-engine', label: '提示词' }
  ];

  const langOptions: DropdownOption[] = [
    { 
      label: '简体中文 (ZH)', 
      onClick: () => setLang('zh'), 
      active: lang === 'zh',
      Icon: lang === 'zh' ? <Check size={14} className="text-spark-accent" /> : null 
    },
    { 
      label: 'English (EN)', 
      onClick: () => setLang('en'), 
      active: lang === 'en',
      Icon: lang === 'en' ? <Check size={14} className="text-spark-accent" /> : null 
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 md:h-24 z-[60] flex items-center justify-between px-6 md:px-12 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto transition-all duration-300">
      {/* Left: Logo */}
      <div className="flex items-center gap-3 md:gap-4">
        <img src="https://github.com/mattyyyyyyy/picture2bed/blob/main/e850352ac65c103853436eb801478413b07eca802308%20(1).png?raw=true" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <span className="text-2xl md:text-3xl font-black tracking-tighter text-white drop-shadow-lg">JDO</span>
      </div>

      {/* Center: Tabs - Single Liquid Glass Container */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center gap-8 px-10 py-3 rounded-2xl bg-black/10 border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl">
           {tabs.map((tab) => (
             <button 
               key={tab.id} 
               onClick={() => onTabChange && onTabChange(tab.id)}
               className={`relative text-sm md:text-base font-light tracking-[0.2em] transition-all duration-500 uppercase flex flex-col items-center group ${
                 activeTab === tab.id 
                   ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                   : 'text-white/40 hover:text-white/80'
               }`}
             >
               <span className="relative z-10">{tab.label}</span>
               {/* Minimalist Active Indicator */}
               <span className={`absolute -bottom-1 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-500 ${activeTab === tab.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
               {/* Hover Glow */}
               <span className="absolute inset-0 bg-white/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-150" />
             </button>
           ))}
        </div>
      </div>

      {/* Right: Language */}
      <div className="flex items-center gap-4">
        <DropdownMenu options={langOptions} className="w-[140px]" menuClassName="right-0">
          <div className="flex items-center gap-2">
            <Globe size={16} className="opacity-80"/>
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-90">{lang === 'zh' ? 'CN' : 'EN'}</span>
          </div>
        </DropdownMenu>
      </div>
    </nav>
  );
}