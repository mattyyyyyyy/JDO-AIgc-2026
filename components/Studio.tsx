import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  ArrowLeft, Monitor, ChevronDown, Check, ZoomIn, ZoomOut, RefreshCcw, 
  Search, User, Mic, Send, Phone, PhoneOff, Trash2, FileInput, PlayCircle, 
  Undo2, Redo2, Wind, PauseCircle, Music, CaseSensitive, Binary, Sigma, 
  Languages, HandMetal, FileCheck, FileText, Sparkles, Square, Globe, Sword, Cat,
  Save, Settings, Glasses, Image as ImageIcon, FolderOpen, Play, Pause, Shirt, Grid
} from 'lucide-react';
import { AppModule, Asset, ChatMessage } from '../types';
import GlassCard from './GlassCard';
import { useVoices } from '../contexts/VoiceContext';
import { usePlayer } from '../contexts/PlayerContext';

interface StudioProps {
  module: AppModule;
  onChangeModule: (m: AppModule) => void;
  lang: string;
  setLang: (l: any) => void;
  onBack: () => void;
  onOpenSettings: () => void;
  savedAssets: Asset[];
  onSaveAsset: (a: Asset) => void;
  t: any;
}

const TOOLBAR_ITEMS = [
  { icon: FileInput, label: '导入模型', id: 'import' },
  { icon: PlayCircle, label: '预演', id: 'preview' },
  { icon: Undo2, label: '撤销', id: 'undo' },
  { icon: Redo2, label: '重做', id: 'redo' },
  { icon: RefreshCcw, label: '重置', id: 'reset' },
  { icon: Wind, label: '风力', id: 'wind' },
  { icon: PauseCircle, label: '暂停', id: 'pause' },
  { icon: Music, label: '音乐', id: 'music' },
  { icon: CaseSensitive, label: '文本', id: 'text' },
  { icon: HandMetal, label: '手势', id: 'gesture' },
];

const MOCK_CHARACTERS = [
  { id: 't1', name: '新闻主播', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: 't2', name: '英语老师', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
  { id: 't3', name: '虚拟偶像', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { id: 't4', name: '专业医生', src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop' },
  { id: 't5', name: '金牌主持', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
  { id: 't6', name: '可爱萌娃', src: 'https://images.unsplash.com/photo-1503919535824-b2912c422892?q=80&w=200&auto=format&fit=crop' },
  { id: 't7', name: '人气网红', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { id: 't8', name: '商务精英', src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop' },
];

const MOCK_3D_CHARACTERS = [
  { id: 'm1', name: 'Barbara Style', type: 'female', icon: Sparkles },
  { id: 'm2', name: 'Nahida Style', type: 'female', icon: Sparkles },
  { id: 'm3', name: 'Xiao Style', type: 'male', icon: Sword },
  { id: 'm4', name: 'Childe Style', type: 'male', icon: Sword },
  { id: 'm5', name: 'Kazuha Style', type: 'male', icon: Sword },
  { id: 'm6', name: 'Zhongli Style', type: 'male', icon: Sword },
  { id: 'm7', name: 'Paimon', type: 'pet', icon: Cat },
  { id: 'm8', name: 'Guoba', type: 'pet', icon: Cat },
];

const MOCK_ACCESSORIES = [
  { id: 'a1', name: 'Qilin Horns', type: 'Top', icon: '🌙' },
  { id: 'a2', name: 'Ice Bell', type: 'Top', icon: '🔔' },
  { id: 'a3', name: 'Frost Top', type: 'Top', icon: '⚡' },
  { id: 'a4', name: 'Cryo Orb', type: 'Bottom', icon: '🔮' },
  { id: 'a5', name: 'Goat Plushie', type: 'Bottom', icon: '🐐' },
  { id: 'a6', name: 'Spirit Boots', type: 'Shoes', icon: '👢' },
  { id: 'a7', name: 'Cloud Cape', type: 'Decor', icon: '🧣' },
  { id: 'a8', name: 'Jade Skirt', type: 'Decor', icon: '👗' },
];

const MOCK_BACKGROUNDS = [
  { id: 'bg1', name: '绿幕', color: '#00ff00', type: 'color' },
  { id: 'bg2', name: '蓝幕', color: '#0000ff', type: 'color' },
  { id: 'bg3', name: '新闻直播间', src: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&fit=crop&q=80', type: 'image' },
  { id: 'bg4', name: '教室', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&fit=crop&q=80', type: 'image' },
  { id: 'bg5', name: '办公室', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&fit=crop&q=80', type: 'image' },
  { id: 'bg6', name: '演播室', src: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300&fit=crop&q=80', type: 'image' },
];

const EMOTIONS = [
  { id: 'default', label: '默认', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&emotion=default' },
  { id: 'happy', label: '开心', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=happy&emotion=smile' },
  { id: 'sad', label: '悲伤', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sad&emotion=sad' },
  { id: 'angry', label: '生气', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=angry&emotion=angry' },
];

export default function Studio({ module, onChangeModule, onBack, t }: StudioProps) {
  const [baseModel, setBaseModel] = useState<string>('m1');
  const [isCallActive, setIsCallActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [aspectRatio, setAspectRatio] = useState('2:3');
  const [activeTab, setActiveTab] = useState('all');
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  
  // Studio Specific States
  const [rightSidebarTab, setRightSidebarTab] = useState<'model' | 'accessory' | 'voice' | 'background' | 'folder'>('model');
  const [selectedAccessoryType, setSelectedAccessoryType] = useState('全部');
  const [selectedVoiceGender, setSelectedVoiceGender] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('bg1');
  const [zoomLevel, setZoomLevel] = useState(1);

  const moduleMenuRef = useRef<HTMLDivElement>(null);
  const { voices } = useVoices();
  const { playVoice, currentVoice, isPlaying, togglePlay } = usePlayer();

  const is3D = module === AppModule.DH_3D;
  const is2DAvatar = module === AppModule.DH_AVATAR;
  const useAdvancedSidebar = is3D || is2DAvatar;

  // Initialize base model based on module type
  useEffect(() => {
    if (is3D) setBaseModel('m1');
    else if (is2DAvatar) setBaseModel('t1');
  }, [module]);

  const dhModules = [
    { id: AppModule.DH_AUDIO, label: t.features[0] },
    { id: AppModule.DH_CHAT, label: t.features[1] },
    { id: AppModule.DH_AVATAR, label: t.features[2] },
    { id: AppModule.DH_3D, label: t.features[3] },
  ];

  const currentModuleLabel = dhModules.find(m => m.id === module)?.label || t.features[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moduleMenuRef.current && !moduleMenuRef.current.contains(event.target as Node)) {
        setShowModuleMenu(false);
      }
    };
    if (showModuleMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModuleMenu]);

  // Helper for voice list in sidebar
  const filteredVoices = voices.filter(v => {
    if (selectedVoiceGender === '全部') return true;
    if (selectedVoiceGender === '男声') return v.gender === 'Male';
    if (selectedVoiceGender === '女声') return v.gender === 'Female';
    return true;
  }).filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = -e.deltaY * 0.001;
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.5), 3.0));
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const renderSidebarContent = () => {
    switch(rightSidebarTab) {
      case 'model':
        return (
          <div className="flex flex-col h-full">
             <div className="p-5 border-b border-white/10 shrink-0 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest"><User size={14}/> 角色模型</div>
                <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                   <input className="w-full bg-[#111] border border-white/10 rounded-lg py-2.5 pl-9 text-xs outline-none focus:border-white/30 text-white" placeholder="搜索形象..." />
                </div>
                <div className="flex gap-4">
                   {['全部', '女', '男', '宠物'].map(tab => (
                      <button key={tab} onClick={()=>setActiveTab(tab)} className={`text-[10px] font-bold uppercase pb-1 border-b-2 transition-all ${activeTab===tab ? 'text-white border-white' : 'text-white/40 border-transparent hover:text-white'}`}>{tab}</button>
                   ))}
                </div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="grid grid-cols-2 gap-3">
                   {is3D ? (
                     // 3D Models
                     MOCK_3D_CHARACTERS.map(char => (
                        <div 
                          key={char.id} 
                          onClick={() => setBaseModel(char.id)}
                          className={`aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group flex flex-col items-center justify-center gap-3 ${baseModel === char.id ? 'border-spark-accent bg-spark-accent/10' : 'border-white/5 hover:border-white/20 bg-[#111]'}`}
                        >
                           <char.icon size={28} className={baseModel === char.id ? 'text-spark-accent' : 'text-white/20 group-hover:text-white/60'} />
                           <span className="text-[10px] font-bold text-white/60">{char.name}</span>
                        </div>
                     ))
                   ) : (
                     // 2D Avatar Models
                     MOCK_CHARACTERS.map(char => (
                        <div 
                          key={char.id} 
                          onClick={() => setBaseModel(char.id)}
                          className={`aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${baseModel === char.id ? 'border-spark-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/5 hover:border-white/20'}`}
                        >
                           <img src={char.src} className="w-full h-full object-cover" />
                           <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black via-black/60 to-transparent">
                              <p className="text-[10px] font-bold text-white truncate text-center">{char.name}</p>
                           </div>
                        </div>
                     ))
                   )}
                </div>
             </div>
          </div>
        );
      case 'accessory':
        return (
          <div className="flex flex-col h-full">
             <div className="p-5 border-b border-white/10 shrink-0 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest"><Glasses size={14}/> 形象配饰</div>
                <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                   <input className="w-full bg-[#111] border border-white/10 rounded-lg py-2.5 pl-9 text-xs outline-none focus:border-white/30 text-white" placeholder="搜索配饰..." />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                   {['全部', 'Top', 'Bottom', 'Shoes', 'Decor'].map(tab => (
                      <button key={tab} onClick={()=>setSelectedAccessoryType(tab)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${selectedAccessoryType===tab ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:text-white'}`}>{tab}</button>
                   ))}
                </div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="grid grid-cols-3 gap-3">
                   {MOCK_ACCESSORIES.filter(a => selectedAccessoryType === '全部' || a.type === selectedAccessoryType).map(acc => (
                      <div key={acc.id} className="aspect-square rounded-xl bg-[#111] border border-white/5 hover:border-white/20 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                         <span className="text-2xl group-hover:scale-110 transition-transform">{acc.icon}</span>
                         <span className="text-[9px] font-medium text-white/40 truncate w-full text-center px-1">{acc.name}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );
      case 'voice':
        return (
          <div className="flex flex-col h-full">
             <div className="p-5 border-b border-white/10 shrink-0 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest"><Mic size={14}/> 音色选择</div>
                
                <div className="space-y-2">
                   <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">语言</label>
                   <div className="w-full bg-[#111] border border-white/10 rounded-lg py-2 px-3 text-xs text-white flex justify-between items-center cursor-pointer">
                      <span>中文</span>
                      <ChevronDown size={12} className="text-white/30"/>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">情绪</label>
                   <div className="grid grid-cols-4 gap-2">
                      {EMOTIONS.map(em => (
                        <div key={em.id} className="flex flex-col items-center gap-1 cursor-pointer group">
                           <img src={em.img} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-white/40 transition-all bg-black" />
                           <span className="text-[9px] text-white/40 group-hover:text-white">{em.label}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="relative group mt-2">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                   <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg py-2.5 pl-9 text-xs outline-none focus:border-white/30 text-white" placeholder="搜索音色..." />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">性别</label>
                   <div className="flex bg-[#111] rounded-lg p-0.5 border border-white/5">
                      {['全部', '男声', '女声'].map(g => (
                         <button key={g} onClick={()=>setSelectedVoiceGender(g)} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all ${selectedVoiceGender===g ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}>{g}</button>
                      ))}
                   </div>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {filteredVoices.map(voice => (
                   <div key={voice.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group">
                      <div 
                        onClick={() => playVoice(voice)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${currentVoice?.id === voice.id && isPlaying ? 'bg-spark-accent text-white' : 'bg-[#222] text-white/40 hover:text-white hover:bg-[#333]'}`}
                      >
                         {currentVoice?.id === voice.id && isPlaying ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor" className="ml-0.5"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="text-[11px] font-bold text-white truncate">{voice.name}</div>
                         <div className="text-[9px] text-white/30 truncate">{voice.tags.join(', ')}</div>
                      </div>
                      {currentVoice?.id === voice.id && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>}
                   </div>
                ))}
             </div>
          </div>
        );
      case 'background':
        return (
          <div className="flex flex-col h-full">
             <div className="p-5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest"><ImageIcon size={14}/> BACKGROUND</div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="grid grid-cols-2 gap-3">
                   {MOCK_BACKGROUNDS.map(bg => (
                      <div 
                        key={bg.id} 
                        onClick={() => setSelectedBackground(bg.id)}
                        className={`aspect-video rounded-lg border-2 overflow-hidden cursor-pointer relative transition-all ${selectedBackground === bg.id ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-transparent hover:border-white/20'}`}
                      >
                         {bg.type === 'color' ? (
                            <div className="w-full h-full" style={{ backgroundColor: bg.color }}></div>
                         ) : (
                            <img src={bg.src} className="w-full h-full object-cover" />
                         )}
                         <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm py-1 px-2">
                            <span className="text-[9px] font-bold text-white block text-center truncate">{bg.name}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0a] text-white pt-0">
      {/* Top Header - In Studio Only */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0 z-50">
        <div className="flex items-center gap-4 relative" ref={moduleMenuRef}>
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg"><ArrowLeft size={18}/></button>
          
          <div className="relative">
            <button 
              onClick={() => setShowModuleMenu(!showModuleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-all group"
            >
              <h2 className="text-sm font-bold tracking-widest uppercase">{currentModuleLabel}</h2>
              <ChevronDown size={14} className={`text-white/50 group-hover:text-white transition-transform duration-300 ${showModuleMenu ? 'rotate-180' : ''}`} />
            </button>

            {showModuleMenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-[100] animate-in fade-in slide-in-from-top-2">
                {dhModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onChangeModule(m.id);
                      setShowModuleMenu(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-between ${module === m.id ? 'text-spark-accent bg-white/5' : 'text-white/70'}`}
                  >
                    {m.label}
                    {module === m.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 whitespace-nowrap">
            <Save size={14}/> 保存设置
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
          {/* Ratio Selector */}
          <div className="absolute top-4 left-6 z-20">
            <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-[10px] font-bold">
              <Monitor size={14} /> 尺寸: {aspectRatio} <ChevronDown size={12}/>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 relative">
             <div 
               className="relative border-2 border-white/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] bg-[#111]"
               style={{ aspectRatio: '2/3', height: '80%' }}
               onWheel={handleWheel}
             >
               {(is3D || is2DAvatar) ? (
                 <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background Layer */}
                    <div className="absolute inset-0 z-0">
                       {(() => {
                          const bg = MOCK_BACKGROUNDS.find(b => b.id === selectedBackground);
                          if (!bg) return <div className="w-full h-full bg-[#111]"/>;
                          if (bg.type === 'color') return <div className="w-full h-full" style={{ backgroundColor: bg.color }} />;
                          return <img src={bg.src} className="w-full h-full object-cover" />;
                       })()}
                    </div>
                    
                    {/* Character Layer */}
                    <div 
                      className="relative z-10 flex flex-col items-center justify-center gap-4 w-full h-full transition-transform duration-75 ease-out"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                        {is3D ? (
                           <>
                              <User size={120} className="text-white drop-shadow-2xl" />
                              <span className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">{MOCK_3D_CHARACTERS.find(c=>c.id===baseModel)?.name || "Ganyu Style"}</span>
                              <span className="text-[10px] text-white/80 opacity-80 uppercase tracking-widest mt-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">3D Avatar Model</span>
                           </>
                        ) : (
                           <img 
                             src={MOCK_CHARACTERS.find(c=>c.id===baseModel)?.src || MOCK_CHARACTERS[0].src} 
                             className="h-full w-auto object-contain drop-shadow-2xl" 
                           />
                        )}
                    </div>
                 </div>
               ) : (
                 <img 
                   src={MOCK_CHARACTERS.find(c=>c.id===baseModel)?.src || MOCK_CHARACTERS[0].src} 
                   className="w-full h-full object-cover transition-transform duration-75 ease-out"
                   style={{ transform: `scale(${zoomLevel})` }} 
                 />
               )}
               {isCallActive && <div className="absolute inset-0 ring-4 ring-green-500/50 animate-pulse pointer-events-none" />}
             </div>

             {/* Canvas Zoom Controls */}
             <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                <div className="flex flex-col gap-1 p-1 bg-black/40 border border-white/10 rounded-lg">
                   <button onClick={handleZoomIn} className="p-1.5 hover:bg-white/10 rounded"><ZoomIn size={16}/></button>
                   <button onClick={handleZoomOut} className="p-1.5 hover:bg-white/10 rounded"><ZoomOut size={16}/></button>
                </div>
                <div className="flex flex-col gap-1 p-1 bg-black/40 border border-white/10 rounded-lg">
                   <button onClick={handleResetZoom} className="p-1.5 hover:bg-white/10 rounded"><RefreshCcw size={16}/></button>
                </div>
             </div>
          </div>

          {/* Bottom Toolbar & Input */}
          <div className="h-[200px] bg-[#0c0c0c] border-t border-white/10 flex flex-col shrink-0 relative z-30">
             {/* Icons Row */}
             <div className="h-14 flex items-center px-4 border-b border-white/5 gap-1 overflow-x-auto no-scrollbar">
                {TOOLBAR_ITEMS.map(item => (
                  <button key={item.id} className="flex flex-col items-center justify-center min-w-[60px] h-full hover:bg-white/5 rounded-lg transition-all group px-2">
                     <item.icon size={18} className="text-white/60 group-hover:text-white" />
                     <span className="text-[10px] mt-1 text-white/40 group-hover:text-white whitespace-nowrap">{item.label}</span>
                  </button>
                ))}
                {(module === AppModule.DH_CHAT || module === AppModule.DH_3D || module === AppModule.DH_AVATAR) && (
                   <button 
                     onClick={() => setIsCallActive(!isCallActive)}
                     className={`ml-auto h-9 px-6 rounded-full border flex items-center gap-2 font-bold text-xs whitespace-nowrap transition-all ${isCallActive ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-green-500/10 border-green-500 text-green-400'}`}
                   >
                     {isCallActive ? <PhoneOff size={14}/> : <Phone size={14}/>}
                     {isCallActive ? '结束对话' : '开始对话'}
                   </button>
                )}
             </div>
             {/* Text Area Row */}
             <div className="flex-1 flex p-4 gap-4 relative">
                <textarea 
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={module === AppModule.DH_AUDIO ? "输入想要数字人播报的内容..." : "输入消息或按住说话..."}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-white/80 placeholder:text-white/20 custom-scrollbar"
                />
             </div>
             {/* Action Row */}
             <div className="h-10 border-t border-white/5 flex items-center justify-between px-4 bg-black/20">
                <button className="p-1 text-white/20 hover:text-red-400"><Trash2 size={16}/></button>
                <div className="flex items-center gap-4">
                   <button className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-all whitespace-nowrap"><Mic size={14}/> 语音输入</button>
                   {module === AppModule.DH_AUDIO ? (
                      <button className="px-6 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold shadow-lg whitespace-nowrap">开始朗读</button>
                   ) : (
                      <button className="px-6 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">发送 <Send size={12}/></button>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar - Logic Switching */}
        {useAdvancedSidebar ? (
          <aside className="w-[360px] h-full flex bg-[#020204] border-l border-white/10 shrink-0">
             {/* Dynamic Content Panel */}
             <div className="flex-1 flex flex-col bg-[#050505] border-r border-white/5">
                {renderSidebarContent()}
             </div>

             {/* Right Nav Strip */}
             <div className="w-[60px] flex flex-col items-center py-6 gap-6 bg-[#080808] shrink-0">
                <button onClick={() => setRightSidebarTab('model')} className={`p-3 rounded-xl transition-all ${rightSidebarTab==='model' ? 'bg-spark-accent text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}><User size={20}/></button>
                {/* Accessories tab only for 3D */}
                {is3D && (
                  <button onClick={() => setRightSidebarTab('accessory')} className={`p-3 rounded-xl transition-all ${rightSidebarTab==='accessory' ? 'bg-spark-accent text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}><Glasses size={20}/></button>
                )}
                <button onClick={() => setRightSidebarTab('voice')} className={`p-3 rounded-xl transition-all ${rightSidebarTab==='voice' ? 'bg-spark-accent text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}><Mic size={20}/></button>
                <button onClick={() => setRightSidebarTab('background')} className={`p-3 rounded-xl transition-all ${rightSidebarTab==='background' ? 'bg-spark-accent text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}><ImageIcon size={20}/></button>
                <button onClick={() => setRightSidebarTab('folder')} className={`p-3 rounded-xl transition-all ${rightSidebarTab==='folder' ? 'bg-spark-accent text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}><FolderOpen size={20}/></button>
             </div>
          </aside>
        ) : (
          /* Default Sidebar for 2D Audio/Chat */
          <aside className="w-80 border-l border-white/10 flex flex-col bg-black/40 backdrop-blur-xl">
             <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-widest"><User size={14}/> 角色模型</div>
                <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                   <input className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 text-xs outline-none focus:border-white/30" placeholder="搜索形象名..." />
                </div>
                <div className="flex gap-4 border-b border-white/5 pb-2">
                   {['全部', '女', '男', '宠物'].map(tab => (
                      <button key={tab} onClick={()=>setActiveTab(tab)} className={`text-xs font-bold uppercase pb-1 border-b-2 transition-all ${activeTab===tab ? 'text-white border-white' : 'text-white/40 border-transparent hover:text-white'}`}>{tab}</button>
                   ))}
                </div>
                <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-1 max-h-[calc(100vh-280px)]">
                   {MOCK_CHARACTERS.map(char => (
                      <div 
                        key={char.id} 
                        onClick={() => setBaseModel(char.id)}
                        className={`aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${baseModel === char.id ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-white/5 hover:border-white/20 bg-black/40'}`}
                      >
                         <div className="w-full h-full relative">
                            <img src={char.src} className="w-full h-full object-cover transition-transform duration-500" />
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black via-black/40 to-transparent">
                               <p className="text-[9px] font-bold text-white truncate text-center">{char.name}</p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="mt-auto p-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex gap-2">
                   <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold hover:bg-white/10 uppercase tracking-widest whitespace-nowrap"><Sword size={14} className="inline mr-1"/> 道具库</button>
                   <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold hover:bg-white/10 uppercase tracking-widest whitespace-nowrap"><Sparkles size={14} className="inline mr-1"/> 动态库</button>
                </div>
             </div>
          </aside>
        )}
      </div>
    </div>
  );
}