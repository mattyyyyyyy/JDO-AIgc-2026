import React, { useState, useEffect } from 'react';
import Landing from './pages/digital-human/Landing';
import Studio from './components/Studio';
import Navbar from './components/Navbar';
import CursorSystem from './components/CursorSystem';

// AI Voice Module Components
import Home from './pages/voice/Home';
import ASR from './pages/voice/ASR';
import TTS from './pages/voice/TTS';
import VoiceCloning from './pages/voice/VoiceCloning';
import Diarization from './pages/voice/Diarization'; 
import LiveChat from './pages/voice/LiveChat';
import VoiceLibrary from './pages/voice/VoiceLibrary';
import VoiceSidebar from './pages/voice/components/VoiceSidebar';
import VoicePlayer from './pages/voice/components/VoicePlayer';

// Prompt Engine Module Components
import PromptDiscover from './pages/prompts/PromptDiscover';
import PromptFavorites from './pages/prompts/PromptFavorites';
import PromptMine from './pages/prompts/PromptMine';
import PromptCreate from './pages/prompts/PromptCreate';

import { PlayerProvider, usePlayer } from './contexts/PlayerContext';
import { TTSProvider } from './contexts/TTSContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { Page, AppModule, Asset } from './types';

const AppContent: React.FC = () => {
  // Global Navigation State
  const [activeTab, setActiveTab] = useState<'digital-human' | 'ai-voice' | 'prompt-engine'>('digital-human');
  
  // Digital Human State
  const [currentDHModule, setCurrentDHModule] = useState<AppModule | null>(null);
  
  // AI Voice & Prompt State
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  
  // Global Data State
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const { setLang: setCtxLang } = useLanguage();

  useEffect(() => {
    setCtxLang(lang === 'zh' ? 'CN' : 'EN');
  }, [lang, setCtxLang]);

  const [savedAssets, setSavedAssets] = useState<Asset[]>([]);
  
  const { closePlayer } = usePlayer();

  // Mock translation object for App level
  const t = {
    heroTitle: "Make Cars Smarter",
    heroSubtitle: "重新定义美学创造",
    features: ["2D 对口型", "2D 实时对话", "2D 虚拟化身", "3D 虚拟化身"],
    studio: {
      dialog: { title: "更换模型", desc: "确定要更换当前模型吗？", confirm: "确定", cancel: "取消", tip: "提示", callWarning: "请先结束当前通话" },
      controls: { voiceCall: "开始对话", endCall: "结束对话", chatPlaceholder: "输入消息或按住说话...", drivePlaceholder: "输入想要数字人播报的内容...", generating: "生成中", generate: "开始朗读", cancelVoice: "取消" },
      assets: { models: "角色模型", tabs: { female: "女", male: "男", pet: "宠物" } }
    }
  };

  // Background Management Effect
  useEffect(() => {
    const bgElement = document.getElementById('global-bg-image');
    const overlay = document.getElementById('global-bg-overlay');
    
    if (bgElement && overlay) {
      if (activeTab === 'prompt-engine') {
        bgElement.style.opacity = "1";
        bgElement.style.backgroundImage = "url('https://github.com/mattyyyyyyy/picture2bed/blob/main/%E6%A9%99%E7%B2%89%E7%B3%BB%E6%8A%BD%E8%B1%A1%E5%9B%BE1.jpg?raw=true')";
        overlay.style.backgroundColor = "rgba(0,0,0,0.15)";
      } else if (activeTab === 'digital-human') {
        // Digital Human uses its own background rendering or dark mode
        bgElement.style.opacity = "0"; 
        overlay.style.backgroundColor = "rgba(0,0,0,0.5)"; 
      } else {
        // AI Voice Default
        bgElement.style.opacity = "1";
        bgElement.style.backgroundImage = "url('https://github.com/mattyyyyyyy/picture2bed/blob/main/%E8%93%9D%E8%89%B2%E7%A7%91%E6%8A%80%E6%84%9F%E6%8A%BD%E8%B1%A1%E5%9B%BE1.png?raw=true')";
        overlay.style.backgroundColor = "rgba(0,0,0,0.15)";
      }
    }
  }, [activeTab]);

  // Tab switching logic
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
    closePlayer(); // Stop audio when switching modules
    if (tabId === 'digital-human') {
      setCurrentDHModule(null);
    } else if (tabId === 'prompt-engine') {
      setCurrentPage(Page.PROMPT_DISCOVER);
    } else {
      setCurrentPage(Page.HOME);
    }
  };

  const handleSaveAsset = (asset: Asset) => {
    setSavedAssets(prev => [asset, ...prev]);
  };

  // Renderers
  const renderAiVoiceModule = () => {
    const renderSubPage = () => {
      switch (currentPage) {
        case Page.HOME: return <Home onNavigate={setCurrentPage} />;
        case Page.ASR: return <ASR />;
        case Page.TTS: return <TTS />;
        case Page.VOICE_CLONING: return <VoiceCloning />;
        case Page.VOICEPRINT: return <Diarization />; 
        case Page.LIVE_CHAT: return <LiveChat />;
        case Page.PRESET:
        case Page.CUSTOM:
          return <VoiceLibrary onNavigate={setCurrentPage} initialTab={currentPage} />;
        default: return <Home onNavigate={setCurrentPage} />;
      }
    };

    return (
      <div className="flex h-full w-full pt-16 md:pt-20">
        <VoiceSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 ml-72 px-8 pb-8 h-full overflow-hidden hidden md:block">
          {renderSubPage()}
        </main>
        {/* Mobile View Placeholder or simplified list */}
        <main className="flex-1 px-4 pb-4 h-full overflow-hidden block md:hidden pt-4">
           {renderSubPage()}
        </main>
        <VoicePlayer />
      </div>
    );
  };

  const renderPromptModule = () => {
    const renderSubPage = () => {
      switch (currentPage) {
        case Page.PROMPT_DISCOVER: return <PromptDiscover />;
        case Page.PROMPT_FAVORITES: return <PromptFavorites onNavigate={setCurrentPage} />;
        case Page.PROMPT_MINE: return <PromptMine onNavigate={setCurrentPage} />;
        case Page.PROMPT_CREATE: return <PromptCreate onNavigate={setCurrentPage} />;
        default: return <PromptDiscover />;
      }
    };

    return (
      <div className="flex h-full w-full pt-16 md:pt-20">
        {/* Note: PromptDiscover includes its own Sidebar, but for consistent layout we might want a PromptSidebar wrapper here if PromptDiscover was just content. 
            However, looking at PromptDiscover code, it has the Sidebar built-in. 
            For Favorites/Mine/Create, we might need navigation. 
            Let's use the PromptDiscover for main view and wrap others. */}
        {currentPage === Page.PROMPT_DISCOVER ? (
           <main className="w-full h-full">
             <PromptDiscover />
           </main>
        ) : (
           <main className="w-full h-full px-4 md:px-8 pt-4">
             {renderSubPage()}
           </main>
        )}
      </div>
    );
  };

  // Determine if Navbar should be hidden (only in DH sub-pages)
  const isDHStudio = activeTab === 'digital-human' && currentDHModule !== null;

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden">
      
      {!isDHStudio && (
        <Navbar 
          lang={lang} 
          setLang={setLang} 
          t={t} 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      {activeTab === 'digital-human' && (
        <main className={`relative z-10 w-full h-full ${!isDHStudio ? 'pt-0' : 'pt-0'}`}>
          {!currentDHModule ? (
            <Landing onSelectModule={setCurrentDHModule} />
          ) : (
            <Studio 
              module={currentDHModule}
              onChangeModule={setCurrentDHModule}
              lang={lang === 'zh' ? 'CN' : 'EN'}
              setLang={() => {}}
              onBack={() => setCurrentDHModule(null)}
              onOpenSettings={() => {}}
              savedAssets={savedAssets}
              onSaveAsset={handleSaveAsset}
              t={t}
            />
          )}
        </main>
      )}

      {activeTab === 'ai-voice' && renderAiVoiceModule()}
      {activeTab === 'prompt-engine' && renderPromptModule()}

      {/* Put CursorSystem last to ensure highest stacking order in the DOM */}
      <CursorSystem />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ModuleProvider>
        <PlayerProvider>
          <VoiceProvider>
            <TTSProvider>
              <AppContent />
            </TTSProvider>
          </VoiceProvider>
        </PlayerProvider>
      </ModuleProvider>
    </LanguageProvider>
  );
};

export default App;